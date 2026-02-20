// BẮT BUỘC phải require 'mssql/msnodesqlv8' thay vì 'mssql' thông thường
const sql = require('mssql/msnodesqlv8');

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

const connectDB = async () => {
    try {
        let pool = await sql.connect(config);
        console.log('✅ Kết nối SQL Server thành công (Windows Authentication)');
        return pool;
    } catch (err) {
        console.error('❌ Lỗi kết nối SQL Server:', err.message);
        process.exit(1);
    }
};

module.exports = { connectDB, sql };
