import { Body, Controller, Get, Post } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationDTO } from './DTO/publications.DTO';
import { Publication } from './entities/publication.entities';

@Controller("publications")
export class PublicationsController {
    constructor(private readonly publicationsService: PublicationsService) { }

    @Get("health")
    getHealthPublicationsController(): string {
        return this.publicationsService.getHealthPublicationsService();
    }

    @Post()
    addNewPublicationController(@Body() body: PublicationDTO) {
        this.publicationsService.addNewPublicationService(body);
    }

    @Get()
    getAllPublicationsController(): Publication[] {
        return this.publicationsService.getAllPublicationsService();
    }
}
