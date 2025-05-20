function loadTasks() {
    fetch('http://127.0.0.1:8000/api/tasks/')
        .then(response => response.json())
        .then(data => renderTasks(data));
}

function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = (task.completed ? "✅ " : "") + task.title;

        if (task.completed) {
            li.style.textDecoration = 'line-through';
            li.style.color = 'gray';
        } else {
            li.style.textDecoration = 'none';
            li.style.color = 'black';
        }

        li.addEventListener('click', () => {
            const updatedTask = { ...task, completed: !task.completed };

            fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask)
            })
            .then(response => response.json())
            .then(() => loadTasks());
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.style.backgroundColor = 'transparent';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
                method: 'DELETE'
            })
            .then(() => loadTasks());
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('task-input').value;
    const newTask = { title: title, completed: false };

    fetch('http://127.0.0.1:8000/api/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('task-input').value = '';
        loadTasks();
    });
});

loadTasks();
   