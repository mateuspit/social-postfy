import { Injectable } from '@nestjs/common';
import { PublicationDTO } from './DTO/publications.DTO';
import { Publication } from './entities/publication.entities';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';
import { dateInvalidPublicationError, forbiddenPublicationError, notFoundMediaInPublicationError, notFoundPostInPublicationError, notFoundPublicationError } from './errors/publications.errors';
import { PublicationsRepository } from './publications.repository';
import { ForbiddenDatePublicationException, ForbiddenPublicationException, InputFilterPublicationException, NotFoundPublicationException } from './exceptions/publications.exception';

@Injectable()
export class PublicationsService {
    constructor(
        private readonly mediasService: MediasService,
        private readonly postsService: PostsService,
        private readonly publicationRepository: PublicationsRepository
    ) { }

    private publications: Publication[] = [
        new Publication(1, 1, 1, new Date("2023-09-21")),
        new Publication(2, 1, 1, new Date("2023-07-21")),
        new Publication(57, 1, 1, new Date("2023-07-24")),
        new Publication(4, 1, 1, new Date("2023-07-24"))
    ];

    getHealthPublicationsService(): string {
        return 'Publications online!';
    }

    async addNewPublicationService(body: PublicationDTO): Promise<void> {
        await this.mediasService.getMediaByIdService(body.mediaId);
        await this.postsService.getPostByIdService(body.postId);
        const newPublication = await this.publicationRepository.addNewPublicationRepository(body);
        console.log(`Publicação ${newPublication.id} criada`);
    }

    async getAllPublicationsService(publish?: string, after?: Date): Promise<PublicationDTO[]> {
        if (publish !== null && publish !== "true" && publish !== "false") {
            throw new InputFilterPublicationException();
        }
        if ((new Date(after).toString() === "Invalid Date")) {
            throw new InputFilterPublicationException();
        }
        const booleanInput = JSON.parse(publish);
        return await this.publicationRepository.getAllPublicationRepository(booleanInput, after);
    }

    async getPublicationById(id: number): Promise<PublicationDTO> {
        //throw new Error('Method not implemented.');
        const publicationExists = await this.publicationRepository.getPublicationByIdRepository(id);
        if (!publicationExists) {
            throw new NotFoundPublicationException(id);
        }
        return publicationExists;
    }

    async updatePublicationService(id: number, body: PublicationDTO): Promise<void> {
        const publicationExits = await this.getPublicationById(id);
        if (new Date(body.date) < new Date()) {
            throw new ForbiddenDatePublicationException(body.date);
        }
        if (new Date(publicationExits.date) < new Date()) {
            throw new ForbiddenPublicationException(id);
        }
        await this.mediasService.getMediaByIdService(body.mediaId);
        await this.postsService.getPostByIdService(body.postId);

        await this.publicationRepository.updatePublicationRepository(id, body);

        console.log(`Publication ${id}: Updated data.`)
    }

    async deletePublicationByIdService(id: number): Promise<void> {
        await this.getPublicationById(id);

        await this.publicationRepository.deletePublicationByIdRepository(id);
        console.log(`Publication ${id}: Deleted data.`);
    }



}
