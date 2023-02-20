import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { setFlagsFromString } from 'v8';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormnameService {
  private subject = new Subject<any>();

  sendMessage(message: string) {

    this.subject.next(message);

  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  private subject1 = new Subject<any>();

  sendForm(message: string) {
    this.subject1.next(message);
  }

  getForm(): Observable<any> {
    return this.subject1.asObservable();
  }

  getaddFormRefresh = new EventEmitter<any>();
}