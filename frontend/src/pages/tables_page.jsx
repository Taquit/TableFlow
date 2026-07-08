import { useState } from 'react';
import Tables from '../component/tables.jsx';
import { useEvent } from '../hooks/useEvent.js';
import '../css/tables_page.css';
export function TablesPage() {
    const { events, loading, error } = useEvent();
    const [selectedEventId, setSelectedEventId] = useState("");
    const [manageEventId, setManageEventId] = useState(null);
    if (loading) {
        return (
            <div className="main">
                <div className="demo-card glass-effect tables-page-card tables-page-card-loading">
                    <h3 className="tables-page-card-title"> Cargando eventos...</h3>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="main">
                <div className="demo-card glass-effect tables-page-card tables-page-card-error">
                    <h3 className="tables-page-card-title tables-page-card-title-error"> Error de conexión</h3>
                    <p className="tables-page-card-desc">{error}</p>
                </div>
            </div>
        );
    }
    if (events.length === 0) {
        return (
            <div className="main">
                <div className="demo-card glass-effect tables-page-card tables-page-card-empty">
                    <h3 className="tables-page-card-title"> No hay eventos disponibles</h3>
                    <p className="tables-page-card-desc tables-page-card-desc-empty">
                        Aún no has creado ningún evento. Dirígete a la pestaña de <strong>Gestión Eventos</strong> para crear uno antes de gestionar las mesas.
                    </p>
                </div>
            </div>
        );
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