import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { CourseService } from '../../../services/course.service'

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent {
  archiveState: boolean= true;
  courseList: any;

  constructor(
      private _courseService: CourseService,
      private _router: Router
    ){

  }
  ngOnInit(): void {
    this._courseService.getCourseList(getAuth()).subscribe((res)=>{
      this.courseList = res;
      console.log(res)
    })
  }
  courseDetail(data:any){
    this._router.navigate(['/course/detail', data])
  }

  getCheckState(event){
    console.log(event.currentTarget.checked)
  }
}
