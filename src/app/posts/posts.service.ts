import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Post } from "./post.model";

@Injectable({providedIn: "root"})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    getPosts(): Post[]{
        return [...this.posts];
    }

    addPost(title: string, content: string){
        this.posts.push({title: title, content: content});
        this.postsUpdated.next(this.getPosts());
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }
}