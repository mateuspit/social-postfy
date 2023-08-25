import { Injectable } from '@nestjs/common';
import { MediaDTO } from './DTO/medias.DTO';
import { Media } from './entities/medias.entities';
import { conflictMediaError, notFoundMediaIError } from './errors/medias.erros';
import { MediasRepository } from './medias.repository';
import { ConflictMediaException, NotFoundMediaIException } from './exceptions/medias.exceptions';

@Injectable()
export class MediasService {

    constructor(private readonly mediasRepository: MediasRepository) { }

    public medias: Media[] = [
        new Media(1, "instagram", "https://www.instagram.com/USERNAME"),
        new Media(2, "wapp", "https://www.wapp.com/USERNAME"),
        new Media(3, "telegram", "https://www.telegram.com/USERNAME"),
        new Media(4, "facebook", "https://www.facebook.com/USERNAME"),
    ]

    getHealthMediasService(): string {
        return 'Medias online!';
    }

    async addMediaService(body: MediaDTO): Promise<void> {
        const existMedia = await this.mediasRepository.getMediaByTitleAndUsername(body)
        //const existMedia = this.medias.filter((mobj) => {
        //    if ((mobj.title.toLowerCase() === body.title.toLowerCase())
        //        &&
        //        (mobj.username.toLowerCase() === body.username.toLowerCase())) {
        //        return mobj;
        //    }
        //})

        if (!existMedia) {
            await this.mediasRepository.addMediaRepository(body)
        }
        else {
            throw new ConflictMediaException(body.title, body.username);
        }
    }

    async getAllMediasService(): Promise<MediaDTO[]> {
        return await this.mediasRepository.getAllMediasRepository();
    }

    async getMediaByIdService(id: number): Promise<MediaDTO | null> {
        const existMedia = await this.mediasRepository.getMediaByIdRepository(id);
        if (existMedia) {
            return existMedia;
        }
        else {
            throw new NotFoundMediaIException(id);
        }

    }

    async updateMediaByIdService(id: number, { title, username }) {
        const existMediaById = await this.getMediaByIdService(id);
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
            //existMediaById.changeMediaData(title, username);
            await this.mediasRepository.updateMediaByIdRepository(id, title, username);
            return existMediaById;
        }
        else {
            throw conflictMediaError();
        }
    }

    async deleteMediaByIdService(id: number) {
        const existMediaById = await this.getMediaByIdService(id);
        //FEAT
        //
        //ANALYSE IF MEDIA HAS PUBLICATION
        //IF YES, ERROR 403 FORBIDDEN
        await this.mediasRepository.deleteMediaByIdService(id);
    }
}
