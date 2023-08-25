import { Injectable } from '@nestjs/common';
import { MediaDTO } from './DTO/medias.DTO';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundMediaIException, ServerInputMediaException as ServerInputMediaException } from './exceptions/medias.exceptions';
import { PublicationDTO } from 'src/publications/DTO/publications.DTO';

@Injectable()
export class MediasRepository {

    constructor(private readonly prisma: PrismaService) { }

    async addMediaRepository(body: MediaDTO): Promise<void> {
        await this.prisma.media.create({
            data: body
        })
    }

    async getAllMediasRepository(): Promise<MediaDTO[]> {
        return await this.prisma.media.findMany();
    }

    async getMediaByIdRepository(id: number): Promise<MediaDTO | null> {
        return await this.prisma.media.findFirst({
            where: {
                id
            }
        });
    }

    async updateMediaByIdRepository(id: number, body: MediaDTO): Promise<void> {
        await this.prisma.media.update({
            where: { id },
            data: body
        });
    }
    async deleteMediaByIdService(id: number) {
        await this.prisma.media.delete({ where: { id } });
    }

    async getMediaByTitleAndUsername(body: MediaDTO): Promise<MediaDTO> {
        try {
            return await this.prisma.media.findFirst({
                where: body
            })
        }
        catch (e) {
            throw new ServerInputMediaException();
        }
    }

    async getPublicationByMediaId(id: number): Promise<PublicationDTO | null> {
        try {
            return await this.prisma.publication.findFirst({ where: { mediaId: id } })
        }
        catch (e) {
            throw new ServerInputMediaException();
        }

    }
}
