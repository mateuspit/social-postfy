import { Injectable } from '@nestjs/common';
import { PublicationDTO } from './DTO/publications.DTO';
import { Publication } from './entities/publication.entities';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';
import { dateInvalidPublicationError, forbiddenPublicationError, notFoundMediaInPublicationError, notFoundPostInPublicationError, notFoundPublicationError } from './errors/publications.errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServerInputMediaException } from 'src/medias/exceptions/medias.exceptions';

@Injectable()
export class PublicationsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getPublicationByMediaId(id: number): Promise<PublicationDTO | null> {
        try {
            return await this.prisma.publication.findFirst({ where: { mediaId: id } })
        }
        catch (e) {
            throw new ServerInputMediaException();
        }

    }

}
