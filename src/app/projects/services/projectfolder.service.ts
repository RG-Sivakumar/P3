import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { projectFolder } from "../models/projectfolder.model";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { login } from "src/app/projectmanagement/models/login-model";
import { FormDetailsset } from "../models/formDetails.model";
import { retry } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";
import { getDocumentPage } from "../models/getDocumentpage";
import { setactivelayer } from "../models/setactivelayer.model";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Injectable({
  providedIn: "root",
})
export class ProjectfolderService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  su: login;

  constructor(private http: HttpClient,private encrptdecrpt:EncryptDecryptService) { }


  getDocumentPageId(projectId, folderId) {
    var getDocPage = new getDocumentPage();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    getDocPage.user_id = this.su.user_id;
    getDocPage.project_id = projectId;
    getDocPage.folder_id = folderId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.http.post<any>(this.APIBaseUrl + "folder/get_document_pages", 
    {...getDocPage,token});
  }

  getProjectfolder(user_id, project_id): Observable<any> {
    var sendData = new projectFolder();
    sendData.user_id = user_id;
    sendData.project_id = project_id;
    sendData.is_hidden = false;
    sendData.is_all_folders = true;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.http
      .post<any>(this.APIBaseUrl + "folder/get_project_folders", 
      {...sendData,token})
      .pipe(retry(3));
  }

  updatefolder(paramvalue): Observable<projectFolder[]> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var updateData = new projectFolder();
    let createdDate = new Date().toISOString();
    updateData.folder_id = paramvalue.folder_id;
    updateData.folder_name = paramvalue.folder_name;
    updateData.parent_folder_id = paramvalue.parent_folder_id;
    updateData.folder_level = paramvalue.folder_level;
    updateData.is_hidden = false;
    updateData.created_date = createdDate;
    updateData.last_updated_date = createdDate;
    updateData.sync_version_uuid = "0";
    updateData.updated_by_userid = this.su.user_id.toString();
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "folder/update_folder",
      {...updateData,token}
    );
  }

  getFolderAllTag(projectId): Observable<projectFolder[]> {
    var getFolderTag = new projectFolder();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    getFolderTag.user_id = this.su.user_id;
    getFolderTag.project_id = projectId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "folder/get_all_folder_tags",
      {...getFolderTag,token}
    );
  }

  setactivelayerUpdate(folderId,pageData,layerId){
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    let setactiveModel = new setactivelayer();
    setactiveModel.document_id = folderId;
    setactiveModel.created_date = createdDate;
    setactiveModel.user_id = this.su.user_id;
    setactiveModel.page_data = [];
    setactiveModel.sync_version_uuid = "0";
    setactiveModel.last_updated_date = createdDate;
    let buildactiveArray = [];
    for(let k=0;k<pageData.length;k++){
      let singlePageObject = new Object();
      singlePageObject["page_id"] = pageData[k];
      singlePageObject["layer_id"] = layerId;
      buildactiveArray.push(singlePageObject);
    }
    setactiveModel.active_layer_id = buildactiveArray;
    console.log(JSON.stringify(setactiveModel));
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(this.APIBaseUrl + "annotation/update_base_icon",
    {...setactiveModel,token}
    ); 
  }



  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy);
  }

  updatedDataSelectionValue = new EventEmitter<any>();

  private dataSource = new BehaviorSubject<any>('1');
  data = this.dataSource.asObservable();

  updatedDataSelection(data:{}){
    this.dataSource.next(data);
  }

  statusUpdated = new EventEmitter<any>();

  updateStatus(status: string) { }

  loaderActivated = new EventEmitter<any>();

autocademit= new EventEmitter<any>();
}
