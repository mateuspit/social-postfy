import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './post.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicationsRepository } from 'src/publications/publications.repository';

@Module({
    imports: [],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository, PrismaService, PublicationsRepository],
    exports: [PostsService]
})
export class PostsModule { }
