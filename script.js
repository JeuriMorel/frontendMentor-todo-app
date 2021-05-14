const toggleBtn = document.querySelector(".header_nav-theme");
const body = document.querySelector("#body");
const form = document.querySelector(".add-todo");
const input = document.querySelector("#todo-input");
const todosDiv = document.querySelector(".todos");
const remainingInfo = document.querySelector(".todos-info-remaining");
const container = document.querySelector(".container");
const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));

toggleBtn.onclick = () => {
  body.classList.toggle("dark");
};

const dragItem = (e) => {
  e.target.classList.add('dragging')
};
const dragEnd = (e) => {
  e.target.classList.remove('dragging')
};

const allowDrop = (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(e.clientY);
  console.log(afterElement)
  console.log(afterElement)
  const draggable = document.querySelector('.dragging')
  if (afterElement == null) {
    todosDiv.insertBefore(draggable, todosDiv.lastChild.previousSibling);
  } else {
    todosDiv.insertBefore(draggable, afterElement)
  }
};

const getDragAfterElement = (y) => {
  const draggableElements = [...todosDiv.querySelectorAll('.todo:not(.dragging)')]

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

const createTodo = (todo) => {
  let newTodo = document.createElement("div");
  newTodo.className = "todo";
  newTodo.draggable = "true";
  newTodo.ondragstart = dragItem;
  newTodo.ondragend = dragEnd;
  newTodo.innerHTML = `
          <button class="todo-check">
            <img src="./images/icon-check.svg" alt="check">
          </button>
          <p class="todo-todo">${todo}</p>
          <img src="./images/icon-cross.svg" alt="cross-out" class="todo-cross">`;
  todosDiv.insertBefore(newTodo, todosDiv.lastChild.previousSibling);
};

const updateRemainingInfo = () => {
  let remainingCount = Array.from(todosDiv.children).filter(
    (child) =>
      child.classList.contains("todo") && !child.classList.contains("checked")
  ).length;

  if (!remainingCount) {
    remainingInfo.innerText = `No items left`;
    return;
  }

  remainingInfo.innerText =
    remainingCount === 1
      ? `${remainingCount} item left`
      : `${remainingCount} items left`;
};

const clearCompleted = () => {
  let checkedChildren = Array.from(todosDiv.children).filter((child) =>
    child.classList.contains("checked")
  );
  checkedChildren.forEach((child) => child.remove());
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!input.value) {
    return;
  }
  createTodo(input.value);
  form.reset();
  updateRemainingInfo();
};

const handleFilter = (clicked) => {
  if (clicked.classList.contains("selected")) {
    console.log("already selected");
    return;
  }

  filterBtns.forEach((btn) => {
    if (btn !== clicked) {
      btn.classList.remove("selected");
      return;
    }
    btn.classList.add("selected");
  });

  let todos = Array.from(todosDiv.children);
  let active = todos.filter(
    (child) =>
      child.classList.contains("todo") && !child.classList.contains("checked")
  );
  let completed = todos.filter(
    (child) =>
      child.classList.contains("todo") && child.classList.contains("checked")
  );

  if (clicked.classList.contains("filter-active")) {
    completed.forEach((todo) => (todo.style.display = "none"));
    active.forEach((todo) => (todo.style.display = "flex"));
    return;
  }

  if (clicked.classList.contains("filter-completed")) {
    active.forEach((todo) => (todo.style.display = "none"));
    completed.forEach((todo) => (todo.style.display = "flex"));
    return;
  }

  active.forEach((todo) => (todo.style.display = "flex"));
  completed.forEach((todo) => (todo.style.display = "flex"));
};

const handleClick = (e) => {
  let clicked = e.target;
  let todo = clicked.parentElement;

  if (clicked.classList.contains("todo-cross")) {
    todo.remove();
    updateRemainingInfo();
    return;
  }
  if (clicked.classList.contains("todo-check")) {
    todo.classList.toggle("checked");
    updateRemainingInfo();
    return;
  }
  if (clicked.classList.contains("todos-info-clear")) {
    clearCompleted();
  }
  if (clicked.classList.contains("filter-btn")) {
    handleFilter(clicked);
  }
};

form.addEventListener("submit", handleSubmit);
container.addEventListener("click", handleClick);
