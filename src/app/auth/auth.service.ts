import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";

@Injectable({providedIn: "root"})
export class AuthService {
    private token: string;
    private isAuthenticated = false;
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string){
        const user: AuthData = {
            email: email,
            password: password,
        }

        this.http.post('http://localhost:3000/api/user/signup', user).subscribe((responseData) => {
            console.log(responseData);
        });
    }

    loginUser(email: string, password: string){
        const user: AuthData = {
            email: email,
            password: password,
        }

        this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', user).subscribe((responseData) => {
            this.token = responseData.token;

            if (this.token){
                const expiresInDurationInSeconds = responseData.expiresIn;
                this.setAuthTimer(expiresInDurationInSeconds);
                this.authStatusListener.next(true);
                this.isAuthenticated = true;
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDurationInSeconds * 1000)
                this.saveAuthData(this.token, expirationDate);
                this.router.navigate(['/']);
            }
        });
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();

        if (!authInformation){
            return;
        }


        const now = new Date();
        const expiresIn = authInformation?.expirationDate.getTime() - now.getTime();

        if (expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000)
            this.authStatusListener.next(true);
        }
    }

    logoutUser(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
    }

    private saveAuthData(token: string, expirationDate: Date){
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logoutUser();
        }, duration * 1000);
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");

        if (!token || !expirationDate){
            return;
        }

        return {
            token: token,
            expirationDate: new Date(expirationDate),
        }
    }
}