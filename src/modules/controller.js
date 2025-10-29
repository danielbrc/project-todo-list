import Project from "./project";
import Todo from "./todo";
import { setStorage, getStorage } from "./storage";

export class ProjectController {
  constructor() {
    this.projects = new Map();
    this.activeId = 42;

    getStorage(this.storedProject.bind(this));

    // set Default project
    if (this.projects.size == 0) {
      this.addProject(this.activeId, "Inbox", "Get things done!");
    }
  }

  addProject(id, name, description) {
    const newProject = new Project(id, name, description);

    if(this.projects.has(id) && this.projects.get(id).todos.size > 0){
      newProject.todos = this.projects.get(id).todos;
    };

    this.projects.set(id, newProject);

    setStorage(this.projects);
  }

  removeProject(id) {
    this.projects.delete(id);
    const updateId = this.projects.entries().next().value[0];
    this.changeActiveProject(updateId);

    setStorage(this.projects);
  }

  activeProject() {
    return this.projects.get(this.activeId);
  }

  changeActiveProject(id) {
    this.activeId = id;
  }

  addTodo(todo) {
    const activeProject = this.activeProject();
    activeProject.addTodo(todo);
    this.projects.set(this.activeId, activeProject);
    setStorage(this.projects);
  }

  removeTodo(id) {
    const activeProject = this.activeProject();
    activeProject.removeTodo(id);
    this.projects.set(this.activeId, activeProject);
    setStorage(this.projects);
  }

  storedProject(stored) {
    for(const [key, project] of stored) {
      const { id, name, description, todos } = project;
      // console.log('stored > ', id, name);
      // console.log('todos > ', todos);

      const newProject = new Project(id, name, description);
      this.projects.set(id, newProject);
      // this.activeProject = this.projects.get(this.activeId);

      this.storedTodo(id, todos);
    }
  }

  storedTodo(projectId, todos) {
    const project = this.projects.get(projectId);
    for(const [k, todo] of todos) {
      if(Object.hasOwn(todo,'name')){
        const { id, name, description, dueDate, priority, done } = todo;
        const newTodo = new Todo(id, name, description, dueDate, priority, done);
        project.addTodo(newTodo);
      }
    }
    this.projects.set(projectId, project);
  }
}

export class TodoController {
  constructor() {
    this.todos = new Map();
    this.activeId = -1;
    this.activeTodo = null;
  }

  add(id, name, description, dueDate, priority, done) {
    this.activeId = id || new Date().getTime();
    const newTodo = new Todo(this.activeId, name, description, dueDate, priority, done);

    this.todos.set(this.activeId, newTodo);
    this.changeActiveTodo(this.activeId);
  }

  remove(id) {
    this.todos.delete(id);
  }

  update(id, name, description, dueDate, priority, done) {
    console.log('todos ',this.todos);
    const updatedTodo = new Todo(id, name, description, dueDate, priority, done);
    console.log('updatedTodo', updatedTodo);

    this.todos.set(updatedTodo.id, updatedTodo);
    this.changeActiveTodo(updatedTodo.id);
  }

  changeActiveTodo(id) {
    this.activeTodo = this.todos.get(id);
  }

}