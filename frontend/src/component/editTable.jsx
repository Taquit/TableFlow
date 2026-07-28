import { useState, useEffect } from 'react';
import { useGuests } from '../hooks/useGuests';
import { useEvent } from '../hooks/useEvent';
import CreatGuest from './creatGuest';
import EditGuestModal from './editGuest';
import { useAuth } from '../context/AuthContext';
import '../css/editTable.css';

export const EditTable = ({ tableId, eventId, tableNumber, currentCapacity, onDeleteTable, onUpdateCapacity }) => {
    const { guests, loading, error, createGuestForTable, updateGuestData, removeGuest } = useGuests(eventId, tableId);
    const [selectedTableGuests, setSelectedTableGuests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const { user } = useAuth();
    const isAdmin = user && user.role === 'ADMIN';

    const { events } = useEvent();
    const currentEvent = events?.find(e => e.id === parseInt(eventId));
    const ticketCost = currentEvent?.ticketCost || 0;

    const [isEditingCapacity, setIsEditingCapacity] = useState(false);
    const [tempCapacity, setTempCapacity] = useState(currentCapacity || 8);

    useEffect(() => {
        setTempCapacity(currentCapacity || 8);
        setIsEditingCapacity(false);
    }, [tableId, currentCapacity]);

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
                
                {isAdmin ? (
                    <div className="capacity-editor" style={{ marginBottom: '10px' }}>
                        {isEditingCapacity ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label style={{ fontSize: '14px', color: '#cbd5e1' }}>Capacidad:</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={tempCapacity} 
                                    onChange={(e) => setTempCapacity(e.target.value)} 
                                    style={{ width: '60px', padding: '4px', borderRadius: '4px', border: '1px solid #475569', background: '#1e293b', color: '#fff' }}
                                />
                                <button 
                                    onClick={async () => {
                                        if (onUpdateCapacity) {
                                            await onUpdateCapacity(tempCapacity);
                                        }
                                        setIsEditingCapacity(false);
                                    }}
                                    style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', lineHeight: '1' }}
                                    title="Guardar"
                                >
                                    ✓
                                </button>
                                <button 
                                    onClick={() => {
                                        setTempCapacity(currentCapacity || 8);
                                        setIsEditingCapacity(false);
                                    }}
                                    style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', lineHeight: '1' }}
                                    title="Cancelar"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <p className="edit-table-desc" style={{ margin: 0 }}>Capacidad: {currentCapacity} personas</p>
                                <button 
                                    onClick={() => setIsEditingCapacity(true)}
                                    style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '14px', padding: 0 }}
                                    title="Editar capacidad"
                                >
                                    ✏️
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="edit-table-desc" style={{ marginBottom: '8px' }}>Capacidad: {currentCapacity} personas</p>
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
                        onClick={() => isAdmin ? setEditingGuest(g) : null}
                        style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                        title={isAdmin ? "Haz clic para editar invitado" : ""}
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