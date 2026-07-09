import { todos, save } from './index.js';

const loadDeleted = () => {
    const content = document.getElementById('main-content');
    content.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('page-container');

    const deletedTodos = todos.filter(t => t.deleted);

    div.innerHTML = `
        <div class="page-header">
            <h2>🗑 Deleted</h2>
            ${deletedTodos.length > 0 ? '<button id="clearAllBtn" class="btn-add" style="background:#fc8181">Clear All</button>' : ''}
        </div>
        <div id="deletedList" class="todo-list"></div>
    `;
    content.appendChild(div);

    const listEl = div.querySelector('#deletedList');

    if (deletedTodos.length === 0) {
        listEl.innerHTML = `<p class="empty-msg">No deleted todos.</p>`;
        return;
    }

    deletedTodos.forEach(todo => {
        const card = document.createElement('div');
        card.classList.add('todo-card');
        card.innerHTML = `
            <div class="todo-main">
                <div class="todo-info">
                    <span class="todo-title" style="text-decoration:line-through">${todo.title}</span>
                    <span class="todo-due">${todo.project} · ${todo.dueDate || 'No date'}</span>
                </div>
                <div class="todo-actions">
                    <button class="btn-restore btn-expand" data-id="${todo.id}">Restore</button>
                </div>
            </div>
        `;
        listEl.appendChild(card);
    });

    listEl.querySelectorAll('.btn-restore').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const todo = todos.find(t => t.id === e.target.dataset.id);
            todo.deleted = false;
            save();
            loadDeleted();
        });
    });

    const clearBtn = div.querySelector('#clearAllBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const idx = todos.reduce((acc, t, i) => { if (t.deleted) acc.push(i); return acc; }, []);
            idx.reverse().forEach(i => todos.splice(i, 1));
            save();
            loadDeleted();
        });
    }
};

export default loadDeleted;