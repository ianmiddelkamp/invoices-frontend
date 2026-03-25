import { apiFetch } from './index';

export const getProjects = () => apiFetch('/projects');
export const getProject = (id) => apiFetch(`/projects/${id}`);
export const createProject = (data) => apiFetch('/projects', { method: 'POST', body: JSON.stringify({ project: data }) });
export const updateProject = (id, data) => apiFetch(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify({ project: data }) });
export const deleteProject = (id) => apiFetch(`/projects/${id}`, { method: 'DELETE' });
