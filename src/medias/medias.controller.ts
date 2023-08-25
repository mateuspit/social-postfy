import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MediasService } from './medias.service';
import { Media } from './entities/medias.entities';
import { MediaDTO } from './DTO/medias.DTO';

@Controller("medias")
export class MediasController {
    constructor(private readonly mediasService: MediasService) { }

    @Get("health")
    getHealthMediasController(): string {
        return this.mediasService.getHealthMediasService();
    }

    @Post()
    async addMediaController(@Body() body: MediaDTO): Promise<void> {
        await this.mediasService.addMediaService(body);
    }

    @Get()
    async getAllMediasController(): Promise<MediaDTO[]> {
        return await this.mediasService.getAllMediasService();
    }

    @Get(":id")
    async getMediaByIdController(@Param("id", ParseIntPipe) id: number): Promise<MediaDTO> {
        return await this.mediasService.getMediaByIdService(id);
    }

    @Patch(":id")
    async updateMediaByIdController(@Body() body: MediaDTO, @Param("id", ParseIntPipe) id: number): Promise<void> {
        this.mediasService.updateMediaByIdService(id, body);
    }

    @Delete(":id")
    async deleteMediaByIdController(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.mediasService.deleteMediaByIdService(id);
    }
}
