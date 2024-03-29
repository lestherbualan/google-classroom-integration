import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptorService{

  constructor( 
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    const token = this.authService.getAuthToken();
    if (token) {
      const tokenizedReq = req.clone({ 
        headers: req.headers.set('Authorization', 'Bearer ' + token)
          .set('Accept','application/json')
      });
      return next.handle(tokenizedReq);
    }else{
      this.authService.logout();
    }
    return next.handle(req);
  }

}
