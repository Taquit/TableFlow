import { useState } from 'react';
import { createPortal } from 'react-dom';
import '../css/creatGuest.css';

export function CreatGuest({ eventId, tableId, onClose, onAddGuest }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [paid, setPaid] = useState(false);
    const [amountPaid, setAmountPaid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await onAddGuest({
            name,
            phone,
            eventId,
            tableId,
            paid,
            amountPaid: amountPaid ? parseFloat(amountPaid) : 0
        });

        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
    };

    return createPortal(
        <div className="creat-guest-overlay">
            <div className="creat-guest-modal">
                <div className="creat-guest-header">
                    <h3 className="creat-guest-title">Añadir Invitado</h3>
                    <button className="creat-guest-close" onClick={onClose}>&times;</button>
                </div>

                <form className="creat-guest-form" onSubmit={handleSubmit}>
                    <div className="creat-guest-group">
                        <label className="creat-guest-label">Nombre *</label>
                        <input
                            type="text"
                            className="creat-guest-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>

                    <div className="creat-guest-group">
                        <label className="creat-guest-label">Teléfono</label>
                        <input
                            type="tel"
                            className="creat-guest-input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ej. 123456789"
                        />
                    </div>

                    <div className="creat-guest-checkbox-group">
                        <input
                            type="checkbox"
                            id="paid-checkbox"
                            checked={paid}
                            onChange={(e) => setPaid(e.target.checked)}
                        />
                        <label className="creat-guest-label" htmlFor="paid-checkbox">¿Ha pagado?</label>
                    </div>

                    {paid && (
                        <div className="creat-guest-group">
                            <label className="creat-guest-label">Monto pagado</label>
                            <input
                                type="number"
                                step="0.01"
                                className="creat-guest-input"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                placeholder="Ej. 50.00"
                            />
                        </div>
                    )}

                    {error && (
                        <div style={{ color: '#ffb3b3', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="creat-guest-submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Invitado'}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default CreatGuest;
