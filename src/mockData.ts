import { Project, Task, User, AppFile, NotificationRecord } from './types';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const users: User[] = [
  { id: 'u1', name: 'Alex Brne', initials: 'AB' },
  { id: 'u2', name: 'Sarah Chen', initials: 'SC' },
  { id: 'u3', name: 'Dave Smith', initials: 'DS' },
];

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Rebranding Alpha',
    client: 'Acme Corp',
    status: 'Ongoing',
    dueDate: addDays(today, 15).toISOString(),
    teamMembers: ['u1', 'u2'],
    progress: 45,
  },
  {
    id: 'p2',
    name: 'Website Redesign',
    client: 'TechNova',
    status: 'Ongoing',
    dueDate: addDays(today, 3).toISOString(),
    teamMembers: ['u1', 'u2', 'u3'],
    progress: 80,
  },
  {
    id: 'p3',
    name: 'Q3 Campaign Assets',
    client: 'Global Logistics',
    status: 'Completed',
    dueDate: subDays(today, 10).toISOString(),
    teamMembers: ['u2', 'u3'],
    progress: 100,
  },
];

export const tasks: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Logo Concept Drafts',
    assignees: ['u1'],
    priority: 'High',
    status: 'In Progress',
    deadline: addDays(today, 2).toISOString(),
    checklist: [
      { id: 'cl1', text: 'Determine color palette', completed: true },
      { id: 'cl2', text: 'Sketch 3 variants', completed: false },
    ],
    comments: [
      { id: 'c1', userId: 'u2', content: 'Looking good so far!', createdAt: subDays(today, 1).toISOString() }
    ]
  },
  {
    id: 't2',
    projectId: 'p2',
    title: 'Frontend Implementation',
    assignees: ['u2', 'u3'],
    priority: 'Urgent',
    status: 'Todo',
    deadline: subDays(today, 1).toISOString(), // Overdue
    checklist: [],
    comments: []
  },
  {
    id: 't3',
    projectId: 'p2',
    title: 'Final QA',
    assignees: ['u3'],
    priority: 'Medium',
    status: 'Todo',
    deadline: addDays(today, 3).toISOString(),
    checklist: [],
    comments: []
  }
];

export const files: AppFile[] = [
  {
    id: 'f1',
    name: 'Brand_Guidelines_V1.pdf',
    type: 'PDF',
    size: '4.2 MB',
    uploadedAt: subDays(today, 2).toISOString(),
    uploadedBy: 'u1',
    projectId: 'p1',
  },
  {
    id: 'f2',
    name: 'Hero_Animation_Draft.mp4',
    type: 'Video',
    size: '24.5 MB',
    uploadedAt: today.toISOString(),
    uploadedBy: 'u2',
    projectId: 'p2',
  }
];

export const notifications: NotificationRecord[] = [
  {
    id: 'n1',
    title: 'Task Overdue',
    message: 'Frontend Implementation is overdue!',
    type: 'Overdue',
    isRead: false,
    createdAt: subDays(today, 1).toISOString(),
  },
  {
    id: 'n2',
    title: 'New Comment',
    message: 'Sarah left a comment on Logo Concept Drafts',
    type: 'Comment',
    isRead: false,
    createdAt: subDays(today, 1).toISOString(),
  }
];
