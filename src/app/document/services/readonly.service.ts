import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReadonlyService {
  constructor() {}
  private subject = new Subject<any>();

  sendMessage(message: any) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  private subject2 = new Subject<any>();

  sendStampMessage(message: any) {
    this.subject2.next(message);
  }

  getStampMessage(): Observable<any> {
    return this.subject2.asObservable();
  }

  private subject1 = new Subject<any>();

  sendAnnotationMessage(message: any) {
    this.subject1.next(message);
  }

  getAnnotationMessage(): Observable<any> {
    return this.subject1.asObservable();
  }
}
