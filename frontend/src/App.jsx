import './App.css';
import Navbar from './component/navbar';
import Footer from './component/footer';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home_page';
import TablesPage from './pages/tables_page';
import EventPage from './pages/event_page';
import GuestsPage from './pages/guest_page';
import MoneyPage from './pages/money_page';
import ExcelPage from './pages/excel_page';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/guests" element={<GuestsPage />} />
        <Route path="/accounting" element={<MoneyPage />} />
        <Route path="/export" element={<ExcelPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
