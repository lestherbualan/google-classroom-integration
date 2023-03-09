import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { CourseService } from 'src/app/services/course.service';
import { StudentSubmission } from 'src/app/model/studentSubmission'
import { Grade, Assignment } from 'src/app/model/Grade';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit{
  id: string;
  apiKey: string;

  courseWorks: any;
  students: any;
  studentSubmissions: any;
  courseWorksName: any;
  gradeTable: Grade[] = [];
  gradeTableHeader: {
    id: string;
    name: string;
  }[] = [];
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _courseService: CourseService
  ){

  }
  ngOnInit(): void {
    const auth = getAuth();
    this.id = this._route.snapshot.paramMap.get('data');
    this.apiKey = auth.config.apiKey;
    this._courseService.getCourseDetail({id: this.id, apiKey: this.apiKey},getAuth()).subscribe(res=>{
      this.courseWorks = res;
      console.log(res)
    })

    this._courseService.getCourseStudents({id: this.id},getAuth()).subscribe(res=>{
      this.students = res;
      console.log(res)
    })
  }

  studentProfile(id:any){
    console.log(id)
    this._courseService.getCourseStudentProfile({id},getAuth()).subscribe(res=>{
      console.log(res);
    })
  }
  getCourseWorkGrades(data:any){
    let gradeKey = [];
    const gradeInfo = [];
    this._courseService.getCourseStudentsGrades({courseId: data.courseId, courseWorkId: data.id},getAuth()).subscribe(res=>{
      console.log(res)
      this.studentSubmissions = res;
      console.log(this.students)
      console.log(this.courseWorks)
      
      const courseWorkName = {};
      this.courseWorks.courseWork.forEach(courseWork => {
          courseWorkName[courseWork.id] = courseWork;
      });
      console.log(courseWorkName)
      const studentAssignments = {};
      this.studentSubmissions.studentSubmissions.forEach((submission,key) => {
        if(!studentAssignments[submission.userId]){
          studentAssignments[submission.userId] = [];
        }
        submission.courseWorkTitle = courseWorkName[submission.courseWorkId].title;
        studentAssignments[submission.userId].push(submission);
      });
      this.students.students.forEach(student => {
        const assignments = {};
        studentAssignments[student.userId].forEach(studentAssignment => {
          assignments[studentAssignment.id] = studentAssignment;
        });
        this.gradeTable.push({
          id: student.userId,
          name: student.profile.name.fullName,
          overAllGrade: 0,
          assignments: assignments
        })
      });
      this.gradeTableHeader = Object.keys (this.gradeTable[0]?.assignments || {}).map(key =>{
        return {
          id: key,
          name: (this.gradeTable[0].assignments[key] as any).courseWorkTitle
        }

      });
      console.log()
      console.log(this.gradeTable)
      console.log(this.gradeTableHeader)
    })
  }

  getGrade(assignment: any){
    return assignment.assignedGrade;
  }
}
