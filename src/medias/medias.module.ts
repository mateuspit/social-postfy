import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MediasRepository } from './medias.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicationsModule } from 'src/publications/publications.module';
import { PublicationsRepository } from 'src/publications/publications.repository';

@Module({
    imports: [],
    controllers: [MediasController],
    providers: [MediasService, MediasRepository, PrismaService, PublicationsRepository],
    exports: [MediasService]
})
export class MediasModule { }
