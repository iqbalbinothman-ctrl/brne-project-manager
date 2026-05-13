import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { format, parseISO, addDays } from 'date-fns';
import { ChevronRight, Plus, Users, Clock, CheckSquare, MessageSquare, Paperclip, AlertCircle, Circle, FolderKanban, X, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';

export default function Projects() {
  const { projects, users, selectedProjectId, setSelectedProjectId, addProject } = useAppContext();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    client: '',
    dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
  });

  const handleCreateProject = () => {
    if (!newProjectForm.name.trim() || !newProjectForm.client.trim()) return;

    const newProject = {
      id: `p${Date.now()}`,
      name: newProjectForm.name,
      client: newProjectForm.client,
      status: 'Ongoing' as const,
      progress: 0,
      dueDate: newProjectForm.dueDate,
      teamMembers: [],
    };

    addProject(newProject);
    setShowNewProjectModal(false);
    setNewProjectForm({
      name: '',
      client: '',
      dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    });
  };

  if (selectedProjectId) {
    return <ProjectDetail projectId={selectedProjectId} />;
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-in fade-in duration-500 h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Projects</h2>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Create New Project</h3>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProjectForm.name}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                  placeholder="e.g., Website Redesign"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Client</label>
                <input
                  type="text"
                  value={newProjectForm.client}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, client: e.target.value })}
                  placeholder="e.g., Acme Corp"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newProjectForm.dueDate}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectForm.name.trim() || !newProjectForm.client.trim()}
                className="flex-1 px-4 py-2.5 bg-black text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between group hover:shadow-md cursor-pointer transition-all duration-200 gap-6 md:gap-4"
            onClick={() => setSelectedProjectId(project.id)}
          >
            <div className="flex items-center gap-6 md:w-1/3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm border border-orange-100 shrink-0">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div className="truncate">
                <h4 className="font-bold text-gray-900 text-base truncate">{project.name}</h4>
                <p className="text-sm text-gray-500 font-medium mt-0.5 truncate">by {project.client}</p>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-between md:px-8">
              <div className="flex flex-col gap-1 w-32 hidden md:flex">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-black h-1.5 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="hidden sm:block">
                 <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                    project.status === 'Completed' ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-default' :
                    project.status === 'Ongoing' ? 'border-orange-100 bg-orange-50 text-orange-700' :
                    'border-gray-200 text-gray-700 bg-white'
                  }`}>
                    {project.status}
                  </span>
              </div>

              <div className="hidden lg:flex -space-x-2">
                 {project.teamMembers.map((id, index) => {
                   const u = users.find(user => user.id === id);
                   return <div key={id} className="w-8 h-8 bg-gray-100 text-gray-600 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-transparent" style={{zIndex: 10 - index}}>{u?.initials}</div>
                 })}
              </div>

              <div className="text-right text-sm text-gray-500 font-semibold w-24">
                {format(parseISO(project.dueDate), 'MMM d')}
              </div>
            </div>

            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors border border-gray-100 hidden md:flex shrink-0">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetail({ projectId }: { projectId: string }) {
  const { projects, tasks, setSelectedProjectId, users, addTask, deleteProject, deleteTask, selectedTaskId, setSelectedTaskId, updateProject, addTeamMemberToProject, removeTeamMemberFromProject } = useAppContext();
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium' as const,
    deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    assignees: [] as string[],
  });
  const [editForm, setEditForm] = useState({
    name: '',
    client: '',
    status: 'Ongoing' as const,
    dueDate: '',
    progress: 0,
  });

  const project = projects.find(p => p.id === projectId);

  if (!project) return null;

  const handleOpenEditModal = () => {
    setEditForm({
      name: project.name,
      client: project.client,
      status: project.status,
      dueDate: project.dueDate.split('T')[0],
      progress: project.progress,
    });
    setShowEditModal(true);
  };

  const handleSaveProject = () => {
    updateProject(projectId, {
      name: editForm.name,
      client: editForm.client,
      status: editForm.status,
      dueDate: editForm.dueDate,
      progress: editForm.progress,
    });
    setShowEditModal(false);
  };

  const projectTasks = tasks.filter(t => t.projectId === projectId);

  const getAssigneeInitials = (userIds: string[]) => {
    return userIds.map(id => users.find(u => u.id === id)?.initials).filter(Boolean);
  }

  const handleCreateTask = () => {
    if (!newTaskForm.title.trim()) return;

    const newTask: Task = {
      id: `t${Date.now()}`,
      projectId,
      title: newTaskForm.title,
      description: newTaskForm.description,
      assignees: newTaskForm.assignees,
      priority: newTaskForm.priority,
      status: 'Todo',
      deadline: newTaskForm.deadline,
      checklist: [],
      comments: [],
    };

    addTask(newTask);
    setShowNewTaskModal(false);
    setNewTaskForm({
      title: '',
      description: '',
      priority: 'Medium',
      deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      assignees: [],
    });
  };

  const handleDeleteProject = () => {
    deleteProject(projectId);
    setSelectedProjectId(null);
  };

  if (selectedTaskId) {
    const selectedTask = tasks.find(t => t.id === selectedTaskId);
    if (selectedTask) {
      return <TaskDetail task={selectedTask} projectId={projectId} />;
    }
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-in slide-in-from-right-4 duration-300">
      <button 
        onClick={() => setSelectedProjectId(null)}
        className="text-sm font-semibold text-gray-400 hover:text-black mb-8 flex items-center transition-colors px-4 py-2 bg-gray-50 rounded-full w-fit hover:bg-gray-100"
      >
        <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
        Back to projects
      </button>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{project.name}</h2>
          <p className="text-sm font-medium text-gray-500">
             {project.client} <span className="mx-2">&bull;</span> Due {format(parseISO(project.dueDate), 'MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex -space-x-3">
            {project.teamMembers.map((id, i) => {
              const u = users.find(user => user.id === id);
              return (
                <button
                  key={id}
                  onClick={() => removeTeamMemberFromProject(projectId, id)}
                  title={`Click to remove ${u?.name}`}
                  className="w-10 h-10 bg-gray-100 text-gray-600 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                  style={{ zIndex: 10 - i }}
                >
                  {u?.initials}
                </button>
              )
            })}
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="w-10 h-10 bg-white text-gray-400 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-sm font-bold hover:bg-gray-50 transition-colors z-0 hover:text-black hover:border-gray-400"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleOpenEditModal}
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
          >
            Edit details
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-gray-100 hover:border-red-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in fade-in duration-200">
              <h3 className="text-2xl font-bold text-red-600 mb-2">Delete Project?</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete "{project.name}" and all of its tasks. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add Team Member</h3>
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">Select a user to add to this project</p>
              <div className="space-y-2">
                {users.map(user => {
                  const isAlreadyMember = project.teamMembers.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        if (!isAlreadyMember) {
                          addTeamMemberToProject(projectId, user.id);
                          setShowAddTeamModal(false);
                        }
                      }}
                      disabled={isAlreadyMember}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        isAlreadyMember
                          ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {user.initials}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        {isAlreadyMember && (
                          <p className="text-xs text-gray-500">Already a member</p>
                        )}
                      </div>
                      {isAlreadyMember && (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowAddTeamModal(false)}
              className="w-full px-4 py-2.5 border border-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Edit Project Details</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Client</label>
                <input
                  type="text"
                  value={editForm.client}
                  onChange={(e) => setEditForm({ ...editForm, client: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                >
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Progress: {editForm.progress}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editForm.progress}
                  onChange={(e) => setEditForm({ ...editForm, progress: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="flex-1 px-4 py-2.5 bg-black text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Create New Task</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  placeholder="e.g., Design mockups"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  placeholder="Task details..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTaskForm.deadline}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                <div className="space-y-2">
                  {users.map(user => (
                    <label key={user.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTaskForm.assignees.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewTaskForm({ ...newTaskForm, assignees: [...newTaskForm.assignees, user.id] });
                          } else {
                            setNewTaskForm({ ...newTaskForm, assignees: newTaskForm.assignees.filter(id => id !== user.id) });
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTaskForm.title.trim()}
                className="flex-1 px-4 py-2.5 bg-black text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Tasks</h3>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="text-sm font-semibold text-gray-500 hover:text-black flex items-center transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </button>
          </div>
          
          <div className="flex flex-col space-y-3">
            {projectTasks.map(task => (
              <div
                key={task.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 group cursor-pointer"
                onClick={() => setSelectedTaskId(task.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 flex-1">
                    <button className={`mt-0.5 text-gray-400 hover:text-black transition-colors w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${task.status === 'Done' ? 'border-black bg-black text-white' : 'border-gray-300'}`}>
                      {task.status === 'Done' && <CheckSquare className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-base font-bold ${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h4>
                      {task.description && <p className="text-sm text-gray-500 font-medium mt-1">{task.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                      task.priority === 'Urgent' ? 'border-red-100 bg-red-50 text-red-600' :
                      'border-gray-100 bg-gray-50 text-gray-600'
                    }`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status and metadata row */}
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 ml-10 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md font-medium ${
                      task.status === 'Todo' ? 'bg-blue-100 text-blue-700' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.status}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {format(parseISO(task.deadline), 'MMM d, yyyy')}
                    </span>
                    {task.checklist.length > 0 && (
                      <span className="flex items-center">
                        <CheckSquare className="w-4 h-4 mr-1.5" />
                        {task.checklist.filter(c => c.completed).length}/{task.checklist.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center -space-x-2">
                    {getAssigneeInitials(task.assignees).map((initials, i) => (
                      <div key={i} className="w-7 h-7 bg-gray-100 text-gray-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm z-10" style={{ zIndex: 10 - i }}>
                        {initials}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {projectTasks.length === 0 && (
              <div className="p-12 text-center text-sm font-medium text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                No tasks create yet. Click "Add Task" to get started.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Status Overview</h3>
            <div className="flex items-center justify-between mb-3 text-sm font-semibold text-gray-600">
              <span>Overall Progress</span>
              <span className="text-black">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
              <div className="bg-black h-2 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Status</span>
                <span className="font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">{project.status}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Start Date</span>
                <span className="font-semibold text-gray-900">Oct 1, 2026</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">End Date</span>
                <span className="font-semibold text-gray-900">{format(parseISO(project.dueDate), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          
          <ResourceLinksSection projectId={projectId} links={project.resourceLinks || []} isProject={true} />
        </div>
      </div>
    </div>
  );
}

function TaskDetail({ task, projectId }: { task: Task; projectId: string }) {
  const { setSelectedTaskId, users, toggleTaskStatus, updateTaskDeadline } = useAppContext();
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(7);
  const [extendReason, setExtendReason] = useState('');

  const assignedUsers = users.filter(u => task.assignees.includes(u.id));

  const handleExtendDeadline = () => {
    if (!extendReason.trim()) return;

    const currentDeadline = parseISO(task.deadline);
    const newDeadline = addDays(currentDeadline, extendDays);
    updateTaskDeadline(task.id, newDeadline.toISOString(), extendReason);
    setShowExtendModal(false);
    setExtendDays(7);
    setExtendReason('');
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-in slide-in-from-right-4 duration-300">
      <button
        onClick={() => setSelectedTaskId(null)}
        className="text-sm font-semibold text-gray-400 hover:text-black mb-8 flex items-center transition-colors px-4 py-2 bg-gray-50 rounded-full w-fit hover:bg-gray-100"
      >
        <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
        Back to tasks
      </button>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] mb-8">
        {/* Title and Priority */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight mb-2">{task.title}</h2>
            {task.description && (
              <p className="text-gray-600 font-medium">{task.description}</p>
            )}
          </div>
          <span className={`inline-flex px-4 py-2 text-xs font-semibold rounded-full border whitespace-nowrap ${
            task.priority === 'Urgent' ? 'border-red-100 bg-red-50 text-red-600' :
            task.priority === 'High' ? 'border-orange-100 bg-orange-50 text-orange-600' :
            'border-gray-100 bg-gray-50 text-gray-600'
          }`}>
            {task.priority} Priority
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-8"></div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Status</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => toggleTaskStatus(task.id, 'Todo')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors text-left ${
                  task.status === 'Todo'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => toggleTaskStatus(task.id, 'In Progress')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors text-left ${
                  task.status === 'In Progress'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => toggleTaskStatus(task.id, 'Done')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors text-left ${
                  task.status === 'Done'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Due Date</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">{format(parseISO(task.deadline), 'MMM d, yyyy')}</p>
              <button
                onClick={() => setShowExtendModal(true)}
                className="text-xs font-semibold text-gray-500 hover:text-black px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Extend
              </button>
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Assigned To</p>
            {assignedUsers.length > 0 ? (
              <div className="space-y-2">
                {assignedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {user.initials}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Unassigned</p>
            )}
          </div>
        </div>
      </div>

      {/* Resource Links */}
      <ResourceLinksSection taskId={task.id} links={task.resourceLinks || []} isProject={false} />

      {/* Extension History */}
      {task.deadlineExtensions && task.deadlineExtensions.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
          <h3 className="text-lg font-bold mb-4">Deadline Extension History</h3>
          <div className="space-y-3">
            {task.deadlineExtensions.map((ext) => (
              <div key={ext.id} className="border-l-4 border-orange-400 pl-4 py-2">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {format(parseISO(ext.originalDeadline), 'MMM d')} → {format(parseISO(ext.newDeadline), 'MMM d, yyyy')}
                  </p>
                  <span className="text-xs text-gray-500">{format(parseISO(ext.extendedAt), 'MMM d, HH:mm')}</span>
                </div>
                <p className="text-sm text-gray-600">{ext.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showExtendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Extend Deadline</h3>
              <button
                onClick={() => setShowExtendModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Current deadline: <span className="font-semibold text-gray-900">{format(parseISO(task.deadline), 'MMM d, yyyy')}</span>
              </p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Extend by (days)</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 3, 7].map(days => (
                    <button
                      key={days}
                      onClick={() => setExtendDays(days)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        extendDays === days
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      +{days}d
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="number"
                    min="1"
                    value={extendDays}
                    onChange={(e) => setExtendDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                  />
                  <span className="text-sm font-medium text-gray-600">days</span>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  New deadline: <span className="font-semibold text-gray-900">{format(addDays(parseISO(task.deadline), extendDays), 'MMM d, yyyy')}</span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Extension *</label>
                <textarea
                  value={extendReason}
                  onChange={(e) => setExtendReason(e.target.value)}
                  placeholder="e.g., Third-party API delays, waiting for client feedback, resource constraints, etc."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExtendModal(false);
                  setExtendReason('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExtendDeadline}
                disabled={!extendReason.trim()}
                className="flex-1 px-4 py-2.5 bg-black text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Extend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceLinksSection({ projectId, taskId, links, isProject }: { projectId?: string; taskId?: string; links: any[]; isProject: boolean }) {
  const { addResourceLinkToProject, removeResourceLinkFromProject, addResourceLinkToTask, removeResourceLinkFromTask } = useAppContext();
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleAddLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;

    if (isProject && projectId) {
      addResourceLinkToProject(projectId, linkTitle, linkUrl);
    } else if (!isProject && taskId) {
      addResourceLinkToTask(taskId, linkTitle, linkUrl);
    }

    setLinkTitle('');
    setLinkUrl('');
    setShowAddLink(false);
  };

  const handleRemoveLink = (linkId: string) => {
    if (isProject && projectId) {
      removeResourceLinkFromProject(projectId, linkId);
    } else if (!isProject && taskId) {
      removeResourceLinkFromTask(taskId, linkId);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center justify-between">
          Resource Links
          <button
            onClick={() => setShowAddLink(true)}
            className="text-xs font-semibold text-gray-500 hover:text-black px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Link
          </button>
        </h3>

        {links.length > 0 ? (
          <div className="space-y-3">
            {links.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <LinkIcon className="h-5 w-5 text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{link.title}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveLink(link.id);
                  }}
                  className="ml-3 p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm font-medium text-gray-500 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            No resource links added yet.
          </div>
        )}
      </div>

      {showAddLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add Resource Link</h3>
              <button
                onClick={() => setShowAddLink(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Link Title</label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="e.g., Design Mockup, API Documentation"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddLink(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                disabled={!linkTitle.trim() || !linkUrl.trim()}
                className="flex-1 px-4 py-2.5 bg-black text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
