document.addEventListener('DOMContentLoaded', function() {
  // Current view state
  let currentView = 'today';
  let scheduleData = null;
  
  // DOM elements
  const container = document.getElementById('json-viewer');
  const viewTitle = document.getElementById('view-title');
  const upcomingBtn = document.getElementById('upcoming-btn');
  const todayBtn = document.getElementById('today-btn');
  const calendarBtn = document.getElementById('calendar-btn');
  
  // Try multiple possible paths for the JSON file
  const jsonPaths = [
    './toDo.json',
    '/website/folio/basicProjects/todDoApp/toDo.json',
    'toDo.json'
  ];
  
  // Load JSON data
  const loadData = async () => {
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
  
  // Render tasks based on current view
  const renderView = () => {
    if (!scheduleData) return;
    
    container.innerHTML = '';
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = new Date().getDay();
    const todayName = days[todayIndex];
    
    switch(currentView) {
      case 'today':
        viewTitle.textContent = 'Today';
        renderTodayTasks(todayName);
        break;
        
      case 'upcoming':
        viewTitle.textContent = 'Upcoming';
        renderUpcomingTasks(todayIndex, todayName);
        break;
        
      case 'calendar':
        viewTitle.textContent = 'Weekly Schedule';
        renderWeeklySchedule();
        break;
    }
  };
  
  // Render today's tasks
  const renderTodayTasks = (todayName) => {
    const todayPlan = scheduleData.next_week_schedule?.weekly_plan?.find(day => day.day === todayName);
    const todayTasks = todayPlan?.tasks || [];
    
    if (todayTasks.length === 0) {
      container.innerHTML = '<div class="task-item">No tasks scheduled for today</div>';
      return;
    }
    
    todayTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      taskItem.innerHTML = `
        <div class="task-checkbox"><input type="checkbox"></div>
        <div class="task-content">
          <div class="task-title">${task.focus || 'Untitled Task'} 
            <span class="task-time">(${task.time || 'No time specified'})</span>
          </div>
          ${task.goals?.length ? `
            <ul class="task-subitems">
              ${task.goals.map(goal => `<li>${goal}</li>`).join('')}
            </ul>
          ` : ''}
          ${task.resources ? `<div class="task-resources"><small>Resources: ${task.resources}</small></div>` : ''}
        </div>
      `;
      container.appendChild(taskItem);
    });
  };
  
  // Render upcoming tasks (today + next 3 days)
  const renderUpcomingTasks = (todayIndex, todayName) => {
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const upcomingDays = [];
    
    // Get today + next 3 days
    for (let i = 0; i < 4; i++) {
      const dayIndex = (todayIndex + i) % 7;
      upcomingDays.push(daysOrder[dayIndex]);
    }
    
    const hasTasks = upcomingDays.some(day => {
      const dayPlan = scheduleData.next_week_schedule?.weekly_plan?.find(d => d.day === day);
      return dayPlan?.tasks?.length > 0;
    });
    
    if (!hasTasks) {
      container.innerHTML = '<div class="task-item">No upcoming tasks in the next few days</div>';
      return;
    }
    
    upcomingDays.forEach(day => {
      const dayPlan = scheduleData.next_week_schedule?.weekly_plan?.find(d => d.day === day);
      const dayTasks = dayPlan?.tasks || [];
      
      if (dayTasks.length === 0) return;
      
      const daySection = document.createElement('div');
      daySection.className = 'day-section';
      daySection.innerHTML = `
        <h3>${day} ${day === todayName ? '(Today)' : ''}</h3>
      `;
      
      const taskList = document.createElement('ul');
      taskList.className = 'task-list';
      
      dayTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
          <div class="task-checkbox"><input type="checkbox"></div>
          <div class="task-content">
            <div class="task-title">${task.focus || 'Untitled Task'} 
              <span class="task-time">(${task.time || 'No time specified'})</span>
            </div>
            ${task.goals?.length ? `
              <ul class="task-subitems">
                ${task.goals.map(goal => `<li>${goal}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `;
        taskList.appendChild(taskItem);
      });
      
      daySection.appendChild(taskList);
      container.appendChild(daySection);
    });
  };
  
  // Render full weekly schedule
  const renderWeeklySchedule = () => {
    const weeklyPlan = scheduleData.next_week_schedule?.weekly_plan || [];
    
    if (weeklyPlan.length === 0) {
      container.innerHTML = '<div class="task-item">No weekly schedule available</div>';
      return;
    }
    
    weeklyPlan.forEach(dayPlan => {
      const daySection = document.createElement('div');
      daySection.className = 'day-section';
      daySection.innerHTML = `<h3>${dayPlan.day}</h3>`;
      
      const taskList = document.createElement('ul');
      taskList.className = 'task-list';
      
      dayPlan.tasks?.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
          <div class="task-checkbox"><input type="checkbox"></div>
          <div class="task-content">
            <div class="task-title">${task.focus || 'Untitled Task'} 
              <span class="task-time">(${task.time || 'No time specified'})</span>
            </div>
            ${task.goals?.length ? `
              <ul class="task-subitems">
                ${task.goals.map(goal => `<li>${goal}</li>`).join('')}
              </ul>
            ` : ''}
            ${task.resources ? `<div class="task-resources"><small>Resources: ${task.resources}</small></div>` : ''}
          </div>
        `;
        taskList.appendChild(taskItem);
      });
      
      daySection.appendChild(taskList);
      container.appendChild(daySection);
    });
  };
  
  // Set active menu button
  const setActiveButton = (activeBtn) => {
    [upcomingBtn, todayBtn, calendarBtn].forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
  };
  
  // Event listeners for menu buttons
  upcomingBtn.addEventListener('click', () => {
    currentView = 'upcoming';
    setActiveButton(upcomingBtn);
    renderView();
  });
  
  todayBtn.addEventListener('click', () => {
    currentView = 'today';
    setActiveButton(todayBtn);
    renderView();
  });
  
  calendarBtn.addEventListener('click', () => {
    currentView = 'calendar';
    setActiveButton(calendarBtn);
    renderView();
  });
  
  // Initialize
  loadData()
    .then(data => {
      scheduleData = data;
      setActiveButton(todayBtn);
      renderView();
    })
    .catch(error => {
      console.error('Error:', error);
      container.innerHTML = `
        <div class="task-item error">
          <div class="task-content">
            <div class="task-title">Error loading data</div>
            <div>${error.message}</div>
            <div>Check console (F12) for details</div>
            <div>Tried paths: ${jsonPaths.join(', ')}</div>
          </div>
        </div>
      `;
    });
    
  // Add new task functionality
  document.querySelector('.add-task button').addEventListener('click', function() {
    const input = document.querySelector('.add-task input');
    if (input.value.trim()) {
      const taskList = document.getElementById('json-viewer');
      const newTask = document.createElement('li');
      newTask.className = 'task-item';
      newTask.innerHTML = `
        <div class="task-checkbox"><input type="checkbox"></div>
        <div class="task-content">
          <div class="task-title">${input.value}</div>
        </div>
      `;
      taskList.appendChild(newTask);
      input.value = '';
    }
  });
});