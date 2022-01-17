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

async function extChange() {
    let username = document.username;
    let repoName = document.repoName;

    let extSelect = document.getElementById("ExtSelect");
    let extOption = extSelect.options[extSelect.selectedIndex];
    let filename = extOption.value;

    let contents = await getFileContents(username, repoName, filename);
    let comments = getFileHeader(contents).split('\n');

    document.getElementById("StudentInfo").value = readAuthor(comments);

    document.getElementById("DueDate").value = readDate(comments);

    document.getElementById("Description").value =  readDescription(comments);
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

function makeHeaderComment(username, filename) {
    const date = getToday();
    let output = [];

    output.push(`/**`);
    output.push(` * @file ${filename}`);
    output.push(` * @author ${username}`);
    output.push(` * @date ${date}`);
    output.push(` *`);
    output.push(` * This is a basic description of the program.`);
    output.push(` */`);

    return output.join("<br>");
}

function getToday() {
    const today = new Date();

    const month = today.toLocaleString('default', {month: 'long'});
    const day = today.getDate();
    const year = today.getFullYear();

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
