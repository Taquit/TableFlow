import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTables } from '../hooks/useTables.js';
import { useAuth } from '../hooks/useAuth.js';
import { EditTable } from './editTable.jsx';

function Tables({ eventId }) {
    const [selectedTableId, setSelectedTableId] = useState(null);
    const { tables, loading, error, createNewTable, deleteTable, updateTableCapacity, fetchTables } = useTables(eventId);
    const [selectedTableNumber, setSelectedTableNumber] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddTableOpen, setIsAddTableOpen] = useState(false);
    const [newTableNumber, setNewTableNumber] = useState('');
    const [newTableSeats, setNewTableSeats] = useState(8);
    const [addTableLoading, setAddTableLoading] = useState(false);
    const [addTableError, setAddTableError] = useState('');
    const tablesPerPage = 12;

    const { user } = useAuth();
    const isAdmin = user && user.role === 'ADMIN';

    if (loading) {
        return <p>Cargando mesas...</p>;
    }
    if (error) {
        return <p>Error al cargar mesas: {error}</p>;
    }
    if (tables.length === 0) {
        return (
            <div className="demo-section">
                <p>No hay mesas disponibles para este evento.</p>
                {isAdmin && (
                    <button
                        className="add-table-btn"
                        onClick={() => {
                            setNewTableNumber(1);
                            setNewTableSeats(8);
                            setAddTableError('');
                            setIsAddTableOpen(true);
                        }}
                    >
                        + Añadir Primera Mesa
                    </button>
                )}
                {isAddTableOpen && createPortal(
                    <div className="add-table-modal-overlay">
                        <div className="add-table-modal">
                            <h3 className="add-table-title">Añadir Mesa</h3>
                            {addTableError && <p className="edit-table-error">{addTableError}</p>}
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setAddTableLoading(true);
                                const res = await createNewTable({
                                    number: parseInt(newTableNumber, 10),
                                    numSeats: parseInt(newTableSeats, 10),
                                    eventId: parseInt(eventId, 10),
                                    updatedById: user?.id || null
                                });
                                setAddTableLoading(false);
                                if (res.success) setIsAddTableOpen(false);
                                else setAddTableError(res.error);
                            }} className="add-table-form">
                                <label className="form-label">Número de mesa:</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="add-table-input"
                                    value={newTableNumber}
                                    onChange={(e) => setNewTableNumber(e.target.value)}
                                    required
                                />
                                <label className="form-label">Capacidad de asientos:</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="add-table-input"
                                    value={newTableSeats}
                                    onChange={(e) => setNewTableSeats(e.target.value)}
                                    required
                                />
                                <div className="add-table-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setIsAddTableOpen(false)}>Cancelar</button>
                                    <button type="submit" className="add-table-btn" disabled={addTableLoading}>
                                        {addTableLoading ? 'Guardando...' : 'Crear Mesa'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        );
    }

    const totalPages = Math.ceil(tables.length / tablesPerPage);
    const indexOfLastTable = currentPage * tablesPerPage;
    const indexOfFirstTable = indexOfLastTable - tablesPerPage;
    const currentTables = tables.slice(indexOfFirstTable, indexOfLastTable);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleOpenAddTable = () => {
        const maxNumber = tables.reduce((max, t) => Math.max(max, t.number || 0), 0);
        setNewTableNumber(maxNumber + 1);
        setNewTableSeats(8);
        setAddTableError('');
        setIsAddTableOpen(true);
    };

    const handleAddTableSubmit = async (e) => {
        e.preventDefault();
        setAddTableLoading(true);
        setAddTableError('');
        const res = await createNewTable({
            number: parseInt(newTableNumber, 10),
            numSeats: parseInt(newTableSeats, 10),
            eventId: parseInt(eventId, 10),
            updatedById: user?.id || null
        });
        setAddTableLoading(false);
        if (res.success) {
            setIsAddTableOpen(false);
        } else {
            setAddTableError(res.error || 'Error al crear la mesa');
        }
    };

    const selectedTable = tables.find(t => t.id === selectedTableId);

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
                            <div className="demo-dashboard-header tables-header-actions">
                                <div>
                                    <h3>Plano de Distribución</h3>
                                    <div className="table-cap">Mostrando {tables.length} mesas disponibles</div>
                                </div>
                                {isAdmin && (
                                    <button className="add-table-btn" onClick={handleOpenAddTable}>
                                        + Añadir Mesa
                                    </button>
                                )}
                            </div>
                            <div className="tables-grid-4cols">
                                {currentTables.map(table => {
                                    const guestsCount = table._count?.guests || 0;
                                    const isFull = table.numSeats > 0 && guestsCount >= table.numSeats;
                                    return (
                                        <div
                                            key={table.id}
                                            className={`table-widget ${selectedTableId === table.id ? 'active' : ''} ${isFull ? 'full' : ''}`}
                                            onClick={() => { setSelectedTableId(table.id); setSelectedTableNumber(table.number); }}
                                        >
                                            <div className="table-circle">#{table.number}</div>
                                            <div className="table-cap">Mesa {table.number}</div>
                                            <div className="table-manager-name" title={table.managerName || 'Sin encargado asignado'}>
                                                {table.managerName ? `Encargado: ${table.managerName}` : 'Sin encargado'}
                                            </div>
                                            <div className="table-cap tables-capacity-text">
                                                Cap: {guestsCount} / {table.numSeats} pers.
                                            </div>
                                            <div className="table-audit-badge" title={table.updatedByUsername ? `Modificado por: ${table.updatedByUsername}` : 'Creado por el sistema'}>
                                                Modif: {table.updatedByUsername || 'Sistema'}
                                            </div>
                                        </div>
                                    );
                                })}
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
                                    key={selectedTableId}
                                    tableId={selectedTableId}
                                    tableData={selectedTable}
                                    eventId={eventId} 
                                    tableNumber={selectedTableNumber} 
                                    currentCapacity={selectedTable?.numSeats}
                                    onDeleteTable={async () => {
                                        const res = await deleteTable(selectedTableId);
                                        if (res.success) {
                                            setSelectedTableId(null);
                                            setSelectedTableNumber(null);
                                        }
                                        return res;
                                    }}
                                    onUpdateCapacity={async (newCapacity, updatedById) => {
                                        return await updateTableCapacity(selectedTableId, newCapacity, updatedById);
                                    }}
                                    onGuestChange={() => {
                                        fetchTables();
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {isAddTableOpen && createPortal(
                <div className="add-table-modal-overlay">
                    <div className="add-table-modal">
                        <h3 className="add-table-title">Añadir Nueva Mesa</h3>
                        {addTableError && <p className="edit-table-error">{addTableError}</p>}
                        <form onSubmit={handleAddTableSubmit} className="add-table-form">
                            <label className="form-label">Número de mesa:</label>
                            <input
                                type="number"
                                min="1"
                                className="add-table-input"
                                value={newTableNumber}
                                onChange={(e) => setNewTableNumber(e.target.value)}
                                required
                            />
                            <label className="form-label">Capacidad de asientos:</label>
                            <input
                                type="number"
                                min="1"
                                className="add-table-input"
                                value={newTableSeats}
                                onChange={(e) => setNewTableSeats(e.target.value)}
                                required
                            />
                            <div className="add-table-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsAddTableOpen(false)}>Cancelar</button>
                                <button type="submit" className="add-table-btn" disabled={addTableLoading}>
                                    {addTableLoading ? 'Guardando...' : 'Crear Mesa'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default Tables;