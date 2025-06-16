import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const JobContext = createContext();

export const useJobs = () => {
  return useContext(JobContext);
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  // Get all jobs
  const getJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters };
      
      // Convert skillsRequired array to string for API
      if (params.skillsRequired && Array.isArray(params.skillsRequired)) {
        params.skillsRequired = params.skillsRequired.join(',');
      }
      
      // Convert status array to string for API
      if (params.status && Array.isArray(params.status)) {
        params.status = params.status.join(',');
      }
      
      const res = await axios.get(`${API_URL}/jobs`, { params });
      setJobs(res.data.jobs);
      setPagination(res.data.pagination);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single job
  const getJob = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/jobs/${id}`);
      setJob(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new job
  const createJob = async (jobData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/jobs`, jobData);
      setJobs([res.data, ...jobs]);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update job
  const updateJob = async (id, jobData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/jobs/${id}`, jobData);
      setJobs(jobs.map(job => (job._id === id ? res.data : job)));
      setJob(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const deleteJob = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
      setError(null);
      return id;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Apply to job
  const applyToJob = async (id, applicationData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/jobs/${id}/apply`, applicationData);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply to job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add comment to job
  const addComment = async (id, commentText) => {
    try {
      const res = await axios.post(`${API_URL}/jobs/${id}/comments`, { text: commentText });
      // Update job comments if viewing job detail
      if (job && job._id === id) {
        setJob({ ...job, comments: res.data });
      }
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get bookmarked jobs
  const getBookmarkedJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/jobs/bookmarked`);
      setBookmarkedJobs(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookmarked jobs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if job is bookmarked
  const isJobBookmarked = (jobId) => {
    return bookmarkedJobs.some(job => job._id === jobId);
  };

  // Toggle bookmark
  const toggleBookmark = async (jobId) => {
    try {
      const res = await axios.post(`${API_URL}/jobs/${jobId}/bookmark`);
      
      if (res.data.isBookmarked) {
        // If job was bookmarked, add to bookmarked jobs
        const jobToAdd = jobs.find(job => job._id === jobId) || job;
        if (jobToAdd) {
          setBookmarkedJobs([...bookmarkedJobs, jobToAdd]);
        }
      } else {
        // If job was unbookmarked, remove from bookmarked jobs
        setBookmarkedJobs(bookmarkedJobs.filter(job => job._id !== jobId));
      }
      
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle bookmark');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    jobs,
    job,
    bookmarkedJobs,
    loading,
    error,
    pagination,
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    applyToJob,
    addComment,
    getBookmarkedJobs,
    isJobBookmarked,
    toggleBookmark,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export default JobContext; 