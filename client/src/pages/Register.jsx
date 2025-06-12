import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "freelancer",
    skills: "",
    bio: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/register", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Register</h2>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      >
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
      </select>
      <input
        name="skills"
        placeholder="Skills (comma-separated)"
        value={form.skills}
        onChange={handleChange}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <textarea
        name="bio"
        placeholder="Short Bio"
        value={form.bio}
        onChange={handleChange}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <button type="submit" style={{ padding: "0.5rem 1rem" }}>Register</button>
      {msg && <p style={{ marginTop: "1rem", color: "red" }}>{msg}</p>}
    </form>
  );
};

export default Register;
