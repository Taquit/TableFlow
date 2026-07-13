import { useState } from 'react';
import { useEvent } from '../hooks/useEvent';
import { useEventGuests } from '../hooks/useEventGuests';
import EditGuestModal from '../component/editGuest';
import '../css/guest_page.css';

function GuestsPage() {
    const { events, loading: eventsLoading } = useEvent();
    const [selectedEventId, setSelectedEventId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingGuest, setEditingGuest] = useState(null);

    const {
        guests,
        loading: guestsLoading,
        error: guestsError,
        updateGuestData,
        removeGuest
    } = useEventGuests(selectedEventId, searchTerm);

    return (
        <div className="guest-page-container">
            <div className="guest-page-header">
                <h1>Gestión de Invitados</h1>
                <p>Busca y administra todos los invitados de tus eventos</p>
            </div>

            <div className="guest-controls">
                <div className="guest-control-group">
                    <label>Selecciona un Evento:</label>
                    <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        disabled={eventsLoading}
                    >
                        <option value="">-- Elige un evento --</option>
                        {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.eventName}</option>
                        ))}
                    </select>
                </div>

                <div className="guest-control-group">
                    <label>Buscar Invitado:</label>
                    <input
                        type="text"
                        placeholder="Nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={!selectedEventId}
                    />
                </div>
            </div>

            {guestsLoading && <div className="guest-loading">Cargando invitados...</div>}
            {guestsError && <div className="guest-error">Error: {guestsError}</div>}

            {!guestsLoading && !guestsError && selectedEventId && (
                <>
                    {guests.length > 0 ? (
                        <div className="guest-list-grid">
                            {guests.map(guest => (
                                <div
                                    className="guest-card"
                                    key={guest.id}
                                    onClick={() => setEditingGuest(guest)}
                                    title="Haz clic para editar"
                                >
                                    <h3>{guest.name}</h3>
                                    {guest.email && <p>✉️ {guest.email}</p>}
                                    <p>🪑 Mesa: {guest.table ? `#${guest.table.number}` : 'Sin asignar'}</p>

                                    <div className={`guest-status-badge ${guest.paid ? 'status-paid' : 'status-unpaid'}`}>
                                        {guest.paid ? `Pagado ($${guest.amountPaid})` : 'Pendiente de pago'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="guest-no-results">
                            <h3>No se encontraron invitados</h3>
                            <p>Intenta con otra búsqueda o selecciona otro evento.</p>
                        </div>
                    )}
                </>
            )}

            {!selectedEventId && !eventsLoading && (
                <div className="guest-no-results">
                    <p>Por favor selecciona un evento para ver a sus invitados.</p>
                </div>
            )}

            {editingGuest && (
                <EditGuestModal
                    guest={editingGuest}
                    onClose={() => setEditingGuest(null)}
                    onUpdate={updateGuestData}
                    onDelete={removeGuest}
                />
            )}
        </div>
    );
}

export default GuestsPage;