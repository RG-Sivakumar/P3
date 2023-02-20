import { Injectable } from '@angular/core';
import  SecureStorage  from "secure-web-storage";
import * as CryptoJS from 'crypto-js';
import * as settingsvalues from './encrypt-settings'
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {
  secureStorage:any = null;
  constructor(private http: HttpClient) {
      this.secureStorage = new SecureStorage(localStorage, {
        hash: function hash(key) {
          key = CryptoJS.SHA256(key, settingsvalues.toeraatpaas);
          return key.toString();
        },
        encrypt: function encrypt(data) {
          data = CryptoJS.AES.encrypt(data,settingsvalues.toeraatpaas);
  
          data = data.toString();
  
          return data;
        },
        decrypt: function decrypt(data) {
          data = CryptoJS.AES.decrypt(data,settingsvalues.toeraatpaas);
  
          data = data.toString(CryptoJS.enc.Utf8);
  
          return data;
        }
      });
  }


  setItem(key,value){
    // var data = {secret: 'data'};
    // there is no need to stringify/parse you objects before and after storing.
    this.secureStorage.setItem(key, value);
  }

  getItem(key){
    console.log("getItem",key)
    var decryptedData = this.secureStorage.getItem(key);
    // there is no need to stringify/parse you objects before and after storing.
    return decryptedData;
  }

  removeItem(key){
    this.secureStorage.removeItem(key);
  }

  // login api encrypt password send api this password
  encrypt(data, keyvalue) {
    data = JSON.stringify(data);
    data = CryptoJS.AES.encrypt(data, keyvalue);
    data = data.toString();
    return data;
  }

  decrypt(data,keyvalue) {
    data = CryptoJS.AES.decrypt(data,keyvalue);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }

  hash(key) {
    key = CryptoJS.SHA256(key,settingsvalues.toeraatpaas);
    return key.toString();
  }
}
