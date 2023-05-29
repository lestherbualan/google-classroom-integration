import { Injectable } from '@angular/core';
import * as ExcelJs from 'exceljs';
import { Grade } from 'src/app/model/Grade';
import { slsulogowithtext } from '../../assets/slsulogowithtext';
import { elementAt } from 'rxjs';
import { importantBase64 } from '../../assets/important';

@Injectable({
  providedIn: 'root'
})
export class NewclassrecordService {

  constructor() { }

  exportNewRecord(workbook: ExcelJs.Workbook, worksheet: ExcelJs.Worksheet, courseName: string, gradeTable: Grade[],instructorName){
    worksheet.properties.defaultColWidth = 4;

    const slsuheader = workbook.addImage({
      base64: slsulogowithtext,
      extension: 'png',
    });
    worksheet.addImage(slsuheader, {
      tl: { col: 1, row: 1 },
      ext: { width: 285, height: 77 }
    });

    worksheet.mergeCells('M2:W2');
    worksheet.mergeCells('M3:W3');
    worksheet.mergeCells('M4:W4');
    worksheet.mergeCells('M5:W5');
    
    const campus = worksheet.getCell('M2');
    const campusAdress = worksheet.getCell('M3');
    const campusContact = worksheet.getCell('M4');
    const campusWebsite = worksheet.getCell('M5');

    campus.value = 'TOMAS OPPUS CAMPUS';
    campusAdress.value = 'San Isidro, Tomas Oppus, Southern Leyte';
    campusContact.value = 'Contact No. 09486089319';
    campusWebsite.value = 'Website: www.southernleytestateu.edu.ph';

    const arrayHeader = [campus,campusAdress,campusContact,campusWebsite];
    arrayHeader.forEach(element =>{
      element.alignment = {
        horizontal: 'center'
      }
    })

    const docCode = worksheet.getCell('Z2')
    const docRevision = worksheet.getCell('Z3')
    const docDate = worksheet.getCell('Z4')

    docCode.value = 'Doc. Code: SLSU-QF-R006'
    docRevision.value = 'Revision: 00'
    docDate.value = 'Date: 20 October 2016'

    const important = workbook.addImage({
      base64: importantBase64,
      extension: 'png',
    });

    worksheet.addImage(important, {
      tl: { col:25, row: 4 },
      ext: { width: 250, height: 75 }
    });
    // r c, r c
    worksheet.mergeCells(9,2,9, 34);
    const excellence = worksheet.getCell(9,2)
    excellence.value = 'Excellence | Service | Leadership and Good Governance | Innovation | Social Responsibility | Integrity | Professionalism | Spirituality'
    excellence.border = {
      bottom: { style: 'thin'}
    }
    excellence.alignment = {
      horizontal: 'center'
    }

    worksheet.mergeCells(11,2,11, 34);
    const title = worksheet.getCell(11,2);
    title.value = `STUDENT'S RECORD ENTRY FORM`;
    title.alignment = {
      horizontal: 'center'
    }
    title.font = {
      size: 26,
      bold: true
    }

    worksheet.getRow(12).height = 100;
    worksheet.mergeCells('B12:N12')
    const practice2 = worksheet.getCell('C12')
    practice2.value = 'Practice 2';
    practice2.alignment = {
      horizontal: 'center'
    }

    worksheet.mergeCells('B13:N13')
    const studentName = worksheet.getCell('B13')
    studentName.value = `STUDENT'S NAME`;
    studentName.alignment = {
      horizontal: 'center'
    }

    gradeTable.forEach((element:any, index) =>{
      const indexCell = worksheet.getCell('B'+(14+index))
      const studentCell = worksheet.getCell('C'+(14+index))
      worksheet.mergeCells('C'+(14+index),'N'+(14+index))
      indexCell.value = `${index+1}.`;
      
      studentCell.value = `${element.surName} , ${element.firstName}`;
      console.log(element)
      Object.keys(element.assignments).forEach((key,assignmentIndex) => {
        worksheet.getCell(14,15+assignmentIndex).value = element.assignments[key].assignedGrade
      });

    });

  }
}
