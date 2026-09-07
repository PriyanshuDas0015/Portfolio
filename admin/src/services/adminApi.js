import { api } from './api';
export const authApi = {
  login: (values) => api.post('/api/admin/login', values).then((r) => r.data),
  logout: () => api.post('/api/admin/logout').then((r) => r.data),
  me: () => api.get('/api/admin/me').then((r) => r.data),
};
export const adminApi = {
  dashboard: () => api.get('/api/admin/dashboard').then((r) => r.data),
  list: (resource) => api.get(`/api/admin/${resource}`).then((r) => r.data),
  create: (resource, values, config) =>
    api.post(`/api/admin/${resource}`, values, config).then((r) => r.data),
  update: (resource, id, values, config) =>
    api.put(`/api/admin/${resource}/${id}`, values, config).then((r) => r.data),
  remove: (resource, id) => api.delete(`/api/admin/${resource}/${id}`).then((r) => r.data),
  getSettings: () => api.get('/api/admin/settings').then((r) => r.data),
  updateSettings: (values) => api.put('/api/admin/settings', values).then((r) => r.data),
  getProfile: () => api.get('/api/admin/profile').then((r) => r.data),
  updateProfile: (values) => api.put('/api/admin/profile', values).then((r) => r.data),
  getResume: () => api.get('/api/admin/resume').then((r) => r.data),
  uploadResume: (form, onUploadProgress) =>
    api.post('/api/admin/resume', form, { onUploadProgress }).then((r) => r.data),
  markMessage: (id, isRead) =>
    api.put(`/api/admin/messages/${id}/read`, { isRead }).then((r) => r.data),
  setMessageStatus: (id, status) =>
    api.put(`/api/admin/messages/${id}/status`, { status }).then((r) => r.data),
  activateResume: (id) => api.put(`/api/admin/resumes/${id}/activate`).then((r) => r.data),
  deleteResume: (id) => api.delete(`/api/admin/resumes/${id}`).then((r) => r.data),
  getAccount: () => api.get('/api/admin/account').then((r) => r.data),
  updateAccount: (values) => api.put('/api/admin/account', values).then((r) => r.data),
  changePassword: (values) => api.put('/api/admin/account/password', values).then((r) => r.data),
  deleteProjectGalleryImage: (projectId, assetId) =>
    api.delete(`/api/admin/projects/${projectId}/gallery/${assetId}`).then((r) => r.data),
};
