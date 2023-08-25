import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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
    async addNewPublicationController(@Body() body: PublicationDTO): Promise<void> {
        await this.publicationsService.addNewPublicationService(body);
    }

    @Get()
    async getAllPublicationsController(): Promise<PublicationDTO[]> {
        return await this.publicationsService.getAllPublicationsService();
    }

    @Get(":id")
    getPublicationByIdController(@Param("id", ParseIntPipe) id: number): Publication {
        return this.publicationsService.getPublicationById(id);
    }

    @Patch(":id")
    updatePublicationController(@Param("id", ParseIntPipe) id: number, @Body() body: PublicationDTO) {
        this.publicationsService.updatePublicationService(id, body);
    }

    @Delete(":id")
    deletePublicationByIdController(@Param("id", ParseIntPipe) id: number) {
        this.publicationsService.deletePublicationByIdService(id);
    }
}
