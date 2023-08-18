import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { response } from "express";

@Injectable({providedIn: "root"})
export class AuthService {
    private token: string;
    private userId: string;
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

    getUserId(){
        return this.userId;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string){
        const user: AuthData = {
            email: email,
            password: password,
        }

        return this.http.post('http://localhost:3000/api/user/signup', user).subscribe(() => {
            this.router.navigate(['/']);
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    loginUser(email: string, password: string){
        const user: AuthData = {
            email: email,
            password: password,
        }

        this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', user).subscribe((responseData) => {
            this.token = responseData.token;

            if (this.token){
                const expiresInDurationInSeconds = responseData.expiresIn;
                this.setAuthTimer(expiresInDurationInSeconds);
                this.authStatusListener.next(true);
                this.isAuthenticated = true;
                this.userId = responseData.userId;
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDurationInSeconds * 1000)
                this.saveAuthData(this.token, expirationDate, this.userId);
                this.router.navigate(['/']);
            }
        }, error => {
            this.authStatusListener.next(false);
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
            this.userId = authInformation.userId;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000)
            this.authStatusListener.next(true);
        }
    }

    logoutUser(){
        this.token = null;
        this.userId = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string){
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("expiration", expirationDate.toISOString());
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expiration");
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logoutUser();
        }, duration * 1000);
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const expirationDate = localStorage.getItem("expiration");

        if (!token || !expirationDate){
            return;
        }

        return {
            userId: userId,
            token: token,
            expirationDate: new Date(expirationDate),
        }
    }
}