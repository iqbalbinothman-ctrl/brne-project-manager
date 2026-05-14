import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Project, Task, User, AppFile, NotificationRecord } from './types';
import { users as initialUsers, files as initialFiles } from './mockData';
import { supabase } from './lib/supabase';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  users: User[];
  files: AppFile[];
  notifications: NotificationRecord[];
  currentUser: User | null;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;

  toggleTaskStatus: (taskId: string, status: Task['status']) => void;
  markNotificationRead: (id: string) => void;
  addProject: (project: Project) => void;
  addTask: (task: Task) => void;
  deleteProject: (projectId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTaskDeadline: (taskId: string, newDeadline: string, reason: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  updateCurrentUser: (updates: Partial<User>) => Promise<void>;
  addResourceLinkToTask: (taskId: string, title: string, url: string) => void;
  removeResourceLinkFromTask: (taskId: string, linkId: string) => void;
  addResourceLinkToProject: (projectId: string, title: string, url: string) => void;
  removeResourceLinkFromProject: (projectId: string, linkId: string) => void;
  addTeamMemberToProject: (projectId: string, userId: string) => void;
  removeTeamMemberFromProject: (projectId: string, userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Map DB row → Project
function dbToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    client: row.client,
    status: row.status,
    progress: row.progress ?? 0,
    dueDate: row.due_date,
    teamMembers: row.team_members ?? [],
    resourceLinks: row.resource_links ?? [],
  };
}

// Map Project → DB row
function projectToDb(project: Project, userId: string) {
  return {
    id: project.id,
    user_id: userId,
    name: project.name,
    client: project.client,
    status: project.status,
    progress: project.progress,
    due_date: project.dueDate,
    team_members: project.teamMembers,
    resource_links: project.resourceLinks ?? [],
  };
}

// Map DB row → Task
function dbToTask(row: any): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description ?? '',
    assignees: row.assignees ?? [],
    priority: row.priority ?? 'Medium',
    status: row.status ?? 'Todo',
    deadline: row.deadline,
    checklist: row.checklist ?? [],
    comments: row.comments ?? [],
    deadlineExtensions: row.deadline_extensions ?? [],
    resourceLinks: row.resource_links ?? [],
  };
}

// Map Task → DB row
function taskToDb(task: Task, userId: string) {
  return {
    id: task.id,
    user_id: userId,
    project_id: task.projectId,
    title: task.title,
    description: task.description,
    assignees: task.assignees,
    priority: task.priority,
    status: task.status,
    deadline: task.deadline,
    checklist: task.checklist,
    comments: task.comments,
    deadline_extensions: task.deadlineExtensions ?? [],
    resource_links: task.resourceLinks ?? [],
  };
}

