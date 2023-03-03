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

  scopes = [
   'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.courses.readonly'
    // add any other necessary scopes here
  ];

  async login(){
    const provider = new GoogleAuthProvider();

    this.scopes.forEach(scope => provider.addScope(scope));

    const creds = await signInWithPopup(firebaseAuth,provider).then( (result)=>{
      const credentials = GoogleAuthProvider.credentialFromResult(result);
      console.log(credentials)
      const auth = getAuth();
      const token = credentials?.accessToken;
      if(localStorage.getItem('auth-token')){
        localStorage.removeItem('auth-token')
      }
      token && localStorage.setItem('auth-token', token);
      this.getClass()
      this._router.navigate(['dashboard'])
      
    })
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
    this.authService.test(getAuth()).subscribe(res=>{
      console.log(res)
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
