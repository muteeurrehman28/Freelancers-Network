import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import EmojiInput from "../components/EmojiInput"; // adjust path as needed

const CreateJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: 0,
    skillsRequired: "",
    category: "",
    experienceLevel: "entry",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        budget: Number(form.budget),
        skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()),
      };
      const { data } = await api.post("/jobs", payload);
      navigate(`/jobs/${data._id}`);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Create Job</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
     <EmojiInput
  value={form.description}
  onChange={(e) => setForm({ ...form, description: e.target.value })}
  placeholder="Description"
/>
      <input type="number" name="budget" placeholder="Budget" value={form.budget} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
      <input name="skillsRequired" placeholder="Skills (comma separated)" value={form.skillsRequired} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
      <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}>
        <option value="entry">Entry</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
      </select>
      <button type="submit" style={{ padding: "0.5rem 1rem" }}>Post Job</button>
      {msg && <p style={{ marginTop: "1rem" }}>{msg}</p>}
    </form>
  );
};

export default CreateJob;
