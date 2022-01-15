import { Octokit, App } from "https://cdn.skypack.dev/octokit";

window.addEventListener("DOMContentLoaded", setup);

function setup() {
    document.getElementById("AccessButton").onclick = accessClick;
    document.getElementById("FileLoad").onclick = fileLoadClick;

    let loadFileButton = document.getElementById("FileLoad");
    loadFileButton.disabled = true;

    let token = document.getElementById("PersonalAccessToken");
    token.onchange = updateToken;
    document.personalAccessToken = token.value;

    let repoName = document.getElementById("RepoName");
    repoName.onchange = updateRepoName;
    document.repoName = repoName.value;
}

function updateToken() {
    let token = document.getElementById("PersonalAccessToken");
    document.personalAccessToken = token.value;
    document.octokit = undefined;
    document.username = undefined;

    let loadFileButton = document.getElementById("FileLoad");
    loadFileButton.disabled = true;
}

function updateRepoName() {
    let repoName = document.getElementById("RepoName");
    document.repoName = repoName.value;

    let loadFileButton = document.getElementById("FileLoad");
    loadFileButton.disabled = true;
}

async function fileLoadClick() {
    let username = document.username;
    let repoName = document.repoName;

    // get the selected option
    let select = document.getElementById("FileSelect");
    let option = select.options[select.selectedIndex];

    // if the selected option has a .h
    if (option.text.includes(".h")) {
        let filename = option.value + ".h";
        let contents = await getFileContents(username, repoName, filename);
        document.getElementById("hContent").innerHTML = contents;
    }

    // if the selected option has a .cpp
    if (option.text.includes(".cpp")) {
        let filename = option.value + ".cpp";
        let contents = await getFileContents(username, repoName, filename);
        document.getElementById("cppContent").innerHTML = contents;
    }

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

    // enable the load button
    let loadFileButton = document.getElementById("FileLoad");
    loadFileButton.disabled = false;





    //const headers = files.map(x=>makeHeaderComment(username, x)).join("<br><br>");

    //document.getElementById("debugoutput").innerHTML = headers;
}

function arrayToString(a, ) {
}

function fileSelect(file) {
    return '<option value="' + file + '">' + file + "</option>";
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
