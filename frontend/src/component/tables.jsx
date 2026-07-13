import { useState } from 'react'
import { useTables } from '../hooks/useTables.js'
import { EditTable } from './editTable.jsx'

function Tables({ eventId }) {
    const [selectedTableId, setSelectedTableId] = useState(null);
    const { tables, loading, error, deleteTable } = useTables(eventId);
    const [selectedTableNumber, setSelectedTableNumber] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tablesPerPage = 12;

    if (loading) {
        return <p>Cargando mesas...</p>;
    }
    if (error) {
        return <p>Error al cargar mesas: {error}</p>;
    }
    if (tables.length === 0) {
        return <p>No hay mesas disponibles para este evento.</p>;
    }

    const totalPages = Math.ceil(tables.length / tablesPerPage);
    const indexOfLastTable = currentPage * tablesPerPage;
    const indexOfFirstTable = indexOfLastTable - tablesPerPage;
    const currentTables = tables.slice(indexOfFirstTable, indexOfLastTable);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <section id="tables" className="demo-section">
                <div className="container">
                    <div className="section-header">
                        <p className="section-desc">
                            Organiza y distribuye los lugares de tu evento. Haz clic en una mesa para seleccionarla.
                        </p>
                    </div>
                    <div className="tables-layout-container">
                        <div className={`demo-card glass-effect tables-main-card ${selectedTableId ? 'selected' : 'unselected'}`}>
                            <div className="demo-dashboard-header">
                                <h3>Plano de Distribución</h3>
                                <div className="table-cap">Mostrando {tables.length} mesas disponibles</div>
                            </div>
                            <div className="tables-grid-4cols">
                                {currentTables.map(table => (
                                    <div
                                        key={table.id}
                                        className={`table-widget ${selectedTableId === table.id ? 'active' : ''}`}
                                        onClick={() => { setSelectedTableId(table.id); setSelectedTableNumber(table.number) }}
                                    >
                                        <div className="table-circle">#{table.number}</div>
                                        <div className="table-cap">Mesa {table.number}</div>
                                        <div className="table-cap tables-capacity-text">
                                            Cap: {table._count?.guests || 0} / {table.numSeats} pers.
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="pagination-container">
                                    <button 
                                        className="pagination-btn" 
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        Anterior
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button 
                                            key={index + 1} 
                                            className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button 
                                        className="pagination-btn" 
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </div>
                        {selectedTableId && (
                            <div className="tables-sidebar">
                                <EditTable 
                                    tableId={selectedTableId} 
                                    eventId={eventId} 
                                    tableNumber={selectedTableNumber} 
                                    onDeleteTable={async () => {
                                        const res = await deleteTable(selectedTableId);
                                        if (res.success) {
                                            setSelectedTableId(null);
                                            setSelectedTableNumber(null);
                                        }
                                        return res;
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
export default Tables;