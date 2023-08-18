import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({selector: 'app-header', templateUrl: './header.component.html', styleUrls: ["./header.component.css"]})
export class HeaderComponent implements OnInit, OnDestroy {
    private authListenerSub: Subscription;
    userIsAuthenticated = false;

    constructor(private authService: AuthService){}
    
    
    ngOnDestroy() {
        this.authListenerSub.unsubscribe();
    }
    
    ngOnInit() {
        this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        })
        this.userIsAuthenticated = this.authService.getIsAuth();
    }

    onLogout(){
        this.authService.logoutUser();
    }
}