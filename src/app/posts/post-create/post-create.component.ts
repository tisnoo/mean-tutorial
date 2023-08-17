import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
    templateUrl: './post-create.component.html',
    selector: 'app-post-create',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
    public post: Post;
    private mode = "create";
    private postId: string;
    isLoading = false;

    constructor(public postsService: PostsService, public route: ActivatedRoute){}

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has("postId")){
                this.mode = "edit";
                this.postId = paramMap.get("postId");
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    this.post = {id: postData._id, title: postData.title, content: postData.content};
                    this.isLoading = false;
                });
            }else {
                this.mode = "create";
                this.postId = null;
                this.post = null;
            }
        });
    }

    onSavePost(form: NgForm){
        if (form.invalid){
            return;
        }else{
            this.isLoading = true;
            if (this.mode === "create"){
                this.postsService.addPost(form.value.title, form.value.content);
            } else{
                this.postsService.updatePost(this.postId, form.value.title, form.value.content);
            }
            form.resetForm();
        }
    }
}