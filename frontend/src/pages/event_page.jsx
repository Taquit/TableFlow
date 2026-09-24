import { useState } from 'react';
import CreateEvent from '../component/createEvent';
import EditEvent from '../component/editEvent';
import { useAuth } from '../hooks/useAuth';
import '../css/event_page.css';

export function EventPage() {
    const [action, setAction] = useState(null); // 'create' or 'edit'
    const { user } = useAuth();
    
    const isAdmin = user && user.role === 'ADMIN';

    return (
        <div className='main'>
            <h1>Gestión de eventos</h1>
            <p className="event-page-subtitle">
                {isAdmin ? 'Crea un nuevo evento o edita uno existente' : 'Visualiza los eventos existentes'}
            </p>

            {isAdmin && (
                <div className='btn-container event-page-btn-container'>
                    <button
                        className={`btn-primary ${action === 'create' ? 'event-btn-active' : ''}`}
                        onClick={() => setAction('create')}
                    >
                        Crear evento
                    </button>
                    <button
                        className={`btn-primary ${action === 'edit' ? 'event-btn-active' : ''}`}
                        onClick={() => setAction('edit')}
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