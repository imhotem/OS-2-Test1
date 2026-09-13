const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// 1. 設定靜態檔案提供（讓前端網頁、CSS、JS 等可以直接被讀取）
app.use(express.static(path.join(__dirname, '.')));

// 2. 首頁路由：當存取 cflr.com.tw/ 時，自動傳送 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. 建立 AWS RDS MySQL 資料庫連線池 (Connection Pool)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// 4. API 健康檢查端點 (測試 RDS 連線)
app.get('/api/health', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        await connection.end();
        
        res.json({
            status: "ok",
            message: "AWS RDS 資料庫連線成功！",
            data: rows
        });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            status: "error",
            message: "資料庫連線失敗",
            error: error.message
        });
    }
});

// 本地開發測試埠號設定
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;