import { Injectable } from '@nestjs/common';
import { PostClass } from './entities/posts.entites';
import { notFoundPostError } from './errors/posts.errors';
import { PostDTO } from './DTO/posts.DTO';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServerInputPostException } from './exceptions/post.exceptions';

@Injectable()
export class PostsRepository {

    constructor(private readonly prisma: PrismaService) { }

    async addNewPostRepository(body: PostDTO): Promise<void> {
        try {
            await this.prisma.post.create({ data: body })
        }
        catch (e) {
            throw new ServerInputPostException();
        }
    }

    async getAllPostsRepository(): Promise<PostDTO[]> {
        return await this.prisma.post.findMany();
    }

    async getPostByIdRepository(id: number): Promise<PostDTO | null> {
        return await this.prisma.post.findFirst({
            where: { id }
        })
    }


}
