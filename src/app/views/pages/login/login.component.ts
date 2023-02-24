import { Component } from '@angular/core';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth }from '../../../firebase/firebase.services';
import { google } from 'googleapis';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  constructor() { }

  async login(){
    const creds = await signInWithPopup(firebaseAuth,new GoogleAuthProvider());
    console.log(creds);
    const classroom = google.classroom({version: 'v1'});
  }

  // async listCourses(auth: any) {
  //   const classroom = google.classroom({version: 'v1', auth});
  //   const res = await classroom.courses.list({
  //     pageSize: 10,
  //   });
  //   const courses = res.data.courses;
  //   if (!courses || courses.length === 0) {
  //     console.log('No courses found.');
  //     return;
  //   }
  //   console.log('Courses:');
  //   courses.forEach((course) => {
  //     console.log(`${course.name} (${course.id})`);
  //   });
  // }
  
}
