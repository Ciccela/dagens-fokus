const taskInput = document.getElementById("taskInput");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const savedTask = document.getElementById("savedTask");
const doneBtn = document.getElementById("doneBtn");
const clearBtn = document.getElementById("clearBtn");

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const presetButtons = document.querySelectorAll(".preset");

const ringProgress = document.getElementById("ringProgress");

// Ring setup
const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
ringProgress.style.strokeDasharray = `${CIRCUMFERENCE}`;
ringProgress.style.strokeDashoffset = "0";

let totalSeconds = 25 * 60;
let initialSeconds = totalSeconds;
let timerInterval = null;

// ---------- Local storage: task ----------
function loadTask() {
  const task = localStorage.getItem("focusTask");
  const done = localStorage.getItem("focusTaskDone") === "true";

  if (task) {
    savedTask.textContent = task;
    if (done) savedTask.classList.add("done");
  }
}

function saveTask() {
  const value = taskInput.value.trim();
  if (!value) return;

  localStorage.setItem("focusTask", value);
  localStorage.setItem("focusTaskDone", "false");

  savedTask.textContent = value;
  savedTask.classList.remove("done");
  taskInput.value = "";
}

function markDone() {
  if (!localStorage.getItem("focusTask")) return;
  localStorage.setItem("focusTaskDone", "true");
  savedTask.classList.add("done");
}

function clearTask() {
  localStorage.removeItem("focusTask");
  localStorage.removeItem("focusTaskDone");
  savedTask.textContent = "Ingen uppgift sparad ännu.";
  savedTask.classList.remove("done");
}

// ---------- Timer ----------
function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function updateRing() {
  const progress = totalSeconds / initialSeconds; // 1 -> 0
  const offset = CIRCUMFERENCE * (1 - progress);
  ringProgress.style.strokeDashoffset = offset.toString();
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(totalSeconds);
  updateRing();
}

function setRunningState(isRunning) {
  timerDisplay.classList.toggle("running", isRunning);
}

function startTimer() {
  if (timerInterval) return;
  if (totalSeconds <= 0) return;

  setRunningState(true);

  timerInterval = setInterval(() => {
    totalSeconds--;
    updateDisplay();

    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      setRunningState(false);
      alert("Snyggt jobbat! Fokuspasset är klart 🎉");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  setRunningState(false);
}

function resetTimer() {
  pauseTimer();
  totalSeconds = initialSeconds;
  updateDisplay();
}

function setPreset(minutes) {
  pauseTimer();
  totalSeconds = minutes * 60;
  initialSeconds = totalSeconds;
  updateDisplay();
}

// ---------- Events ----------
saveTaskBtn.addEventListener("click", saveTask);
doneBtn.addEventListener("click", markDone);
clearBtn.addEventListener("click", clearTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveTask();
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const minutes = Number(btn.dataset.minutes);
    setPreset(minutes);
  });
});

// ---------- Init ----------
loadTask();
updateDisplay();