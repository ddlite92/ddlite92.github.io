function addToStash(taskText) {
  state.stash.push({
    id: Date.now(),
    text: taskText,
    date: new Date().toLocaleDateString(),
    completed: true
  });
  updateStashCount();
  saveStashToLocalStorage();
}

function clearStash() {
  state.stash = [];
  updateStashCount();
  saveStashToLocalStorage();
  renderStash();
}

function saveStashToLocalStorage() {
  localStorage.setItem('taskStash', JSON.stringify(state.stash));
}

function loadStashFromLocalStorage() {
  const savedStash = localStorage.getItem('taskStash');
  if (savedStash) {
    state.stash = JSON.parse(savedStash);
    updateStashCount();
  }
}

function renderStash() {
  elements.viewTitle.textContent = 'Stash';
  elements.container.innerHTML = '';
  
  if (state.stash.length > 0) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-stash';
    clearBtn.textContent = 'Clear Stash';
    clearBtn.addEventListener('click', clearStash);
    
    if (!elements.contentHeader.querySelector('.clear-stash')) {
      elements.contentHeader.appendChild(clearBtn);
    }
  } else {
    const existingBtn = elements.contentHeader.querySelector('.clear-stash');
    if (existingBtn) {
      existingBtn.remove();
    }
    elements.container.innerHTML = '<div class="task-item">Your stash is empty</div>';
    return;
  }
  
  state.stash.forEach(item => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item stash-item';
    taskItem.innerHTML = `
      <div class="task-checkbox"><input type="checkbox" checked></div>
      <div class="task-content">
        <div class="task-title">${item.text}</div>
        <small>Completed: ${item.date}</small>
      </div>
    `;
    
    // Uncheck to restore task (optional)
    const checkbox = taskItem.querySelector('.task-checkbox input');
    checkbox.addEventListener('change', function() {
      if (!this.checked) {
        state.stash = state.stash.filter(i => i.id !== item.id);
        updateStashCount();
        saveStashToLocalStorage();
        renderStash();
      }
    });
    
    elements.container.appendChild(taskItem);
  });
}

// Load stash from localStorage when the app starts
loadStashFromLocalStorage();