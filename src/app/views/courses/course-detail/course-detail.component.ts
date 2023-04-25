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
  creatorId: string;
  creatorProfile:any;

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
    this.creatorId = this._route.snapshot.paramMap.get('creatorid');
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
    this._courseService.getTeacherProfile({courseId: this.id, creatorId: this.creatorId},getAuth()).toPromise().then(res=>{
      this.creatorProfile = res;
    })
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
    let element = document.getElementById('grade-table-record');

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

    workbook.creator = 'Creator';
    workbook.lastModifiedBy = 'Creator';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    const worksheet = workbook.addWorksheet('Class Record',{properties:{tabColor:{argb:'FFFFFF'}},views:[{showGridLines:false}]});
    worksheet.getCell('B1').value = "Course No: "+this.courseName;

    worksheet.getCell('H2').value = "Instructor: "+ this.creatorProfile.profile.name.fullName;
    

    const table = document.getElementById('grade-table-record') as HTMLTableElement;

    const rows = table.rows;

    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.cells;

      const rowData = {};

      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        const cellData = cell.textContent.trim();
        rowData[`col${j + 1}`] = cellData;
      }

      data.push(rowData);
    }
    const array = [];

    for (let i = 0; i < data.length; i++) {
      const object = data[i];

      const row = [
        object.col1,
        object.col2,
        object.col3,
        object.col4,
        object.col5,
        object.col6,
        object.col7,
        object.col8,
        object.col9,
        object.col10
      ];

      array.push(row);
    }

    worksheet.addTable({
      name: 'MyTable',
      ref: 'B4',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: null,
        showRowStripes: true,
      },
      columns: [
        {name: ' ', filterButton: false},
        {name: 'Student No.',filterButton: false},
        {name: 'Surname',filterButton: false},
        {name: 'First Name',filterButton: false},
        {name: 'Middle Name',filterButton: false},
        {name: 'Course',filterButton: false},
        {name: 'Year/Section',filterButton: false},
        {name: 'MT',filterButton: false},
        {name: 'Finals',filterButton: false},
        {name: 'Rating',filterButton: false},
      ],
      rows: array
    });



    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.font = { size: 14 };
      });
    });
    const columnB = worksheet.getColumn('B');
    columnB.width = 5;
    const columnC = worksheet.getColumn('C');
    columnC.width = 15;
    const columnD = worksheet.getColumn('D');
    columnD.width = 20;
    const columnE = worksheet.getColumn('E');
    columnE.width = 20;
    const columnF = worksheet.getColumn('F');
    columnF.width = 20;
    const columnG = worksheet.getColumn('G');
    columnG.width = 15;
    const columnH = worksheet.getColumn('H');
    columnH.width = 17;
    const columnI = worksheet.getColumn('I');
    columnI.width = 10;
    const columnJ = worksheet.getColumn('J');
    columnJ.width = 10;
    const columnK = worksheet.getColumn('K');
    columnK.width = 10;


    worksheet.getCell('B4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };
    worksheet.getCell('C4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };
    worksheet.getCell('D4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };
    worksheet.getCell('E4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };
    worksheet.getCell('F4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };
    worksheet.getCell('G4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };
    worksheet.getCell('H4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };
    worksheet.getCell('I4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };
    worksheet.getCell('J4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };
    worksheet.getCell('K4').border = {
      top: {style:'thin'},
      bottom: {style:'thin'},
    };

    // font color blue
    worksheet.getCell('B4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }
    worksheet.getCell('C4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }
    worksheet.getCell('D4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }
    worksheet.getCell('E4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }
    worksheet.getCell('F4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }
    worksheet.getCell('G4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }
    worksheet.getCell('H4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }
    worksheet.getCell('I4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }
    worksheet.getCell('J4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }
    worksheet.getCell('K4').font = {
      color: { argb: '305496'},
      size: 14,
      bold: true,
    }

    worksheet.getCell('H2').font = {
      size: 14,
      bold: true,
    }

    const stamp = this.getNameStamp();

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: this.EXCEL_TYPE });
      fs.saveAs(blob, `Class Record Export ${stamp}` + '.xlsx');
    });

  }

  test() {
    console.log(this.courseWorks)
  }
  
  getMidterm(student:any){
    let midterm: {}[] = [];
    let rate = 0;
    let maxPoints = 0;
    Object.keys(student.assignments).forEach((key)=>{
      const creationDate = new Date(student.assignments[key].creationTime);
      if (creationDate.getMonth()+1 <= 5 && creationDate.getMonth()+1 > 0){
        midterm.push(student.assignments[key])
      }
    });
    midterm.forEach((element: any)=>{
      rate += element.assignedGrade || 0;
      if(element.assignedGrade !== undefined){
        maxPoints += element.maxPoints;
      }
    })

    const average = (rate/maxPoints)*100;
    let decimalGrade = null;
    Grade_Range_Percentage.forEach((grade, index) => {
      if (decimalGrade === null && grade >= average) {
          decimalGrade = Grade_Range_Decimal[index];
      }
    });

    return decimalGrade || 0;
  }

  getFinalterm(student:any){
    let finalterm: {}[] = [];
    let rate = 0;
    let maxPoints = 0;
    Object.keys(student.assignments).forEach((key)=>{
      const creationDate = new Date(student.assignments[key].creationTime);
      if(creationDate.getMonth()+1 >= 6 && creationDate.getMonth()+1 < 13 ){
        finalterm.push(student.assignments[key])
      }
    });
    finalterm.forEach((element: any)=>{
      rate += element.assignedGrade || 0;
      if(element.assignedGrade !== undefined){
        maxPoints += element.maxPoints;
      }
    })

    const average = (rate/maxPoints)*100;
    let decimalGrade = null;
    Grade_Range_Percentage.forEach((grade, index) => {
      if (decimalGrade === null && grade >= average) {
          decimalGrade = Grade_Range_Decimal[index];
      }
    });

    return decimalGrade || 0;
  }

  getFinalRating(student:any){
    let midterm = this.getMidterm(student);
    let finalterm = this.getFinalterm(student);
    if (midterm == 0 || finalterm == 0){
      return 'INC';
    }
    return (midterm+finalterm)/2;
  }
  
  getNameStamp(){
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedDate = `${month}/${day}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return `${formattedDate} ${formattedTime}`
  }
}
