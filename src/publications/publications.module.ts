import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
//import { MediasService } from 'src/medias/medias.service';
//import { PostsService } from 'src/posts/posts.service';
import { MediasModule } from 'src/medias/medias.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
    imports: [MediasModule, PostsModule],
    controllers: [PublicationsController],
    //providers: [PublicationsService, MediasService, PostsService],
    providers: [PublicationsService],
})
export class PublicationsModule { }
