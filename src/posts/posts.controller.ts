import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDTO } from './DTO/posts.DTO';
import { inputPostError } from './errors/posts.errors';
import { PostClass } from './entities/posts.entites';

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get("health")
    getHealthPostsController(): string {
        return this.postsService.getHealthPostsService();
    }

    @Post()
    async addNewPostController(@Body() body: PostDTO): Promise<void> {
        const validatedBody = await this.validatePostDTO(body);
        this.postsService.addNewPostService(validatedBody);
    }

    private async validatePostDTO(body: any): Promise<PostDTO> {
        const allowedKeys = ["title", "text", "image"];
        const receivedKeys = Object.keys(body);
        for (const key of receivedKeys) {
            if (!allowedKeys.includes(key)) {
                throw inputPostError(key); //error 422 Unprocessable Entity
            }
        }
        return body;
    }

    @Get()
    getAllPostsController(): PostClass[] {
        return this.postsService.getAllPostsService();
    }

    @Get(":id")
    getPostByIdController(@Param("id", ParseIntPipe) id: number): PostClass {
        return this.postsService.getPostByIdService(id);
    }
}
