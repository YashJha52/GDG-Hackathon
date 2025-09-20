document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const loginOverlay = document.getElementById('login-overlay');
    const loginButton = document.getElementById('login-button');
    const nameInput = document.getElementById('name-input');
    const gradeInput = document.getElementById('grade-input');
    const mainApp = document.getElementById('main-app');
    const welcomeHeader = document.getElementById('welcome-header');
    const logoutButton = document.getElementById('logout-button');
    const taskContainer = document.getElementById('task-container');
    const loadingDiv = document.getElementById('loading');
    const resultsContainer = document.getElementById('results-container');
    const resultsContent = document.getElementById('results-content');

    // --- INITIALIZATION ---
    function init() {
        const user = JSON.parse(localStorage.getItem('careerQuestUser'));
        if (user && user.name && user.grade) {
            showMainView(user);
        } else {
            showLoginView();
        }
    }

    // --- VIEW MANAGEMENT ---
    function showLoginView() {
        loginOverlay.classList.remove('hidden');
        mainApp.classList.add('hidden');
    }

    function showMainView(user) {
        welcomeHeader.textContent = `Welcome, ${user.name}!`;
        loginOverlay.classList.add('hidden');
        mainApp.classList.remove('hidden');
        loadTasks(user.grade);
    }
    
    // --- DYNAMIC TASK LOADING ---
    async function loadTasks(grade) {
        showLoading(true, "Loading your quests...");
        try {
            const response = await fetch(`/get-tasks?grade=${grade}`);
            if (!response.ok) throw new Error('Failed to load tasks.');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error("Error loading tasks:", error);
            taskContainer.innerHTML = `<p class="error">Could not load tasks. Please try again.</p>`;
        } finally {
            showLoading(false);
        }
    }

    function renderTasks(tasks) {
        taskContainer.innerHTML = ''; // Clear previous tasks
        for (const taskId in tasks) {
            const task = tasks[taskId];
            let taskHTML = `
                <div class="task-card" id="${taskId}">
                    <h2>${task.title}</h2>
                    ${task.image_url ? `<img src="${task.image_url}" alt="${task.title}" class="task-image">` : ''}
                    <p>${task.description}</p>
                    <textarea id="${taskId}-answer" placeholder="Type your answer here..."></textarea>
                    <button class="submit-button" data-task-id="${taskId}">Submit Answer</button>
                </div>`;
            taskContainer.innerHTML += taskHTML;
        }
    }

    // --- EVENT HANDLERS ---
    loginButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const grade = gradeInput.value;
        if (name && grade >= 1 && grade <= 12) {
            const user = { name, grade };
            localStorage.setItem('careerQuestUser', JSON.stringify(user));
            showMainView(user);
        } else {
            alert('Please enter a valid name and grade (1-12).');
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('careerQuestUser');
        window.location.reload();
    });
    
    // Event delegation for submit buttons
    mainApp.addEventListener('click', (event) => {
        if (event.target.classList.contains('submit-button')) {
            const taskId = event.target.dataset.taskId;
            submitTask(taskId);
        }
    });

    async function submitTask(taskId) {
        const user = JSON.parse(localStorage.getItem('careerQuestUser'));
        const answer = document.getElementById(`${taskId}-answer`).value.trim();
        if (!answer) {
            alert('Please provide an answer.');
            return;
        }
        
        const taskTitle = document.querySelector(`#${taskId} h2`).textContent;
        const taskData = {
            grade: user.grade,
            task_type: taskTitle,
            answer: answer
        };

        showLoading(true, "The Oracle is analyzing...");
        taskContainer.classList.add('hidden');
        resultsContainer.classList.add('hidden');

        try {
            // (The rest of the submitTask and displayResults logic from previous version)
            // This part remains the same.
        } finally {
            showLoading(false);
        }
    }
    
    // --- HELPER FUNCTIONS ---
    function showLoading(isLoading, message = "Loading...") {
        loadingDiv.querySelector('p').textContent = message;
        loadingDiv.classList.toggle('hidden', !isLoading);
    }
    
    // (Paste your full 'displayResults' function and its helpers from the previous version here)

    init();
});