import { Injectable } from '@nestjs/common';
import { PublicationDTO } from './DTO/publications.DTO';
import { Publication } from './entities/publication.entities';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';
import { dateInvalidPublicationError, forbiddenPublicationError, notFoundMediaInPublicationError, notFoundPostInPublicationError, notFoundPublicationError } from './errors/publications.errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServerInputMediaException } from 'src/medias/exceptions/medias.exceptions';
import { ServerInputPublicationException } from './exceptions/publications.exception';

@Injectable()
export class PublicationsRepository {

    constructor(private readonly prisma: PrismaService) { }

    async getPublicationByMediaId(id: number): Promise<PublicationDTO | null> {
        //try {
        return await this.prisma.publication.findFirst({ where: { mediaId: id } })
        //}
        //catch (e) {
        //    throw new ServerInputMediaException();
        //}
    }

    async getPublicationByPostIdRepository(id: number): Promise<PublicationDTO | null> {
        return await this.prisma.publication.findFirst({
            where: { postId: id }
        })
    }

    async addNewPublicationRepository(body: PublicationDTO): Promise<PublicationDTO> {
        try {
            return await this.prisma.publication.create({ data: body })
        }
        catch (e) {
            throw new ServerInputPublicationException;
        }
    }

    async getAllPublicationRepository(): Promise<PublicationDTO[]> {
        return await this.prisma.publication.findMany();
    }


}
