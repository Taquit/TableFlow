import { useState } from 'react';
import { useEvent } from '../hooks/useEvent';
import { useAuth } from '../hooks/useAuth';
import '../css/createEvent.css';

function EditEventForm({ eventObj, status, onSubmit, onDelete }) {
    const [name, setName] = useState(eventObj.eventName);
    const [date, setDate] = useState(() => eventObj.date ? new Date(eventObj.date).toISOString().split('T')[0] : '');
    const [time, setTime] = useState(() => eventObj.date ? new Date(eventObj.date).toISOString().split('T')[1].substring(0, 5) : '');
    const [location, setLocation] = useState(eventObj.location || '');
    const [numTable, setNumTable] = useState(eventObj.numTable || '');
    const [numGuest, setNumGuest] = useState(eventObj.numGuest || '');
    const [ticketCost, setTicketCost] = useState(eventObj.ticketCost || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, date, time, location, numTable, numGuest, ticketCost });
    };

    return (
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
            <p className="create-event-hint">
                Estos valores son de referencia y no crean ni eliminan mesas automáticamente; gestiona las mesas desde la sección de Gestión de Mesas.
            </p>

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

                <button type="button" className="create-event-delete-btn" onClick={onDelete} disabled={status.type === 'loading'}>
                    Eliminar Evento
                </button>
            </div>

            {status.message && (
                <div className={`create-event-status-message ${status.type === 'error' ? 'create-event-status-error' : status.type === 'success' ? 'create-event-status-success' : ''}`}>
                    {status.message}
                </div>
            )}
        </form>
    );
}

export function EditEvent() {
    const { events, loading, updateExistingEvent, deleteExistingEvent } = useEvent();
    const { user } = useAuth();

    const [selectedEventId, setSelectedEventId] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (formData) => {
        if (!selectedEventId) return;

        setStatus({ type: 'loading', message: 'Actualizando evento...' });

        const result = await updateExistingEvent(selectedEventId, { ...formData, updatedById: user?.id || null });

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

    const selectedEvent = events.find(e => e.id === parseInt(selectedEventId));

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
                            onChange={(e) => { setSelectedEventId(e.target.value); setStatus({ type: '', message: '' }); }}
                        >
                            <option value="">-- Elige un evento --</option>
                            {events.map(event => (
                                <option key={event.id} value={event.id}>{event.eventName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedEvent && (
                    <EditEventForm
                        key={selectedEvent.id}
                        eventObj={selectedEvent}
                        status={status}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </section>
    );
}

export default EditEvent;
