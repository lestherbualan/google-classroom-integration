import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  auth: any;
  constructor(
    private _router:Router,
    private _store: Store<{authUser: User}>
  ){
    this.auth = getAuth()
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log()
    if(this.auth.currentUser != null){
      return true;
    }else{
      this._router.navigate(['login']);
      return false;
    }
    
  }
  
}
