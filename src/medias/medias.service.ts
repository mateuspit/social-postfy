import { Injectable } from '@nestjs/common';
import { MediaDTO } from './DTO/medias.DTO';
import { Media } from './entities/medias.entities';
import { conflictError } from './errors/medias.erros';

@Injectable()
export class MediasService {

    private medias: MediaDTO[] = [
        new Media("instagram", "https://www.instagram.com/USERNAME"),
        new Media("wapp", "https://www.wapp.com/USERNAME"),
        new Media("telegram", "https://www.telegram.com/USERNAME"),
        new Media("facebook", "https://www.facebook.com/USERNAME"),
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
            else {
                //console.log("Não")
            }
        })

        if (!existMedia.length) {
            return this.medias.push(new Media(title, username))
        }
        else {
            throw conflictError();
        }
    }
}
