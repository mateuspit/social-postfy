import { Injectable } from '@nestjs/common';
import { MediaDTO } from './DTO/medias.DTO';
import { Media } from './entities/medias.entities';
import { conflictMediaError, notFoundMediaIError } from './errors/medias.erros';
import { MediasRepository } from './medias.repository';
import { ConflictMediaException, ForbiddenMediaException, NotFoundMediaIException } from './exceptions/medias.exceptions';

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

    async updateMediaByIdService(id: number, body: MediaDTO): Promise<void> {
        await this.getMediaByIdService(id);
        const existMedia = await this.mediasRepository.getMediaByTitleAndUsername(body);
        if (!existMedia) {
            await this.mediasRepository.updateMediaByIdRepository(id, body);
        }
        else {
            throw new ConflictMediaException(body.title, body.username);
        }

    }

    async deleteMediaByIdService(id: number): Promise<void> {
        await this.getMediaByIdService(id);
        const publicationWithThisMediaExists = await this.mediasRepository.getPublicationByMediaId(id);
        if (publicationWithThisMediaExists) {
            throw new ForbiddenMediaException(id, publicationWithThisMediaExists.id);
        }
        //FEAT
        //
        //ANALYSE IF MEDIA HAS PUBLICATION
        //IF YES, ERROR 403 FORBIDDEN
        await this.mediasRepository.deleteMediaByIdService(id);
    }
}
