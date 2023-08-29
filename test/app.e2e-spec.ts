import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { describe } from 'node:test';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaFactory } from './factories/medias.factory';
import { PostFactory } from './factories/posts.factory';
import { PublicationFactory } from './factories/publications.factory';

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
    const strangeArgument = "strangeArgument";
    it('GET /health => should get an alive message from app', async () => {
        const { status, text } = await request(app.getHttpServer())
            .get('/health');
        expect(status).toBe(HttpStatus.OK);
        expect(text).toBe("App online!");
    });

    const mediasRoute = `/medias/`;
    const mediasHealthRoute = `/medias/health`;
    describe("/medias integration tests", () => {
        it("GET /health => should get an alive message from medias", async () => {
            const { status, text } = await request(app.getHttpServer())
                .get(`${mediasHealthRoute}`);
            expect(status).toBe(HttpStatus.OK);
            expect(text).toBe("Medias online!")
        });

        it("POST /medias => should create a media data; status code 200", async () => {

            const postBody = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: postBody.username
                });

            const mediaReturn = await prisma.media.findFirst({
                where: {
                    title: postBody.title,
                    username: postBody.username
                }
            })

            expect(mediaReturn).toEqual(
                expect.objectContaining(
                    postBody
                )
            )
            expect(status).toBe(HttpStatus.CREATED);
        });

        it("POST /medias => should return status code 400 title missing", async () => {

            const postBody = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    username: postBody.username
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 username missing", async () => {

            const postBody = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 strange keys in body object", async () => {

            const postBody = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: postBody.username,
                    strangeArgument
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 title need to be a string", async () => {

            const postBody = await new MediaFactory().buildMediaFaker();

            const responseNumber = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: 0,
                    username: postBody.username
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: true,
                    username: postBody.username
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: false,
                    username: postBody.username
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: [],
                    username: postBody.username
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: {},
                    username: postBody.username
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: undefined,
                    username: postBody.username
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: null,
                    username: postBody.username
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 username need to be a string", async () => {

            const postBody = await new MediaFactory().buildMediaFaker();

            const responseNumber = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 title empty", async () => {

            const postBody = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: "",
                    username: postBody.username
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should return status code 400 username empty", async () => {

            const postBody = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send({
                    title: postBody.title,
                    username: ""
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /medias => should be unique return status code 409", async () => {


            const postBody = await new MediaFactory().buildMediaDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .post(`${mediasRoute}`)
                .send(postBody);
            expect(expect.objectContaining(postBody))
            expect(status).toBe(HttpStatus.CONFLICT);
        });

        it("GET /medias => should return an array media data when with data; status code 200", async () => {

            await new MediaFactory().buildMediaManyDBFaker(prisma);

            const { status, body } = await request(app.getHttpServer())
                .get(`${mediasRoute}`);
            expect(status).toBe(HttpStatus.OK);
            expect(Array.isArray(body)).toBe(true);
            expect(body).toHaveLength(2)
            expect(body).toEqual((
                expect.arrayContaining(body)
            ))
        });

        it("GET /medias => should return an empty array when without data; status code 200", async () => {
            const { status, body } = await request(app.getHttpServer())
                .get(`${mediasRoute}`);
            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining([])
            );
            expect(body).toHaveLength(0);
        });

        it("GET /medias:id => should return an object media data if data exists", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const { status, body } = await request(app.getHttpServer())
                .get(`${mediasRoute}${newMedia.id}`);
            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.objectContaining(newMedia)
            );
        });

        it("GET /medias:id => should return status code 404 when media by id not found", async () => {

            await new MediaFactory().buildMediaDBFaker(prisma);

            const lastMediaInDB = await prisma.media.findFirst({
                select: {
                    id: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const { status } = await request(app.getHttpServer())
                .get(`${mediasRoute}${lastMediaInDB.id + 10}`);
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("PUT /medias/:id =>  should update a media data; status code 200", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const updateNewData = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.title,
                    username: updateNewData.username
                });

            const updatedMedia = await prisma.media.findFirst({
                where: updateNewData
            })

            expect(status).toBe(HttpStatus.OK);
            expect(updatedMedia).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    ...updateNewData
                })
            );
        });

        it("PUT /medias/:id =>  should return 404 id media not found", async () => {

            await new MediaFactory().buildMediaDBFaker(prisma);

            const updateNewData = await new MediaFactory().buildMediaFaker();

            const lastMediaInDB = await prisma.media.findFirst({
                select: {
                    id: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const { status } = await request(app.getHttpServer())
                .patch(`${mediasRoute}${lastMediaInDB.id + 10}`)
                .send({
                    title: updateNewData.title,
                    username: updateNewData.username
                });
            expect(status).toBe(HttpStatus.NOT_FOUND)
        });

        it("PUT /medias/:id => should return status code 400 title missing", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const updateNewData = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    username: updateNewData.username
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 username missing", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const updateNewData = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.title
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 strange keys in body object", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const updateNewData = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.title,
                    username: updateNewData.username,
                    strangeArgument
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 title need to be a string", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const updateNewData = await new MediaFactory().buildMediaFaker();

            const responseNumber = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: 0,
                    username: updateNewData.username
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: true,
                    username: updateNewData.username
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: false,
                    username: updateNewData.username
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: [],
                    username: updateNewData.username
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: {},
                    username: updateNewData.username
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: undefined,
                    username: updateNewData.username
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: null,
                    username: updateNewData.username
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 username need to be a string", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const updateNewData = await new MediaFactory().buildMediaFaker();

            const responseNumber = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.username,
                    username: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.username,
                    username: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.username,
                    username: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.username,
                    username: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.username,
                    username: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.username,
                    username: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.username,
                    username: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 title empty", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const updateNewData = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: "",
                    username: updateNewData.username
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should return status code 400 username empty", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const updateNewData = await new MediaFactory().buildMediaFaker();

            const { status } = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: updateNewData.title,
                    username: ""
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /medias/:id => should be unique return status code 409", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .patch(`${mediasRoute}${newMedia.id}`)
                .send({
                    title: newMedia.title,
                    username: newMedia.username
                });
            expect(status).toBe(HttpStatus.CONFLICT);
        });

        it("DELETE /media/:id => should delete id media data; status code 200", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .delete(`${mediasRoute}${newMedia.id}`);

            const mediaExists = await prisma.media.findFirst({
                where: { id: newMedia.id }
            })

            expect(mediaExists).toBe(null);
            expect(status).toBe(HttpStatus.OK);
        });

        it("DELETE /media/:id => should return 404 not found media", async () => {

            await new MediaFactory().buildMediaDBFaker(prisma);

            const lastMediaInDB = await prisma.media.findFirst({
                select: {
                    id: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const { status } = await request(app.getHttpServer())
                .delete(`${mediasRoute}${lastMediaInDB.id + 10}`);

            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("DELETE /media/:id => should return 403 Forbidden media attachet to a published publication", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await new PublicationFactory(newMedia.id, newPost.id, new Date(publicationFutureDate1))
                .buildPublicationDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .delete(`${mediasRoute}${newMedia.id}`);

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it("DELETE /media/:id => should return 403 Forbidden media attachet to a future publication", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await new PublicationFactory(newMedia.id, newPost.id, new Date(publicationFutureDate1))
                .buildPublicationDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .delete(`${mediasRoute}${newMedia.id}`);

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });
    });

    const postsRoute = `/posts/`;
    const postsHealthRoute = `/posts/health`;
    describe("/posts integration tests", () => {
        it("GET /health => should get an alive message from posts", async () => {
            const { status, text } = await request(app.getHttpServer())
                .get(`${postsHealthRoute}`);
            expect(status).toBe(HttpStatus.OK);
            expect(text).toBe("Posts online!")
        });

        it("POST /posts => should create a post data without image; status code 200", async () => {
            const postBody = await new PostFactory().buildPostWOImageFaker();

            const { status } = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send(postBody);

            const postExists = await prisma.post.findFirst({
                where: postBody
            })
            expect(status).toBe(HttpStatus.CREATED);
            expect(postExists).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    ...postBody
                })
            )
        });

        it("POST /posts => should create a post data with image; status code 200", async () => {

            const postBody = await new PostFactory().buildPostWImageFaker();

            const { status } = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send(postBody);

            const postExists = await prisma.post.findFirst({
                where: postBody
            })

            expect(status).toBe(HttpStatus.CREATED);
            expect(postExists).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    ...postExists
                })
            )
        });

        it("POST /posts => should return status code 400 title missing", async () => {
            const postBody = await new PostFactory().buildPostWImageFaker();
            delete postBody.title;

            const { status } = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 text missing", async () => {
            const postBody = await new PostFactory().buildPostWImageFaker();
            delete postBody.text;

            const { status } = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 title empty", async () => {
            const postBody = await new PostFactory().buildPostWImageFaker();
            postBody.title = "";

            const { status } = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 text empty", async () => {
            const postBody = await new PostFactory().buildPostWImageFaker();
            postBody.text = "";

            const { status } = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 image must be a URL", async () => {
            const postBody = await new PostFactory().buildPostWImageFaker();
            postBody.image = "";

            const { status } = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 title need to be a string", async () => {
            const postBody = await new PostFactory().buildPostWImageFaker();

            const responseNumber = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: 0,
                    text: postBody.text
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: true,
                    text: postBody.text
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: false,
                    text: postBody.text
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: [],
                    text: postBody.text
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: {},
                    text: postBody.text
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: undefined,
                    text: postBody.text
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: null,
                    text: postBody.text
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 text need to be a string", async () => {
            const postBody = await new PostFactory().buildPostWImageFaker();

            const responseNumber = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: postBody.title,
                    text: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: postBody.title,
                    text: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: postBody.title,
                    text: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: postBody.title,
                    text: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: postBody.title,
                    text: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: postBody.title,
                    text: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: postBody.title,
                    text: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /posts => should return status code 400 strange keys in body object", async () => {
            const postBody = await new PostFactory().buildPostWImageFaker();

            const { status } = await request(app.getHttpServer())
                .post(`${postsRoute}`)
                .send({
                    title: postBody.title,
                    text: postBody.text,
                    strangeArgument
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("GET /posts => should return an array post data when with data; status code 200", async () => {
            await new PostFactory().buildPostWImageManyDBFaker(prisma)

            const { status, body } = await request(app.getHttpServer())
                .get(`${postsRoute}`);
            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(2)
        });

        it("GET /posts => should return an empty array when without data; status code 200", async () => {
            const { status, body } = await request(app.getHttpServer())
                .get(`${postsRoute}`);
            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining([])
            );
            expect(body).toHaveLength(0)
        });

        it("GET /posts/:id => should return status code 404 when post by id not found", async () => {
            await new PostFactory().buildPostWImageDBFaker(prisma);

            const lastPostInDB = await prisma.post.findFirst({
                select: {
                    id: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const { status } = await request(app.getHttpServer())
                .get(`${postsRoute}${lastPostInDB.id + 10}`);
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("GET /posts/:id => should return status an object with post by id", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const { status, body } = await request(app.getHttpServer())
                .get(`${postsRoute}${newPost.id}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.objectContaining(
                    body
                )
            )
        });

        it("PUT /posts/:id => should update a post data without image; status code 200", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const updatePostData = await new PostFactory().buildPostWOImageFaker();

            const { status } = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send(updatePostData);

            const updatedPost = await prisma.post.findFirst({
                where: updatePostData
            })

            expect(status).toBe(HttpStatus.OK);
            expect(updatedPost).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    ...updatePostData
                })
            )
        });

        it("PUT /posts/:id => should update a post data with image; status code 200", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const updatePostData = await new PostFactory().buildPostWImageFaker();

            const { status } = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send(updatePostData);

            const updatedPost = await prisma.post.findFirst({
                where: updatePostData
            })

            expect(status).toBe(HttpStatus.OK);
            expect(updatedPost).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    ...updatePostData
                })
            )
        });

        it("PUT /posts/:id => should return status code 400 title missing", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const postBody = await new PostFactory().buildPostWImageFaker();
            delete postBody.title;

            const { status } = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 text missing", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const postBody = await new PostFactory().buildPostWImageFaker();
            delete postBody.text;

            const { status } = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 title empty", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const postBody = await new PostFactory().buildPostWImageFaker();
            postBody.title = "";

            const { status } = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 text empty", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const postBody = await new PostFactory().buildPostWImageFaker();
            postBody.text = "";

            const { status } = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 image must be a URL", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const postBody = await new PostFactory().buildPostWImageFaker();
            postBody.image = "";

            const { status } = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send(postBody);
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 title need to be a string", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const postBody = await new PostFactory().buildPostWImageFaker();

            const responseNumber = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: 0,
                    text: postBody.text
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: true,
                    text: postBody.text
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: false,
                    text: postBody.text
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: [],
                    text: postBody.text
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: {},
                    text: postBody.text
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: undefined,
                    text: postBody.text
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: null,
                    text: postBody.text
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 text need to be a string", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const postBody = await new PostFactory().buildPostWImageFaker();

            const responseNumber = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: postBody.title,
                    text: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: postBody.title,
                    text: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: postBody.title,
                    text: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: postBody.title,
                    text: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: postBody.title,
                    text: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: postBody.title,
                    text: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    title: postBody.title,
                    text: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /posts/:id => should return status code 400 strange keys in body object", async () => {

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const postBody = await new PostFactory().buildPostWImageFaker();
            postBody["strangeArgument"] = "strangeArgument";

            const { status } = await request(app.getHttpServer())
                .patch(`${postsRoute}${newPost.id}`)
                .send({
                    postBody,
                    strangeArgument
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("DELETE /posts/:id => should delete id post data; status code 200", async () => {
            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .delete(`${postsRoute}${newPost.id}`);

            const postExists = await prisma.post.findFirst({
                where: { id: newPost.id }
            })
            expect(status).toBe(HttpStatus.OK);
            expect(postExists).toBe(null);
        });

        it("DELETE /posts/:id => should return 404 not found post", async () => {
            await new PostFactory().buildPostWImageDBFaker(prisma);

            const lastPostInDB = await prisma.post.findFirst({
                select: {
                    id: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const { status } = await request(app.getHttpServer())
                .delete(`${postsRoute}${lastPostInDB.id + 10}`);
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("DELETE /posts/:id => should return 403 Forbidden post attachet to a published publication", async () => {

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            await new PublicationFactory(newMedia.id, newPost.id, new Date(publicationsOldDate1))
                .buildPublicationDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .delete(`${postsRoute}${newPost.id}`)

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it("DELETE /posts/:id => should return 403 Forbidden post attachet to a future publication", async () => {

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            await prisma.publication.create({
                data: {
                    postId: newPost.id,
                    mediaId: newMedia.id,
                    date: new Date("2050-05-05")
                }
            })
            await new PublicationFactory(newMedia.id, newPost.id, new Date(publicationFutureDate1))
                .buildPublicationDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .delete(`${postsRoute}${newPost.id}`)

            expect(status).toBe(HttpStatus.FORBIDDEN);
        });
    });

    const publicationsRoute = `/publications/`;
    const publicationsHealthRoute = `/publications/health`;
    const publicationsPublishedFilterFalse = `published=false`;
    const publicationsPublishedFilterTrue = `published=true`;

    const date = new Date();
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0'); // Garante que tenha dois dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lembre-se que os meses são indexados de 0 a 11
    const today = `${year}-${month}-${day}`;
    const publicationsAfterTodayDate = `after=${new Date(today)}`;

    const publicationsOldDate1 = `1500-05-05`;
    const publicationsOldDate2 = `1600-05-05`;
    const publicationsAfterOldDate = `after=${publicationsOldDate1}`;
    const publicationFutureDate1 = `3050-05-05`;
    const publicationFutureDate2 = `3100-05-05`;
    const publicationsAfterFutureDate = `after=${publicationFutureDate1}`;

    describe("/publications integration tests", () => {
        const date = new Date();
        const year = date.getFullYear();
        const day = String(date.getDate()).padStart(2, '0'); // Garante que tenha dois dígitos
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lembre-se que os meses são indexados de 0 a 11
        const today = `${year}-${month}-${day}`;
        it("GET /health => should get an alive message from publications", async () => {
            const { status, text } = await request(app.getHttpServer())
                .get(`${publicationsHealthRoute}`)
            expect(status).toBe(HttpStatus.OK);
            expect(text).toBe("Publications online!")
        });

        it("POST /publications => should create a publication data; status code 200", async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: publicationFutureDate1
                });

            const publicationExist = await prisma.publication.findFirst({
                where: {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            expect(publicationExist).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                })
            )
            expect(status).toBe(HttpStatus.CREATED);
        });

        it("POST /publications => should return status code 400 mediaId missing", async () => {
            await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    postId: newPost.id,
                    date: publicationFutureDate1
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications => should return status code 400 postId missing", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    date: publicationFutureDate1
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications => should return status code 400 date missing", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications => should return status code 400 date empty", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: ""
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications/ => should return status code 400 date need to be a string", async () => {
            //const response = await request(app.getHttpServer())
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const responseNumber = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications/ => should return status code 400 mediaId need to be a number", async () => {

            await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const responseString = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: "newMedia.id",
                    postId: newPost.id,
                    date: publicationFutureDate1
                });
            expect(responseString.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: true,
                    postId: newPost.id,
                    date: publicationFutureDate1
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: false,
                    postId: newPost.id,
                    date: publicationFutureDate1
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: [],
                    postId: newPost.id,
                    date: publicationFutureDate1
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: {},
                    postId: newPost.id,
                    date: publicationFutureDate1
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: undefined,
                    postId: newPost.id,
                    date: publicationFutureDate1
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: null,
                    postId: newPost.id,
                    date: publicationFutureDate1
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications/ => should return status code 400 postId need to be a number", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const responseString = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: "newPost.id",
                    date: publicationFutureDate1
                });
            expect(responseString.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: true,
                    date: publicationFutureDate1
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: false,
                    date: publicationFutureDate1
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: [],
                    date: publicationFutureDate1
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: {},
                    date: publicationFutureDate1
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: undefined,
                    date: publicationFutureDate1
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: null,
                    date: publicationFutureDate1
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("POST /publications => should return status code 400 strange keys in body object", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const { status } = await request(app.getHttpServer())
                .post(`${publicationsRoute}`)
                .send({
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: publicationFutureDate1,
                    strangeArgument
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("GET /publucations => should return an array post data when with data without filters; status code 200", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                }, {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
        });

        it("GET /publucations => should return an empty array when without data; status code 200", async () => {
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual([]);
        });

        it("GET /publucations/?published=true => should return an array publucation data when with data; status code 200", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsPublishedFilterTrue}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(2);
        });

        it("GET /publucations/?published=false => should return an array publucation data when with data; status code 200", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsPublishedFilterFalse}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(1);
        });

        it("GET /publucations/?published=wrongInput => should return status code 400 must be just 'true' or 'false'", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                }]
            })
            const { status } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?published=wrongInput`);

            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("GET /publucations/?after=27/08/3050 => should return status code 400 must be YYYY-MM-DD", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate2)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                }]
            })
            const { status } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?after=27/08/3050`);

            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("GET /publucations/?published=wrongInput&after=27/08/3050 => should return status code 400 published must be just 'true' or 'false' and after must be YYYY-MM-DD", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                }, {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate2)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                }]
            })
            const { status } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?published=wrongInput&after=27/08/3050`);

            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("GET /publucations/?after=oldDate => should return an array publucation data when with data; status code 200", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate2)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsAfterOldDate}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(3);
        });

        it("GET /publucations/?after=today => should return an array publucation data when with data; status code 200", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate2)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsAfterTodayDate}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(1);
        });

        it("GET /publucations/?after=future => should return an array publucation data when with data; status code 200", async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate2)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate2)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsAfterFutureDate}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(1);
        });

        it(`GET /publucations/?published=true&after=oldDate => should return an array publucation data when with data with filter; status code 200`, async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate2)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsPublishedFilterTrue}&${publicationsAfterOldDate}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(2);
        });

        it(`GET /publucations/?published=true&after=today => should return an array publucation data when with data with filter; status code 200`, async () => {

            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate2)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsPublishedFilterTrue}&${publicationsAfterTodayDate}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(0);
        });

        it(`GET /publucations/?published=true&after=future => should return an array publucation data when with data with filter; status code 200`, async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate2)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate2)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsPublishedFilterTrue}&${publicationsAfterFutureDate}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(0);
        });

        it(`GET /publucations/?published=false&after=oldDate => should return an array publucation data when with data with filter; status code 200`, async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate2)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate2)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsPublishedFilterFalse}&${publicationsAfterOldDate}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(2);
        });

        it(`GET /publucations/?published=false&after=today => should return an array publucation data when with data with filter; status code 200`, async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate2)
                }, {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate2)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsPublishedFilterFalse}&${publicationsAfterTodayDate}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(2);
        });

        it(`GET /publucations/?published=false&after=future => should return an array publucation data when with data with filter; status code 200`, async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            await prisma.publication.createMany({
                data: [{
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate2)
                }, {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(today)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate1)
                },
                {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationsOldDate2)
                }]
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}?${publicationsPublishedFilterFalse}&${publicationsAfterFutureDate}`);

            expect(status).toBe(HttpStatus.OK);
            expect(body).toEqual(
                expect.arrayContaining(body)
            );
            expect(body).toHaveLength(1);
        });

        it(`GET /publications/:id => should return status code 404 when publucation by id not found`, async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate2)
                }
            })
            const { status } = await request(app.getHttpServer())
                .get(`${publicationsRoute}${newPublication.id + 10}`);

            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it(`GET /publications/:id => should return an object by id when publication found`, async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate2)
                }
            })
            const { status, body } = await request(app.getHttpServer())
                .get(`${publicationsRoute}${newPublication.id}`);

            expect(status).toBe(HttpStatus.OK);
        });

        it("PUT /publications/:id => should update a publication data by id; status code 200", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: new Date(newPublication.date.setDate(newPublication.date.getDate() + 10))
                });

            const updatedPublication = await prisma.publication.findFirst({
                where: { id: newPublication.id }
            })

            expect(status).toBe(HttpStatus.OK);
            expect(updatedPublication).toEqual(
                expect.objectContaining({
                    id: newPublication.id,
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: updatedPublication.date
                })
            );
        });

        it("PUT /publications/:id => should return status code 403 publication published", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: new Date()
                });
            expect(status).toBe(HttpStatus.FORBIDDEN);
        });

        it("PUT /publications/:id => should return status code 404 mediaId data not found", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id + 10,
                    postId: newPost2.id,
                    date: new Date(newPublication.date.setDate(newPublication.date.getDate() + 10))
                });
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("PUT /publications/:id => should return status code 404 postId data not found", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id + 10,
                    date: new Date(newPublication.date.setDate(newPublication.date.getDate() + 10))
                });
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("PUT /publications/:id => should return status code 404 when publication by id not found", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id + 10}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: new Date(newPublication.date.setDate(newPublication.date.getDate() + 10))
                });
            expect(status).toBe(HttpStatus.NOT_FOUND);
        });

        it("PUT /publications/:id => should return status code 400 mediaId missing", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    postId: newPost2.id,
                    date: newPublication.date.setDate(newPublication.date.getDate() + 10)
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /publications/:id => should return status code 400 postId missing", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    date: publicationFutureDate1
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /publications/:id => should return status code 400 date missing", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /publications/:id => should return status code 400 date empty", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: ""
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /publications/:id/ => should return status code 400 date need to be a string", async () => {
            //const response = await request(app.getHttpServer())
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const responseNumber = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: 0
                });
            expect(responseNumber.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: true
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: false
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: []
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: {}
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: undefined
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: null
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /publications/:id/ => should return status code 400 mediaId need to be a number", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const responseString = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: "newMedia.id",
                    postId: newPost2.id,
                    date: publicationFutureDate1
                });
            expect(responseString.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: true,
                    postId: newPost2.id,
                    date: publicationFutureDate1
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: false,
                    postId: newPost2.id,
                    date: publicationFutureDate1
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: [],
                    postId: newPost2.id,
                    date: publicationFutureDate1
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: {},
                    postId: newPost2.id,
                    date: publicationFutureDate1
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: undefined,
                    postId: newPost2.id,
                    date: publicationFutureDate1
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: null,
                    postId: newPost2.id,
                    date: publicationFutureDate1
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /publications/:id/ => should return status code 400 postId need to be a number", async () => {
            //const response = await request(app.getHttpServer())
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const responseString = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: "newPost.id",
                    date: publicationFutureDate1
                });
            expect(responseString.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanTrue = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: true,
                    date: publicationFutureDate1
                });
            expect(responseBooleanTrue.status).toBe(HttpStatus.BAD_REQUEST);

            const responseBooleanFalse = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: false,
                    date: publicationFutureDate1
                });
            expect(responseBooleanFalse.status).toBe(HttpStatus.BAD_REQUEST);

            const responseArray = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: [],
                    date: publicationFutureDate1
                });
            expect(responseArray.status).toBe(HttpStatus.BAD_REQUEST);

            const responseObject = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: {},
                    date: publicationFutureDate1
                });
            expect(responseObject.status).toBe(HttpStatus.BAD_REQUEST);

            const responseUndefined = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: undefined,
                    date: publicationFutureDate1
                });
            expect(responseUndefined.status).toBe(HttpStatus.BAD_REQUEST);

            const responseNull = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: null,
                    date: publicationFutureDate1
                });
            expect(responseNull.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("PUT /publications/:id => should return status code 400 strange keys in body object", async () => {
            const newMedia1 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newMedia2 = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost1 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPost2 = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia1.id,
                    postId: newPost1.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .patch(`${publicationsRoute}${newPublication.id}`)
                .send({
                    mediaId: newMedia2.id,
                    postId: newPost2.id,
                    date: publicationFutureDate1,
                    strangeArgument
                });
            expect(status).toBe(HttpStatus.BAD_REQUEST);
        });

        it(`DELETE /publications/:id => should delete a publucation data by id`, async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`${publicationsRoute}${newPublication.id}`);
            expect(status).toBe(HttpStatus.OK)
        });

        it(`DELETE /publications/:id => should return status code 404 when publication by id not found`, async () => {
            const newMedia = await new MediaFactory().buildMediaDBFaker(prisma);

            const newPost = await new PostFactory().buildPostWImageDBFaker(prisma);

            const newPublication = await prisma.publication.create({
                data: {
                    mediaId: newMedia.id,
                    postId: newPost.id,
                    date: new Date(publicationFutureDate1)
                }
            })

            const { status } = await request(app.getHttpServer())
                .delete(`${publicationsRoute}${newPublication.id + 10}`);
            expect(status).toBe(HttpStatus.NOT_FOUND)
        });
    });
});
