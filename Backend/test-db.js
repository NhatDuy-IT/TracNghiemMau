
// BẮT BUỘC phải require 'mssql/msnodesqlv8' thay vì 'mssql' thông thường
const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'MSI\\SQLEXPRESS01', // Lưu ý: Phải dùng 2 dấu gạch chéo ngược (\\)
    database: 'TracNghiemWebSite',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true, // Dòng này khai báo sử dụng Windows Authentication
        encrypt: false           // Tắt mã hóa khi chạy localhost
    }
};

async function testConnection() {
    try {
        console.log("⏳ Đang thử kết nối đến SQL Server...");
        
        // Thực hiện kết nối
        let pool = await sql.connect(config);
        console.log("✅ KẾT NỐI THÀNH CÔNG đến database: TracNghiemWebSite!");
        
        // Chạy thử một câu truy vấn nhỏ để chắc chắn CSDL phản hồi
        let result = await pool.request().query('SELECT @@VERSION as SQL_Version');
        console.log("ℹ️ Thông tin SQL Server của bạn:", result.recordset[0].SQL_Version);
        
        // Đóng kết nối sau khi test xong
        pool.close();
    } catch (error) {
        console.error("❌ KẾT NỐI THẤT BẠI. Lỗi chi tiết bên dưới:");
        console.error(error.message);
    }
}

// Gọi hàm chạy thử
testConnection();