import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';

@Module({
    imports: [],
    controllers: [MediasController],
    providers: [MediasService],
    exports: [MediasService]
})
export class MediasModule { }
