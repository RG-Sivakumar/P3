import { Injectable, EventEmitter } from "@angular/core";
import { login } from "src/app/projectmanagement/models/login-model";
import { HttpClient } from "@angular/common/http";
import { renameFolder } from "../models/renameFolder.model";
import { Subject, Observable } from "rxjs";
import { Moreoption } from "../models/moreoption.model";
import { data } from "jquery";
import { withAnnotation } from "../models/coydocumentwithannot";
import { getDocumentPage } from "../models/getDocumentpage";
import { environment } from "src/environments/environment.prod";
import { retry } from "rxjs/operators";
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Injectable({
  providedIn: "root",
})
export class MoreoptionService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  su: login;

  constructor(private Http: HttpClient,private dataService:DataService,
    private encrptdecrpt:EncryptDecryptService) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  renameFolderName(folderName, folderId, parentFolderId, folderLevel, hiddenFlag) {
    if(hiddenFlag==0)
    {
      hiddenFlag=false;
    }
    if(hiddenFlag==1)
    {
      hiddenFlag=true;
    }
    var renameSendData = new renameFolder();
    let createdDate = new Date().toISOString();
    renameSendData.folder_id = folderId;
    renameSendData.folder_name = folderName;
    renameSendData.parent_folder_id = parentFolderId;
    renameSendData.folder_level = folderLevel;
    renameSendData.is_hidden = hiddenFlag;
    renameSendData.created_date = createdDate;
    renameSendData.last_updated_date = createdDate;
    renameSendData.sync_version_uuid = "0";
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    renameSendData.updated_by_userid = this.su.user_id.toString();
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/update_folder",
      {...renameSendData,token}
    );
  }

  addTagname(folderid, foldertagname) {
    var addTagSendData = new Moreoption();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    addTagSendData.user_id = this.su.user_id;
    addTagSendData.folder_id = folderid;
    addTagSendData.folder_tag_name = foldertagname.split(",");
    addTagSendData.created_date = createdDate;
    addTagSendData.last_updated_date = createdDate;
    addTagSendData.sync_version_uuid = "0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/add_folder_tag",
      {...addTagSendData,token}
    );
  }

  getFolderTag(folderId) {
    var getFolderTagListSendData = new Moreoption();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    // getFolderTagListSendData.user_id=this.su.user_id;
    // getFolderTagListSendData.folder_id=folderId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "folder/get_folder_tags", {
      user_id: this.su.user_id,
      folder_id: folderId,
      token
    });
  }

  removeClickTag(folderid, foldertagid) {
    var receiveRemovefoldertagData = new Moreoption();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    receiveRemovefoldertagData.user_id = this.su.user_id;
    receiveRemovefoldertagData.folder_id = folderid;
    receiveRemovefoldertagData.folder_tag_id = foldertagid;
    receiveRemovefoldertagData.created_date = createdDate;
    receiveRemovefoldertagData.last_updated_date = createdDate;
    receiveRemovefoldertagData.sync_version_uuid = "0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/remove_folder_tag",
      {...receiveRemovefoldertagData,token}
    );
  }

  getFolderMetricesDetails(folderId) {
    var receivegetFolderMerticesData = new Moreoption();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    receivegetFolderMerticesData.user_id = this.su.user_id;
    receivegetFolderMerticesData.folder_id = folderId;
    console.log(this.APIBaseUrl + "folder/get_basic_folder_info", receivegetFolderMerticesData);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";

    return this.Http.post<any>(this.APIBaseUrl + "folder/get_basic_folder_info", 
    {...receivegetFolderMerticesData,token}).pipe(retry(3));
  }

  getFolderbasic(folderId) {
    var getFolderbasicData = new Moreoption();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    getFolderbasicData.user_id = this.su.user_id;
    getFolderbasicData.folder_id = folderId;
    console.log(
      this.APIBaseUrl + "folder/get_basic_folder_info",
      getFolderbasicData
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/get_basic_folder_info",
      {...getFolderbasicData,token}
    );
  }

  hide(folderId, folderName, parentFolderId, folderLevel) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var hideSendData = new Moreoption();
    let createDate = new Date().toISOString();
    hideSendData.folder_id = folderId;
    hideSendData.created_date = createDate;
    hideSendData.last_updated_date = createDate;
    hideSendData.sync_version_uuid = "0";
    hideSendData.updated_by_userid = this.su.user_id.toString();
    console.log(this.APIBaseUrl + "folder/update_folder_web", hideSendData);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/update_folder_web",
      {...hideSendData,token}
    );
  }

  unHide(folderId, folderName, parentFolderId, folderLevel) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var unhideSendData = new Moreoption();
    let createDate = new Date().toISOString();
    unhideSendData.folder_id = folderId;
    unhideSendData.folder_name = folderName;
    unhideSendData.parent_folder_id = parentFolderId;
    unhideSendData.folder_level = folderLevel;
    unhideSendData.is_hidden = false;
    unhideSendData.created_date = createDate;
    unhideSendData.last_updated_date = createDate;
    unhideSendData.sync_version_uuid = "0";
    unhideSendData.updated_by_userid = this.su.user_id.toString();
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    console.log(this.APIBaseUrl + "folder/update_folder", unhideSendData);
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/update_folder",
      {...unhideSendData,token}
    );
  }

  copywithoutAnnot(
    projectId,
    parentFolderId,
    folderId,
    uuid,
    date,
    documentName,
    folderLevel,
    pageId
  ) {
    var withoutAnnotation = new Moreoption();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createDate = new Date().toISOString();
    withoutAnnotation.user_id = this.su.user_id;
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    withoutAnnotation.current_project_id = projectId;
    withoutAnnotation.parent_folder_id = parentFolderId;
    withoutAnnotation.old_folder_id = folderId;
    withoutAnnotation.new_folder_id = this.su.user_id + "-" + uuid + "-" + date;
    withoutAnnotation.new_document_name = documentName;
    withoutAnnotation.new_folder_level = folderLevel + 1;
    withoutAnnotation.document_id = this.su.user_id + "-" + uuid + "-" + date;
    withoutAnnotation.page_id = pageId;
    withoutAnnotation.created_date = createDate;
    withoutAnnotation.last_updated_date = createDate;
    withoutAnnotation.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "folder/copy_document_without_annotation", withoutAnnotation);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "folder/copy_document_without_annotation", 
    {...withoutAnnotation,token});
  }

  copywithAnnotProject(
    newfolderId,createdDate,updatedDate,sync_version_uuid,
    email,docName, projectId, parentFolderId,newLevel,userid,oldfolderId
  ) {
    var withoutAnnotation = new Moreoption();
    withoutAnnotation.user_id = userid;
    withoutAnnotation.old_folder_id = oldfolderId;
    withoutAnnotation.document_id = newfolderId;
    withoutAnnotation.dest_project_id = projectId;
    withoutAnnotation.new_document_name = docName;
    withoutAnnotation.parent_folder_id = parentFolderId;
    withoutAnnotation.new_folder_level = newLevel;
    withoutAnnotation.last_updated_date = updatedDate
    withoutAnnotation.user_email_id = email
    withoutAnnotation.created_date = createdDate
    withoutAnnotation.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "folder/copy_document_project", withoutAnnotation);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "folder/copy_document_project", 
    {...withoutAnnotation,token});
  }

  copywithAnnot(
    projectId,
    parentFolderId,
    folderId,
    uuid,
    date,
    documentName,
    folderLevel,
    pageid,
    projectName
  ) {
    let createDate = new Date().toISOString();
    var withAnnotation = new Moreoption();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    withAnnotation.user_id = this.su.user_id;
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    withAnnotation.current_project_id = projectId;
    withAnnotation.parent_folder_id = parentFolderId;
    withAnnotation.old_folder_id = folderId;
    withAnnotation.new_folder_id = this.su.user_id + "-" + uuid + "-" + date;
    withAnnotation.new_document_name = documentName;
    withAnnotation.new_folder_level = folderLevel + 1;
    withAnnotation.document_id = this.su.user_id + "-" + uuid + "-" + date;
    withAnnotation.created_date = createDate;
    withAnnotation.last_updated_date = createDate;
    withAnnotation.sync_version_uuid = "0";
    withAnnotation.page_id = pageid;
    withAnnotation.email_id = this.su.email_id;
    withAnnotation.project_name = projectName;
    console.log(withAnnotation);
    console.log(this.APIBaseUrl + "folder/copy_document_with_annotation", withAnnotation);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/copy_document_with_annotation",
      {...withAnnotation,token}
    );
  }

  copywithoutAnnotLinks(
    projectId,
    parentFolderId,
    folderId,
    uuid,
    documentName,
    folderLevel,
    pageId
  ) {
    var withoutAnnotation = new Moreoption();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    withoutAnnotation.user_id = this.su.user_id;
    withoutAnnotation.current_project_id = projectId;
    withoutAnnotation.parent_folder_id = parentFolderId;
    withoutAnnotation.old_folder_id = folderId;
    withoutAnnotation.new_folder_id = uuid;
    documentName = this.dataService.changeFormat(documentName);
    withoutAnnotation.new_document_name = documentName;
    withoutAnnotation.new_folder_level = folderLevel;
    withoutAnnotation.document_id = uuid;
    withoutAnnotation.page_id = pageId;
    withoutAnnotation.created_date = createdDate;
    withoutAnnotation.last_updated_date = createdDate;
    withoutAnnotation.sync_version_uuid = "0";
    console.log(withoutAnnotation);
    console.log(
      this.APIBaseUrl + "folder/copy_document_without_annotation",
      withoutAnnotation
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/copy_document_without_annotation",
      {...withoutAnnotation,token}
    );
  }

  copywithAnnotLinks(
    projectId,
    parentFolderId,
    folderId,
    uuid,
    documentName,
    folderLevel,
    pageid,
    projectName
  ) {
    var withAnnotation = new Moreoption();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    withAnnotation.user_id = this.su.user_id;
    withAnnotation.current_project_id = projectId;
    withAnnotation.parent_folder_id = parentFolderId;
    withAnnotation.old_folder_id = folderId;
    withAnnotation.new_folder_id = uuid;
    documentName = this.dataService.changeFormat(documentName);
    withAnnotation.new_document_name = documentName;
    withAnnotation.new_folder_level = folderLevel;
    withAnnotation.document_id = uuid;
    withAnnotation.created_date = createdDate;
    withAnnotation.last_updated_date = createdDate;
    withAnnotation.sync_version_uuid = "0";
    withAnnotation.page_id = pageid;
    withAnnotation.email_id = this.su.email_id;
    withAnnotation.project_name = projectName;
    console.log(withAnnotation);
    console.log(this.APIBaseUrl + "folder/copy_document_with_annotation", withAnnotation);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "folder/copy_document_with_annotation", 
    {...withAnnotation,token});
  }

  getDocumentCount(projectId, folderId) {
    var getDocPage = new Moreoption();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    // getDocPage.user_id=this.su.user_id;
    // getDocPage.project_id=projectId;
    // getDocPage.folder_id=folderId;
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "folder/get_document_pages", {
      user_id: this.su.user_id,
      project_id: projectId,
      folder_id: folderId,
      token,
    });
  }

  getDocumentPageId(projectId, folderId) {
    var getDocPage = new getDocumentPage();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    getDocPage.user_id = this.su.user_id;
    getDocPage.project_id = projectId;
    getDocPage.folder_id = folderId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/get_document_pages",
      {...getDocPage,token}
    );
  }

  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy);
  }

  loaderActivated = new EventEmitter<any>();
}
