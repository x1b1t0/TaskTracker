document.addEventListener('DOMContentLoaded', () => {
    const showLogin = document.getElementById('showLogin');
    const showRegister = document.getElementById('showRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const taskManager = document.getElementById('taskManager');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function saveCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    function updateTaskCount() {
        const pendingTasks = taskList.querySelectorAll('li:not(.completed)').length;
        taskCount.textContent = `Pending tasks: ${pendingTasks}`;
    }

    function addTaskToList(task) {
        const listItem = document.createElement('li');
        listItem.textContent = task;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('task-buttons');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            updateTaskCount();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            listItem.remove();
            updateTaskCount();
        });

        buttonsDiv.appendChild(completeBtn);
        buttonsDiv.appendChild(deleteBtn);
        listItem.appendChild(buttonsDiv);
        taskList.appendChild(listItem);
    }

    function loadTasks() {
        taskList.innerHTML = '';
        if (currentUser && currentUser.tasks) {
            currentUser.tasks.forEach(task => addTaskToList(task));
            updateTaskCount();
        }
    }

    function toggleAuthForms(showLoginForm) {
        loginForm.style.display = showLoginForm ? 'block' : 'none';
        registerForm.style.display = showLoginForm ? 'none' : 'block';
    }

    function showTaskManager() {
        document.getElementById('auth').style.display = 'none';
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        taskManager.style.display = 'block';
        loadTasks();
    }

    if (currentUser) {
        showTaskManager();
    }

    showLogin.addEventListener('click', () => toggleAuthForms(true));
    showRegister.addEventListener('click', () => toggleAuthForms(false));

    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            currentUser = user;
            saveCurrentUser(user);
            showTaskManager();
        } else {
            alert('Invalid username or password');
        }
    });

    registerBtn.addEventListener('click', () => {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        if (users.some(user => user.username === username)) {
            alert('Username already exists');
        } else {
            const newUser = { username, password, tasks: [] };
            users.push(newUser);
            saveUsers();
            alert('Registration successful, please login');
            toggleAuthForms(true);
        }
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        taskManager.style.display = 'none';
        document.getElementById('auth').style.display = 'block';
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskValue = taskInput.value.trim();
        if (taskValue !== '') {
            addTaskToList(taskValue);
            taskInput.value = '';
            currentUser.tasks.push(taskValue);
            saveCurrentUser(currentUser);
            saveUsers();
            updateTaskCount();
        }
    });
});