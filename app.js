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

// ---- Drag & drop (pointer events) --------------------------
const indicator = document.createElement("div");
indicator.id = "drop-indicator";

let dragState = null;   // { taskId, li, startY, moved }
let dropIndex = -1;

function onHandleDown(event, taskId, li) {
  event.preventDefault();
  dragState = {
    taskId: taskId,
    li: li,
    startY: event.clientY,
    moved: false,
  };
  event.currentTarget.setPointerCapture(event.pointerId);
}

function onHandleMove(event) {
  if (!dragState) {
    return;
  }
  const dy = event.clientY - dragState.startY;
  if (!dragState.moved && Math.abs(dy) < 6) {
    return;   // wait until the pointer actually travels a little
  }
  if (!dragState.moved) {
    dragState.moved = true;
    dragState.li.classList.add("dragging");
    document.body.classList.add("dragging-task");
    indicator.style.display = "block";
  }
  dropIndex = getDropIndex(event.clientY);
  positionIndicator(dropIndex);
}

function onHandleUp() {
  if (!dragState) {
    return;
  }
  if (dragState.moved) {
    applyDrop(dragState.taskId, dropIndex);
  }
  endDrag();
}

function endDrag() {
  if (dragState && dragState.li) {
    dragState.li.classList.remove("dragging");
  }
  document.body.classList.remove("dragging-task");
  indicator.style.display = "none";
  dragState = null;
  dropIndex = -1;
}

// Which slot (0..n) does the pointer sit over? Dragged item excluded.
function getDropIndex(clientY) {
  const reduced = Array.from(list.querySelectorAll("li")).filter(
    (li) => li !== dragState.li
  );
  for (let i = 0; i < reduced.length; i++) {
    const rect = reduced[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      return i;
    }
  }
  return reduced.length;
}

// Slide the blue line to the boundary at the given slot.
function positionIndicator(index) {
  const reduced = Array.from(list.querySelectorAll("li")).filter(
    (li) => li !== dragState.li
  );
  const listRect = list.getBoundingClientRect();
  let top;
  if (reduced.length === 0) {
    top = 0;
  } else if (index <= 0) {
    top = reduced[0].getBoundingClientRect().top - listRect.top;
  } else if (index >= reduced.length) {
    top = reduced[reduced.length - 1].getBoundingClientRect().bottom - listRect.top;
  } else {
    top = reduced[index].getBoundingClientRect().top - listRect.top;
  }
  indicator.style.top = top + "px";
}

// Commit the new position into the array and persist it.
function applyDrop(taskId, index) {
  const from = tasks.findIndex((t) => t.id === taskId);
  if (from < 0) {
    return;
  }
  const [moved] = tasks.splice(from, 1);

  if (autoSort) {
    const active = tasks.filter((t) => !t.done);
    const done = tasks.filter((t) => t.done);
    const insertAt = Math.min(Math.max(index, 0), active.length);
    active.splice(insertAt, 0, moved);
    tasks = active.concat(done);
  } else {
    tasks.splice(Math.min(Math.max(index, 0), tasks.length), 0, moved);
  }

  saveTasks();
  render();
}

// ---- Render: draw every task from the array ---------------
function render() {
  list.innerHTML = "";   // clear the list first

  for (let task of displayTasks()) {
    const li = document.createElement("li");   // make a <li>
    li.dataset.id = task.id;

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.textContent = "⠿";

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

    // pinned (completed while sorting) items can't be dragged
    const canDrag = !(autoSort && task.done);
    if (canDrag) {
      handle.addEventListener("pointerdown", function (event) {
        onHandleDown(event, task.id, li);
      });
      handle.addEventListener("pointermove", onHandleMove);
      handle.addEventListener("pointerup", onHandleUp);
      handle.addEventListener("pointercancel", endDrag);
    } else {
      handle.classList.add("pinned");
    }

    li.appendChild(handle);
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  }

  list.appendChild(indicator);
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