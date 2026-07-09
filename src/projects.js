import { todos, projects, save } from './index.js';

const loadProjects = () => {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('page-container');
    div.innerHTML = `
        <div class="page-header">
            <h2>Projects</h2>
            <button id="addProjectBtn" class="btn-add">+ New Project</button>
        </div>
        <div id="addProjectForm" class="todo-form hidden">
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" id="projectName" placeholder="e.g. Work, Personal...">
            </div>
            <div class="form-actions">
                <button id="cancelProject" class="btn-cancel">Cancel</button>
                <button id="saveProject" class="btn-save">Create</button>
            </div>
        </div>
        <div id="projectList" class="todo-list"></div>
    `;
    content.appendChild(div);

    const listEl = div.querySelector('#projectList');

    projects.forEach(project => {
        const count = todos.filter(t => t.project === project && !t.deleted).length;
        const card = document.createElement('div');
        card.classList.add('todo-card');
        card.innerHTML = `
            <div class="todo-main">
                <div class="todo-info">
                    <span class="todo-title">📁 ${project}</span>
                    <span class="todo-due">${count} active todo${count !== 1 ? 's' : ''}</span>
                </div>
                ${project !== 'Default' ? `<button class="btn-delete btn-del-project" data-name="${project}">🗑</button>` : ''}
            </div>
        `;
        listEl.appendChild(card);
    });

    listEl.querySelectorAll('.btn-del-project').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const idx = projects.indexOf(name);
            if (idx > -1) projects.splice(idx, 1);
            todos.forEach(t => { if (t.project === name) t.project = 'Default'; });
            save();
            loadProjects();
        });
    });

    div.querySelector('#addProjectBtn').addEventListener('click', () => {
        div.querySelector('#addProjectForm').classList.toggle('hidden');
    });

    div.querySelector('#cancelProject').addEventListener('click', () => {
        div.querySelector('#addProjectForm').classList.add('hidden');
    });

    div.querySelector('#saveProject').addEventListener('click', () => {
        const name = div.querySelector('#projectName').value.trim();
        if (!name) { alert('Project name required!'); return; }
        if (projects.includes(name)) { alert('Project already exists!'); return; }
        projects.push(name);
        save();
        loadProjects();
    });
};

export default loadProjects;