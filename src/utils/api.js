/**
 * Central API service — all calls to the Express/MongoDB backend.
 *
 * Dev:  requests go to /api  → Vite proxy → http://localhost:5000
 * Prod: VITE_API_URL=https://your-render-app.onrender.com
 *       requests go to https://your-render-app.onrender.com/api
 */

const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

// ── Auth token helpers ─────────────────────────────────────────────────────
export function getToken()          { return localStorage.getItem('owner_api_token') || ''; }
export function setToken(t)         { localStorage.setItem('owner_api_token', t); }
export function clearToken()        { localStorage.removeItem('owner_api_token'); }

// ── Base fetch wrapper ─────────────────────────────────────────────────────
async function call(path, method = 'GET', body = null, isForm = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

// ── Health ─────────────────────────────────────────────────────────────────
export const checkHealth = () => call('/health');

// ── Auth ───────────────────────────────────────────────────────────────────
export const adminLogin  = (email, password) => call('/auth/admin/login', 'POST', { email, password });
export const userRegister = (data) => call('/auth/register', 'POST', data);
export const userLogin   = (phone, password) => call('/auth/login', 'POST', { phone, password });
export const getMe       = () => call('/auth/me');

// ── Enquiries (contact form) ───────────────────────────────────────────────
export const submitEnquiry  = (data)     => call('/contact',     'POST', data);
export const getEnquiries   = (params='') => call(`/contact?${params}`);
export const getEnquiry     = (id)       => call(`/contact/${id}`);
export const updateEnquiry  = (id, data) => call(`/contact/${id}`, 'PUT', data);
export const deleteEnquiry  = (id)       => call(`/contact/${id}`, 'DELETE');

// ── Memberships ────────────────────────────────────────────────────────────
export const submitMembership  = (data)     => call('/membership',     'POST', data);
export const getMemberships    = (params='') => call(`/membership?${params}`);
export const getMembership     = (id)       => call(`/membership/${id}`);
export const updateMembership  = (id, data) => call(`/membership/${id}`, 'PUT', data);
export const deleteMembership  = (id)       => call(`/membership/${id}`, 'DELETE');

// ── Reviews ────────────────────────────────────────────────────────────────
export const submitReview  = (data)     => call('/reviews',     'POST', data);
export const getReviews    = ()         => call('/reviews');
export const approveReview = (id)       => call(`/reviews/${id}/approve`, 'PUT');
export const updateReview  = (id, data) => call(`/reviews/${id}`, 'PUT', data);
export const deleteReview  = (id)       => call(`/reviews/${id}`, 'DELETE');

// ── Facilitators ───────────────────────────────────────────────────────────
export const getFacilitators   = ()         => call('/facilitators');
export const createFacilitator = (data)     => call('/facilitators', 'POST', data);
export const updateFacilitator = (id, data) => call(`/facilitators/${id}`, 'PUT', data);
export const deleteFacilitator = (id)       => call(`/facilitators/${id}`, 'DELETE');
export const uploadFacilitatorImage = (id, file) => {
  const fd = new FormData(); fd.append('image', file);
  return call(`/facilitators/${id}/image`, 'POST', fd, true);
};

// ── Plans ──────────────────────────────────────────────────────────────────
export const getPlans   = ()         => call('/plans');
export const createPlan = (data)     => call('/plans', 'POST', data);
export const updatePlan = (id, data) => call(`/plans/${id}`, 'PUT', data);
export const deletePlan = (id)       => call(`/plans/${id}`, 'DELETE');

// ── Classes ────────────────────────────────────────────────────────────────
export const getClasses   = ()         => call('/classes');
export const createClass  = (data)     => call('/classes', 'POST', data);
export const updateClass  = (id, data) => call(`/classes/${id}`, 'PUT', data);
export const deleteClass  = (id)       => call(`/classes/${id}`, 'DELETE');

// ── Achievements ───────────────────────────────────────────────────────────
export const getAchievements   = ()         => call('/achievements');
export const createAchievement = (data)     => call('/achievements', 'POST', data);
export const updateAchievement = (id, data) => call(`/achievements/${id}`, 'PUT', data);
export const deleteAchievement = (id)       => call(`/achievements/${id}`, 'DELETE');
export const getAchievementStats   = ()         => call('/achievements/stats');
export const createAchievementStat = (data)     => call('/achievements/stats', 'POST', data);
export const updateAchievementStat = (id, data) => call(`/achievements/stats/${id}`, 'PUT', data);
export const deleteAchievementStat = (id)       => call(`/achievements/stats/${id}`, 'DELETE');

// ── Gallery ────────────────────────────────────────────────────────────────
export const getGallery   = () => call('/gallery');
export const createGalleryItem = (formData) => call('/gallery', 'POST', formData, true);
export const updateGalleryItem = (id, data) => call(`/gallery/${id}`, 'PUT', data);
export const deleteGalleryItem = (id)       => call(`/gallery/${id}`, 'DELETE');

// ── Schedule ───────────────────────────────────────────────────────────────
export const getSchedule   = ()         => call('/schedule');
export const createSlot    = (data)     => call('/schedule', 'POST', data);
export const updateSlot    = (id, data) => call(`/schedule/${id}`, 'PUT', data);
export const deleteSlot    = (id)       => call(`/schedule/${id}`, 'DELETE');

// ── Site Config ────────────────────────────────────────────────────────────
export const getSiteConfig    = ()     => call('/config');
export const updateSiteConfig = (data) => call('/config', 'PUT', data);
export const getDashboardStats = ()    => call('/config/stats');
export const getSocials        = ()    => call('/config/socials');
export const createSocial      = (data)     => call('/config/socials', 'POST', data);
export const updateSocial      = (id, data) => call(`/config/socials/${id}`, 'PUT', data);
export const deleteSocial      = (id)       => call(`/config/socials/${id}`, 'DELETE');
