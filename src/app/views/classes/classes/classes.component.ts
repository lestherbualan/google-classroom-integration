import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { CourseService } from '../../../services/course.service'

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {

  courseList: any;

  constructor(private _courseService: CourseService){

  }
  ngOnInit(): void {
    this._courseService.getCourseList(getAuth()).subscribe((res)=>{
      this.courseList = res;
      console.log(res)
    })
  }
  courseDetail(data:any){
    console.log(data)
  }

}
