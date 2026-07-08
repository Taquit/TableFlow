import { useState } from 'react'
import { useTables } from '../hooks/useTables.js'

function Tables({ eventId }) {
    const [selectedTableId, setSelectedTableId] = useState(null);
    const { tables, loading, error } = useTables(eventId);

    if (loading) {
        return <p>Cargando mesas...</p>;
    }
    if (error) {
        return <p>Error al cargar mesas: {error}</p>;
    }
    if (tables.length === 0) {
        return <p>No hay mesas disponibles para este evento.</p>;
    }
    return (
        <>
            <section id="tables" className="demo-section">
                <div className="container">
                    <div className="section-header">
                        <p className="section-desc">
                            Organiza y distribuye los lugares de tu evento. Haz clic en una mesa para seleccionarla.
                        </p>
                    </div>
                    <div className="demo-card glass-effect" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="demo-dashboard-header">
                            <h3>Plano de Distribución</h3>
                            <div className="table-cap">Mostrando {tables.length} mesas disponibles</div>
                        </div>
                        <div className="tables-container">
                            {tables.map(table => (
                                <div
                                    key={table.id}
                                    className={`table-widget ${selectedTableId === table.id ? 'active' : ''}`}
                                    onClick={() => setSelectedTableId(table.id)}
                                >
                                    <div className="table-circle">#{table.number}</div>
                                    <div className="table-cap">Mesa {table.number}</div>
                                    <div className="table-cap" style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
                                        Cap: {table.capacity} pers.
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Tables;