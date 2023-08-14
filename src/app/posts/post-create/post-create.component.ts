import {Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
    templateUrl: './post-create.component.html',
    selector: 'app-post-create',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
    constructor(public postsService: PostsService){}

    onAddPost(form: NgForm){
        if (form.invalid){
            return;
        }else{
            this.postsService.addPost(form.value.title, form.value.content);
            form.resetForm();
        }
    }
}