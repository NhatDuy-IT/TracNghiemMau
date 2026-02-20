const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, connectDB } = require('../database');

const JWT_SECRET = 'your-secret-key-change-in-production';

const authController = {
    // Đăng ký
    register: async (req, res) => {
        try {
            const { username, password, fullName, email } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username và password là bắt buộc' });
            }

            const pool = await connectDB();

            // Kiểm tra username đã tồn tại chưa
            const checkUser = await pool.request()
                .input('username', sql.NVarChar, username)
                .query('SELECT UserID FROM Users WHERE Username = @username');

            if (checkUser.recordset.length > 0) {
                return res.status(400).json({ error: 'Username đã tồn tại' });
            }

            // Mã hóa password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Thêm user mới
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .input('password', sql.NVarChar, hashedPassword)
                .input('fullName', sql.NVarChar, fullName || '')
                .input('email', sql.NVarChar, email || '')
                .input('role', sql.NVarChar, 'User')
                .query(`
                    INSERT INTO Users (Username, Password, FullName, Email, Role)
                    VALUES (@username, @password, @fullName, @email, @role);
                    SELECT SCOPE_IDENTITY() as UserID;
                `);

            const userId = result.recordset[0].UserID;

            res.status(201).json({
                message: 'Đăng ký thành công',
                user: {
                    userId,
                    username,
                    fullName,
                    email,
                    role: 'User'
                }
            });
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Đăng nhập
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username và password là bắt buộc' });
            }

            const pool = await connectDB();

            // Tìm user
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .query('SELECT * FROM Users WHERE Username = @username');

            if (result.recordset.length === 0) {
                return res.status(401).json({ error: 'Username hoặc password không đúng' });
            }

            const user = result.recordset[0];

            // Kiểm tra password
            const isMatch = await bcrypt.compare(password, user.Password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Username hoặc password không đúng' });
            }

            // Tạo JWT token
            const token = jwt.sign(
                { userId: user.UserID, username: user.Username, role: user.Role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Đăng nhập thành công',
                token,
                user: {
                    userId: user.UserID,
                    username: user.Username,
                    fullName: user.FullName,
                    email: user.Email,
                    role: user.Role
                }
            });
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
};

module.exports = authController;
