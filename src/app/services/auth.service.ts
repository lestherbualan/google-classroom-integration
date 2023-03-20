import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { firebaseAuth }from '../firebase/firebase.services';
import { User } from '../model/User';
import { setAuthUser } from '../store/action/auth-user.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;

  constructor(
    private http: HttpClient,
    private _store: Store<{authUser: User}>,
    private _router: Router,
  ) { }

  auth = getAuth();

  async login(scopes:any){
    const provider = new GoogleAuthProvider();

    scopes.forEach(scope => provider.addScope(scope));
    
    const creds =  await signInWithPopup(firebaseAuth,provider).then( (result)=>{
      const credentials = GoogleAuthProvider.credentialFromResult(result);
      console.log(credentials)
      const auth = getAuth();
      const token = credentials?.accessToken;
      if(localStorage.getItem('credentials')){
        localStorage.removeItem('credentials')
      }
      

      this.user = {
        displayName: auth.currentUser.displayName,
        photoUrl: auth.currentUser.photoURL,
        email: auth.currentUser.email,
        authToken: token,
        apiKey: auth.config.apiKey
      }

      token && localStorage.setItem('credentials', JSON.stringify(this.user));

      console.log(auth.config.apiKey)

      this._store.dispatch(setAuthUser(this.user))
      this._router.navigate(['dashboard'])
      
    })
  }

  getAuthToken(){
    if(localStorage.getItem('credentials')){
      const user = JSON.parse(localStorage.getItem('credentials'))
      return user.authToken;
    }
    return '';
  }
  logout(){
    this.auth.signOut();
    return true;
  }
  getCLass(data: any): Observable<any>{
    console.log(data)
    return this.http.get(environment.googleAPIBaseUrl+'courses?key='+data.config.apiKey);
  }

  getUser(){
    return this.user;
  }
  
}
