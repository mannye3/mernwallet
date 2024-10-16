import cors from 'cors'; // Fix import syntax
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js';
import authRouter from './routes/auth.route.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config(); // Load environment variables

const app = express(); // Initialize the app before using it

// CORS middleware configuration
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  credentials: true // Allow cookies and auth headers
}));

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Routes setup
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set

app.listen(PORT, async () => {
  try {
    await connectDB(); // Ensure the DB is connected before proceeding
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit with failure code if DB connection fails
  }
});