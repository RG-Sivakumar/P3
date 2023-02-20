import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private activeResult: any = "";

  constructor() { }


  nextButtonActive(message: any) {
    this.activeResult = message;
  }

  getButtonActive() {
    return this.activeResult;
  }


  private subject = new Subject<any>();
  nextMessage(message: any) {
    this.subject.next(message);
  }
  getMessage() {
    return this.subject.asObservable();
  }

  publishToolbarSend = new EventEmitter<any>();

  sendandGetPreview = new EventEmitter<any>();


  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy);
  }
}
