import { Component, Input,OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent{

  @Input() sidebarId: string = "sidebar";
  user: any;

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService, private _router: Router) {
    super();
    const auth = getAuth()
    this.user = {
      photoUrl : auth.currentUser?.photoURL,
      name: auth.currentUser?.displayName
    }
  }

  logout(){
    const auth = getAuth();
    auth.signOut().then(()=>{
      this._router.navigate(['login'])
    })
  }
}
