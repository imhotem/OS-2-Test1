// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', () => {
  renderStudentList();
});

// 切換「新增介面」與「瀏覽介面」
function switchPage() {
  const addPage = document.getElementById('addPage');
  const listPage = document.getElementById('listPage');
  const toggleBtn = document.getElementById('toggleBtn');

  if (addPage.classList.contains('active')) {
    // 切換至瀏覽頁面
    addPage.classList.remove('active');
    listPage.classList.add('active');
    toggleBtn.textContent = '新增學員資料';
    renderStudentList(); // 重新整理並重新排序
  } else {
    // 切換至新增頁面
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
    tbody.innerHTML = `<tr><td colspan="4" class="empty-msg">目前尚無學員資料</td></tr>`;
    return;
  }

  // 依據「編號」進行升冪排序 (A01, A02, A03...)
  students.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));

  // 動態建立表格內容
  students.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="student-id">${s.id}</td>
      <td class="student-name">${s.name}</td>
      <td class="student-gender">${s.gender}</td>
      <td class="student-school">${s.school}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 新增學員資料
function addStudent(event) {
  event.preventDefault();

  const sid = document.getElementById('sid').value.trim();
  const sname = document.getElementById('sname').value.trim();
  const sgender = document.getElementById('sgender').value;
  const sschool = document.getElementById('sschool').value.trim();
  const sgrade = document.getElementById('sgrade').value.trim();
  const sclass = document.getElementById('sclass').value.trim();

  const students = getStoredStudents();

  // 檢查學員編號是否重複
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
}