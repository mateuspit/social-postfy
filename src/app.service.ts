import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealthAppService(): string {
        return 'App online!';
    }
}
