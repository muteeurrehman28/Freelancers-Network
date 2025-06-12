import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
  axios.get("http://localhost:5000/api/jobs/")
    .then((res) => {
      setJobs(res.data);
      if (res.data.length === 0) {
        console.log("No jobs found");
      }
    })
    .catch((err) => console.error("Failed to load jobs", err));
}, []);


  const filteredJobs = jobs.filter((job) => {
    const query = search.toLowerCase();
    const matches = 
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.skillsRequired?.some((skill) => skill.toLowerCase().includes(query));

    // Freelancer: show only open & unassigned jobs not posted by self
    if (user?.role === "freelancer") {
      return (
        matches &&
        job.status === "open"  &&
        job.postedBy !== user.id
      );
    }

    // Client: show jobs posted by self
    if (user?.role === "client") {
      return matches && job.postedBy._id === user._id;
    }

    return false;
  });

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>{user?.role === "freelancer" ? "Available Jobs" : "Your Posted Tasks"}</h2>

      {/* Search input for freelancers only */}
      {user?.role === "freelancer" && (
        <input
          style={{ width: "100%", padding: "0.5rem", margin: "1rem 0" }}
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {/* Create button for clients */}
      {user?.role === "client" && (
        <div style={{ margin: "1rem 0" }}>
          <Link
            to="/jobs/new"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            + Create New Task
          </Link>
        </div>
      )}

      {/* Job cards */}
      {filteredJobs.map((job) => (
        <Link
          key={job._id}
          to={`/jobs/${job._id}`}
          style={{
            display: "block",
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <small>Budget: ${job.budget}</small><br />
          <small>Skills: {job.skillsRequired?.join(", ")}</small><br />
          <small>Status: {job.status}</small>
        </Link>
      ))}

      {/* Fallback message */}
      {filteredJobs.length === 0 && <p>No jobs found.</p>}
    </div>
  );
};

export default Jobs;
