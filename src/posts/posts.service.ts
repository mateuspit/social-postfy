import { Injectable } from '@nestjs/common';
import { PostClass } from './entities/posts.entites';
import { notFoundPostError } from './errors/posts.errors';
import { PostDTO } from './DTO/posts.DTO';

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

    addNewPostService(post: PostClass): void {
        //throw new Error('Method not implemented.');
        const lastElementIndex = this.posts.length - 1;
        this.posts.push(new PostClass(this.posts[lastElementIndex].id + 1, post.title, post.text, post.image))
    }

    getAllPostsService(): PostClass[] {
        return this.posts;
    }

    getPostByIdService(id: number): PostClass {
        //throw new Error('Method not implemented.');
        const postExist = this.posts.find((pobj => pobj.id === id))
        if (!postExist) {
            throw notFoundPostError();
        }
        return postExist;
    }

    updatePostByIdService(id: number, postBody: PostClass) {
        //throw new Error('Method not implemented.');
        const postExist = this.getPostByIdService(id);
        postExist.changePostData(postBody.title, postBody.text, postBody.image);
        console.log(`Post ${id} atualizado`);
    }

    deletePostByIdService(id: number) {
        //throw new Error('Method not implemented.');
        const postExist = this.getPostByIdService(id);
        //FEAT
        //
        //ANALYSE IF MEDIA HAS PUBLICATION
        //IF YES, ERROR 403 FORBIDDEN
        const deletePostIndex = this.posts.findIndex(pobj => pobj.id === postExist.id)
        //console.log(deletePostIndex, "deletePostIndex");
        //console.log("this.posts1", this.posts);
        //console.log("this.posts1[deletePostIndex]", this.posts[deletePostIndex]);
        this.posts.splice((deletePostIndex), 1)
        //console.log("this.posts2",this.posts);
        console.log(`Post ${id} deletado`);
    }

}
