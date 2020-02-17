import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


/** Simulate server replying to file upload request */
@Injectable()
export class InterceptorService implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Conditional route check
        // if (req.url.indexOf('/upload/file') === -1) {
        // return next.handle(
        //     req.clone({
        //       headers: req.headers.append('Authorization', 'Bearer ' + token)
        //     })
        //   );
        //   return next.handle(req); // do nothing
        // }

        // Add token to request
        const token: string = localStorage.getItem('access_token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        // Set headers
        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }
        // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        // Add base url
        // const _request = request.clone({ url: `https://dev.gymrabbit.io/${request.url}` });
        return next.handle(request);
    }
}