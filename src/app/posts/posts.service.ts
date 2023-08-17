import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({providedIn: "root"})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router){}

    getPosts(){
        this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts').pipe(map((postData) => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                }
            })
        })).subscribe((posts) => {
            this.posts = posts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPost(postId: string){
        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + postId);
    }

    addPost(title: string, content: string){
        const post = {title: title, content: content, id: null};
        this.http.post<{message:string, postId: string}>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
            post.id = responseData.postId;
            this.posts.push(post);  
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }

    updatePost(postId: string, title: string, content: string){
        const post = {title: title, content: content, id: postId};
        this.http.patch('http://localhost:3000/api/posts/' + postId, post).subscribe((responseData) => {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex((post) => post.id === postId);
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }

    deletePost(postId: string){
        this.http.delete('http://localhost:3000/api/posts/' + postId).subscribe((responseData) => {
            const updatedPosts = this.posts.filter((post) => post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }
}