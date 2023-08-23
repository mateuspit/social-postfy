export class Publication {
    private _id: number;
    private _mediaId: number;
    private _postId: number;
    private _date: Date;
    constructor(id: number, mediaId: number, postId: number, date: Date) {
        this._id = id;
        this._mediaId = mediaId;
        this._postId = postId;
        this._date = date;
    }
    get id() {
        return this._id;
    }
    get date() {
        return this._date;
    }
    changePublicationData(mediaId: number, postId: number, date: Date) {
        this._mediaId = mediaId;
        this._postId = postId;
        this._date = date;
    }
}