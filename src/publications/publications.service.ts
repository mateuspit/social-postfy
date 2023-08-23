import { Injectable } from '@nestjs/common';
import { PublicationDTO } from './DTO/publications.DTO';
import { Publication } from './entities/publication.entities';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';
import { notFoundPublicationError } from './errors/publications.errors';

@Injectable()
export class PublicationsService {

    constructor(private readonly mediasService: MediasService, private readonly postsService: PostsService) { }

    private publications: Publication[] = [
        new Publication(1, 1, 1, new Date("2023-08-21"))
    ];

    getHealthPublicationsService(): string {
        return 'Publications online!';
    }

    //addNewPublicationService(body: PublicationDTO) {
    addNewPublicationService({ mediaId, postId, date }) {
        const lastElementIndex = this.publications.length - 1;
        this.mediasService.getMediaByIdService(mediaId);
        this.postsService.getPostByIdService(postId);
        this.publications.push(new Publication(this.publications[lastElementIndex].id + 1, mediaId, postId, date));
        console.log(`Publicação ${this.publications[lastElementIndex].id + 1} criada`);
    }

    getAllPublicationsService() {
        //throw new Error('Method not implemented.');
        return this.publications;
    }

    getPublicationById(id: number): Publication {
        //throw new Error('Method not implemented.');
        const publicationExists = this.publications.find(pobj => pobj._id === id);
        if (!publicationExists) {
            throw notFoundPublicationError();
        }
        return publicationExists;
    }

}
