import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import * as ExcelJs from 'exceljs';
import { slsuBase64 } from '../../assets/slsuBase64';
import { Grade } from 'src/app/model/Grade';
import { WorkSheet } from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ClassRecordService {

  constructor() { }

  exportToExcel(workbook: ExcelJs.Workbook, courseName: string, gradeTable: Grade[]){
    const worksheet = workbook.addWorksheet('Record',{properties:{tabColor:{argb:'FFFFFF'}},views:[{showGridLines:true}]});
    worksheet.properties.defaultColWidth = 4;

    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 7,
        xSplit: 3
      }
    ];

    worksheet.getColumn('A').width = 6;
    worksheet.getColumn('C').width = 40;
    worksheet.mergeCells('B2:C3');
    const B2 = worksheet.getCell('B2');
    B2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    
    worksheet.getRow(4).height = 70;
    worksheet.mergeCells('B4:C4');
    const B4 = worksheet.getCell('B4');
    B4.value = 'Course/Year Schedule';
    B4.alignment = {
      horizontal : 'center',
      wrapText: true
    }
    B4.font = {
      bold : true
    }
    B4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getRow(5).height = 70;
    worksheet.mergeCells('B5:C5');
    const B5 = worksheet.getCell('B5');
    B5.value = courseName; 
    B5.alignment = {
      horizontal : 'center',
      wrapText: true
    }
    B5.font = {
      bold : true
    }
    B5.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.mergeCells('B6:C6');
    const B6 = worksheet.getCell('B6');
    B6.value = `STUDENT'S NAME`;
    B6.alignment = {
      horizontal: 'center'
    }
    B6.font = {
      bold : true
    }
    B6.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.mergeCells('B7:C7');
    const B7 = worksheet.getCell('B7');
    B7.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'c6e0b4'}
    }
        
    let length = this.getAssignmentLength(gradeTable);
    // adjust this only for testing
    //length +=3;


    // students name starts at B8

    // function for population of students name
    // bdd7ee
    worksheet.mergeCells(1,1,1,63+length)
    worksheet.getRow(1).height = 25;

    const column = worksheet.getColumn('A');
    for (let i = 1; i <= 30+length; i++) {
      const cell = worksheet.getCell(i,1);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c65911' },
      };
    }

    const column2 = worksheet.getColumn(63+length);

    for (let i = 1; i <= 30+length; i++) {
      const cell = worksheet.getCell(i,63+length);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c65911' },
      };
    }
    
    const row = worksheet.getRow(30+length);
    for (let i = 1; i <= 63+length; i++) {
      const cell = row.getCell(i);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c65911' },
      };
    }

    for (let i = 2; i <= 29+length; i++) {
      for (let j = 2; j <= 62+length; j++) {
        const cell = worksheet.getCell(i,j);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }


    let A1 = worksheet.getCell('A1')
    A1.value = "STUDENT'S RECORD ENTRY FORM";
    A1.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: '5b9bd5'}
    }
    A1.font = {
      size: 18,
      bold: true,
      color: {argb: '525252'}
    }
    A1.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    }
    gradeTable.forEach((element, index) =>{
      const indexCell = worksheet.getCell('B'+(8+index))
      const studentCell = worksheet.getCell('C'+(8+index))
      indexCell.value = `${index+1}.`;
      indexCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'bdd7ee'}
      }
      
      studentCell.value = `${element.surName} , ${element.firstName}`;
      studentCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'bdd7ee'}
      }

      const {grade, total} = this.getMidTerm(element);
      grade.forEach((element, mindex)=>{
        worksheet.getCell(8+(index),4+(mindex)).value = element;
      })

      worksheet.getCell(8+index,4+length).value = total;
      
    });

    worksheet.mergeCells('D2:E2');
    const D2E2 = worksheet.getCell('D2');
    D2E2.value = '100.0%';
    D2E2.font = {
      bold: true
    }
    D2E2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'bfbfbf'}
    }


    // adjust base on legnth
    //worksheet.mergeCells('F2:H2');
    // row, column, row, column
    worksheet.mergeCells(2,6,2,(6+(length-1)));
    // worksheet.mergeCells(2,34+midtermNameLength,2,36+midtermNameLength);
    const F2H2 = worksheet.getCell('F2');
    F2H2.value = 'OK';
    F2H2.alignment = {
      horizontal: 'center'
    }
    F2H2.font = {
      bold: true
    }
    F2H2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'c6e0b4'}
    }

    worksheet.mergeCells(4,4,4,4+length);
    const D4 =worksheet.getCell('D4');
    D4.value = 'Assignment/Quiz';
    D4.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }
    D4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }


    const G5 = worksheet.getCell(5,(4+length))
    G5.value = 'Total';
    G5.alignment = {
      textRotation: 90
    }
    G5.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    const G6 = worksheet.getCell(6,(4+length))
    //worksheet.mergeCells('G6:G'+(4+length))
    worksheet.mergeCells(6,4+length,7,4+length)

    const maxPoints = this.getAssignmentMaxPoints(gradeTable);
    G6.value = maxPoints;
    G6.alignment = {
      vertical: 'middle'
    }
    G6.font = {
      bold: true
    }

    worksheet.mergeCells(3,4,3,4+length);
    const D3 = worksheet.getCell('D3');
    D3.value = '20%';
    D3.alignment = {
      horizontal: 'center'
    }
    D3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }

    const D6 = worksheet.getCell('D6');
    for (let index = 0; index < length; index++) {
      let cell = worksheet.getCell(6,4+index)
      worksheet.getCell(5,4+index).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'f8cbad'}
      }
      cell.value = index+1;
      cell.alignment = {
        vertical: 'middle'
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'f8cbad'}
      }
    }

    // adjust base on length
    worksheet.mergeCells(3,(5+length),6,(5+length));
    
    const H3 = worksheet.getCell(3,(5+length));
    H3.value = 'TRANSMUTE';
    H3.alignment = {
      textRotation: 90
    }
    H3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    // ----------------------------------------------
    worksheet.mergeCells(3,6+length,3,8+length);
    worksheet.getCell(3,6+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,6+length,4,8+length);
    worksheet.getCell(4,6+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    
    let total2 = worksheet.getCell(5,8+length);
    total2.value = 'Total'
    total2.alignment = {
      textRotation: 90
    }
    total2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,6+length).value = 1;    
    worksheet.getCell(6,6+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    } 
    worksheet.getCell(5,6+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    } 
    worksheet.getCell(6,7+length).value = 2;
    worksheet.getCell(6,7+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,7+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.mergeCells(6,8+length,7,8+length);
    let K6 = worksheet.getCell(6,8+length);
    K6.value = 0;
    K6.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }

    worksheet.mergeCells(3,(9+length),6,(9+length));
    
    let L3 = worksheet.getCell(3,(9+length));
    L3.value = 'TRANSMUTE';
    L3.alignment = {
      textRotation: 90
    }
    L3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }
    

    // ----------------------------------------------
    worksheet.mergeCells(3,10+length,3,13+length);
    let M3 = worksheet.getCell(3,10+length);
    M3.value = '60%';
    M3.alignment = {
      horizontal: 'center'
    }
    M3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,10+length,4,13+length);
    let M4 = worksheet.getCell(4,10+length);
    M4.value = 'LAB Activities';
    M4.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    }
    M4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    
    let total3 = worksheet.getCell(5,13+length);
    total3.value = 'Total'
    total3.alignment = {
      textRotation: 90
    }
    total3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getCell(6,10+length).value = 1;
    worksheet.getCell(6,10+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,10+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,11+length).value = 2;
    worksheet.getCell(6,11+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,11+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,12+length).value = 3;
    worksheet.getCell(6,12+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,12+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.mergeCells(6,13+length,7,13+length);
    let P6 = worksheet.getCell(6,13+length);
    P6.value = 0;
    P6.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }

    worksheet.mergeCells(3,(14+length),6,(14+length));
    
    let Q3 = worksheet.getCell(3,(14+length));
    Q3.value = 'TRANSMUTE';
    Q3.alignment = {
      textRotation: 90
    }
    Q3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    // -----------------------------------------------
    worksheet.mergeCells(3,15+length,3,18+length);
    worksheet.getCell(3,15+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,15+length,4,18+length);
    worksheet.getCell(4,15+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    let total4 = worksheet.getCell(5,18+length);
    total4.value = 'Total'
    total4.alignment = {
      textRotation: 90
    }
    total4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,15+length).value = 1;
    worksheet.getCell(6,16+length).value = 2;
    worksheet.getCell(6,17+length).value = 3;
    worksheet.getCell(6,15+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,16+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,17+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    
    worksheet.getCell(5,15+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,16+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,17+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.mergeCells(6,18+length,7,18+length);
    let U6 = worksheet.getCell(6,18+length);
    U6.value = 0;
    U6.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }

    worksheet.mergeCells(3,(19+length),6,(19+length));
    
    let V4 = worksheet.getCell(3,(19+length));
    V4.value = 'TRANSMUTE';
    V4.alignment = {
      textRotation: 90
    }
    V4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    // ----------------------------------------------

    worksheet.mergeCells(3,20+length,3,22+length);
    worksheet.getCell(3,20+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,20+length,4,22+length);
    worksheet.getCell(4,20+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    let total5 = worksheet.getCell(5,22+length);
    total5.value = 'Total'
    total5.alignment = {
      textRotation: 90
    }
    total5.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getCell(6,20+length).value = 1;
    worksheet.getCell(6,21+length).value = 2;
    worksheet.getCell(6,20+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,21+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getCell(5,20+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,21+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.mergeCells(6,22+length,7,22+length);
    let Y6 = worksheet.getCell(6,22+length);
    Y6.value = 0;
    Y6.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }
    worksheet.mergeCells(3,(23+length),6,(23+length));

    let Z4 = worksheet.getCell(3,(23+length));
    Z4.value = 'TRANSMUTE';
    Z4.alignment = {
      textRotation: 90
    }
    Z4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }
    // ----------------------------------------------

    worksheet.getCell(3,(24+length)).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,(24+length),6,(24+length));
    let AA4 = worksheet.getCell(4,(24+length));
    AA4.value = 'Attendance';
    AA4.alignment = {
      textRotation: 90
    }
    AA4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(7,(24+length)).value = 0;

    worksheet.mergeCells(3,(25+length),6,(25+length));
    let AB4 = worksheet.getCell(3,(25+length));
    AB4.value = 'TRANSMUTE';
    AB4.alignment = {
      textRotation: 90
    }
    AB4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    worksheet.mergeCells(4,(26+length),6,(26+length));
    worksheet.getCell(4,26+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(3,26+length).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(3,(27+length),6,(27+length));
    let AC4 = worksheet.getCell(3,(27+length));
    AC4.value = 'TRANSMUTE';
    AC4.alignment = {
      textRotation: 90
    }
    AC4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    worksheet.getCell(3,(28+length)).value = '###'
    worksheet.getCell(3,(28+length)).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    } 
    worksheet.mergeCells(4,(28+length),6,(28+length));
    let AD4 = worksheet.getCell(4,(28+length));
    AD4.value = 'Written Exam';
    AD4.alignment = {
      textRotation: 90
    }
    AD4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(7,(28+length)).value = 100;

    worksheet.mergeCells(3,(29+length),6,(29+length));
    let AE4 = worksheet.getCell(3,(29+length));
    AE4.value = 'TRANSMUTE';
    AE4.alignment = {
      textRotation: 90
    }
    AE4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    // ------------------------------------------------
    worksheet.mergeCells(3,(30+length),6,(30+length));
    let AG4 = worksheet.getCell(3,(30+length));
    AG4.value = 'RAW GRADE';
    AG4.alignment = {
      textRotation: 90,
      horizontal: 'center'
    }
    AG4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.columns[29+length].width = 6;

    worksheet.mergeCells(3,(31+length),6,(31+length));
    let AH4 = worksheet.getCell(3,(31+length));
    AH4.value = 'MT GRADES';
    AH4.alignment = {
      textRotation: 90,
      horizontal: 'center'
    }
    AH4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.columns[30+length].width = 6;

    worksheet.mergeCells(2,6+length,2,31+length)
    let midTermText = worksheet.getCell(2,6+length);
    midTermText.value = 'Mid Term';
    midTermText.alignment = {
      horizontal: 'center'
    }
    midTermText.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    // ========= FINAL ========================================
    this.createFinal(worksheet,courseName,gradeTable,length);
    // ========= END FINAL ====================================

    // when merging remember to consider the variable length
    // mergeCells(rownumber, row letter, column number, column letter)
  }

  createFinal(worksheet: ExcelJs.Worksheet, courseName: string, gradeTable: Grade[], midtermNameLength){

    // FINAL STARTS AT 32 + midtermNameLength
    worksheet.mergeCells(2,32+midtermNameLength,2,33+midtermNameLength);
    let AI2 = worksheet.getCell(2,32+midtermNameLength);
    AI2.value = '100.0%';
    AI2.font = {
      bold: true
    }
    AI2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'bfbfbf'}
    }

    const row = 2;
    const minCol = 34+midtermNameLength;
    const maxCol = minCol+midtermNameLength -1; 
    worksheet.mergeCells(row, minCol, row, maxCol);
    let AK2 = worksheet.getCell(2, minCol);
    AK2.value = 'OK';
    AK2.alignment = {
      horizontal: 'center'
    }
    AK2.font = {
      bold: true
    }
    AK2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'c6e0b4'}
    }

    worksheet.mergeCells(3,32+midtermNameLength,3,(32+midtermNameLength)+midtermNameLength);
    worksheet.getCell(3,32+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,32+midtermNameLength,4,(32+midtermNameLength)+midtermNameLength);
    const AI4 =worksheet.getCell(4,32+midtermNameLength);
    AI4.value = 'Quizzes';
    AI4.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }
    AI4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    const AL5 = worksheet.getCell(5,(32+midtermNameLength)+midtermNameLength)
    AL5.value = 'Total';
    AL5.alignment = {
      textRotation: 90
    }
    AL5.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    //count
    for (let index = 0; index < midtermNameLength; index++) {
      let cell = worksheet.getCell(6,(32+midtermNameLength)+index)
      let blankCell = worksheet.getCell(5,(32+midtermNameLength)+index)
      cell.value = index+1;
      cell.alignment = {
        vertical: 'middle'
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'f8cbad'}
      }
      blankCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'f8cbad'}
      }
    }

    worksheet.mergeCells(6,(32+midtermNameLength)+midtermNameLength, 7,(32+midtermNameLength)+midtermNameLength)
    let AL6 = worksheet.getCell(6,(32+midtermNameLength)+midtermNameLength)
    const maxPoints = this.getAssignmentMaxPoints(gradeTable);
    AL6.value = maxPoints;
    AL6.alignment = {
      vertical: 'middle'
    }
    AL6.font = {
      bold: true
    }

    worksheet.mergeCells(3,(33+midtermNameLength)+midtermNameLength,6,(33+midtermNameLength)+midtermNameLength);    
    const AM3 = worksheet.getCell(3,(33+midtermNameLength)+midtermNameLength);
    AM3.value = 'TRANSMUTE';
    AM3.alignment = {
      textRotation: 90
    }
    AM3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    gradeTable.forEach((element, index) =>{
      const finalTermGrade = this.getFinalTerm(element);
      finalTermGrade.forEach((element, mindex)=>{
        worksheet.getCell(8+(index),32+midtermNameLength+(mindex)).value = element;
        // worksheet.getCell(6,(32+midtermNameLength)+index)
      })
    });

    // -----------------------------------------------------------------------------------
    worksheet.mergeCells(3,(34+midtermNameLength)+midtermNameLength,3,(36+midtermNameLength)+midtermNameLength);
    worksheet.getCell(3,(34+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }

    worksheet.getCell(4,(34+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.mergeCells(4,(34+midtermNameLength)+midtermNameLength,4,(36+midtermNameLength)+midtermNameLength);
    
    let total2 = worksheet.getCell(5,(36+midtermNameLength)+midtermNameLength);
    total2.value = 'Total'
    total2.alignment = {
      textRotation: 90
    }
    total2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,(34+midtermNameLength)+midtermNameLength).value = 1;    
    worksheet.getCell(6,(35+midtermNameLength)+midtermNameLength).value = 2;
    worksheet.getCell(6,(34+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }   
    worksheet.getCell(6,(35+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,(34+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }   
    worksheet.getCell(5,(35+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.mergeCells(6,(36+midtermNameLength)+midtermNameLength,7,(36+midtermNameLength)+midtermNameLength);
    let K6 = worksheet.getCell(6,(36+midtermNameLength)+midtermNameLength);
    K6.value = 0;
    K6.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }

    worksheet.mergeCells(3,(37+midtermNameLength)+midtermNameLength,6,(37+midtermNameLength)+midtermNameLength);
    
    let L3 = worksheet.getCell(3,(37+midtermNameLength)+midtermNameLength);
    L3.value = 'TRANSMUTE';
    L3.alignment = {
      textRotation: 90
    }
    L3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }
    // ----------------------------------------------------------------------------------
    
    worksheet.mergeCells(3,(38+midtermNameLength)+midtermNameLength,3,(41+midtermNameLength)+midtermNameLength);
    worksheet.getCell(3,(38+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,(38+midtermNameLength)+midtermNameLength,4,(41+midtermNameLength)+midtermNameLength);
    let M4 = worksheet.getCell(4,(38+midtermNameLength)+midtermNameLength);
    M4.value = 'Discussion';
    M4.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    }
    M4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    
    let total3 = worksheet.getCell(5,(41+midtermNameLength)+midtermNameLength);
    total3.value = 'Total'
    total3.alignment = {
      textRotation: 90
    }
    total3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getCell(6,(38+midtermNameLength)+midtermNameLength).value = 1;
    worksheet.getCell(6,(39+midtermNameLength)+midtermNameLength).value = 2;
    worksheet.getCell(6,(40+midtermNameLength)+midtermNameLength).value = 3;
    worksheet.getCell(6,(38+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,(39+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,(40+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    
    worksheet.getCell(5,(38+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,(39+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,(40+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.mergeCells(6,(41+midtermNameLength)+midtermNameLength,7,(41+midtermNameLength)+midtermNameLength);
    let P6 = worksheet.getCell(6,(41+midtermNameLength)+midtermNameLength);
    P6.value = 0;
    P6.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }
    worksheet.mergeCells(3,(42+midtermNameLength)+midtermNameLength,6,(42+midtermNameLength)+midtermNameLength);
    
    let Q3 = worksheet.getCell(3,(42+midtermNameLength)+midtermNameLength);
    Q3.value = 'TRANSMUTE';
    Q3.alignment = {
      textRotation: 90
    }
    Q3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }
    // ------------------------------------------------------------------------

    worksheet.mergeCells(3,(43+midtermNameLength)+midtermNameLength,3,(46+midtermNameLength)+midtermNameLength);
    worksheet.getCell(3,(43+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,(43+midtermNameLength)+midtermNameLength,4,(46+midtermNameLength)+midtermNameLength);
    let AW4 = worksheet.getCell(4,(43+midtermNameLength)+midtermNameLength);
    AW4.value = 'Project';
    AW4.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    }
    AW4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    let total4 = worksheet.getCell(5,(46+midtermNameLength)+midtermNameLength);
    total4.value = 'Total'
    total4.alignment = {
      textRotation: 90
    }
    total4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getCell(6,(43+midtermNameLength)+midtermNameLength).value = 1;
    worksheet.getCell(6,(44+midtermNameLength)+midtermNameLength).value = 2;
    worksheet.getCell(6,(45+midtermNameLength)+midtermNameLength).value = 3;
    worksheet.getCell(6,(43+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,(44+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,(45+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getCell(5,(43+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,(44+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,(45+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }


    worksheet.mergeCells(6,(46+midtermNameLength)+midtermNameLength,7,(46+midtermNameLength)+midtermNameLength);
    let AZ7 = worksheet.getCell(6,(46+midtermNameLength)+midtermNameLength);
    AZ7.value = 0;
    AZ7.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }

    worksheet.mergeCells(3,(47+midtermNameLength)+midtermNameLength,6,(47+midtermNameLength)+midtermNameLength);
    let BA3 = worksheet.getCell(3,(47+midtermNameLength)+midtermNameLength);
    BA3.value = 'TRANSMUTE';
    BA3.alignment = {
      textRotation: 90
    }
    BA3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }
    // ---------------------------------------------------------------------------------

    worksheet.mergeCells(3,(48+midtermNameLength)+midtermNameLength,3,(50+midtermNameLength)+midtermNameLength);
    worksheet.getCell(4,(48+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(3,(48+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,(48+midtermNameLength)+midtermNameLength,4,(50+midtermNameLength)+midtermNameLength);

    let total5 = worksheet.getCell(5,(50+midtermNameLength)+midtermNameLength);
    total5.value = 'Total'
    total5.alignment = {
      textRotation: 90
    }
    total5.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getCell(6,(48+midtermNameLength)+midtermNameLength).value = 1;
    worksheet.getCell(6,(49+midtermNameLength)+midtermNameLength).value = 2;
    worksheet.getCell(6,(48+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(6,(49+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getCell(5,(48+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(5,(49+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.mergeCells(6,(50+midtermNameLength)+midtermNameLength,7,(50+midtermNameLength)+midtermNameLength);
    let BD7 = worksheet.getCell(6,(50+midtermNameLength)+midtermNameLength);
    BD7.value = 0;
    BD7.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }

    worksheet.mergeCells(3,(51+midtermNameLength)+midtermNameLength,6,(51+midtermNameLength)+midtermNameLength);
    let BE3 = worksheet.getCell(3,(51+midtermNameLength)+midtermNameLength);
    BE3.value = 'TRANSMUTE';
    BE3.alignment = {
      textRotation: 90
    }
    BE3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }
    // ------------------------------------------------------------------------------
    worksheet.getCell(3,(52+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,(52+midtermNameLength)+midtermNameLength,6,(52+midtermNameLength)+midtermNameLength);
    let AA4 = worksheet.getCell(4,(52+midtermNameLength)+midtermNameLength);
    AA4.value = 'Attendance';
    AA4.alignment = {
      textRotation: 90
    }
    AA4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(7,(52+midtermNameLength)+midtermNameLength).value = 0;

    worksheet.mergeCells(3,(53+midtermNameLength)+midtermNameLength,6,(53+midtermNameLength)+midtermNameLength);
    let AB4 = worksheet.getCell(3,(53+midtermNameLength)+midtermNameLength);
    AB4.value = 'TRANSMUTE';
    AB4.alignment = {
      textRotation: 90
    }
    AB4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    worksheet.mergeCells(4,(54+midtermNameLength)+midtermNameLength,6,(54+midtermNameLength)+midtermNameLength);
    worksheet.getCell(4,(54+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(3,(54+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(3,(55+midtermNameLength)+midtermNameLength,6,(55+midtermNameLength)+midtermNameLength);
    let AC4 = worksheet.getCell(3,(55+midtermNameLength)+midtermNameLength);
    AC4.value = 'TRANSMUTE';
    AC4.alignment = {
      textRotation: 90
    }
    AC4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    worksheet.getCell(3,(56+midtermNameLength)+midtermNameLength).value = '###'
    worksheet.getCell(3,(56+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(4,(56+midtermNameLength)+midtermNameLength,6,(56+midtermNameLength)+midtermNameLength);
    let AD4 = worksheet.getCell(4,(56+midtermNameLength)+midtermNameLength);
    AD4.value = 'Written Exam';
    AD4.alignment = {
      textRotation: 90
    }
    AD4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getCell(7,(56+midtermNameLength)+midtermNameLength).value = 100;

    worksheet.getCell(3,(57+midtermNameLength)+midtermNameLength).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffd966'}
    }
    worksheet.mergeCells(3,(57+midtermNameLength)+midtermNameLength,6,(57+midtermNameLength)+midtermNameLength);
    let AE4 = worksheet.getCell(3,(57+midtermNameLength)+midtermNameLength);
    AE4.value = 'TRANSMUTE';
    AE4.alignment = {
      textRotation: 90
    }
    AE4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'ffe699'}
    }

    // ------------------------------------------------
    worksheet.mergeCells(3,(58+midtermNameLength)+midtermNameLength,6,(58+midtermNameLength)+midtermNameLength);
    let AG4 = worksheet.getCell(3,(58+midtermNameLength)+midtermNameLength);
    AG4.value = 'RAW GRADE';
    AG4.alignment = {
      textRotation: 90,
      horizontal: 'center'
    }
    AG4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }
    worksheet.getColumn(AG4.col).width = 6;

    worksheet.mergeCells(3,(59+midtermNameLength)+midtermNameLength,6,(59+midtermNameLength)+midtermNameLength);
    let AH4 = worksheet.getCell(3,(59+midtermNameLength)+midtermNameLength);
    AH4.value = 'FT GRADES';
    AH4.alignment = {
      textRotation: 90,
      horizontal: 'center'
    }
    AH4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    worksheet.getColumn(AH4.col).width = 6;

    worksheet.mergeCells(2,minCol+midtermNameLength,2,(59+midtermNameLength)+midtermNameLength)
    let finalTermText = worksheet.getCell(2,minCol+midtermNameLength);
    finalTermText.value = 'Final Term';
    finalTermText.alignment = {
      horizontal: 'center'
    }
    finalTermText.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'f8cbad'}
    }

    //this.getFinalAssignmentLength(gradeTable)

  }

  getMidTerm(gradeTable: any){
    const grade = [];
    let total = 0;
    Object.keys(gradeTable.assignments).forEach((key)=>{
      const creationDate = new Date(gradeTable.assignments[key].creationTime);
      if (creationDate.getMonth()+1 <= 5 && creationDate.getMonth()+1 > 0){
       grade.push(gradeTable.assignments[key].assignedGrade);
       total += gradeTable.assignments[key].assignedGrade || 0;
      }      
    });
    //grade.push(total);
    return {grade,total};
  }

  getFinalTerm(gradeTable: any){
    const grade = [];
    let total = 0;
    Object.keys(gradeTable.assignments).forEach((key)=>{
      const creationDate = new Date(gradeTable.assignments[key].creationTime);
      if (creationDate.getMonth()+1 >= 6 && creationDate.getMonth()+1 < 13 ){
       grade.push(gradeTable.assignments[key].assignedGrade);
       total += gradeTable.assignments[key].assignedGrade || 0;
      }      
    });
    //grade.push(total);
    return grade;
  }
  getAssignmentLength(gradeTable: any){
    let length = 0;
    gradeTable.forEach(element => {
      length = Object.keys(element.assignments).length
      console.log(Object.keys(element.assignments).length)
    });
    console.log(gradeTable)
    return length;
  }

  getFinalAssignmentLength(gradeTable: any){
    gradeTable.forEach(grade => {
      Object.keys(grade.assignments).forEach(key=>{
        const creationDate = new Date(grade.assignments[key].creationTime);
        if (creationDate.getMonth()+1 >= 6 && creationDate.getMonth()+1 < 13 ){
          console.log('final')
        }
        if (creationDate.getMonth()+1 <= 5 && creationDate.getMonth()+1 > 0){
          console.log('mid')
        }   
      })
    });
  }

  getAssignmentMaxPoints(gradeTable: any){
    let maxPoints = 0;
    gradeTable.forEach((element,index) => {
      if(index == 0){
        Object.keys(element.assignments).forEach((key)=>{
          maxPoints += element.assignments[key].maxPoints || 0;
        })
      }
    });
    return maxPoints;
  }
}
