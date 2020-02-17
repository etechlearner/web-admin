import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

// ngrx
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import * as UserActions from '../../actions/user.actions';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    isLogginIn: boolean = false;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private store: Store<AppState>,
        private router: Router,
        private loginService: LoginService,
        private _snackBar: MatSnackBar,
        private authService: AuthService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    ngOnInit() {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.required]]
        });
        if (this.authService.isUserLoggedIn()) {
            this.router.navigateByUrl('dashboard')
        }
    }

    login() {
        this.isLogginIn = true;
        this.loginService.login(this.loginForm.value)
            .subscribe((res: any) => {
                this.isLogginIn = false;
                localStorage.setItem('access_token', res.access_token)
                this.router.navigateByUrl('dashboard')
            }, (err) => {
                this.isLogginIn = false;
                if (err.error && err.error.message) {
                    this._snackBar.open(err.error.message, 'Ok', {
                        duration: 2000,
                    });
                } else {
                    this._snackBar.open('Username/Password incorrect', 'Ok', {
                        duration: 2000,
                    });
                }
            })
    }

}
