import { Octokit, App } from "octokit";

class Authenticator {
    constructor() {
        this._connected = false;
    }

    set token(value) {
        this._token = value;
        this._username = undefined;
        this._octokit = undefined;
    }

    set repo(value) {
        this._repo = value;
    }

    get ready() {
        return this._connected;
    }

    async connect(repo, token) {
        if (!this._token) {
            window.alert("Please enter a Personal Access Token");
        }

        if (!this._repo) {
            window.alert("Please enter a Repository Name");
        }

        this._octokit = new Octokit({
            auth: this._token
        });

        this._username = this._username || await this.getUsername();
    }

    async  getUsername() {
        const {
            data: {login, name},
        } = await this._octokit.rest.users.getAuthenticated();

        return login;
    }

    async getFileList() {
        let { data } = await this._octokit.rest.repos.getContent({
            owner : this._username,
            repo : this._repo,
            path : "",
        });

        return data
            .map(x=>x.path)
            .filter(x=>x.endsWith(".cpp") || x.endsWith(".h"));
    }
    async getReposList() {
        let { data } = await this._octokit.rest.getRepos({
            owner : this._username,
            repo : this._repo,
            path : "",
        });

        return data
            .map(x=>x.path)
            .filter(x=>x.endsWith(".cpp") || x.endsWith(".h"));
    }


    async getFilename(path) {
        let {
            data: { filename }
        } = await this._octokit.rest.repos.getContent({
            owner : this._username,
            repo : this._repo,
            path : path,
        });

        return name;
    }

    async getFileContents(filename) {
        let {
            data: { name, content }
        } = await this._octokit.rest.repos.getContent({
            owner : this._username,
            repo : this._repo,
            path : filename,
        });

        content = content.replace(/\s+/g, '');
        content = atob(content);

        return content;
    }

    async pushFile(filename, content, email, name) {
        let message = `update header in ${filename} w/DocUI`;

        let {
            data 
        } = await this._octokit.rest.repos.createOrUpdateFileContents({
            owner : this._username,
            repo : this._repo,
            path : filename,
            message: message,
            content: encodedData,
            committer: {
                name: "DocUI Comment Editing Bot",
                email: "bot@docui.example.com",
            },
            author: {
                name: name,
                email: email,
            }
        });
    }
}

export let authenticator = new Authenticator();

async function getName(octokit) {
    const {
        data: {login, name},
    } = await octokit.rest.users.getAuthenticated();

    return name;
}


