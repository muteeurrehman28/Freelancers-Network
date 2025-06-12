// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Jobs       from "./pages/Jobs";
import JobDetail  from "./pages/JobDetail";
import CreateJob  from "./pages/CreateJob";
import Register   from "./pages/Register";
import Login      from "./pages/Login";
import Dashboard  from "./pages/Dashboard";

/* ─────────────────────────────────────────────
   <RoleRoute>  – protects routes
   • If no user in localStorage  → /login
   • If role not allowed         → /
────────────────────────────────────────────── */
const RoleRoute = ({ element: Element, allowed }) => {
  const userRaw = localStorage.getItem("user");
  if (!userRaw) return <Navigate to="/login" replace />;

  const user = JSON.parse(userRaw);            // { _id, username, email, role, token }
  if (allowed && !allowed.includes(user.role)) return <Navigate to="/" replace />;

  return <Element />;
};

/* ─────────────────────────────────────────────
   Navigation bar – adapts to auth + role
────────────────────────────────────────────── */
const Nav = () => {
  const userRaw = localStorage.getItem("user");
  const user    = userRaw ? JSON.parse(userRaw) : null;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Jobs</Link>

      {/* client-only link */}
      {user?.role === "client" && (
        <Link to="/jobs/new" style={{ marginRight: "1rem" }}>Post Job</Link>
      )}

      {user ? (
        <>
          <Link to="/dashboard" style={{ marginRight: "1rem" }}>Dashboard</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login"    style={{ marginRight: "1rem" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

/* ─────────────────────────────────────────────
   App – top-level router
────────────────────────────────────────────── */
const App = () => (
  <Router>
    <Nav />

    <Routes>
      {/* public routes */}
      <Route path="/"          element={<Jobs />} />
      <Route path="/jobs"      element={<Jobs />} />
      <Route path="/jobs/:id"  element={<JobDetail />} />
      <Route path="/register"  element={<Register />} />
      <Route path="/login"     element={<Login />} />

      {/* client-only route */}
      <Route
        path="/jobs/new"
        element={<RoleRoute allowed={["client"]} element={CreateJob} />}
      />

      {/* any logged-in user */}
      <Route
        path="/dashboard"
        element={<RoleRoute element={Dashboard} />}
      />
    </Routes>
  </Router>
);

export default App;
