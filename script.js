// =========== Global Variables ===========
let currentUser = null;
let tasks = [];
let timerInterval = null;
let timerMode = 'focus';
let timerTime = 25 * 60; // 25 minutes in seconds
let timerRunning = false;
let completedPomodoros = 0;
let currentTask = null;
let darkMode = localStorage.getItem('darkMode') === 'true';

// =========== DOM Elements ===========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Show splash screen
    showSplash();
    
    // Check if user is logged in
    checkAuth();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize components
    initThemeToggle();
}

// =========== Splash Screen ===========
function showSplash() {
    const splashScreen = document.querySelector('.splash-screen');
    
    // Hide splash screen after 3 seconds
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.style.visibility = 'hidden';
        
        // Show home page for non-authenticated users
        if (!currentUser) {
            showHomePage();
        }
    }, 3000);
}

// =========== Authentication ===========
function checkAuth() {
    // Check local storage for user data
    const storedUser = localStorage.getItem('focusFlowUser');
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showApp();
    }
}

function showAuth() {
    document.querySelector('.app-container').classList.add('hidden');
    document.querySelector('.auth-container').classList.remove('hidden');
    document.querySelector('.home-page').classList.add('hidden');
    
    // Add form toggle functionality
    const loginBtn = document.querySelector('#loginBtn');
    const signupBtn = document.querySelector('#signupBtn');
    const loginForm = document.querySelector('#loginForm');
    const signupForm = document.querySelector('#signupForm');
    
    loginBtn.addEventListener('click', () => {
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    });
    
    signupBtn.addEventListener('click', () => {
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    });
    
    // Add form submission handlers
    const loginFormEl = document.querySelector('#loginForm');
    const signupFormEl = document.querySelector('#signupForm');
    
    loginFormEl.addEventListener('submit', handleLogin);
    signupFormEl.addEventListener('submit', handleSignup);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;
    
    // In a real app, you would validate against a backend
    // For demo purposes, we'll just create a user object
    currentUser = {
        email: email,
        name: email.split('@')[0],
        joined: new Date().toISOString()
    };
    
    localStorage.setItem('focusFlowUser', JSON.stringify(currentUser));
    showApp();
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.querySelector('#signupName').value;
    const email = document.querySelector('#signupEmail').value;
    const password = document.querySelector('#signupPassword').value;
    
    // In a real app, you would send this to a backend
    // For demo purposes, we'll just create a user object
    currentUser = {
        email: email,
        name: name,
        joined: new Date().toISOString()
    };
    
    localStorage.setItem('focusFlowUser', JSON.stringify(currentUser));
    showApp();
}

function showApp() {
    document.querySelector('.app-container').classList.remove('hidden');
    document.querySelector('.auth-container').classList.add('hidden');
    document.querySelector('.home-page').classList.add('hidden');
    
    // Update user profile info
    updateUserProfile();
    
    // Load user data
    loadUserData();
    
    // Show timer by default (Pomodoro timer)
    showSection('timer');
}

function showHomePage() {
    document.querySelector('.app-container').classList.add('hidden');
    document.querySelector('.auth-container').classList.add('hidden');
    document.querySelector('.home-page').classList.remove('hidden');
    
    // Initialize homepage animations
    initHomePageAnimations();
}

function updateUserProfile() {
    const userAvatar = document.querySelector('.user-avatar');
    const profileName = document.querySelector('.dropdown-content .profile-name');
    
    if (userAvatar && currentUser) {
        // Set avatar placeholder (in a real app, you'd use user's photo)
        userAvatar.src = `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`;
        
        if (profileName) {
            profileName.textContent = currentUser.name;
        }
    }
}

function logout() {
    localStorage.removeItem('focusFlowUser');
    currentUser = null;
    showHomePage();
}

// =========== Event Listeners ===========
function setupEventListeners() {
    // Logo click to return to homepage
    const logoElements = document.querySelectorAll('.logo');
    logoElements.forEach(logo => {
        logo.addEventListener('click', () => {
            if (currentUser) {
                showApp();
            } else {
                showHomePage();
            }
        });
    });
    
    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            showSection(section);
            
            // Update active state
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Auth links on homepage
    const loginLink = document.querySelector('.login-link');
    const signupLink = document.querySelector('.signup-link');
    
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuth();
            // Activate login tab
            document.querySelector('#loginBtn').click();
        });
    }
    
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuth();
            // Activate signup tab
            document.querySelector('#signupBtn').click();
        });
    }
    
    // Navigation dropdown hover effects
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.querySelectorAll('.nav-item').forEach(navItem => {
                if (navItem !== item) {
                    navItem.style.opacity = '0.5';
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.style.opacity = '1';
            });
        });
    });
    
    // Sidebar hover effects
    const sidebarMenuItems = document.querySelectorAll('.sidebar-item');
    sidebarMenuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.querySelectorAll('.sidebar-item').forEach(sidebarItem => {
                if (sidebarItem !== item) {
                    sidebarItem.style.opacity = '0.5';
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            document.querySelectorAll('.sidebar-item').forEach(sidebarItem => {
                sidebarItem.style.opacity = '1';
            });
        });
    });
    
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Keyboard shortcut for escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentUser) {
            // If in timer mode, return to dashboard
            if (document.querySelector('.timer-container').classList.contains('active')) {
                showSection('dashboard');
            }
        }
    });
}

