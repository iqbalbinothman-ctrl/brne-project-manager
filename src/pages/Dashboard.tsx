import React from 'react';
import { useAppContext } from '../AppContext';
import { format, parseISO, isBefore } from 'date-fns';
import { FolderKanban, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { projects, tasks, setSelectedProjectId, setActiveTab, currentUser } = useAppContext();

  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const ongoingProjects = projects.filter(p => p.status === 'Ongoing').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && isBefore(parseISO(t.deadline), new Date())).length;

  const activeProjectsList = projects.filter(p => p.status !== 'Completed').slice(0, 4);

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 lg:p-12 animate-in fade-in duration-500 pb-16">

      {/* LEFT COLUMN */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-8 pt-4">

        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Hello {currentUser?.name?.split(' ')[0] || 'Alex'}!</h1>
            <p className="text-gray-500 text-sm font-medium">Here's your project overview.</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <p className="text-xs text-gray-500 font-semibold mb-2">Total Tasks</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{totalTasks}</span>
              <span className="text-xs text-gray-500">{completedTasks} done</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <p className="text-xs text-gray-500 font-semibold mb-2">Completion Rate</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
            </div>
          </div>
          {overdueTasks > 0 && (
            <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
              <p className="text-xs text-red-600 font-semibold mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">{overdueTasks}</span>
                <span className="text-xs text-red-500">task{overdueTasks !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>

        {/* Active Projects List */}
        <div className="pt-4 flex flex-col flex-1">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold">Active Projects</h2>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-sm font-semibold text-gray-500 hover:text-black transition-colors"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {activeProjectsList.map(project => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const projectCompletedTasks = projectTasks.filter(t => t.status === 'Done').length;

              return (
                <div
                  key={project.id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveTab('projects');
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{project.name}</h4>
                        <p className="text-xs text-gray-500 font-medium">{project.client}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                      project.status === 'Ongoing' ? 'border-orange-100 bg-orange-50 text-orange-700' : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className="font-bold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-black h-1.5 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>

                  {projectTasks.length > 0 && (
                    <div className="mt-3 text-xs text-gray-500 font-medium">
                      {projectCompletedTasks} of {projectTasks.length} tasks completed
                    </div>
                  )}
                </div>
              );
            })}
            {activeProjectsList.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-500 font-medium">
                No active projects. Create one to get started!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-6 pt-4">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600 font-semibold">Completed</span>
            </div>
            <span className="text-4xl font-bold text-gray-900">{completedProjects}</span>
            <p className="text-xs text-gray-500 font-medium mt-1">projects</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-2">
              <FolderKanban className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-gray-600 font-semibold">In Progress</span>
            </div>
            <span className="text-4xl font-bold text-gray-900">{ongoingProjects}</span>
            <p className="text-xs text-gray-500 font-medium mt-1">projects</p>
          </div>
        </div>

        {/* Task Status Overview */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-bold text-gray-900 mb-5">Task Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600 font-medium">Completed</span>
                <span className="font-bold text-gray-900">{completedTasks}/{totalTasks}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600 font-medium">In Progress</span>
                <span className="font-bold text-gray-900">{tasks.filter(t => t.status === 'In Progress').length}/{totalTasks}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${totalTasks > 0 ? (tasks.filter(t => t.status === 'In Progress').length / totalTasks) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600 font-medium">Todo</span>
                <span className="font-bold text-gray-900">{tasks.filter(t => t.status === 'Todo').length}/{totalTasks}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full transition-all" style={{ width: `${totalTasks > 0 ? (tasks.filter(t => t.status === 'Todo').length / totalTasks) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Links</h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('projects')}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              📋 View All Projects
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              📅 Calendar & Deadlines
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              🔗 Resource Links
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
