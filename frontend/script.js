const API_URL = 'https://localhost/api';
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        studentName: document.getElementById('studentName').value,
        email: document.getElementById('email').value,
        studentId: document.getElementById('studentId').value,
        department: document.getElementById('department').value,
        phoneNumber: document.getElementById('phoneNumber').value
    };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Student registered successfully!', 'success');
            document.getElementById('registrationForm').reset();
        } else {
            showMessage(data.error || 'Registration failed!', 'error');
        }
    } catch (error) {
        showMessage('Error connecting to server! Please check if backend is running.', 'error');
        console.error('Error:', error);
    }
});

document.getElementById('loadStudents').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/students`);
        const data = await response.json();

        if (response.ok) {
            displayStudents(data.students);
        } else {
            showMessage(data.error || 'Failed to load students!', 'error');
        }
    } catch (error) {
        showMessage('Error connecting to server! Please check if backend is running.', 'error');
        console.error('Error:', error);
    }
});

function displayStudents(students) {
    const studentsList = document.getElementById('studentsList');
    
    if (students.length === 0) {
        studentsList.innerHTML = '<p style="text-align: center; color: #999;">No students registered yet.</p>';
        return;
    }

    studentsList.innerHTML = students.map(student => `
        <div class="student-card">
            <h3>${student.student_name}</h3>
            <p><strong>Student ID:</strong> ${student.student_id}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Department:</strong> ${student.department}</p>
            <p><strong>Phone:</strong> ${student.phone_number}</p>
            <p><strong>Registered:</strong> ${new Date(student.created_at).toLocaleDateString()}</p>
        </div>
    `).join('');
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

async function testConnection() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        if (data.status === 'ok') {
            console.log('Backend and database connected successfully');
        } else {
            console.warn('Backend connected but database issues');
        }
    } catch (error) {
        console.error('Cannot connect to backend:', error);
    }
}

testConnection();