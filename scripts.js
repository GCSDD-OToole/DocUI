import { Octokit, App } from "https://cdn.skypack.dev/octokit";

window.addEventListener("DOMContentLoaded", setup);

function setup() {
    let button = document.getElementById("TryItButton");
    button.onclick = buttonClick;
}

async function buttonClick() {
    let personalAccessToken = document.getElementById("PersonalAccessToken").value;

    if (personalAccessToken == "") {
        document.getElementById("debugoutput").innerHTML = "Please enter a Personal Access Token";
        return;
    }

    document.octokit = new Octokit({
        auth: personalAccessToken
    });

    let RepoName = document.getElementById("RepoName").value;

    const username = await getUsername();

    if (RepoName == "") {
        document.getElementById("debugoutput").innerHTML = "Please enter a repo name";
        return;
    }

    const files = await getFileList(RepoName, username);
    const headers = files.map(x=>makeHeaderComment(username, x)).join("<br><br>");

    document.getElementById("debugoutput").innerHTML = headers;
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
