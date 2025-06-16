require('dotenv').config({ path: './config/config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const JobPost = require('../models/JobPost');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await JobPost.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const client = await User.create({
      name: 'John Client',
      email: 'client@example.com',
      password: 'password123',
      role: 'client',
      skills: ['Project Management', 'Business Analysis'],
      bio: 'Looking for talented freelancers for various projects.',
    });

    const freelancer = await User.create({
      name: 'Sarah Freelancer',
      email: 'freelancer@example.com',
      password: 'password123',
      role: 'freelancer',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      bio: 'Full stack developer with 5 years of experience.',
    });

    console.log('Created test users');

    // Create test jobs
    const jobs = await JobPost.create([
      {
        title: 'Senior React Developer Needed',
        description: 'Looking for an experienced React developer to join our team. Must have 3+ years of experience with React, Redux, and modern JavaScript.',
        skillsRequired: ['React', 'JavaScript', 'Redux', 'HTML', 'CSS'],
        budget: 5000,
        duration: '3 months',
        location: 'Remote',
        status: 'open',
        tags: ['react', 'frontend', 'javascript'],
        postedBy: client._id,
      },
      {
        title: 'Full Stack Developer for E-commerce Project',
        description: 'We need a full stack developer to help build our e-commerce platform. Experience with Node.js, React, and MongoDB required.',
        skillsRequired: ['Node.js', 'React', 'MongoDB', 'Express', 'JavaScript'],
        budget: 8000,
        duration: '6 months',
        location: 'Remote',
        status: 'open',
        tags: ['fullstack', 'ecommerce', 'nodejs'],
        postedBy: client._id,
      },
      {
        title: 'UI/UX Designer for Mobile App',
        description: 'Looking for a talented UI/UX designer to create beautiful and intuitive interfaces for our mobile application.',
        skillsRequired: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Mobile Design'],
        budget: 3000,
        duration: '2 months',
        location: 'Remote',
        status: 'open',
        tags: ['design', 'ui/ux', 'mobile'],
        postedBy: client._id,
      },
      {
        title: 'DevOps Engineer for Cloud Migration',
        description: 'Seeking a DevOps engineer to help migrate our infrastructure to AWS. Experience with Docker, Kubernetes, and CI/CD required.',
        skillsRequired: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        budget: 10000,
        duration: '4 months',
        location: 'Remote',
        status: 'open',
        tags: ['devops', 'cloud', 'aws'],
        postedBy: client._id,
      },
      {
        title: 'Python Developer for Data Science Project',
        description: 'Looking for a Python developer with experience in data science and machine learning to work on an exciting project.',
        skillsRequired: ['Python', 'Data Science', 'Machine Learning', 'Pandas', 'NumPy'],
        budget: 6000,
        duration: '3 months',
        location: 'Remote',
        status: 'open',
        tags: ['python', 'data-science', 'machine-learning'],
        postedBy: client._id,
      }
    ]);

    console.log('Created test jobs');
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 