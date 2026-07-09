import { Todo } from './todo.js';

export const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

export const loadTodos = () => {
    const data = localStorage.getItem('todos');
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map(t => Object.assign(new Todo(), t));
};

export const saveProjects = (projects) => {
    localStorage.setItem('projects', JSON.stringify(projects));
};

export const loadProjects = () => {
    const data = localStorage.getItem('projects');
    if (!data) return ['Default'];
    return JSON.parse(data);
};