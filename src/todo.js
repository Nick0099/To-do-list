export class Todo {
    constructor(title, description, dueDate, priority, project = 'Default') {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority; // 'low', 'medium', 'high'
        this.project = project;
        this.completed = false;
        this.important = false;
        this.deleted = false;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    toggleImportant() {
        this.important = !this.important;
    }

    softDelete() {
        this.deleted = true;
    }
}