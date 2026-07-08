import { useState } from 'react';

export function CreateEvent() {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    return (
        <section id='createEvent'>
            <h1>Crear evento</h1>
            <div>
                <form action="post">
                    <label htmlFor="eventName">Nombre del evento</label>
                    <input type="text" id="eventName" name="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                    <button type="submit">Crear evento</button>
                </form>

            </div>
        </section>
    )
}