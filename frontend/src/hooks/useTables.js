import { useState, useEffect } from 'react'
const API_URL = 'http://localhost:4000/api';

export function useTables(eventId) {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eventId) return;
        const fetchTables = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/tables/event/${eventId}`);
                if (!response.ok) {
                    throw new Error('Error fetching tables');
                }
                const data = await response.json();
                if (data.success) {
                    setTables(data.tables);
                } else {
                    throw new Error(data.message || 'Error fetching tables from API');
                }


            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }


        }
        fetchTables();
    }, [eventId])

    return { tables, loading, error };
}