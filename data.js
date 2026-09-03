// data.js - 模擬資料庫 (Mock Database)

const mockDatabase = {
    students: [
        {
            id: 'A01',
            name: '李承恩',
            gender: '男',
            school: '百齡高中',
            grade: '3年級',
            classNum: '305'
        },
        {
            id: 'B02',
            name: '林曉薇',
            gender: '女',
            school: '中山女高',
            grade: '2年級',
            classNum: '201'
        },
        {
            id: 'C03',
            name: '陳智遠',
            gender: '男',
            school: '成功高中',
            grade: '1年級',
            classNum: '109'
        }
    ],

    // 模擬向資料庫發送 GET 請求的方法
    getAllStudents: function() {
        console.log("「資料庫」正在處理查詢請求...");
        return this.students;
    },

    // (可選：新增) 模擬向資料庫發送 POST 請求的方法
    addStudent: function(newStudentData) {
        this.students.push(newStudentData);
        return { success: true, message: '資料已加入模擬資料庫' };
    }
};