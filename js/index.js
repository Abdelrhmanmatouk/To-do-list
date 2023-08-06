// html elements
let root = document.querySelector(":root");
let addbtn = document.getElementById("newTask");
let modal = document.getElementById("modal");
let statusInput = document.getElementById("status");
let categoryInput = document.getElementById("category");
let titleInput = document.getElementById("title");
let descriptionInput = document.getElementById("description");
let addtaskbtn = document.getElementById("addBtn");
let updatebtn = document.getElementById("updateBtn");
let containers = {
  nextUp: document.querySelector("#todo"),
  inProgress: document.querySelector("#inProgress"),
  done: document.querySelector("#done"),
};
let modeBtn = document.getElementById("mode");
let searchInput = document.getElementById("searchInput");



// app variables

let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];

let UpdateTaskIndex = 0;

for (let i = 0; i < tasksArr.length; i++) {
  displaytask(i);
}
let titleRegex = /^\w{3,}(\s\w+)*$/;
let descriptionRegex = /^(?=.{5,100}$)\w{1,}(\s\w*)*$/;


// functions

function showmodal() {
  modal.classList.replace("d-none", "d-flex");
}
function hidemoadal() {
  modal.classList.replace("d-flex", "d-none");
  clear()
  addtaskbtn.classList.remove("d-none");
  updatebtn.classList.replace("d-block","d-none");
}
function addtask() {
 
  let task = {
    status: statusInput.value,
    category: categoryInput.value,
    title: titleInput.value,
    description: descriptionInput.value,
  };
  tasksArr.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
  displaytask(tasksArr.length - 1);
  hidemoadal();
  clear()
}
function displaytask(index) {
  var taskHTML = `
    <div class="task">
    <h3 class ="text-capitalize">${tasksArr[index].title}</h3>
    <p class="description text-capitalize">${tasksArr[index].description}</p>
    <h4 class="category ${tasksArr[index].category} text-capitalize">${tasksArr[index].category}</h4>
    <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
    <li><i class="bi bi-pencil-square" onclick="UpdateTaskDialog(${index})"></i></li>
    <li><i class="bi bi-trash-fill" onclick="deletetask(${index})"></i></li>
    <li><i class="bi bi-palette-fill" onclick="changeColor(event)"></i></li>
    </ul>
    </div>
    `;

  containers[tasksArr[index].status].querySelector(".tasks").innerHTML +=
    taskHTML;
}
function generateRandomColor() {
  let colorchar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  let color = "#";
  for (let i = 0; i < 6; i++) {
    let random = Math.trunc(Math.random() * colorchar.length);
    color += colorchar[random];
  }
  return color + "22";
}

function changeColor(event) {
  event.target.closest(".task").style.backgroundColor = generateRandomColor();
}

function deletetask(index) {
  emptycontaineers();
  tasksArr.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
  for (let i = 0; i < tasksArr.length; i++) {
    displaytask(i);
  }
}

function emptycontaineers() {
  for (x in containers) {
    containers[x].querySelector(".tasks").innerHTML = "";
  }
}

function UpdateTaskDialog(index) {
  showmodal();
  descriptionInput.value = tasksArr[index].description;
  titleInput.value = tasksArr[index].title;
  categoryInput.value = tasksArr[index].category;
  statusInput.value = tasksArr[index].status;
  UpdateTaskIndex = index;
  addtaskbtn.classList.add("d-none");
  updatebtn.classList.replace("d-none","d-block");
 
}

function UpdateTask() {
  tasksArr[UpdateTaskIndex].description = descriptionInput.value;
  tasksArr[UpdateTaskIndex].title = titleInput.value;
  tasksArr[UpdateTaskIndex].category = categoryInput.value;
  tasksArr[UpdateTaskIndex].status = statusInput.value;
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
  emptycontaineers();
  for (let i = 0; i < tasksArr.length; i++) {
    displaytask(i);
  }

  hidemoadal();
  addtaskbtn.classList.remove("d-none");
  updatebtn.classList.replace("d-block","d-none");
  clear()
}

function clear() {
  descriptionInput.value = "";
  titleInput.value = "";
  categoryInput.value = "education";
  statusInput.value = "nextUp";
}

function DarkMode() {
  if (modeBtn.dataset.mode == "night") {
    root.style.setProperty("--main-black", "#f1f1f1");
    root.style.setProperty("--sec-black", "#ddd");
    root.style.setProperty("--text-color", "#222");
    root.style.setProperty("--gray-color", "#333");
    root.style.setProperty("--mid-gray", "#f1f1f1");
    modeBtn.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
    modeBtn.dataset.mode = "light";
  } else if (modeBtn.dataset.mode == "light") {
    root.style.setProperty("--main-black", "#0d1117");
    root.style.setProperty("--sec-black", "#161b22");
    root.style.setProperty("--text-color", "#a5a6a7");
    root.style.setProperty("--gray-color", "#dadada");
    root.style.setProperty("--mid-gray", "#474a4e");
    modeBtn.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
    modeBtn.dataset.mode = "night";
  }
}

function searchTask() {
  
  emptycontaineers()
  let searchKey = searchInput.value;
  for (let i = 0; i < tasksArr.length; i++) {
    if (
      tasksArr[i].title.toLowerCase().includes(searchKey.toLowerCase()) ||
      tasksArr[i].category.toLowerCase().includes(searchKey.toLowerCase())
    ) {
     
        displaytask(i);
      
    }
  }
}



function validate(regex, element) {
  if (regex.test(element.value)) {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-block",
      "d-none"
    );
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-none",
      "d-block"
    );
  }

  return regex.test(element.value);
}


// event listner

addbtn.addEventListener("click", showmodal);

// hide modal using escape

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    hidemoadal();
  }
});
// hide modal using event target
modal.addEventListener("click", function (e) {
  if (e.target.id == "modal") {
    hidemoadal();
  }
});
addtaskbtn.addEventListener("click", function () {
  addtask();
});

updatebtn.addEventListener("click", function () {
  UpdateTask();
});

modeBtn.addEventListener("click", DarkMode);
searchInput.addEventListener("input", searchTask);

titleInput.addEventListener("input", function () {
  validate(titleRegex, titleInput);
});

descriptionInput.addEventListener("input", function () {
  validate(descriptionRegex, descriptionInput);
  remainingCounter = 100 - descriptionInput.value.split("").length;
  remainingCounterElement.innerHTML = remainingCounter;
});
