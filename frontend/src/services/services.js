import api from './api';

export const authService = {
    loginUser: (data) => api.post('/auth/login', data),
    registerStudent: (data) => api.post('/auth/register/student', data),
    registerAlumni: (data) => api.post('/auth/register/alumni', data),
};

export const studentService = {
    getById: (id) => api.get(`/students/${id}`),
    getByUserId: (uid) => api.get(`/students/by-user/${uid}`),
    update: (id, data) => api.put(`/students/${id}`, data),
    uploadResume: (id, file) => { const fd = new FormData(); fd.append('file', file); return api.post(`/students/${id}/upload-resume`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); },
    uploadPhoto: (id, file) => { const fd = new FormData(); fd.append('file', file); return api.post(`/students/${id}/upload-photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); },
};

export const alumniService = {
    getDirectory: () => api.get('/alumni/directory'),
    search: (params) => api.post('/alumni/search', params),
    getById: (id) => api.get(`/alumni/${id}`),
    getByUserId: (uid) => api.get(`/alumni/by-user/${uid}`),
    update: (id, data) => api.put(`/alumni/${id}`, data),
    uploadPhoto: (id, file) => { const fd = new FormData(); fd.append('file', file); return api.post(`/alumni/${id}/upload-photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); },
    getPendingVerifications: () => api.get('/alumni/pending-verifications'),
    verify: (id, status, adminId) => api.patch(`/alumni/${id}/verify?status=${status}&adminId=${adminId}`),
};

export const mentorshipService = {
    request: (studentId, data) => api.post(`/mentorship/request?studentId=${studentId}`, data),
    getByStudent: (id) => api.get(`/mentorship/student/${id}`),
    getByAlumni: (id) => api.get(`/mentorship/alumni/${id}`),
    accept: (id, alumniId, msg) => api.patch(`/mentorship/${id}/accept?alumniId=${alumniId}`, { responseMessage: msg }),
    decline: (id, alumniId, msg) => api.patch(`/mentorship/${id}/decline?alumniId=${alumniId}`, { responseMessage: msg }),
    feedback: (id, studentId, rating, review) => api.post(`/mentorship/${id}/feedback?studentId=${studentId}`, { rating, review }),
};

export const jobService = {
    getAll: () => api.get('/jobs'),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (alumniId, data) => api.post(`/jobs?alumniId=${alumniId}`, data),
    update: (id, alumniId, data) => api.put(`/jobs/${id}?alumniId=${alumniId}`, data),
    close: (id, alumniId) => api.patch(`/jobs/${id}/close?alumniId=${alumniId}`),
    getByAlumni: (id) => api.get(`/jobs/by-alumni/${id}`),
    apply: (jobId, studentId, data) => api.post(`/jobs/${jobId}/apply?studentId=${studentId}`, data),
    getApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
    getStudentApplications: (id) => api.get(`/jobs/applications/student/${id}`),
    updateApplicationStatus: (appId, alumniId, status, notes) => api.patch(`/jobs/applications/${appId}/status?alumniId=${alumniId}`, { status, reviewNotes: notes }),
};

export const eventService = {
    getAll: () => api.get('/events'),
    getUpcoming: () => api.get('/events/upcoming'),
    getById: (id) => api.get(`/events/${id}`),
    create: (organizerId, organizerType, data) => api.post(`/events?organizerId=${organizerId}&organizerType=${organizerType}`, data),
    register: (id, userId, userType) => api.post(`/events/${id}/register?userId=${userId}&userType=${userType}`),
    getByOrganizer: (id) => api.get(`/events/organizer/${id}`),
};

export const forumService = {
    getQuestions: (category) => api.get('/forum/questions' + (category ? `?category=${category}` : '')),
    getQuestion: (id) => api.get(`/forum/questions/${id}`),
    createQuestion: (userId, userType, data) => api.post(`/forum/questions?userId=${userId}&userType=${userType}`, data),
    getAnswers: (qId) => api.get(`/forum/questions/${qId}/answers`),
    addAnswer: (qId, userId, userType, data) => api.post(`/forum/questions/${qId}/answer?userId=${userId}&userType=${userType}`, data),
    upvoteAnswer: (aId, userId) => api.post(`/forum/answers/${aId}/upvote?userId=${userId}`),
    markBest: (qId, aId, userId) => api.patch(`/forum/questions/${qId}/best-answer?answerId=${aId}&userId=${userId}`),
};

export const messageService = {
    getConversations: (userId) => api.get(`/messages/conversations/${userId}`),
    getOrCreate: (data) => api.post('/messages/conversations', data),
    getMessages: (convId, userId) => api.get(`/messages/conversations/${convId}/messages?userId=${userId}`),
    send: (convId, senderId, message) => api.post(`/messages/conversations/${convId}/send?senderId=${senderId}`, { message }),
};

export const storyService = {
    getAll: () => api.get('/stories'),
    getFeatured: () => api.get('/stories/featured'),
    getById: (id) => api.get(`/stories/${id}`),
    create: (alumniId, data) => api.post(`/stories?alumniId=${alumniId}`, data),
    like: (id, userId) => api.post(`/stories/${id}/like?userId=${userId}`),
};

export const dashboardService = {
    getStudentDashboard: (id) => api.get(`/dashboard/student/${id}`),
    getAlumniDashboard: (id) => api.get(`/dashboard/alumni/${id}`),
    getAdminDashboard: () => api.get('/dashboard/admin'),
};
