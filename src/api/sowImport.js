import { getToken } from './index';

export const parseSow = (projectId, file) => {
  const body = new FormData();
  body.append('file', file);
  return fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/projects/${projectId}/sow_import`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Import failed');
    return data;
  });
};
