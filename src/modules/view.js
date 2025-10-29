import { formData, feedForm, createElement, settingElements } from "./utils";
import { formatDistanceToNow } from "date-fns";
import pencil from "./../icon/pencil.png";
import trashCan from "./../icon/trash-can.png"

export default class AppTodo {
  constructor(container, projectController, todoController) {
    this.container = container;
    this.projectController = projectController;
    this.todoController = todoController;

    this.sidebar = new Sidebar(container, projectController);
    this.main = new Main(container, projectController);

    this.newProject = new NewProject(container);
    this.newTask = new NewTask(container);
  }

  init() {
    console.log('AppTodo init');
    this.build();
    this.registerEvents();
  }

  build() {
    this.sidebar.build();
    this.main.build();
  };

  registerEvents() {
    console.log('Register Events');

    document.addEventListener('newProjectForm', () => {
      this.newProject.build();
    });

    document.addEventListener('newTaskForm', () => {
      this.newTask.build();
    });

    document.addEventListener('createProject', ({ detail }) => {
      const { id, name, description } = detail;

      this.projectController.addProject(id, name, description);
      this.projectController.changeActiveProject(id);
      this.build();
    });

    document.addEventListener('createTask', ({ detail }) => {
      const { id, name, description, dueDate, priority, done } = detail;
      this.todoController.add(id, name, description.trim(), dueDate, priority, done);

      const activeTodo = this.todoController.activeTodo;
      this.projectController.addTodo(activeTodo);

      this.main.build();
    });

    document.addEventListener('changeMainProject', ({ detail }) => {
      const projectId = detail.id;
      const projCont = this.projectController;

      if(projectId != projCont.activeId){
        this.projectController.changeActiveProject(projectId);
        this.main.build();
      }
    });

    document.addEventListener('updateTask', ({ detail }) => {
      const { id, name, description, dueDate, priority, done } = detail;

      this.todoController.update(id, name, description, dueDate, priority, done);
      const activeTodo = this.todoController.activeTodo;
      this.projectController.addTodo(activeTodo);
    });

    document.addEventListener('editProject', ({ detail }) => {
      this.newProject.build();
      const activeProject = this.projectController.activeProject();
      feedForm(activeProject, this.newProject.modal.firstChild);
    });

    document.addEventListener('deleteProject', ({ detail }) => {
      this.projectController.removeProject(detail.id);
      this.build();
    });

    document.addEventListener('editTask', ({ detail }) => {
      this.newTask.build();

      const activeProject = this.projectController.activeProject();
      const activeTask = activeProject.todos.get(detail.id);
      feedForm(activeTask, this.newTask.modal.firstChild);
    });

    document.addEventListener('deleteTask', ({ detail }) => {
      this.projectController.removeTodo(detail.id);
      this.todoController.remove(detail.id);

      this.main.build();
    });

  }
}

class Sidebar {
  constructor(container, projectController) {
    this.container = container;
    this.projectController = projectController;

    this.content = document.querySelector('.sidebar');
  }

  build() {
    // this.container.appendChild(this.content);
    this.content.innerText = '';

    const title = createElement('h2', 'Your projects');
    const button = createElement('button', 'Add project', 'add-project');
    const list = createElement('ul', null, 'project-nav');

    button.addEventListener('click', () => {
      const event = new CustomEvent('newProjectForm');
      document.dispatchEvent(event);
    });

    ([title, button, list]).forEach(elem => this.content.appendChild(elem));

    for (const [key, project] of this.projectController.projects) {
      const listItem = createElement('li', project.name, null, null, { id: key } );
      list.appendChild(listItem);

      listItem.addEventListener('click', (event) => {
        const projectId = Number(event.target.dataset.id);
        const listEvent = new CustomEvent('changeMainProject', { detail: { id: projectId }});
        document.dispatchEvent(listEvent);
      });
    }
  }
}

class Main {
  constructor(container, projectController) {
    this.container = container;
    this.projectController = projectController;

    this.content = document.querySelector('.main');
  }

  build() {
    this.content.innerText = '';

    const activeProject = this.projectController.activeProject();

    const top = createElement('div', null, null, 'top');
    const title = createElement('h2', activeProject.name);
    const button = createElement('button', 'Add task', 'add-task');
    const description = createElement('p', activeProject.description);

    const settings = settingElements({ name: 'Project', id: activeProject.id });

    this.content.appendChild(top);

    button.addEventListener('click', () => {
      const event = new CustomEvent('newTaskForm');
      document.dispatchEvent(event);
    });

    ([title, button, settings, description]).forEach(elem => top.appendChild(elem));

    for(const [key, todo] of activeProject.todos) {
      const task = new Task(todo);
      this.content.appendChild(task.build());
    }
  }
}

class Task {
  constructor(todo){
    this.todo = todo;
  }

  build(task) {
    const { id, name, description, dueDate, priority, done } = this.todo;

    const timeLeft = formatDistanceToNow(new Date(dueDate), { addSuffix: true });

    const taskWrap = createElement('div', null, id, 'task', {'priority': priority });
    const label = createElement('label', null, null,'fix-input');
    const check = createElement('input').setManyAttributes({ name: 'done' });
    const title = createElement('h3', name);
    const span = createElement('span', timeLeft);
    const text = createElement('p', description);
    const settings = settingElements({ name: 'Task', id: id });

    check.type = 'checkbox';
    label.appendChild(check);

    if(done){
      check.checked = true;
    }

    ([label, title, span, text, settings]).forEach(elem => taskWrap.appendChild(elem));

    check.addEventListener('change', () => {
      this.todo.toggleStatus();

      const event = new CustomEvent('updateTask', { detail: { ...this.todo }});
      document.dispatchEvent(event);
    });

    return taskWrap;
  }
}

