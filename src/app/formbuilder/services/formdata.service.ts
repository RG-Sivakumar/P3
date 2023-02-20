import { Injectable, OnInit } from "@angular/core";
import { elementData, value } from "../Model/controlmodel";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { login } from "src/app/projectmanagement/models/login-model";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Injectable()
export class FormdataService implements OnInit {
  value: value = {
    label: "",
    value: "",
  };
  toggle = false;
  model: any;
  su: login;
  element_data = new elementData();
  readonly APIBaseUrl = environment.APIBaseUrl;
  
  constructor(private http: HttpClient,private encrptdecrpt:EncryptDecryptService) { }

  ngOnInit():void{
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }
  get() {
    return this.model;
  }
  set(data) {
    this.model = data;
  }
  
  get_form_elements_structure(): Observable<any[]> {
    return this.http.post<any[]>(
      this.APIBaseUrl + "formbuilder/get_form_elements_structure",
      null
    );
  }

  update_form_data(Updatemodel): Observable<any[]> {
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    Updatemodel.created_date= createdDate;
    Updatemodel.last_updated_date= createdDate,
    Updatemodel.sync_version_uuid= "0",
    console.log(Updatemodel);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any[]>(this.APIBaseUrl + "formbuilder/update_form_data",
    {...Updatemodel,token});
  }
}
