import { PrismaService } from "src/prisma/prisma.service";
import { faker } from "@faker-js/faker";

export class MediaFactory {
    private title: string;
    private username: string;
    constructor(title?: string, username?: string) {
        this.title = title;
        this.username = username;
    }

    //
    async buildMediaDBFaker(prisma: PrismaService) {
        return await prisma.media.create({
            data: {
                title: faker.company.name(),
                username: faker.internet.userName()
            }
        })
    }

    async buildMediaFaker() {
        return {
            title: faker.company.name(),
            username: faker.internet.userName()
        }
    }



    async buildMedia(prisma: PrismaService) {
        return await prisma.media.create({
            data: {
                title: this.title,
                username: this.username
            }
        })
    }

    //const newManyMedia = await new MediaFactory().buildManyDBFaker(prisma);
    async buildMediaManyDBFaker(prisma: PrismaService) {
        return await prisma.media.createMany({
            data: [
                {
                    title: faker.company.name(),
                    username: faker.internet.userName(),
                },
                {
                    title: faker.company.name(),
                    username: faker.internet.userName(),
                },
            ],
        })
    }
}