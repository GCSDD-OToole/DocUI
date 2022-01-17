window.addEventListener("DOMContentLoaded", setup);

function setup() {
    let localStorage = window.localStorage;

    let savedRepo = localStorage.getItem('savedRepo');
    let savedName = localStorage.getItem('savedName');
    let savedEmail = localStorage.getItem('savedEmail');
    let savedNumber = localStorage.getItem('savedNumber');
    let savedDate = localStorage.getItem('savedDate');

    document.getElementById("RepoName").value = savedRepo;
    document.getElementById("StudentName").value = savedName;
    document.getElementById("CommitEmail").value = savedEmail;
    document.getElementById("StudentNumber").value = savedNumber;
    document.getElementById("DueDate").value = savedDate;

    document.getElementById("SaveRepo").onclick = saveRepo;
    document.getElementById("SaveName").onclick = saveName;
    document.getElementById("SaveEmail").onclick = saveEmail;
    document.getElementById("SaveNumber").onclick = saveNumber;
    document.getElementById("SaveDate").onclick = saveDate;
}

function saveDate() {
    let value = document.getElementById("DueDate").value;
    window.localStorage.setItem('savedDate', value);
}

function saveName() {
    let value = document.getElementById("StudentName").value;
    window.localStorage.setItem('savedName', value);
}

function saveEmail() {
    let value = document.getElementById("CommitEmail").value;
    window.localStorage.setItem('savedEmail', value);
}

function saveNumber() {
    let value = document.getElementById("StudentNumber").value;
    window.localStorage.setItem('savedNumber', value);
}

function saveRepo() {
    let value = document.getElementById("RepoName").value;
    window.localStorage.setItem('savedRepo', value);
}
