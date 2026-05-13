import React from 'react';
import { LayoutDashboard, FolderKanban, Calendar as CalendarIcon, FileBox, Bell, LogOut } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, setSelectedProjectId } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'files', label: 'Files', icon: FileBox },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    if (id !== 'projects') {
      setSelectedProjectId(null);
    }
  }

  return (
    <aside className="w-24 bg-black text-white rounded-[2rem] flex flex-col items-center py-8 shadow-xl hidden md:flex shrink-0">
      <div className="text-3xl font-bold mb-12 tracking-tighter">TB.</div>
      
      <nav className="flex-1 w-full">
        <ul className="flex flex-col items-center space-y-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="relative w-full flex justify-center">
                <button
                  onClick={() => handleNav(item.id)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={item.label}
                >
                  <item.icon className="w-6 h-6 stroke-[1.5]" />
                </button>
                {isActive && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full"></div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col items-center space-y-8 mt-8">
        <button
          onClick={() => {
            alert('You have been logged out');
            // In a real app, this would clear auth and redirect to login
          }}
          className="text-gray-400 hover:text-white transition-colors"
          title="Logout"
        >
          <LogOut className="w-6 h-6 stroke-[1.5]" />
        </button>
      </div>
    </aside>
  );
}
