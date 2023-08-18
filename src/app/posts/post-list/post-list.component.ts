import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
    isLoading = false;
    posts:Post[] = [];
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10];
    private postSub: Subscription;
    private authListenerSub: Subscription;
    userIsAuthenticated = false;


    constructor(public postsService: PostsService, private authService: AuthService){}

    ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postSub = this.postsService.getPostUpdateListener().subscribe((postsData: {posts: Post[], postCount: number}) => {
            this.posts = postsData.posts;
            this.totalPosts = postsData.postCount;
            this.isLoading = false;
        });

        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        })

    }

    ngOnDestroy(): void {
        this.postSub.unsubscribe();
        this.authListenerSub.unsubscribe();
    }

    onDelete(postId: string){
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.postsPerPage = pageData.pageSize;
        this.currentPage = pageData.pageIndex + 1;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }
}