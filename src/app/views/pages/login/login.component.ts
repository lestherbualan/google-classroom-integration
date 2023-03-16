import { Component, OnInit } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup,signInWithRedirect } from 'firebase/auth';
import { firebaseAuth }from '../../../firebase/firebase.services';
import { google } from 'googleapis';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from 'src/app/model/User';
import { setAuthUser } from 'src/app/store/action/auth-user.actions';
import { scopes } from '../../../scope/scopes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  user: User;
  scopes = scopes;

  constructor(
      private authService: AuthService,
      private _router: Router,
      private _store: Store<{authUser: User}>
    ) {
    
  }

  async ngOnInit(): Promise<void> {
    const auth = await getAuth();
    console.log(auth.currentUser)
    localStorage.clear()
    // if(auth.currentUser){
    //   console.log('already loggedin')
    //   this._router.navigate(['dashboard'])
    // }else{
    //   this.login();
    // }
    
  }

  async login(){
    this.authService.login(scopes);

    // const creds = await signInWithRedirect(firebaseAuth,provider).then( (result)=>{
    //   const credentials = GoogleAuthProvider.credentialFromResult(result);
    //   console.log(credentials)
    //   const auth = getAuth();
    //   const token = credentials?.accessToken;
    //   if(localStorage.getItem('auth-token')){
    //     localStorage.removeItem('auth-token')
    //   }
    //   token && localStorage.setItem('auth-token', token);

    //   this.user = {
    //     displayName: auth.currentUser.displayName,
    //     photoUrl: auth.currentUser.photoURL,
    //     email: auth.currentUser.email,
    //     authToken: token,
    //     apiKey: auth.config.apiKey
    //   }
    //   console.log(auth.config.apiKey)

    //   this._store.dispatch(setAuthUser(this.user))
    //   this._router.navigate(['dashboard'])
      
    // })

  }
  check(){
    const auth = getAuth();
    const user = auth.currentUser;

    if (user){
      console.log('logged in as: '+ user.displayName)
      console.log(localStorage.getItem('auth-token'))
      console.log(auth)
    }else{
      console.log('no user')
      console.log(auth)
    }
  }
  logout(){
    const auth = getAuth();
    if (auth.currentUser){
      auth.signOut().then(res=>{
        console.log(res);
        localStorage.removeItem('auth-token')
      })
    }else{
      console.log('please login')
    }
  }
  test(){
    this._store.select('authUser').subscribe(authUse=>{
      console.log(authUse)
    })
  }
  getClass(){
    // this.authService.getCLass(getAuth()).subscribe(res=>{
    //   console.log(res)
    // })
    this.authService.getCLass(getAuth()).subscribe(res=>{
      console.log(res)
    })
  }
}
