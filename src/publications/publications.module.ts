import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';

@Module({
    //imports: [MediasService],
    controllers: [PublicationsController],
    providers: [PublicationsService, MediasService, PostsService],
})
export class PublicationsModule { }
