import { useState, useEffect } from 'react';
const API_URL = 'http://localhost:4000/api';


export function useEvent(){
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchEvents = async()=>{
            try{
                setLoading(true);
                const response = await fetch(`${API_URL}/events`);
                if(!response.ok){
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                if(data.succes){
                    setEvents(data.events);
                }else{
                    throw new Error(data.message || 'Failed to fetch events from API');
                } 
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }
        fetchEvents();
    },[])
    

    const createNewEvent = async (eventData) => {
        try {
            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });
            const data = await response.json();
            if (data.success) {
                // Actualizar la lista de eventos localmente
                setEvents(prev => [...prev, data.event]);
                return { success: true, event: data.event };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: 'Error de red al conectar con el servidor.' };
        }
    };

    const updateExistingEvent = async (id, eventData) => {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });
            const data = await response.json();
            if (data.success) {
                // Actualizar la lista localmente
                setEvents(prev => prev.map(ev => ev.id === parseInt(id) ? data.event : ev));
                return { success: true, event: data.event };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: 'Error de red al conectar con el servidor.' };
        }
    };

    const deleteExistingEvent = async (id) => {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                // Remove from local list
                setEvents(prev => prev.filter(ev => ev.id !== parseInt(id)));
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: 'Error de red al conectar con el servidor.' };
        }
    };

    return { events, loading, error, createNewEvent, updateExistingEvent, deleteExistingEvent };
}
