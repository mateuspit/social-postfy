import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './post.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository, PrismaService],
    exports: [PostsService]
})
export class PostsModule { }
