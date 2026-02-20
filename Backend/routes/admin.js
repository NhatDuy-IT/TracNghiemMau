const express = require('express');
const router = express.Router();
const { adminController, verifyAdmin } = require('../controllers/adminController');

// Tất cả các route Admin đều cần xác thực
router.use(verifyAdmin);

// ==================== SUBJECTS (Môn thi) ====================
// Lấy danh sách tất cả môn thi
router.get('/subjects', adminController.getAllSubjects);

// Lấy thông tin một môn thi
router.get('/subjects/:id', adminController.getSubjectById);

// Thêm môn thi mới
router.post('/subjects', adminController.createSubject);

// Cập nhật môn thi
router.put('/subjects/:id', adminController.updateSubject);

// Xóa môn thi
router.delete('/subjects/:id', adminController.deleteSubject);

// ==================== QUESTIONS (Câu hỏi) ====================
// Lấy danh sách câu hỏi
router.get('/questions', adminController.getAllQuestions);

// Lấy thông tin một câu hỏi
router.get('/questions/:id', adminController.getQuestionById);

// Thêm câu hỏi mới
router.post('/questions', adminController.createQuestion);

// Cập nhật câu hỏi
router.put('/questions/:id', adminController.updateQuestion);

// Xóa câu hỏi
router.delete('/questions/:id', adminController.deleteQuestion);

// ==================== EXAM HISTORY (Lịch sử thi) ====================
// Xem lịch sử thi của toàn bộ hệ thống
router.get('/exam-history', adminController.getAllExamHistory);

module.exports = router;
