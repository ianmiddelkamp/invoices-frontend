import { apiFetch } from './index';

export const getTimeEntries = (projectId) => apiFetch(`/projects/${projectId}/time_entries`);
export const getAllTimeEntries = () => apiFetch('/time_entries');
export const createTimeEntry = (projectId, data) =>
  apiFetch(`/projects/${projectId}/time_entries`, {
    method: 'POST',
    body: JSON.stringify({ time_entry: { ...data, user_id: 1 } }),
  });
export const updateTimeEntry = (projectId, id, data) =>
  apiFetch(`/projects/${projectId}/time_entries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ time_entry: data }),
  });
export const deleteTimeEntry = (projectId, id) =>
  apiFetch(`/projects/${projectId}/time_entries/${id}`, { method: 'DELETE' });
