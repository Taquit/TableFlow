import { useState } from 'react';
import { useEvent } from '../hooks/useEvent';
import { useEventGuests } from '../hooks/useEventGuests';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import '../css/excel_page.css';

export function ExcelPage() {
    const { events, loading: eventsLoading } = useEvent();
    const [selectedEventId, setSelectedEventId] = useState('');
    const { guests, loading: guestsLoading } = useEventGuests(selectedEventId);

    const handleExport = async () => {
        if (!selectedEventId || !guests || guests.length === 0) {
            alert('No hay invitados registrados para este evento.');
            return;
        }

        const selectedEvent = events.find(e => e.id === parseInt(selectedEventId));
        const eventName = selectedEvent ? selectedEvent.eventName : 'Evento';

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Invitados y Mesas');

        // Columnas
        worksheet.columns = [
            { header: 'No. Boleto', key: 'boletNumber', width: 15 },
            { header: 'Nombre del Invitado', key: 'name', width: 30 },
            { header: 'Mesa Asignada', key: 'table', width: 20 },
            { header: 'Monto Pagado', key: 'amountPaid', width: 20 },
            { header: 'Estado', key: 'paid', width: 15 }
        ];

        // Estilos de encabezado
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Añadir filas
        guests.forEach(guest => {
            worksheet.addRow({
                boletNumber: guest.boletNumber ? guest.boletNumber : 'N/A',
                name: guest.name,
                table: guest.table ? `Mesa ${guest.table.number}` : 'Sin mesa',
                amountPaid: guest.amountPaid > 0 ? `$${guest.amountPaid}` : '$0',
                paid: guest.paid ? 'Pagado' : 'Pendiente'
            });
        });

        // Generar Excel y descargar
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Reporte_${eventName}.xlsx`);
    };

    return (
        <div className="main excel-page-container">
            <h1>Exportar a Excel</h1>
            <p className="excel-subtitle">
                Descarga un reporte completo de los invitados, mesas y pagos
            </p>

            <section className="create-event-section excel-section">
                <div className="create-event-card excel-card">
                    <div className="create-event-form">
                        <div className="create-event-group">
                            <label className="form-label">Selecciona el evento</label>
                            {eventsLoading ? (
                                <p className="loading-text">Cargando eventos...</p>
                            ) : (
                                <select 
                                    className="custom-input" 
                                    value={selectedEventId} 
                                    onChange={(e) => setSelectedEventId(e.target.value)}
                                >
                                    <option value="">-- Elige un evento --</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.id}>{event.eventName}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {selectedEventId && (
                            <div className="export-action-group">
                                <button 
                                    className="save-btn" 
                                    onClick={handleExport}
                                    disabled={guestsLoading}
                                >
                                    {guestsLoading ? 'Cargando datos...' : 'Descargar Excel'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ExcelPage;
