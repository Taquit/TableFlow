const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
import { apiCall } from '../utils/apiCall';


export const getEvents = async () => {
    const response = await apiCall(`${API_URL}/events`);
    if (!response.ok) {
        throw new Error('Error al obtener los eventos');
    }
    const data = await response.json();
    if (data.succes)
        return response.json();
}

export const getTables = async () => {
    const response = await apiCall(`${API_URL}/tables`);
    if (!response.ok) {
        throw new Error('Error al obtener las mesas');
    }
    return response.json();
}

export const getGuests = async () => {
    const response = await apiCall(`${API_URL}/guests`);
    if (!response.ok) {
        throw new Error('Error al obtener los invitados');
    }
    return response.json();
}