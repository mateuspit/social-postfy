import { Controller, Get } from '@nestjs/common';
import { MediasService } from './medias.service';

@Controller("medias")
export class MediasController {
    constructor(private readonly mediasService: MediasService) { }

    @Get("health")
    getHealthMediasController(): string {
        return this.mediasService.getHealthMediasService();
    }
}
