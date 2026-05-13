import { Project, Task, User } from './types';

export function validateAppData(projects: Project[], tasks: Task[], users: User[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate projects
  if (!Array.isArray(projects)) {
    errors.push('Projects must be an array');
  } else {
    projects.forEach((p, i) => {
      if (!p.id) errors.push(`Project ${i} missing id`);
      if (!p.name) errors.push(`Project ${i} missing name`);
      if (!['Ongoing', 'Completed', 'On Hold'].includes(p.status)) errors.push(`Project ${i} invalid status`);
      if (typeof p.progress !== 'number' || p.progress < 0 || p.progress > 100) errors.push(`Project ${i} invalid progress`);
    });
  }

  // Validate tasks
  if (!Array.isArray(tasks)) {
    errors.push('Tasks must be an array');
  } else {
    tasks.forEach((t, i) => {
      if (!t.id) errors.push(`Task ${i} missing id`);
      if (!t.title) errors.push(`Task ${i} missing title`);
      if (!t.projectId) errors.push(`Task ${i} missing projectId`);
      if (!['Todo', 'In Progress', 'Done'].includes(t.status)) errors.push(`Task ${i} invalid status`);
      if (!projects.find(p => p.id === t.projectId)) errors.push(`Task ${i} references non-existent project`);
    });
  }

  // Validate users
  if (!Array.isArray(users)) {
    errors.push('Users must be an array');
  } else {
    users.forEach((u, i) => {
      if (!u.id) errors.push(`User ${i} missing id`);
      if (!u.name) errors.push(`User ${i} missing name`);
      if (!u.initials) errors.push(`User ${i} missing initials`);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function cleanOldData() {
  // Remove old theme/language data that's no longer used
  try {
    localStorage.removeItem('theme');
    localStorage.removeItem('language');
    console.log('Cleaned up old settings data');
  } catch (e) {
    console.warn('Could not clean localStorage:', e);
  }
}
