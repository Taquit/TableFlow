import { useState } from 'react';
import { useGuests } from '../hooks/useGuests';
import { useEvent } from '../hooks/useEvent';
import CreatGuest from './creatGuest';
import EditGuestModal from './editGuest';
import { useAuth } from '../hooks/useAuth';
import '../css/editTable.css';

export const EditTable = ({ tableId, tableData, eventId, tableNumber, currentCapacity, onDeleteTable, onUpdateCapacity, onGuestChange }) => {
    const { guests, loading, error, createGuestForTable, updateGuestData, removeGuest } = useGuests(eventId, tableId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const { user } = useAuth();
    const isAdmin = user && user.role === 'ADMIN';

    const { events } = useEvent();
    const currentEvent = events?.find(e => e.id === parseInt(eventId));
    const ticketCost = currentEvent?.ticketCost || 0;

    const [isEditingCapacity, setIsEditingCapacity] = useState(false);
    const [tempCapacity, setTempCapacity] = useState(currentCapacity || 8);

    const getPaymentClass = (guest) => {
        if (ticketCost > 0) {
            if (guest.amountPaid >= ticketCost) return 'guest-paid-full';
            if (guest.amountPaid > 0 && guest.amountPaid < ticketCost) return 'guest-paid-partial';
            return 'guest-unpaid';
        } else {
            return guest.paid ? 'guest-paid-full' : 'guest-unpaid';
        }
    };

    const handleCreateGuest = async (guestData) => {
        const res = await createGuestForTable(guestData);
        if (res.success && onGuestChange) onGuestChange();
        return res;
    };

    const handleUpdateGuest = async (guestId, guestData) => {
        const res = await updateGuestData(guestId, guestData);
        if (res.success && onGuestChange) onGuestChange();
        return res;
    };

    const handleDeleteGuest = async (guestId) => {
        const res = await removeGuest(guestId);
        if (res.success && onGuestChange) onGuestChange();
        return res;
    };

    return (
        <aside className="edit-table-panel">
            <div className="edit-table-header">
                <h3 className="edit-table-title">Mesa #{tableNumber}</h3>
                
                <div className="table-audit-header">
                    Modificado por: <strong>{tableData?.updatedByUsername || 'Sistema'}</strong>
                </div>

                {isAdmin ? (
                    <div className="capacity-editor">
                        {isEditingCapacity ? (
                            <div className="capacity-edit-row">
                                <label className="capacity-label">Capacidad:</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={tempCapacity} 
                                    onChange={(e) => setTempCapacity(e.target.value)} 
                                    className="capacity-input"
                                />
                                <button 
                                    onClick={async () => {
                                        if (onUpdateCapacity) {
                                            await onUpdateCapacity(tempCapacity, user?.id);
                                        }
                                        setIsEditingCapacity(false);
                                    }}
                                    className="capacity-save-btn"
                                    title="Guardar"
                                >
                                    Guardar
                                </button>
                                <button 
                                    onClick={() => {
                                        setTempCapacity(currentCapacity || 8);
                                        setIsEditingCapacity(false);
                                    }}
                                    className="capacity-cancel-btn"
                                    title="Cancelar"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <div className="capacity-view-row">
                                <p className="edit-table-desc capacity-view-text">Capacidad: {currentCapacity} personas</p>
                                <button 
                                    onClick={() => setIsEditingCapacity(true)}
                                    className="capacity-edit-trigger"
                                    title="Editar capacidad"
                                >
                                    [Editar]
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="edit-table-desc">Capacidad: {currentCapacity} personas</p>
                )}

                <p className="edit-table-desc">Asigna o edita los invitados de esta mesa.</p>

                {isAdmin && (
                    <button
                        className="edit-table-add-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Añadir Invitado
                    </button>
                )}
                {isAdmin && onDeleteTable && (
                    <button
                        className="edit-table-add-btn edit-table-delete-btn"
                        onClick={async () => {
                            if (window.confirm('¿Estás seguro de que deseas eliminar esta mesa? Los invitados asignados a ella no serán borrados, pero se quedarán sin mesa.')) {
                                await onDeleteTable();
                            }
                        }}
                    >
                        Eliminar Mesa
                    </button>
                )}
            </div>

            <div className="guests-list-container">
                {loading && <p className="edit-table-desc">Cargando invitados...</p>}
                {error && <p className="edit-table-error">Error: {error}</p>}
                {!loading && !error && guests.length === 0 && (
                    <div className="empty-guests">No hay invitados en esta mesa aún.</div>
                )}
                {!loading && !error && guests.length > 0 && guests.map(g => (
                    <div
                        className={`guest-item ${getPaymentClass(g)}`}
                        key={g.id}
                        onClick={() => isAdmin ? setEditingGuest(g) : null}
                        title={isAdmin ? "Haz clic para editar invitado" : ""}
                    >
                        <span className="guest-name">
                            {g.name}
                            {g.isTableManager && <span className="guest-manager-badge" title="Encargado de mesa">Encargado</span>}
                        </span>
                        <span className="guest-audit-info" title={g.updatedByUsername ? `Modificado por ${g.updatedByUsername}` : 'Creado por el sistema'}>
                            Modif: {g.updatedByUsername || 'Sistema'}
                        </span>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <CreatGuest
                    eventId={eventId}
                    tableId={tableId}
                    onClose={() => setIsModalOpen(false)}
                    onAddGuest={handleCreateGuest}
                />
            )}

            {editingGuest && (
                <EditGuestModal
                    key={editingGuest.id}
                    guest={editingGuest}
                    onClose={() => setEditingGuest(null)}
                    onUpdate={handleUpdateGuest}
                    onDelete={handleDeleteGuest}
                />
            )}
        </aside>
    );
};