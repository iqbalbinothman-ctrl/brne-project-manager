import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { AppProvider, useAppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Auth from './components/Auth';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CalendarView from './pages/CalendarView';
import FilesView from './pages/FilesView';
import NotificationsView from './pages/NotificationsView';
import Settings from './pages/Settings';

function AppContent() {
  const { activeTab } = useAppContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'projects': return <Projects />;
      case 'calendar': return <CalendarView />;
      case 'files': return <FilesView />;
      case 'notifications': return <NotificationsView />;
      case 'settings': return <Settings />;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <AppProvider session={session}>
      <AppContent />
    </AppProvider>
  );
}
