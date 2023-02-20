import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { login } from "src/app/projectmanagement/models/login-model";
import { environment } from "src/environments/environment.prod";
import { forms } from "src/app/formbuilder/Model/formslistmodel";
import { Observable, Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { v1 as uuidv1 } from "uuid";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Injectable({
  providedIn: "root",
})
export class FormmappingService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  constructor(private Http: HttpClient,private encrptdecrpt:EncryptDecryptService) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.getStoredFormList();
  }
  su: login;
  formList: any[] = [];
  annotationCreateForm(getData) {
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    var parem = { created_date:createdDate,
      last_updated_date:createdDate,
      sync_version_uuid:"0",
      updated_by_userid: this.su.user_id.toString(),
      layers: getData,
      token 
    }; 
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/create_form",
      parem
    );
  }

  annotationMedia(file_data, annotation_id, media_id) {
    console.log(file_data, annotation_id, media_id);
    const filedata: FormData = new FormData();
    let myDate = new Date();
    let name_file = myDate.getDay()+"-"+myDate.getMonth()+"-"+myDate.getFullYear()+"-"+myDate.getUTCHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds()
    filedata.append("file_data", file_data, name_file);
    filedata.append("annotation_id", annotation_id);
    filedata.append("media_id", media_id);
    console.log(filedata);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    filedata.append("updated_by_userid", String(user_token.user_id));
    filedata.append("token", token);
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/annotation_media",filedata);
  }

  annotationMediaMultiple(file_data,multipleList){
    console.log(file_data, multipleList,);
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    const filedata: FormData = new FormData();
    let myDate = new Date();
    let name_file = myDate.getDay()+"-"+myDate.getMonth()+"-"+myDate.getFullYear()+"-"+myDate.getUTCHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds()
    filedata.append("file_data", file_data, name_file);
    for(let ami=0;ami<multipleList.length;ami++){
      let mediaId = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
      filedata.append("annotation_id", multipleList[ami].annotation_id);
      filedata.append("media_id", mediaId);
    }
    console.log(filedata);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    filedata.append("updated_by_userid", String(user_token.user_id));
    filedata.append("token", token);
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/upload_annotation_media_web",filedata);
  }

  get_all_annotation() {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var projectid = this.encrptdecrpt.getItem("projectIdlocal");
    console.log(projectid, this.su.user_id);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/get_all_annotation",
      {project_id: projectid, user_id: this.su.user_id,token}
    );
  }

  projectId: string = "";

  getformlist(): Observable<forms[]> {
    var formlist = new forms();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";

    formlist.user_id = this.su.user_id;
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    formlist.project_id = this.projectId;

    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<forms[]>(this.APIBaseUrl + "formbuilder/get_project_forms_list", 
    {...formlist,token}).pipe(catchError(this.handleError));
  }

  getStoredFormList() {
    this.getformlist().subscribe((res) => {
      this.formList = res["response_body"]["form_listing"];
      console.log(res["response_body"]["form_listing"]);
    });
  }


  getMessageFormList() {
    return this.formList;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
