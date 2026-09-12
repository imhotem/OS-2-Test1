const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());

// 提供前端靜態檔案
app.use(express.static(path.join(__dirname, '.')));

// 建立 MySQL 連線池
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    connectTimeout: 10000
});

// 健康檢查 API
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.json({ message: 'AWS RDS 資料庫連線成功！', data: rows });
    } catch (err) {
        res.status(500).json({ error: '資料庫連線失敗: ' + err.message });
    }
});

// 1. 取得所有學員
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students');
        const formatted = rows.map(s => ({
            id: s.id,
            name: s.name,
            gender: s.gender,
            school: s.school,
            grade: s.grade,
            className: s.class_name || s.class || ''
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. 新增學員
app.post('/api/students', async (req, res) => {
    const { id, name, gender, school, grade, className } = req.body;
    try {
        const sql = 'INSERT INTO students (id, name, gender, school, grade, class_name) VALUES (?, ?, ?, ?, ?, ?)';
        await pool.query(sql, [id, name, gender, school, grade, className]);
        res.json({ message: '新增成功' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: `學員編號 "${id}" 已存在！` });
        }
        res.status(500).json({ error: err.message });
    }
});

// 3. 修改學員
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, gender, school, grade, className } = req.body;
    try {
        const sql = 'UPDATE students SET name=?, gender=?, school=?, grade=?, class_name=? WHERE id=?';
        await pool.query(sql, [name, gender, school, grade, className, id]);
        res.json({ message: '修改成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 本地測試用，Vercel 部署自動跳過
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`伺服器啟動於端口 ${process.env.PORT || 3000}`);
    });
}

module.exports = app;