class NewProject {
  constructor(container) {
    this.container = container;

    this.modal = createElement('dialog', null, null, 'modal');
    container.appendChild(this.modal);
  }

  build() {
    this.modal.innerText = '';

    const projectForm = createElement('form');
    this.modal.appendChild(projectForm);
    
    projectForm.setAttribute('method', 'post');

    const field = createElement('fieldset');
    const legend = createElement('legend', 'New Project');
    const labelId = createElement('label', 'Id:', null, 'hidden')
      .setManyAttributes({ for: 'id' });
    const inputId = createElement('input')
      .setManyAttributes({ type:'number', id:'id', name: 'id', hidden: '' });
    const labelName = createElement('label', 'Name:')
      .setManyAttributes({ for: 'name' });
    const inputName = createElement('input')
      .setManyAttributes({ type:'text', id:'name', name: 'name', required: 'true' });
    const labelDescription = createElement('label', 'Description:')
      .setManyAttributes({ for: 'description' });
    const textDescription = createElement('textarea')
      .setManyAttributes({ name:'description', id:'description', placeholder:'Your project meta...' });
    const bottomArea = createElement('div', null, null, 'align-right');
    const btReset = createElement('button', 'Cancel');
    const btSubmit = createElement('button', 'Create');

    btReset.type = 'reset';
    btSubmit.type = 'submit';
    labelId.appendChild(inputId);
    labelName.appendChild(inputName);

    ([btReset, btSubmit]).forEach(elem => bottomArea.appendChild(elem));
    ([legend, labelId, labelName, labelDescription, textDescription, bottomArea]).forEach(elem => field.appendChild(elem));

    projectForm.appendChild(field);

    this.createEvent(projectForm);

    btReset.addEventListener('click', () => {
      projectForm.reset();
      this.modal.close();
    });

    this.modal.showModal();
  }

  createEvent(projectForm) {
    projectForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const projectData = formData(event.target);
      console.log('1-',projectData);
      if(projectData.id === ''){
        projectData.id = new Date().getTime();
      }
      console.log('2-',projectData);

      const createProject = new CustomEvent('createProject', { detail: { ...projectData }});
      document.dispatchEvent(createProject);

      projectForm.reset();
      this.modal.close();
    });
  }
}

class NewTask {
  constructor(container) {
    this.container = container;

    this.modal = createElement('dialog', null, null, 'modal');
    container.appendChild(this.modal);
  }

  build() {
    this.modal.innerText = '';

    const taskForm = createElement('form');
    this.modal.appendChild(taskForm);

    taskForm.setAttribute('method', 'post');

    const field = createElement('fieldset');
    const legend = createElement('legend', 'New task');
    const labelId = createElement('label', 'Id:', null, 'hidden')
      .setManyAttributes({ for: 'id' });
    const inputId = createElement('input')
      .setManyAttributes({ type:'number', id:'id', name: 'id', hidden: '' });
    const labelName = createElement('label', 'Name:')
      .setManyAttributes({ for: 'name' });
    const inputName = createElement('input')
      .setManyAttributes({ type:'text', id:'name', name: 'name', required: 'true' });
    const labelDueDate = createElement('label', 'Name:')
      .setManyAttributes({ for: 'dueDate' });
    const inputDueDate = createElement('input')
      .setManyAttributes({ type:'date', id:'dueDate', name: 'dueDate', required: 'true' });
    const labelDone = createElement('label', 'Task complete:', null, 'hidden')
      .setManyAttributes({ for: 'done' });
    const inputDone = createElement('input')
      .setManyAttributes({ type:'checkbox', id:'done', name: 'done', hidden: '' });
    const labelPriority = createElement('label', 'Priority:')
      .setManyAttributes({ for: 'priority' });
    const selectPriority = createElement('select')
      .setManyAttributes({ id:'priority', name: 'priority' });
    const labelDescription = createElement('label', 'Description:')
      .setManyAttributes({ for: 'description' });
    const textDescription = createElement('textarea')
      .setManyAttributes({ name:'description', id:'description', placeholder:'Describe your task...' });
    const bottomArea = createElement('div', null, null, 'align-right');
    const btReset = createElement('button', 'Cancel');
    const btSubmit = createElement('button', 'Create');

    (['Low','Medium','High']).forEach(value => {
      const option = createElement('option', value);
      option.setAttribute('value', value.toLocaleLowerCase());
      selectPriority.appendChild(option);
    });

    btReset.type = 'reset';
    btSubmit.type = 'submit';
    labelId.appendChild(inputId);
    labelName.appendChild(inputName);
    labelDueDate.appendChild(inputDueDate);
    labelDone.appendChild(inputDone);
    labelPriority.appendChild(selectPriority);

    ([btReset, btSubmit]).forEach(elem => bottomArea.appendChild(elem));
    ([legend, labelId, labelName, labelDueDate, labelDone, labelPriority, labelDescription, textDescription, bottomArea])
      .forEach(elem => field.appendChild(elem));

    taskForm.appendChild(field);

    btReset.addEventListener('click', () => {
      taskForm.reset();
      this.modal.close();
    });

    this.createEvent(taskForm);

    this.modal.showModal();
  }

  createEvent(taskForm) {
    taskForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const tasktData = formData(event.target);
      const createTask = new CustomEvent('createTask', { detail: { ...tasktData }});

      document.dispatchEvent(createTask);

      taskForm.reset();
      this.modal.close();
    });
  }
}
