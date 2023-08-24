import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        //console.log("Prisma online pai!");
        this.$connect;
    }

    //getHealthAppService(): string {
    //    return 'App online!';
    //}
}
