export class PostClass {
    private _id: number;
    private _title: string;
    private _text: string;
    private _image?: string;
    constructor(id: number, title: string, text: string, image?: string) {
        this._id = id;
        this._title = title;
        this._text = text;
        this._image = image;
    }

    get id() {
        return this._id;
    }
}