import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  getCourseList(data:any){
    return this.http.get(environment.googleAPIBaseUrl+ 'courses?key='+data.config.apiKey);
  }
}
