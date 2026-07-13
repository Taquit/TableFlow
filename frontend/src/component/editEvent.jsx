import { useState, useEffect } from 'react';
import { useEvent } from '../hooks/useEvent';
import '../css/createEvent.css';

export function EditEvent() {
    const { events, loading, updateExistingEvent, deleteExistingEvent } = useEvent();
    
    const [selectedEventId, setSelectedEventId] = useState('');
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [numTable, setNumTable] = useState('');
    const [numGuest, setNumGuest] = useState('');
    const [ticketCost, setTicketCost] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (selectedEventId) {
            const eventObj = events.find(e => e.id === parseInt(selectedEventId));
            if (eventObj) {
                setName(eventObj.eventName);
                if (eventObj.date) {
                    const d = new Date(eventObj.date);
                    setDate(d.toISOString().split('T')[0]);
                    setTime(d.toISOString().split('T')[1].substring(0, 5));
                }
                setLocation(eventObj.location || '');
                setNumTable(eventObj.numTable || '');
                setNumGuest(eventObj.numGuest || '');
                setTicketCost(eventObj.ticketCost || '');
                setStatus({ type: '', message: '' });
            }
        }
    }, [selectedEventId, events]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEventId) return;

        setStatus({ type: 'loading', message: 'Actualizando evento...' });

        const result = await updateExistingEvent(selectedEventId, { name, date, time, location, numTable, numGuest, ticketCost });

        if (result.success) {
            setStatus({ type: 'success', message: '¡Evento actualizado con éxito!' });
            setTimeout(() => {
                setStatus({ type: '', message: '' });
                setSelectedEventId('');
            }, 2000);
        } else {
            setStatus({ type: 'error', message: `Error: ${result.error}` });
        }
    };

    const handleDelete = async () => {
        if (!selectedEventId) return;
        
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer y eliminará todas las mesas y asistentes asociados.');
        if (!confirmDelete) return;

        setStatus({ type: 'loading', message: 'Eliminando evento...' });

        const result = await deleteExistingEvent(selectedEventId);

        if (result.success) {
            setStatus({ type: 'success', message: '¡Evento eliminado con éxito!' });
            setTimeout(() => {
                setStatus({ type: '', message: '' });
                setSelectedEventId('');
            }, 2000);
        } else {
            setStatus({ type: 'error', message: `Error: ${result.error}` });
        }
    };

    if (loading) {
        return (
            <section className="create-event-section">
                <div className="create-event-card">
                    <h3 className="create-event-title" style={{textAlign: 'center'}}>⏳ Cargando eventos...</h3>
                </div>
            </section>
        );
    }

    if (events.length === 0) {
        return (
            <section className="create-event-section">
                <div className="create-event-card">
                    <h3 className="create-event-title" style={{textAlign: 'center'}}>📭 No hay eventos para editar</h3>
                </div>
            </section>
        );
    }

    return (
        <section className="create-event-section">
            <div className="create-event-card">
                <div className="create-event-header">
                    <h3 className="create-event-title">Editar Evento</h3>
                </div>

                <div className="create-event-form" style={{ marginBottom: selectedEventId ? '30px' : '0' }}>
                    <div className="create-event-group">
                        <label className="form-label">Selecciona el evento a editar</label>
                        <select 
                            className="custom-input" 
                            value={selectedEventId} 
                            onChange={(e) => setSelectedEventId(e.target.value)}
                        >
                            <option value="">-- Elige un evento --</option>
                            {events.map(event => (
                                <option key={event.id} value={event.id}>{event.eventName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedEventId && (
                    <form onSubmit={handleSubmit} className="create-event-form" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
                        <div className="create-event-group">
                            <label className="form-label">Nombre del evento *</label>
                            <input
                                type="text"
                                className="custom-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="create-event-row">
                            <div className="create-event-group">
                                <label className="form-label">Fecha *</label>
                                <input
                                    type="date"
                                    className="custom-input"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="create-event-group">
                                <label className="form-label">Hora</label>
                                <input
                                    type="time"
                                    className="custom-input"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="create-event-row">
                            <div className="create-event-group">
                                <label className="form-label">N° de Mesas</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="custom-input"
                                    value={numTable}
                                    onChange={(e) => setNumTable(e.target.value)}
                                />
                            </div>
                            <div className="create-event-group">
                                <label className="form-label">N° de Invitados</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="custom-input"
                                    value={numGuest}
                                    onChange={(e) => setNumGuest(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="create-event-group">
                            <label className="form-label">Ubicación</label>
                            <input
                                type="text"
                                className="custom-input"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="create-event-group">
                            <label className="form-label">Costo del boleto ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="custom-input"
                                placeholder="Ej. 500.00"
                                value={ticketCost}
                                onChange={(e) => setTicketCost(e.target.value)}
                            />
                        </div>

                        <div className="button-group">
                            <button type="submit" className="create-event-submit-btn" disabled={status.type === 'loading'}>
                                {status.type === 'loading' ? 'Procesando...' : 'Guardar Cambios'}
                            </button>
                            
                            <button type="button" className="create-event-delete-btn" onClick={handleDelete} disabled={status.type === 'loading'}>
                                Eliminar Evento
                            </button>
                        </div>

                        {status.message && (
                            <div className={`create-event-status-message ${status.type === 'error' ? 'create-event-status-error' : status.type === 'success' ? 'create-event-status-success' : ''}`}>
                                {status.message}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </section>
    );
}

export default EditEvent;
