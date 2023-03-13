import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  constructor() { }

  getGradeRating(data:any){
    console.log(data)
    return data;
  }
}
