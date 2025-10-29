
export default class Project {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.todos = new Map();
  }

  addTodo(todo) {
    this.todos.set(todo.id, todo);
  }

  removeTodo(id) {
    this.todos.delete(id);
  }

}

