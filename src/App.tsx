import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CalendarView from './pages/CalendarView';
import FilesView from './pages/FilesView';
import NotificationsView from './pages/NotificationsView';
import { cleanOldData } from './validateData';

function AppContent() {
  const { activeTab } = useAppContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'projects': return <Projects />;
      case 'calendar': return <CalendarView />;
      case 'files': return <FilesView />;
      case 'notifications': return <NotificationsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen p-4 sm:p-6 gap-6 font-sans text-gray-900 dark:text-white overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto w-full h-full relative z-0 pt-24">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    cleanOldData();
  }, []);

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
