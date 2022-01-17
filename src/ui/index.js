import { Octokit, App } from "octokit";

window.addEventListener("DOMContentLoaded", setup);

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
    document.personalAccessToken = token.value;

    // Setup the RepoName vars
    let repoName = document.getElementById("RepoName");
    repoName.onchange = updateRepoName;
    repoName.value = savedRepo;
    document.repoName = repoName.value;

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
    let filename = extSelect.options[extSelect.selectedIndex].value;

    let author = document.getElementById("StudentInfo").value;
    let date = document.getElementById("DueDate").value;
    let description = document.getElementById("Description").value.split('\n');


    let comment = makeHeaderComment(filename, author, date, description);

    console.log(comment);
}

function pushFile() {
}

function fixDate() {
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
    let token = document.getElementById("PersonalAccessToken");
    document.personalAccessToken = token.value;
    document.octokit = undefined;
    document.username = undefined;
}

function updateRepoName() {
    let repoName = document.getElementById("RepoName");
    document.repoName = repoName.value;
}

async function fileChange() {
    // get the selected fileOption
    let fileSelect = document.getElementById("FileSelect");
    let fileOption = fileSelect.options[fileSelect.selectedIndex];

    let extSelect = document.getElementById("ExtSelect");
    extSelect.options.length = 0;

    // add .h extension to the select box
    if (fileOption.text.includes(".h")) {
        let option = document.createElement("option");
        option.text = ".h";
        option.value = fileOption.value + ".h";
        extSelect.add(option);
    }

    // add .cpp extension to the select box
    if (fileOption.text.includes(".cpp")) {
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

async function extChange() {
    let username = document.username;
    let repoName = document.repoName;

    let extSelect = document.getElementById("ExtSelect");
    let extOption = extSelect.options[extSelect.selectedIndex];
    let filename = extOption.value;

    let contents = await getFileContents(username, repoName, filename);
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

function readAuthor(comments) {
    for (let line of comments) {
        if (line.startsWith(` * @author`)) {
            return line.slice(10).trim();
        }
    }
}

function readDescription(comments) {
    let description = comments.slice(5, -1);
    return description.map(x => x.slice(3)).join('\n');
}

function readDate(comments) {
    for (let line of comments) {
        if (line.startsWith(` * @date`)) {
            return line.slice(8).trim();
        }
    }
}

function writeAuthro(comments) {
    return comments
}

function writeDescription(comments) {
    return comments
}

function writeDate(comments) {
    return comments
}

function getFileHeader(contents) {
    let re = /^\/\*\*[\s\S]*?\*\//;
    let comments = contents.match(re);

    return contents.search(re) == 0 ? comments[0] : "";
}

async function accessClick() {
    if (document.personalAccessToken == "") {
        document.getElementById("debugoutput").innerHTML = "Please enter a Personal Access Token";
        return;
    }

    document.octokit = document.octokit || new Octokit({
        auth: document.personalAccessToken
    });

    document.username = document.username || await getUsername();

    if (document.repoName == "") {
        document.getElementById("debugoutput").innerHTML = "Please enter a repo name";
        return;
    }

    await processFiles();

    fileChange();
}

async function processFiles() {
    // download a list of files
    const files = await getFileList(document.repoName, document.username);

    // match cpp and h files
    let fileTypes = {};

    for (let file of files) {
        if (file.endsWith(".cpp")) {
            let fileBase = file.slice(0, -4);
            fileTypes[fileBase] = fileTypes[fileBase] || [];

            fileTypes[fileBase].push(".cpp");
        } else if (file.endsWith(".h")) {
            let fileBase = file.slice(0, -2);
            fileTypes[fileBase] = fileTypes[fileBase] || [];

            fileTypes[fileBase].push(".h");
        }
    }

    // update the dropdown menu
    let selectBox = document.getElementById("FileSelect");
    selectBox.options.length = 0;

    for (const [key, value] of Object.entries(fileTypes)) {
        let option = document.createElement("option");
        option.text = key + " (" + value + ")";
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

async function getUsername() {
    const {
        data: {login, name},
    } = await document.octokit.rest.users.getAuthenticated();

    return login;
}

async function getName() {
    const {
        data: {login, name},
    } = await document.octokit.rest.users.getAuthenticated();

    return name;
}

async function getReposList(repo, username) {
    let { data } = await document.octokit.rest.getRepos({
        owner : username,
        repo : repo,
        path : "",
    });

    return data
        .map(x=>x.path)
        .filter(x=>x.endsWith(".cpp") || x.endsWith(".h"));
}

async function getFileList(repo, username) {
    let { data } = await document.octokit.rest.repos.getContent({
        owner : username,
        repo : repo,
        path : "",
    });

    return data
        .map(x=>x.path)
        .filter(x=>x.endsWith(".cpp") || x.endsWith(".h"));
}

async function getFilename(repo, path, username) {
    let {
        data: { filename }
    } = await document.octokit.rest.repos.getContent({
        owner : username,
        repo : repo,
        path : path,
    });

    return name;
}

async function getFileContents(username, repo, filename) {
    let {
        data: { name, content }
    } = await document.octokit.rest.repos.getContent({
        owner : username,
        repo : repo,
        path : filename,
    });

    content = content.replace(/\s+/g, '');
    content = atob(content);

    return content;
}
