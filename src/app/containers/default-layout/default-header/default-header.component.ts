import { Component, Input,OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { Store } from '@ngrx/store';
import { getAuth, signOut } from 'firebase/auth';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit{

  @Input() sidebarId: string = "sidebar";
  user: User;

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService, private _router: Router, private _store: Store<{authUser: User}>) {
    super();
  }

  ngOnInit(): void {
    // this._store.select('authUser').subscribe(authUser=>{
    //   if (authUser){
    //     this.user = authUser
    //   }else{
    //     this._router.navigate(['login'])
    //   }
    // });
    this._store.select('authUser').subscribe(authUse=>{
      this.user = JSON.parse(localStorage.getItem('credentials'))
      console.log(this.user)
    })
  }

  logout(){
    const auth = getAuth();
    auth.signOut().then(()=>{
      this._router.navigate(['login'])
    })
  }
}
