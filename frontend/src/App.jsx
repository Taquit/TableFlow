import './App.css';
import Navbar from './component/navbar';
import Footer from './component/footer';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home_page';
import TablesPage from './pages/tables_page';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tables" element={<TablesPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
