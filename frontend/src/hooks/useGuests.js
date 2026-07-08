import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:4000/api';

export function useGuests(eventId) {

    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getGuests = async () => {
        setLoading(true);
        try {
            const response = await fetch
        }
    }
}