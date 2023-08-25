import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MediasRepository } from './medias.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [],
    controllers: [MediasController],
    providers: [MediasService, MediasRepository, PrismaService],
    exports: [MediasService]
})
export class MediasModule { }