export const AppProvider = ({ children, session }: { children: ReactNode; session: Session }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users] = useState<User[]>(initialUsers);
  const [files] = useState<AppFile[]>(initialFiles);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const userId = session.user.id;

  const calculateProjectProgress = (projectId: string, taskList: Task[]) => {
    const projectTasks = taskList.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    return Math.round((projectTasks.filter(t => t.status === 'Done').length / projectTasks.length) * 100);
  };

  const loadData = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userData) {
        setCurrentUser(userData as User);
      } else if (userError?.code === 'PGRST116') {
        // No profile row yet — create one so projects/tasks FK is satisfied
        const newProfile = {
          id: userId,
          email: session.user.email || '',
          name: session.user.email?.split('@')[0] || 'User',
          initials: (session.user.email?.charAt(0).toUpperCase() || '?'),
        };
        const { data: created, error: createError } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single();
        if (createError) {
          console.error('Failed to create user profile:', createError);
          setCurrentUser(newProfile as User);
        } else {
          setCurrentUser(created as User);
        }
      } else if (userError) {
        throw userError;
      }

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects((projectsData ?? []).map(dbToProject));

      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;
      setTasks((tasksData ?? []).map(dbToTask));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const addProject = async (project: Project) => {
    // Optimistic update
    setProjects(prev => [project, ...prev]);

    const { error } = await supabase
      .from('projects')
      .insert(projectToDb(project, userId));

    if (error) {
      console.error('Failed to create project:', error);
      alert(`Failed to create project: ${error.message}`);
      // Revert
      setProjects(prev => prev.filter(p => p.id !== project.id));
    }
  };

  const addTask = async (task: Task) => {
    const updatedTasks = [task, ...tasks];
    setTasks(updatedTasks);

    // Update project progress optimistically
    const newProgress = calculateProjectProgress(task.projectId, updatedTasks);
    setProjects(prev => prev.map(p =>
      p.id === task.projectId ? { ...p, progress: newProgress } : p
    ));

    const { error } = await supabase
      .from('tasks')
      .insert(taskToDb(task, userId));

    if (error) {
      console.error('Failed to create task:', error);
      setTasks(tasks);
    } else {
      // Sync project progress to DB
      const project = projects.find(p => p.id === task.projectId);
      if (project) {
        await supabase
          .from('projects')
          .update({ progress: newProgress })
          .eq('id', task.projectId);
      }
    }
  };

  const deleteProject = async (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) console.error('Failed to delete project:', error);
  };

  const deleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);

    if (taskToDelete) {
      const newProgress = calculateProjectProgress(taskToDelete.projectId, updatedTasks);
      setProjects(prev => prev.map(p =>
        p.id === taskToDelete.projectId ? { ...p, progress: newProgress } : p
      ));

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Failed to delete task:', error);
      } else {
        await supabase
          .from('projects')
          .update({ progress: newProgress })
          .eq('id', taskToDelete.projectId);
      }
    }
  };

  const toggleTaskStatus = async (taskId: string, status: Task['status']) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    setTasks(updatedTasks);

    const task = updatedTasks.find(t => t.id === taskId);
    if (task) {
      const newProgress = calculateProjectProgress(task.projectId, updatedTasks);
      const allDone = updatedTasks.filter(t => t.projectId === task.projectId).every(t => t.status === 'Done');

      setProjects(prev => prev.map(p =>
        p.id === task.projectId
          ? { ...p, progress: newProgress, status: allDone ? 'Completed' : p.status }
          : p
      ));

      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) console.error('Failed to update task status:', error);

      await supabase
        .from('projects')
        .update({ progress: newProgress, ...(allDone ? { status: 'Completed' } : {}) })
        .eq('id', task.projectId);
    }
  };

  const updateTaskDeadline = async (taskId: string, newDeadline: string, reason: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const extension = {
      id: `ext${Date.now()}`,
      originalDeadline: task.deadline,
      newDeadline,
      reason,
      extendedAt: new Date().toISOString(),
      extendedBy: currentUser?.id ?? '',
    };

    const updatedExtensions = [...(task.deadlineExtensions || []), extension];

    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, deadline: newDeadline, deadlineExtensions: updatedExtensions }
        : t
    ));

    const { error } = await supabase
      .from('tasks')
      .update({ deadline: newDeadline, deadline_extensions: updatedExtensions })
      .eq('id', taskId);

    if (error) console.error('Failed to update task deadline:', error);
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.client !== undefined) dbUpdates.client = updates.client;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
    if (updates.teamMembers !== undefined) dbUpdates.team_members = updates.teamMembers;
    if (updates.resourceLinks !== undefined) dbUpdates.resource_links = updates.resourceLinks;

    const { error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', projectId);

    if (error) console.error('Failed to update project:', error);
  };

  const addResourceLinkToTask = async (taskId: string, title: string, url: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newLink = { id: `link${Date.now()}`, title, url };
    const updatedLinks = [...(task.resourceLinks || []), newLink];

    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, resourceLinks: updatedLinks } : t
    ));

    const { error } = await supabase
      .from('tasks')
      .update({ resource_links: updatedLinks })
      .eq('id', taskId);

    if (error) console.error('Failed to add resource link to task:', error);
  };

  const removeResourceLinkFromTask = async (taskId: string, linkId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedLinks = (task.resourceLinks || []).filter(l => l.id !== linkId);

    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, resourceLinks: updatedLinks } : t
    ));

    const { error } = await supabase
      .from('tasks')
      .update({ resource_links: updatedLinks })
      .eq('id', taskId);

    if (error) console.error('Failed to remove resource link from task:', error);
  };

  const addResourceLinkToProject = async (projectId: string, title: string, url: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newLink = { id: `link${Date.now()}`, title, url };
    const updatedLinks = [...(project.resourceLinks || []), newLink];

    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, resourceLinks: updatedLinks } : p
    ));

    const { error } = await supabase
      .from('projects')
      .update({ resource_links: updatedLinks })
      .eq('id', projectId);

    if (error) console.error('Failed to add resource link to project:', error);
  };

  const removeResourceLinkFromProject = async (projectId: string, linkId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedLinks = (project.resourceLinks || []).filter(l => l.id !== linkId);

    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, resourceLinks: updatedLinks } : p
    ));

    const { error } = await supabase
      .from('projects')
      .update({ resource_links: updatedLinks })
      .eq('id', projectId);

    if (error) console.error('Failed to remove resource link from project:', error);
  };

  const addTeamMemberToProject = async (projectId: string, memberId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.teamMembers.includes(memberId)) return;

    const updatedMembers = [...project.teamMembers, memberId];

    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, teamMembers: updatedMembers } : p
    ));

    const { error } = await supabase
      .from('projects')
      .update({ team_members: updatedMembers })
      .eq('id', projectId);

    if (error) console.error('Failed to add team member:', error);
  };

  const removeTeamMemberFromProject = async (projectId: string, memberId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedMembers = project.teamMembers.filter(id => id !== memberId);

    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, teamMembers: updatedMembers } : p
    ));

    const { error } = await supabase
      .from('projects')
      .update({ team_members: updatedMembers })
      .eq('id', projectId);

    if (error) console.error('Failed to remove team member:', error);
  };

  const updateCurrentUser = async (updates: Partial<User>) => {
    if (!currentUser) return;

    const optimisticUser = { ...currentUser, ...updates };
    setCurrentUser(optimisticUser);

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      if (data) setCurrentUser(data as User);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      setCurrentUser(currentUser);
      throw error;
    }
  };

  if (loading) return null;

  return (
    <AppContext.Provider value={{
      projects, tasks, users, files, notifications, currentUser,
      activeTab, setActiveTab, selectedProjectId, setSelectedProjectId, selectedTaskId, setSelectedTaskId,
      toggleTaskStatus, markNotificationRead, addProject, addTask, deleteProject, deleteTask,
      updateTaskDeadline, updateProject, updateCurrentUser,
      addResourceLinkToTask, removeResourceLinkFromTask,
      addResourceLinkToProject, removeResourceLinkFromProject,
      addTeamMemberToProject, removeTeamMemberFromProject,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
