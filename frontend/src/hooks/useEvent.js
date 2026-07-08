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
    

    return { events, loading, error };
}
