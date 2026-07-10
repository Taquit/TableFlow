import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../css/editGuest.css';

const EditGuestModal = ({ guest, onClose, onUpdate, onDelete }) => {
    const [name, setName] = useState(guest?.name || '');
    const [email, setEmail] = useState(guest?.email || '');
    const [paid, setPaid] = useState(guest?.paid || false);
    const [amountPaid, setAmountPaid] = useState(guest?.amountPaid || 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (guest) {
            setName(guest.name || '');
            setEmail(guest.email || '');
            setPaid(guest.paid || false);
            setAmountPaid(guest.amountPaid || 0);
        }
    }, [guest]);

    const handleSave = async () => {
        if (!name) {
            setError("El nombre es obligatorio");
            return;
        }

        setLoading(true);
        setError(null);
        
        const guestData = {
            name,
            email,
            paid,
            amountPaid: parseFloat(amountPaid) || 0
        };

        const result = await onUpdate(guest.id, guestData);
        if (result.success) {
            onClose();
        } else {
            setError(result.error || "Error al actualizar");
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este invitado?")) {
            setLoading(true);
            const result = await onDelete(guest.id);
            if (result.success) {
                onClose();
            } else {
                setError(result.error || "Error al eliminar");
                setLoading(false);
            }
        }
    };

    if (!guest) return null;

    return createPortal(
        <div className="edit-guest-modal-overlay">
            <div className="edit-guest-modal-content">
                <button className="edit-guest-close-btn" onClick={onClose} title="Cerrar">
                    &times;
                </button>
                
                <h3>Editar Invitado</h3>
                
                {error && <p style={{ color: '#ff6b6b', marginBottom: '15px' }}>{error}</p>}

                <div className="edit-guest-form-group">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Nombre del invitado"
                    />
                </div>

                <div className="edit-guest-form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div className="edit-guest-checkbox-group">
                    <input 
                        type="checkbox" 
                        id="guest-paid"
                        checked={paid} 
                        onChange={(e) => setPaid(e.target.checked)} 
                    />
                    <label htmlFor="guest-paid">¿Ha pagado?</label>
                </div>

                <div className="edit-guest-form-group">
                    <label>Monto pagado:</label>
                    <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={amountPaid} 
                        onChange={(e) => setAmountPaid(e.target.value)} 
                        placeholder="0.00"
                    />
                </div>

                <div className="edit-guest-modal-actions">
                    <button className="btn-delete" onClick={handleDelete} disabled={loading}>
                        {loading ? 'Procesando...' : 'Eliminar'}
                    </button>
                    <button className="btn-cancel" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className="btn-save" onClick={handleSave} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditGuestModal;
