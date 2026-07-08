import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CreateEvent() {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Creando evento...' });

        try {
            const response = await fetch('http://localhost:4000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, date, time, location })
            });

            const data = await response.json();

            if (data.success) {
                setStatus({ type: 'success', message: '¡Evento creado con éxito!' });
                setTimeout(() => {
                    navigate('/tables'); // Redirigir a mesas u otra parte
                }, 1500);
            } else {
                setStatus({ type: 'error', message: `Error: ${data.error}` });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Error de red al conectar con el servidor.' });
        }
    };

    return (
        <section id='createEvent' className="demo-section" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div className="demo-card glass-effect" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="demo-dashboard-header" style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Crear un nuevo Evento</h3>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group" style={{ textAlign: 'left' }}>
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
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="form-group" style={{ textAlign: 'left', flex: 1 }}>
                            <label className="form-label">Fecha *</label>
                            <input 
                                type="date" 
                                className="custom-input" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group" style={{ textAlign: 'left', flex: 1 }}>
                            <label className="form-label">Hora</label>
                            <input 
                                type="time" 
                                className="custom-input" 
                                value={time} 
                                onChange={(e) => setTime(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label className="form-label">Ubicación</label>
                        <input 
                            type="text" 
                            className="custom-input" 
                            placeholder="Ej. Salón principal" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }} disabled={status.type === 'loading'}>
                        {status.type === 'loading' ? 'Guardando...' : 'Crear evento'}
                    </button>

                    {status.message && (
                        <div style={{ 
                            padding: '12px', 
                            borderRadius: '8px', 
                            textAlign: 'center',
                            marginTop: '10px',
                            backgroundColor: status.type === 'error' ? 'rgba(255, 99, 132, 0.2)' : 
                                           status.type === 'success' ? 'rgba(75, 192, 192, 0.2)' : 'transparent',
                            color: status.type === 'error' ? '#ffb3b3' : 
                                   status.type === 'success' ? '#b3ffb3' : 'white'
                        }}>
                            {status.message}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}

export default CreateEvent;