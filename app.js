// ---- Data -----------------------------------------------
let tasks = loadTasks();   // rebuild the array from localStorage
let nextId = 1;            // a counter so every task gets a unique id

// ---- DOM references --------------------------------------
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");

// ---- Render: draw every task from the array ---------------
function render() {
  list.innerHTML = "";   // clear the list first

  for (let task of tasks) {
    const li = document.createElement("li");   // make a <li>

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

render();   // draw the list on load