import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import KOLManagement from './pages/KOLManagement';
import Search from './pages/Search';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { SidebarProvider } from './contexts/SidebarContext';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/kols" element={<KOLManagement />} />
              <Route path="/search" element={<Search />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;