import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})

export class StudentListComponent implements OnInit{

  courseList: any;
  students: any[] = [];
  studentLoading: boolean = true;
  constructor(
    private _courseService: CourseService
  ){}
  ngOnInit(): void {
    this.studentLoading = true;
    this._courseService.getCourseList(getAuth()).subscribe((res) => {
        this.courseList = res;
        const promises: Promise<any>[] = [];
        this.courseList.courses.forEach(element => {
            promises.push(this._courseService.getCourseStudents({ id: element.id }, getAuth()).toPromise());
        });

        Promise.all(promises).then((studs: any) => {
            studs.forEach(stud => {
                stud.students.forEach((student, key) => {
                    this.students.push(student.profile.name.fullName)
                });
                this.students = [...(new Set(this.students))]
                console.log(this.students)
                this.studentLoading = false;
            });
        });

    })
  }
}