// =========== Section Navigation ===========
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show requested section
    const targetSection = document.querySelector(`.${sectionName}-container`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update sidebar active state
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Initialize section-specific functionality
    switch(sectionName) {
        case 'timer':
            initTimer();
            break;
        case 'tasks':
            renderTasks();
            break;
        case 'progress':
            renderProgress();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// =========== Theme Toggle ===========
function initThemeToggle() {
    const themeToggle = document.querySelector('#themeToggle');
    
    // Set initial state
    if (darkMode) {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    }
    
    // Add event listener
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            darkMode = !darkMode;
            localStorage.setItem('darkMode', darkMode);
        });
    }
}

// =========== Homepage Animations ===========
function initHomePageAnimations() {
    // Animate text elements
    const textElements = document.querySelectorAll('.animate-text');
    textElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Animate image elements
    const imageElements = document.querySelectorAll('.animate-image');
    imageElements.forEach((el, index) => {
        el.style.animationDelay = `${0.3 + index * 0.2}s`;
    });
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.features-section, .about-section, .resources-section, .contact-section')
        .forEach(section => {
            observer.observe(section);
        });
}

// =========== Timer Functionality ===========
function initTimer() {
    // Set default mode
    setTimerMode('focus');
    
    // Add event listeners for timer controls
    const startBtn = document.querySelector('#startTimer');
    const pauseBtn = document.querySelector('#pauseTimer');
    const resetBtn = document.querySelector('#resetTimer');
    
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
    
    // Add event listeners for timer mode buttons
    const focusModeBtn = document.querySelector('#focusMode');
    const breakModeBtn = document.querySelector('#breakMode');
    const longBreakModeBtn = document.querySelector('#longBreakMode');
    
    if (focusModeBtn) focusModeBtn.addEventListener('click', () => setTimerMode('focus'));
    if (breakModeBtn) breakModeBtn.addEventListener('click', () => setTimerMode('break'));
    if (longBreakModeBtn) longBreakModeBtn.addEventListener('click', () => setTimerMode('longBreak'));
    
    // Update task dropdown
    updateTaskDropdown();
    
    // Setup task selection
    const taskSelect = document.querySelector('#taskSelect');
    if (taskSelect) {
        taskSelect.addEventListener('change', () => {
            currentTask = taskSelect.value;
        });
    }
    
    // Update timer display
    updateTimerDisplay();
}

function setTimerMode(mode) {
    timerMode = mode;
    
    // Update active state for mode buttons
    document.querySelectorAll('.timer-mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`#${mode}Mode`).classList.add('active');
    
    // Set time based on mode
    switch(mode) {
        case 'focus':
            timerTime = 25 * 60; // 25 minutes
            break;
        case 'break':
            timerTime = 5 * 60; // 5 minutes
            // Suggest a break activity using BoredAPI
            suggestBreakActivity();
            break;
        case 'longBreak':
            timerTime = 15 * 60; // 15 minutes
            // Suggest a break activity using BoredAPI
            suggestBreakActivity();
            break;
    }
    
    // Reset timer
    resetTimer();
}

function startTimer() {
    if (timerRunning) return;
    
    timerRunning = true;
    
    // Update UI
    document.querySelector('#startTimer').classList.add('hidden');
    document.querySelector('#pauseTimer').classList.remove('hidden');
    
    // Start countdown
    timerInterval = setInterval(() => {
        timerTime--;
        
        updateTimerDisplay();
        
        if (timerTime <= 0) {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (!timerRunning) return;
    
    timerRunning = false;
    clearInterval(timerInterval);
    
    // Update UI
    document.querySelector('#startTimer').classList.remove('hidden');
    document.querySelector('#pauseTimer').classList.add('hidden');
}

function resetTimer() {
    // Stop timer if running
    if (timerRunning) {
        pauseTimer();
    }
    
    // Reset time based on mode
    switch(timerMode) {
        case 'focus':
            timerTime = 25 * 60; // 25 minutes
            break;
        case 'break':
            timerTime = 5 * 60; // 5 minutes
            break;
        case 'longBreak':
            timerTime = 15 * 60; // 15 minutes
            break;
    }
    
    updateTimerDisplay();
}

function completeTimer() {
    // Stop timer
    clearInterval(timerInterval);
    timerRunning = false;
    
    // Play sound notification
    playNotificationSound();
    
    // Handle completion based on mode
    if (timerMode === 'focus') {
        completedPomodoros++;
        saveCompletedPomodoro();
        
        // Mark current task as completed if selected
        if (currentTask) {
            completeTask(currentTask);
        }
        
        // Show notification
        showNotification('Focus session completed!', 'Take a break before your next session.');
        
        // Switch to break mode
        if (completedPomodoros % 4 === 0) {
            setTimerMode('longBreak');
        } else {
            setTimerMode('break');
        }
    } else {
        // Show notification
        showNotification('Break completed!', 'Ready for your next focus session?');
        
        // Switch to focus mode
        setTimerMode('focus');
    }
    
    // Update UI
    document.querySelector('#startTimer').classList.remove('hidden');
    document.querySelector('#pauseTimer').classList.add('hidden');
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerTime / 60);
    const seconds = timerTime % 60;
    
    const timerDisplay = document.querySelector('.timer-time');
    if (timerDisplay) {
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function playNotificationSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/download/mixkit-software-interface-alert-notification-256.wav');
    audio.play();
}

function showNotification(title, body) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body });
            }
        });
    }
}

