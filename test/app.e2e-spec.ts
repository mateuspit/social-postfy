import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { describe } from 'node:test';
import { PrismaService } from 'src/prisma/prisma.service';

let app: INestApplication;
let prisma: PrismaService;

beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await prisma.media.deleteMany();
    await prisma.post.deleteMany();
    await prisma.publication.deleteMany();

    await app.init();
});

describe('AppController (e2e)', () => {
    it('GET /health => should get an alive message from app', async () => {
        const { status, text } = await request(app.getHttpServer())
            .get('/health')
        expect(status).toBe(HttpStatus.OK);
        expect(text).toBe("App online!");
    });

    describe("/medias integration tests", () => {
        it("GET /health => should get an alive message from medias", async () => {
            const { status, text } = await request(app.getHttpServer())
                .get("/medias/health")
            expect(status).toBe(HttpStatus.OK);
            expect(text).toBe("Medias online!")
        });
    });

    describe("/posts integration tests", () => {
        it("GET /health => should get an alive message from posts", async () => {
            const { status, text } = await request(app.getHttpServer())
                .get("/posts/health")
            expect(status).toBe(HttpStatus.OK);
            expect(text).toBe("Posts online!")
        });
    });

    describe("/publications integration tests", () => {
        it("GET /health => should get an alive message from publications", async () => {
            const { status, text } = await request(app.getHttpServer())
                .get("/publications/health")
            expect(status).toBe(HttpStatus.OK);
            expect(text).toBe("Publications online!")
        });
    });




});
