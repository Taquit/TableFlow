import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className='main'>
      <h1>Bienvenido a TableFlow</h1>
      <section className='btn-container'>
        <button className='btn-primary' onClick={() => navigate('/tables')}>
          Gestion de mesas
        </button>
        <button className='btn-primary'>
          Gestion de eventos
        </button>
      </section>
    </div>
  );
}
