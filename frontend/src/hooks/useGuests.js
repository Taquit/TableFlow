import { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
import { apiCall } from '../utils/apiCall';
export function useGuests(eventId, tableId) {

    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eventId) return;
        const fetchGuests = async () => {
            setLoading(true);
            try {
                const response = await apiCall(`${API_URL}/guests/table/${tableId}/event/${eventId}`);
                if (!response.ok) {
                    throw new Error('Error fetching guests');
                }
                const data = await response.json();
                if (data.success) {
                    setGuests(data.guests);
                } else {
                    throw new Error(data.message || 'Error fetching guests from API');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGuests();
    }, [eventId, tableId]);

    const createGuestForTable = async (guestData) => {
        try {
            const response = await apiCall(`${API_URL}/guests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guestData)
            });
            const data = await response.json();
            if (data.success) {
                setGuests(prev => [...prev, data.guest]);
                return { success: true, guest: data.guest };
            } else {
                return { success: false, error: data.message || 'Error al crear invitado' };
            }
        } catch (err) {
            return { success: false, error: 'Error de red al conectar con el servidor.' };
        }
    };

    const updateGuestData = async (guestId, guestData) => {
        try {
            const response = await apiCall(`${API_URL}/guests/${guestId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guestData)
            });
            const data = await response.json();
            if (data.success) {
                setGuests(prev => prev.map(g => g.id === guestId ? data.guest : g));
                return { success: true, guest: data.guest };
            } else {
                return { success: false, error: data.message || 'Error al actualizar invitado' };
            }
        } catch (err) {
            return { success: false, error: 'Error de red al conectar con el servidor.' };
        }
    };

    const removeGuest = async (guestId) => {
        try {
            const response = await apiCall(`${API_URL}/guests/${guestId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setGuests(prev => prev.filter(g => g.id !== guestId));
                return { success: true };
            } else {
                return { success: false, error: data.message || 'Error al eliminar invitado' };
            }
        } catch (err) {
            return { success: false, error: 'Error de red.' };
        }
    };

    return { guests, loading, error, createGuestForTable, updateGuestData, removeGuest };
}