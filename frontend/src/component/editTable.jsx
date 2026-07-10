import { useState } from 'react';
import { useGuests } from '../hooks/useGuests';
import CreatGuest from './creatGuest';
import EditGuestModal from './editGuest';
import '../css/editTable.css';

export const EditTable = ({ tableId, eventId, tableNumber }) => {
    const { guests, loading, error, createGuestForTable, updateGuestData, removeGuest } = useGuests(eventId, tableId);
    const [selectedTableGuests, setSelectedTableGuests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);

    // Filtrar invitados si en el futuro decides que useGuests trae todos o adaptar según lógica
    // Por ahora mostramos los que vienen del hook.

    return (
        <aside className="edit-table-panel">
            <div className="edit-table-header">
                <h3 className="edit-table-title">Mesa #{tableNumber}</h3>
                <p className="edit-table-desc">Asigna o edita los invitados de esta mesa.</p>

                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        marginTop: '15px',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #b519ce 0%, #8e14a1 100%)',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    + Añadir Invitado
                </button>
            </div>

            <div className="guests-list-container">
                {loading && <p className="edit-table-desc">Cargando invitados...</p>}
                {error && <p className="edit-table-desc" style={{ color: '#ff6b6b' }}>Error: {error}</p>}
                {!loading && !error && guests.length === 0 && (
                    <div className="empty-guests">No hay invitados en este evento aún.</div>
                )}
                {!loading && !error && guests.length > 0 && guests.map(g => (
                    <div 
                        className="guest-item" 
                        key={g.id} 
                        onClick={() => setEditingGuest(g)}
                        style={{ cursor: 'pointer' }}
                        title="Haz clic para editar invitado"
                    >
                        <span className="guest-name">{g.name}</span>
                        {/* Puedes descomentar u ocultar otros datos */}
                        {/* <span>{g.email}</span> */}
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