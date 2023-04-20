import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { CourseService } from 'src/app/services/course.service';
import { StudentSubmission } from 'src/app/model/studentSubmission'
import { Grade, Assignment } from 'src/app/model/Grade';
import { GradeService} from 'src/app/services/grade.service';
import * as xlsx from 'xlsx';
import {Grade_Range_Percentage, Grade_Range_Decimal} from 'src/app/model/GradeRange';
import * as ExcelJs from 'exceljs';
import * as fs from 'file-saver';


@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit{
  id: string;
  apiKey: string;
  courseName: string;
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
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

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
    this.courseName = this._route.snapshot.paramMap.get('name');
    this.apiKey = auth.config.apiKey;
    
    this._courseService.getCourseStudents({id: this.id},getAuth()).toPromise().then(res=>{
      this.students = res;
      console.log(this.students)

      this.students.students.forEach(student => {
        this.gradeTable.push({
          id: student.userId,
          name: student.profile.name.fullName,
          surName: student.profile.name.familyName,
          firstName: student.profile.name.givenName,
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
  getRating(assignments){
    const average = this.getAverage(assignments);
    if( average <= 3 && average >= 1){
      return 'Pass';
    }else{
      return 'INC'
    }
  }
  getRatingClass(assignments){
    const average = this.getAverage(assignments);
    if( average <= 3 && average >= 1){
      return 'passedColor';
    }else{
      return 'failedColor'
    }
  }

  exportToExcel(){
    const workbook = new ExcelJs.Workbook();

    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);

    const worksheet = workbook.addWorksheet('sheetname',{properties:{tabColor:{argb:'FFFFFF'}},views:[{showGridLines:false}]});
    worksheet.getCell('B1').value = "Course No: "+this.courseName

    // worksheet.addRow([]);

    // worksheet.addRow([]);
    // worksheet.mergeCells('A1:H1');
    // worksheet.getCell('A1').value = 'hello world';
    // worksheet.getCell('A1').alignment = { horizontal: 'center' };
    // worksheet.getCell('A1').font = { size: 15, bold: true };

    // worksheet.columns = [
    //     { header: 'Id', key: 'id', width: 10 },
    //     { header: 'Name', key: 'name', width: 32 },
    //     { header: 'D.O.B.', key: 'dob', width: 10, outlineLevel: 1 }
    // ];

    // worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
    // worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });
    worksheet.addTable({
      name: 'MyTable',
      ref: 'B4',
      headerRow: true,
      totalsRow: true,
      style: {
        theme: null,
        showRowStripes: true,
      },
      columns: [
        {name: 'Date', totalsRowLabel: 'Totals:', filterButton: true},
        {name: 'Amount', totalsRowFunction: 'sum', filterButton: false},
      ],
      rows: [
        [new Date('2019-07-20'), 70.10],
        [new Date('2019-07-21'), 70.60],
        [new Date('2019-07-22'), 70.10],
      ],
    });

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: this.EXCEL_TYPE });
      fs.saveAs(blob, 'sample' + '.xlsx');
    });


    // let element = document.getElementById('grade-table');

    // const ws:xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);

    // const wb:xlsx.WorkBook = xlsx.utils.book_new()

    // xlsx.utils.book_append_sheet(wb,ws,'Sheet1')

    // xlsx.writeFile(wb,"SampleGrade.xlsx")
  }
  date: any;

  test() {

    // January to May = Finals
    // June to December = Midterm


    this.date = this.courseWorks.courseWork;
    this.date.forEach(element => {
      let x = element.creationTime;
      let date = new Date(x);
      console.log(date.getDate())
    });
    console.log(this.courseWorks)
  }
  
  getMidterm(){
    return 'hello hero'
  }
}
