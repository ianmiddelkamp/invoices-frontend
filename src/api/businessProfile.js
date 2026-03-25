import { apiFetch } from './index';

export const getBusinessProfile = () => apiFetch('/business_profile');
export const updateBusinessProfile = (data) =>
  apiFetch('/business_profile', {
    method: 'PATCH',
    body: JSON.stringify({ business_profile: data }),
  });
