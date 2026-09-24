import { useState } from 'react';
import { useEvent } from '../hooks/useEvent';
import AccountingView from '../component/accountingView';
import '../css/accounting.css';

export function MoneyPage() {
    const { events, loading } = useEvent();
    const [selectedEventId, setSelectedEventId] = useState('');

    return (
        <div className='main money-page-main'>
            <h1>Contaduría</h1>
            <p className="money-page-subtitle">
                Revisa el estado de cuenta y recaudación de tus eventos
            </p>

            <section className="create-event-section money-event-section">
                <div className="create-event-card money-event-card">
                    <div className="create-event-form">
                        <div className="create-event-group">
                            <label className="form-label">Selecciona el evento para ver su contaduría</label>
                            {loading ? (
                                <p className="money-loading-text">Cargando eventos...</p>
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
