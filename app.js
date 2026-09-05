// 渲染資料卡片的函式
function renderStudents(dataArray) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // 清空現有卡片

    dataArray.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div><span>編號：</span>${student.id}</div>
            <div><span>姓名：</span>${student.name}</div>
            <div><span>性別：</span>${student.gender}</div>
            <div><span>學校：</span>${student.school}</div>
            <div><span>年級：</span>${student.grade}</div>
            <div><span>班級：</span>${student.classNum}</div>
        `;
        container.appendChild(card);
    });
}

// 載入初始資料
function loadData() {
    renderStudents(studentData);
}

// 新增學員資料處理函式
function addStudent(event) {
    event.preventDefault(); // 防止表單跳頁

    // 取得輸入數值
    const newStudent = {
        id: document.getElementById('stu-id').value,
        name: document.getElementById('stu-name').value,
        gender: document.getElementById('stu-gender').value,
        school: document.getElementById('stu-school').value,
        grade: document.getElementById('stu-grade').value,
        classNum: document.getElementById('stu-class').value
    };

    // 推入資料陣列
    studentData.push(newStudent);

    // 重新渲染畫面
    renderStudents(studentData);

    // 清空表單
    document.getElementById('student-form').reset();

    alert('新增成功！');
}