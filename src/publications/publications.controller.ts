import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationDTO } from './DTO/publications.DTO';

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
    //async getAllPublicationsController(@Query("published") published?: boolean, @Query("after") after?: Date): Promise<PublicationDTO[]> {
    async getAllPublicationsController(@Query("published") published: string = null, @Query("after") after: Date = null): Promise<PublicationDTO[]> {
        return await this.publicationsService.getAllPublicationsService(published, after);
    }

    @Get(":id")
    async getPublicationByIdController(@Param("id", ParseIntPipe) id: number): Promise<PublicationDTO> {
        return await this.publicationsService.getPublicationById(id);
    }

    @Patch(":id")
    async updatePublicationController(@Param("id", ParseIntPipe) id: number, @Body() body: PublicationDTO): Promise<void> {
        await this.publicationsService.updatePublicationService(id, body);
    }

    @Delete(":id")
    async deletePublicationByIdController(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.publicationsService.deletePublicationByIdService(id);
    }
}
