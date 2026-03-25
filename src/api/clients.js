import { apiFetch } from './index';

export const getClients = () => apiFetch('/clients');
export const getClient = (id) => apiFetch(`/clients/${id}`);
export const createClient = (data) => apiFetch('/clients', { method: 'POST', body: JSON.stringify({ client: data }) });
export const updateClient = (id, data) => apiFetch(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify({ client: data }) });
export const deleteClient = (id) => apiFetch(`/clients/${id}`, { method: 'DELETE' });
