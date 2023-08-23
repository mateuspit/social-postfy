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
    addMediaController(@Body() body: MediaDTO) {
        return this.mediasService.addMediaService(body);
    }

    @Get()
    getAllMediasController(): Media[] {
        return this.mediasService.getAllMediasService();
    }

    @Get(":id")
    getMediaByIdController(@Param("id", ParseIntPipe) id: number): Media {
        return this.mediasService.getMediaByIdService(id);
    }

    @Patch(":id")
    updateMediaByIdController(@Body() body: MediaDTO, @Param("id", ParseIntPipe) id: number): Media {
        return this.mediasService.updateMediaByIdService(id, body);
    }

    @Delete(":id")
    deleteMediaByIdController(@Param("id", ParseIntPipe) id: number) {
        return this.mediasService.deleteMediaByIdService(id);
    }
}
