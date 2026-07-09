import './styles.css';
import { loadTodos, saveTodos, loadProjects, saveProjects } from './storage.js';
import { Todo } from './todo.js';
import loadHome from './home.js';
import loadImportant from './important.js';
import loadDeleted from './deleted.js';

export let todos = loadTodos();
export let projects = loadProjects();

export const save = () => {
    saveTodos(todos);
    saveProjects(projects);
    updateSidebar();
    updateStats();
    updateUpcoming();
};

// SIDEBAR PROJECT NAV
export const updateSidebar = () => {
    const nav = document.getElementById('projectNav');
    if (!nav) return;
    nav.innerHTML = '';
    const colors = ['#378ADD', '#1D9E75', '#D85A30', '#9F77DD', '#E24B4A', '#EF9F27'];
    projects.forEach((p, i) => {
        const count = todos.filter(t => t.project === p && !t.deleted).length;
        const item = document.createElement('div');
        item.classList.add('nav-item');
        item.innerHTML = `
            <span class="project-dot" style="background:${colors[i % colors.length]}"></span>
            ${p}
            <span class="nav-badge">${count}</span>
        `;
        item.addEventListener('click', () => loadHome(p));
        nav.appendChild(item);
    });
};

// STATS
export const updateStats = () => {
    const active = todos.filter(t => !t.deleted);
    document.getElementById('statTotal').textContent = active.length;
    document.getElementById('statDone').textContent = active.filter(t => t.completed).length;
    document.getElementById('statHigh').textContent = active.filter(t => t.priority === 'high').length;
    document.getElementById('statProjects').textContent = projects.length;
};

// UPCOMING
export const updateUpcoming = () => {
    const list = document.getElementById('upcomingList');
    if (!list) return;
    const upcoming = todos
        .filter(t => !t.deleted && !t.completed && t.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4);

    list.innerHTML = '';
    if (upcoming.length === 0) {
        list.innerHTML = '<p style="font-size:12px;color:#b0ada8;font-style:italic">No upcoming tasks</p>';
        return;
    }

    upcoming.forEach(todo => {
        const d = new Date(todo.dueDate);
        const day = d.getDate();
        const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
        const isUrgent = todo.priority === 'high';
        const item = document.createElement('div');
        item.classList.add('upcoming-item');
        item.innerHTML = `
            <div class="upcoming-date ${isUrgent ? 'urgent' : ''}">
                <span class="upcoming-day">${day}</span>
                <span class="upcoming-month">${month}</span>
            </div>
            <div>
                <div class="upcoming-title">${todo.title}</div>
                <div class="upcoming-project">${todo.project}</div>
            </div>
        `;
        list.appendChild(item);
    });
};

// CALENDAR
let calDate = new Date();

export const renderCalendar = () => {
    const grid = document.getElementById('calGrid');
    const monthLabel = document.getElementById('calMonth');
    if (!grid || !monthLabel) return;

    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    monthLabel.textContent = calDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const todoDates = new Set(
        todos
            .filter(t => t.dueDate && !t.deleted)
            .map(t => t.dueDate)
    );

    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    grid.innerHTML = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');

    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="cal-day empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const hasTodo = todoDates.has(dateStr);
        grid.innerHTML += `<div class="cal-day ${isToday ? 'today' : ''} ${hasTodo ? 'has-todo' : ''}">${d}</div>`;
    }
};

document.getElementById('calPrev').addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('calNext').addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() + 1);
    renderCalendar();
});

// NAV BUTTONS
document.getElementById('homeBtn').addEventListener('click', () => loadHome());
document.getElementById('impBtn').addEventListener('click', loadImportant);
document.getElementById('deletedBtn').addEventListener('click', loadDeleted);
document.getElementById('todayBtn').addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    loadHome(null, today);
});
document.getElementById('addProjectNav').addEventListener('click', () => {
    const name = prompt('Project name:');
    if (!name || name.trim() === '') return;
    if (projects.includes(name.trim())) { alert('Already exists!'); return; }
    projects.push(name.trim());
    save();
});

// INIT
loadHome();
updateSidebar();
updateStats();
updateUpcoming();
renderCalendar();