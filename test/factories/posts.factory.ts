import { PrismaService } from "src/prisma/prisma.service";
import { faker } from "@faker-js/faker";

export class PostFactory {
    private title: string;
    private text: string;
    private image: string;
    constructor(title?: string, text?: string, image?: string) {
        this.title = title;
        this.text = text;
        this.image = image;
    }

    async buildPostWImageDBFaker(prisma: PrismaService) {
        return await prisma.post.create({
            data: {
                title: faker.company.name(),
                text: faker.lorem.words(10),
                image: `https://picsum.photos/${faker.number.int({ max: 500, min: 200 })}`
            }
        })
    }

    async buildPostWImageFaker() {
        return {
            title: faker.company.name(),
            text: faker.lorem.words(10),
            image: `https://picsum.photos/${faker.number.int({ max: 500, min: 200 })}`
        }
    }



    async buildPostWImage(prisma: PrismaService) {
        return await prisma.post.create({
            data: {
                title: this.title,
                text: this.text,
                image: `https://picsum.photos/${faker.number.int({ max: 500, min: 200 })}`
            }
        })
    }

    async buildPostWImageManyDBFaker(prisma: PrismaService) {
        return await prisma.post.createMany({
            data: [
                {
                    title: faker.company.name(),
                    text: faker.lorem.words(10),
                    image: `https://picsum.photos/${faker.number.int({ max: 500, min: 200 })}`
                },
                {
                    title: faker.company.name(),
                    text: faker.lorem.words(10),
                    image: `https://picsum.photos/${faker.number.int({ max: 500, min: 200 })}`
                },
            ],
        })
    }

    async buildPostWOImageDBFaker(prisma: PrismaService) {
        return await prisma.post.create({
            data: {
                title: faker.company.name(),
                text: faker.lorem.words(10)
            }
        })
    }

    async buildPostWOImageFaker() {
        return {
            title: faker.company.name(),
            text: faker.lorem.words(10)
        }
    }



    async buildPostWOImage(prisma: PrismaService) {
        return await prisma.post.create({
            data: {
                title: this.title,
                text: this.text
            }
        })
    }

    async buildPostWOImageManyDBFaker(prisma: PrismaService) {
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