function suggestBreakActivity() {
    const activityContainer = document.querySelector('#breakActivitySuggestion');
    if (!activityContainer) return;
    
    activityContainer.textContent = 'Loading suggestion...';
    
    // Use BoredAPI to get activity suggestion
    fetch('https://www.boredapi.com/api/activity?type=relaxation')
        .then(response => response.json())
        .then(data => {
            activityContainer.textContent = `Break suggestion: ${data.activity}`;
        })
        .catch(error => {
            activityContainer.textContent = 'Take a deep breath and stretch.';
            console.error('Error fetching break activity:', error);
        });
}

// =========== Task Management ===========
function loadUserData() {
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem('focusFlowTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        // Default tasks for demo
        tasks = [
            {
                id: 1,
                title: 'Complete project proposal',
                completed: false,
                priority: 'high',
                dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
                pomodoros: 0
            },
            {
                id: 2,
                title: 'Read chapter 5',
                completed: false,
                priority: 'medium',
                dueDate: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
                pomodoros: 0
            },
            {
                id: 3,
                title: 'Email client',
                completed: false,
                priority: 'low',
                dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
                pomodoros: 0
            }
        ];
        saveTasks();
    }
    
    // Load completed pomodoros
    const storedPomodoros = localStorage.getItem('completedPomodoros');
    if (storedPomodoros) {
        completedPomodoros = parseInt(storedPomodoros);
    }
    
    // Update dashboard stats
    updateDashboardStats();
}

function saveTasks() {
    localStorage.setItem('focusFlowTasks', JSON.stringify(tasks));
}

function saveCompletedPomodoro() {
    localStorage.setItem('completedPomodoros', completedPomodoros);
    
    // Also track with CountAPI for demonstration
    fetch(`https://api.countapi.xyz/hit/focusflow/pomodoros`)
        .catch(error => console.error('Error updating CountAPI:', error));
}

function renderTasks() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    // Clear existing tasks
    taskList.innerHTML = '';
    
    // Filter tasks based on active filter
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    let filteredTasks = [...tasks];
    
    switch(activeFilter) {
        case 'active':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        case 'high':
            filteredTasks = tasks.filter(task => task.priority === 'high');
            break;
        case 'today':
            const today = new Date().toISOString().split('T')[0];
            filteredTasks = tasks.filter(task => {
                const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
                return taskDate === today;
            });
            break;
    }
    
    // Render filtered tasks
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item glass-card';
        
        const dueDate = new Date(task.dueDate).toLocaleDateString();
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-details">
                    <span class="task-due">Due: ${dueDate}</span>
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    <span class="task-pomodoros">Pomodoros: ${task.pomodoros}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn edit" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                <button class="task-action-btn delete" data-id="${task.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = this.getAttribute('data-id');
            toggleTaskCompletion(taskId);
        });
    });
    
    document.querySelectorAll('.task-action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            openEditTaskModal(taskId);
        });
    });
    
    document.querySelectorAll('.task-action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            deleteTask(taskId);
        });
    });
    
    // Add task filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTasks();
        });
    });
    
    // Add new task button functionality
    const addTaskBtn = document.querySelector('#addTaskBtn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', openAddTaskModal);
    }
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id.toString() === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateDashboardStats();
        updateTaskDropdown();
    }
}

function completeTask(taskId) {
    const task = tasks.find(t => t.id.toString() === taskId);
    if (task) {
        task.completed = true;
        task.pomodoros++;
        saveTasks();
        renderTasks();
        updateDashboardStats();
        updateTaskDropdown();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id.toString() !== taskId);
    saveTasks();
    renderTasks();
    updateDashboardStats();
    updateTaskDropdown();
}

function openAddTaskModal() {
    // Create a modal for adding a new task
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content glass-card">
            <h3>Add New Task</h3>
            <form id="addTaskForm">
                <div class="form-group">
                    <label for="taskTitle">Task Title</label>
                    <input type="text" id="taskTitle" required>
                </div>
                <div class="form-group">
                    <label for="taskPriority">Priority</label>
                    <select id="taskPriority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="taskDueDate">Due Date</label>
                    <input type="date" id="taskDueDate" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" id="cancelAddTask">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Task</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.querySelector('#taskDueDate').valueAsDate = tomorrow;
    
    // Add event listeners
    document.querySelector('#cancelAddTask').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.querySelector('#addTaskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTask = {
            id: Date.now(),
            title: document.querySelector('#taskTitle').value,
            priority: document.querySelector('#taskPriority').value,
            dueDate: document.querySelector('#taskDueDate').value,
            completed: false,
            pomodoros: 0
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        updateDashboardStats();
        updateTaskDropdown();
        
        document.body.removeChild(modal);
    });
}

