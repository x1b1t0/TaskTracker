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
    const toggleDarkMode = document.getElementById('toggleDarkMode');
    const exportTasksBtn = document.getElementById('exportTasks');
    const importTasksBtn = document.getElementById('importTasksBtn');
    const fileInput = document.getElementById('importTasks');
    const switchToEnglish = document.getElementById('switchToEnglish');
    const switchToSpanish = document.getElementById('switchToSpanish');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let language = localStorage.getItem('language') || 'en';

    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function saveCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    function updateTaskCount() {
        const pendingTasks = taskList.querySelectorAll('li:not(.completed)').length;
        taskCount.textContent = language === 'en' ? `Pending tasks: ${pendingTasks}` : `Tareas pendientes: ${pendingTasks}`;
    }

    function addTaskToList(task) {
        const listItem = document.createElement('li');
        listItem.textContent = `${task.text} (${language === 'en' ? 'created at' : 'creado en'}: ${task.createdAt})`;

        if (task.completed) {
            listItem.classList.add('completed');
        }

        if (task.important) {
            listItem.classList.add('important');
        }

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('task-buttons');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = language === 'en' ? 'Complete' : 'Completar';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            task.completed = !task.completed;
            saveCurrentUser(currentUser);
            saveUsers();
            updateTaskCount();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = language === 'en' ? 'Delete' : 'Eliminar';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm(language === 'en' ? 'Are you sure you want to delete this task?' : '¿Estás seguro de que quieres eliminar esta tarea?')) {
                listItem.remove();
                currentUser.tasks = currentUser.tasks.filter(t => t !== task);
                saveCurrentUser(currentUser);
                saveUsers();
                updateTaskCount();
            }
        });

        const importantBtn = document.createElement('button');
        importantBtn.textContent = language === 'en' ? 'Important' : 'Importante';
        importantBtn.classList.add('important-btn');
        importantBtn.addEventListener('click', () => {
            listItem.classList.toggle('important');
            task.important = !task.important;
            saveCurrentUser(currentUser);
            saveUsers();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = language === 'en' ? 'Edit' : 'Editar';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => {
            const newTaskText = prompt(language === 'en' ? 'Edit task:' : 'Editar tarea:', task.text);
            if (newTaskText) {
                task.text = newTaskText;
                listItem.firstChild.textContent = `${newTaskText} (${language === 'en' ? 'created at' : 'creado en'}: ${task.createdAt})`;
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

    function switchLanguage(lang) {
        language = lang;
        localStorage.setItem('language', lang);
        document.getElementById('title').textContent = lang === 'en' ? 'TaskTracker' : 'Gestor de Tareas';
        document.getElementById('showLogin').textContent = lang === 'en' ? 'Login' : 'Iniciar Sesión';
        document.getElementById('showRegister').textContent = lang === 'en' ? 'Register' : 'Registrarse';
        document.getElementById('loginTitle').textContent = lang === 'en' ? 'Login' : 'Iniciar Sesión';
        document.getElementById('registerTitle').textContent = lang === 'en' ? 'Register' : 'Registrarse';
        document.getElementById('loginUsername').placeholder = lang === 'en' ? 'Username' : 'Nombre de Usuario';
        document.getElementById('loginPassword').placeholder = lang === 'en' ? 'Password' : 'Contraseña';
        document.getElementById('loginBtn').textContent = lang === 'en' ? 'Login' : 'Iniciar Sesión';
        document.getElementById('registerUsername').placeholder = lang === 'en' ? 'Username' : 'Nombre de Usuario';
        document.getElementById('registerPassword').placeholder = lang === 'en' ? 'Password' : 'Contraseña';
        document.getElementById('registerBtn').textContent = lang === 'en' ? 'Register' : 'Registrarse';
        document.getElementById('filterAll').textContent = lang === 'en' ? 'All' : 'Todas';
        document.getElementById('filterPending').textContent = lang === 'en' ? 'Pending' : 'Pendientes';
        document.getElementById('filterCompleted').textContent = lang === 'en' ? 'Completed' : 'Completadas';
        document.getElementById('filterImportant').textContent = lang === 'en' ? 'Important' : 'Importantes';
        document.getElementById('searchTasks').placeholder = lang === 'en' ? 'Search tasks' : 'Buscar tareas';
        document.getElementById('taskInput').placeholder = lang === 'en' ? 'Enter a new task' : 'Introduce una nueva tarea';
        document.getElementById('taskForm').querySelector('button').textContent = lang === 'en' ? 'Add Task' : 'Añadir Tarea';
        document.getElementById('logoutBtn').textContent = lang === 'en' ? 'Logout' : 'Cerrar Sesión';
        document.getElementById('exportTasks').textContent = lang === 'en' ? 'Export Tasks' : 'Exportar Tareas';
        document.getElementById('importTasksBtn').textContent = lang === 'en' ? 'Import Tasks' : 'Importar Tareas';
        document.getElementById('toggleDarkMode').textContent = lang === 'en' ? 'Toggle Dark Mode' : 'Cambiar a Modo Oscuro';
        updateTaskCount();
        loadTasks();
    }

    switchLanguage(language);

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
            alert(language === 'en' ? 'Invalid username or password' : 'Nombre de usuario o contraseña inválidos');
        }
    });

    registerBtn.addEventListener('click', () => {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        if (users.some(user => user.username === username)) {
            alert(language === 'en' ? 'Username already exists' : 'El nombre de usuario ya existe');
        } else {
            const newUser = { username, password, tasks: [] };
            users.push(newUser);
            saveUsers();
            alert(language === 'en' ? 'Registration successful, please login' : 'Registro exitoso, por favor inicia sesión');
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
        } else {
            alert(language === 'en' ? 'Task cannot be empty' : 'La tarea no puede estar vacía');
        }
    });

    filterAll.addEventListener('click', () => loadTasks('all'));
    filterPending.addEventListener('click', () => loadTasks('pending'));
    filterCompleted.addEventListener('click', () => loadTasks('completed'));
    filterImportant.addEventListener('click', () => loadTasks('important'));
    searchTasks.addEventListener('input', (e) => loadTasks('all', e.target.value));

    toggleDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });

    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
    }

    function exportTasks() {
        const tasksJSON = JSON.stringify(currentUser.tasks);
        const blob = new Blob([tasksJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importTasks(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const tasks = JSON.parse(e.target.result);
                currentUser.tasks = tasks;
                saveCurrentUser(currentUser);
                loadTasks();
            };
            reader.readAsText(file);
        }
    }

    exportTasksBtn.addEventListener('click', exportTasks);
    importTasksBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', importTasks);

    switchToEnglish.addEventListener('click', () => switchLanguage('en'));
    switchToSpanish.addEventListener('click', () => switchLanguage('es'));
});