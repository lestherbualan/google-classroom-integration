import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  constructor() { }

  getGradeRating(gradeTable:any, coursework:any){
    gradeTable.forEach(gradetable=> {
      coursework.courseWork.forEach(coursework => {
        
      });  
    });
    
    return gradeTable;
  }
}
