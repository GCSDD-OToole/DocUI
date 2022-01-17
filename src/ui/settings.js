window.addEventListener("DOMContentLoaded", setup);

function setup() {
    let localStorage = window.localStorage;

    let savedRepo = localStorage.getItem('savedRepo');
    let savedName = localStorage.getItem('savedName');
    let savedNumber = localStorage.getItem('savedNumber');
    let savedDate = localStorage.getItem('savedDate');

    document.getElementById("RepoName").value = savedRepo;
    document.getElementById("StudentName").value = savedName;
    document.getElementById("StudentNumber").value = savedNumber;
    document.getElementById("DueDate").value = savedDate;

    document.getElementById("SaveRepo").onclick = saveRepo;
    document.getElementById("SaveName").onclick = saveName;
    document.getElementById("SaveNumber").onclick = saveNumber;
    document.getElementById("SaveDate").onclick = saveDate;
}

function saveDate() {
    let localStorage = window.localStorage;

    let value = document.getElementById("DueDate").value;
    console.log(value);
    localStorage.setItem('savedDate', value);
}

function saveName() {
    let localStorage = window.localStorage;

    let value = document.getElementById("StudentName").value;
    console.log(value);
    localStorage.setItem('savedName', value);
}

function saveNumber() {
    let localStorage = window.localStorage;

    let value = document.getElementById("StudentNumber").value;
    console.log(value);
    localStorage.setItem('savedNumber', value);
}

function saveRepo() {
    let localStorage = window.localStorage;

    let value = document.getElementById("RepoName").value;
    console.log(value);
    localStorage.setItem('savedRepo', value);
}
