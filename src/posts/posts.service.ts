import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
    getHealthPostsService(): string {
        return 'Posts online!';
    }
}
