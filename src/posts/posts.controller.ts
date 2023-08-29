import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDTO } from './DTO/posts.DTO';

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
    async getAllPostsController(): Promise<PostDTO[]> {
        return await this.postsService.getAllPostsService();
    }

    @Get(":id")
    async getPostByIdController(@Param("id", ParseIntPipe) id: number): Promise<PostDTO> {
        return await this.postsService.getPostByIdService(id);
    }

    @Patch(":id")
    async updatePostByIdController(@Param("id", ParseIntPipe) id: number, @Body() body: PostDTO): Promise<void> {
        await this.postsService.updatePostByIdService(id, body)
    }

    @Delete(":id")
    async deletePostByIdController(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.postsService.deletePostByIdService(id);
    }
}
