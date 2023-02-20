import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { toolbar } from "../Model/toolbarmodel";
import { login } from "src/app/projectmanagement/models/login-model";
import { text } from "d3";
import { environment } from "src/environments/environment.prod";
import { Subject } from "rxjs/Subject";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
@Injectable({
  providedIn: "root",
})
export class ToolbardesignService {
  model: any;
  su: login;
  formData = new toolbar();
  get() {
    return this.model;
  }
  set(data) {
    this.model = data;
  }
  readonly APIBaseUrl = environment.APIBaseUrl;
  
  constructor(private http: HttpClient,private encrptdecrpt:EncryptDecryptService) { }
  
  get_toolbar_elements_structure(): Observable<[]> {
    return this.http.post<[]>(this.APIBaseUrl + "toolbar/get_toolbar_elements_structure", null);
  }
  get_toolbar_data(toolbar_id) {
    var tbr = new toolbar();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    tbr.user_id = this.su.user_id;
    tbr.toolbar_id = toolbar_id;
    tbr.updated_by_userid = this.su.user_id.toString();
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "toolbar/get_toolbar_data",
      {...tbr,token}
    );
  }
  update_toolbar_data(UpdateToolbarModel): Observable<any[]> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    UpdateToolbarModel.created_date= createdDate;
    UpdateToolbarModel.last_updated_date= createdDate;
    UpdateToolbarModel.sync_version_uuid= "0";
    console.log(UpdateToolbarModel);
    console.log(this.APIBaseUrl + "toolbar/update_toolbar_data",
    UpdateToolbarModel)
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any[]>(
      this.APIBaseUrl + "toolbar/update_toolbar_data",
      {...UpdateToolbarModel,token}
    );
  }
  merge_toolbar_data(UpdateToolbarModel):Observable<any[]>{
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    UpdateToolbarModel.last_updated_date= createdDate;
    UpdateToolbarModel.sync_version_uuid= "0";
    console.log(JSON.stringify(UpdateToolbarModel))
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
  return this.http.post<any[]>(
      this.APIBaseUrl + "toolbar/merge_toolbar_element",
      {...UpdateToolbarModel,token}
    );
  }
  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy);
  }
}
