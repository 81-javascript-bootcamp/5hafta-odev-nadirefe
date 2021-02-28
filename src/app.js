import { getDataFromApi, addTaskToApi, deleteTaskfromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');

  }

  addTask(task) {
    const addTaskBtn = document.querySelector('.add-task-btn');
    addTaskBtn.disabled = true;
    addTaskBtn.innerText = "Adding...";
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        addTaskBtn.disabled = false;
        addTaskBtn.innerText = "Add Task";
      });
  }

  handleRemoveTask() {
    this.$tableTbody.addEventListener('click', (e) => {
      const isCloseSpan = e.target.tagName === "SPAN";
      if (isCloseSpan) {
        const removedTableRow = document.querySelector(`tr.${e.target.id}`)
        this.$tableTbody.removeChild(removedTableRow);
      }
      const apiId = (e.target.id).substring(5);
      deleteTaskfromApi(apiId);
    })
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.className = `close${task.id}`
    $newTaskEl.innerHTML = ` <th class="task-id" scope="row">${task.id}</th> <td>${task.title} </td>
    <td> <button " type="button" class="close" aria-label="Close">
    <span id="close${task.id}" aria-hidden="true">&times;</span>
  </button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });

  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
    this.handleRemoveTask();
  }
}

export default PomodoroApp;
