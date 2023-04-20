import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckAuthenticationInterceptor implements CheckAuthenticationInterceptor{

  constructor( 
    private _auth: AuthService,
    private _router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // handle the error
        if (error.status == 401){
          console.log('need to authenticate');
          this._auth.logout();
          localStorage.clear();
          this._router.navigate(['login'])
        }
        return throwError(error);
        
      })
    );
  }

}
