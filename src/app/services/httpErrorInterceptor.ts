import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
  HttpErrorResponse, HttpResponseBase
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry'; // don't forget the imports
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
          // this.errorDialogService.openDialog(event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        //  if (error instanceof HttpErrorResponse) {
        //    if (this.is2xxStatus(error)) {
        let data = {};
        data = {
          reason: error && error.error.reason ? error.error.reason : '',
          status: error.status
        };
        console.error(`Backend returned code ${error.status}, body was: ${data}`);
        return throwError(error);
        // }
        // }
      })
    );
  }
  private is2xxStatus(response: HttpResponseBase) {
    return response.status >= 200 && response.status < 300 && response.statusText === 'OK';
  }
}