import axios from 'axios';

// Configure base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response) {
      const { status } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem('token');
        // Redirect to login page if needed
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => axios.post('/auth/register', userData),
  login: (email, password) => axios.post('/auth/login', { email, password }),
  getCurrentUser: () => axios.get('/auth/me'),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => axios.get('/jobs', { params }),
  getJob: (id) => axios.get(`/jobs/${id}`),
  createJob: (jobData) => axios.post('/jobs', jobData),
  updateJob: (id, jobData) => axios.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => axios.delete(`/jobs/${id}`),
  applyToJob: (id, applicationData) => axios.post(`/jobs/${id}/apply`, applicationData),
  bookmarkJob: (id) => axios.post(`/jobs/${id}/bookmark`),
  addComment: (id, text) => axios.post(`/jobs/${id}/comments`, { text }),
  getBookmarkedJobs: () => axios.get('/jobs/bookmarked'),
};

// Users API
export const usersAPI = {
  getFreelancers: (params) => axios.get('/users/freelancers', { params }),
  getUserProfile: (id) => axios.get(`/users/${id}`),
  updateUserProfile: (profileData) => axios.put('/users/profile', profileData),
  getSkills: () => axios.get('/users/skills'),
  getApplications: () => axios.get('/users/applications'),
  getPostedJobs: () => axios.get('/users/my-jobs'),
  updateApplicationStatus: (jobId, userId, status) => 
    axios.put(`/users/applications/${jobId}/${userId}`, { status }),
};

export default {
  auth: authAPI,
  jobs: jobsAPI,
  users: usersAPI,
}; 