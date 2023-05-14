import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import * as ExcelJs from 'exceljs';
import  pdfFonts  from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  async invkPrintPdf(worksheet: ExcelJs.Worksheet){
   
  }
}
