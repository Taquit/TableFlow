import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:4000/api';

export function useGuests(eventId) {

    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eventId) return;
        const fetchGuests = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/guests/event/${eventId}`);
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
    }, [eventId]);

    return { guests, loading, error };
}