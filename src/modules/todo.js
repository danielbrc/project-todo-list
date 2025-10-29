
export default class Todo {
  constructor(id, name, description, dueDate, priority, done = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.done = done;
  }

  update(name, description, dueDate, priority) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  toggleStatus() {
    this.done = !this.done;
  }
}