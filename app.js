// ---- Data -----------------------------------------------
let tasks = loadTasks();       // rebuild the array from localStorage
let nextId = 1;                // a counter so every task gets a unique id
let autoSort = loadSort();     // whether completed tasks sink to the bottom

// ---- DOM references --------------------------------------
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const sortToggle = document.getElementById("sort-toggle");

// ---- Ordering: how tasks appear on screen -----------------
function displayTasks() {
  if (!autoSort) {
    return tasks;
  }
  return tasks.filter((t) => !t.done).concat(tasks.filter((t) => t.done));
}

// ---- Drag & drop bookkeeping ------------------------------
let draggingId = null;

function onDragStart(event) {
  draggingId = Number(event.currentTarget.dataset.id);
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(draggingId));
  event.currentTarget.classList.add("dragging");
}

function onDragEnd(event) {
  draggingId = null;
  event.currentTarget.classList.remove("dragging");
}

function onDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  const li = event.currentTarget;
  const rect = li.getBoundingClientRect();
  const before = event.clientY < rect.top + rect.height / 2;
  li.classList.toggle("drop-before", before);
  li.classList.toggle("drop-after", !before);
}

function onDragLeave(event) {
  event.currentTarget.classList.remove("drop-before", "drop-after");
}

function onDrop(event) {
  event.preventDefault();
  const li = event.currentTarget;
  li.classList.remove("drop-before", "drop-after");
  const targetId = Number(li.dataset.id);
  if (draggingId === null || draggingId === targetId) {
    return;
  }
  const rect = li.getBoundingClientRect();
  const before = event.clientY < rect.top + rect.height / 2;
  moveTask(draggingId, targetId, before);
}

// Move one task next to another in the array -----------------
function moveTask(draggedId, targetId, before) {
  const from = tasks.findIndex((t) => t.id === draggedId);
  if (from < 0) {
    return;
  }
  const [moved] = tasks.splice(from, 1);
  let insertAt = tasks.findIndex((t) => t.id === targetId);
  if (!before) {
    insertAt++;
  }
  tasks.splice(Math.min(insertAt, tasks.length), 0, moved);
  saveTasks();
  render();
}

// ---- Render: draw every task from the array ---------------
function render() {
  list.innerHTML = "";   // clear the list first

  for (let task of displayTasks()) {
    const li = document.createElement("li");   // make a <li>
    li.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    const span = document.createElement("span");
    span.textContent = task.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    // tick a checkbox -> flip that task's done value
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    // click Delete -> remove that task
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    // completed tasks get a strikethrough
    if (task.done) {
      li.classList.add("done");
    }

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    // pinned (completed while sorting) items can't be dragged
    if (!(autoSort && task.done)) {
      li.draggable = true;
      li.addEventListener("dragstart", onDragStart);
      li.addEventListener("dragend", onDragEnd);
      li.addEventListener("dragover", onDragOver);
      li.addEventListener("dragleave", onDragLeave);
      li.addEventListener("drop", onDrop);
    }

    list.appendChild(li);
  }

  updateCounter();
}

// ---- Show how many are done --------------------------------
function updateCounter() {
  const done = tasks.filter(function (t) {
    return t.done;
  }).length;

  counter.textContent = done + "/" + tasks.length + " tasks done";
}

// ---- Toggle a task's done flag ---------------------------
function toggleTask(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  if (task) {
    task.done = !task.done;   // flip true <-> false
    saveTasks();
    render();
  }
}

// ---- Delete a task by its id ------------------------------
function deleteTask(id) {
  tasks = tasks.filter(function (t) {
    return t.id !== id;   // keep everything EXCEPT the matching id
  });
  saveTasks();
  render();
}

// ---- Save & load -------------------------------------------

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
}

function saveSort() {
  localStorage.setItem("autoSort", JSON.stringify(autoSort));
}

function loadSort() {
  const saved = localStorage.getItem("autoSort");
  return saved ? JSON.parse(saved) : true;
}

// ---- Add a task ------------------------------------------
function addTask() {
  const title = input.value.trim();   // read text, remove extra spaces

  if (title === "") {
    return;   // don't add empty tasks
  }

  const newTask = {                    // create a task object
    id: nextId,
    title: title,
    done: false,
  };

  nextId++;          // next task uses a new id
  tasks.push(newTask);   // add the object to the array
  input.value = "";      // clear the input box
  input.focus();         // put the cursor back in the box

  saveTasks();
  render();   // redraw the list
}

// ---- Wire up the button -----------------------------------
addBtn.addEventListener("click", addTask);

// ---- Press Enter in the input to add a task ----------------
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// ---- Toggle auto-sorting of completed tasks ----------------
sortToggle.addEventListener("change", function () {
  autoSort = sortToggle.checked;
  saveSort();
  render();
});

sortToggle.checked = autoSort;

render();   // draw the list on load