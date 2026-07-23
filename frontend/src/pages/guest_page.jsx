import { useState } from 'react';
import { useEvent } from '../hooks/useEvent';
import { useEventGuests } from '../hooks/useEventGuests';
import EditGuestModal from '../component/editGuest';
import { useAuth } from '../context/AuthContext';
import '../css/guest_page.css';

function GuestsPage() {
    const { events, loading: eventsLoading } = useEvent();
    const [selectedEventId, setSelectedEventId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingGuest, setEditingGuest] = useState(null);
    const { user } = useAuth();
    const isAdmin = user && user.role === 'ADMIN';

    const {
        guests,
        loading: guestsLoading,
        error: guestsError,
        updateGuestData,
        removeGuest
    } = useEventGuests(selectedEventId, searchTerm);

    const getPaymentStatus = (guest) => {
        const currentEvent = events.find(ev => ev.id === parseInt(selectedEventId));
        const ticketCost = currentEvent?.ticketCost || 0;

        if (ticketCost > 0) {
            if (guest.amountPaid >= ticketCost) {
                return { class: 'status-paid', text: `Pagado Completo ($${guest.amountPaid})` };
            } else if (guest.amountPaid > 0) {
                return { class: 'status-partial', text: `Pago Parcial ($${guest.amountPaid} / $${ticketCost})` };
            }
            return { class: 'status-unpaid', text: 'Pendiente de pago' };
        } else {
            if (guest.paid) {
                return { class: 'status-paid', text: `Pagado ($${guest.amountPaid})` };
            }
            return { class: 'status-unpaid', text: 'Pendiente de pago' };
        }
    };

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
                        placeholder="Nombre o teléfono..."
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
                                    style={{ cursor: 'pointer' }}
                                    title="Haz clic para editar"
                                >
                                    <h3>{guest.name}</h3>
                                    {guest.phone && <p>📞 {guest.phone}</p>}
                                    <p>🪑 Mesa: {guest.table ? `#${guest.table.number}` : 'Sin asignar'} | 🎫 Boleto: {guest.boletNumber ? `#${guest.boletNumber}` : 'N/A'}</p>

                                    <div className={`guest-status-badge ${getPaymentStatus(guest).class}`}>
                                        {getPaymentStatus(guest).text}
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