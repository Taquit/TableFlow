import { useState } from 'react';
import { useEvent } from '../hooks/useEvent';
import AccountingView from '../component/accountingView';

export function MoneyPage() {
    const { events, loading } = useEvent();
    const [selectedEventId, setSelectedEventId] = useState('');

    return (
        <div className='main' style={{ minHeight: '80vh' }}>
            <h1>Contaduría</h1>
            <p style={{ color: 'rgba(0, 0, 0, 1)', marginBottom: '30px' }}>
                Revisa el estado de cuenta y recaudación de tus eventos
            </p>

            <section className="create-event-section" style={{ padding: '0', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
                <div className="create-event-card" style={{ marginBottom: '0' }}>
                    <div className="create-event-form">
                        <div className="create-event-group">
                            <label className="form-label">Selecciona el evento para ver su contaduría</label>
                            {loading ? (
                                <p style={{ color: 'white' }}>Cargando eventos...</p>
                            ) : (
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
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {selectedEventId && (
                <AccountingView eventId={selectedEventId} />
            )}
        </div>
    );
}

export default MoneyPage;
