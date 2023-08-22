import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get("health")
    getHealthPostsController(): string {
        return this.postsService.getHealthPostsService();
    }
}
