# To-Do List App

A clean, browser-based task manager built with **plain HTML, CSS, and JavaScript** — no frameworks, no libraries, no build tools. Add, complete, and delete tasks, and your list stays saved even after you close and reopen the browser.

## Features

- ✅ **Add tasks** — type into the input and click **Add** or press **Enter**
- ☑️ **Complete tasks** — tick the checkbox to mark done (applies a strikethrough)
- 🗑️ **Delete tasks** — remove any task from the list
- 💾 **Persistent storage** — tasks survive a page refresh or full browser restart via `localStorage`
- 🔢 **Progress counter** — shows how many of your tasks are done (e.g. `3/5 tasks done`)
- 📱 **Responsive layout** — works cleanly on desktop and mobile

## How it works

The app follows the **state-and-render** pattern:

1. All of your tasks live in a single `tasks` **array** (the **state**) — the single source of truth.
2. A `render()` function rebuilds the list on screen from that array every time it changes.
3. Every action (add / toggle / delete) updates the array, then saves it and re-renders.

Because updates are always data-first, the UI can never fall out of sync with the data.

## Project structure

```
todo-app/
├── index.html   # page structure
├── style.css    # layout & styling
└── app.js       # logic: add, toggle, delete, render, localStorage
```

## Getting started

No installation needed — this is pure front-end. Just open the file:

```bash
open index.html
```

Or double-click `index.html` in your file browser.

> **Tip for testing persistence:** add a few tasks, refresh the page, and they'll still be there.

## Skills demonstrated

- JavaScript **arrays** and **objects**
- Full **CRUD** operations (Create, Read, Update, Delete)
- **State + render** pattern for keeping data and UI in sync
- **DOM manipulation** (`createElement`, `appendChild`, `classList`)
- **Event handling** (`click`, `change`, `keydown` listeners)
- **Persistence** with `localStorage` (`JSON.stringify` / `JSON.parse`)
- Responsive **CSS** layout with **Flexbox**

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

## License

This project is open source and available under the MIT License.