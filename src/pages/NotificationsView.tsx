import React from 'react';
import { useAppContext } from '../AppContext';
import { format, parseISO } from 'date-fns';
import { Bell, Check, Clock, MessageSquare, AlertCircle, Trash2 } from 'lucide-react';

export default function NotificationsView() {
  const { notifications, markNotificationRead } = useAppContext();

  const getIcon = (type: string) => {
    switch(type) {
      case 'Overdue': return <AlertCircle className="h-5 w-5" />;
      case 'Comment': return <MessageSquare className="h-5 w-5" />;
      case 'Deadline': return <Clock className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  }

  const getIconColor = (type: string) => {
    switch(type) {
      case 'Overdue': return 'bg-red-50 text-red-600 border-red-100';
      case 'Comment': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Deadline': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto animate-in fade-in duration-500 flex flex-col pb-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">You have {unreadCount} unread message{unreadCount !== 1 && 's'}</p>
        </div>
        <button className="text-sm font-semibold text-gray-400 hover:text-black transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-6 flex items-start gap-5 transition-colors group relative ${
                !notif.isRead ? 'bg-orange-50/10' : 'bg-white hover:bg-gray-50/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${getIconColor(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 pr-12">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                  <span className="text-xs font-semibold text-gray-400 ml-auto">
                    {format(parseISO(notif.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className={`text-sm ${!notif.isRead ? 'text-gray-600 font-medium' : 'text-gray-500'}`}>
                  {notif.message}
                </p>
              </div>
              
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notif.isRead && (
                  <button 
                    onClick={() => markNotificationRead(notif.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:border-black hover:text-black hover:bg-gray-50 shadow-sm transition-colors"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
