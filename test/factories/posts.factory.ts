import { PrismaService } from "src/prisma/prisma.service";
import { faker } from "@faker-js/faker";

export class PostFactory {
    private title: string;
    private text: string;
    constructor(title?: string, text?: string) {
        this.title = title;
        this.text = text;
    }

    //
    async buildPostDBFaker(prisma: PrismaService) {
        return await prisma.post.create({
            data: {
                title: faker.company.name(),
                text: faker.lorem.words(10)
            }
        })
    }

    async buildPostFaker() {
        return {
            title: faker.company.name(),
            text: faker.lorem.words(10)
        }
    }



    async buildPost(prisma: PrismaService) {
        return await prisma.post.create({
            data: {
                title: this.title,
                text: this.text
            }
        })
    }

    async buildPostManyDBFaker(prisma: PrismaService) {
        return await prisma.post.createMany({
            data: [
                {
                    title: faker.company.name(),
                    text: faker.lorem.words(10),
                },
                {
                    title: faker.company.name(),
                    text: faker.lorem.words(10),
                },
            ],
        })
    }
}