import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Congregation from './pages/Congregation';
import Finance from './pages/Finance';
import Schedule from './pages/Schedule';
import AiAssistant from './pages/AiAssistant';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/congregation" element={<Congregation />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;