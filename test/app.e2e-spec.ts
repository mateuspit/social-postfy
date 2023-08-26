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
            .get('/health');
        expect(status).toBe(HttpStatus.OK);
        expect(text).toBe("App online!");
    });

    describe("/medias integration tests", () => {
        it("GET /health => should get an alive message from medias", async () => {
            const { status, text } = await request(app.getHttpServer())
                .get("/medias/health");
            expect(status).toBe(HttpStatus.OK);
            expect(text).toBe("Medias online!")
        });

        it("POST /medias => should create a media data; status code 200", async () => {
            //const response = await request(app.getHttpServer())
            const { status } = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string title",
                    username: "string username"
                });
            expect(status).toBe(HttpStatus.CREATED);
            //expect(response.status).toBe(HttpStatus.CREATED);

            const mediaReturn = await prisma.media.findFirst({
                where: {
                    title: "string title",
                    username: "string username"
                }
            })
            expect(mediaReturn !== null).toBe(true);
        });

        it("POST /medias => should return status code 400 title missing", async () => {
            //const response = await request(app.getHttpServer())
            const { status } = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    username: "string username"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 username missing", async () => {
            //const response = await request(app.getHttpServer())
            const { status } = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string username"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 strange keys in body object", async () => {
            //const response = await request(app.getHttpServer())
            const { status } = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string title",
                    username: "string username",
                    strange: "strange"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 title need to be a string", async () => {
            //const response = await request(app.getHttpServer())

            const responseNumber = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: 0,
                    username: "string username"
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: true,
                    username: "string username"
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: false,
                    username: "string username"
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: [],
                    username: "string username"
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: {},
                    username: "string username"
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: undefined,
                    username: "string username"
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: null,
                    username: "string username"
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 username need to be a string", async () => {
            //const response = await request(app.getHttpServer())

            const responseNumber = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string username",
                    username: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string username",
                    username: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string username",
                    username: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string username",
                    username: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string username",
                    username: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string username",
                    username: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string username",
                    username: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 title empty", async () => {
            //const response = await request(app.getHttpServer())
            const { status } = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "",
                    username: "string username"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 username empty", async () => {
            //const response = await request(app.getHttpServer())
            const { status } = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string usernam",
                    username: ""
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should be unique return status code 409", async () => {
            //const response = await request(app.getHttpServer())
            await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const { status } = await request(app.getHttpServer())
                .post("/medias")
                .send({
                    title: "string title",
                    username: "string username"
                });
            expect(status).toBe(HttpStatus.CONFLICT);
        });

        it("GET /medias => should return an array media data when with data; status code 200", async () => {
            await prisma.media.createMany({
                data: [
                    {
                        title: "Instagram",
                        username: "myusername",
                    },
                    {
                        title: "Twitter",
                        username: "myusername",
                    },
                ],
            });

            const { status, body } = await request(app.getHttpServer())
                .get("/medias");
            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true);

        });

        it("GET /medias => when with data should return an array containing just keys id, title and username; status code 200", async () => {
            await prisma.media.createMany({
                data: [
                    {
                        title: "Instagram",
                        username: "myusername",
                    },
                    {
                        title: "Twitter",
                        username: "myusername",
                    },
                ],
            });

            const { status, body } = await request(app.getHttpServer())
                .get("/medias");
            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true);

            for (const media of body) {
                expect(media.hasOwnProperty('id') && media.hasOwnProperty('title') && media.hasOwnProperty('username')).toBe(true);
                expect(Object.keys(media).length === 3).toBe(true);
            }
        });

        it("GET /medias => should return an empty array when without data; status code 200", async () => {
            const { status, body } = await request(app.getHttpServer())
                .get("/medias");
            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBe(0);
        });

        it("GET /medias:id => should return an object media data if data exists", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });

            const { status, body } = await request(app.getHttpServer())
                .get(`/medias/${newMedia.id}`);
            expect(status).toBe(HttpStatus.OK);
            expect(Object.prototype.toString.call(body) === '[object Object]').toBe(true);
            expect(body.hasOwnProperty('id') && body.hasOwnProperty('title') && body.hasOwnProperty('username')).toBe(true);
            expect(Object.keys(body).length === 3).toBe(true);
        });

        it("GET /medias:id => should return status code 404 when media by id not found", async () => {
            await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });

            const lastMediaInDB = await prisma.media.findFirst({
                select: {
                    id: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const { status } = await request(app.getHttpServer())
                .get(`/medias/${lastMediaInDB.id + 10}`);
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("PUT /medias/:id =>  should update a media data; status code 200", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });

            const { status } = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "title string",
                    username: "username string"
                });
            expect(status).toBe(HttpStatus.OK);
        });

        it("PUT /medias/:id =>  should return 404 id media not found", async () => {
            await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });

            const lastMediaInDB = await prisma.media.findFirst({
                select: {
                    id: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const { status } = await request(app.getHttpServer())
                .patch(`/medias/${lastMediaInDB.id + 10}`)
                .send({
                    title: "title string",
                    username: "username string"
                });
            expect(status).toBe(HttpStatus.NOT_FOUND)
        });

        it("PUT /medias/:id => should return status code 400 title missing", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });

            const { status } = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    username: "string username"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 username missing", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });
            const { status } = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string username"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 strange keys in body object", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });
            const { status } = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string title",
                    username: "string username",
                    strange: "strange"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 title need to be a string", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });

            const responseNumber = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: 0,
                    username: "string username"
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: true,
                    username: "string username"
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: false,
                    username: "string username"
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: [],
                    username: "string username"
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: {},
                    username: "string username"
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: undefined,
                    username: "string username"
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: null,
                    username: "string username"
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 username need to be a string", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });

            const responseNumber = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string username",
                    username: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string username",
                    username: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string username",
                    username: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string username",
                    username: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string username",
                    username: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string username",
                    username: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string username",
                    username: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 title empty", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });
            const { status } = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "",
                    username: "string username"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 username empty", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "Instagram",
                    username: "myusername",
                }
            });
            const { status } = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send({
                    title: "string usernam",
                    username: ""
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should be unique return status code 409", async () => {
            //const response = await request(app.getHttpServer())
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const updateBody = {
                title: "string title",
                username: "string username"
            }

            console.log(newMedia.id);

            const { status } = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send(updateBody);
            expect(status).toBe(HttpStatus.CONFLICT);
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
