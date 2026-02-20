-- =============================================
-- Script Tạo CSDL cho Website Thi Trắc Nghiệm
-- =============================================

-- Tạo CSDL nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'TracNghiemWebSite')
BEGIN
    CREATE DATABASE TracNghiemWebSite;
END
GO

USE TracNghiemWebSite;
GO

-- =============================================
-- Bảng Users (Người dùng)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserID INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) UNIQUE NOT NULL,
        Password NVARCHAR(255) NOT NULL,
        FullName NVARCHAR(100),
        Email NVARCHAR(100),
        Role NVARCHAR(20) CHECK (Role IN ('Admin', 'User')) DEFAULT 'User',
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Bảng Subjects (Môn thi/Chủ đề)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Subjects')
BEGIN
    CREATE TABLE Subjects (
        SubjectID INT IDENTITY(1,1) PRIMARY KEY,
        SubjectName NVARCHAR(100) NOT NULL,
        Description NVARCHAR(500),
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Bảng Questions (Câu hỏi trắc nghiệm)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Questions')
BEGIN
    CREATE TABLE Questions (
        QuestionID INT IDENTITY(1,1) PRIMARY KEY,
        SubjectID INT FOREIGN KEY REFERENCES Subjects(SubjectID) ON DELETE CASCADE,
        QuestionText NVARCHAR(MAX) NOT NULL,
        OptionA NVARCHAR(500) NOT NULL,
        OptionB NVARCHAR(500) NOT NULL,
        OptionC NVARCHAR(500) NOT NULL,
        OptionD NVARCHAR(500) NOT NULL,
        CorrectAnswer CHAR(1) CHECK (CorrectAnswer IN ('A', 'B', 'C', 'D')) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Bảng ExamHistory (Lịch sử thi)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ExamHistory')
BEGIN
    CREATE TABLE ExamHistory (
        ExamID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
        SubjectID INT FOREIGN KEY REFERENCES Subjects(SubjectID) ON DELETE CASCADE,
        Score FLOAT NOT NULL,
        TotalQuestions INT NOT NULL,
        CorrectAnswers INT NOT NULL,
        ExamDate DATETIME DEFAULT GETDATE()
    );
END
GO

PRINT N'✅ Tạo CSDL và các bảng hoàn tất!';
GO
