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
    const filterAll = document.getElementById('filterAll');
    const filterPending = document.getElementById('filterPending');
    const filterCompleted = document.getElementById('filterCompleted');
    const filterImportant = document.getElementById('filterImportant');
    const searchTasks = document.getElementById('searchTasks');
    
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
        listItem.textContent = `${task.text} (created at: ${task.createdAt})`;

        if (task.completed) {
            listItem.classList.add('completed');
        }

        if (task.important) {
            listItem.classList.add('important');
        }

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('task-buttons');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            task.completed = !task.completed;
            saveCurrentUser(currentUser);
            saveUsers();
            updateTaskCount();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                listItem.remove();
                currentUser.tasks = currentUser.tasks.filter(t => t !== task);
                saveCurrentUser(currentUser);
                saveUsers();
                updateTaskCount();
            }
        });

        const importantBtn = document.createElement('button');
        importantBtn.textContent = 'Important';
        importantBtn.classList.add('important-btn');
        importantBtn.addEventListener('click', () => {
            listItem.classList.toggle('important');
            task.important = !task.important;
            saveCurrentUser(currentUser);
            saveUsers();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => {
            const newTaskText = prompt('Edit task:', task.text);
            if (newTaskText) {
                task.text = newTaskText;
                listItem.firstChild.textContent = `${newTaskText} (created at: ${task.createdAt})`;
                saveCurrentUser(currentUser);
                saveUsers();
            }
        });

        buttonsDiv.appendChild(completeBtn);
        buttonsDiv.appendChild(deleteBtn);
        buttonsDiv.appendChild(importantBtn);
        buttonsDiv.appendChild(editBtn);
        listItem.appendChild(buttonsDiv);
        taskList.appendChild(listItem);
    }

    function loadTasks(filter = 'all', searchQuery = '') {
        taskList.innerHTML = '';
        if (currentUser && currentUser.tasks) {
            const filteredTasks = currentUser.tasks.filter(task => {
                if (filter === 'pending' && task.completed) return false;
                if (filter === 'completed' && !task.completed) return false;
                if (filter === 'important' && !task.important) return false;
                if (searchQuery && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return true;
            });
            filteredTasks.forEach(task => addTaskToList(task));
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
            const newTask = { text: taskValue, completed: false, important: false, createdAt: new Date().toLocaleString() };
            addTaskToList(newTask);
            taskInput.value = '';
            currentUser.tasks.push(newTask);
            saveCurrentUser(currentUser);
            saveUsers();
            updateTaskCount();
        }
    });

    filterAll.addEventListener('click', () => loadTasks('all'));
    filterPending.addEventListener('click', () => loadTasks('pending'));
    filterCompleted.addEventListener('click', () => loadTasks('completed'));
    filterImportant.addEventListener('click', () => loadTasks('important'));
    searchTasks.addEventListener('input', (e) => loadTasks('all', e.target.value));
});