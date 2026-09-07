// 全域變數：追蹤目前是否為編輯模式（null 代表新增模式，有字串代表正在修改該編號的學員）
let editingId = null;

// 取得所有學員資料
function getStoredStudents() {
    const localData = localStorage.getItem('student_records');
    if (localData) {
        return JSON.parse(localData);
    }
    return [];
}

// 儲存學員資料至 localStorage
function saveStoredStudents(students) {
    localStorage.setItem('student_records', JSON.stringify(students));
}

// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', () => {
    renderStudentList();
});

// 切換「新增/修改介面」與「瀏覽介面」
function switchPage() {
    const addPage = document.getElementById('addPage');
    const listPage = document.getElementById('listPage');
    const toggleBtn = document.getElementById('toggleBtn');

    if (addPage.classList.contains('active')) {
        // 切換至瀏覽頁面
        addPage.classList.remove('active');
        listPage.classList.add('active');
        toggleBtn.textContent = '新增學員資料';
        renderStudentList(); 
    } else {
        // 切換至新增頁面（若原本在編輯中途切換，可選擇是否重置）
        listPage.classList.remove('active');
        addPage.classList.add('active');
        toggleBtn.textContent = '學生資料瀏覽';
    }
}

// 渲染瀏覽介面列表（依據編號排序）
function renderStudentList() {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    let students = getStoredStudents();

    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-msg">目前尚無學員資料</td></tr>`;
        return;
    }

    // 依據「編號」進行升冪排序 (A01, A02, A03...)
    students.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));

    // 動態建立表格內容
    students.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="student-id">${s.id}</td>
            <td>${s.name}</td>
            <td>${s.gender}</td>
            <td>${s.school}</td>
            <td><button class="btn-edit" onclick="prepareEdit('${s.id}')">修改</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// 表單送出總分流（判斷是要「新增」還是「修改」）
function handleFormSubmit(event) {
    event.preventDefault();

    const sid = document.getElementById('sid').value.trim();
    const sname = document.getElementById('sname').value.trim();
    const sgender = document.getElementById('sgender').value;
    const sschool = document.getElementById('sschool').value.trim();
    const sgrade = document.getElementById('sgrade').value.trim();
    const sclass = document.getElementById('sclass').value.trim();

    let students = getStoredStudents();

    if (editingId === null) {
        // --- 模式 A：新增學員 ---
        const exists = students.some(s => s.id.toUpperCase() === sid.toUpperCase());
        if (exists) {
            alert(`學員編號 "${sid}" 已存在，請使用其他編號！`);
            return;
        }

        const newStudent = {
            id: sid,
            name: sname,
            gender: sgender,
            school: sschool,
            grade: sgrade,
            className: sclass
        };

        students.push(newStudent);
        saveStoredStudents(students);
        alert('新增成功！資料已儲存。');
        document.getElementById('studentForm').reset();

    } else {
        // --- 模式 B：修改現有學員 ---
        const index = students.findIndex(s => s.id === editingId);
        if (index !== -1) {
            students[index].name = sname;
            students[index].gender = sgender;
            students[index].school = sschool;
            students[index].grade = sgrade;
            students[index].className = sclass;
            // 注意：編號 id 維持不變（作為主要識別鍵）

            saveStoredStudents(students);
            alert(`學員編號 "${editingId}" 修改成功！`);
        }
        
        // 恢復成新增模式並清空表單
        resetFormMode();
    }
}

// 點擊列表中的「修改」按鈕時觸發
function prepareEdit(id) {
    let students = getStoredStudents();
    const target = students.find(s => s.id === id);
    if (!target) return;

    // 1. 記錄目前正在編輯的 ID
    editingId = target.id;

    // 2. 把資料填入表單欄位
    document.getElementById('sid').value = target.id;
    document.getElementById('sid').disabled = true; // 修改時不允許更改編號主鍵
    document.getElementById('sname').value = target.name;
    document.getElementById('sgender').value = target.gender;
    document.getElementById('sschool').value = target.school;
    document.getElementById('sgrade').value = target.grade || '';
    document.getElementById('sclass').value = target.className || '';

    // 3. 改變介面文字與按鈕狀態（切換為編輯模式視覺）
    document.getElementById('formPageTitle').textContent = '學員資料修改介面';
    document.getElementById('formCardTitle').textContent = `修改學員資料 (編號: ${target.id})`;
    document.getElementById('submitBtn').textContent = '確認修改';
    document.getElementById('submitBtn').style.backgroundColor = '#2563eb'; // 改成藍色系
    document.getElementById('cancelBtn').style.display = 'block'; // 顯示取消按鈕

    // 4. 自動跳轉回「新增/修改表單」頁面
    const addPage = document.getElementById('addPage');
    const listPage = document.getElementById('listPage');
    const toggleBtn = document.getElementById('toggleBtn');

    addPage.classList.add('active');
    listPage.classList.remove('active');
    toggleBtn.textContent = '學生資料瀏覽';
}

// 離開編輯模式，重置表單為「新增模式」
function resetFormMode() {
    editingId = null;
    document.getElementById('studentForm').reset();
    document.getElementById('sid').disabled = false; // 解除編號唯讀

    // 恢復介面文字
    document.getElementById('formPageTitle').textContent = '學員資料新增介面';
    document.getElementById('formCardTitle').textContent = '新增學員資料';
    document.getElementById('submitBtn').textContent = '確認新增';
    document.getElementById('submitBtn').style.backgroundColor = '#16a34a'; // 恢復綠色
    document.getElementById('cancelBtn').style.display = 'none'; // 隱藏取消按鈕
}