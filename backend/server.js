import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routers from './routes/routes.js';
import dbCon from './utlis/db.js';
import multer from 'multer';

// Initialize dotenv and connect to the database
dotenv.config();
const app = express();
dbCon();

// Middleware configuration
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
    }
});
const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Use routes
app.use('/api', routers);

// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});
