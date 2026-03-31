import { apiFetch } from './index';

export const getTimer = () => apiFetch('/timer');

export const startTimer = (projectId, taskId) =>
  apiFetch('/timer/start', {
    method: 'POST',
    body: JSON.stringify({ project_id: projectId, task_id: taskId || null }),
  });

export const stopTimer = (projectId, description) =>
  apiFetch('/timer/stop', {
    method: 'POST',
    body: JSON.stringify({ project_id: projectId, description }),
  });

export const updateTimer = (description, taskId) =>
  apiFetch('/timer', {
    method: 'PATCH',
    body: JSON.stringify({ description, ...(taskId !== undefined && { task_id: taskId }) }),
  });

export const cancelTimer = () => apiFetch('/timer', { method: 'DELETE' });
