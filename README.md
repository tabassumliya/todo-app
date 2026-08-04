<p align="center">
  <h1 align="center">✅ To-Do List App</h1>
  <p align="center">A clean, browser-based task manager built with vanilla JavaScript — add, complete, and delete tasks that stay saved across browser restarts.</p>
</p>

<p align="center">
  <a href="https://github.com/tabassumliya/todo-app/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/tabassumliya/todo-app?style=for-the-badge" alt="License">
  </a>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/tabassumliya/todo-app?style=for-the-badge" alt="Stars">
  <img src="https://img.shields.io/github/forks/tabassumliya/todo-app?style=for-the-badge" alt="Forks">
  <img src="https://img.shields.io/github/issues/tabassumliya/todo-app?style=for-the-badge" alt="Issues">
  <img src="https://img.shields.io/github/last-commit/tabassumliya/todo-app?style=for-the-badge" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/tabassumliya/todo-app?style=for-the-badge" alt="Repo Size">
</p>

---

## 📊 Project Stats

<p align="center">
  <img src="https://img.shields.io/badge/Files-3-blue?style=for-the-badge&logo=file-code&logoColor=white" alt="Files">
  <img src="https://img.shields.io/badge/Features-5-orange?style=for-the-badge&logo=list&logoColor=white" alt="Features">
  <img src="https://img.shields.io/badge/Zero_External_Dependencies-667eea?style=for-the-badge&logo=leaf&logoColor=white" alt="No Dependencies">
  <img src="https://img.shields.io/badge/Lines_of_Code-190+-purple?style=for-the-badge&logo=code&logoColor=white" alt="Lines of Code">
</p>

## 🚀 Live Demo

Try the app right now — no installation needed:

<p align="center">
  <a href="https://tabassumliya.github.io/todo-app/">
    <img src="https://img.shields.io/badge/🚀_Open_Live_Demo-28a745?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live Demo">
  </a>
</p>

## Features in Detail

### Task Management
- ✅ **Add tasks** — type into the input and click **Add** or press **Enter**
- ☑️ **Complete tasks** — tick the checkbox to mark a task done (applies a strikethrough)
- 🗑️ **Delete tasks** — remove any task from the list with a single click
- 🔢 **Progress counter** — a live `3/5 tasks done` readout of your progress

### Data Persistence
- 💾 **localStorage storage** — every change is saved instantly
- ♻️ **Survives restarts** — your list is restored on page load after a refresh or full browser relaunch
- 📱 **Responsive layout** — clean Flexbox design that adapts to desktop and mobile

## Quick Start

<p align="center">
  <a href="https://github.com/tabassumliya/todo-app">
    <img src="https://img.shields.io/badge/📥_Clone-667eea?style=for-the-badge&logo=github&logoColor=white" alt="Clone">
  </a>
  <a href="https://github.com/tabassumliya/todo-app/archive/refs/heads/main.zip">
    <img src="https://img.shields.io/badge/⬇️_Download-764ba2?style=for-the-badge&logo=zip&logoColor=white" alt="Download">
  </a>
  <a href="https://github.com/tabassumliya/todo-app#-getting-started">
    <img src="https://img.shields.io/badge/📖_Docs-28a745?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Docs">
  </a>
</p>

```bash
# Clone the repository
git clone https://github.com/tabassumliya/todo-app.git

# Navigate to project directory
cd todo-app

# Open in browser
open index.html
```

1. Open `index.html` in any modern web browser
2. No server or installation required — runs entirely client-side
3. Add a task, tick it off, then **refresh the page** to see it persist

## Data Schema

Each task is stored as a JavaScript object with the following fields:

- **`id`** — a unique number used to target the task for complete/delete actions
- **`title`** — the text the user typed
- **`done`** — a boolean (`true` / `false`) flag for completion

The array of task objects is serialized with `JSON.stringify` and persisted to `localStorage` under the key `tasks`, then restored with `JSON.parse` on load.

## Development

This project was built with vanilla HTML, CSS, and JavaScript. No build tools, frameworks, or external libraries required.

### Key Technologies:
- HTML5 semantic elements
- CSS3 Flexbox layout
- Vanilla JavaScript ES6+ features
- DOM manipulation (`createElement`, `appendChild`, `classList`)
- Event handling (`click`, `change`, `keydown` listeners)
- LocalStorage API for data persistence
- State-and-render pattern (single source of truth + redraw)

## 🤝 Contributing

Contributions are welcome! Feel free to:

<p align="center">
  <a href="https://github.com/tabassumliya/todo-app/issues">
    <img src="https://img.shields.io/badge/🐛_Report_Bug-red?style=for-the-badge&logo=github&logoColor=white" alt="Report Bug">
  </a>
  <a href="https://github.com/tabassumliya/todo-app/pulls">
    <img src="https://img.shields.io/badge/💡_Request_Feature-yellow?style=for-the-badge&logo=github&logoColor=white" alt="Request Feature">
  </a>
  <a href="https://github.com/tabassumliya/todo-app/pulls">
    <img src="https://img.shields.io/badge/🔄_Submit_PR-blue?style=for-the-badge&logo=github&logoColor=white" alt="Submit PR">
  </a>
</p>

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<p align="center">
  <img src="https://img.shields.io/badge/Made_With_❤️_By-Tabassum_Liya-667eea?style=for-the-badge&logo=github&logoColor=white" alt="Made with Love">
</p>

<p align="center">
  <a href="https://github.com/tabassumliya/todo-app">
    <img src="https://img.shields.io/badge/⭐_Star_This_Project-FFE810?style=for-the-badge&logo=github&logoColor=black" alt="Star">
  </a>
  <a href="https://github.com/tabassumliya/todo-app/fork">
    <img src="https://img.shields.io/badge/🍴_Fork-667eea?style=for-the-badge&logo=github&logoColor=white" alt="Fork">
  </a>
  <a href="https://github.com/tabassumliya/todo-app/watchers">
    <img src="https://img.shields.io/badge/👁️_Watch-764ba2?style=for-the-badge&logo=github&logoColor=white" alt="Watch">
  </a>
</p>

---

<p align="center">
  <i>Built with ❤️ and aimed at future software engineers</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🙏_Thank_You_For_Visiting-28a745?style=for-the-badge&logo=heart&logoColor=white" alt="Thank You">
</p>