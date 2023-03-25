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
  user: User;

  constructor(private _userService: UserService){}
  ngOnInit() {
    this.user  = JSON.parse(localStorage.getItem('credentials'))
  }
  getPhotoUrl(){
    console.log(this.user?.photoUrl)
    return this.user?.photoUrl.replace('s96-c', 's500-c')
  }
  getFirstName(){
    const name = this.user?.displayName.split(' ');
    return name[0];
  }
  getLastName(){
    const name = this.user?.displayName.split(' ');
    return name[1];
  }
  getEmail(){
    return this.user?.email;
  }
  getApiKey(){
    return this.user?.apiKey;
  }
  getToken(){
    return this.user?.authToken;
  }
}
