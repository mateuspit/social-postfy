import { PrismaService } from "src/prisma/prisma.service";
import { faker } from "@faker-js/faker";

export class PublicationFactory {
    private _mediaId: number;
    private _postId: number;
    private _date: Date;
    constructor(mediaId?: number, postId?: number, date?: Date) {
        this._mediaId = mediaId;
        this._postId = postId;
        this._date = date;
    }

    //
    async buildPublicationDBFaker(prisma: PrismaService) {
        return await prisma.publication.create({
            data: {
                mediaId: this._mediaId,
                postId: this._postId,
                date: this._date
            }
        })
    }

    buildPublicationFaker() {
        return {
            mediaId: this._mediaId,
            postId: this._postId,
            date: this._date
        }
    }
}