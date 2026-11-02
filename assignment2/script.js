// ===== Question 1: Fortune generator =====
const fortunes = [
  "True wisdom comes not from knowledge, but from understanding.",
  "A small step today beats a perfect plan tomorrow.",
  "The bug you cannot find is hiding in the line you trust most.",
  "Patience is the compiler of success.",
  "Someone will soon thank you for something you've already forgotten.",
  "Your next idea will arrive while you are doing something else.",
  "Fortune favours those who keep their code commented.",
  "A closed door today is a cleaner interface tomorrow.",
  "Do the hard thing first; the rest will feel like rest.",
  "Great things are built one tiny commit at a time."
];

// Four themes: font colour, box background, border colour, font size, font family.
// Colours are dark-on-light or light-on-dark and differ from the cream page background.
const themes = [
  {color:"#1f4d5c", bg:"#ffffff", border:"#1f4d5c", size:"1.2rem",  font:"Georgia, serif"},
  {color:"#ffffff", bg:"#7a1f3d", border:"#3d0f1f", size:"1.3rem",  font:"'Trebuchet MS', sans-serif"},
  {color:"#e8f5e9", bg:"#1b5e20", border:"#0b3010", size:"1.15rem", font:"'Courier New', monospace"},
  {color:"#fff8e1", bg:"#263238", border:"#ffb300", size:"1.25rem", font:"Verdana, sans-serif"}
];

const box = document.getElementById("fortuneBox");
// Pick a random fortune on page load
box.textContent = fortunes[Math.floor(Math.random() * fortunes.length)];

function applyTheme(t) {
  box.style.color = t.color;
  box.style.backgroundColor = t.bg;
  box.style.borderColor = t.border;
  box.style.fontSize = t.size;
  box.style.fontFamily = t.font;
}
themes.forEach((t, i) => {
  const b = document.createElement("button");
  b.style.background = t.bg;
  b.title = "Theme " + (i + 1);
  b.setAttribute("aria-label", "Theme " + (i + 1));
  b.addEventListener("click", () => applyTheme(t));
  document.getElementById("swatches").appendChild(b);
});

// ===== Question 2: Stopwatch =====
const STEP = 3, LIMIT = 30;
let seconds = 0, timerId = null;
const timeEl = document.getElementById("time");

function render() {
  timeEl.textContent = seconds;
  timeEl.classList.toggle("done", seconds >= LIMIT);
}
function stopTimer() { clearInterval(timerId); timerId = null; }

document.getElementById("startBtn").addEventListener("click", () => {
  if (timerId !== null || seconds >= LIMIT) return; // already running or finished
  // Resumes from the last recorded value because `seconds` is kept
  timerId = setInterval(() => {
    seconds += STEP;
    render();
    if (seconds >= LIMIT) stopTimer(); // auto-stop at 30
  }, 3000);
});
document.getElementById("stopBtn").addEventListener("click", stopTimer);
document.getElementById("resetBtn").addEventListener("click", () => {
  stopTimer(); seconds = 0; render();
});
render();

// ===== Question 3: To-do list with localStorage =====
const KEY = "cse391-tasks";
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
let tasks = [];

try { tasks = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { tasks = []; }

function save() { localStorage.setItem(KEY, JSON.stringify(tasks)); }

function renderTasks() {
  list.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = task.done;
    cb.setAttribute("aria-label", "Mark completed");
    cb.addEventListener("change", () => { task.done = cb.checked; save(); renderTasks(); });

    const text = document.createElement("span");
    text.textContent = task.text; // textContent avoids HTML injection

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.addEventListener("click", () => { tasks.splice(i, 1); save(); renderTasks(); });

    li.append(cb, text, del);
    list.appendChild(li);
  });
  emptyMsg.hidden = tasks.length > 0;
}

function addTask() {
  const value = input.value.trim();
  if (!value) return;
  tasks.push({text: value, done: false});
  input.value = "";
  save(); renderTasks();
}
document.getElementById("addBtn").addEventListener("click", addTask);
input.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });
renderTasks();

// ===== Navigation: show one section at a time, like switching windows =====
const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll("#nav a");

function showView() {
  const id = location.hash.slice(1) || "fortune"; // Fortune is the home view
  const target = document.getElementById(id) ? id : "fortune";
  views.forEach(v => v.classList.toggle("active", v.id === target));
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + target));
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", showView);
showView();
