import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
@Injectable({
  providedIn: "root",
})

export class DataimageService {
  private subject = new Subject<any>();

  sendMessage(message: string) {
    this.subject.next(message);
  }
  sendboolean(message1: boolean) {
    this.subject.next(true);
  }
  getboolean(): Observable<any> {
    return this.subject.asObservable();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  securityKey1() {
    let getServerMode = environment.APIBaseUrl;
    let SERVER_MODE = "";
    if (getServerMode.includes('devapi')) {
      SERVER_MODE = 'dev';
    }
    else if (getServerMode.includes('qaapi')) {
      SERVER_MODE = 'qa';
    }
    else {
      SERVER_MODE = 'live';
    }
    console.log(SERVER_MODE);
    if (SERVER_MODE == 'dev') {
      return "C9zKeDLsNtvnIwO4y2J0ix3hP5oRYEgSb6QcTkWHZfqFrUjBpmdGuXV78AlaM1";
    } else if (SERVER_MODE == 'qa') {
      return "umWiZzPpBk3aTcXrMI9lojD0tLUfHV6s5NgF1enJvS47EQKR2dwOYqAxhybGC8";
    } else if (SERVER_MODE == 'live') {
      return "Hf0sA4gpiYQh6IeGOKdDaBr8qlwbjC7FxZ3nz5oVUE291uSMTJcRyWNvtLPkmX";
    } if (SERVER_MODE == 'local') {
      return "61f0502399ba7df38a5aa86c811882594bc879791da257b0cb9b3be3bee53514";
    }
  }

  securityKey2(){
    let getServerMode = environment.APIBaseUrl;
    let SERVER_MODE = "";
    if (getServerMode.includes('devapi')) {
      SERVER_MODE = 'dev';
    }
    else if (getServerMode.includes('qaapi')) {
      SERVER_MODE = 'qa';
    }
    else {
      SERVER_MODE = 'live';
    }
    console.log(SERVER_MODE);
      if (SERVER_MODE == 'dev') {
          return "2nDcvrB5YX8zus@%Gsh%q2wMAcqZFP";
      } else if (SERVER_MODE == 'qa') {
          return "2naBwa*v$vgU3bqM$U7Wgduef*2$AF";
      } else if (SERVER_MODE == 'live') {
          return "0$45628226b-a7ae-WW48fd-9c6b-a9fa2d10cb40";
      } if (SERVER_MODE == 'local') {
          return "asdsadsaD34E314132QSDFSDSDADSASD";
      }
  }

  
  



}


