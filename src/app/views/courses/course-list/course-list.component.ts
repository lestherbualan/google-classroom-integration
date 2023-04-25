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

  courseLoading: boolean = true;
  
  constructor(
      private _courseService: CourseService,
      private _router: Router
    ){

  }
  ngOnInit(): void {
    this._courseService.getCourseList(getAuth()).subscribe((res)=>{
      this.courseList = res;
      console.log(res)
      this.courseLoading = false;
    })
  }
  courseDetail(data:any, name:any, creatorid:any){
    console.log(this.courseList)
    this._router.navigate(['/course/detail', data, name,creatorid])
  }

  getCheckState(event){
    console.log(event.currentTarget.checked)
  }
  getCourseListTotal(){
    return this.courseList.courses.length
  }
}
