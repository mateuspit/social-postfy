import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
//import { MediasService } from 'src/medias/medias.service';
//import { PostsService } from 'src/posts/posts.service';
import { MediasModule } from 'src/medias/medias.module';
import { PostsModule } from 'src/posts/posts.module';
import { PublicationsRepository } from './publications.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [MediasModule, PostsModule],
    controllers: [PublicationsController],
    providers: [PublicationsService, PrismaService, PublicationsRepository],
    exports: [PublicationsRepository]
})
export class PublicationsModule { }
