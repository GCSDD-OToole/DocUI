export class Header {
    constructor(filename, fileContents) {
        let comments = extractHeaderComment(fileContents);

        this._filename = filename;

        this._originalAuthor = readAuthor(comments);
        this._author = this._originalAuthor;

        this._originalDescription = readDescription(comments);
        this.description = this._originalDescription;

        this._originalDueDate = readDate(comments);
        this._dueDate = _originalDueDate;
    }

    get filename() {
        return _filename;
    }

    set filename(value) {
        _filename = value;
    }

    get author() {
        return _author;
    }

    set author(value) {
        _author = value;
    }

    get dueDate() {
        return _dueDate;
    }

    set dueDate(value) {
        _dueDate = value;
    }
}

function extractHeaderComment(fileContents) {
    let re = /^\/\*\*[\s\S]*?\*\//;
    let comments = contents.match(re);

    return contents.search(re) == 0 ? comments[0] : "";
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

//export { Header };
