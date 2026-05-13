import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter, isBefore } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';

export default function CalendarView() {
  const { tasks, projects, setSelectedProjectId, setSelectedTaskId } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Find items for a specific day
  const getDayItems = (day: Date) => {
    const todayTasks = tasks.filter(t => isSameDay(parseISO(t.deadline), day));
    const todayProjects = projects.filter(p => isSameDay(parseISO(p.dueDate), day));
    return { todayTasks, todayProjects };
  };

  if (selectedDay) {
    const { todayTasks, todayProjects } = getDayItems(selectedDay);
    return <DayDetailView day={selectedDay} tasks={todayTasks} projects={todayProjects} onBack={() => setSelectedDay(null)} />;
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-500 w-full flex flex-col pb-16">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{format(currentDate, 'MMMM yyyy')}</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Timeline & Deadlines</p>
          </div>
        </div>
        <div className="flex bg-white rounded-full border border-gray-200 shadow-sm overflow-hidden p-1">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col p-4 sm:p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {/* Pad beginning of month */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-start-${i}`} className="bg-transparent rounded-2xl" />
          ))}

          {/* Days */}
          {days.map((day, i) => {
            const { todayTasks, todayProjects } = getDayItems(day);
            const isToday = isSameDay(day, new Date());
            const itemCount = todayTasks.length + todayProjects.length;

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDay(day)}
                className={`min-h-[120px] p-2 sm:p-3 rounded-2xl transition-all border cursor-pointer ${
                  isToday ? 'bg-orange-50 border-orange-200 shadow-sm ring-1 ring-orange-200 hover:shadow-md' : 'bg-gray-50/50 border-gray-100 hover:border-gray-300 hover:shadow-sm'
                } relative group flex flex-col`}
              >
                <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${
                  isToday ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-700'
                }`}>
                  {format(day, 'd')}
                </div>

                <div className="flex-1 space-y-1 min-h-0">
                  {todayProjects.slice(0, 2).map(p => (
                    <div key={p.id} className="text-[10px] font-bold px-2 py-1.5 bg-black text-white rounded-lg shadow-sm truncate cursor-pointer hover:bg-gray-800">
                      DUE: {p.name}
                    </div>
                  ))}
                  {todayTasks.slice(0, 2).map(t => {
                    const isOverdue = t.status !== 'Done' && isBefore(parseISO(t.deadline), new Date());
                    return (
                      <div key={t.id} className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg truncate border shadow-sm cursor-pointer transition-colors ${
                        isOverdue ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}>
                        {t.title}
                      </div>
                    )
                  })}
                  {itemCount > 2 && (
                    <div className="text-[10px] font-semibold text-gray-500 px-2 py-1">
                      +{itemCount - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pad end of month */}
          {Array.from({ length: 42 - days.length - monthStart.getDay() }).map((_, i) => (
            <div key={`empty-end-${i}`} className="bg-transparent rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayDetailView({ day, tasks, projects, onBack }: { day: Date; tasks: any[]; projects: any[]; onBack: () => void }) {
  const { setSelectedProjectId, setSelectedTaskId } = useAppContext();

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-in slide-in-from-right-4 duration-300 pb-16">
      <button
        onClick={onBack}
        className="text-sm font-semibold text-gray-400 hover:text-black mb-8 flex items-center transition-colors px-4 py-2 bg-gray-50 rounded-full w-fit hover:bg-gray-100"
      >
        <ChevronRightIcon className="h-4 w-4 mr-1 rotate-180" />
        Back to calendar
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">{format(day, 'EEEE, MMMM d, yyyy')}</h2>
        <p className="text-sm font-medium text-gray-500">
          {tasks.length + projects.length} item{tasks.length + projects.length !== 1 ? 's' : ''} due
        </p>
      </div>

      <div className="space-y-4">
        {/* Projects due */}
        {projects.map(project => (
          <div
            key={project.id}
            onClick={() => setSelectedProjectId(project.id)}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                <p className="text-sm text-gray-500 font-medium">Client: {project.client}</p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border mt-3 ${
                  project.status === 'Completed' ? 'border-gray-200 bg-gray-50 text-gray-500' :
                  project.status === 'Ongoing' ? 'border-orange-100 bg-orange-50 text-orange-700' :
                  'border-gray-200 text-gray-700 bg-white'
                }`}>
                  {project.status}
                </span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
            </div>
          </div>
        ))}

        {/* Tasks due */}
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => setSelectedTaskId(task.id)}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-500 font-medium mb-3">{task.description}</p>
                )}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                    task.status === 'Todo' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    'bg-green-100 text-green-700 border-green-200'
                  }`}>
                    {task.status}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                    task.priority === 'Urgent' ? 'border-red-100 bg-red-50 text-red-600' :
                    'border-gray-100 bg-gray-50 text-gray-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors shrink-0 mt-1" />
            </div>
          </div>
        ))}

        {projects.length === 0 && tasks.length === 0 && (
          <div className="p-12 text-center text-sm font-medium text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            No tasks or projects due on this day
          </div>
        )}
      </div>
    </div>
  );
}
