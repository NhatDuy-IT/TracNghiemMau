const { sql, connectDB } = require('../database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware xác thực Admin
const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token không được cung cấp' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'Admin') {
            return res.status(403).json({ error: 'Chỉ Admin mới có quyền truy cập' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

const adminController = {
    // ==================== SUBJECTS (Môn thi) ====================

    // Lấy danh sách tất cả môn thi
    getAllSubjects: async (req, res) => {
        try {
            const pool = await connectDB();
            const result = await pool.request()
                .query('SELECT * FROM Subjects ORDER BY SubjectID DESC');
            
            res.json(result.recordset);
        } catch (error) {
            console.error('Lỗi lấy danh sách môn thi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Lấy thông tin một môn thi
    getSubjectById: async (req, res) => {
        try {
            const { id } = req.params;
            const pool = await connectDB();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Subjects WHERE SubjectID = @id');

            if (result.recordset.length === 0) {
                return res.status(404).json({ error: 'Môn thi không tồn tại' });
            }

            res.json(result.recordset[0]);
        } catch (error) {
            console.error('Lỗi lấy thông tin môn thi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Thêm môn thi mới
    createSubject: async (req, res) => {
        try {
            const { subjectName, description } = req.body;

            if (!subjectName) {
                return res.status(400).json({ error: 'Tên môn thi là bắt buộc' });
            }

            const pool = await connectDB();
            const result = await pool.request()
                .input('subjectName', sql.NVarChar, subjectName)
                .input('description', sql.NVarChar, description || '')
                .query(`
                    INSERT INTO Subjects (SubjectName, Description)
                    VALUES (@subjectName, @description);
                    SELECT SCOPE_IDENTITY() as SubjectID;
                `);

            const subjectId = result.recordset[0].SubjectID;

            res.status(201).json({
                message: 'Thêm môn thi thành công',
                subjectId
            });
        } catch (error) {
            console.error('Lỗi thêm môn thi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Cập nhật môn thi
    updateSubject: async (req, res) => {
        try {
            const { id } = req.params;
            const { subjectName, description } = req.body;

            const pool = await connectDB();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('subjectName', sql.NVarChar, subjectName)
                .input('description', sql.NVarChar, description || '')
                .query(`
                    UPDATE Subjects 
                    SET SubjectName = @subjectName, Description = @description
                    WHERE SubjectID = @id
                `);

            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({ error: 'Môn thi không tồn tại' });
            }

            res.json({ message: 'Cập nhật môn thi thành công' });
        } catch (error) {
            console.error('Lỗi cập nhật môn thi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Xóa môn thi
    deleteSubject: async (req, res) => {
        try {
            const { id } = req.params;
            const pool = await connectDB();
            
            // Xóa câu hỏi thuộc môn thi trước
            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Questions WHERE SubjectID = @id');

            // Xóa lịch sử thi thuộc môn thi
            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM ExamHistory WHERE SubjectID = @id');

            // Xóa môn thi
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Subjects WHERE SubjectID = @id');

            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({ error: 'Môn thi không tồn tại' });
            }

            res.json({ message: 'Xóa môn thi thành công' });
        } catch (error) {
            console.error('Lỗi xóa môn thi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // ==================== QUESTIONS (Câu hỏi) ====================

    // Lấy danh sách câu hỏi (có thể lọc theo môn thi)
    getAllQuestions: async (req, res) => {
        try {
            const { subjectId } = req.query;
            const pool = await connectDB();
            
            let query = 'SELECT * FROM Questions';
            let request = pool.request();

            if (subjectId) {
                query += ' WHERE SubjectID = @subjectId';
                request.input('subjectId', sql.Int, subjectId);
            }

            query += ' ORDER BY QuestionID DESC';
            const result = await request.query(query);

            res.json(result.recordset);
        } catch (error) {
            console.error('Lỗi lấy danh sách câu hỏi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Lấy thông tin một câu hỏi
    getQuestionById: async (req, res) => {
        try {
            const { id } = req.params;
            const pool = await connectDB();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Questions WHERE QuestionID = @id');

            if (result.recordset.length === 0) {
                return res.status(404).json({ error: 'Câu hỏi không tồn tại' });
            }

            res.json(result.recordset[0]);
        } catch (error) {
            console.error('Lỗi lấy thông tin câu hỏi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Thêm câu hỏi mới
    createQuestion: async (req, res) => {
        try {
            const { subjectId, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

            if (!subjectId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
                return res.status(400).json({ error: 'Thiếu thông tin câu hỏi' });
            }

            if (!['A', 'B', 'C', 'D'].includes(correctAnswer.toUpperCase())) {
                return res.status(400).json({ error: 'Đáp án đúng phải là A, B, C hoặc D' });
            }

            const pool = await connectDB();
            const result = await pool.request()
                .input('subjectId', sql.Int, subjectId)
                .input('questionText', sql.NVarChar, questionText)
                .input('optionA', sql.NVarChar, optionA)
                .input('optionB', sql.NVarChar, optionB)
                .input('optionC', sql.NVarChar, optionC)
                .input('optionD', sql.NVarChar, optionD)
                .input('correctAnswer', sql.Char, correctAnswer.toUpperCase())
                .query(`
                    INSERT INTO Questions (SubjectID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectAnswer)
                    VALUES (@subjectId, @questionText, @optionA, @optionB, @optionC, @optionD, @correctAnswer);
                    SELECT SCOPE_IDENTITY() as QuestionID;
                `);

            const questionId = result.recordset[0].QuestionID;

            res.status(201).json({
                message: 'Thêm câu hỏi thành công',
                questionId
            });
        } catch (error) {
            console.error('Lỗi thêm câu hỏi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Cập nhật câu hỏi
    updateQuestion: async (req, res) => {
        try {
            const { id } = req.params;
            const { subjectId, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

            if (correctAnswer && !['A', 'B', 'C', 'D'].includes(correctAnswer.toUpperCase())) {
                return res.status(400).json({ error: 'Đáp án đúng phải là A, B, C hoặc D' });
            }

            const pool = await connectDB();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('subjectId', sql.Int, subjectId)
                .input('questionText', sql.NVarChar, questionText)
                .input('optionA', sql.NVarChar, optionA)
                .input('optionB', sql.NVarChar, optionB)
                .input('optionC', sql.NVarChar, optionC)
                .input('optionD', sql.NVarChar, optionD)
                .input('correctAnswer', sql.Char, correctAnswer ? correctAnswer.toUpperCase() : null)
                .query(`
                    UPDATE Questions 
                    SET SubjectID = COALESCE(@subjectId, SubjectID),
                        QuestionText = COALESCE(@questionText, QuestionText),
                        OptionA = COALESCE(@optionA, OptionA),
                        OptionB = COALESCE(@optionB, OptionB),
                        OptionC = COALESCE(@optionC, OptionC),
                        OptionD = COALESCE(@optionD, OptionD),
                        CorrectAnswer = COALESCE(@correctAnswer, CorrectAnswer)
                    WHERE QuestionID = @id
                `);

            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({ error: 'Câu hỏi không tồn tại' });
            }

            res.json({ message: 'Cập nhật câu hỏi thành công' });
        } catch (error) {
            console.error('Lỗi cập nhật câu hỏi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Xóa câu hỏi
    deleteQuestion: async (req, res) => {
        try {
            const { id } = req.params;
            const pool = await connectDB();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Questions WHERE QuestionID = @id');

            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({ error: 'Câu hỏi không tồn tại' });
            }

            res.json({ message: 'Xóa câu hỏi thành công' });
        } catch (error) {
            console.error('Lỗi xóa câu hỏi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // ==================== EXAM HISTORY (Lịch sử thi) ====================

    // Xem lịch sử thi của toàn bộ hệ thống
    getAllExamHistory: async (req, res) => {
        try {
            const pool = await connectDB();
            const result = await pool.request()
                .query(`
                    SELECT 
                        eh.ExamID,
                        eh.UserID,
                        u.Username,
                        u.FullName,
                        eh.SubjectID,
                        s.SubjectName,
                        eh.Score,
                        eh.TotalQuestions,
                        eh.CorrectAnswers,
                        eh.ExamDate
                    FROM ExamHistory eh
                    INNER JOIN Users u ON eh.UserID = u.UserID
                    INNER JOIN Subjects s ON eh.SubjectID = s.SubjectID
                    ORDER BY eh.ExamDate DESC
                `);

            res.json(result.recordset);
        } catch (error) {
            console.error('Lỗi lấy lịch sử thi:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
};

module.exports = { adminController, verifyAdmin };
