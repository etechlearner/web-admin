import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from 'app/app.state';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private store: Store<AppState>,
        private router: Router
    ) { }

    isUserLoggedIn(): boolean {
        let token = localStorage.getItem('access_token');
        if (token) {
            return true
        } else {
            return false
        }
    }

    logout() {
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('login');
    }
}
