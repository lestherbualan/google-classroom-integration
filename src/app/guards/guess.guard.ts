import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { InitialService } from '../services/initial.service';

@Injectable({
  providedIn: 'root'
})
export class GuessGuard implements CanActivate {
  auth: any;
  constructor(
    private _router : Router,
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.auth = JSON.parse(localStorage.getItem('credentials'));
    
    if(this.auth){
      this._router.navigate(['dashboard']);
      return false;

    }else{
      return true;
    }
  }
  
}
