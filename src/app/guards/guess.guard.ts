import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuessGuard implements CanActivate {
  constructor(
    private _router : Router
  ){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const auth = getAuth();
    if(auth.currentUser){
      console.log('can activate')
      
      return true;
    }
    console.log('cannot activate')
    this._router.navigate(['dashboard']);
    return false;
  }
  
}
