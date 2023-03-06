import { Component,OnInit } from '@angular/core';

import { navItems } from './_nav';

import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements OnInit {

  public navItems = navItems;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  User:any;

  constructor() {}
  
  ngOnInit(): void {

  }
}
