
let tasks = [];

/* LOAD SAVED TASKS  */
window.onload = function () {
    let saved = localStorage.getItem("tasks");
    if (saved) {
        tasks = JSON.parse(saved);
        renderTasks();
    }
};

/* FORM SUBMISSION  */
document.getElementById("taskForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let course = document.getElementById("course").value;
    let title = document.getElementById("title").value;
    let deadline = document.getElementById("deadline").value;
    let priority = document.getElementById("priority").value;

    
    if (!course || !title || !deadline || !priority) {
        alert("All fields are required!");
        return;
    }

    let today = new Date().toISOString().split("T")[0];
    if (deadline < today) {
        alert("Deadline cannot be in the past!");
        return;
    }


    let task = {
        id: Date.now(),
        course,
        title,
        deadline,
        priority,
        completed: false
    };

    tasks.push(task);

    
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    this.reset();
});


function renderTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let now = new Date();

    tasks.forEach(task => {

        let card = document.createElement("div");

        let taskDate = new Date(task.deadline);
        let diff = (taskDate - now) / (1000 * 60 * 60);

        let extraClass = "";
        if (diff < 0) {
            extraClass = "overdue";
        } else if (diff <= 24) {
            extraClass = "warning";
        }

        card.className = `task-card ${task.priority} ${extraClass}`;

        if (task.completed) {
            card.classList.add("completed");
        }

        card.innerHTML = `
            <h5>${task.course}</h5>
            <p>${task.title}</p>
            <p>Deadline: ${task.deadline}</p>
            <p>Status: ${task.completed ? "Completed" : "Pending"}</p>

            <button class="btn btn-light btn-sm" onclick="toggleComplete(${task.id})">
                ✔
            </button>

            <button class="btn btn-dark btn-sm" onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        list.appendChild(card);
    });

    updateSummary();
}


function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}


function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}


function updateSummary() {

    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
    let pending = total - completed;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("summaryTotal").innerText = total;
    document.getElementById("summaryCompleted").innerText = completed;
    document.getElementById("summaryPending").innerText = pending;

    
    let percent = total === 0 ? 0 : (completed / total) * 100;

    let bar = document.getElementById("progressBar");
    bar.style.width = percent + "%";
    bar.innerText = Math.round(percent) + "%";
}

//dark and light mode

document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    let isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark);
});

window.addEventListener("load", function () {
    let darkMode = localStorage.getItem("darkMode");

    if (darkMode === "true") {
        document.body.classList.add("dark-mode");
    }
});