import { useState } from 'react';
import CreateEvent from '../component/createEvent';
import EditEvent from '../component/editEvent';
import { useAuth } from '../context/AuthContext';

export function EventPage() {
    const [action, setAction] = useState(null); // 'create' or 'edit'
    const { user } = useAuth();
    
    const isAdmin = user && user.role === 'ADMIN';

    return (
        <div className='main'>
            <h1>Gestión de eventos</h1>
            <p style={{ color: 'rgba(0, 0, 0, 1)', marginBottom: '30px' }}>
                {isAdmin ? 'Crea un nuevo evento o edita uno existente' : 'Visualiza los eventos existentes'}
            </p>

            {isAdmin && (
                <div className='btn-container' style={{ marginBottom: '40px' }}>
                    <button
                        className='btn-primary'
                        onClick={() => setAction('create')}
                        style={action === 'create' ? { background: 'rgba(255,255,255,0.2)' } : {}}
                    >
                        Crear evento
                    </button>
                    <button
                        className='btn-primary'
                        onClick={() => setAction('edit')}
                        style={action === 'edit' ? { background: 'rgba(255,255,255,0.2)' } : {}}
                    >
                        Editar Evento
                    </button>
                </div>
            )}

            {/* Renderizar componente de Crear Evento si action es 'create' */}
            {action === 'create' && isAdmin && <CreateEvent />}

            {/* Renderizar componente de Editar Evento si action es 'edit' */}
            {action === 'edit' && isAdmin && <EditEvent />}
        </div>
    )
}

export default EventPage;