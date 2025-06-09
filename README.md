# 📱 Freelancers Network

**Freelancers Network** is a modern full-stack MERN application built to connect freelancers with clients. It enables job postings, skill-based filtering, real-time collaboration, and seamless user interaction in a responsive, scalable environment.

---

## 🚀 Features

* 🔐 **Secure JWT Authentication**
* 📄 **Post & Manage Jobs**
* 🎯 **Skill-Based Job Filtering**
* 📌 **Bookmarking System**
* 🔄 **Real-Time UI Updates**
* 😄 **Emoji Support in Posts**
* 📱 **Responsive and Mobile-Friendly UI**

---

## 🛠️ Tech Stack

### 🔷 Frontend

* React.js (CRA)
* Material-UI (MUI)
* Redux Toolkit
* React Router DOM
* Axios
* Emoji Picker React

### 🔶 Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JSON Web Tokens (JWT)
* Multer (Image/File Uploads)
* Cloudinary (Media Storage)

---

## 📁 Project Structure

```
freelancers-network/
🕺 client/                 # Frontend React Application
🕺 🕺 public/
🕺 🕺 src/
🕺     🕺 components/     # Reusable UI Components
🕺     🕺 pages/          # Page-Level Components
🕺     🕺 redux/          # Redux Slices & Store
🕺     🕺 utils/          # Helper Functions
🕺     🕺 assets/         # Images & Static Files

🕺 server/                 # Backend Node.js API
    🕺 config/             # Configuration Files
    🕺 controllers/        # Request Controllers
    🕺 middleware/         # Auth & Error Middleware
    🕺 models/             # Mongoose Models
    🕺 routes/             # Express API Routes
    🕺 utils/              # Utility Logic
```

---

## ⚙️ Getting Started

### ✅ Prerequisites

* Node.js (v14+)
* npm or Yarn
* MongoDB Atlas or Local MongoDB
* Cloudinary Account (for image uploads)

---

### 📅 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/freelancers-network.git
cd freelancers-network
```

2. **Install Backend Dependencies:**

```bash
cd server
npm install
```

3. **Install Frontend Dependencies:**

```bash
cd ../client
npm install
```

---

### 🔐 Environment Variables

Create a `.env` file in the `server` directory with the following content:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

### ▶️ Run the App

#### Start the Backend:

```bash
cd server
npm run dev
```

#### Start the Frontend:

```bash
cd ../client
npm start
```

---

## 📡 API Endpoints

### 🔐 Authentication

* `POST /api/auth/register` – Register new user
* `POST /api/auth/login` – Login existing user
* `GET /api/auth/profile` – Get user profile

### 📄 Jobs

* `GET /api/jobs` – Fetch all jobs
* `POST /api/jobs` – Post a new job
* `GET /api/jobs/:id` – Get job by ID
* `PUT /api/jobs/:id` – Update job
* `DELETE /api/jobs/:id` – Delete job

### 👤 User

* `GET /api/users/bookmarks` – Get all bookmarks
* `POST /api/users/bookmarks/:jobId` – Bookmark a job
* `DELETE /api/users/bookmarks/:jobId` – Remove bookmark

---

## 📈 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
