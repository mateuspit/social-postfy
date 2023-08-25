import { Injectable } from '@nestjs/common';
import { MediaDTO } from './DTO/medias.DTO';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictMediaException, ServerMediaException } from './exceptions/medias.exceptions';

@Injectable()
export class MediasRepository {

    constructor(private readonly prisma: PrismaService) { }

    async addMediaRepository(body: MediaDTO): Promise<void> {
        await this.prisma.media.create({
            data: body
        })
    }

    async getAllMediasRepository(): Promise<MediaDTO[]> {
        //throw new Error('Method not implemented.');
        return await this.prisma.media.findMany();
    }

    async getMediaByIdRepository(id: number): Promise<MediaDTO | null> {
        return await this.prisma.media.findFirst({
            where: {
                id
            }
        });
    }

    async updateMediaByIdRepository(id: number, title: string, username: string) {
        await this.prisma.media.update({
            where: {
                id
            },
            data: {
                title,
                username
            }
        });
    }
    async deleteMediaByIdService(id: number) {
        await this.prisma.media.delete({ where: { id } });
    }

    async getMediaByTitleAndUsername(body: MediaDTO) {
        try {
            return await this.prisma.media.findFirst({
                where: body
            })
        }
        catch (e) {
        }
        throw new ServerMediaException();
    }
}
