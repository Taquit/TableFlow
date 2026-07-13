import React, { useState } from 'react';
import { useAccounting } from '../hooks/useAccounting';
import '../css/accounting.css';

export function AccountingView({ eventId }) {
    const { accountingData, loading, error } = useAccounting(eventId);
    const [currentPage, setCurrentPage] = useState(1);
    const tablesPerPage = 8;

    if (loading) {
        return (
            <div className="accounting-container">
                <div className="accounting-header">
                    <h3 style={{ color: '#1f2937' }}>⏳ Cargando datos contables...</h3>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="accounting-container">
                <div className="accounting-header">
                    <h3 style={{ color: '#ef4444' }}>❌ Error: {error}</h3>
                </div>
            </div>
        );
    }

    if (!accountingData) {
        return (
            <div className="accounting-container">
                <div className="accounting-header">
                    <h3 style={{ color: '#1f2937' }}>No hay datos contables disponibles.</h3>
                </div>
            </div>
        );
    }

    const indexOfLastTable = currentPage * tablesPerPage;
    const indexOfFirstTable = indexOfLastTable - tablesPerPage;
    const currentTables = accountingData.tablesData.slice(indexOfFirstTable, indexOfLastTable);
    const totalPages = Math.ceil(accountingData.tablesData.length / tablesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="accounting-container">
            <div className="accounting-total-card">
                <div className="accounting-total-title">Total Recaudado del Evento</div>
                <div className="accounting-total-amount">
                    ${accountingData.totalCollected.toFixed(2)}
                </div>
            </div>

            <h3 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>
                Desglose por Mesas
            </h3>

            {accountingData.tablesData.length === 0 ? (
                <p style={{ color: '#4b5563' }}>No hay mesas en este evento.</p>
            ) : (
                <>
                    <div className="accounting-tables-grid">
                        {currentTables.map((table, index) => (
                            <div 
                                className="accounting-table-card" 
                                key={table.id}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="accounting-table-header">
                                    <span className="accounting-table-title">Mesa #{table.number}</span>
                                    <span className="accounting-table-guests">
                                        {table.guestsCount} invitado(s)
                                    </span>
                                </div>
                                <div className="accounting-table-amount">
                                    ${table.collected.toFixed(2)}
                                </div>
                            </div>
                        ))}
                        
                        {/* El bloque 'Sin Mesa Asignada' lo mostramos solo en la última página o como elemento fijo al final */}
                        {currentPage === totalPages && accountingData.unassignedCollected > 0 && (
                            <div className="accounting-table-card accounting-unassigned-card">
                                <div className="accounting-table-header">
                                    <span className="accounting-table-title">Sin Mesa Asignada</span>
                                </div>
                                <div className="accounting-table-amount">
                                    ${accountingData.unassignedCollected.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="accounting-pagination">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="accounting-page-btn"
                            >
                                Anterior
                            </button>
                            <span className="accounting-page-info">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="accounting-page-btn"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AccountingView;
