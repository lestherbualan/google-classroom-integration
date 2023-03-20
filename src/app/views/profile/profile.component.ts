import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuth } from 'firebase/auth';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  user: any;

  constructor(private _userService: UserService){}
  ngOnInit() {

    console.log(this._userService.getUser())
  }

}
