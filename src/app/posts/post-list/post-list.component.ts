import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
    isLoading = false;
    posts:Post[] = []
    private postSub: Subscription;


    constructor(public postsService: PostsService){}

    ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts();
        this.postSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
            this.posts = posts;
            this.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.postSub.unsubscribe();
    }

    onDelete(postId: string){
        this.postsService.deletePost(postId);
    }
}