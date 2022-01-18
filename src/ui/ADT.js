import { Document } from "./Document.js";

export class ADT {
    constructor(hName, hContent, cppName, cppContent) {
        this._hDocument = new Document(hName, hContent);
        this._cppDocument = new Document(cppName, cppContent);
    }

    set hFile(filename) {
    }

    get extensions() {
        let exts = [];
        if (this.hasDotH()) {
            exts.push(".h");
        }

        if (this.hasDotCpp()) {
            exts.push(".cpp");
        }

        return exts;
    }

    addDocument(filename, extension) {
        if (extension == "h") {
            this._hFile = new Document();
        } else if (extension == "cpp") {
            this._cppFile = new Document();
        }
    }

    hasDotH() {
        return this._hFile != undefined;
    }

    hasDotCpp() {
        return this._cppFile != undefined;
    }
}
