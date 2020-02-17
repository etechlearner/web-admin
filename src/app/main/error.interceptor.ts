import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { AuthService } from './auth.service';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private _matSnackBar: MatSnackBar,
        private authService: AuthService
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                // location.reload(true);
                this._matSnackBar.open('Session expired, please login again.', 'OK', {
                    verticalPosition: 'bottom',
                    duration: 3000
                });
                this.authService.logout();
            } else if (err.status === 409 || err.status === 400 || err.status === 0) {
                if(err && err.error && err.error.message) {
                    this._matSnackBar.open(err.error.message, 'OK', {
                        verticalPosition: 'bottom',
                        duration: 3000
                    });
                }
            }

            console.log(err);
            // const error = err.error.message || err.statusText;
            // return false;
            return throwError(err);
        }));
    }
}
