const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());

// 讓後端能直接提供前端網頁檔 (index.html)
app.use(express.static(path.join(__dirname)));

// 1. 連線至 AWS RDS MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// 2. 自動建立學生資料表
const createTableSql = `
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    school VARCHAR(100) NOT NULL,
    grade VARCHAR(50),
    class_name VARCHAR(50)
);`;

db.query(createTableSql, (err) => {
    if (err) {
        console.error('建立資料表失敗:', err);
    } else {
        console.log('AWS RDS MySQL「students」資料表已準備就緒！');
    }
});

// 健康檢查 API
app.get('/api/health', (req, res) => {
    db.query('SELECT 1 + 1 AS result', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'AWS RDS 資料庫連線成功！', data: results });
    });
});

// API 1: 取得所有學員
app.get('/api/students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const formatted = results.map(s => ({
            id: s.id,
            name: s.name,
            gender: s.gender,
            school: s.school,
            grade: s.grade,
            className: s.class_name
        }));
        res.json(formatted);
    });
});

// API 2: 新增學員
app.post('/api/students', (req, res) => {
    const { id, name, gender, school, grade, className } = req.body;
    const sql = 'INSERT INTO students (id, name, gender, school, grade, class_name) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [id, name, gender, school, grade, className], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: `學員編號 "${id}" 已存在！` });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '新增成功' });
    });
});

// API 3: 修改學員 (已補齊 SQL 逗號)
app.put('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const { name, gender, school, grade, className } = req.body;
    const sql = 'UPDATE students SET name=?, gender=?, school=?, grade=?, class_name=? WHERE id=?';
    db.query(sql, [name, gender, school, grade, className, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: '修改成功' });
    });
});

app.listen(process.env.PORT, () => {
    console.log(`伺服器成功啟動於端口 ${process.env.PORT}`);
});