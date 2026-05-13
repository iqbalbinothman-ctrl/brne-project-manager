import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function Header() {
  const { setActiveTab, notifications, currentUser } = useAppContext();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="absolute top-0 right-0 p-8 flex items-center gap-6 z-20 pointer-events-none">
      <div className="relative hidden md:block w-56 pointer-events-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 dark:text-gray-600" />
        </div>
        <input
          className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-0 rounded-full text-sm font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:focus:bg-gray-700 dark:text-white inset-shadow-sm transition-all shadow-sm"
          placeholder="Search..."
          type="search"
        />
      </div>

      <button
        onClick={() => setActiveTab('notifications')}
        className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 pointer-events-auto"
      >
        <Bell className="w-5 h-5 stroke-[1.5]" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        )}
      </button>

      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex items-center justify-center font-bold text-sm text-gray-700 dark:text-gray-300 pointer-events-auto">
          {currentUser?.initials}
      </div>
    </header>
  );
}
