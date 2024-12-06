import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ApiHelperService {
  private httpWithoutInterceptor: HttpClient = inject(HttpClient);
  _httpClient = inject(HttpClient);

  private formatErrors(error: any) {
    let errorMessage = '';
    if (error.hasOwnProperty('error')) {
      // client-side error
      if (error.error.hasOwnProperty('error')) {
        if (error.error.error.length !== 0) {
          errorMessage = `Error: ${JSON.stringify(error.error.error[0].msg)}`;
        } else {
          errorMessage = `Error: ${error.error.message}`;
        }
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(new Date() + '- ', errorMessage);
    return throwError(() => errorMessage);
  }

  get<T extends object>(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<T> {
    return this._httpClient
      .get<T>(`${environment.base_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this._httpClient
      .put(`${environment.base_url}${path}`, body)
      .pipe(catchError(this.formatErrors));
  }
  patch(path: string, body: Object = {}): Observable<any> {
    return this._httpClient
      .patch(`${environment.base_url}${path}`, body)
      .pipe(catchError(this.formatErrors));
  }
  putImage(
    path: string,
    body: Object = {},
    isPublicRead = false
  ): Observable<any> {
    let headers = new HttpHeaders();
    if (isPublicRead) headers = headers.append('x-amz-acl', 'public-read');
    return this.httpWithoutInterceptor
      .put(`${path}`, body, { headers })
      .pipe(catchError(this.formatErrors));
  }

  post<T extends object>(
    path: string,
    body: Object = {},
    options: Object = {}
  ): Observable<T> {
    return this._httpClient
      .post<T>(`${environment.base_url}${path}`, body, options)
      .pipe(catchError(this.formatErrors));
  }
  sendMail<T extends object>(
    path: string,
    formData: Object = {}
  ): Observable<T> {
    const url = `${environment.base_url}${path}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const body = {
      emails: ['ankit.technomize@gmail.com'],
      subject: "Delete Account Request | Mr Cashback",
      data: formData
    };
  
    return this._httpClient.post<T>(url, JSON.stringify(body), { headers })
      .pipe(catchError(this.formatErrors));
  }




  delete<T extends object>(path: string, body: Object = {}): Observable<T> {
    return this._httpClient
      .delete<T>(`${environment.base_url}${path}`, { body })
      .pipe(catchError(this.formatErrors));
  }
  /**
   * @description
   * This method is will not use interceptor
   */
  _get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpWithoutInterceptor
      .get(`${environment.base_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }
  /**
   * @description
   * This method is will not use interceptor
   */
  _put(path: string, body: Object = {}): Observable<any> {
    return this.httpWithoutInterceptor
      .put(`${environment.base_url}${path}`, body)
      .pipe(catchError(this.formatErrors));
  }
  /**
   * @description
   * This method is will not use interceptor
   */
  _post<T extends object>(
    path: string,
    body: Object = {},
    options: Object = {}
  ): Observable<T> {
    return this.httpWithoutInterceptor
      .post<T>(`${environment.base_url}${path}`, body, options)
      .pipe(catchError(this.formatErrors));
  }
  /**
   * @description
   * This method is will not use interceptor
   */
  _delete(path: string): Observable<any> {
    return this.httpWithoutInterceptor
      .delete(`${environment.base_url}${path}`)
      .pipe(catchError(this.formatErrors));
  }

  getIpCliente(): Observable<string> {
    return this._httpClient
      .get<{ ip: string }>('http://api.ipify.org/?format=json')
      .pipe(
        map((res) => {
          return res.ip;
        })
      );
  }
}
