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
    }).overrideProvider(PrismaService).useValue(prisma).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await prisma.publication.deleteMany();
    await prisma.media.deleteMany();
    await prisma.post.deleteMany();

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

            const { status } = await request(app.getHttpServer())
                .patch(`/medias/${newMedia.id}`)
                .send(updateBody);
            expect(status).toBe(HttpStatus.CONFLICT);
        });

        it("DELETE /media/:id => should delete id media data; status code 200", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`/medias/${newMedia.id}`);

            const mediaExists = await prisma.media.findFirst({
                where: { id: newMedia.id }
            })

            expect(mediaExists).toBe(null);
            expect(status).toBe(HttpStatus.OK);
        });

        it("DELETE /media/:id => should return 404 not found media", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`/medias/${newMedia.id + 10}`);

            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("DELETE /media/:id => should return 403 Forbidden media attachet to a published publication", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            await prisma.publication.create({
                data: {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date("2023-08-20")
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`/medias/${newMedia.id}`);

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it("DELETE /media/:id => should return 403 Forbidden media attachet to a future publication", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            await prisma.publication.create({
                data: {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date("2040-08-20")
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`/medias/${newMedia.id}`);

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });
    });

    describe("/posts integration tests", () => {
        it("GET /health => should get an alive message from posts", async () => {
            const { status, text } = await request(app.getHttpServer())
                .get("/posts/health");
            expect(status).toBe(HttpStatus.OK);
            expect(text).toBe("Posts online!")
        });

        it("POST /posts => should create a post data without image; status code 200", async () => {
            const postBody = {
                title: "string title",
                text: "string text"
            }

            const { status } = await request(app.getHttpServer())
                .post(`/posts`)
                .send(postBody);
            expect(status).toBe(HttpStatus.CREATED);
        });

        it("POST /posts => should create a post data with image; status code 200", async () => {
            const postBody = {
                title: "string title",
                text: "string text",
                image: "https://picsum.photos/200"
            }

            const { status } = await request(app.getHttpServer())
                .post(`/posts`)
                .send(postBody);
            expect(status).toBe(HttpStatus.CREATED);
        });

        it("POST /posts => should return status code 400 title missing", async () => {
            const postBody = {
                text: "string text",
                image: "https://picsum.photos/200"
            }

            const { status } = await request(app.getHttpServer())
                .post(`/posts`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 text missing", async () => {
            const postBody = {
                title: "string title",
                image: "https://picsum.photos/200"
            }

            const { status } = await request(app.getHttpServer())
                .post(`/posts`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 title empty", async () => {
            const postBody = {
                title: "",
                text: "string text",
                image: "https://picsum.photos/200"
            }

            const { status } = await request(app.getHttpServer())
                .post(`/posts`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 text empty", async () => {
            const postBody = {
                title: "string title",
                text: "",
                image: "https://picsum.photos/200"
            }

            const { status } = await request(app.getHttpServer())
                .post(`/posts`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 image must be a URL", async () => {
            const postBody = {
                title: "string title",
                text: "string text",
                image: ""
            }

            const { status } = await request(app.getHttpServer())
                .post(`/posts`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 title need to be a string", async () => {
            //const response = await request(app.getHttpServer())

            const responseNumber = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: 0,
                    text: "string username"
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: true,
                    text: "string username"
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: false,
                    text: "string username"
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: [],
                    text: "string username"
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: {},
                    text: "string username"
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: undefined,
                    text: "string username"
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: null,
                    text: "string username"
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 text need to be a string", async () => {
            //const response = await request(app.getHttpServer())

            const responseNumber = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: "string username",
                    text: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: "string username",
                    text: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: "string username",
                    text: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: "string username",
                    text: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: "string username",
                    text: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: "string username",
                    text: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: "string username",
                    text: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 strange keys in body object", async () => {
            //const response = await request(app.getHttpServer())
            const { status } = await request(app.getHttpServer())
                .post("/posts")
                .send({
                    title: "string title",
                    text: "string username",
                    strange: "strange"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("GET /posts => should return an array post data when with data; status code 200", async () => {
            prisma.post.createMany({
                data: [
                    {
                        title: "Instagram",
                        text: "myusername",
                    },
                    {
                        title: "Twitter",
                        text: "myusername",
                        image: "https://picsum.photos/200"
                    },
                ],
            })

            const { status, body } = await request(app.getHttpServer())
                .get(`/posts`);
            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true);
            for (const posts of body) {
                const logicWithImage = posts.hasOwnProperty('id') && posts.hasOwnProperty('title') && posts.hasOwnProperty('text') && posts.hasOwnProperty('image');
                const logicWithoutImage = posts.hasOwnProperty('id') && posts.hasOwnProperty('title') && posts.hasOwnProperty('text') && !posts.hasOwnProperty('image');
                expect(logicWithImage || logicWithoutImage).toBe(true);
            }
        });

        it("GET /posts => should return an empty array when without data; status code 200", async () => {
            const { status, body } = await request(app.getHttpServer())
                .get(`/posts`);
            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBe(0)

        });

        it("GET /posts/:id => should return status code 404 when post by id not found", async () => {
            await prisma.post.create({
                data: {
                    title: "Instagram",
                    text: "myusername",
                }
            })

            const lastPostInDB = await prisma.post.findFirst({
                select: {
                    id: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const { status } = await request(app.getHttpServer())
                .get(`/posts/${lastPostInDB.id + 10}`);
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("GET /posts/:id => should return status an object with post by id", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "Instagram",
                    text: "myusername",
                }
            });

            const { status, body } = await request(app.getHttpServer())
                .get(`/posts/${newPost.id}`);
            expect(status).toBe(HttpStatus.OK);
            expect(Object.prototype.toString.call(body) === '[object Object]').toBe(true);
            const logicWithImage = newPost.hasOwnProperty('id') && newPost.hasOwnProperty('title') && newPost.hasOwnProperty('text') && newPost.hasOwnProperty('image');
            const logicWithoutImage = newPost.hasOwnProperty('id') && newPost.hasOwnProperty('title') && newPost.hasOwnProperty('text') && !newPost.hasOwnProperty('image');

            expect(logicWithImage || logicWithoutImage).toBe(true);

            expect(!!newPost.id ? Object.keys(newPost).length === 4 : Object.keys(newPost).length === 3).toBe(true);
        });

        it("PUT /posts/:id => should create a post data without image; status code 200", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const postBody = {
                title: "s",
                text: "ss"
            }

            const { status } = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.OK);
        });

        it("PUT /posts/:id => should create a post data with image; status code 200", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text",
                    image: "https://picsum.photos/200"
                }
            })

            const postBody = {
                title: "string title",
                text: "string text",
                image: "https://picsum.photos/269"
            }

            const { status } = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.OK);
        });

        it("PUT /posts/:id => should return status code 400 title missing", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text",
                    image: "https://picsum.photos/200"
                }
            })

            const postBody = {
                text: "string text",
                image: "https://picsum.photos/200"
            }

            const { status } = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 text missing", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text",
                    image: "https://picsum.photos/200"
                }
            })

            const postBody = {
                title: "string title",
                image: "https://picsum.photos/200"
            }

            const { status } = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 title empty", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text",
                    image: "https://picsum.photos/200"
                }
            })

            const postBody = {
                title: "",
                text: "string text",
                image: "https://picsum.photos/200"
            }

            const { status } = await request(app.getHttpServer())
                .patch(`/posts/${newPost}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 text empty", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text",
                    image: "https://picsum.photos/200"
                }
            })

            const postBody = {
                title: "string title",
                text: "",
                image: "https://picsum.photos/200"
            }

            const { status } = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 image must be a URL", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text",
                    image: "https://picsum.photos/200"
                }
            })

            const postBody = {
                title: "string title",
                text: "string text",
                image: ""
            }

            const { status } = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 title need to be a string", async () => {
            //const response = await request(app.getHttpServer())
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text",
                    image: "https://picsum.photos/200"
                }
            })

            const responseNumber = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: 0,
                    text: "string username"
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: true,
                    text: "string username"
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: false,
                    text: "string username"
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: [],
                    text: "string username"
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: {},
                    text: "string username"
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: undefined,
                    text: "string username"
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: null,
                    text: "string username"
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 text need to be a string", async () => {
            //const response = await request(app.getHttpServer())
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text",
                    image: "https://picsum.photos/200"
                }
            })

            const responseNumber = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: "string username",
                    text: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: "string username",
                    text: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: "string username",
                    text: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: "string username",
                    text: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: "string username",
                    text: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: "string username",
                    text: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: "string username",
                    text: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 strange keys in body object", async () => {
            //const response = await request(app.getHttpServer())
            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text",
                    image: "https://picsum.photos/200"
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`/posts/${newPost.id}`)
                .send({
                    title: "string title",
                    text: "string username",
                    strange: "strange"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("DELETE /posts/:id => should delete id post data; status code 200", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "oi",
                    text: "sim"
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`/posts/${newPost.id}`);
            expect(status).toBe(HttpStatus.OK);

            const postExists = await prisma.post.findFirst({
                where: { id: newPost.id }
            })
            expect(postExists).toBe(null);
        });

        it("DELETE /posts/:id => should return 404 not found post", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "oi",
                    text: "sim"
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`/posts/${newPost.id + 10}`);
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("DELETE /posts/:id => should return 403 Forbidden post attachet to a published publication", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "oi",
                    text: "sim"
                }
            })

            const newMedia = await prisma.media.create({
                data: {
                    title: "oi",
                    username: "sim"
                }
            })

            await prisma.publication.create({
                data: {
                    postId: newPost.id,
                    mediaId: newMedia.id,
                    date: new Date("2000-05-05")
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`/posts/${newPost.id}`)

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it("DELETE /posts/:id => should return 403 Forbidden post attachet to a future publication", async () => {
            const newPost = await prisma.post.create({
                data: {
                    title: "oi",
                    text: "sim"
                }
            })

            const newMedia = await prisma.media.create({
                data: {
                    title: "oi",
                    username: "sim"
                }
            })

            await prisma.publication.create({
                data: {
                    postId: newPost.id,
                    mediaId: newMedia.id,
                    date: new Date("2050-05-05")
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`/posts/${newPost.id}`)

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });
    });

    describe("/publications integration tests", () => {
        it("GET /health => should get an alive message from publications", async () => {
            const { status, text } = await request(app.getHttpServer())
                .get("/publications/health")
            expect(status).toBe(HttpStatus.OK);
            expect(text).toBe("Publications online!")
        });

        it("POST /publications => should create a post data without image; status code 200", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const { status, text } = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: "2029-08-21"
                });
            expect(status).toBe(HttpStatus.CREATED);
        });

        it("POST /publications => should return status code 400 mediaId missing", async () => {
            await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const { status, text } = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    postId: newPost.id,
                    date: "2029-08-21"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications => should return status code 400 postId missing", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const { status, text } = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    date: "2029-08-21"
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications => should return status code 400 date missing", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const { status, text } = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications => should return status code 400 date empty", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const { status, text } = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: ""
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications/ => should return status code 400 date need to be a string", async () => {
            //const response = await request(app.getHttpServer())
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const responseNumber = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications/ => should return status code 400 mediaId need to be a number", async () => {
            //const response = await request(app.getHttpServer())
            await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const responseString = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: "newMedia.id",
                    postId: newPost.id,
                    date: "2029-08-21"
                });
            expect(responseString.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: true,
                    postId: newPost.id,
                    date: "2029-08-21"
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: false,
                    postId: newPost.id,
                    date: "2029-08-21"
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: [],
                    postId: newPost.id,
                    date: "2029-08-21"
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: {},
                    postId: newPost.id,
                    date: "2029-08-21"
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: undefined,
                    postId: newPost.id,
                    date: "2029-08-21"
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: null,
                    postId: newPost.id,
                    date: "2029-08-21"
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications/ => should return status code 400 postId need to be a number", async () => {
            //const response = await request(app.getHttpServer())
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const responseString = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: "newPost.id",
                    date: "2029-08-21"
                });
            expect(responseString.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: true,
                    date: "2029-08-21"
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: false,
                    date: "2029-08-21"
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: [],
                    date: "2029-08-21"
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: {},
                    date: "2029-08-21"
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: undefined,
                    date: "2029-08-21"
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: null,
                    date: "2029-08-21"
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications => should return status code 400 strange keys in body object", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            const { status, text } = await request(app.getHttpServer())
                .post(`/publications`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: "2029-08-21",
                    strange: null
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("GET /publcations => should return an array post data when with data without filters; status code 200", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date("2029-05-05")
                }, {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date("2029-05-05")
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`/publications/`);

            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true)
            for (const publication of body) {
                expect(publication.hasOwnProperty('id') &&
                    publication.hasOwnProperty('mediaId') &&
                    publication.hasOwnProperty('postId') &&
                    publication.hasOwnProperty('date'))
                    .toBe(true);
            }
        });

        it("GET /publcations => should return an empty array when without data; status code 200", async () => {
            const { status, body } = await request(app.getHttpServer())
                .get(`/publications/`);

            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true);
            expect(body.length === 0).toBe(true);
        });

        //it("GET /publcations => should return status code 400 published need to be a string 'true' or 'false'", async () => {
        it("GET /publcations/?published=true => should return an array post data when with data with filter published true; status code 200", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date("3000-05-05")
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date()
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date("1500-05-05")
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`/publications/?published=true`);

            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true)
            for (const publication of body) {
                expect(publication.hasOwnProperty('id') &&
                    publication.hasOwnProperty('mediaId') &&
                    publication.hasOwnProperty('postId') &&
                    publication.hasOwnProperty('date'))
                    .toBe(true);
            }
            expect(body.length === 2).toBe(true);
        });

        it("GET /publcations/?published=false => should return an array post data when with data with filter published false; status code 200", async () => {
            const newMedia = await prisma.media.create({
                data: {
                    title: "string title",
                    username: "string username"
                }
            })

            const newPost = await prisma.post.create({
                data: {
                    title: "string title",
                    text: "string text"
                }
            })

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date("3000-05-05")
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date()
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date("1500-05-05")
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`/publications/?published=false`);

            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true)
            for (const publication of body) {
                expect(publication.hasOwnProperty('id') &&
                    publication.hasOwnProperty('mediaId') &&
                    publication.hasOwnProperty('postId') &&
                    publication.hasOwnProperty('date'))
                    .toBe(true);
            }
            expect(body.length === 1).toBe(true);
        });


    });




});