function openEditTaskModal(taskId) {
    const task = tasks.find(t => t.id.toString() === taskId);
    if (!task) return;
    
    // Create a modal for editing the task
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content glass-card">
            <h3>Edit Task</h3>
            <form id="editTaskForm">
                <div class="form-group">
                    <label for="editTaskTitle">Task Title</label>
                    <input type="text" id="editTaskTitle" value="${task.title}" required>
                </div>
                <div class="form-group">
                    <label for="editTaskPriority">Priority</label>
                    <select id="editTaskPriority">
                        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editTaskDueDate">Due Date</label>
                    <input type="date" id="editTaskDueDate" value="${new Date(task.dueDate).toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group checkbox">
                    <input type="checkbox" id="editTaskCompleted" ${task.completed ? 'checked' : ''}>
                    <label for="editTaskCompleted">Completed</label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" id="cancelEditTask">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.querySelector('#cancelEditTask').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.querySelector('#editTaskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Update task
        task.title = document.querySelector('#editTaskTitle').value;
        task.priority = document.querySelector('#editTaskPriority').value;
        task.dueDate = document.querySelector('#editTaskDueDate').value;
        task.completed = document.querySelector('#editTaskCompleted').checked;
        
        saveTasks();
        renderTasks();
        updateDashboardStats();
        updateTaskDropdown();
        
        document.body.removeChild(modal);
    });
}

function updateTaskDropdown() {
    const taskSelect = document.querySelector('#taskSelect');
    if (!taskSelect) return;
    
    // Clear existing options
    taskSelect.innerHTML = '<option value="">Select a task (optional)</option>';
    
    // Add active tasks
    const activeTasks = tasks.filter(task => !task.completed);
    
    activeTasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.title;
        taskSelect.appendChild(option);
    });
}

