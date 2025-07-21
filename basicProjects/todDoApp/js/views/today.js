function renderTodayTasks() {
  if (!state.scheduleData) return;
  
  elements.viewTitle.textContent = 'Today';
  elements.container.innerHTML = '';
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const todayName = days[todayIndex];
  
  const todayPlan = state.scheduleData.next_week_schedule?.weekly_plan?.find(day => day.day === todayName);
  const todayTasks = todayPlan?.tasks || [];
  
  if (todayTasks.length === 0) {
    elements.container.innerHTML = '<div class="task-item">No tasks scheduled for today</div>';
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
    // Add checkbox event listener
    const checkbox = taskItem.querySelector('.task-checkbox input');
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        addToStash(task.focus || 'Untitled Task');
        taskItem.remove();
      }
    });
    
    elements.container.appendChild(taskItem);
  });
}