import { todos } from './index.js';

const loadImportant = () => {
    const content = document.getElementById('main-content');
    content.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('page-container');

    const importantTodos = todos.filter(t => t.important && !t.deleted);

    div.innerHTML = `
        <div class="page-header">
            <h2>⭐ Important</h2>
        </div>
        <div id="importantList" class="todo-list"></div>
    `;
    content.appendChild(div);

    const listEl = div.querySelector('#importantList');

    if (importantTodos.length === 0) {
        listEl.innerHTML = `<p class="empty-msg">No important todos yet. Star a todo to add it here.</p>`;
        return;
    }

    importantTodos.forEach(todo => {
        const card = document.createElement('div');
        card.classList.add('todo-card', `priority-${todo.priority}`);
        if (todo.completed) card.classList.add('completed');
        card.innerHTML = `
            <div class="todo-main">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} disabled>
                <div class="todo-info">
                    <span class="todo-title">${todo.title}</span>
                    <span class="todo-due">Due: ${todo.dueDate || 'No date'} · ${todo.project}</span>
                </div>
            </div>
        `;
        listEl.appendChild(card);
    });
};

export default loadImportant;