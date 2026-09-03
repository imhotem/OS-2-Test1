// app.js - 應用程式邏輯

// 選取 HTML 元素
const loadButton = document.getElementById('loadButton');
const cardContainer = document.getElementById('studentCardContainer');

// 監聽按鈕點擊事件
loadButton.addEventListener('click', loadData);

function loadData() {
    // 1. 從模擬資料庫取得資料
    const studentsData = mockDatabase.getAllStudents();

    // 2. 為了示範，我們只載入第一筆資料
    if (studentsData.length > 0) {
        const student = studentsData[0];
        console.log("載入的資料:", student);

        // 3. 呼叫函式將資料呈現在畫面上
        displayStudentCard(student);
    } else {
        cardContainer.innerHTML = '<p style="text-align:center; color:red;">無資料。</p>';
    }
}

// 根據資料動態產生 HTML 資料卡片的函式
function displayStudentCard(student) {
    // 產生新的 HTML 結構
    const cardHTML = `
        <div class="student-card">
            <!-- 第一行排版 (對應您的圖片) -->
            <div class="card-row">
                <span class="data-item"><strong>編號:</strong> ${student.id}</span>
                <span class="data-item"><strong>姓名:</strong> ${student.name}</span>
                <span class="data-item"><strong>性別:</strong> ${student.gender}</span>
            </div>
            
            <!-- 第二行排版 (對應您的圖片) -->
            <div class="card-row">
                <span class="data-item"><strong>學校:</strong> ${student.school}</span>
                <span class="data-item"><strong>年級:</strong> ${student.grade}</span>
                <span class="data-item"><strong>班級:</strong> ${student.classNum}</span>
            </div>
        </div>
    `;

    // 將產生的 HTML 放入容器中
    cardContainer.innerHTML = cardHTML;
}