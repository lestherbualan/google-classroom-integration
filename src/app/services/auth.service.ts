import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  auth = getAuth();

  login(data: any):Observable<any>{
    return this.http.post(environment.apiBaseUrl+'api/v1/login',data);
  }

  getAuthToken(){
    if(localStorage.getItem('auth-token')){
      return localStorage.getItem('auth-token');
    }
    return '';
    
  }
  logout(){
    this.auth.signOut();
    return true;
  }
  test(data: any):Observable<any>{
    console.log(data)
    return this.http.post(environment.apiBaseUrl+'api/v1/test',data);
  }
  getCLass(data: any): Observable<any>{
    console.log(data)
    return this.http.get(environment.googleAPIBaseUrl+'courses?key='+data.config.apiKey);
  }
}
