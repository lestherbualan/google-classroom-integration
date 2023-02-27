import { Component } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth }from '../../../firebase/firebase.services';
import { google } from 'googleapis';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private _router: Router  ) {
    
   }

  async login(){
    const creds = await signInWithPopup(firebaseAuth,new GoogleAuthProvider()).then((result)=>{
      const credentials = GoogleAuthProvider.credentialFromResult(result);
      const token = credentials?.accessToken;
      token && localStorage.setItem('auth-token', token);
    })
  }
  check(){
    const auth = getAuth();
    const user = auth.currentUser;

    if (user){
      console.log('logged in as: '+ user.displayName)
    }else{
      console.log('no user')
    }
  }
  logout(){
    const auth = getAuth();
    if (auth.currentUser){
      auth.signOut().then(res=>{
        console.log(res);
      })
    }else{
      console.log('please login')
    }
  }
  test(){
    this.authService.test(getAuth()).subscribe(res=>{
      console.log(res)
    })
  }
}
