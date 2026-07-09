import { todos, projects, save, renderCalendar, updateUpcoming } from './index.js';
import { Todo } from './todo.js';

const renderTodos = (filteredTodos, listEl) => {
    listEl.innerHTML = '';
    if (filteredTodos.length === 0) {
        listEl.innerHTML = `<p class="empty-msg">No tasks here. Add one above!</p>`;
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayTodos = filteredTodos.filter(t => t.dueDate === today);
    const upcomingTodos = filteredTodos.filter(t => t.dueDate !== today || !t.dueDate);

    const renderSection = (label, items) => {
        if (items.length === 0) return;
        const div = document.createElement('div');
        div.innerHTML = `<div class="section-divider">${label}</div>`;
        listEl.appendChild(div);
        items.forEach(todo => {
            const card = document.createElement('div');
            card.classList.add('todo-card', todo.priority);
            if (todo.completed) card.classList.add('done');
            card.innerHTML = `
                <input type="checkbox" class="todo-check" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
                <div class="todo-body">
                    <span class="todo-title">${todo.title}</span>
                    <div class="todo-meta">
                        ${todo.dueDate ? `<span class="todo-due">&#128197; ${todo.dueDate}</span>` : ''}
                        <span class="todo-project">${todo.project}</span>
                        <span class="priority-badge p-${todo.priority === 'high' ? 'high' : todo.priority === 'medium' ? 'med' : 'low'}">${todo.priority}</span>
                    </div>
                    <div class="todo-details" id="details-${todo.id}">
                        <p><strong>Description:</strong> ${todo.description || 'None'}</p>
                        <p><strong>Project:</strong> ${todo.project}</p>
                        <p><strong>Priority:</strong> ${todo.priority}</p>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-btn btn-star ${todo.important ? 'star-active' : ''}" data-id="${todo.id}" title="Mark important">&#9733;</button>
                    <button class="action-btn btn-expand" data-id="${todo.id}" title="Details">&#8230;</button>
                    <button class="action-btn btn-delete" data-id="${todo.id}" title="Delete">&#128465;</button>
                </div>
            `;
            listEl.appendChild(card);
        });
    };

    renderSection('Today', todayTodos);
    renderSection('All Tasks', upcomingTodos);
};

const bindEvents = (listEl, rerender) => {
    listEl.querySelectorAll('.todo-check').forEach(cb => {
        cb.addEventListener('change', e => {
            const todo = todos.find(t => t.id === e.target.dataset.id);
            todo.toggleComplete();
            save();
            rerender();
        });
    });

    listEl.querySelectorAll('.btn-star').forEach(btn => {
        btn.addEventListener('click', e => {
            const todo = todos.find(t => t.id === e.target.dataset.id);
            todo.toggleImportant();
            save();
            rerender();
        });
    });

    listEl.querySelectorAll('.btn-expand').forEach(btn => {
        btn.addEventListener('click', e => {
            const details = document.getElementById(`details-${e.target.dataset.id}`);
            details.classList.toggle('visible');
        });
    });

    listEl.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', e => {
            const todo = todos.find(t => t.id === e.target.dataset.id);
            todo.softDelete();
            save();
            rerender();
        });
    });
};

const loadHome = (projectFilter = null, dateFilter = null) => {
    const content = document.getElementById('main-content');
    content.innerHTML = '';

    const div = document.createElement('div');
    div.style.padding = '32px 36px';

    const title = projectFilter ? `&#128193; ${projectFilter}` : dateFilter ? '&#128197; Today' : 'All tasks';
    const active = todos.filter(t => !t.deleted);
    const count = projectFilter
        ? active.filter(t => t.project === projectFilter).length
        : dateFilter
        ? active.filter(t => t.dueDate === dateFilter).length
        : active.length;

    div.innerHTML = `
        <div class="main-header">
            <div>
                <div class="main-title">${title}</div>
                <div class="main-sub">${count} task${count !== 1 ? 's' : ''}</div>
            </div>
            <button class="add-btn" id="addTodoBtn">+ Add task</button>
        </div>

        <div class="filter-row">
            <button class="filter-chip active" data-filter="all">All</button>
            <button class="filter-chip" data-filter="active">Active</button>
            <button class="filter-chip" data-filter="done">Completed</button>
            <button class="filter-chip" data-filter="high">High priority</button>
        </div>

        <div class="todo-form" id="addTodoForm">
            <h3>New task</h3>
            <div class="form-group">
                <label>Title *</label>
                <input type="text" id="todoTitle" placeholder="What needs to be done?">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="todoDesc" placeholder="Add details..."></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="date" id="todoDue">
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select id="todoPriority">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Project</label>
                    <select id="todoProject">
                        ${projects.map(p => `<option value="${p}">${p}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-actions">
                <button class="btn-cancel" id="cancelTodo">Cancel</button>
                <button class="btn-save" id="saveTodo">Add task</button>
            </div>
        </div>

        <div class="todo-list" id="todoList"></div>
    `;
    content.appendChild(div);

    let currentFilter = 'all';

    const getFiltered = () => {
        let base = todos.filter(t => !t.deleted);
        if (projectFilter) base = base.filter(t => t.project === projectFilter);
        if (dateFilter) base = base.filter(t => t.dueDate === dateFilter);
        if (currentFilter === 'active') base = base.filter(t => !t.completed);
        if (currentFilter === 'done') base = base.filter(t => t.completed);
        if (currentFilter === 'high') base = base.filter(t => t.priority === 'high');
        return base;
    };

    const rerender = () => {
        const listEl = div.querySelector('#todoList');
        renderTodos(getFiltered(), listEl);
        bindEvents(listEl, rerender);
        renderCalendar();
        updateUpcoming();
    };

    rerender();

    div.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', e => {
            div.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            rerender();
        });
    });

    div.querySelector('#addTodoBtn').addEventListener('click', () => {
        div.querySelector('#addTodoForm').classList.toggle('visible');
    });

    div.querySelector('#cancelTodo').addEventListener('click', () => {
        div.querySelector('#addTodoForm').classList.remove('visible');
    });

    div.querySelector('#saveTodo').addEventListener('click', () => {
        const title = div.querySelector('#todoTitle').value.trim();
        if (!title) { alert('Title is required!'); return; }
        const todo = new Todo(
            title,
            div.querySelector('#todoDesc').value,
            div.querySelector('#todoDue').value,
            div.querySelector('#todoPriority').value,
            div.querySelector('#todoProject').value
        );
        todos.push(todo);
        save();
        div.querySelector('#addTodoForm').classList.remove('visible');
        div.querySelector('#todoTitle').value = '';
        div.querySelector('#todoDesc').value = '';
        rerender();
    });
};

export default loadHome;