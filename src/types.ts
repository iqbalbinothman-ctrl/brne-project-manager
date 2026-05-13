export type ProjectStatus = 'Ongoing' | 'Completed' | 'On Hold';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface DeadlineExtension {
  id: string;
  originalDeadline: string;
  newDeadline: string;
  reason: string;
  extendedAt: string;
  extendedBy: string; // User ID
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assignees: string[]; // User IDs
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  checklist: { id: string; text: string; completed: boolean }[];
  comments: TaskComment[];
  deadlineExtensions?: DeadlineExtension[];
  resourceLinks?: ResourceLink[];
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  dueDate: string;
  teamMembers: string[]; // User IDs
  progress: number;
  resourceLinks?: ResourceLink[];
}

export interface AppFile {
  id: string;
  projectId?: string;
  name: string;
  type: 'PDF' | 'Design' | 'Video' | 'Asset' | 'Other';
  size: string;
  uploadedAt: string;
  uploadedBy: string; // User ID
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: 'Deadline' | 'Assign' | 'Comment' | 'Overdue';
  isRead: boolean;
  createdAt: string;
  linkTo?: string; // Optional relevant link/ID
}
