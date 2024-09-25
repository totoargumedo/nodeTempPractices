const getBtn = document.querySelector("#get-tasks");
const createEditBtn = document.querySelector("#create-tasks");
const input = document.querySelector("#task-name");
const tasksContainer = document.querySelector("#tasks-container");
let TASK_TO_EDIT = null;
const BASE_URL = window.origin;

getBtn.addEventListener("click", async (e) => {
  await getTasks();
});

createEditBtn.addEventListener("click", (e) => {
  const creating = !TASK_TO_EDIT;
  const path = creating ? "/api/tasks" : `/api/tasks/${TASK_TO_EDIT._id}`;
  const method = creating ? "POST" : "PUT";
  fetch(path, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input.value }),
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJSON) => {
      input.value = "";
      input.focus();
      createEditBtn.innerText = "Crear tarea";
      TASK_TO_EDIT = null;
      getTasks();
    })
    .catch((error) => console.log("Error post tareas"));
});

function getTasks() {
  tasksContainer.innerHTML = "";
  fetch("/api/tasks")
    .then((response) => {
      return response.json();
    })
    .then((responseJSON) => {
      const tasks = responseJSON.data;
      for (const task of tasks) {
        const container = document.createElement("div");
        const taskText = document.createElement("p");
        taskText.innerText = task.name;
        const taskDeleteBtn = document.createElement("button");
        taskDeleteBtn.innerText = "Borrar";
        taskDeleteBtn.setAttribute("id", task._id);
        taskDeleteBtn.addEventListener("click", async (e) => {
          await deleteTasks(e, taskDeleteBtn);
        });
        taskText.addEventListener("click", (e) => {
          input.value = task.name;
          createEditBtn.innerText = "Editar tarea";
          TASK_TO_EDIT = task;
        });
        container.appendChild(taskText);
        container.appendChild(taskDeleteBtn);
        tasksContainer.appendChild(container);
      }
    })
    .catch((error) => console.log("Error get tareas" + error));
}
function deleteTasks(event, button) {
  const tid = event.target.id;
  button.innerText = "...";
  fetch(`/api/tasks/${tid}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input.value }),
  })
    .then((response) => {
      button.parentElement.remove();
    })
    .catch((error) => console.log("Error post tareas"));
}

getTasks();
