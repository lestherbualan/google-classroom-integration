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
import { slsuBase64 } from '../../../../assets/slsuBase64';
import { importantBase64 } from '../../../../assets/important';
import { graderange } from '../../../../assets/graderange';
import { ClassRecordService } from 'src/app/services/class-record.service';
import { PdfService } from '../../../services/pdf.service';
import { XlsxWriteOptions } from 'exceljs/dist/es5/exceljs.browser';
import {utils} from 'exceljs/lib/utils/utils';

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
    private _gradeService: GradeService,
    private _classRecordService: ClassRecordService,
    private _pdfService: PdfService
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
    // let worksheet = this.exportToExcel();
    // this._pdfService.invkPrintPdf(worksheet);

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

    const worksheet = workbook.addWorksheet('GradeSheet',{properties:{tabColor:{argb:'FFFFFF'}},views:[{showGridLines:false}]});
    
    worksheet.mergeCells('E1:G1');
    worksheet.mergeCells('E2:G2');
    worksheet.mergeCells('E3:G3');
    worksheet.mergeCells('E5:G5');
    worksheet.mergeCells('E6:G6');
    worksheet.getCell('E1').value = 'Republic of the Philippines';
    worksheet.getCell('E2').value = 'SOUTHERN LEYTE STATE UNIVERSITY - CTE';
    worksheet.getCell('E3').value = 'Tomas Oppus, Southern Leyte';
    worksheet.getCell('E5').value = 'OFFICE OF THE REGISTRAR';
    worksheet.getCell('E6').value = 'GRADE SHEET';
    
    let sems = this.getSchoolYear();
    worksheet.getCell('B8').value = 'School Level: Under Graduate';
    worksheet.getCell('B9').value = 'School Year: 2022-2023';
    worksheet.getCell('E9').value = 'Semester: '+sems;
    worksheet.getCell('B10').value = 'Room/Day/Time: ';
    worksheet.getCell('B11').value = "Course No: "+this.courseName;
    worksheet.getCell('H12').value = "Instructor: "+ this.creatorProfile.profile.name.fullName;
    
    const myBase64Image = slsuBase64;
    const importantImage = importantBase64;

    const imageId3 = workbook.addImage({
      base64: importantImage,
      extension: 'png',
    });

    worksheet.addImage(imageId3, {
      tl: { col: 7, row: 1 },
      ext: { width: 250, height: 75 }
    });

    const imageId2 = workbook.addImage({
      base64: myBase64Image,
      extension: 'png',
    });

    worksheet.addImage(imageId2, {
      tl: { col: 3, row: 0 },
      ext: { width: 130, height: 130 }
    });


  
    // Adjust the image size
    const images = worksheet.getImages();
    const lastImage = images[images.length - 1];

    const row = worksheet.getRow(lastImage.range.tl.row);
    const column = worksheet.getColumn(lastImage.range.tl.col);

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
      ref: 'B14',
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

    console.log(array.length)

    const nothingToFollow = worksheet.getCell('B'+(array.length+20));
    nothingToFollow.value = '**************************************************************** nothing follows ****************************************************************'
    
    const graderangeImage = graderange;

    const imageId1 = workbook.addImage({
      base64: graderangeImage,
      extension: 'png',
    });

    worksheet.addImage(imageId1, {
      tl: { col: 1, row: 23+array.length },
      ext: { width: 800, height: 75 }
    });


    // PREPARED
    worksheet.getCell('B'+(array.length+33)).value = 'PREPARED';
    worksheet.mergeCells('B'+(array.length+34)+':D'+(array.length+34));
    worksheet.getCell('B'+(array.length+34)).value =  this.creatorProfile.profile.name.fullName;
    worksheet.mergeCells('B'+(array.length+35)+':D'+(array.length+35));
    worksheet.getCell('B'+(array.length+35)).value = `Instructor's Professor's Signature`;

    worksheet.getCell('G'+(array.length+34)).value = 'MdT Date:'
    worksheet.getCell('H'+(array.length+34)).border = {
      bottom: { style: 'thin'}
    }
    worksheet.getCell('G'+(array.length+35)).value = 'FnT Date:'
    worksheet.getCell('H'+(array.length+35)).border = {
      bottom: { style: 'thin'}
    }

    worksheet.getCell('B'+(array.length+34)).alignment = {
      horizontal: 'center'
    }
    worksheet.getCell('B'+(array.length+34)).border = {
      bottom: { style: 'thick'}
    }
    worksheet.getCell('C'+(array.length+34)).border = {
      bottom: { style: 'thick'}
    } 
    worksheet.getCell('D'+(array.length+34)).border = {
      bottom: { style: 'thick'}
    } 


    // CHECKED AND VERIFIED
    worksheet.getCell('B'+(array.length+37)).value = 'CHECKED AND VERIFIED';
    worksheet.mergeCells('B'+(array.length+38)+':D'+(array.length+38));
    worksheet.getCell('B'+(array.length+38)).value =  '';
    //worksheet.mergeCells('B'+(array.length+29)+':D'+(array.length+29));
    worksheet.getCell('B'+(array.length+39)).value = `Signature Over Program Chair's Printed Name`;

    worksheet.getCell('G'+(array.length+38)).value = 'MdT Date:'
    worksheet.getCell('H'+(array.length+38)).border = {
      bottom: { style: 'thin'}
    }
    worksheet.getCell('G'+(array.length+39)).value = 'FnT Date:'
    worksheet.getCell('H'+(array.length+39)).border = {
      bottom: { style: 'thin'}
    }

    worksheet.getCell('B'+(array.length+38)).border = {
      bottom: { style: 'thick'}
    }
    worksheet.getCell('C'+(array.length+38)).border = {
      bottom: { style: 'thick'}
    } 
    worksheet.getCell('D'+(array.length+38)).border = {
      bottom: { style: 'thick'}
    } 

    // RECEIVED
    worksheet.getCell('B'+(array.length+41)).value = 'RECEIVED';
    worksheet.mergeCells('B'+(array.length+42)+':D'+(array.length+42));
    worksheet.getCell('B'+(array.length+42)).value =  '';
    //worksheet.mergeCells('B'+(array.length+33)+':D'+(array.length+33));
    worksheet.getCell('B'+(array.length+43)).value = `Signature Over Registrar's Printed Name`;

    worksheet.getCell('G'+(array.length+43)).value = 'Date:'
    worksheet.getCell('H'+(array.length+43)).border = {
      bottom: { style: 'thin'}
    }

    worksheet.getCell('B'+(array.length+42)).border = {
      bottom: { style: 'thick'}
    }
    worksheet.getCell('C'+(array.length+42)).border = {
      bottom: { style: 'thick'}
    } 
    worksheet.getCell('D'+(array.length+42)).border = {
      bottom: { style: 'thick'}
    } 

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.font = { size: 12 };
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


    worksheet.getCell('B14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };
    worksheet.getCell('C14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };
    worksheet.getCell('D14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };
    worksheet.getCell('E14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };
    worksheet.getCell('F14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };
    worksheet.getCell('G14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };
    worksheet.getCell('H14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };
    worksheet.getCell('I14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };
    worksheet.getCell('J14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };
    worksheet.getCell('K14').border = {
      top: {style:'thick'},
      bottom: {style:'thick'},
    };

    // font color blue
    worksheet.getCell('B14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }
    worksheet.getCell('C14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }
    worksheet.getCell('D14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }
    worksheet.getCell('E14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }
    worksheet.getCell('F14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }
    worksheet.getCell('G14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }
    worksheet.getCell('H14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }
    worksheet.getCell('I14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }
    worksheet.getCell('J14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }
    worksheet.getCell('K14').font = {
      color: { argb: '305496'},
      size: 12,
      bold: true,
    }

    worksheet.getCell('H12').font = {
      size: 12,
      bold: true,
    }

    worksheet.getCell('E1').alignment = {
      horizontal: 'center'
    }

    worksheet.getCell('E2').alignment = {
      horizontal: 'center'
    }

    worksheet.getCell('E3').alignment = {
      horizontal: 'center'
    }

    worksheet.getCell('E5').alignment = {
      horizontal: 'center'
    }

    worksheet.getCell('E6').alignment = {
      horizontal: 'center'
    }

    worksheet.getCell('B'+(array.length+25)).alignment = {
      horizontal: 'center'
    }

    worksheet.getCell('B'+(array.length+28)).alignment = {
      horizontal: 'center'
    }
    
    worksheet.getCell('B'+(array.length+32)).alignment = {
      horizontal: 'center'
    }

    worksheet.getCell('B'+(array.length+36)).alignment = {
      horizontal: 'center'
    }

    const cellAddresses = ['E5','E6,', 'E2', 'B'+(array.length+23), 'B'+(array.length+27),'B'+(array.length+31),'B'+(array.length+35)];

    cellAddresses.forEach(address => {
      worksheet.getCell(address).font = {
        bold : true
      }
    });

    worksheet.getCell('B'+(array.length+20)).font = {
      color: { argb: '305496'}
    }

    this._classRecordService.exportToExcel(workbook, this.courseName, this.gradeTable);

    const stamp = this.getNameStamp();

    // workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
    //   const blob = new Blob([data], { type: this.EXCEL_TYPE });
    //   fs.saveAs(blob, `Class Record Export ${stamp}` + '.xlsx');
    // });
    const options: XlsxWriteOptions = {
      base64: true,
    };
    
    workbook.xlsx.writeBuffer(options).then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: this.EXCEL_TYPE });
      fs.saveAs(blob, `Class Record Export ${stamp}` + '.xlsx');
    });

    return worksheet;

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
  getSchoolYear(){
    const creationDate = new Date();
    if (creationDate.getMonth()+1 >= 6 && creationDate.getMonth()+1 < 13 ){
      return '2nd';
    }
    if (creationDate.getMonth()+1 <= 5 && creationDate.getMonth()+1 > 0){
      return '1st';
    }else{
      return null;
    }
  }
}
