import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { addnewfolder } from "../models/addnewfolder.model";
import { login } from "src/app/projectmanagement/models/login-model";
import { Subject, Observable } from "rxjs";
import { addnewsubfolder } from "../models/addnewsubfolder.model";
import { UploadFile } from "../models/uploadfile.model";
import { environment } from "src/environments/environment.prod";
import { v1 as uuidv1 } from "uuid";
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Injectable({
  providedIn: "root",
})
export class AddcontentService {
  private subject1 = new Subject<any>();

  SetFolderDetails(message: string) {
    this.subject1.next(message);
  }

  GetFolderDetails(): Observable<any> {
    return this.subject1.asObservable();
  }

  readonly APIBaseUrl = environment.APIBaseUrl;
  su: login;



  constructor(private Http: HttpClient,private textCheckService:DataService,
    private encrptdecrpt:EncryptDecryptService) { }

  addNewFolder(folder_name, projectId, uuidoption, date) {
    var addnewfoldermdl = new addnewfolder();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    addnewfoldermdl.folder_id = this.su.user_id + "-" + uuidoption.toString() + "-" + date;
    addnewfoldermdl.user_id = this.su.user_id;
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    addnewfoldermdl.project_id = projectId;
    addnewfoldermdl.folder_name = folder_name;
    addnewfoldermdl.parent_folder_id = "0";
    addnewfoldermdl.folder_level = 0;
    addnewfoldermdl.is_folder_flag = true;
    addnewfoldermdl.created_date = createdDate;
    addnewfoldermdl.last_updated_date = createdDate;
    addnewfoldermdl.sync_version_uuid = "0";
    console.log(addnewfoldermdl);
    console.log(this.APIBaseUrl + "folder/create_folder", addnewfoldermdl);
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/create_folder",
      {...addnewfoldermdl,token}
    );
  }

  getSubFolder(projectId, subfolderName, level, folderid, uuid, date) {
    var addnewsubfoldermdl = new addnewsubfolder();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    addnewsubfoldermdl.folder_id = this.su.user_id + "-" + uuid + "-" + date;
    addnewsubfoldermdl.user_id = this.su.user_id;
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    addnewsubfoldermdl.project_id = projectId;
    addnewsubfoldermdl.folder_name = subfolderName;
    addnewsubfoldermdl.parent_folder_id = folderid;
    addnewsubfoldermdl.folder_level = level + 1;
    addnewsubfoldermdl.is_folder_flag = true;
    addnewsubfoldermdl.created_date = createdDate;
    addnewsubfoldermdl.last_updated_date = createdDate;
    addnewsubfoldermdl.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "folder/create_folder", addnewsubfoldermdl);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/create_folder",
      {...addnewsubfoldermdl,token}
    );
  }
  directlyUploadFile(
    projectId,
    filename,
    fileextention,
    noOfPages,
    filetype,
    uuid,
    date,
    file,
    page_id
  ) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    const formdataDireUpFl: FormData = new FormData();
    formdataDireUpFl.append("user_id", this.su.user_id.toString());
    formdataDireUpFl.append("project_id", projectId);
    formdataDireUpFl.append("document_name", filename);
    formdataDireUpFl.append("parent_folder_id", "0");
    formdataDireUpFl.append("folder_level", "0");
    formdataDireUpFl.append("no_of_pages", noOfPages);
    formdataDireUpFl.append("added_from_which_medium", "gallery");
    formdataDireUpFl.append("file_type", filetype);
    formdataDireUpFl.append("file_extension", fileextention);
    formdataDireUpFl.append(
      "folder_id",
      this.su.user_id + "-" + uuid + "-" + date
    );

    formdataDireUpFl.append(
      "document_id",
      this.su.user_id + "-" + uuid + "-" + date
    );
    formdataDireUpFl.append(
      "created_date",
      createdDate
    );
    formdataDireUpFl.append(
      "last_updated_date",
      createdDate
    );
    formdataDireUpFl.append(
      "sync_version_uuid",
      "0"
    );
    formdataDireUpFl.append(
      "updated_by_userid",
      this.su.user_id.toString()
    );
    for (var i = 0; i < page_id.length; i++) {
      formdataDireUpFl.append("page_id", page_id[i]);
    }
    let myDate = new Date();
    let name_file = myDate.getDay()+"-"+myDate.getMonth()+"-"+myDate.getFullYear()+"-"+myDate.getUTCHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds()
    formdataDireUpFl.append("file_data", file,name_file);
    console.log(
      this.APIBaseUrl + "folder/create_documentfile_upload",
      formdataDireUpFl
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    formdataDireUpFl.append(token,token);
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/create_documentfile_upload",
      formdataDireUpFl
    );
  }

  incertDoc(doc_id, noOfPages, projectId, page_id) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    const formdataDireUpFl: FormData = new FormData();
    formdataDireUpFl.append("document_id", doc_id);
    formdataDireUpFl.append("project_id", projectId);
    formdataDireUpFl.append("no_of_pages", noOfPages);
    formdataDireUpFl.append("page_ids", page_id);
    // for (var i = 0; i < page_id.length; i++) {
    //   formdataDireUpFl.append("page_ids", page_id[i]);
    // }
    console.log(formdataDireUpFl);
    // console.log(page_id[i]);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    formdataDireUpFl.append("updated_by_userid", String(user_token.user_id));
    formdataDireUpFl.append("token",token);
    return this.Http.post<any>(this.APIBaseUrl + "folder/insert_document_files",formdataDireUpFl);
  }
  uploadFile(
    projectId,
    filename,
    folderid,
    folderlevel,
    noOfPages,
    receiefileType,
    fileexten,
    uuid,
    date,
    file,
    page_id
  ) {
    console.log(projectId,
      filename,
      folderid,
      folderlevel,
      noOfPages,
      receiefileType,
      fileexten,
      uuid,
      date,
      file,
      page_id);
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();

    let headers = new HttpHeaders();
    //this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', "multipart/form-data");
    let params = new HttpParams();
    const formdata: FormData = new FormData();
    formdata.append("user_id", this.su.user_id.toString());
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    
    filename = this.textCheckService.changeFormat(filename);
    let myDate = new Date();
    let name_file = myDate.getDay()+"-"+myDate.getMonth()+"-"+myDate.getFullYear()+"-"+myDate.getUTCHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds()
    formdata.append("file_data", file,name_file);
    formdata.append("project_id", projectId);
    formdata.append("document_name", filename);
    formdata.append("parent_folder_id", folderid);
    formdata.append("folder_level", folderlevel + 1);
    formdata.append("no_of_pages", noOfPages);
    formdata.append("created_date", createdDate);
    formdata.append("last_updated_date", createdDate);
    formdata.append("sync_version_uuid", "0");
    formdata.append("updated_by_userid", this.su.user_id.toString());
    formdata.append("added_from_which_medium", "gallery");
    formdata.append("file_type", receiefileType);
    formdata.append("file_extension", fileexten);
    formdata.append("folder_id", this.su.user_id + "-" + uuid + "-" + date);
    formdata.append("document_id", this.su.user_id + "-" + uuid + "-" + date);
    for (var i = 0; i < page_id.length; i++) {
      formdata.append("page_id", page_id[i]);
    }
    formdata.forEach((value,key)=>{
      console.log(value,key);
    })
    
    console.log('pdf inside', this.APIBaseUrl + "folder/create_document_upoload",formdata);
    // return this.Http.post<any>(
    //   this.APIBaseUrl + "folder/create_document_upoload",
    //   formdata
    // );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    formdata.append("token", token);
    return this.Http.post(this.APIBaseUrl + "folder/create_document_upoload", formdata, {
      headers,
      reportProgress: true,
      observe: 'events'
    });
    // else {
    //   console.log('png inside',this.APIBaseUrl + "folder/create_document_upoload",
    //   formdata);
    //   return this.Http.post<any>(
    //     this.APIBaseUrl + "folder/create_document_upoload",
    //     formdata
    //   );
    // }

  }

  directlyAddFieldSheet(projectId, document_name, noOfPages, mode, uuid, date, pageId) {
    console.log(projectId, document_name, noOfPages, mode, uuid, date);
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    const formdataDirAdFeSh: FormData = new FormData();
    formdataDirAdFeSh.append("user_id", this.su.user_id.toString());
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    formdataDirAdFeSh.append("project_id", projectId);
    formdataDirAdFeSh.append("document_name", document_name);
    formdataDirAdFeSh.append("parent_folder_id", "0");
    formdataDirAdFeSh.append("folder_level", "0");
    formdataDirAdFeSh.append("no_of_pages", noOfPages);
    formdataDirAdFeSh.append("added_from_which_medium", "field_sheet");
    formdataDirAdFeSh.append("file_type", "image");
    formdataDirAdFeSh.append("file_extension", "png");
    formdataDirAdFeSh.append("page_orientation", mode);
    formdataDirAdFeSh.append(
      "created_date",
      createdDate
    );
    formdataDirAdFeSh.append(
      "last_updated_date",
      createdDate
    );
    formdataDirAdFeSh.append(
      "sync_version_uuid",
      "0"
    );
    formdataDirAdFeSh.append(
      "updated_by_userid",
      this.su.user_id.toString()
    );
    formdataDirAdFeSh.append("folder_id", this.su.user_id + "-" + uuid + "-" + date);
    formdataDirAdFeSh.append("document_id", this.su.user_id + "-" + uuid + "-" + date);
    for (var i = 0; i < pageId.length; i++) {
      formdataDirAdFeSh.append("page_id", pageId[i]);
    }
    console.log(
      this.APIBaseUrl + "folder/create_fieldsheet",
      formdataDirAdFeSh
    );

    
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    formdataDirAdFeSh.append("token", token);
    formdataDirAdFeSh.append("updated_by_userid", this.su.user_id.toString());
    
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/create_fieldsheet",
      formdataDirAdFeSh
    );
  }

  fieldSheetAuc(
    projectId,
    document_name,
    folderid,
    folderlevel,
    noOfPages,
    mode,
    uuid,
    date,
    pageId
  ) {
    console.log(projectId,
      document_name,
      folderid,
      folderlevel,
      noOfPages,
      mode,
      uuid,
      date,
      pageId)
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    const formdata1: FormData = new FormData();
    formdata1.append("user_id", this.su.user_id.toString());
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    formdata1.append("project_id", projectId);
    formdata1.append("document_name", document_name);
    formdata1.append("parent_folder_id", folderid);
    formdata1.append("folder_level", folderlevel + 1);
    formdata1.append("no_of_pages", noOfPages);
    formdata1.append("added_from_which_medium", "field_sheet");
    formdata1.append("file_type", "image");
    formdata1.append("file_extension", "png");
    formdata1.append("page_orientation", mode);
    formdata1.append("folder_id", this.su.user_id + "-" + uuid + "-" + date);
    formdata1.append("document_id", this.su.user_id + "-" + uuid + "-" + date);
    formdata1.append("created_date",createdDate);
    formdata1.append("last_updated_date",createdDate);
    formdata1.append("sync_version_uuid","0");
    formdata1.append("updated_by_userid",this.su.user_id.toString());
    console.log(formdata1);
    for (var i = 0; i < pageId.length; i++) {
      formdata1.append("page_id", pageId[i]);
    }
    console.log(this.Http.post<any>(this.APIBaseUrl + "folder/create_fieldsheet", formdata1));
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    formdata1.append("token",token);
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/create_fieldsheet",
      formdata1
    );
  }

  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy);
  }

  uploadAttachment(file,extenstion,filename){
    console.log(file,extenstion,filename);
    const formdata: FormData = new FormData();
    let myDate = new Date();
    let name_file = myDate.getDay()+"-"+myDate.getMonth()+"-"+myDate.getFullYear()+"-"+myDate.getUTCHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds()
    formdata.append("file_data", file,name_file);
    formdata.append("file_name", filename);
    formdata.append("file_extension", extenstion);
    console.log(formdata)
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    formdata.append("token", token);
    formdata.append("updated_by_userid", String(user_token.user_id));

    return this.Http.post<any>(
      this.APIBaseUrl + "folder/support_submit_upoload",
      formdata
    );
  }


  uploadStubs(userid, projectId, file, filetype, filename,allusers) {
    console.log(userid, projectId, file, filetype, filename);
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    const formdata: FormData = new FormData();
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    filename = this.textCheckService.changeFormat(filename);
    formdata.append("user_id", userid);
    formdata.append("project_id", projectId);
    formdata.append("image_name", filename);
    formdata.append("image_type", filetype);
    formdata.append("created_date", createdDate);
    formdata.append("last_updated_date", createdDate);
    formdata.append("sync_version_uuid", "0");
    // formdata.append("updated_by_userid", userid);
    let myDate = new Date();
    let name_file = myDate.getDay()+"-"+myDate.getMonth()+"-"+myDate.getFullYear()+"-"+myDate.getUTCHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds()
    formdata.append("file_data", file, name_file);
    formdata.append("all_user",allusers);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    formdata.append("updated_by_userid", String(user_token.user_id));
    formdata.append("token", token);
    console.log(formdata.get("file_data"))
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/upload_annotation_stub",
      formdata
    );
  }
  loaderActivated = new EventEmitter<any>();
}
