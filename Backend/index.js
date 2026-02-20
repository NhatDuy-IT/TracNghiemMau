const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database');

// Import Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Route mặc định
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Trắc Nghiệm Website API',
        status: 'Running',
        version: '1.0.0'
    });
});

// Khởi động server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Không thể khởi động server:', error.message);
        process.exit(1);
    }
};

startServer();
