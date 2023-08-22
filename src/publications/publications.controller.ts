import { Controller, Get } from '@nestjs/common';
import { PublicationsService } from './publications.service';

@Controller("publications")
export class PublicationsController {
    constructor(private readonly publicationsService: PublicationsService) { }

    @Get("health")
    getHealthPublicationsController(): string {
        return this.publicationsService.getHealthPublicationsService();
    }
}
