import "./styles.css";
import { ProjectController, TodoController } from "./modules/controller";
import AppTodo from "./modules/view"
import Todo from "./modules/todo";

const projectController = new ProjectController();
const todoController = new TodoController();

const container = document.querySelector(".container");
const app = new AppTodo(container, projectController, todoController);

app.init();

// TODOS

// editar deve salvar o formulario
// add inputs de id (number) e done (checkbox)
// debug da data em extenso
