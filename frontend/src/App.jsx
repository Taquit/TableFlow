import './App.css';
import Navbar from './component/navbar';
import Footer from './component/footer';
import Tables from './component/tables';

function App() {


  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <div className='main'>
        <Tables />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
