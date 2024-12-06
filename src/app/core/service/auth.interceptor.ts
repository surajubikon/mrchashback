import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { USER_STORAGE_KEY } from '../constant/app.constant';
import { StorageService } from './storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private _storageService: StorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone({
      ...(this._storageService.getFromStorage(USER_STORAGE_KEY).token && {
        headers: request.headers.append(
          'X-auth-token',
          'bearer ' +
            this._storageService.getFromStorage(USER_STORAGE_KEY).token
        ),
      }),
    });
    return next.handle(modifiedRequest).pipe(
      finalize(() => {}),
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigateByUrl('/login');
        } else if (error.status === 0) {
          alert('Internet connection error');
        }
        return throwError(error);
      })
    );
  }
}
