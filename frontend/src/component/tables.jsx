import { useState } from 'react'

const demoTables = [
    { id: '1', number: '1', capacity: '14', ocupada: 'false' },
    { id: '2', number: '2', capacity: '12', ocupada: 'false' },
    { id: '3', number: '3', capacity: '10', ocupada: 'false' },
    { id: '4', number: '4', capacity: '14', ocupada: 'false' },
    { id: '5', number: '5', capacity: '10', ocupada: 'false' },
    { id: '6', number: '6', capacity: '14', ocupada: 'false' }
]

function Tables() {
    const [tables, setTable] = useState(demoTables);
    const [selectedTableId, setSelectedTableId] = useState('t1');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [guests, setGuests] = useState([
        { id: 'g1', name: 'Rubén', tableId: 't1', isConfirmed: true },
        { id: 'g2', name: 'Ana', tableId: 't1', isConfirmed: true },
        { id: 'g3', name: 'Carlos', tableId: 't1', isConfirmed: false },
        { id: 'g4', name: 'Sofía', tableId: null, isConfirmed: true },
        { id: 'g5', name: 'Luis', tableId: null, isConfirmed: false }
    ]);

    return (
        <>
            <section id="tables" className="demo-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Gestión de Mesas</h2>
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