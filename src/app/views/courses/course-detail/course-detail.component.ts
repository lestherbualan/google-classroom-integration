import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { CourseService } from 'src/app/services/course.service';
import { StudentSubmission } from 'src/app/model/studentSubmission'
import { Grade, Assignment } from 'src/app/model/Grade';
import { GradeService} from 'src/app/services/grade.service';
import * as xlsx from 'xlsx';
import {Grade_Range_Percentage, Grade_Range_Decimal} from 'src/app/model/GradeRange';

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

  gradeLoading: boolean = true;
  workLoading: boolean = true;
  studentLoading: boolean = true;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _courseService: CourseService,
    private _gradeService: GradeService
  ){

  }
  ngOnInit(): void {
    const auth = getAuth();
    this.id = this._route.snapshot.paramMap.get('data');
    this.apiKey = auth.config.apiKey;
    
    this._courseService.getCourseStudents({id: this.id},getAuth()).toPromise().then(res=>{
      this.students = res;
      console.log(this.students)

      this.students.students.forEach(student => {
        this.gradeTable.push({
          id: student.userId,
          name: student.profile.name.fullName,
          overAllGrade: 0,
          assignments: {}
        })
      });
      this.studentLoading = false;

      this._courseService.getCourseDetail({id: this.id, apiKey: this.apiKey},getAuth()).toPromise().then(res=>{
        this.courseWorks = res;

        const promises = [];
        this.courseWorks.courseWork.forEach(courseWork => {
          promises.push(this.getCourseWorkGrades(courseWork));
        });


        Promise.all(promises).then(() => {
          this.gradeTableHeader = Object.keys (this.gradeTable[0]?.assignments || {}).map(key =>{
            return {
              id: key,
              name: (this.gradeTable[0].assignments[key] as any).courseWorkTitle
            }
          });
        });
        this.workLoading = false;
      });
    });
  }

  studentProfile(id:any){
    this._courseService.getCourseStudentProfile({id},getAuth()).subscribe(res=>{
      console.log(res);
    })
  }

  getCourseWorkGrades(data:any){
    return this._courseService.getCourseStudentsGrades({courseId: data.courseId, courseWorkId: data.id},getAuth()).toPromise().then(res=>{
      this.studentSubmissions = res;

      const courseWorkName = {};
      this.courseWorks.courseWork.forEach(courseWork => {
          courseWorkName[courseWork.id] = courseWork;
      });

      const studentAssignments = {};
      this.studentSubmissions.studentSubmissions.forEach((submission,key) => {
        if(!studentAssignments[submission.userId]){
          studentAssignments[submission.userId] = [];
        }
        submission.courseWorkTitle = courseWorkName[submission.courseWorkId].title;
        submission.maxPoints = courseWorkName[submission.courseWorkId].maxPoints;
        studentAssignments[submission.userId].push(submission);
      });

      this.students.students.forEach(student => {
        const assignments = {};
        studentAssignments[student.userId].forEach(studentAssignment => {
          assignments[studentAssignment.courseWorkId] = studentAssignment;
        });

        this.gradeTable = this.gradeTable.map(grade => {
          if (grade.id == student.userId) {
            grade.assignments = {
              ...grade.assignments,
              ...assignments
            };
          }
          return grade;
        });
      });
      this.gradeLoading = false;
      return true;
    })
  }

  getGrade(assignment: any){
    return assignment?.assignedGrade;
  }
  getTotal(assignment:any){
    // maxPoints
    // assignedGrade
    return assignment?.maxPoints;
  }
  
  exportToExcel(){
    let element = document.getElementById('grade-table');

    const ws:xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    const wb:xlsx.WorkBook = xlsx.utils.book_new()

    xlsx.utils.book_append_sheet(wb,ws,'Sheet1')

    xlsx.writeFile(wb,"SampleGrade.xlsx")
  }
  testGradeTable(){
    console.log(this.gradeTable)
  }

  getAverage(assignments: any){
    let total = 0;
    let maxPoints = 0;

    Object.keys(assignments).forEach((key)=>{
      const assignment = assignments[key];
      const tempTotal = this.getGrade(assignment);
      total += tempTotal || 0;
      if(tempTotal !== undefined)
        maxPoints += this.getTotal(assignment) || 0;
      
    });

    let decimalGrade = null;
    const average = (total/maxPoints)*100;
    Grade_Range_Percentage.forEach((grade, index) => {
      if (decimalGrade === null && grade >= average) {
          decimalGrade = Grade_Range_Decimal[index];
      }
    });
    return decimalGrade;
  }

  ivkPrint(){
    let element = document.getElementById('grade-table');

    const newWin= window.open("");
    newWin.document.write(element.outerHTML);
    newWin.print();
    newWin.close();
  }
  getStudentProfilePicture(student:any){
    return 'https:'+ student.profile.photoUrl;
  }
}
