import pencil from "./../icon/pencil.png";
import trashCan from "./../icon/trash-can.png"

// return a form data as object
function formData(data) {
  const dataFrom = Object.fromEntries(new FormData(data));
  const {id} = dataFrom;

  if(id != ''){
    dataFrom.id = Number(id);
  }

  return dataFrom;
}

// input object data into form
function feedForm(dataObject, myForm) {
  Object.entries(dataObject).forEach(([key, value]) => {
    const inputElement = myForm.elements[key];
    if (inputElement) {
      // Handle different input types
      if (inputElement.type === 'checkbox' || inputElement.type === 'radio') {
        inputElement.checked = value;
      } else if (inputElement.tagName === 'SELECT') {
        inputElement.value = value;
      } else {
        inputElement.value = value;
      }
    }
  });
}

// quickly way to create element
function createElement(name, text, id, className, data) {
  const elem = document.createElement(name);

  if(text){
    elem.innerText = text;
  }

  if(id) {
    elem.id = id;
  }

  if(className) {
    elem.classList.add(className);
  }

  if(data) {
    for (const [key, value] of Object.entries(data)) {
      elem.dataset[key] = value;
    }
  }

  return elem;
}

// settings box
function settingElements(active) {
  const boxElement = createElement('div', null, null, 'settings');

  const editIcon = createElement('img').setManyAttributes({ src: pencil, alt: 'Edit task' });
  const deletIcon = createElement('img').setManyAttributes({ src: trashCan, alt: 'Delete task' });

  const spanEdit = createElement('span');
  const spanDelete = createElement('span');

  spanEdit.appendChild(editIcon);
  spanDelete.appendChild(deletIcon);

  ([spanEdit, spanDelete]).forEach(elem => boxElement.appendChild(elem));

  if(active.id == 42) boxElement.removeChild(spanDelete);

  spanEdit.addEventListener('click', () => {
    const editEvent = new CustomEvent(`edit${active.name}`, { detail: { ...active }});
    document.dispatchEvent(editEvent);
  });

  spanDelete.addEventListener('click', () => {
    const deleteEvent = new CustomEvent(`delete${active.name}`, { detail: { ...active }});
    document.dispatchEvent(deleteEvent);
  });

  return boxElement;
}

// custom method to set attributes quickly
HTMLElement.prototype.setManyAttributes = (function(attr){
  for (const [key, value] of Object.entries(attr)) {
    this.setAttribute(key, value);
  }
  return this;
});

export {
  formData,
  feedForm,
  createElement,
  settingElements,
}