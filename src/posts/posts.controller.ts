import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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
        await this.postsService.addNewPostService(body);
    }

    @Get()
    getAllPostsController(): PostClass[] {
        return this.postsService.getAllPostsService();
    }

    @Get(":id")
    getPostByIdController(@Param("id", ParseIntPipe) id: number): PostClass {
        return this.postsService.getPostByIdService(id);
    }

    @Patch(":id")
    async updatePostByIdController(@Param("id", ParseIntPipe) id: number, @Body() body: PostDTO): Promise<void> {
        //const validatedBody = await this.validatePostDTO(body);
        //this.postsService.updatePostByIdService(id, validatedBody);
    }

    @Delete(":id")
    deletePostByIdController(@Param("id", ParseIntPipe) id: number) {
        this.postsService.deletePostByIdService(id);
    }
}
