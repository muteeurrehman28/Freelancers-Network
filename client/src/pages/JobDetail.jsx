import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [msg, setMsg] = useState("");

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const token = user?.token;

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch((err) => {
        console.error("Error fetching job:", err);
        setMsg("Failed to load job details");
      });
  }, [id]);

  const apply = async () => {
    try {
      await api.post(`/jobs/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("✅ Applied successfully!");
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Error applying");
    }
  };

  const deleteJob = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    try {
      await api.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("✅ Job deleted successfully");
      setTimeout(() => navigate("/jobs"), 1500);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to delete job");
    }
  };

  const markAsDone = async () => {
    try {
      await api.put(`/jobs/${id}`, { status: "completed" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJob({ ...job, status: "completed" });
      setMsg("✅ Marked as completed");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to mark as done");
    }
  };

  if (!job) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p><strong>Budget:</strong> ${job.budget}</p>
      <p><strong>Experience:</strong> {job.experienceLevel}</p>
      <p><strong>Status:</strong> {job.status}</p>

      {user && user.role === "freelancer" && job.status === "open" && (
        <button
          onClick={apply}
          style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
        >
          Apply
        </button>
      )}

      {user && user.role === "client" && job.postedBy._id === user._id && (
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={deleteJob}
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
          {job.status !== "completed" && (
            <button
              onClick={markAsDone}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "green",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Mark as Done
            </button>
          )}
        </div>
      )}

      {msg && <p style={{ marginTop: "1rem" }}>{msg}</p>}
    </div>
  );
};

export default JobDetail;
