import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.publication.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.media.deleteMany({});

    const mediaDataObj = [{
        title: "instagram",
        username: "https://www.instagram.com/USERNAME"
    }, {
        title: "wapp",
        username: "https://www.wapp.com/USERNAME"
    }, {
        title: "telegram",
        username: "https://www.telegram.com/USERNAME"
    }, {
        title: "facebook",
        username: "https://www.facebook.com/USERNAME"
    }];
    const createdMedias = [];
    for (const media of mediaDataObj) {
        const createdMedia = await prisma.media.create({
            data: media
        });
        createdMedias.push(createdMedia);
    }

    const postDataObj = [{
        title: "1Why you should have a guinea pig?",
        text: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
        image: "https://picsum.photos/469"
    }, {
        title: "2Why you should have a guinea pig?",
        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab"
    }, {
        title: "3Why you should have a guinea pig?",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?"
    }, {
        title: "4Why you should have a guinea pig?",
        text: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
        image: "https://picsum.photos/469"
    }];
    const createdPosts = [];
    for (const post of postDataObj) {
        const createdPost = await prisma.post.create({
            data: post
        });
        createdPosts.push(createdPost);
    }

    const createdPublications = [];
    for (let i = 0; i < createdPosts.length; i++) {
        const publication = {
            mediaId: createdMedias[i].id,
            postId: createdPosts[i].id,
            date: new Date(`2023-09-${i + 20}`)
        }
        createdPublications.push(publication);
    }
    //console.log(createdPublications);
    await prisma.publication.createMany({
        data: createdPublications
    })

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })