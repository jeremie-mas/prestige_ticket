import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TicketSales from './pages/TicketSales.jsx';
import Events from './pages/Events.jsx';
import Payouts from './pages/Payouts.jsx';
import Earnings from './pages/Earnings.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import Promotions from './pages/Promotions.jsx';
import Help from './pages/Help.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="ticket-sales" element={<TicketSales />} />
        <Route path="events" element={<Events />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="help" element={<Help />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
