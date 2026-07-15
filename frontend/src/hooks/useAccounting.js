import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
import { apiCall } from '../utils/apiCall';

export const useAccounting = (eventId) => {
    const [accountingData, setAccountingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eventId) {
            setAccountingData(null);
            return;
        }

        const fetchAccounting = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiCall(`${API_URL}/events/${eventId}/accounting`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos contables');
                }
                const data = await response.json();
                if (data.success) {
                    setAccountingData({
                        totalCollected: data.totalCollected,
                        tablesData: data.tablesData,
                        unassignedCollected: data.unassignedCollected
                    });
                } else {
                    throw new Error(data.error || 'Error al obtener los datos contables');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounting();
    }, [eventId]);

    return { accountingData, loading, error };
};
