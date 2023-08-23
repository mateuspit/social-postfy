export class Publication {
    _id: number;
    _mediaId: number;
    _postId: number;
    _date: Date;
    constructor(id: number, mediaId: number, postId: number, date: Date) {
        this._id = id;
        this._mediaId = mediaId;
        this._postId = postId;
        this._date = date;
    }
    get id() {
        return this._id;
    }
    changePublicationData(mediaId: number, postId: number, date: Date) {
        this._mediaId = mediaId;
        this._postId = postId;
        this._date = date;
    }
}