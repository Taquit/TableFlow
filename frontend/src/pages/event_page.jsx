
export function EventPage() {

    return (
        <div className='main'>
            <h1>Gestión de eventos</h1>
            <p >Crea un nuevo evento o edita uno existente</p>

            <div className='btn-container'>
                <button className='btn-primary'>Crear evento</button>
                <button className='btn-primary'>Editar Evento</button>
            </div>
        </div>
    )
}

export default EventPage;