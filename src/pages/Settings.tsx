import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const { currentUser, updateCurrentUser } = useAppContext();
  const [name, setName] = useState(currentUser?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveName = async () => {
    if (!name.trim()) {
      setMessage('Name cannot be empty');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      await updateCurrentUser({ name, initials });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="p-8 max-w-md pb-16">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        {/* Profile Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <button
              onClick={handleSaveName}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>

            {message && (
              <div className={`text-sm p-3 rounded-lg ${
                message.includes('successfully')
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Account Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 py-2 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
