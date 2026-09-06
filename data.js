// 取得所有學員資料
function getStoredStudents() {
  const localData = localStorage.getItem('student_records');
  if (localData) {
    return JSON.parse(localData);
  } else {
    // 預設為空陣列，由使用者自行新增資料
    return [];
  }
}

// 儲存學員資料至 localStorage
function saveStoredStudents(students) {
  localStorage.setItem('student_records', JSON.stringify(students));
}