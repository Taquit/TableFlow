import { useState } from 'react';
import Tables from '../component/tables.jsx';
import { useEvent } from '../hooks/useEvent.js';
export function TablesPage() {
    const { events, loading, error } = useEvent();
    const [selectedEventId, setSelectedEventId] = useState("");
    const [manageEventId, setManageEventId] = useState(null);
    if (loading) {
        return <p>Cargando eventos...</p>;
    }
    if (error) {
        return <p>Error al cargar eventos: {error}</p>;
    }
    if (events.length === 0) {
        return <p>No hay eventos disponibles.</p>;
    }
    return (
        <div className='main'>
            <h1>Gestion de mesas</h1>
            <p>Eliga un evento para gestionar sus mesas</p>
            <div className="form-group">
                <label className="form-label">Evento</label>
                <div className="select-wrapper">
                    <select className="custom-select" value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
                        <option value="">Seleccione un evento</option>
                        {events.map(event => <option key={event.id} value={event.id}>{event.eventName}</option>)}
                    </select>
                </div>
            </div>
            <button className='btn-primary' onClick={() => setManageEventId(selectedEventId)} disabled={!selectedEventId}>Gestionar</button>
            {manageEventId && <Tables eventId={manageEventId} />}
        </div>
    );
}
export default TablesPage;