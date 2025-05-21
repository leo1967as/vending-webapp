import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MotorMapping from './pages/MotorMapping';

import './index.css';
import VendingMachine from './pages/VendingMachine.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VendingMachine />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/motor-mapping" element={<MotorMapping />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
