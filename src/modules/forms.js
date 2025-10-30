import { formData, createElement } from './utils';

export class NewProject {
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
    const labelId = createElement(
      'label',
      'Id:',
      null,
      'hidden'
    ).setManyAttributes({ for: 'id' });
    const inputId = createElement('input').setManyAttributes({
      type: 'number',
      id: 'id',
      name: 'id',
      hidden: '',
    });
    const labelName = createElement('label', 'Name:').setManyAttributes({
      for: 'name',
    });
    const inputName = createElement('input').setManyAttributes({
      type: 'text',
      id: 'name',
      name: 'name',
      required: 'true',
    });
    const labelDescription = createElement(
      'label',
      'Description:'
    ).setManyAttributes({ for: 'description' });
    const textDescription = createElement('textarea').setManyAttributes({
      name: 'description',
      id: 'description',
      placeholder: 'Your project meta...',
    });
    const bottomArea = createElement('div', null, null, 'align-right');
    const btReset = createElement('button', 'Cancel');
    const btSubmit = createElement('button', 'Create');

    btReset.type = 'reset';
    btSubmit.type = 'submit';
    labelId.appendChild(inputId);
    labelName.appendChild(inputName);

    [btReset, btSubmit].forEach((elem) => bottomArea.appendChild(elem));
    [
      legend,
      labelId,
      labelName,
      labelDescription,
      textDescription,
      bottomArea,
    ].forEach((elem) => field.appendChild(elem));

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

      if (projectData.id === '') {
        projectData.id = new Date().getTime();
      }

      const createProject = new CustomEvent('createProject', {
        detail: { ...projectData },
      });
      document.dispatchEvent(createProject);

      projectForm.reset();
      this.modal.close();
    });
  }
}

export class NewTask {
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
    const labelId = createElement(
      'label',
      'Id:',
      null,
      'hidden'
    ).setManyAttributes({ for: 'id' });
    const inputId = createElement('input').setManyAttributes({
      type: 'number',
      id: 'id',
      name: 'id',
      hidden: '',
    });
    const labelName = createElement('label', 'Name:').setManyAttributes({
      for: 'name',
    });
    const inputName = createElement('input').setManyAttributes({
      type: 'text',
      id: 'name',
      name: 'name',
      required: 'true',
    });
    const labelDueDate = createElement('label', 'Name:').setManyAttributes({
      for: 'dueDate',
    });
    const inputDueDate = createElement('input').setManyAttributes({
      type: 'date',
      id: 'dueDate',
      name: 'dueDate',
      required: 'true',
    });
    const labelDone = createElement(
      'label',
      'Task complete:',
      null,
      'hidden'
    ).setManyAttributes({ for: 'done' });
    const inputDone = createElement('input').setManyAttributes({
      type: 'checkbox',
      id: 'done',
      name: 'done',
      hidden: '',
    });
    const labelPriority = createElement('label', 'Priority:').setManyAttributes(
      { for: 'priority' }
    );
    const selectPriority = createElement('select').setManyAttributes({
      id: 'priority',
      name: 'priority',
    });
    const labelDescription = createElement(
      'label',
      'Description:'
    ).setManyAttributes({ for: 'description' });
    const textDescription = createElement('textarea').setManyAttributes({
      name: 'description',
      id: 'description',
      placeholder: 'Describe your task...',
    });
    const bottomArea = createElement('div', null, null, 'align-right');
    const btReset = createElement('button', 'Cancel');
    const btSubmit = createElement('button', 'Create');

    ['Low', 'Medium', 'High'].forEach((value) => {
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

    [btReset, btSubmit].forEach((elem) => bottomArea.appendChild(elem));
    [
      legend,
      labelId,
      labelName,
      labelDueDate,
      labelDone,
      labelPriority,
      labelDescription,
      textDescription,
      bottomArea,
    ].forEach((elem) => field.appendChild(elem));

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
      const createTask = new CustomEvent('createTask', {
        detail: { ...tasktData },
      });

      document.dispatchEvent(createTask);

      taskForm.reset();
      this.modal.close();
    });
  }
}
