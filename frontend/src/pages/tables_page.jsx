import Tables from '../component/tables.jsx';


export function TablesPage() {
    return (
        <div className='main'>
            <h1>Gestion de mesas</h1>
            <p>Eliga un evento para gestionar sus mesas</p>
            <label>Evento</label>
            <select>
                <option value="">Seleccione un evento</option>
                <option value="1">Evento 1</option>
                <option value="2">Evento 2</option>
                <option value="3">Evento 3</option>
            </select>
            <button className='btn-primary' >Gestionar</button>
            <Tables />
        </div>
    );
}

export default TablesPage;