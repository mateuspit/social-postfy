import { Injectable } from '@nestjs/common';
import { MediaDTO } from './DTO/medias.DTO';
import { MediasRepository } from './medias.repository';
import { ConflictMediaException, ForbiddenMediaException, NotFoundMediaIException } from './exceptions/medias.exceptions';
import { PublicationsRepository } from 'src/publications/publications.repository';

@Injectable()
export class MediasService {

    constructor(private readonly mediasRepository: MediasRepository, private readonly publicationsRepository: PublicationsRepository) { }

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
        const publicationWithThisMediaExists = await this.publicationsRepository.getPublicationByMediaId(id);
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
