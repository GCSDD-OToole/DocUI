
window.addEventListener("DOMContentLoaded", setup);

import { ADT } from "./ADT.js";
import { authenticator } from "./Authenticator.js";

function setup() {
    // Load Settings from Local Storage
    let localStorage = window.localStorage;

    let savedRepo = localStorage.getItem('savedRepo');
    let savedDate = localStorage.getItem('savedDate');
    let savedName = localStorage.getItem('savedName');

    // Setup the Authentication Click
    document.getElementById("AccessButton").onclick = accessClick;

    // Setup the File Load Selector
    document.getElementById("FileSelect").onchange = fileChange;

    // Setup the Personal Access Token vars
    let token = document.getElementById("PersonalAccessToken");
    token.onchange = updateToken;
    authenticator.token = token.value;

    // Setup the RepoName vars
    let repoName = document.getElementById("RepoName");
    repoName.onchange = updateRepoName;
    repoName.value = savedRepo;
    authenticator.repo = repoName.value;

    // Setup the extension Selector
    document.getElementById("ExtSelect").onchange = extChange;
    document.getElementById("ExtSelect").disabled = true;

    // clear the input fields
    document.getElementById("DueDate").value = "--";
    document.getElementById("StudentInfo").value = "--";
    document.getElementById("Description").value = "--";

    document.getElementById("DueDateBtn").disabled = true;
    document.getElementById("DueDateBtn").onclick = fixDate;
    document.getElementById("InfoButton").disabled = true;
    document.getElementById("InfoButton").onclick = fixInfo;

    document.getElementById("SubmitBtn").onclick = submit;
}

function submit() {
    let extSelect = document.getElementById("ExtSelect");

    let author = document.getElementById("StudentInfo").value;
    let date = document.getElementById("DueDate").value;
    let description = document.getElementById("Description").value.split('\n');

    // get file base
    let filename = extSelect.options[extSelect.selectedIndex].value;

    let name = window.localStorage.getItem("savedName");
    let email = window.localStorage.getItem("savedEmail");

    pushToAllExt(baseFilename, authro, date, description, name, email);
}

async function pushToAllExt(baseFilename, author, date, description, name, email) {

    // .h file
    if (false) {
        let filename = baseFilename + ".h";
        let comment = makeHeaderComment(filename, author, date, description);
        pushFile(filename, content, email, name);
    }

    // .cpp file
    if (false) {
        let filename = baseFilename + ".cpp";
        let comment = makeHeaderComment(filename, author, date, description);
        pushFile(username, repo, filename, content, email, name);
    }
}

async function fixDate() {
    let dueDate = document.getElementById("DueDate");
    dueDate.value = getSavedDate();
    dueDate.style.backgroundColor = "gold";
}

function fixInfo() {
    let info = document.getElementById("StudentInfo");
    info.value = getSavedStudentInfo();
    info.style.backgroundColor = "gold";
}

function updateToken() {
    authenticator.token = document.getElementById("PersonalAccessToken").value;
}

function updateRepoName() {
    authenticator.repo = document.getElementById("RepoName");
}

async function fileChange() {
    // get the selected fileOption
    let fileSelect = document.getElementById("FileSelect");
    let fileOption = fileSelect.options[fileSelect.selectedIndex];

    let extSelect = document.getElementById("ExtSelect");
    extSelect.options.length = 0;

    let adt = document.adts[fileOption.value];

    console.log(fileOption.value, adt);
    // add .h extension to the select box
    if (adt.hasDotH()) {
        let option = document.createElement("option");
        option.text = ".h";
        option.value = fileOption.value + ".h";
        extSelect.add(option);
    }

    // add .cpp extension to the select box
    if (adt.hasDotCpp()) {
        let option = document.createElement("option");
        option.text = ".cpp";
        option.value = fileOption.value + ".cpp";
        extSelect.add(option);
    }

    extSelect.disabled = false;

    extChange();
}

function setPropertyBox(correctValue, displayId, readValue, btnId) {
    let displayElm = document.getElementById(displayId)

    if (!readValue) {
        document.getElementById(btnId).disabled = false;

        //displayElm.value = correctValue;
        displayElm.value = "--";
        displayElm.style.backgroundColor = "orange";
    } else if (readValue == savedName) {
        document.getElementById(btnId).disabled = true;

        displayElm.value = readValue;
        displayElm.style.backgroundColor = "green";
    } else {
        document.getElementById(btnId).disabled = false;

        displayElm.value = readValue;
        displayElm.style.backgroundColor = "red";
    }

}

function getSelected(id) {
    let element = document.getElementById(id);
    return element.options[element.selectedIndex];
}

async function extChange() {
    // TODO
    let username = document.username;
    // TODO
    let repoName = document.repoName;

    let fileOption = getSelected("FileSelect");
    let adt = document.adts[fileOption.value];

    let extOption = getSelected("ExtSelect");
    let filename = extOption.value;

    // TODO
    let contents = await getFileContents(username, repoName, filename);
    console.log(contents);

    //adt.updateContents();

    let comments = getFileHeader(contents).split('\n');

    let dueDate = readDate(comments);
    setPropertyBox(getSavedDate(), "DueDate", dueDate, "DueDateBtn");

    let author = readAuthor(comments);
    setPropertyBox(getSavedStudentInfo(), "StudentInfo", author, "InfoButton");

    let description = readDescription(comments);
    document.getElementById("Description").value = description;
}

function getSavedDate() {
    let savedDate = window.localStorage.getItem("savedDate");

    return formatDate(savedDate);
}

function getSavedStudentInfo() {
    let savedName = window.localStorage.getItem("savedName");
    let savedNumber = window.localStorage.getItem("savedNumber");

    return `${savedName} - ${savedNumber}`;
}

async function accessClick() {
    await authenticator.connect();
    await processFiles();
    fileChange();
}

async function processFiles() {
    document.adts = {};

    // download a list of files
    let files = await authenticator.getFileList();

    files = files.map(x => x.split('.'))
        .filter(x => x.length == 2)
        .filter(x => x[1] == "h" || x[1] == "cpp");

    for(let file of files) {
        document.adts[file[0]] = document.adts[file[0]] || new ADT();
        document.adts[file[0]].addDocument(...file);
    }

    // update the dropdown menu
    let selectBox = document.getElementById("FileSelect");
    selectBox.options.length = 0;

    for (const [key, value] of Object.entries(document.adts)) {
        let option = document.createElement("option");
        option.text = key + " ( " + value.extensions.join(", ") + " )";
        option.value = key;
        selectBox.add(option);
    }
}

function makeHeaderComment(filename, author, date, description) {
    let output = [];

    output.push(`/**`);
    output.push(` * @file    ${filename}`);
    output.push(` * @author  ${author}`);
    output.push(` * @date    ${date}`);
    output.push(` *`);
    output = output.concat(description.map(x=> " * " + x));
    output.push(` */`);

    console.log(description.map(x=> " * " + x));
    return output.join("\n");
}

function formatDate(date) {
    date = new Date(date);

    const month = date.toLocaleString('default', {month: 'long'});
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

