import { Body, Controller, Get, Post } from '@nestjs/common';
import { MediasService } from './medias.service';
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
}
