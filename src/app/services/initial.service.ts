import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuth } from 'firebase/auth';
import { User } from '../model/User';
import { setAuthUser } from '../store/action/auth-user.actions';

@Injectable({
  providedIn: 'root'
})
export class InitialService {

  user: User;
  auth: any;
  constructor(
    private _store: Store<{authUser: User}>
  ) { 
    this.auth = getAuth()
  }

  initializeState(){
    const user = this.auth.currentUser;
    if(user){
      this.user = {
        displayName: this.auth.currentUser.displayName,
        photoUrl: this.auth.currentUser.photoURL,
        email: this.auth.currentUser.email,
        authToken: localStorage.getItem('auth-token'),
        apiKey: this.auth.config.apiKey,
        userObj: user
      }
      
      this._store.dispatch(setAuthUser(this.user));
    }
    // if(this.auth.currentUser == null){
    //   console.log(this.auth.currentUser)
    //   this.user = {
    //     displayName: this.auth.currentUser.displayName,
    //     photoUrl: this.auth.currentUser.photoURL,
    //     email: this.auth.currentUser.email,
    //     authToken: localStorage.getItem('auth-token'),
    //     apiKey: this.auth.config.apiKey
    //   }
    //   this._store.dispatch(setAuthUser(this.user));
    // }
    // this.authUserSubscribe()
  }
  authUserSubscribe(){
    this._store.select('authUser').subscribe(res=>{
      console.log(res)
    })
  }
}
