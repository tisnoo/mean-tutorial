import {Component} from '@angular/core';

@Component({
    templateUrl: './post-create.component.html',
    selector: 'app-post-create',
})
export class PostCreateComponent {
    newPost = "No content.";
    enteredValue = "";

    onAddPost(){
        this.newPost = this.enteredValue;
    }
}