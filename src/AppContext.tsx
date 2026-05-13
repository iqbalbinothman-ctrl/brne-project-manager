import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Project, Task, User, AppFile, NotificationRecord } from './types';
import { projects as initialProjects, tasks as initialTasks, users as initialUsers, files as initialFiles, notifications as initialNotifs } from './mockData';
import { supabase } from './lib/supabase';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  users: User[];
  files: AppFile[];
  notifications: NotificationRecord[];
  currentUser: User | null;

  // App state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;

  // Actions
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

export const AppProvider = ({ children, session }: { children: ReactNode, session: Session }) => {
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

  const calculateProjectProgress = (projectId: string, taskList: Task[]) => {
    const projectTasks = taskList.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const updateProjectStatusIfNeeded = (projectId: string, taskList: Task[]) => {
    const projectTasks = taskList.filter(t => t.projectId === projectId);
    const allTasksCompleted = projectTasks.length > 0 && projectTasks.every(t => t.status === 'Done');

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: allTasksCompleted ? 'Completed' : p.status,
          progress: calculateProjectProgress(projectId, taskList),
        };
      }
      return p;
    }));
  };

  const toggleTaskStatus = (taskId: string, status: Task['status']) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    setTasks(updatedTasks);

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateProjectStatusIfNeeded(task.projectId, updatedTasks);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    setActiveTab('projects');
  };

  const addTask = (task: Task) => {
    const updatedTasks = [task, ...tasks];
    setTasks(updatedTasks);
    updateProjectStatusIfNeeded(task.projectId, updatedTasks);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);

    if (taskToDelete) {
      updateProjectStatusIfNeeded(taskToDelete.projectId, updatedTasks);
    }
  };

  const updateTaskDeadline = (taskId: string, newDeadline: string, reason: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const extension = {
          id: `ext${Date.now()}`,
          originalDeadline: t.deadline,
          newDeadline,
          reason,
          extendedAt: new Date().toISOString(),
          extendedBy: currentUser.id,
        };
        return {
          ...t,
          deadline: newDeadline,
          deadlineExtensions: [...(t.deadlineExtensions || []), extension],
        };
      }
      return t;
    }));
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
  };

  const addResourceLinkToTask = (taskId: string, title: string, url: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newLink = {
          id: `link${Date.now()}`,
          title,
          url,
        };
        return {
          ...t,
          resourceLinks: [...(t.resourceLinks || []), newLink],
        };
      }
      return t;
    }));
  };

  const removeResourceLinkFromTask = (taskId: string, linkId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          resourceLinks: (t.resourceLinks || []).filter(l => l.id !== linkId),
        };
      }
      return t;
    }));
  };

  const addResourceLinkToProject = (projectId: string, title: string, url: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newLink = {
          id: `link${Date.now()}`,
          title,
          url,
        };
        return {
          ...p,
          resourceLinks: [...(p.resourceLinks || []), newLink],
        };
      }
      return p;
    }));
  };

  const removeResourceLinkFromProject = (projectId: string, linkId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          resourceLinks: (p.resourceLinks || []).filter(l => l.id !== linkId),
        };
      }
      return p;
    }));
  };

  const addTeamMemberToProject = (projectId: string, userId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && !p.teamMembers.includes(userId)) {
        return {
          ...p,
          teamMembers: [...p.teamMembers, userId],
        };
      }
      return p;
    }));
  };

  const removeTeamMemberFromProject = (projectId: string, userId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          teamMembers: p.teamMembers.filter(id => id !== userId),
        };
      }
      return p;
    }));
  };

  const updateCurrentUser = async (updates: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', session.user.id);

    if (error) {
      console.error('Failed to update user profile:', error);
      // Revert on error
      setCurrentUser(currentUser);
    }
  };

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch current user profile from Supabase
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          setCurrentUser(userData as User);
        } else if (userError && userError.code !== 'PGRST116') {
          // PGRST116 means no rows found, which is expected for new users
          throw userError;
        }

        // Fetch projects from Supabase
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', session.user.id);

        if (projectsError) throw projectsError;
        if (projectsData) setProjects(projectsData as Project[]);

        // Fetch tasks from Supabase
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', session.user.id);

        if (tasksError) throw tasksError;
        if (tasksData) setTasks(tasksData as Task[]);
      } catch (error) {
        console.error('Failed to load data from Supabase:', error);
        // Fall back to initial data
        setCurrentUser(users[0]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates for users (profile changes)
    const usersChannel = supabase
      .channel('users')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${session.user.id}` },
        (payload) => {
          setCurrentUser(payload.new as User);
        }
      )
      .subscribe();

    // Subscribe to real-time updates for projects
    const projectsChannel = supabase
      .channel('projects')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${session.user.id}` },
        (payload) => {
          loadData();
        }
      )
      .subscribe();

    // Subscribe to real-time updates for tasks
    const tasksChannel = supabase
      .channel('tasks')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${session.user.id}` },
        (payload) => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [session.user.id]);

  // Save projects to Supabase whenever they change
  useEffect(() => {
    if (loading) return;

    const syncProjects = async () => {
      for (const project of projects) {
        const { error } = await supabase
          .from('projects')
          .upsert({
            ...project,
            user_id: session.user.id,
          });

        if (error) console.error('Failed to sync project:', error);
      }
    };

    syncProjects();
  }, [projects, session.user.id, loading]);

  // Save tasks to Supabase whenever they change
  useEffect(() => {
    if (loading) return;

    const syncTasks = async () => {
      for (const task of tasks) {
        const { error } = await supabase
          .from('tasks')
          .upsert({
            ...task,
            user_id: session.user.id,
          });

        if (error) console.error('Failed to sync task:', error);
      }
    };

    syncTasks();
  }, [tasks, session.user.id, loading]);

  return (
    <AppContext.Provider value={{
      projects, tasks, users, files, notifications, currentUser,
      activeTab, setActiveTab, selectedProjectId, setSelectedProjectId, selectedTaskId, setSelectedTaskId,
      toggleTaskStatus, markNotificationRead, addProject, addTask, deleteProject, deleteTask, updateTaskDeadline, updateProject, updateCurrentUser,
      addResourceLinkToTask, removeResourceLinkFromTask, addResourceLinkToProject, removeResourceLinkFromProject,
      addTeamMemberToProject, removeTeamMemberFromProject
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
