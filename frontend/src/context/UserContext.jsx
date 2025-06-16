import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUsers = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [freelancers, setFreelancers] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  // Get all freelancers with filtering
  const getFreelancers = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters };
      
      // Convert skills array to string for API
      if (params.skills && Array.isArray(params.skills)) {
        params.skills = params.skills.join(',');
      }
      
      const res = await axios.get('/users/freelancers', { params });
      setFreelancers(res.data.freelancers);
      setPagination(res.data.pagination);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch freelancers');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user profile by ID
  const getUserProfile = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/users/${id}`);
      setUserProfile(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all common skills
  const getAllSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/users/skills');
      setSkills(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch skills');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user's job applications
  const getUserApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/users/applications');
      setApplications(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user's posted jobs
  const getUserPostedJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/users/my-jobs');
      setPostedJobs(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posted jobs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (jobId, userId, status) => {
    try {
      const res = await axios.put(`/users/applications/${jobId}/${userId}`, { status });
      
      // Update posted jobs if loaded
      if (postedJobs.length > 0) {
        setPostedJobs(
          postedJobs.map(job => {
            if (job._id === jobId) {
              const updatedApplicants = job.applicants.map(app => {
                if (app.user._id === userId) {
                  return { ...app, status };
                }
                return app;
              });
              return { ...job, applicants: updatedApplicants };
            }
            return job;
          })
        );
      }
      
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status');
      throw err;
    }
  };

  const value = {
    freelancers,
    userProfile,
    applications,
    postedJobs,
    skills,
    loading,
    error,
    pagination,
    getFreelancers,
    getUserProfile,
    getAllSkills,
    getUserApplications,
    getUserPostedJobs,
    updateApplicationStatus,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext; 