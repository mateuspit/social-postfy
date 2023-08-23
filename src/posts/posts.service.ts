import { Injectable } from '@nestjs/common';
import { PostClass } from './entities/posts.entites';

@Injectable()
export class PostsService {

    private posts: PostClass[] = [
        new PostClass(1, "1Why you should have a guinea pig?", "1https://www.guineapigs.com/why-you-should-guinea"),
        new PostClass(2, "2Why you should have a guinea pig?", "2https://www.guineapigs.com/why-you-should-guinea", "https://picsum.photos/200"),
        new PostClass(3, "3Why you should have a guinea pig?", "3https://www.guineapigs.com/why-you-should-guinea"),
        new PostClass(4, "4Why you should have a guinea pig?", "4https://www.guineapigs.com/why-you-should-guinea", "https://picsum.photos/200")
    ]

    getHealthPostsService(): string {
        return 'Posts online!';
    }

    addNewPostService({ title, text, image }): void {
        //throw new Error('Method not implemented.');
        const lastElementIndex = this.posts.length - 1;
        this.posts.push(new PostClass(this.posts[lastElementIndex].id + 1, title, text, image))
    }

    getAllPostsService(): PostClass[] {
        return this.posts;
    }
}
