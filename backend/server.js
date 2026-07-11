
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

dotenv.config();

connectDB();

// Auto-seed admin on server start
const seedAdminOnStart = async () => {
  try {
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { email: process.env.ADMIN_EMAIL || 'admin@gnm.com' },
        { mobile: process.env.ADMIN_MOBILE || '9876543210' }
      ]
    });
    
    if (!existingAdmin) {
      const admin = await Admin.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@gnm.com',
        mobile: process.env.ADMIN_MOBILE || '9876543210',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      });
      console.log('✅ Admin created automatically!');
    } else {
      console.log('✅ Admin already exists!');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};

// Run seed after DB connection is established
mongoose.connection.once('open', () => {
  seedAdminOnStart();
});

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000", 
      "http://localhost:5173", 
      "https://gnm-lead-management-system-1.onrender.com"
    ],
    methods: ["GET", "POST"]
  }
});

const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:5173", 
  "https://gnm-lead-management-system-1.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000
});
app.use(limiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join', (userId) => {
    socket.join(userId);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
