function renderWeeklySchedule() {
  if (!state.scheduleData) return;
  
  elements.viewTitle.textContent = 'Weekly Schedule';
  elements.container.innerHTML = '';
  
  const weeklyPlan = state.scheduleData.next_week_schedule?.weekly_plan || [];
  
  if (weeklyPlan.length === 0) {
    elements.container.innerHTML = '<div class="task-item">No weekly schedule available</div>';
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