let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderStudentList();
});

function switchPage() {
    const addPage = document.getElementById('addPage');
    const listPage = document.getElementById('listPage');
    const toggleBtn = document.getElementById('toggleBtn');

    if (addPage.classList.contains('active')) {
        addPage.classList.remove('active');
        listPage.classList.add('active');
        toggleBtn.textContent = '新增學員資料';
        renderStudentList();
    } else {
        listPage.classList.remove('active');
        addPage.classList.add('active');
        toggleBtn.textContent = '學生資料瀏覽';
    }
}

async function renderStudentList() {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;

    try {
        const res = await fetch('/api/students');
        let students = await res.json();

        tbody.innerHTML = '';
        if (!students || students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">目前尚無學員資料</td></tr>';
            return;
        }

        students.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));

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
    } catch (err) {
        console.error('無法讀取學員資料:', err);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const sid = document.getElementById('sid').value.trim();
    const sname = document.getElementById('sname').value.trim();
    const sgender = document.getElementById('sgender').value;
    const sschool = document.getElementById('sschool').value.trim();
    const sgrade = document.getElementById('sgrade').value.trim();
    const sclass = document.getElementById('sclass').value.trim();

    const payload = {
        id: sid,
        name: sname,
        gender: sgender,
        school: sschool,
        grade: sgrade,
        className: sclass
    };

    if (editingId === null) {
        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || '新增失敗');
                return;
            }
            alert('新增成功！資料已寫入 AWS RDS MySQL。');
            document.getElementById('studentForm').reset();
        } catch (err) {
            alert('連線失敗');
        }
    } else {
        try {
            const res = await fetch(`/api/students/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                alert('修改失敗');
                return;
            }
            alert(`學員編號 "${editingId}" 修改成功！`);
            resetFormMode();
        } catch (err) {
            alert('連線失敗');
        }
    }
}

async function prepareEdit(id) {
    try {
        const res = await fetch('/api/students');
        const students = await res.json();
        const target = students.find(s => s.id === id);
        if (!target) return;

        editingId = target.id;
        document.getElementById('sid').value = target.id;
        document.getElementById('sid').disabled = true;
        document.getElementById('sname').value = target.name;
        document.getElementById('sgender').value = target.gender;
        document.getElementById('sschool').value = target.school;
        document.getElementById('sgrade').value = target.grade || '';
        document.getElementById('sclass').value = target.className || '';

        document.getElementById('formPageTitle').textContent = '學員資料修改介面';
        document.getElementById('formCardTitle').textContent = `修改學員資料 (編號: ${target.id})`;
        document.getElementById('submitBtn').textContent = '確認修改';
        document.getElementById('submitBtn').style.backgroundColor = '#2563eb';
        document.getElementById('cancelBtn').style.display = 'block';

        document.getElementById('addPage').classList.add('active');
        document.getElementById('listPage').classList.remove('active');
        document.getElementById('toggleBtn').textContent = '學生資料瀏覽';
    } catch (err) {
        console.error('讀取失敗:', err);
    }
}

function resetFormMode() {
    editingId = null;
    document.getElementById('studentForm').reset();
    document.getElementById('sid').disabled = false;
    document.getElementById('formPageTitle').textContent = '學員資料新增介面';
    document.getElementById('formCardTitle').textContent = '新增學員資料';
    document.getElementById('submitBtn').textContent = '確認新增';
    document.getElementById('submitBtn').style.backgroundColor = '#16a34a';
    document.getElementById('cancelBtn').style.display = 'none';
}