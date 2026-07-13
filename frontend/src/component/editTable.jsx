import { useState } from 'react';
import { useGuests } from '../hooks/useGuests';
import { useEvent } from '../hooks/useEvent';
import CreatGuest from './creatGuest';
import EditGuestModal from './editGuest';
import '../css/editTable.css';

export const EditTable = ({ tableId, eventId, tableNumber, onDeleteTable }) => {
    const { guests, loading, error, createGuestForTable, updateGuestData, removeGuest } = useGuests(eventId, tableId);
    const [selectedTableGuests, setSelectedTableGuests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);

    const { events } = useEvent();
    const currentEvent = events?.find(e => e.id === parseInt(eventId));
    const ticketCost = currentEvent?.ticketCost || 0;

    const getPaymentClass = (guest) => {
        if (ticketCost > 0) {
            if (guest.amountPaid >= ticketCost) return 'guest-paid-full';
            if (guest.amountPaid > 0 && guest.amountPaid < ticketCost) return 'guest-paid-partial';
            return 'guest-unpaid';
        } else {
            return guest.paid ? 'guest-paid-full' : 'guest-unpaid';
        }
    };

    return (
        <aside className="edit-table-panel">
            <div className="edit-table-header">
                <h3 className="edit-table-title">Mesa #{tableNumber}</h3>
                <p className="edit-table-desc">Asigna o edita los invitados de esta mesa.</p>

                <button
                    className="edit-table-add-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Añadir Invitado
                </button>
                {onDeleteTable && (
                    <button
                        className="edit-table-add-btn"
                        style={{ background: '#ef4444', marginTop: '10px' }}
                        onClick={async () => {
                            if (window.confirm('¿Estás seguro de que deseas eliminar esta mesa? Los invitados asignados a ella no serán borrados, pero se quedarán sin mesa.')) {
                                await onDeleteTable();
                            }
                        }}
                    >
                        🗑️ Eliminar Mesa
                    </button>
                )}
            </div>

            <div className="guests-list-container">
                {loading && <p className="edit-table-desc">Cargando invitados...</p>}
                {error && <p className="edit-table-error">Error: {error}</p>}
                {!loading && !error && guests.length === 0 && (
                    <div className="empty-guests">No hay invitados en este evento aún.</div>
                )}
                {!loading && !error && guests.length > 0 && guests.map(g => (
                    <div
                        className={`guest-item ${getPaymentClass(g)}`}
                        key={g.id}
                        onClick={() => setEditingGuest(g)}
                        title="Haz clic para editar invitado"
                    >
                        <span className="guest-name">{g.name}</span>
                        {/* Puedes descomentar u ocultar otros datos */}
                        {/* <span>{g.phone}</span> */}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <CreatGuest
                    eventId={eventId}
                    tableId={tableId}
                    onClose={() => setIsModalOpen(false)}
                    onAddGuest={createGuestForTable}
                />
            )}

            {editingGuest && (
                <EditGuestModal
                    guest={editingGuest}
                    onClose={() => setEditingGuest(null)}
                    onUpdate={updateGuestData}
                    onDelete={removeGuest}
                />
            )}
        </aside>
    )
}