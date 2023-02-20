import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private subject = new Subject<any>();

  sendformid(message:string) {
    
      this.subject.next(message);
      
  }

  

  getformid(): Observable<any> {
      return this.subject.asObservable();
  }
 
}
