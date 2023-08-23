import { Injectable } from '@nestjs/common';
import { MediaDTO } from './DTO/medias.DTO';
import { Media } from './entities/medias.entities';
import { conflictMediaError, notFoundMediaIError } from './errors/medias.erros';

@Injectable()
export class MediasService {

    public medias: Media[] = [
        new Media(1, "instagram", "https://www.instagram.com/USERNAME"),
        new Media(2, "wapp", "https://www.wapp.com/USERNAME"),
        new Media(3, "telegram", "https://www.telegram.com/USERNAME"),
        new Media(4, "facebook", "https://www.facebook.com/USERNAME"),
    ]

    getHealthMediasService(): string {
        return 'Medias online!';
    }

    addMediaService({ title, username }) {
        const existMedia = this.medias.filter((mobj) => {
            if ((mobj.title.toLowerCase() === title.toLowerCase())
                &&
                (mobj.username.toLowerCase() === username.toLowerCase())) {
                return mobj;
            }
        })

        if (!existMedia.length) {
            return this.medias.push(new Media(this.medias.length + 1, title, username))
        }
        else {
            throw conflictMediaError();
        }
    }

    getAllMediasService(): Media[] {
        return this.medias;
    }

    getMediaByIdService(id: number): Media {
        const existMedia = this.medias.find((mobj) => mobj.id === id);
        if (existMedia) {
            return existMedia;
        }
        else {
            throw notFoundMediaIError();
            //return (new Media(77, "a", "a"));
        }

    }

    updateMediaByIdService(id: number, { title, username }): Media {
        const existMediaById = this.getMediaByIdService(id);
        const existMedia = this.medias.filter((mobj) => {
            if ((mobj.title.toLowerCase() === title.toLowerCase())
                &&
                (mobj.username.toLowerCase() === username.toLowerCase())) {
                return mobj;
            }
        })

        if (!existMedia.length) {
            //existMediaById.changeTitle(title)
            //existMediaById.changeUsername(username)
            existMediaById.changeMediaData(title, username);
            return existMediaById;
        }
        else {
            throw conflictMediaError();
        }
    }

    deleteMediaByIdService(id: number) {
        const existMediaById = this.getMediaByIdService(id);
        //FEAT
        //
        //ANALYSE IF MEDIA HAS PUBLICATION
        //IF YES, ERROR 403 FORBIDDEN
        const deleteIndex = this.medias.findIndex((mobj) => mobj.id === existMediaById.id)
        return this.medias.splice((deleteIndex), 1)
    }
}
