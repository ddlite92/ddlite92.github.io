function renderUpcomingTasks() {
  if (!state.scheduleData) return;
  
  elements.viewTitle.textContent = 'Upcoming';
  elements.container.innerHTML = '';
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const todayName = days[todayIndex];
  const upcomingDays = [];
  
  for (let i = 0; i < 4; i++) {
    const dayIndex = (todayIndex + i) % 7;
    upcomingDays.push(days[dayIndex]);
  }
  
  const hasTasks = upcomingDays.some(day => {
    const dayPlan = state.scheduleData.next_week_schedule?.weekly_plan?.find(d => d.day === day);
    return dayPlan?.tasks?.length > 0;
  });
  
  if (!hasTasks) {
    elements.container.innerHTML = '<div class="task-item">No upcoming tasks in the next few days</div>';
    return;
  }
  
  upcomingDays.forEach(day => {
    const dayPlan = state.scheduleData.next_week_schedule?.weekly_plan?.find(d => d.day === day);
    const dayTasks = dayPlan?.tasks || [];
    
    if (dayTasks.length === 0) return;
    
    const daySection = document.createElement('div');
    daySection.className = 'day-section';
    daySection.innerHTML = `<h3>${day} ${day === todayName ? '(Today)' : ''}</h3>`;
    
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
      // Add checkbox event listener
    const checkbox = taskItem.querySelector('.task-checkbox input');
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        addToStash(task.focus || 'Untitled Task');
        taskItem.remove();
      }
    });
      taskList.appendChild(taskItem);
    });
    
    daySection.appendChild(taskList);
    elements.container.appendChild(daySection);
  });
}