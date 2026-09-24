import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../utils/apiCall';

const API_URL = import.meta.env.BACKEND_API || 'http://localhost:4000/api';

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCall(`${API_URL}/users`);
            const data = await response.json();
            if (!response.ok || data.error) {
                throw new Error(data.error || data.message || 'Error al obtener los usuarios');
            }
            const userList = Array.isArray(data) ? data : (data.users || []);
            setUsers(userList);
            return { success: true, users: userList };
        } catch (err) {
            const errMsg = err.message || 'Error de conexion con el servidor';
            setError(errMsg);
            return { success: false, error: errMsg };
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const createUser = async ({ username, password, role }) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                username,
                password,
                role: role || 'ADMIN'
            };
            const response = await apiCall(`${API_URL}/users`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok || data.error) {
                const errMsg = data.error || data.message || 'Error al crear el usuario';
                setError(errMsg);
                return { success: false, error: errMsg };
            }
            await fetchUsers();
            return { success: true, user: data.user || data };
        } catch (err) {
            const errMsg = err.message || 'Error de red al conectar con el servidor';
            setError(errMsg);
            return { success: false, error: errMsg };
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCall(`${API_URL}/users/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (!response.ok || data.error) {
                const errMsg = data.error || data.message || 'Error al eliminar el usuario';
                setError(errMsg);
                return { success: false, error: errMsg };
            }
            await fetchUsers();
            return { success: true, data };
        } catch (err) {
            const errMsg = err.message || 'Error de red al conectar con el servidor';
            setError(errMsg);
            return { success: false, error: errMsg };
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        deleteUser
    };
}

export default useUsers;
