import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../hooks/useEvent';
import '../css/createEvent.css';

export function CreateEvent() {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [numTable, setNumTable] = useState('');
    const [numGuest, setNumGuest] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const navigate = useNavigate();
    const { createNewEvent } = useEvent();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Creando evento...' });

        const result = await createNewEvent({ name, date, time, location, numTable, numGuest });

        if (result.success) {
            setStatus({ type: 'success', message: '¡Evento creado con éxito!' });
            setTimeout(() => {
                navigate('/tables'); // Redirigir a mesas u otra parte
            }, 1500);
        } else {
            setStatus({ type: 'error', message: `Error: ${result.error}` });
        }
    };

    return (
        <section id='createEvent' className="create-event-section">
            <div className="create-event-card">
                <div className="create-event-header">
                    <h3 className="create-event-title">Crear un nuevo Evento</h3>
                </div>

                <form onSubmit={handleSubmit} className="create-event-form">
                    <div className="create-event-group">
                        <label className="form-label">Nombre del evento *</label>
                        <input
                            type="text"
                            className="custom-input"
                            placeholder="Ej. Boda de Ana y Juan"
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
                                placeholder="Ej. 10"
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
                                placeholder="Ej. 100"
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
                            placeholder="Ej. Salón principal"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="create-event-submit-btn" disabled={status.type === 'loading'}>
                        {status.type === 'loading' ? 'Guardando...' : 'Crear evento'}
                    </button>

                    {status.message && (
                        <div className={`create-event-status-message ${status.type === 'error' ? 'create-event-status-error' : status.type === 'success' ? 'create-event-status-success' : ''}`}>
                            {status.message}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}

export default CreateEvent;