// =========== Dashboard ===========
function updateDashboardStats() {
    // Update task stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update DOM elements
    const taskProgress = document.querySelector('.task-progress');
    const taskProgressText = document.querySelector('.task-progress-text');
    const totalTasksEl = document.querySelector('.total-tasks');
    const completedTasksEl = document.querySelector('.completed-tasks');
    const activeTasksEl = document.querySelector('.active-tasks');
    const completionRateEl = document.querySelector('.completion-rate');
    const completedPomodorosEl = document.querySelector('.completed-pomodoros');
    const pomodoroGoalEl = document.querySelector('.pomodoro-goal');
}
    if (taskProgress) taskProgress.style.width = `${completionRate}%`;
    if (taskProgressText) taskProgressText.textContent = `${completionRate}%`;
    if (totalTasksEl) totalTasksEl.textContent = totalTasks;
    if (completedTasksEl) completedTasksEl.textContent = completedTasks;
    if (activeTasksEl) activeTasksEl.textContent = activeTasks;
    if (completionRateEl) completionRateEl.textContent = `${completionRate}%`;
    if (completedPomodorosEl) completedPomodorosEl.textContent = completedPomodoros;
    if (pomodoroGoalEl) pomodoroGoalEl.textContent = 4; // Example goal

    // Update progress chart (if using a chart library)
    if (typeof Chart !== 'undefined') {
        const ctx = document.getElementById('progressChart').getContext('2d');
        const progressChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Active'],
                datasets: [{
                    data: [completedTasks, activeTasks],
                    backgroundColor: ['#4CAF50', '#FF9800'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        });
    }

function loadSettings() {
    const settingsForm = document.querySelector('#settingsForm');
    if (!settingsForm) return;
    
    // Load settings from localStorage
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting) {
        darkMode = darkModeSetting === 'true';
        document.body.classList.toggle('dark-mode', darkMode);
        document.querySelector('#themeToggle').checked = darkMode;
    }
    
    // Add event listeners for settings changes
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Save settings
        const newPomodoroGoal = document.querySelector('#pomodoroGoal').value;
        localStorage.setItem('pomodoroGoal', newPomodoroGoal);
        
        // Show success message
        showNotification('Settings saved!', 'Your settings have been updated.');
    });
}
function init() {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('focusFlowUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showApp();
    } else {
        showHomePage();
    }
// ============ Timer Functions =============
function startTimer() {
    if (timerRunning) return;
    
    // Don't start timer if no task is selected
    if (!currentTask) {
      showNotification('No Task Selected', 'Please select a task before starting the timer.');
      return;
    }
    
    timerRunning = true;
    let timeLeft = timerTime;
    
    // Update UI to show timer is running
    document.querySelector('#timerDisplay').classList.add('active');
    document.querySelector('#startTimerBtn').textContent = 'Pause';
    
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay(timeLeft);
      
      if (timeLeft <= 0) {
        completePomodoro();
      }
    }, 1000);
  }
  
  function pauseTimer() {
    if (!timerRunning) return;
    
    timerRunning = false;
    clearInterval(timerInterval);
    
    // Update UI to show timer is paused
    document.querySelector('#timerDisplay').classList.remove('active');
    document.querySelector('#startTimerBtn').textContent = 'Start';
  }
  
  function resetTimer() {
    pauseTimer();
    updateTimerDisplay(timerTime);
  }
  
  function completePomodoro() {
    pauseTimer();
    completedPomodoros++;
    
    // Update UI
    document.querySelector('#pomodoroCount').textContent = completedPomodoros;
    
    // Save progress to current task
    if (currentTask) {
      currentTask.pomodoros = currentTask.pomodoros ? currentTask.pomodoros + 1 : 1;
      saveTasks();
    }
    
    // Play sound notification
    const audio = new Audio('assets/sounds/complete.mp3');
    audio.play();
    
    // Show notification based on timer mode
    if (timerMode === 'focus') {
      showNotification('Focus Session Complete', 'Time for a break!');
      switchToBreakMode();
    } else {
      showNotification('Break Complete', 'Ready to focus again?');
      switchToFocusMode();
    }
  }
  
  function switchToBreakMode() {
    timerMode = 'break';
    timerTime = 5 * 60; // 5 minutes in seconds
    updateTimerDisplay(timerTime);
    
    // Update UI
    document.querySelector('#timerContainer').classList.remove('focus-mode');
    document.querySelector('#timerContainer').classList.add('break-mode');
    document.querySelector('#timerModeLabel').textContent = 'Break Time';
  }
  
  function switchToFocusMode() {
    timerMode = 'focus';
    timerTime = 25 * 60; // 25 minutes in seconds
    updateTimerDisplay(timerTime);
    
    // Update UI
    document.querySelector('#timerContainer').classList.remove('break-mode');
    document.querySelector('#timerContainer').classList.add('focus-mode');
    document.querySelector('#timerModeLabel').textContent = 'Focus Time';
  }
  
  function updateTimerDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.querySelector('#timerDisplay').textContent = formattedTime;
  }
  
  // ============ Task Management Functions =============
  function showTaskForm() {
    document.querySelector('#taskFormModal').classList.remove('hidden');
  }
  
  function hideTaskForm() {
    document.querySelector('#taskFormModal').classList.add('hidden');
    document.querySelector('#taskForm').reset();
  }
  
  function addTask(e) {
    if (e) e.preventDefault();
    
    const taskInput = document.querySelector('#taskInput');
    const prioritySelect = document.querySelector('#prioritySelect');
    
    if (!taskInput.value.trim()) {
      showNotification('Invalid Input', 'Task description cannot be empty');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      description: taskInput.value.trim(),
      priority: prioritySelect.value,
      completed: false,
      pomodoros: 0,
      created: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    hideTaskForm();
  }
  
  function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    
    // If the deleted task was the current task, reset current task
    if (currentTask && currentTask.id === taskId) {
      currentTask = null;
    }
    
    saveTasks();
    renderTasks();
  }
  
  function toggleTaskCompletion(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }
  
  function selectTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      currentTask = task;
      
      // Update UI to show selected task
      document.querySelectorAll('.task-item').forEach(item => {
        item.classList.remove('selected');
      });
      
      document.querySelector(`#task-${taskId}`).classList.add('selected');
      document.querySelector('#currentTaskDisplay').textContent = task.description;
    }
  }
  
  function saveTasks() {
    if (!currentUser) return;
    
    // Save tasks to user data
    currentUser.tasks = tasks;
    localStorage.setItem('focusFlowUser', JSON.stringify(currentUser));
  }
  
  function loadTasks() {
    if (currentUser && currentUser.tasks) {
      tasks = currentUser.tasks;
    } else {
      tasks = [];
    }
    
    renderTasks();
  }
  
  function renderTasks() {
    const taskList = document.querySelector('#taskList');
    if (!taskList) return;
    
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-list-message';
      emptyMessage.textContent = 'No tasks yet. Click "Add Task" to get started!';
      taskList.appendChild(emptyMessage);
      return;
    }
    
    // Sort tasks: uncompleted first, then by priority
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    sortedTasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''} ${currentTask && currentTask.id === task.id ? 'selected' : ''}`;
      taskItem.id = `task-${task.id}`;
      
      taskItem.innerHTML = `
        <div class="task-checkbox">
          <input type="checkbox" ${task.completed ? 'checked' : ''} id="checkbox-${task.id}">
          <label for="checkbox-${task.id}"></label>
        </div>
        <div class="task-content" data-task-id="${task.id}">
          <div class="task-description">${task.description}</div>
          <div class="task-meta">
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <span class="task-pomodoros">${task.pomodoros || 0} pomodoros</span>
          </div>
        </div>
        <button class="delete-task-btn" data-task-id="${task.id}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      
      taskList.appendChild(taskItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.task-checkbox input').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const taskId = e.target.id.replace('checkbox-', '');
        toggleTaskCompletion(taskId);
      });
    });
    
    document.querySelectorAll('.task-content').forEach(content => {
      content.addEventListener('click', (e) => {
        const taskId = e.currentTarget.dataset.taskId;
        selectTask(taskId);
      });
    });
    
    document.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = e.currentTarget.dataset.taskId;
        deleteTask(taskId);
      });
    });
  }
  
  // ============ Notification Functions =============
  function showNotification(title, message) {
    const notification = document.querySelector('#notification');
    const notificationTitle = document.querySelector('#notificationTitle');
    const notificationMessage = document.querySelector('#notificationMessage');
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    notification.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 3000);
  }
  
  // ============ UI Helper Functions =============
  function setupEventListeners() {
    // Timer controls
    const startTimerBtn = document.querySelector('#startTimerBtn');
    if (startTimerBtn) {
      startTimerBtn.addEventListener('click', () => {
        if (timerRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
      });
    }
    
    const resetTimerBtn = document.querySelector('#resetTimerBtn');
    if (resetTimerBtn) {
      resetTimerBtn.addEventListener('click', resetTimer);
    }
    
    // Task form
    const addTaskBtn = document.querySelector('#addTaskBtn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', showTaskForm);
    }
    
    const taskForm = document.querySelector('#taskForm');
    if (taskForm) {
      taskForm.addEventListener('submit', addTask);
    }
    
    const cancelTaskBtn = document.querySelector('#cancelTaskBtn');
    if (cancelTaskBtn) {
      cancelTaskBtn.addEventListener('click', hideTaskForm);
    }
    
    // Close notification
    const closeNotificationBtn = document.querySelector('#closeNotification');
    if (closeNotificationBtn) {
      closeNotificationBtn.addEventListener('click', () => {
        document.querySelector('#notification').classList.add('hidden');
      });
    }
    
    // Log out button
    const logoutBtn = document.querySelector('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
    
    // Settings button
    const settingsBtn = document.querySelector('#settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', showSettings);
    }
    
    // Theme toggle
    initThemeToggle();
  }
  
  function initThemeToggle() {
    const themeToggle = document.querySelector('#themeToggle');
    if (!themeToggle) return;
    
    themeToggle.checked = darkMode;
    
    themeToggle.addEventListener('change', () => {
      darkMode = themeToggle.checked;
      document.body.classList.toggle('dark-mode', darkMode);
      localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    });
  }
  
  function showHomePage() {
    document.querySelector('.app-container').classList.add('hidden');
    document.querySelector('.auth-container').classList.add('hidden');
    document.querySelector('.home-page').classList.remove('hidden');
  }
  
  function showApp() {
    document.querySelector('.app-container').classList.remove('hidden');
    document.querySelector('.auth-container').classList.add('hidden');
    document.querySelector('.home-page').classList.add('hidden');
    
    loadTasks();
    resetTimer();
  }
  
  function showSettings() {
    document.querySelector('#settingsModal').classList.remove('hidden');
    
    // Load current settings into form
    document.querySelector('#pomodoroGoal').value = currentUser.pomodoroGoal || 8;
  }
  
  function hideSettings() {
    document.querySelector('#settingsModal').classList.add('hidden');
  }
  
  // ============ Authentication Functions =============
  function login(e) {
    if (e) e.preventDefault();
    
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;
    
    if (!email || !password) {
      showNotification('Login Error', 'Please enter both email and password');
      return;
    }
    
    // Demo login - in real app would check against server
    currentUser = {
      email: email,
      name: email.split('@')[0],
      tasks: [],
      pomodoroGoal: 8
    };
    
    localStorage.setItem('focusFlowUser', JSON.stringify(currentUser));
    showApp();
  }
  
  function signup(e) {
    if (e) e.preventDefault();
    
    const email = document.querySelector('#signupEmail').value;
    const password = document.querySelector('#signupPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    
    if (!email || !password || !confirmPassword) {
      showNotification('Signup Error', 'Please fill all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification('Signup Error', 'Passwords do not match');
      return;
    }
    
    // Demo signup - in real app would register with server
    currentUser = {
      email: email,
      name: email.split('@')[0],
      tasks: [],
      pomodoroGoal: 8
    };
    
    localStorage.setItem('focusFlowUser', JSON.stringify(currentUser));
    showApp();
  }
  
  function logout() {
    currentUser = null;
    localStorage.removeItem('focusFlowUser');
    showHomePage();
  }
  
// Fix the init function syntax
function init() {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('focusFlowUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      showApp();
    } else {
      showHomePage();
    }
  }
  
  // Setup event listeners for the entire application
  function setupEventListeners() {
    // Auth form event listeners
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        login();
      });
    }
    
    const signupForm = document.querySelector('#signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        signup();
      });
    }
    
    // Switch between login and signup forms
    const loginBtn = document.querySelector('#loginBtn');
    const signupBtn = document.querySelector('#signupBtn');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        document.querySelector('#loginForm').style.display = 'block';
        document.querySelector('#signupForm').style.display = 'none';
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
      });
    }
    
    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        document.querySelector('#loginForm').style.display = 'none';
        document.querySelector('#signupForm').style.display = 'block';
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
      });
    }
    
    // Timer control buttons
    const startTimerBtn = document.querySelector('#startTimerBtn');
    if (startTimerBtn) {
      startTimerBtn.addEventListener('click', () => {
        if (timerRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
      });
    }
    
    const resetTimerBtn = document.querySelector('#resetTimerBtn');
    if (resetTimerBtn) {
      resetTimerBtn.addEventListener('click', resetTimer);
    }
    
    // Task management buttons
    const addTaskBtn = document.querySelector('#addTaskBtn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', showTaskForm);
    }
    
    const taskForm = document.querySelector('#taskForm');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
        hideTaskForm();
      });
    }
    
    const cancelTaskBtn = document.querySelector('#cancelTaskBtn');
    if (cancelTaskBtn) {
      cancelTaskBtn.addEventListener('click', hideTaskForm);
    }
    
    // Attach event handlers to task items (will be done in renderTasks)
    
    // Settings and profile
    const settingsBtn = document.querySelector('#settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', showSettings);
    }
    
    const saveSettingsBtn = document.querySelector('#saveSettingsBtn');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    const cancelSettingsBtn = document.querySelector('#cancelSettingsBtn');
    if (cancelSettingsBtn) {
      cancelSettingsBtn.addEventListener('click', hideSettings);
    }
    
    const logoutBtn = document.querySelector('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
    
    // Theme toggle
    const themeToggle = document.querySelector('#themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('change', toggleDarkMode);
    }
    
    // Notification close button
    const closeNotification = document.querySelector('#closeNotification');
    if (closeNotification) {
      closeNotification.addEventListener('click', () => {
        document.querySelector('#notification').classList.add('hidden');
      });
    }
  }
  
  // ============ UI Management Functions =============
  
  function showTaskForm() {
    const modal = document.querySelector('#taskModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
    
    // Clear form fields
    const taskForm = document.querySelector('#taskForm');
    if (taskForm) {
      taskForm.reset();
    }
    
    // Focus on task description field
    document.querySelector('#taskDescription').focus();
  }
  
  function hideTaskForm() {
    const modal = document.querySelector('#taskModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  
  function showSettings() {
    const modal = document.querySelector('#settingsModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
    
    // Populate settings form with current values
    if (currentUser) {
      document.querySelector('#userEmail').textContent = currentUser.email;
      document.querySelector('#displayName').value = currentUser.name || '';
      document.querySelector('#pomodoroGoal').value = currentUser.pomodoroGoal || 8;
      document.querySelector('#themeToggle').checked = darkMode;
    }
  }
  
  function hideSettings() {
    const modal = document.querySelector('#settingsModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  
  function saveSettings() {
    if (!currentUser) return;
    
    // Update user settings
    currentUser.name = document.querySelector('#displayName').value;
    currentUser.pomodoroGoal = parseInt(document.querySelector('#pomodoroGoal').value) || 8;
    
    // Save to localStorage
    localStorage.setItem('focusFlowUser', JSON.stringify(currentUser));
    
    // Update UI
    document.querySelector('#userDisplayName').textContent = currentUser.name;
    
    // Show success notification
    showNotification('Settings Saved', 'Your settings have been updated successfully.');
    
    // Hide settings modal
    hideSettings();
  }
  
  function toggleDarkMode() {
    darkMode = document.querySelector('#themeToggle').checked;
    
    // Toggle dark mode class on body
    document.body.classList.toggle('dark-mode', darkMode);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }
  
  // ============ Task Management Functions =============
  
  function addTask() {
    const description = document.querySelector('#taskDescription').value.trim();
    const priority = document.querySelector('#taskPriority').value;
    
    if (!description) {
      showNotification('Error', 'Task description cannot be empty');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      description: description,
      priority: priority || 'medium',
      completed: false,
      pomodoros: 0,
      created: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
  }
  
  function saveTasks() {
    if (!currentUser) return;
    
    currentUser.tasks = tasks;
    localStorage.setItem('focusFlowUser', JSON.stringify(currentUser));
  }
  
  function deleteTask(taskId) {
    // Find task index
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return;
    
    // Remove task from array
    tasks.splice(taskIndex, 1);
    
    // Clear current task if it was deleted
    if (currentTask && currentTask.id === taskId) {
      currentTask = null;
      document.querySelector('#currentTaskDisplay').textContent = 'No task selected';
    }
    
    // Save changes and update UI
    saveTasks();
    renderTasks();
  }
  
  function toggleTaskCompletion(taskId) {
    const task = tasks.find(task => task.id === taskId);
    
    if (!task) return;
    
    task.completed = !task.completed;
    
    // If completed task was current task, clear current task
    if (task.completed && currentTask && currentTask.id === taskId) {
      currentTask = null;
      document.querySelector('#currentTaskDisplay').textContent = 'No task selected';
    }
    
    saveTasks();
    renderTasks();
  }
  
  function selectTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    
    if (!task) return;
    
    // Set as current task
    currentTask = task;
    
    // Update UI
    document.querySelector('#currentTaskDisplay').textContent = task.description;
    
    // Highlight selected task
    document.querySelectorAll('.task-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    document.querySelector(`[data-task-id="${taskId}"]`).classList.add('selected');
  }
  
  function renderTasks() {
    const taskList = document.querySelector('#taskList');
    
    if (!taskList) return;
    
    // Clear current task list
    taskList.innerHTML = '';
    
    // Show message if no tasks
    if (tasks.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-task-list';
      emptyMessage.textContent = 'No tasks yet. Add a task to get started!';
      taskList.appendChild(emptyMessage);
      return;
    }
    
    // Sort tasks: uncompleted first, then by priority
    const sortedTasks = [...tasks].sort((a, b) => {
      // First sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Create task elements
    sortedTasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
      taskElement.dataset.taskId = task.id;
      
      if (currentTask && currentTask.id === task.id) {
        taskElement.classList.add('selected');
      }
      
      taskElement.innerHTML = `
        <div class="task-checkbox">
          <input type="checkbox" id="checkbox-${task.id}" ${task.completed ? 'checked' : ''}>
          <label for="checkbox-${task.id}"></label>
        </div>
        <div class="task-content">
          <div class="task-description">${task.description}</div>
          <div class="task-meta">
            <span class="priority-badge ${task.priority}">${task.priority}</span>
            <span class="pomodoro-count">${task.pomodoros || 0} pomodoros</span>
          </div>
        </div>
        <button class="delete-task-btn">×</button>
      `;
      
      taskList.appendChild(taskElement);
      
      // Add event listeners for this task item
      const checkbox = taskElement.querySelector(`#checkbox-${task.id}`);
      checkbox.addEventListener('change', () => {
        toggleTaskCompletion(task.id);
      });
      
      const taskContent = taskElement.querySelector('.task-content');
      taskContent.addEventListener('click', () => {
        selectTask(task.id);
      });
      
      const deleteBtn = taskElement.querySelector('.delete-task-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
      });
    });
    
    // Update task count display
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    const taskCounter = document.querySelector('#taskCounter');
    if (taskCounter) {
      taskCounter.textContent = `${completedTasks}/${totalTasks} completed`;
    }
  }
  
  // ============ Timer Functions =============
  
  function startTimer() {
    if (timerRunning) return;
    
    // Don't start if no task selected in focus mode
    if (timerMode === 'focus' && !currentTask) {
      showNotification('No Task Selected', 'Please select a task before starting a focus session.');
      return;
    }
    
    timerRunning = true;
    
    // Update UI
    const startBtn = document.querySelector('#startTimerBtn');
    if (startBtn) {
      startBtn.textContent = 'Pause';
      startBtn.classList.add('active');
    }
    
    const timerDisplay = document.querySelector('#timerDisplay');
    if (timerDisplay) {
      timerDisplay.classList.add('running');
    }
    
    // Start the interval
    let remainingTime = timerTime;
    
    timerInterval = setInterval(() => {
      remainingTime--;
      updateTimerDisplay(remainingTime);
      
      if (remainingTime <= 0) {
        completePomodoro();
      }
    }, 1000);
  }
  
  function pauseTimer() {
    if (!timerRunning) return;
    
    timerRunning = false;
    clearInterval(timerInterval);
    
    // Update UI
    const startBtn = document.querySelector('#startTimerBtn');
    if (startBtn) {
      startBtn.textContent = 'Start';
      startBtn.classList.remove('active');
    }
    
    const timerDisplay = document.querySelector('#timerDisplay');
    if (timerDisplay) {
      timerDisplay.classList.remove('running');
    }
  }
  
  function resetTimer() {
    pauseTimer();
    updateTimerDisplay(timerTime);
  }
  
  function updateTimerDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerDisplay = document.querySelector('#timerDisplay');
    if (timerDisplay) {
      timerDisplay.textContent = formattedTime;
    }
  }
  
  function completePomodoro() {
    pauseTimer();
    
    // Play completion sound
    playSound('complete');
    
    if (timerMode === 'focus') {
      // Increment pomodoro count for current task
      if (currentTask) {
        currentTask.pomodoros = (currentTask.pomodoros || 0) + 1;
        completedPomodoros++;
        
        // Update pomodoro counter display
        const pomodoroCounter = document.querySelector('#pomodoroCounter');
        if (pomodoroCounter) {
          pomodoroCounter.textContent = completedPomodoros;
        }
        
        saveTasks();
        renderTasks();
        
        showNotification('Focus Session Complete', `Great job! You've completed a pomodoro for "${currentTask.description}"`);
      } else {
        showNotification('Focus Session Complete', 'Time for a break!');
      }
      
      // Switch to break mode
      switchToBreakMode();
    } else {
      // Break completed, switch back to focus mode
      showNotification('Break Complete', 'Ready to focus again?');
      switchToFocusMode();
    }
  }
  
  function switchToFocusMode() {
    timerMode = 'focus';
    timerTime = 25 * 60; // 25 minutes
    
    // Update UI
    const timerContainer = document.querySelector('#timerContainer');
    if (timerContainer) {
      timerContainer.classList.remove('break-mode');
      timerContainer.classList.add('focus-mode');
    }
    
    const modeLabel = document.querySelector('#timerModeLabel');
    if (modeLabel) {
      modeLabel.textContent = 'Focus Time';
    }
    
    resetTimer();
  }
  
  function switchToBreakMode() {
    timerMode = 'break';
    timerTime = 5 * 60; // 5 minutes
    
    // Update UI
    const timerContainer = document.querySelector('#timerContainer');
    if (timerContainer) {
      timerContainer.classList.remove('focus-mode');
      timerContainer.classList.add('break-mode');
    }
    
    const modeLabel = document.querySelector('#timerModeLabel');
    if (modeLabel) {
      modeLabel.textContent = 'Break Time';
    }
    
    resetTimer();
  }
  
  // ============ Helper Functions =============
  
  function playSound(soundName) {
    // Simple sound player
    const sounds = {
      complete: 'assets/sounds/complete.mp3',
      click: 'assets/sounds/click.mp3',
      notification: 'assets/sounds/notification.mp3'
    };
    
    if (!sounds[soundName]) return;
    
    const audio = new Audio(sounds[soundName]);
    audio.play().catch(err => {
      console.error('Error playing sound:', err);
    });
  }
  
  function showNotification(title, message) {
    const notification = document.querySelector('#notification');
    const notificationTitle = document.querySelector('#notificationTitle');
    const notificationMessage = document.querySelector('#notificationMessage');
    
    if (!notification || !notificationTitle || !notificationMessage) return;
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    notification.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 3000);
  }
  
  // Initialize application on page load
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
  });
}