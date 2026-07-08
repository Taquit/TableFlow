import { useState } from 'react'
import { useGuests } from '../hooks/useGuests'
import '../css/editTable.css'

export const EditTable = ({ tableId, eventId }) => {
    const { guests, loading, error } = useGuests(eventId);
    const [selectedTableGuests, setSelectedTableGuests] = useState([]);

    // Filtrar invitados si en el futuro decides que useGuests trae todos o adaptar según lógica
    // Por ahora mostramos los que vienen del hook.

    return (
        <aside className="edit-table-panel">
            <div className="edit-table-header">
                <h3 className="edit-table-title">Mesa #{tableId}</h3>
                <p className="edit-table-desc">Asigna o edita los invitados de esta mesa.</p>
            </div>

            <div className="guests-list-container">
                {loading && <p className="edit-table-desc">Cargando invitados...</p>}
                {error && <p className="edit-table-desc" style={{ color: '#ff6b6b' }}>Error: {error}</p>}
                {!loading && !error && guests.length === 0 && (
                    <div className="empty-guests">No hay invitados en este evento aún.</div>
                )}
                {!loading && !error && guests.length > 0 && guests.map(g => (
                    <div className="guest-item" key={g.id}>
                        <span className="guest-name">{g.name}</span>
                        {/* Puedes descomentar u ocultar otros datos */}
                        {/* <span>{g.email}</span> */}
                    </div>
                ))}
            </div>
        </aside>
    )
}