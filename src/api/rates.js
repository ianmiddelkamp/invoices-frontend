import { apiFetch } from './index';

export const getProjectRate = (projectId) => apiFetch(`/projects/${projectId}/rate`);
export const setProjectRate = (projectId, rate) =>
  apiFetch(`/projects/${projectId}/rate`, {
    method: 'PUT',
    body: JSON.stringify({ rate: { rate } }),
  });

export const getClientRate = (clientId) => apiFetch(`/clients/${clientId}/rate`);
export const setClientRate = (clientId, rate) =>
  apiFetch(`/clients/${clientId}/rate`, {
    method: 'PUT',
    body: JSON.stringify({ rate: { rate } }),
  });
