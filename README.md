# Website Thi Trắc Nghiệm

Đồ án website thi trắc nghiệm trực tuyến với Backend (Node.js + Express) và Frontend (HTML/CSS/JS + Bootstrap).

## Công nghệ sử dụng

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Web Framework
- **SQL Server** - Cơ sở dữ liệu
- **msnodesqlv8** - Driver kết nối SQL Server (Windows Authentication)
- **JWT** - Xác thực và phân quyền
- **bcryptjs** - Mã hóa password

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **Vanilla JavaScript** - Logic
- **Bootstrap 5** - UI Framework

---

## Cấu trúc dự án

```
TracNghiemNode/
├── Backend/
│   ├── controllers/
│   │   ├── authController.js    # Xử lý đăng ký, đăng nhập
│   │   ├── adminController.js   # CRUD Admin
│   │   └── userController.js    # Chức năng User
│   ├── routes/
│   │   ├── auth.js              # Route Auth
│   │   ├── admin.js             # Route Admin
│   │   └── user.js              # Route User
│   ├── database.js              # Cấu hình kết nối SQL Server
│   ├── database.sql             # Script tạo database
│   ├── index.js                 # File khởi động server
│   └── test-db.js               # Test kết nối database
├── Frontend/
│   ├── index.html               # Trang đăng nhập/đăng ký
│   ├── home.html                # Trang chủ - danh sách môn thi
│   ├── exam.html                # Trang thi trắc nghiệm
│   ├── history.html             # Lịch sử thi
│   ├── admin.html               # Trang quản lý Admin
│   └── js/
│       └── api.js               # Các hàm gọi API
├── package.json                  # Cấu hình npm
└── README.md                    # File hướng dẫn
```

---

## Các bước cài đặt và chạy

### Bước 1: Cài đặt SQL Server

1. Cài đặt **SQL Server Express** (nếu chưa có)
2. Cài đặt **SQL Server Management Studio (SSMS)**
3. Server name: `MSI\SQLEXPRESS01`

### Bước 2: Tạo Database

1. Mở **SQL Server Management Studio**
2. Kết nối đến server `MSI\SQLEXPRESS01`
3. Mở file `Backend/database.sql`
4. Execute toàn bộ script để tạo database và các bảng

### Bước 3: Cài đặt Node.js Dependencies

Mở terminal tại thư mục gốc và chạy:

```
bash
npm install
```

### Bước 4: Chạy Backend Server

```
bash
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

### Bước 5: Chạy Frontend

Có 2 cách:

**Cách 1: Mở trực tiếp file HTML**
- Vào thư mục `Frontend/`
- Mở file `index.html` bằng trình duyệt

**Cách 2: Sử dụng Live Server (khuyến khích)**
- Sử dụng VS Code với extension "Live Server"
- Click chuột phải vào `Frontend/index.html` → "Open with Live Server"

---

## Tài khoản mặc định

### Admin (tạo thủ công)
Bạn cần tạo tài khoản Admin thủ công trong database hoặc đăng ký rồi sửa role trong SQL:

```
sql
UPDATE Users SET Role = 'Admin' WHERE Username = 'admin';
```

### User
Đăng ký bình thường tại trang đăng ký.

---

## Các API Endpoints

### Auth (Không cần token)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |

### User (Cần token)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/user/subjects` | Lấy danh sách môn thi |
| GET | `/api/user/questions/:subjectId` | Lấy câu hỏi theo môn |
| POST | `/api/user/exam/submit` | Nộp bài và chấm điểm |
| GET | `/api/user/exam-history` | Lịch sử thi của user |

### Admin (Cần token Admin)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/subjects` | Danh sách môn thi |
| POST | `/api/admin/subjects` | Thêm môn thi |
| PUT | `/api/admin/subjects/:id` | Sửa môn thi |
| DELETE | `/api/admin/subjects/:id` | Xóa môn thi |
| GET | `/api/admin/questions` | Danh sách câu hỏi |
| POST | `/api/admin/questions` | Thêm câu hỏi |
| PUT | `/api/admin/questions/:id` | Sửa câu hỏi |
| DELETE | `/api/admin/questions/:id` | Xóa câu hỏi |
| GET | `/api/admin/exam-history` | Lịch sử thi toàn hệ thống |

---

## Luồng sử dụng

### Với User:
1. **Đăng nhập** tại `index.html`
2. **Chọn môn thi** tại `home.html`
3. **Làm bài thi** tại `exam.html` (có đồng hồ đếm ngược)
4. **Xem kết quả** ngay sau khi nộp bài
5. **Xem lịch sử thi** tại `history.html`

### Với Admin:
1. **Đăng nhập** bằng tài khoản Admin
2. **Quản lý môn thi** - Thêm/Sửa/Xóa môn thi
3. **Quản lý câu hỏi** - Thêm/Sửa/Xóa câu hỏi trắc nghiệm
4. **Xem lịch sử thi** của toàn bộ hệ thống

---

## Cấu hình kết nối Database

File: `Backend/database.js`

```
javascript
const config = {
    server: 'MSI\\SQLEXPRESS01',
    database: 'TracNghiemWebSite',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true
    }
};
```

**Lưu ý**: Sử dụng Windows Authentication (`trustedConnection: true`), không cần username/password.

---

## Xử lý sự cố

### Lỗi kết nối SQL Server
- Kiểm tra SQL Server đang chạy
- Kiểm tra server name `MSI\SQLEXPRESS01` có đúng không
- Kiểm tra đã tạo database `TracNghiemWebSite` chưa

### Lỗi msnodesqlv8
- Cài đặt Visual Studio với C++ workload
- Hoặc chuyển sang dùng driver `tedious`

### Lỗi CORS
- Backend đã cấu hình sẵn `cors()` middleware
- Đảm bảo Frontend gọi đúng URL `http://localhost:3000/api`

---

## Giải thích điểm

- **Điểm tối đa**: 10 điểm
- **Công thức**: (Số câu đúng / Tổng số câu) × 10

---

## License

MIT
