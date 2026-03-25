import { apiFetch } from './index';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getInvoices = () => apiFetch('/invoices');
export const getInvoice = (id) => apiFetch(`/invoices/${id}`);
export const createInvoice = (data) =>
  apiFetch('/invoices', { method: 'POST', body: JSON.stringify(data) });
export const updateInvoice = (id, data) =>
  apiFetch(`/invoices/${id}`, { method: 'PATCH', body: JSON.stringify({ invoice: data }) });
export const deleteInvoice = (id) => apiFetch(`/invoices/${id}`, { method: 'DELETE' });
export const downloadPdfUrl = (id) => `${BASE_URL}/invoices/${id}/pdf`;
export const regeneratePdf = (id) => apiFetch(`/invoices/${id}/regenerate_pdf`, { method: 'POST' });
export const sendInvoice = (id) => apiFetch(`/invoices/${id}/send_invoice`, { method: 'POST' });
