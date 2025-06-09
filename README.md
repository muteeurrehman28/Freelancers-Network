# Freelancers Network

A full-stack MERN application for connecting freelancers with clients, featuring job postings, skill-based filtering, and collaboration tools.

## Features

- User Authentication (JWT-based)
- Job Posting and Management
- Skill-based Job Filtering
- Bookmarking System
- Real-time Updates
- Emoji Support in Posts
- Responsive Design

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- React Router
- Axios
- Emoji Picker React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (File Upload)
- Cloudinary (Image Storage)

## Project Structure

```
freelancers-network/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/         # Page components
│       ├── redux/         # Redux store and slices
│       ├── utils/         # Utility functions
│       └── assets/        # Static assets
│
└── server/                # Backend Express application
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── middleware/       # Custom middleware
    ├── models/          # Mongoose models
    ├── routes/          # API routes
    └── utils/           # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/freelancers-network.git
cd freelancers-network
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Create a .env file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

5. Start the development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Jobs
- GET /api/jobs - Get all jobs
- POST /api/jobs - Create a new job
- GET /api/jobs/:id - Get job by ID
- PUT /api/jobs/:id - Update job
- DELETE /api/jobs/:id - Delete job

### User
- GET /api/users/bookmarks - Get user bookmarks
- POST /api/users/bookmarks/:jobId - Bookmark a job
- DELETE /api/users/bookmarks/:jobId - Remove bookmark

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 