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

    async getAllPublicationRepository(publish?: boolean, after?: Date): Promise<PublicationDTO[]> {
        if (publish === true && after) {
            return await this.prisma.publication.findMany({
                where: {
                    date: {
                        lt: new Date(),
                        ...({ gt: new Date(after) }),
                    }
                }
            })
        }
        else if (publish === false && after) {
            return await this.prisma.publication.findMany({
                where: {
                    date: {
                        gt: new Date(after) > new Date() ? new Date(after) : new Date(),
                    }
                }
            })
        }
        else if (publish === true) {
            return await this.prisma.publication.findMany({
                where: {
                    date: {
                        lt: new Date()
                    }
                }
            })
        }
        else if (publish === false) {
            return await this.prisma.publication.findMany({
                where: {
                    date: {
                        gt: new Date()
                    }
                }
            })
        }
        else if (after) {
            return await this.prisma.publication.findMany({
                where: {
                    date: {
                        gt: new Date(after)
                    }
                }
            })
        }
        else {
            return await this.prisma.publication.findMany();
        }
    }

    async getPublicationByIdRepository(id: number): Promise<PublicationDTO> {
        return await this.prisma.publication.findFirst({
            where: {
                id: id
            }
        })
    }

    async updatePublicationRepository(id: number, body: PublicationDTO): Promise<void> {
        await this.prisma.publication.update({
            where: { id },
            data: {
                mediaId: body.mediaId,
                postId: body.postId,
                date: new Date(body.date)
            }
        })
    }




}
