import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicationsService {
    getHealthPublicationsService(): string {
        return 'Publications online!';
    }
}
