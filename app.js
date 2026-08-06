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

// ---- Drag & drop (floating ghost + live reorder) -------------
let dragState = null;   // { taskId, li, ghost, startY, startTop, moved }

function onHandleDown(event, taskId, li) {
  event.preventDefault();
  dragState = {
    taskId: taskId,
    li: li,
    ghost: null,
    startY: event.clientY,
    startTop: li.getBoundingClientRect().top,
    moved: false,
  };
  event.currentTarget.setPointerCapture(event.pointerId);
}

function onHandleMove(event) {
  if (!dragState) {
    return;
  }
  const dy = event.clientY - dragState.startY;
  if (!dragState.moved) {
    if (Math.abs(dy) < 6) {
      return;   // wait until the pointer actually travels a little
    }
    dragState.moved = true;
    dragState.li.classList.add("dragging");
    document.body.classList.add("dragging-task");
    dragState.ghost = makeGhost();
  }

  // keep the floating ghost inside the list, following the pointer
  const listRect = list.getBoundingClientRect();
  const maxTop = listRect.top + listRect.height - dragState.ghost.offsetHeight;
  const top = Math.min(Math.max(dragState.startTop + dy, listRect.top), maxTop);
  dragState.ghost.style.transform = "translateY(" + (top - dragState.startTop) + "px)";

  shuffleIntoPlace();
}

// A floating clone that follows the pointer while dragging.
function makeGhost() {
  const g = dragState.li.cloneNode(true);
  g.classList.remove("dragging");
  g.classList.add("ghost");
  const rect = dragState.li.getBoundingClientRect();
  g.style.width = rect.width + "px";
  g.style.left = rect.left + "px";
  g.style.top = rect.top + "px";
  document.body.appendChild(g);
  return g;
}

function onHandleUp() {
  if (!dragState) {
    return;
  }
  if (dragState.moved) {
    if (dragState.ghost) {
      dragState.ghost.remove();
    }
    dragState.li.classList.remove("dragging");
    document.body.classList.remove("dragging-task");
    saveTasks();
  } else {
    cancelDrag();
  }
  dragState = null;
}

function cancelDrag() {
  if (!dragState) {
    return;
  }
  if (dragState.ghost) {
    dragState.ghost.remove();
  }
  dragState.li.classList.remove("dragging");
  document.body.classList.remove("dragging-task");
  dragState = null;
}

// Move the held placeholder row so the visible rows reflow around it.
function shuffleIntoPlace() {
  const li = dragState.li;
  const others = Array.from(list.querySelectorAll("li")).filter(
    (row) => row !== li
  );

  // with auto-sort on, completed rows are pinned: only active rows compete
  let candidates = others;
  let clampRow = null;
  if (autoSort) {
    clampRow = others.find((row) => row.classList.contains("done")) || null;
    candidates = others.filter((row) => !row.classList.contains("done"));
  }

  const gRect = dragState.ghost.getBoundingClientRect();
  const mid = gRect.top + gRect.height / 2;

  for (const row of candidates) {
    const r = row.getBoundingClientRect();
    if (mid < r.top + r.height / 2) {
      if (li.nextElementSibling !== row) {
        list.insertBefore(li, row);
        syncOrderFromDom();
      }
      return;
    }
  }

  // pointer sits below every candidate row
  if (clampRow) {
    if (li.nextElementSibling !== clampRow) {
      list.insertBefore(li, clampRow);
      syncOrderFromDom();
    }
  } else if (li.nextElementSibling) {
    list.appendChild(li);
    syncOrderFromDom();
  }
}

// Keep the tasks array in sync with the current DOM order.
function syncOrderFromDom() {
  tasks = Array.from(list.querySelectorAll("li")).map(function (li) {
    return tasks.find((t) => t.id === Number(li.dataset.id));
  });
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
    deleteBtn.className = "delete";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "Delete task");

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
      handle.addEventListener("pointercancel", cancelDrag);
    } else {
      handle.classList.add("pinned");
    }

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(handle);

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