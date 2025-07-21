// Shared state
const state = {
  currentView: 'today',
  scheduleData: JSON.parse(localStorage.getItem('scheduleData')) || null,
  stash: JSON.parse(localStorage.getItem('stash')) || []  // Load from localStorage
};

// DOM elements
const elements = {
  container: document.getElementById('json-viewer'),
  viewTitle: document.getElementById('view-title'),
  upcomingBtn: document.getElementById('upcoming-btn'),
  todayBtn: document.getElementById('today-btn'),
  calendarBtn: document.getElementById('calendar-btn'),
  stashBtn: document.getElementById('stash-btn'),
  stashCount: document.getElementById('stash-count'),
  contentHeader: document.getElementById('content-header')
};

// View functions
const views = {
  today: renderTodayTasks,
  upcoming: renderUpcomingTasks,
  calendar: renderWeeklySchedule,
  stash: renderStash
};

// Load JSON data
const loadData = async () => {
  const jsonPaths = [
    './toDo.json',
    '/website/folio/basicProjects/todDoApp/toDo.json',
    'toDo.json'
  ];
  
  for (const path of jsonPaths) {
    try {
      const response = await fetch(path);
      if (!response.ok) continue;
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(`Failed to load from ${path}, trying next...`);
    }
  }
  throw new Error('Could not load JSON from any path');
};

// Set active menu button
const setActiveButton = (activeBtn) => {
  [elements.upcomingBtn, elements.todayBtn, elements.calendarBtn, elements.stashBtn].forEach(btn => {
    btn.classList.remove('active');
  });
  activeBtn.classList.add('active');
};

// Switch view
const switchView = (view) => {
  state.currentView = view;
  setActiveButton(elements[`${view}Btn`]);
  views[view]();
};

// Initialize
const init = async () => {
  try {
    state.scheduleData = await loadData();
    setActiveButton(elements.todayBtn);
    renderTodayTasks();
    updateStashCount();
  } catch (error) {
    console.error('Error:', error);
    elements.container.innerHTML = `
      <div class="task-item error">
        <div class="task-content">
          <div class="task-title">Error loading data</div>
          <div>${error.message}</div>
          <div>Check console (F12) for details</div>
          <div>Tried paths: ${jsonPaths.join(', ')}</div>
        </div>
      </div>
    `;
  }
  
  // Event listeners
  elements.upcomingBtn.addEventListener('click', () => switchView('upcoming'));
  elements.todayBtn.addEventListener('click', () => switchView('today'));
  elements.calendarBtn.addEventListener('click', () => switchView('calendar'));
  elements.stashBtn.addEventListener('click', () => switchView('stash'));
  
  // Add new task
  document.querySelector('.add-task button').addEventListener('click', function() {
    const input = document.querySelector('.add-task input');
    if (input.value.trim()) {
      const newTask = document.createElement('li');
      newTask.className = 'task-item';
      newTask.innerHTML = `
        <div class="task-checkbox"><input type="checkbox"></div>
        <div class="task-content">
          <div class="task-title">${input.value}</div>
        </div>
      `;
      
      // Add checkbox event listener
      const checkbox = newTask.querySelector('.task-checkbox input');
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          addToStash(input.value);
          newTask.remove();
        }
      });
      
      elements.container.appendChild(newTask);
      input.value = '';
    }
  });
};

// Update stash count display
const updateStashCount = () => {
  elements.stashCount.textContent = state.stash.length;
};

// Start the application
document.addEventListener('DOMContentLoaded', init);