import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Task, User, AppFile, NotificationRecord } from './types';
import { projects as initialProjects, tasks as initialTasks, users as initialUsers, files as initialFiles, notifications as initialNotifs } from './mockData';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  users: User[];
  files: AppFile[];
  notifications: NotificationRecord[];
  currentUser: User;

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
  addResourceLinkToTask: (taskId: string, title: string, url: string) => void;
  removeResourceLinkFromTask: (taskId: string, linkId: string) => void;
  addResourceLinkToProject: (projectId: string, title: string, url: string) => void;
  removeResourceLinkFromProject: (projectId: string, linkId: string) => void;
  addTeamMemberToProject: (projectId: string, userId: string) => void;
  removeTeamMemberFromProject: (projectId: string, userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [users] = useState<User[]>(initialUsers);
  const [files] = useState<AppFile[]>(initialFiles);
  const [notifications, setNotifications] = useState<NotificationRecord[]>(initialNotifs);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Use 'u1' as current user for demo
  const currentUser = users[0];

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



  // Save projects to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  // Save tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <AppContext.Provider value={{
      projects, tasks, users, files, notifications, currentUser,
      activeTab, setActiveTab, selectedProjectId, setSelectedProjectId, selectedTaskId, setSelectedTaskId,
      toggleTaskStatus, markNotificationRead, addProject, addTask, deleteProject, deleteTask, updateTaskDeadline, updateProject,
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
