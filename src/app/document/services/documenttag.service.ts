import { Injectable } from "@angular/core";
import { getDocumentDetails } from "../models/getDocumentDetails.model";
import { HttpClient } from "@angular/common/http";
import { login } from "src/app/projectmanagement/models/login-model";
import { Subject, Observable, throwError } from "rxjs";
import { Moreoption } from "src/app/projects/models/moreoption.model";
import { environment } from "src/environments/environment.prod";
import { annotateFile } from "../models/addNewfileAnnotate.model";
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { current_toolbar, search_input } from "../models/documentmodel";
import { retry, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DocumenttagService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  constructor(private Http: HttpClient,private dataService:DataService,
  private encrptdecrpt:EncryptDecryptService) { }
  formData = new getDocumentDetails();
  su: login;
  getPageAllTag(page_id) {
    var taglist = new getDocumentDetails();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    taglist.user_id = this.su.user_id;
    taglist.page_id = page_id;

    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
     return this.Http.post<any>(
      this.APIBaseUrl + "annotation/get_all_page_tags",
      {...taglist,token}
    );
  }

  getPageTag(page_id) {
    var taglist = new getDocumentDetails();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    taglist.user_id = this.su.user_id;
    taglist.page_id = page_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/get_page_tags",
      {...taglist,token}
    );
  }
  AddPageTag(page_id, layer_page_tag_name) {
    var tag = new getDocumentDetails();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    tag.user_id = this.su.user_id;
    tag.layer_page_tag_name = layer_page_tag_name.split(",");
    tag.page_id = page_id;
    tag.created_date=createdDate;
    tag.last_updated_date=createdDate;
    tag.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/add_page_tags",
      {...tag,token}
    );
  }
  RemovePageTag(page_id, layer_page_tag_id) {
    var tag = new getDocumentDetails();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    tag.user_id = this.su.user_id;
    tag.layer_page_tag_id = Number(layer_page_tag_id);
    tag.page_id = page_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/remove_page_tags",
      {...tag,token}
    );
  }

  addasNewDoc(projectId, pageId, imgurl, uuid, documentName, folderid, level) {
    console.log(typeof folderid, Number(folderid), folderid, level);
    var newdoc = new annotateFile();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    newdoc.user_id = this.su.user_id;
    newdoc.project_id = projectId;
    newdoc.image_url = imgurl;
    newdoc.document_name = documentName;
    newdoc.parent_folder_id = folderid;
    newdoc.folder_level = level;
    newdoc.added_from_which_medium = "drive";
    newdoc.document_id = this.su.user_id + "-" + uuid + "-" + new Date().getTime();
    newdoc.page_id = this.su.user_id + "-" + pageId + "-" + new Date().getTime();
    newdoc.created_date= createdDate;
    newdoc.last_updated_date= createdDate;
    newdoc.sync_version_uuid="0";
    console.log(this.APIBaseUrl + "folder/copy_annotaion_image_document_web", newdoc);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "folder/copy_annotaion_image_document_web", 
    {...newdoc,token});
  }

  addasNewDocAnnotate(projectId, pageId, imgurl, uuid, documentName, folderid, level) {
    console.log(typeof folderid,Number(folderid),folderid,level);
    var newdoc = new annotateFile();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    newdoc.user_id = this.su.user_id;
    newdoc.project_id = projectId;
    newdoc.image_url = imgurl;
    // convert special character 
    documentName = this.dataService.changeFormat(documentName);
    newdoc.document_name = documentName;
    newdoc.parent_folder_id = folderid;
    newdoc.folder_level = level+1;
    newdoc.added_from_which_medium = "drive";
    newdoc.document_id = uuid;
    newdoc.page_id = pageId;
    newdoc.created_date= createdDate;
    newdoc.last_updated_date= createdDate;
    newdoc.sync_version_uuid="0";
    console.log(this.APIBaseUrl + "folder/copy_annotaion_image_document_web",newdoc);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "folder/copy_annotaion_image_document_web",
    {...newdoc,token});
  }

  get_current_toolbar(projectid:string):Observable<any[]>{
    let toolbar_ins = new current_toolbar(projectid);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<any[]>(this.APIBaseUrl + 'toolbar/get_toolbar_name',
    {...toolbar_ins,token,"updated_by_userid":String(user_token.user_id)}).pipe(retry(1),catchError(this.handleError));
  }

  get_formlist(projectid:string):Observable<any[]>{
    let toolbar_ins = new current_toolbar(projectid);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<any[]>(this.APIBaseUrl + 'formbuilder/get_form_name',
    {...toolbar_ins,token,"updated_by_userid":String(user_token.user_id)}).pipe(retry(1),catchError(this.handleError));
  }

  get_search_annotation(search_params:search_input):Observable<any>{
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    search_params.user_id = this.su.user_id;
    let searchinput = new search_input(search_params.page_id,search_params.all_data,search_params.user_id,
      search_params.is_tag,search_params.is_stub,search_params.is_photo,search_params.is_form,search_params.search_key);
    console.log(searchinput);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<any>(this.APIBaseUrl + "annotation/annotation_filter",
    {...searchinput,token});
  }

   // Error handling
   handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }

  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy);
  }


}
