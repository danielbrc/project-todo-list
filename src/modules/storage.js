export function setStorage(data) {
  const stringified = JSON.stringify(Array.from(data.entries()), replacer);
  localStorage.setItem('todo', stringified);
}

export function getStorage(callback) {
  const storedText = localStorage.getItem('todo');
  const stored = new Map(JSON.parse(storedText, retriever));

  callback(stored);
}

function replacer(key, value) {
  if (value instanceof Map) {
    return Array.from(value.entries());
  } else {
    return value;
  }
}

function retriever(key, value) {
  if (key == 'todos') {
    return value.length == 0 ? new Map() : new Map(value);
  }
  return value;
}
