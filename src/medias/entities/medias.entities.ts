export class Media {
    private _id: number;
    private _title: string;
    private _username: string;
    constructor(id: number, title: string, username: string) {
        this._id = id;
        this._title = title;
        this._username = username;
    }

    changeMediaData(title: string, username: string): void {
        this._username = username;
        this._title = title;
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get username() {
        return this._username;
    }

    //set
}