import { Injectable } from '@nestjs/common';

@Injectable()
export class MediasService {
    getHealthMediasService(): string {
        return 'Medias online!';
    }
}
