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

  getCourseDetail(data:any, auth){
    return this.http.get(environment.googleAPIBaseUrl+ 'courses/'+data.id+'/courseWork?key='+auth.config.apiKey)
  }

  getCourseStudents(data:any, auth){
    return this.http.get(environment.googleAPIBaseUrl+ 'courses/'+data.id+'/students?key='+auth.config.apiKey)
  }
  getCourseStudentProfile(data:any,auth){
    return this.http.get(environment.googleAPIBaseUrl+ 'userProfiles/'+data.id+'?key='+auth.config.apiKey)
  }
  
  getCourseStudentsGrades(data:any,auth){
    return this.http.get(environment.googleAPIBaseUrl+ 'courses/'+data.courseId+'/courseWork/'+data.courseWorkId+'/studentSubmissions?key='+auth.config.apiKey)
  }

  getTeacherProfile(data:any,auth){
    return this.http.get(environment.googleAPIBaseUrl+ 'courses/'+data.courseId+'/teachers/'+data.creatorId+'?key='+auth.config.apiKey)
  }
}