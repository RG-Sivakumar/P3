import { Injectable } from '@angular/core';
import { EncryptDecryptService } from './commonshared/services/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardServiceService {
  constructor(private encrptdecrpt:EncryptDecryptService) { }
  gettoken() {
    // return !!this.encrptdecrpt.getItem("loggedIn");
    let loggedIn = this.encrptdecrpt.getItem("loggedIn");//security;
    loggedIn = (loggedIn == null || loggedIn == undefined) ? false : true;
    return loggedIn;
  }
}

