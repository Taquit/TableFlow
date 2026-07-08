import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        const event = await prisma.event.findUnique({ where: { id: id } });
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
        const event = await prisma.event.delete({ where: { id: id } });
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
        const { name, date, time, location } = request.body;
        const event = await prisma.event.create({ data: { name, date, time, location } });
        response.json({ success: true, event });
    } catch (error) {
        response.status(500).json({ success: false, error: 'Error creating event from database' });
    }
};

//Update event
export const updateEvent = async (request, response) => {
    try {
        const { id } = request.params;
        const { name, date, time, location } = request.body;
        const event = await prisma.event.update({ where: { id: id }, data: { name, date, time, location } });
        if (!event) {
            response.status(404).json({ success: false, error: 'Event not found' });
            return;
        }
        response.json({ success: true, event });
    } catch (error) {
        response.status(500).json({ success: false, error: 'Error updating event from database' });
    }
};

