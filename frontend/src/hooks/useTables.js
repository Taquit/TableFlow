import { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
import { apiCall } from '../utils/apiCall';

export function useTables(eventId) {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eventId) return;
        const fetchTables = async () => {
            setLoading(true);
            try {
                const response = await apiCall(`${API_URL}/tables/event/${eventId}`);
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

    const deleteTable = async (tableId) => {
        try {
            const response = await apiCall(`${API_URL}/tables/${tableId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setTables(prev => prev.filter(t => t.id !== parseInt(tableId)));
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Error de red al eliminar la mesa' };
        }
    };

    return { tables, loading, error, deleteTable };
}