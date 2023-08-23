import { Injectable } from '@nestjs/common';
import { PublicationDTO } from './DTO/publications.DTO';
import { Publication } from './entities/publication.entities';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';

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
        //const existMedia = 
        this.mediasService.getMediaByIdService(mediaId);
        //console.log("mediaExits", mediaExits);
        this.postsService.getPostByIdService(postId);
        this.publications.push(new Publication(this.publications[lastElementIndex].id + 1, mediaId, postId, date));
        console.log(`Publicação ${this.publications[lastElementIndex].id + 1} criada`);
    }
}
