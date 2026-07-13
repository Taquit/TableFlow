import prisma from '../prisma.js';

//Get all events
export const getAllEvents = async (request, response) => {
    try {
        const events = await prisma.event.findMany();
        response.json({ succes: true, events });
    } catch (error) {
        response.status(500).json({ success: false, error: 'Error fetching events from database' })
    }
}

//Get event by id
export const getEventById = async (request, response) => {
    try {
        const { id } = request.params;
        const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });
        if (!event) {
            response.status(404).json({ success: false, error: 'Event not found' });
            return;
        }
        response.json({ success: true, event });
    } catch (error) {
        response.status(500).json({ success: false, error: 'Error fetching event from database' });
    }
};

//Delet event
export const deletEventById = async (request, response) => {
    try {
        const { id } = request.params;
        const event = await prisma.event.delete({ where: { id: parseInt(id) } });
        if (!event) {
            response.status(404).json({ success: false, error: 'Event not found' });
            return;
        }
        response.json({ success: true, event });
    } catch (error) {
        response.status(500).json({ success: false, error: 'Error deleting event from database' });
    }
};

//Create event
export const createEvent = async (request, response) => {
    try {
        const { name, date, time, location, numTable, numGuest, ticketCost } = request.body;
        const dateTimeString = time ? `${date}T${time}:00` : `${date}T00:00:00`;
        const eventDate = new Date(dateTimeString);
        
        const dataPayload = { eventName: name, date: eventDate, location };
        const parsedNumTable = numTable !== undefined && numTable !== '' ? parseInt(numTable) : 0;
        const parsedNumGuest = numGuest !== undefined && numGuest !== '' ? parseInt(numGuest) : 0;

        dataPayload.numTable = parsedNumTable;
        dataPayload.numGuest = parsedNumGuest;
        dataPayload.ticketCost = ticketCost !== undefined && ticketCost !== '' ? parseFloat(ticketCost) : 0.0;

        const tablesToCreate = [];
        if (parsedNumTable > 0) {
            const hasGuests = parsedNumGuest > 0;
            const baseSeats = hasGuests ? Math.floor(parsedNumGuest / parsedNumTable) : 8; // 8 es el default del esquema
            const remainder = hasGuests ? parsedNumGuest % parsedNumTable : 0;

            for (let i = 1; i <= parsedNumTable; i++) {
                const seats = i <= remainder ? baseSeats + 1 : baseSeats;
                tablesToCreate.push({ number: i, numSeats: seats });
            }
        }

        if (tablesToCreate.length > 0) {
            dataPayload.tables = {
                create: tablesToCreate
            };
        }

        const event = await prisma.event.create({ 
            data: dataPayload,
            include: {
                tables: true
            }
        });
        response.json({ success: true, event });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: 'Error creating event from database' });
    }
};

//Update event
export const updateEvent = async (request, response) => {
    try {
        const { id } = request.params;
        const { name, date, time, location, numTable, numGuest, ticketCost } = request.body;
        const dateTimeString = time ? `${date}T${time}:00` : `${date}T00:00:00`;
        const eventDate = new Date(dateTimeString);

        const dataPayload = { eventName: name, date: eventDate, location };
        if (numTable !== undefined && numTable !== '') dataPayload.numTable = parseInt(numTable);
        if (numGuest !== undefined && numGuest !== '') dataPayload.numGuest = parseInt(numGuest);
        if (ticketCost !== undefined && ticketCost !== '') dataPayload.ticketCost = parseFloat(ticketCost);

        const event = await prisma.event.update({ 
            where: { id: parseInt(id) }, 
            data: dataPayload 
        });

        if (numTable !== undefined && numTable !== '') {
            const newNumTable = parseInt(numTable);
            const currentTables = await prisma.table.findMany({
                where: { eventId: parseInt(id) },
                orderBy: { number: 'asc' }
            });
            
            if (newNumTable > currentTables.length) {
                const tablesToCreate = [];
                for (let i = currentTables.length + 1; i <= newNumTable; i++) {
                    tablesToCreate.push({ number: i, numSeats: 8, eventId: parseInt(id) });
                }
                if (tablesToCreate.length > 0) {
                    await prisma.table.createMany({ data: tablesToCreate });
                }
            } else if (newNumTable < currentTables.length) {
                const tablesToDelete = currentTables.slice(newNumTable).map(t => t.id);
                if (tablesToDelete.length > 0) {
                    await prisma.table.deleteMany({ where: { id: { in: tablesToDelete } } });
                }
            }
        }

        if (!event) {
            response.status(404).json({ success: false, error: 'Event not found' });
            return;
        }
        response.json({ success: true, event });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: 'Error updating event from database' });
    }
};

// Get event accounting data
export const getEventAccounting = async (request, response) => {
    try {
        const { id } = request.params;
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: {
                tables: {
                    include: {
                        guests: true
                    },
                    orderBy: { number: 'asc' }
                },
                guests: {
                    where: { tableId: null }
                }
            }
        });
        
        if (!event) {
            response.status(404).json({ success: false, error: 'Event not found' });
            return;
        }

        let totalCollected = 0;
        const tablesData = event.tables.map(table => {
            const tableCollected = table.guests.reduce((sum, guest) => sum + (guest.amountPaid || 0), 0);
            totalCollected += tableCollected;
            return {
                id: table.id,
                number: table.number,
                collected: tableCollected,
                guestsCount: table.guests.length
            };
        });
        
        const unassignedCollected = event.guests.reduce((sum, guest) => sum + (guest.amountPaid || 0), 0);
        totalCollected += unassignedCollected;
        
        response.json({ 
            success: true, 
            totalCollected, 
            tablesData, 
            unassignedCollected 
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: 'Error fetching accounting data' });
    }
};

