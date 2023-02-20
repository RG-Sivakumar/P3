import { EventEmitter, Injectable, ɵConsole, Inject } from "@angular/core";
import { login } from "src/app/projectmanagement/models/login-model";
import { exportCSV, getDocumentDetails, pdfExport } from "../models/getDocumentDetails.model";
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { getAnnotationForm } from "../models/annotationForm.model";
import { createLayer } from "../models/createLayer.model";
import { catchError, retry } from "rxjs/operators";
import { projectFolder } from "src/app/projects/models/projectfolder.model";
import { environment } from "src/environments/environment.prod";
import { forms } from "src/app/formbuilder/Model/formslistmodel";
import { singleAnnotation } from "../models/singleannotation.model";
import { v1 as uuidv1 } from "uuid";
import { singlelayerannotation } from "../models/singlelayerannotation.model";
import { multipleannotation } from "../models/multipleAnnotation.model";
import { mediaStore } from "../models/downloadmedia.model";
import { DataService } from "src/app/data.service";
import { undoredomdl } from "../models/undoredo.model";
import { createDocumentVar } from "../createdocument/createdocumentvariables";
import * as _ from 'lodash';
import { documentdatas } from "../createdocument/datamanage";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { createGroup } from "src/app/models/creategroupmodel";
import { updateGroup } from "src/app/models/updategroupmodel";
import { getgroup } from "src/app/models/getgroupmodel";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class CreateDocumentService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  readonly APIExportUrl=environment.APIExportUrl;
  su: login;
  formData = new getDocumentDetails();
  createDocumentStore_values:createDocumentVar;  
  document_data_storage:documentdatas;

  constructor(private Http: HttpClient,private textCheckService:DataService,
    private encrptdecrpt:EncryptDecryptService,
    //new one
    @Inject(DOCUMENT) private document: Document) {

    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.createDocumentStore_values = new createDocumentVar();
    this.document_data_storage = new documentdatas();
  }
  disableRightClick() {
    this.document.addEventListener('contextmenu', (event) =>
      event.preventDefault()
    );
  }

  getreport(documents, projectId, value, processuuid) {
    var getDocumentDetailscsv = new getDocumentDetails();
    getDocumentDetailscsv.document_id = documents;
    getDocumentDetailscsv.p3_project_id = projectId;
    getDocumentDetailscsv.is_project = Boolean(value);
    getDocumentDetailscsv.process_id = processuuid;
    console.log(getDocumentDetailscsv);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    
    return this.Http.post<getDocumentDetails[]>(
      this.APIBaseUrl + "report/get_document_data",
      {...getDocumentDetailscsv,token,"updated_by_userid":String(user_token.user_id)}
    ).pipe(catchError(this.errorHandler));
  }

  getreportnew(emailid, projectId, documentid, pageid,type) {
    var getDocumentDetailscsvnew = new exportCSV();
    getDocumentDetailscsvnew.email_id = emailid;
    getDocumentDetailscsvnew.project_id = projectId;
    getDocumentDetailscsvnew.document_id = documentid;
    getDocumentDetailscsvnew.page_id = pageid;
    getDocumentDetailscsvnew.export_type = type;
    console.log(getDocumentDetailscsvnew);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";


    return this.Http.post<any[]>(
      this.APIExportUrl + "p3_export_files",
      {...getDocumentDetailscsvnew,token,"updated_by_userid":String(user_token.user_id)}
    ).pipe(catchError(this.errorHandler));
  }

  //pdf export new function implemented
  getpdfexport(emailid, projectId, documentid, pageid,type,is_link) {
    var getDocumentDetailscsvnew = new pdfExport();
    getDocumentDetailscsvnew.email_id = emailid;
    getDocumentDetailscsvnew.project_id = projectId;
    getDocumentDetailscsvnew.document_id = documentid;
    getDocumentDetailscsvnew.page_id = pageid;
    getDocumentDetailscsvnew.export_type = type;
    getDocumentDetailscsvnew.is_link = is_link;
    console.log(getDocumentDetailscsvnew);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";

    return this.Http.post<any[]>(
      this.APIExportUrl + "p3_export_files",
      {...getDocumentDetailscsvnew,token,"updated_by_userid":String(user_token.user_id)}
    ).pipe(catchError(this.errorHandler));
  }

  getreportnewwithlink(emailid, projectId, documentid, pageid,type,link) {
    var getDocumentDetailscsvnew = new exportCSV();
    getDocumentDetailscsvnew.email_id = emailid;
    getDocumentDetailscsvnew.project_id = projectId;
    getDocumentDetailscsvnew.document_id = documentid;
    getDocumentDetailscsvnew.page_id = pageid;
    getDocumentDetailscsvnew.export_type = type;
    getDocumentDetailscsvnew.is_link=link;
    console.log(getDocumentDetailscsvnew);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";


    return this.Http.post<any[]>(
      this.APIExportUrl + "p3_export_files",
      {...getDocumentDetailscsvnew,token,"updated_by_userid":String(user_token.user_id)}
    ).pipe(catchError(this.errorHandler));
  }

  getreport1(processuuid) {
    var getDocumentDetailscsv = new getDocumentDetails();
    getDocumentDetailscsv.process_id = processuuid;
    console.log(getDocumentDetailscsv);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";


    return this.Http.post<getDocumentDetails[]>(
      this.APIBaseUrl + "report/get_csv_url",
      {...getDocumentDetailscsv,token,"updated_by_userid":String(user_token.user_id)}
    ).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throwError(error.message || "server error.");
  }

  getphotos(documents, projectId, value, processuuid) {
    var getDocumentDetailscsv = new getDocumentDetails();
    getDocumentDetailscsv.document_id = documents;
    getDocumentDetailscsv.p3_project_id = projectId;
    getDocumentDetailscsv.is_project = Boolean(value);
    getDocumentDetailscsv.process_id = processuuid;
    console.log(
      this.APIBaseUrl + "report/get_media_report",
      getDocumentDetailscsv
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";


    return this.Http.post<getDocumentDetails[]>(
      this.APIBaseUrl + "report/get_media_report",
      {...getDocumentDetailscsv,token,"updated_by_userid":String(user_token.user_id)} 
    );
  }
  getphotosnew(emailid, projectId, documentid, pageid,type) {
    console.log(emailid);
    console.log(projectId);
    console.log(documentid);
    console.log(pageid);
    console.log(type);
    var getDocumentDetailsphotos = new exportCSV();
    getDocumentDetailsphotos.email_id = emailid;
    getDocumentDetailsphotos.project_id = projectId;
    getDocumentDetailsphotos.document_id = documentid;
    getDocumentDetailsphotos.page_id = pageid;
    getDocumentDetailsphotos.export_type = type;
    console.log(
      this.APIExportUrl + "p3_export_files",
      getDocumentDetailsphotos
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";


    return this.Http.post<any[]>(
      this.APIExportUrl + "p3_export_files",
      {...getDocumentDetailsphotos,token,"updated_by_userid":String(user_token.user_id)} 
    );
  }
  getmediastoragenew(emailid, projectId, documentid, pageid,type){
    var getDocumentDetailsmedia = new exportCSV();
    getDocumentDetailsmedia.email_id = emailid;
    getDocumentDetailsmedia.project_id = projectId;
    getDocumentDetailsmedia.document_id = documentid;
    getDocumentDetailsmedia.page_id = pageid;
    getDocumentDetailsmedia.export_type = type;
    console.log(getDocumentDetailsmedia);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";


    return this.Http.post<any[]>(this.APIExportUrl + "p3_export_files", {...getDocumentDetailsmedia,token,"updated_by_userid":String(user_token.user_id)});
  }

  getcsvreport(documents, projectId, value, processuuid) {
    var getDocumentDetailscsv = new getDocumentDetails();
    getDocumentDetailscsv.document_id = documents;
    getDocumentDetailscsv.p3_project_id = projectId;
    getDocumentDetailscsv.is_project = Boolean(value);
    getDocumentDetailscsv.process_id = processuuid;
    console.log(
      this.APIBaseUrl + "report/get_document_report",
      getDocumentDetailscsv
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";

    return this.Http.post<getDocumentDetails[]>(
      this.APIBaseUrl + "report/get_document_report",
      {...getDocumentDetailscsv,token,"updated_by_userid":String(user_token.user_id)} 
    );
  }
  getcsvreportnew(emailid, projectId, documentid, pageid,type) {
    var getDocumentDetailscsvreport = new exportCSV();
    getDocumentDetailscsvreport.email_id = emailid;
    getDocumentDetailscsvreport.project_id = projectId;
    getDocumentDetailscsvreport.document_id = documentid;
    getDocumentDetailscsvreport.page_id = pageid;
    getDocumentDetailscsvreport.export_type = type;
    console.log(
      this.APIExportUrl + "p3_export_files",
      getDocumentDetailscsvreport
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<any[]>(
      this.APIExportUrl + "p3_export_files",
      {...getDocumentDetailscsvreport,token,"updated_by_userid":String(user_token.user_id)}
    );
  }
  
  getDocumentDetails(projectId, folderId): Observable<getDocumentDetails[]> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var getDocumentDetailsData = new getDocumentDetails();
    getDocumentDetailsData.user_id = this.su.user_id;
    getDocumentDetailsData.project_id = projectId;
    getDocumentDetailsData.folder_id = folderId;
    console.log(
      this.APIBaseUrl + "folder/get_document_pages",
      getDocumentDetailsData
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";

    return this.Http.post<getDocumentDetails[]>(
      this.APIBaseUrl + "folder/get_document_pages",
      {...getDocumentDetailsData,token} 
    );
  }

  Rename(documentId, pageId, m) {
    var rename = new getDocumentDetails();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    rename.user_id = this.su.user_id;
    rename.document_id = documentId;
    rename.page_id = pageId;
    rename.rename_page = m;
    rename.last_updated_date = createdDate;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "folder/page_rename", {...rename,token} ).pipe(retry(3));
  }

  getAnnotationFormlist(projectId, folderId, currentPageId): Observable<getAnnotationForm[]> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var getAnnotationFormlistData = new getAnnotationForm();
    getAnnotationFormlistData.user_id = this.su.user_id;
    getAnnotationFormlistData.project_id = projectId;
    getAnnotationFormlistData.document_id = folderId;
    getAnnotationFormlistData.page_id = currentPageId;
    console.log(getAnnotationFormlistData);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<getAnnotationForm[]>(
      this.APIBaseUrl + "annotation/get_all_annotation_web",
      {...getAnnotationFormlistData,token}
    ).pipe(retry(3));
  }

  getAnnotationFormlist_search(projectId, folderId, currentPageId):Observable<HttpEvent<any>> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var getAnnotationFormlistData = new getAnnotationForm();
    getAnnotationFormlistData.user_id = this.su.user_id;
    getAnnotationFormlistData.project_id = projectId;
    getAnnotationFormlistData.document_id = folderId;
    getAnnotationFormlistData.page_id = currentPageId;
    console.log(getAnnotationFormlistData);
    let headers_1 = new HttpHeaders();
    headers_1.set('Content-Type', null);
    // headers_1.set('Accept', null);
    headers_1.set('Accept', "multipart/form-data");
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post(this.encrptdecrpt.getItem("APIBaseUrl") + "annotation/get_all_annotation_web",{...getAnnotationFormlistData,token},{headers:headers_1, reportProgress:true,observe:'events'})
  }

  getSingleAnnotation(anot_inputs): Observable<singleAnnotation[]> {
    // let createdDate = new Date().toISOString();
    // var getSingleAnnotate = new singleAnnotation();
    // getSingleAnnotate.user_id = this.su.user_id;
    // getSingleAnnotate.annotation_id = anot_inputs.annot_id;
    // getSingleAnnotate.created_date = createdDate;
    // getSingleAnnotate.last_updated_date = createdDate;
    // getSingleAnnotate.sync_version_uuid = "0";
    // getSingleAnnotate.updated_by_userid = this.su.user_id.toString();
    // getSingleAnnotate.layer_id = anot_inputs.layer_id;
    // getSingleAnnotate.page_id = anot_inputs.page_id;
    // console.log(getSingleAnnotate);
    // return this.Http.post<singleAnnotation[]>(this.APIBaseUrl + "annotation/get_single_annotation_data",
    //   getSingleAnnotate).pipe(retry(3));
    var getSingleAnnotate = new Object();
    getSingleAnnotate["annotation_id"] = anot_inputs.annot_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<singleAnnotation[]>(this.encrptdecrpt.getItem("APIBaseUrl") + "annotation/get_single_annotation_web",
    {...getSingleAnnotate,token,"updated_by_userid":String(user_token.user_id)} 
    ).pipe(retry(3));
  }
  getform(project_id, folder_id) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var getDocumentDetailsData = new getDocumentDetails();
    getDocumentDetailsData.user_id = this.su.user_id;
    getDocumentDetailsData.project_id = project_id;
    getDocumentDetailsData.folder_id = folder_id;
    console.log(
      this.APIBaseUrl + "annotation/get_form",
      getDocumentDetailsData
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<getDocumentDetails[]>(
      this.APIBaseUrl + "annotation/get_form",
      {...getDocumentDetailsData,token}
    );
  }

  getAnnotationsCount(project_id, folder_id) {
    var getDocumentDetailsData = new getDocumentDetails();
    // getDocumentDetailsData.user_id = this.su.user_id;
    // getDocumentDetailsData.project_id = project_id;
    getDocumentDetailsData.document_id = folder_id;
    console.log(
      this.APIBaseUrl + "annotation/get_page_annotation_count",
      getDocumentDetailsData
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<getDocumentDetails[]>(
      this.APIBaseUrl + "annotation/get_page_annotation_count",
      {...getDocumentDetailsData,token,"updated_by_userid":String(user_token.user_id)}
    );
  }

  getLayerDetails(layerId, annotationId) {
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any[]>(
      this.APIBaseUrl + "annotation/get_layer_data", 
      {layer_id: layerId, annotation_id: annotationId, token,"updated_by_userid":String(user_token.user_id)}).pipe(retry(3));
  }

  createLayer(
    layerName,
    layerType,
    uuidDate,
    date,
    uuid,
    projectId,
    folderId,
    selectedPages
  ) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var createNewLayer = new createLayer();
    createNewLayer.created_by_user_id = this.su.user_id;
    createNewLayer.layer_id = this.su.user_id + "-" + uuid + "-" + uuidDate;
    createNewLayer.project_id = projectId;
    createNewLayer.layer_type = layerType;
    createNewLayer.is_visible_flag = true;
    createNewLayer.is_active_flag = false;
    createNewLayer.document_id = folderId;
    createNewLayer.is_default_flag = true;
    createNewLayer.created_date = date;
    createNewLayer.last_updated_date = date;
    createNewLayer.is_removed = false;
    createNewLayer.annotations = [];
    createNewLayer.is_locked_flag = false;
    createNewLayer.layer_name = layerName;

    var associated_pages = [];
    for (var i = 0; i < selectedPages.length; i++) {
      let pageValue = {
        page_id: selectedPages[i],
        layer_id: createNewLayer.layer_id,
        created_date: date,
        last_updated_date: date,
        version_number: 1,
        is_removed: false,
        is_lock: false,
        is_hidden: false,
        document_id: folderId,
        created_by_user_id: this.su.user_id
      };
      associated_pages.push(pageValue);
    }
    createNewLayer.associated_pages = associated_pages;
    console.log("createNewLayer", JSON.stringify(createNewLayer));
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      layers: [createNewLayer]
    };
    console.log(parem);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<createLayer[]>(
      this.APIBaseUrl + "annotation/create_form",
      {...parem,token,"updated_by_userid":String(user_token.user_id)} 
    ).pipe(retry(3));
  }

  defaultcreateLayer(
    layerName,
    layerType,
    uuidDate,
    date,
    uuid,
    projectId,
    folderId,
    selectedPages
  ) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var createNewLayer = new createLayer();
    createNewLayer.created_by_user_id = this.su.user_id;
    createNewLayer.layer_id = this.su.user_id + "-" + uuid + "-" + uuidDate;
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    createNewLayer.project_id = projectId;
    createNewLayer.layer_type = layerType;
    createNewLayer.is_visible_flag = true;
    createNewLayer.is_active_flag = true;
    createNewLayer.document_id = folderId;
    createNewLayer.is_default_flag = true;
    createNewLayer.created_date = date;
    createNewLayer.last_updated_date = date;
    createNewLayer.is_removed = false;
    createNewLayer.annotations = [];
    createNewLayer.is_locked_flag = false;
    createNewLayer.layer_name = layerName;

    var associated_pages = [];
    for (var i = 0; i < selectedPages.length; i++) {
      let pageValue = {
        page_id: selectedPages[i],
        layer_id: createNewLayer.layer_id,
        created_date: date,
        last_updated_date: date,
        version_number: 1,
        is_removed: false,
        is_lock: false,
        is_hidden: false,
        document_id: folderId,
        created_by_user_id: this.su.user_id
      };
      associated_pages.push(pageValue);
    }
    createNewLayer.associated_pages = associated_pages;
    console.log("createNewLayer", createNewLayer);
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: [createNewLayer]
    };
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<createLayer[]>(
      this.APIBaseUrl + "annotation/create_form",
      {...parem,token}
    ).pipe(retry(3));
  }

  defaultcreateLayerLinkedPage(
    uuidDate,
    date,
    uuid,
    projectId,
    folderId,
    selectedPages
  ) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var createNewLayer = new createLayer();
    createNewLayer.created_by_user_id = this.su.user_id;
    createNewLayer.layer_id = this.su.user_id + "-" + uuid + "-" + uuidDate;
    if (projectId == null) {
      projectId = this.encrptdecrpt.getItem("projectIdlocal");
    }
    createNewLayer.project_id = projectId;
    createNewLayer.layer_type = "blank";
    createNewLayer.is_visible_flag = true;
    createNewLayer.is_active_flag = true;
    createNewLayer.document_id = folderId;
    createNewLayer.is_default_flag = true;
    createNewLayer.created_date = date;
    createNewLayer.last_updated_date = date;
    createNewLayer.is_removed = false;
    createNewLayer.annotations = [];
    createNewLayer.is_locked_flag = false;
    createNewLayer.layer_name = "Default";

    var associated_pages = [];
    for (var i = 0; i < selectedPages.length; i++) {
      let pageValue = {
        page_id: selectedPages[i],
        layer_id: createNewLayer.layer_id,
        created_date: date,
        last_updated_date: date,
        version_number: 1,
        is_removed: false,
        is_lock: false,
        is_hidden: false,
        document_id: folderId,
        created_by_user_id: this.su.user_id
      };
      associated_pages.push(pageValue);
    }
    createNewLayer.associated_pages = associated_pages;
    console.log("createNewLayer", createNewLayer);

    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: [createNewLayer]
    };
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<createLayer[]>(
      this.APIBaseUrl + "annotation/create_form",
      {...parem,token}
    ).pipe(retry(3));
  }
  setActiveLayerUpdate(getData) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: getData
    };
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/update_form",
      {...parem,token,"updated_by_userid":String(user_token.user_id)}
    );
  }

  renameLayerUpdate(getData) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: getData
    };
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/update_form",
      {...parem,token,"updated_by_userid":String(user_token.user_id)}
    );
  }

  movelayerUpdateForm(getData, deleteAnnotation, pushAnnotaion) {
    // undo sync uuid generate and stored area
    // let generate_sync_uuid = this.generateSyncUUID();
    // this.createDocumentStore_values.undovaluesstore.push(generate_sync_uuid);
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.createDocumentStore_values.redovaluesstore = [];
    console.log(getData, deleteAnnotation, pushAnnotaion);
    let newgenerateData = this.filterLayers(getData, deleteAnnotation, pushAnnotaion);

    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: newgenerateData
    };
    console.log(this.APIBaseUrl + "annotation/update_form", parem);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "annotation/update_form",
    {...parem,token,"updated_by_userid":String(user_token.user_id)}
    );
  }

  filterLayers(receivedata, deleteAnnotation, pushAnnotaion) {
    let filterFirstLayers = receivedata.filter((fone) => fone.layer_id === deleteAnnotation.layer_id);
    let filterFirstAnnotation = filterFirstLayers[0].annotations.filter((foneAnnotation) => foneAnnotation.annotation_id === deleteAnnotation.annotation_id);
    filterFirstLayers[0].annotations = filterFirstAnnotation;
    let filterSecondLayers = receivedata.filter((sone) => sone.layer_id === pushAnnotaion.layer_id);
    let filterSecondAnnotation = filterSecondLayers[0].annotations.filter((foneAnnotation) => foneAnnotation.annotation_id === pushAnnotaion.annotation_id);
    filterSecondLayers[0].annotations = filterSecondAnnotation;
    let mergeTwoLayers = [...filterFirstLayers, ...filterSecondLayers];
    //special character changing format
    for(let mi=0;mi<mergeTwoLayers.length;mi++){
      mergeTwoLayers[mi].layer_name = this.textCheckService.changeFormat(mergeTwoLayers[mi].layer_name);
      if(mergeTwoLayers[mi].annotations.length>0){
        for(let ai=0;ai<mergeTwoLayers[mi].annotations.length;ai++){
          mergeTwoLayers[mi].annotations[ai].annotation_name = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_name);
          mergeTwoLayers[mi].annotations[ai].annotation_label = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_label);
          mergeTwoLayers[mi].annotations[ai].annotation_tags = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_tags);
          mergeTwoLayers[mi].annotations[ai].annotation_data = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_data);
          if(mergeTwoLayers[mi].annotations[ai].annotation_forms.length>0){
            for(let fi=0;fi<mergeTwoLayers[mi].annotations[ai].annotation_forms.length;fi++){
              mergeTwoLayers[mi].annotations[ai].annotation_forms[fi].form_name = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_forms[fi].form_name);
              let get_cur_formdata = mergeTwoLayers[mi].annotations[ai].annotation_forms[fi].form_data;
              if(Array.isArray(get_cur_formdata)){
                if(get_cur_formdata.length>0){
                  mergeTwoLayers[mi].annotations[ai].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata,'annotationupdateformpublish');
                }
              }
            }
          }
          if (mergeTwoLayers[mi].annotations[ai].annotation_links.length > 0) {
            if (Array.isArray(mergeTwoLayers[mi].annotations[ai].annotation_links)) {
              for(let li=0;li<mergeTwoLayers[mi].annotations[ai].annotation_links.length;li++){
                if(mergeTwoLayers[mi].annotations[ai].annotation_links[li].document_id==''){
                  mergeTwoLayers[mi].annotations[ai].annotation_links[li].link_type = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_links[li].link_type);
                }
                else if(mergeTwoLayers[mi].annotations[ai].annotation_links[li].document_id!=''){
                  mergeTwoLayers[mi].annotations[ai].annotation_links[li].link_type = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_links[li].link_type);
                }
                if(mergeTwoLayers[mi].annotations[ai].annotation_links[li].hasOwnProperty('location')){
                  if(mergeTwoLayers[mi].annotations[ai].annotation_links[li].location!=undefined){
                    mergeTwoLayers[mi].annotations[ai].annotation_links[li].location = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_links[li].location);
                  }
                }
              }
            }
          }
          if (mergeTwoLayers[mi].annotations[ai].annotation_media.length > 0) {
            if (Array.isArray(mergeTwoLayers[mi].annotations[ai].annotation_media)) {
              for(let li=0;li<mergeTwoLayers[mi].annotations[ai].annotation_media.length;li++){
                if(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_name!=''){
                  mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_name = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_name);
                }
                if(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_comment!=''){
                  mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_comment = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_comment);
                }
                if(mergeTwoLayers[mi].annotations[ai].annotation_media[li].hasOwnProperty("media_tags")){
                  if(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_tags!=''){
                    mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_tags = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_tags);
                  }
                }
              }
            }
          }
              //original_property
        if((typeof mergeTwoLayers[mi].annotations[ai].original_property) == 'object'){
          if(mergeTwoLayers[mi].annotations[ai].original_property.hasOwnProperty('annotation_data')){
            mergeTwoLayers[mi].annotations[ai].original_property.annotation_data = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].original_property.annotation_data);
          }
        }
        }
      }
    }
    return mergeTwoLayers;
  }

  movelayerMultipleUpdateForm(getData, deleteAnnotation, pushAnnotaion) {
    
    // undo sync uuid generate and stored area
    // let generate_sync_uuid = this.generateSyncUUID();
    // this.createDocumentStore_values.undovaluesstore.push(generate_sync_uuid);
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.createDocumentStore_values.redovaluesstore = [];
    let newgenerateData = this.filterMultipleLayers(getData, deleteAnnotation, pushAnnotaion);
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: newgenerateData
    };
    console.log(this.APIBaseUrl + "annotation/update_form", parem);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "annotation/update_form",
    {...parem,token,"updated_by_userid":String(user_token.user_id)}
    );
  }

  filterMultipleLayers(receivedata, deleteAnnotation, pushAnnotaion) {
    let cloneLayerData = receivedata;
    let currentLayers = [];
    let existLayer = [];
    for (let a = 0; a < cloneLayerData.length; a++) {
      cloneLayerData[a].annotations = [];
    }
    for (let km = 0; km < deleteAnnotation.length; km++) {
      let findLyaerIndex = cloneLayerData.findIndex((Ldata) => Ldata.layer_id == deleteAnnotation[km].layer_id);
      if (findLyaerIndex > -1) {
        let pushItem = cloneLayerData[findLyaerIndex];
        if (existLayer.some((data1) => data1 == deleteAnnotation[km].layer_id)) {
          let existLayerFindIndex = currentLayers.findIndex((Edata) => Edata.layer_id === pushItem.layer_id);
          if (existLayerFindIndex != -1) {
            currentLayers[existLayerFindIndex].annotations.push(deleteAnnotation[km]);
          }
        }
        else {
          existLayer.push(cloneLayerData[findLyaerIndex].layer_id);
          cloneLayerData[findLyaerIndex].annotations.push(deleteAnnotation[km]);
          currentLayers.push(cloneLayerData[findLyaerIndex]);
        }
      }
    }
    let findPushAnnotationLayer = [];
    if (pushAnnotaion.length > 0) {
      findPushAnnotationLayer = cloneLayerData.filter((dataLayer) => dataLayer.layer_id == pushAnnotaion[0].layer_id);
      if (findPushAnnotationLayer.length > 0) {
        findPushAnnotationLayer[0].annotations = pushAnnotaion;
      }
    }
    let mergeTwoLayers = [...currentLayers, ...findPushAnnotationLayer];
    
    //special character changing format
    for(let mi=0;mi<mergeTwoLayers.length;mi++){
      mergeTwoLayers[mi].layer_name = this.textCheckService.changeFormat(mergeTwoLayers[mi].layer_name);
      if(mergeTwoLayers[mi].annotations.length>0){
        for(let ai=0;ai<mergeTwoLayers[mi].annotations.length;ai++){
          mergeTwoLayers[mi].annotations[ai].annotation_name = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_name);
          mergeTwoLayers[mi].annotations[ai].annotation_label = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_label);
          mergeTwoLayers[mi].annotations[ai].annotation_tags = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_tags);
          mergeTwoLayers[mi].annotations[ai].annotation_data = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_data);
          if(mergeTwoLayers[mi].annotations[ai].annotation_forms.length>0){
            for(let fi=0;fi<mergeTwoLayers[mi].annotations[ai].annotation_forms.length;fi++){
              mergeTwoLayers[mi].annotations[ai].annotation_forms[fi].form_name = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_forms[fi].form_name);
              let get_cur_formdata = mergeTwoLayers[mi].annotations[ai].annotation_forms[fi].form_data;
              if(Array.isArray(get_cur_formdata)){
                if(get_cur_formdata.length>0){
                  mergeTwoLayers[mi].annotations[ai].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata,'annotationupdateformpublish');
                }
              }
              else{
                get_cur_formdata = JSON.parse(get_cur_formdata);
                if(get_cur_formdata!=null && get_cur_formdata.length>0){
                  mergeTwoLayers[mi].annotations[ai].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata,'annotationupdateformpublish');
                }
              }
            }
          }
          if (mergeTwoLayers[mi].annotations[ai].annotation_links.length > 0) {
            if (Array.isArray(mergeTwoLayers[mi].annotations[ai].annotation_links)) {
              for(let li=0;li<mergeTwoLayers[mi].annotations[ai].annotation_links.length;li++){
                if(mergeTwoLayers[mi].annotations[ai].annotation_links[li].document_id==''){
                  mergeTwoLayers[mi].annotations[ai].annotation_links[li].link_type = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_links[li].link_type);
                }
                else if(mergeTwoLayers[mi].annotations[ai].annotation_links[li].document_id!=''){
                  mergeTwoLayers[mi].annotations[ai].annotation_links[li].link_type = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_links[li].link_type);
                }
                if(mergeTwoLayers[mi].annotations[ai].annotation_links[li].hasOwnProperty('location')){
                  if(mergeTwoLayers[mi].annotations[ai].annotation_links[li].location!=undefined){
                    mergeTwoLayers[mi].annotations[ai].annotation_links[li].location = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_links[li].location);
                  }
                }
              }
            }
          }
          if (mergeTwoLayers[mi].annotations[ai].annotation_media.length > 0) {
            if (Array.isArray(mergeTwoLayers[mi].annotations[ai].annotation_media)) {
              for(let li=0;li<mergeTwoLayers[mi].annotations[ai].annotation_media.length;li++){
                if(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_name!=''){
                  mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_name = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_name);
                }
                if(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_comment!=''){
                  mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_comment = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_comment);
                }
                if(mergeTwoLayers[mi].annotations[ai].annotation_media[li].hasOwnProperty("media_tags")){
                  if(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_tags!=''){
                    mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_tags = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].annotation_media[li].media_tags);
                  }
                }
              }
            }
          }
              //original_property
        if((typeof mergeTwoLayers[mi].annotations[ai].original_property) == 'object'){
          if(mergeTwoLayers[mi].annotations[ai].original_property.hasOwnProperty('annotation_data')){
            mergeTwoLayers[mi].annotations[ai].original_property.annotation_data = this.textCheckService.changeFormat(mergeTwoLayers[mi].annotations[ai].original_property.annotation_data);
          }
        }
        }
      }
    }

    return mergeTwoLayers;
  }

  layerUpdateForm1(layers, layerId,type:string) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    let getData = this.processlayerData(layers, layerId);
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: getData,
      update_type:type
    };
    console.log('before api calling', _.cloneDeep(parem));
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "annotation/update_annotation_property_web",
    {...parem,token,"updated_by_userid":String(user_token.user_id)}
    );
  }

  layerUpdateFormDelete(layers, layerId,type?:string) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    let getData = this.processlayerDataDelete(layers, layerId);
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: getData,
      update_type:type
    };
    // console.log(this.encrptdecrpt.getItem("APIBaseUrl") + "annotation/update_layer_web", parem);
    // return this.Http.post<any>(this.APIBaseUrl + "annotation/update_layer_web",
    //   parem
    // );
    console.log(this.encrptdecrpt.getItem("APIBaseUrl") + "annotation/update_annotation_property_web", parem);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "annotation/update_annotation_property_web",
    {...parem,token,"updated_by_userid":String(user_token.user_id)}
    );
  }

  deleteandMoveUpdate(layers, deleteLayerId, movelayerId, getSingleLayerAnnotations,type:string) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    let getData = this.processdeleteandMove(layers, deleteLayerId, movelayerId, getSingleLayerAnnotations);
    console.log(getData);
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: getData,
      update_type:type
    };
    // console.log(this.APIBaseUrl + "annotation/update_form", parem);
    // return this.Http.post<any>(this.APIBaseUrl + "annotation/update_form",
    //   parem
    // );
    console.log(this.APIBaseUrl + "annotation/update_annotation_property_web", parem);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "annotation/update_annotation_property_web",
    {...parem,token,"updated_by_userid":String(user_token.user_id)}
    );
  }

  processdeleteandMove(layers, deleteLayerId, movelayerId, getSingleLayerAnnotations) {
    let cloneLayerData = layers;
    let getCurrentLayer = cloneLayerData.filter((data) => data.layer_id == deleteLayerId);
    let getdeletemoveLayer = cloneLayerData.filter((data) => data.layer_id == movelayerId);
    getdeletemoveLayer[0].annotations = getSingleLayerAnnotations;
    let mergeTwoLayers = [...getCurrentLayer, ...getdeletemoveLayer];
    //converting special characters to key format
    for (let j = 0; j < mergeTwoLayers.length; j++) {
        mergeTwoLayers[j].layer_name = this.textCheckService.changeFormat(mergeTwoLayers[j].layer_name);
        let get_layer_annotations = mergeTwoLayers[j].annotations;
        for(let annot_In=0;annot_In<get_layer_annotations.length;annot_In++){
          get_layer_annotations[annot_In].annotation_name = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_name);
          get_layer_annotations[annot_In].annotation_label = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_label);
          get_layer_annotations[annot_In].annotation_tags = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_tags);
          get_layer_annotations[annot_In].annotation_data = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_data);
          if(get_layer_annotations[annot_In].annotation_forms.length>0){
            for(let fi=0;fi<get_layer_annotations[annot_In].annotation_forms.length;fi++){
              get_layer_annotations[annot_In].annotation_forms[fi].form_name = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_forms[fi].form_name);
              let get_cur_formdata = get_layer_annotations[annot_In].annotation_forms[fi].form_data;
              if(Array.isArray(get_cur_formdata)){
                if(get_cur_formdata.length>0){
                  get_layer_annotations[annot_In].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata,'annotationupdateformpublish');
                }
              }
              if(get_layer_annotations[annot_In].annotation_forms[fi].hasOwnProperty('ext_form_data')){
                if(get_layer_annotations[annot_In].annotation_forms[fi].ext_form_data != "")
                {
                  if(get_layer_annotations[annot_In].annotation_forms[fi].ext_form_data != null){
                    let get_cur_ext_formdata = get_layer_annotations[annot_In].annotation_forms[fi].ext_form_data;
                    if (Array.isArray(get_cur_ext_formdata)) {
                      if (get_cur_ext_formdata.length > 0) {
                        get_layer_annotations[annot_In].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(get_cur_ext_formdata, 'annotationgetformview');
                      }
                    }else{
                      get_cur_ext_formdata = JSON.parse(get_cur_ext_formdata);
                      if (get_cur_ext_formdata.length > 0) {
                        get_layer_annotations[annot_In].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(get_cur_ext_formdata, 'annotationgetformview');
                      }
                    }
                  }
                }
              }
            }
          }
          if (get_layer_annotations[annot_In].annotation_links.length > 0) {
            if (Array.isArray(get_layer_annotations[annot_In].annotation_links)) {
              for(let li=0;li<get_layer_annotations[annot_In].annotation_links.length;li++){
                if(get_layer_annotations[annot_In].annotation_links[li].document_id==''){
                  get_layer_annotations[annot_In].annotation_links[li].link_type = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_links[li].link_type);
                }
                else if(get_layer_annotations[annot_In].annotation_links[li].document_id!=''){
                  get_layer_annotations[annot_In].annotation_links[li].link_type = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_links[li].link_type);
                }
                if(get_layer_annotations[annot_In].annotation_links[li].hasOwnProperty('location')){
                  console.log(get_layer_annotations[annot_In].annotation_links[li].location);
                  if(get_layer_annotations[annot_In].annotation_links[li].location!=undefined){
                    get_layer_annotations[annot_In].annotation_links[li].location = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_links[li].location);
                  }
                }
              }
            }
          }
          if (get_layer_annotations[annot_In].annotation_media.length > 0) {
            if (Array.isArray(get_layer_annotations[annot_In].annotation_media)) {
              for(let li=0;li<get_layer_annotations[annot_In].annotation_media.length;li++){
                if(get_layer_annotations[annot_In].annotation_media[li].media_name!=''){
                  get_layer_annotations[annot_In].annotation_media[li].media_name = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_media[li].media_name);
                }
                if(get_layer_annotations[annot_In].annotation_media[li].media_comment!=''){
                  get_layer_annotations[annot_In].annotation_media[li].media_comment = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_media[li].media_comment);
                }
                if(get_layer_annotations[annot_In].annotation_media[li].hasOwnProperty("media_tags")){
                  if(get_layer_annotations[annot_In].annotation_media[li].media_tags!=''){
                    get_layer_annotations[annot_In].annotation_media[li].media_tags = this.textCheckService.changeFormat(get_layer_annotations[annot_In].annotation_media[li].media_tags);
                  }
                }
              }
            }
          }
              //original_property
        if((typeof get_layer_annotations[annot_In].original_property) == 'object'){
          if(get_layer_annotations[annot_In].original_property.hasOwnProperty('annotation_data')){
            get_layer_annotations[annot_In].original_property.annotation_data = this.textCheckService.changeFormat(get_layer_annotations[annot_In].original_property.annotation_data);
          }
        }
        }
        mergeTwoLayers[j].annotations = get_layer_annotations;
    }
    return mergeTwoLayers;
  }

  activeLayerUpdateForm(layers, activeLayerId, pageId) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    for(let li=0;li<layers.length;li++){
      layers[li].layer_name = this.textCheckService.changeFormat(layers[li].layer_name);
      layers[li].annotations = [];
    }
    let createdDate = new Date().toISOString();
    // let getData = this.processactivelayerData(layers,activeLayerId,oldActiveLayerId);
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      document_id: layers.document_id,
      user_id: this.su.user_id,
      active_layer_id: [{ "page_id": pageId!, "layer_id": activeLayerId }],
      page_data: []
    };

    // let param = ["document_id": doc_id,
    //                      "user_id":user_id!,
    //                      "created_date":create_date,
    //                      "last_updated_date":P3Utils().getCurrentDateString(),
    //                      "updated_by_userid":String(user_id),
    //                      "active_layer_id":[["page_id":currentPage!,"layer_id":layer_id]],
    //                      "page_data":[] ] as [String:Any]
    console.log(JSON.stringify(parem));
    console.log(this.APIBaseUrl + "annotation/update_base_icon", parem);
    // return this.Http.post<any>(this.APIBaseUrl + "annotation/update_form",
    //   parem
    // );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "annotation/update_base_icon",
    {...parem,token}
    );
  }


  // processlayerData annotation we dont need to send api so two different function writing
  processlayerData(layers, layerId) {
    let cloneLayerData = layers;
    let getCurrentLayer = cloneLayerData.filter((data) => data.layer_id == layerId);
    getCurrentLayer[0].layer_name = this.textCheckService.changeFormat(getCurrentLayer[0].layer_name);
    getCurrentLayer[0].annotations = [];
    return getCurrentLayer;
  }

  // processlayerData annotation we  need to send api so two different function writing
  processlayerDataDelete(layers, layerId) {
    let cloneLayerData = layers;
    let getCurrentLayer = cloneLayerData.filter((data) => data.layer_id == layerId);
    if(getCurrentLayer.length>0){
      getCurrentLayer[0].layer_name = this.textCheckService.changeFormat(getCurrentLayer[0].layer_name);
      let get_annotations = getCurrentLayer[0].annotations;
      for(let annot_In=0;annot_In<get_annotations.length;annot_In++){
        get_annotations[annot_In].annotation_name = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_name);
        get_annotations[annot_In].annotation_label = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_label);
        get_annotations[annot_In].annotation_tags = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_tags);
        get_annotations[annot_In].annotation_data = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_data);
          if(get_annotations[annot_In].annotation_forms.length>0){
            for(let fi=0;fi<get_annotations[annot_In].annotation_forms.length;fi++){
              get_annotations[annot_In].annotation_forms[fi].form_name = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_forms[fi].form_name);
              let get_cur_formdata = get_annotations[annot_In].annotation_forms[fi].form_data;
              if(Array.isArray(get_cur_formdata)){
                if(get_cur_formdata.length>0){
                  get_annotations[annot_In].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata,'annotationupdateformpublish');
                }
              }
              if(get_annotations[annot_In].annotation_forms[fi].hasOwnProperty('ext_form_data')){
                if(get_annotations[annot_In].annotation_forms[fi].ext_form_data != "")
                {
                  if(get_annotations[annot_In].annotation_forms[fi].ext_form_data != null){
                    let get_cur_ext_formdata = get_annotations[annot_In].annotation_forms[fi].ext_form_data;
                    if (Array.isArray(get_cur_ext_formdata)) {
                      if (get_cur_ext_formdata.length > 0) {
                        get_annotations[annot_In].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(get_cur_ext_formdata, 'annotationgetformview');
                      }
                    }else{
                      get_cur_ext_formdata = JSON.parse(get_cur_ext_formdata);
                      if (get_cur_ext_formdata.length > 0) {
                        get_annotations[annot_In].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(get_cur_ext_formdata, 'annotationgetformview');
                      }
                    }
                  }
                }
              }
            }
          }
          if (get_annotations[annot_In].annotation_links.length > 0) {
            if (Array.isArray(get_annotations[annot_In].annotation_links)) {
              for(let li=0;li<get_annotations[annot_In].annotation_links.length;li++){
                if(get_annotations[annot_In].annotation_links[li].document_id==''){
                  get_annotations[annot_In].annotation_links[li].link_type = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_links[li].link_type);
                }
                else if(get_annotations[annot_In].annotation_links[li].document_id!=''){
                  get_annotations[annot_In].annotation_links[li].link_type = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_links[li].link_type);
                }
                if(get_annotations[annot_In].annotation_links[li].hasOwnProperty('location')){
                  console.log(get_annotations[annot_In].annotation_links[li].location);
                  if(get_annotations[annot_In].annotation_links[li].location!=undefined){
                    get_annotations[annot_In].annotation_links[li].location = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_links[li].location);
                  }
                }
              }
            }
          }
          if (get_annotations[annot_In].annotation_media.length > 0) {
            if (Array.isArray(get_annotations[annot_In].annotation_media)) {
              for(let li=0;li<get_annotations[annot_In].annotation_media.length;li++){
                if(get_annotations[annot_In].annotation_media[li].media_name!=''){
                  get_annotations[annot_In].annotation_media[li].media_name = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_media[li].media_name);
                }
                if(get_annotations[annot_In].annotation_media[li].media_comment!=''){
                  get_annotations[annot_In].annotation_media[li].media_comment = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_media[li].media_comment);
                }
                if(get_annotations[annot_In].annotation_media[li].hasOwnProperty("media_tags")){
                  if(get_annotations[annot_In].annotation_media[li].media_tags!=''){
                    get_annotations[annot_In].annotation_media[li].media_tags = this.textCheckService.changeFormat(get_annotations[annot_In].annotation_media[li].media_tags);
                  }
                }
              }
            }
          }
             //original_property
        if((typeof get_annotations[annot_In].original_property) == 'object'){
          if(get_annotations[annot_In].original_property.hasOwnProperty('annotation_data')){
            get_annotations[annot_In].original_property.annotation_data = this.textCheckService.changeFormat(get_annotations[annot_In].original_property.annotation_data);
          }
        }
      }
      // converting annotation values again initialize the layer annotations package
      getCurrentLayer[0].annotations = get_annotations;
    }
    return getCurrentLayer;
  }

  processactivelayerData(layers, layerId, oldActivelayerId) {
    console.log('layer ids active', layerId, oldActivelayerId);
    let cloneLayerData = layers;
    if (oldActivelayerId != undefined) {
      let getCurrentActiveLayer = cloneLayerData.filter((data) => data.layer_id == layerId);
      let getoldActiveLayer = cloneLayerData.filter((data) => data.layer_id == oldActivelayerId);
      getCurrentActiveLayer[0].annotations = [];
      getoldActiveLayer[0].annotations = [];
      let mergeTwoLayers = [...getCurrentActiveLayer, ...getoldActiveLayer];
      return mergeTwoLayers;
    }
    else {
      let getCurrentActiveLayer = cloneLayerData.filter((data) => data.layer_id == layerId);
      getCurrentActiveLayer[0].annotations = [];
      let mergeTwoLayers = [...getCurrentActiveLayer];
      return mergeTwoLayers;
    }
  }

  getOldLayerAnnotation(layerId): Observable<singlelayerannotation> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let getSingleLayerModel = new singlelayerannotation();
    getSingleLayerModel.layer_id = layerId;
    getSingleLayerModel.user_id = this.su.user_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<singlelayerannotation>(this.APIBaseUrl + 'annotation/get_single_layer_data', 
    {...getSingleLayerModel,token});
  }

  annotationUpdateAUC(getData) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: getData
    };
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/update_form",
      {...parem,token,"updated_by_userid":String(user_token.user_id)}
    );
  }


  //formBased Update
  UpdateForm(getData) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: getData
    };
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "annotation/update_form",
      {...parem,token,"updated_by_userid":String(user_token.user_id)}
    );
  }

  anotupdMulAnnotations(layers, annotationId, activelayerId) {
    // undo sync uuid generate and stored area
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let generate_sync_uuid = this.generateSyncUUID();
    this.createDocumentStore_values.undovaluesstore.push(generate_sync_uuid);
    this.createDocumentStore_values.redovaluesstore = [];
    let getData = this.processfiltmulannot(layers, annotationId, activelayerId);
    console.log("data", JSON.stringify(getData))
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: generate_sync_uuid,
      updated_by_userid: this.su.user_id.toString(),
      layers: getData
    };
    console.log(parem);
    console.log(JSON.stringify(parem));
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<any>(this.APIBaseUrl + "annotation/update_form", {...parem,token,"updated_by_userid":String(user_token.user_id)});
  }

  anotupdMulAnnotations_freehand_asmany(layers, annotationId, activelayerId,type?:string) {
    // undo sync uuid generate and stored area
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let generate_sync_uuid = this.generateSyncUUID();
    this.createDocumentStore_values.undovaluesstore.push(generate_sync_uuid);
    this.createDocumentStore_values.redovaluesstore = [];
    let getData = this.processfiltmulannot(layers, annotationId, activelayerId);
    console.log("data", JSON.stringify(getData))
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: generate_sync_uuid,
      updated_by_userid: this.su.user_id.toString(),
      layers: getData,
      update_type:type
    };
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.encrptdecrpt.getItem("APIBaseUrl") + "annotation/update_annotation_property_web", {...parem,token,"updated_by_userid":String(user_token.user_id)});
  }

  processfiltmulannot(layers, annotationId, activelayerId) {
    let cloneLayerData = layers;
    let currentLayerAnnotation = [];
    let currentLayer = [];
    let findLayer = cloneLayerData.findIndex((LData) => LData.layer_id === activelayerId);
    if (findLayer != -1) {
      for (let j = 0; j < annotationId.length; j++) {
        let filterAnnotation = cloneLayerData[findLayer].annotations.filter((ad) => ad.annotation_id === annotationId[j]);
        if (filterAnnotation.length > 0) {
          // change special character freehand draw update
          filterAnnotation[0].annotation_name = this.textCheckService.changeFormat(filterAnnotation[0].annotation_name);
          filterAnnotation[0].annotation_label = this.textCheckService.changeFormat(filterAnnotation[0].annotation_label);
          filterAnnotation[0].annotation_tags = this.textCheckService.changeFormat(filterAnnotation[0].annotation_tags);
          filterAnnotation[0].annotation_data = this.textCheckService.changeFormat(filterAnnotation[0].annotation_data);
          if(filterAnnotation[0].annotation_forms.length>0){
            for(let fi=0;fi<filterAnnotation[0].annotation_forms.length;fi++){
              filterAnnotation[0].annotation_forms[fi].form_name = this.textCheckService.changeFormat(filterAnnotation[0].annotation_forms[fi].form_name);
              let get_cur_formdata = filterAnnotation[0].annotation_forms[fi].form_data;
              if(Array.isArray(get_cur_formdata)){
                if(get_cur_formdata.length>0){
                  filterAnnotation[0].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata,'annotationupdateformpublish');
                }
              }
            }
          }
          if (filterAnnotation[0].annotation_links.length > 0) {
            if (Array.isArray(filterAnnotation[0].annotation_links)) {
              for(let li=0;li<filterAnnotation[0].annotation_links.length;li++){
                if(filterAnnotation[0].annotation_links[li].document_id==''){
                  filterAnnotation[0].annotation_links[li].link_type = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_type);
                }
                else if(filterAnnotation[0].annotation_links[li].document_id!=''){
                  filterAnnotation[0].annotation_links[li].link_type = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_type);
                }
                if(filterAnnotation[0].annotation_links[li].hasOwnProperty('location')){
                  console.log(filterAnnotation[0].annotation_links[li].location);
                  if(filterAnnotation[0].annotation_links[li].location!=undefined){
                    filterAnnotation[0].annotation_links[li].location = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].location);
                  }
                }
              }
            }
          }
          if (filterAnnotation[0].annotation_media.length > 0) {
            if (Array.isArray(filterAnnotation[0].annotation_media)) {
              for(let li=0;li<filterAnnotation[0].annotation_media.length;li++){
                if(filterAnnotation[0].annotation_media[li].media_name!=''){
                  filterAnnotation[0].annotation_media[li].media_name = this.textCheckService.changeFormat(filterAnnotation[0].annotation_media[li].media_name);
                }
                if(filterAnnotation[0].annotation_media[li].media_comment!=''){
                  filterAnnotation[0].annotation_media[li].media_comment = this.textCheckService.changeFormat(filterAnnotation[0].annotation_media[li].media_comment);
                }
                if(filterAnnotation[0].annotation_media[li].hasOwnProperty("media_tags")){
                  if(filterAnnotation[0].annotation_media[li].media_tags!=''){
                    filterAnnotation[0].annotation_media[li].media_tags = this.textCheckService.changeFormat(filterAnnotation[0].annotation_media[li].media_tags);
                  }
                }
              }
            }
          }
         //original_property
        if((typeof filterAnnotation[0].original_property) == 'object'){
          if(filterAnnotation[0].original_property.hasOwnProperty('annotation_data')){
            filterAnnotation[0].original_property.annotation_data = this.textCheckService.changeFormat(filterAnnotation[0].original_property.annotation_data);
          }
        }
          currentLayerAnnotation.push(filterAnnotation[0]);
        }
      }
      cloneLayerData[findLayer].annotations = currentLayerAnnotation;
      cloneLayerData[findLayer].layer_name = this.textCheckService.changeFormat(cloneLayerData[findLayer].layer_name);
      currentLayer.push(cloneLayerData[findLayer]);
    }
    return currentLayer;
  }

  // annotationUpdateForm1(layers, annotationId, activelayerId,type?:string) {
  //   let generate_sync_uuid = this.generateSyncUUID();
  //   this.createDocumentStore_values.undovaluesstore.push(generate_sync_uuid);
  //   this.createDocumentStore_values.redovaluesstore = [];
  //   let getData = this.processCurrentData(layers, annotationId, activelayerId);
  //   console.log(JSON.stringify(getData));
  //   let createdDate = new Date().toISOString();
  //   var parem = {
  //     created_date: createdDate,
  //     last_updated_date: createdDate,
  //     sync_version_uuid: generate_sync_uuid,
  //     updated_by_userid: this.su.user_id.toString(),
  //     layers: getData,
  //   };
  //   return this.Http.post<any>(this.encrptdecrpt.getItem("APIBaseUrl") + "annotation/update_form", parem);
   
  // }

  annotationUpdateForm1(layers, annotationId, activelayerId,type?:string) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let generate_sync_uuid = this.generateSyncUUID();
    this.createDocumentStore_values.undovaluesstore.push(generate_sync_uuid);
    this.createDocumentStore_values.redovaluesstore = [];
    let getData = this.processCurrentData(layers, annotationId, activelayerId);
    let createdDate = new Date().toISOString();
    if(type!=undefined && type != ""){
      var parem = {
        created_date: createdDate,
        last_updated_date: createdDate,
        sync_version_uuid: generate_sync_uuid,
        updated_by_userid: this.su.user_id.toString(),
        layers: getData,
        update_type:type
      };
      console.log(JSON.stringify(parem));
      // return this.Http.post<any>(this.APIBaseUrl + "annotation/update_layer_web", parem);
      console.log(this.APIBaseUrl + "annotation/update_annotation_property_web", parem);
      let token = this.encrptdecrpt.getItem("session_token") || "{}";
      let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
      return this.Http.post<any>(this.APIBaseUrl + "annotation/update_annotation_property_web", {...parem,token,"updated_by_userid":String(user_token.user_id)});
    }
    else{
      var parem_old = {
        created_date: createdDate,
        last_updated_date: createdDate,
        sync_version_uuid: generate_sync_uuid,
        updated_by_userid: this.su.user_id.toString(),
        layers: getData
      };
      console.log(this.APIBaseUrl + "annotation/update_form", parem_old);
      let token = this.encrptdecrpt.getItem("session_token") || "{}";
      let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
      return this.Http.post<any>(this.APIBaseUrl + "annotation/update_form", {...parem_old,token,"updated_by_userid":String(user_token.user_id)});
    }
   
  }

  annotationUpdate_multipleCopy(layers, annotationIds, activelayerId,type?:string) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let generate_sync_uuid = this.generateSyncUUID();
    this.createDocumentStore_values.undovaluesstore.push(generate_sync_uuid);
    this.createDocumentStore_values.redovaluesstore = [];
    let getData = this.processmultipleLayerData(layers, annotationIds);
    let createdDate = new Date().toISOString();
    if(type!=undefined && type != ""){
      var parem = {
        created_date: createdDate,
        last_updated_date: createdDate,
        sync_version_uuid: generate_sync_uuid,
        updated_by_userid: this.su.user_id.toString(),
        layers: getData,
        update_type:type
      };
      console.log(JSON.stringify(parem));
      // return this.Http.post<any>(this.APIBaseUrl + "annotation/update_layer_web", parem);
      console.log(this.APIBaseUrl + "annotation/update_annotation_property_web", parem);
      let token = this.encrptdecrpt.getItem("session_token") || "{}";
      let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
      return this.Http.post<any>(this.APIBaseUrl + "annotation/update_annotation_property_web", {...parem,token,"updated_by_userid":String(user_token.user_id)});
    }   
  }

  processCurrentData1(layers, annotationId, activelayerId) {
    let cloneLayerData = layers;
    let currentLayer = [];
    for (let j = 0; j < cloneLayerData.length; j++) {
      let filterAnnotation = cloneLayerData[j].annotations.filter((ad) => ad.annotation_id === annotationId);
      if (filterAnnotation.length > 0) {

        console.log(cloneLayerData[j].annotations);
        cloneLayerData[j].annotations = [];
        cloneLayerData[j].annotations = filterAnnotation;
        currentLayer.push(cloneLayerData[j]);
        for (let k = 0; k < cloneLayerData[j].annotations.length; k++) {
          cloneLayerData[j].annotations[k].annotation_id = annotationId + '-scale'
          cloneLayerData[j].annotations[k].annotation_url = {
            "scaleValue": "100",
            "scaleAgainst": {
              "width": 122.56267409470776,
              "height": 0
            }
          }
        }
        break;
      }
    }
    return currentLayer;
  }

  processCurrentData(layers, annotationId, activelayerId) {
    let cloneLayerData = layers;
    let currentLayer = [];
    for (let j = 0; j < cloneLayerData.length; j++) {
      let filterAnnotation = cloneLayerData[j].annotations.filter((ad) => ad.annotation_id === annotationId);
      if (filterAnnotation.length > 0) {
        console.log(filterAnnotation);
        cloneLayerData[j].annotations = [];
        filterAnnotation[0].annotation_name = this.textCheckService.changeFormat(filterAnnotation[0].annotation_name);
        filterAnnotation[0].annotation_label = this.textCheckService.changeFormat(filterAnnotation[0].annotation_label);
        filterAnnotation[0].annotation_tags = this.textCheckService.changeFormat(filterAnnotation[0].annotation_tags);
        filterAnnotation[0].annotation_data = this.textCheckService.changeFormat(filterAnnotation[0].annotation_data);
        if(filterAnnotation[0].annotation_forms.length>0){
          for(let fi=0;fi<filterAnnotation[0].annotation_forms.length;fi++){
            filterAnnotation[0].annotation_forms[fi].form_name = this.textCheckService.changeFormat(filterAnnotation[0].annotation_forms[fi].form_name);
            let get_cur_formdata = filterAnnotation[0].annotation_forms[fi].form_data;
            if(Array.isArray(get_cur_formdata)){
              if(get_cur_formdata.length>0){
                filterAnnotation[0].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata,'annotationupdateformpublish');
              }
            }
            if(filterAnnotation[0].annotation_forms[fi].hasOwnProperty('ext_form_data')){
              if(filterAnnotation[0].annotation_forms[fi].ext_form_data != "")
              {
                if(filterAnnotation[0].annotation_forms[fi].ext_form_data != null){
                  let get_cur_ext_formdata = filterAnnotation[0].annotation_forms[fi].ext_form_data;
                  if (Array.isArray(get_cur_ext_formdata)) {
                    if (get_cur_ext_formdata.length > 0) {
                      filterAnnotation[0].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(get_cur_ext_formdata, 'annotationgetformview');
                    }
                  }else{
                    get_cur_ext_formdata = JSON.parse(get_cur_ext_formdata);
                    if (get_cur_ext_formdata.length > 0) {
                      filterAnnotation[0].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(get_cur_ext_formdata, 'annotationgetformview');
                    }
                  }
                }
              }
            }
          }
        }
        if (filterAnnotation[0].annotation_links.length > 0) {
          if (Array.isArray(filterAnnotation[0].annotation_links)) {
            for(let li=0;li<filterAnnotation[0].annotation_links.length;li++){
              if(filterAnnotation[0].annotation_links[li].document_id==''){
                filterAnnotation[0].annotation_links[li].link_type = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_type);
                filterAnnotation[0].annotation_links[li].link_path = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_path);
              }
              else if(filterAnnotation[0].annotation_links[li].document_id!=''){
                filterAnnotation[0].annotation_links[li].link_type = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_type);
                filterAnnotation[0].annotation_links[li].link_path = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_path);
              }
              if(filterAnnotation[0].annotation_links[li].hasOwnProperty('location')){
                console.log(filterAnnotation[0].annotation_links[li].location);
                if(filterAnnotation[0].annotation_links[li].location!=undefined){
                  filterAnnotation[0].annotation_links[li].location = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].location);
                }
              }
            }
          }
        }
        if (filterAnnotation[0].annotation_media.length > 0) {
          if (Array.isArray(filterAnnotation[0].annotation_media)) {
            for(let li=0;li<filterAnnotation[0].annotation_media.length;li++){
              if(filterAnnotation[0].annotation_media[li].media_name!=''){
                filterAnnotation[0].annotation_media[li].media_name = this.textCheckService.changeFormat(filterAnnotation[0].annotation_media[li].media_name);
              }
              if(filterAnnotation[0].annotation_media[li].media_comment!=''){
                filterAnnotation[0].annotation_media[li].media_comment = this.textCheckService.changeFormat(filterAnnotation[0].annotation_media[li].media_comment);
              }
              if(filterAnnotation[0].annotation_media[li].hasOwnProperty("media_tags")){
                if(filterAnnotation[0].annotation_media[li].media_tags!=''){
                  filterAnnotation[0].annotation_media[li].media_tags = this.textCheckService.changeFormat(filterAnnotation[0].annotation_media[li].media_tags);
                }
              }
            }
          }
        }
        //original_property
        if((typeof filterAnnotation[0].original_property) == 'object'){
          if(filterAnnotation[0].original_property.hasOwnProperty('annotation_data')){
            filterAnnotation[0].original_property.annotation_data = this.textCheckService.changeFormat(filterAnnotation[0].original_property.annotation_data);
          }
        }
        cloneLayerData[j].annotations = filterAnnotation;
        currentLayer.push(cloneLayerData[j]);
        currentLayer[0].layer_name = this.textCheckService.changeFormat(currentLayer[0].layer_name);
        break;
      }
    
      
    }
    return currentLayer;
  }

  processCurrentData3(layers, annotationId, activelayerId) {
    //This function is called while multiple annotations are moved and done button is clicked.[P3X-1655] 
    let cloneLayerData = layers;
    let currentLayer = [];
    let copy=_.cloneDeep(cloneLayerData);
    console.log(typeof annotationId);
    for (let j = 0; j < cloneLayerData.length; j++) {
      cloneLayerData[j].annotations = [];
      for(let k=0;k<annotationId.length;k++){  
      let filterAnnotation = copy[j].annotations.filter((ad) => ad.annotation_id === annotationId[k]);
      if (filterAnnotation.length > 0) {
        console.log(filterAnnotation);
        filterAnnotation[0].annotation_name = this.textCheckService.changeFormat(filterAnnotation[0].annotation_name);
        filterAnnotation[0].annotation_label = this.textCheckService.changeFormat(filterAnnotation[0].annotation_label);
        filterAnnotation[0].annotation_tags = this.textCheckService.changeFormat(filterAnnotation[0].annotation_tags);
        filterAnnotation[0].annotation_data = this.textCheckService.changeFormat(filterAnnotation[0].annotation_data);
        if(filterAnnotation[0].annotation_forms.length>0){
          for(let fi=0;fi<filterAnnotation[0].annotation_forms.length;fi++){
            filterAnnotation[0].annotation_forms[fi].form_name = this.textCheckService.changeFormat(filterAnnotation[0].annotation_forms[fi].form_name);
            let get_cur_formdata = filterAnnotation[0].annotation_forms[fi].form_data;
            if(Array.isArray(get_cur_formdata)){
              if(get_cur_formdata.length>0){
                filterAnnotation[0].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata,'annotationupdateformpublish');
              }
            }
            if(filterAnnotation[0].annotation_forms[fi].hasOwnProperty('ext_form_data')){
              if(filterAnnotation[0].annotation_forms[fi].ext_form_data != "")
              {
                if(filterAnnotation[0].annotation_forms[fi].ext_form_data != null){
                  let get_cur_ext_formdata = filterAnnotation[0].annotation_forms[fi].ext_form_data;
                  if (Array.isArray(get_cur_ext_formdata)) {
                    if (get_cur_ext_formdata.length > 0) {
                      filterAnnotation[0].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(get_cur_ext_formdata, 'annotationgetformview');
                    }
                  }else{
                    get_cur_ext_formdata = JSON.parse(get_cur_ext_formdata);
                    if (get_cur_ext_formdata.length > 0) {
                      filterAnnotation[0].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(get_cur_ext_formdata, 'annotationgetformview');
                    }
                  }
                }
              }
            }
          }
        }
        if (filterAnnotation[0].annotation_links.length > 0) {
          if (Array.isArray(filterAnnotation[0].annotation_links)) {
            for(let li=0;li<filterAnnotation[0].annotation_links.length;li++){
              if(filterAnnotation[0].annotation_links[li].document_id==''){
                filterAnnotation[0].annotation_links[li].link_type = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_type);
                filterAnnotation[0].annotation_links[li].link_path = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_path);
              }
              else if(filterAnnotation[0].annotation_links[li].document_id!=''){
                filterAnnotation[0].annotation_links[li].link_type = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_type);
                filterAnnotation[0].annotation_links[li].link_path = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].link_path);
              }
              if(filterAnnotation[0].annotation_links[li].hasOwnProperty('location')){
                console.log(filterAnnotation[0].annotation_links[li].location);
                if(filterAnnotation[0].annotation_links[li].location!=undefined){
                  filterAnnotation[0].annotation_links[li].location = this.textCheckService.changeFormat(filterAnnotation[0].annotation_links[li].location);
                }
              }
            }
          }
        }
        if (filterAnnotation[0].annotation_media.length > 0) {
          if (Array.isArray(filterAnnotation[0].annotation_media)) {
            for(let li=0;li<filterAnnotation[0].annotation_media.length;li++){
              if(filterAnnotation[0].annotation_media[li].media_name!=''){
                filterAnnotation[0].annotation_media[li].media_name = this.textCheckService.changeFormat(filterAnnotation[0].annotation_media[li].media_name);
              }
              if(filterAnnotation[0].annotation_media[li].media_comment!=''){
                filterAnnotation[0].annotation_media[li].media_comment = this.textCheckService.changeFormat(filterAnnotation[0].annotation_media[li].media_comment);
              }
              if(filterAnnotation[0].annotation_media[li].hasOwnProperty("media_tags")){
                if(filterAnnotation[0].annotation_media[li].media_tags!=''){
                  filterAnnotation[0].annotation_media[li].media_tags = this.textCheckService.changeFormat(filterAnnotation[0].annotation_media[li].media_tags);
                }
              }
            }
          }
        }
        //original_property
        if((typeof filterAnnotation[0].original_property) == 'object'){
          if(filterAnnotation[0].original_property.hasOwnProperty('annotation_data')){
            filterAnnotation[0].original_property.annotation_data = this.textCheckService.changeFormat(filterAnnotation[0].original_property.annotation_data);
          }
        }
        if(cloneLayerData[j].annotations.length==0){
        cloneLayerData[j].annotations = filterAnnotation;
        }
        else{
          cloneLayerData[j].annotations.push(filterAnnotation[0]);
        }
        
      }
      }
    }
    currentLayer.push(cloneLayerData[0]);
    currentLayer[0].layer_name = this.textCheckService.changeFormat(currentLayer[0].layer_name);
    return currentLayer;
  }

  annotationMultipleUpdate(layers, receivemultipleList,type:string) {
    // undo sync uuid generate and stored area
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let multipleList = _.cloneDeep(receivemultipleList); 
    let generate_sync_uuid = this.generateSyncUUID();
    this.createDocumentStore_values.undovaluesstore.push(generate_sync_uuid);
    this.createDocumentStore_values.redovaluesstore = [];
    let getData = this.processmultipleLayerData(layers, multipleList);
    let createdDate = new Date().toISOString();
    if(type!=undefined && type != ""){
      var parem = {
        created_date: createdDate,
        last_updated_date: createdDate,
        sync_version_uuid: generate_sync_uuid,
        updated_by_userid: this.su.user_id.toString(),
        layers: getData,
        update_type:type
      };
      console.log(JSON.stringify(parem));
      let token = this.encrptdecrpt.getItem("session_token") || "{}";
      let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
      return this.Http.post<any>(this.APIBaseUrl + "annotation/update_annotation_property_web", 
      {...parem,token,"updated_by_userid":String(user_token.user_id)});
    }
    else{
      var parem_old = {
        created_date: createdDate,
        last_updated_date: createdDate,
        sync_version_uuid: generate_sync_uuid,
        updated_by_userid: this.su.user_id.toString(),
        layers: getData
      };
      console.log(this.APIBaseUrl + "annotation/update_form", parem_old);
      let token = this.encrptdecrpt.getItem("session_token") || "{}";
      let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
      return this.Http.post<any>(this.APIBaseUrl + "annotation/update_form", 
      {...parem_old,token,"updated_by_userid":String(user_token.user_id)});
    }

    
  }

  createGroupAnnts(ids,groupData){
    let user_token = this.encrptdecrpt.getItem("session_token") || "{}";
    let createGroup_details = new createGroup();
    createGroup_details.project_id = ids.proj_id; 
    createGroup_details.document_id = ids.folder_id; 
    createGroup_details.group_id = ids.group_id; 
    createGroup_details.group_data = [groupData];  
    createGroup_details.user_id = ids.user_id;
    createGroup_details.token = user_token;
    createGroup_details.sync_version_uuid = "0";
    return this.Http.post<any>(this.APIBaseUrl + "annotation/create_grouping_annotation",createGroup_details);
  }

  getGroupAnnts(ids){
    let user_token = this.encrptdecrpt.getItem("session_token") || "{}";
     let getGroupDetails = new getgroup();
     getGroupDetails.user_id = ids.user_id;
     getGroupDetails.document_id = ids.folder_id;
     getGroupDetails.token = user_token;
     return this.Http.post<any>(this.APIBaseUrl + "annotation/get_grouping_annotation",getGroupDetails);
  }
  
  updatingGroupAnntsService(ids,groupData){
    let user_token = this.encrptdecrpt.getItem("session_token") || "{}";
    let updateGroup_details = new updateGroup();
    updateGroup_details.document_id = ids.folder_id; 
    // updateGroup_details.group_id = ids.folder_id;
    updateGroup_details.group_data = [groupData];  
    updateGroup_details.user_id = ids.user_id;
    updateGroup_details.token = user_token;
    updateGroup_details.sync_version_uuid = "0";
    return this.Http.post<any>(this.APIBaseUrl + "annotation/update_grouping_annotation",updateGroup_details);
  }

  processmultipleLayerData(layers, multipleList) {
    let cloneLayerData = layers;
    let currentLayers = [];
    let existLayer = [];
    for (let a = 0; a < cloneLayerData.length; a++) {
      cloneLayerData[a].annotations = [];
      //convert special characters layer name
      cloneLayerData[a].layer_name = this.textCheckService.changeFormat(cloneLayerData[a].layer_name);
    }
    for (let i = 0; i < multipleList.length; i++) {
      let findLyaerIndex = cloneLayerData.findIndex((Ldata) => Ldata.layer_id == multipleList[i].layer_id);
      if (findLyaerIndex != -1) {
        let pushItem = cloneLayerData[findLyaerIndex];
        if (existLayer.some((check1) => check1 === pushItem.layer_id)) {
          let existLayerFindIndex = currentLayers.findIndex((Edata) => Edata.layer_id === pushItem.layer_id);
          if (existLayerFindIndex != -1) {
            //convert special characters annotations
            multipleList[i].annotation_name = this.textCheckService.changeFormat(multipleList[i].annotation_name);
            multipleList[i].annotation_label = this.textCheckService.changeFormat(multipleList[i].annotation_label);
            multipleList[i].annotation_tags = this.textCheckService.changeFormat(multipleList[i].annotation_tags);
            multipleList[i].annotation_data = this.textCheckService.changeFormat(multipleList[i].annotation_data);
            if (multipleList[i].annotation_forms.length > 0) {
              for (let fi = 0; fi < multipleList[i].annotation_forms.length; fi++) {
                multipleList[i].annotation_forms[fi].form_name = this.textCheckService.changeFormat(multipleList[i].annotation_forms[fi].form_name);
                let get_cur_formdata = multipleList[i].annotation_forms[fi].form_data;
                if (Array.isArray(get_cur_formdata)) {
                  if (get_cur_formdata.length > 0) {
                    multipleList[i].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata, 'multipleannotationupdateformpublish');
                  }
                }
                if(multipleList[i].annotation_forms[fi].hasOwnProperty('ext_form_data')){
                  if(multipleList[i].annotation_forms[fi].ext_form_data != null && multipleList[i].annotation_forms[fi].ext_form_data!=""){
                    let ext_get_cur_formdata = multipleList[i].annotation_forms[fi].ext_form_data;
                    if (Array.isArray(ext_get_cur_formdata)) {
                      if (ext_get_cur_formdata.length > 0) {
                        multipleList[i].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(ext_get_cur_formdata, 'multipleannotationupdateformpublish');
                      }
                    }else{
                      ext_get_cur_formdata = JSON.parse(ext_get_cur_formdata);
                      if (ext_get_cur_formdata.length > 0) {
                        multipleList[i].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(ext_get_cur_formdata, 'multipleannotationupdateformpublish');
                      }
                    }
                  }
                }
              }
            }
            if (multipleList[i].annotation_links.length > 0) {
              if (Array.isArray(multipleList[i].annotation_links)) {
                for(let li=0;li<multipleList[i].annotation_links.length;li++){
                  if(multipleList[i].annotation_links[li].document_id==''){
                    multipleList[i].annotation_links[li].link_type = this.textCheckService.changeFormat(multipleList[i].annotation_links[li].link_type);
                    multipleList[i].annotation_links[li].link_path = this.textCheckService.changeFormat(multipleList[i].annotation_links[li].link_path);
                  }
                  else if(multipleList[i].annotation_links[li].document_id!=''){
                    multipleList[i].annotation_links[li].link_type = this.textCheckService.changeFormat(multipleList[i].annotation_links[li].link_type);
                    multipleList[i].annotation_links[li].link_path = this.textCheckService.changeFormat(multipleList[i].annotation_links[li].link_path);
                  }
                  if(multipleList[i].annotation_links[li].hasOwnProperty('location')){
                    multipleList[i].annotation_links[li].location = this.textCheckService.changeFormat(multipleList[i].annotation_links[li].location);
                  }
                }
              }
            }
            if (multipleList[i].annotation_media.length > 0) {
              if (Array.isArray(multipleList[i].annotation_media)) {
                for(let li=0;li<multipleList[i].annotation_media.length;li++){
                  if(multipleList[i].annotation_media[li].media_name!=''){
                    multipleList[i].annotation_media[li].media_name = this.textCheckService.changeFormat(multipleList[i].annotation_media[li].media_name);
                  }
                  if(multipleList[i].annotation_media[li].media_comment!=''){
                    multipleList[i].annotation_media[li].media_comment = this.textCheckService.changeFormat(multipleList[i].annotation_media[li].media_comment);
                  }
                  if(multipleList[i].annotation_media[li].hasOwnProperty("media_tags")){
                    if(multipleList[i].annotation_media[li].media_tags!=''){
                      multipleList[i].annotation_media[li].media_tags = this.textCheckService.changeFormat(multipleList[i].annotation_media[li].media_tags);
                    }
                  }
                }
              }
            }
            //original_property
         if((typeof multipleList[i].original_property) == 'object'){
          if(multipleList[i].original_property.hasOwnProperty('annotation_data')){
            multipleList[i].original_property.annotation_data = this.textCheckService.changeFormat(multipleList[i].original_property.annotation_data);
          }
         }
            currentLayers[existLayerFindIndex].annotations.push(multipleList[i]);
          }
        }
        else {
          existLayer.push(cloneLayerData[findLyaerIndex].layer_id);
          //convert special characters annotations
          multipleList[i].annotation_name = this.textCheckService.changeFormat(multipleList[i].annotation_name);
          multipleList[i].annotation_label = this.textCheckService.changeFormat(multipleList[i].annotation_label);
          multipleList[i].annotation_tags = this.textCheckService.changeFormat(multipleList[i].annotation_tags);
          multipleList[i].annotation_data = this.textCheckService.changeFormat(multipleList[i].annotation_data);
          if (multipleList[i].annotation_forms.length > 0) {
            for (let fi = 0; fi < multipleList[i].annotation_forms.length; fi++) {
              multipleList[i].annotation_forms[fi].form_name = this.textCheckService.changeFormat(multipleList[i].annotation_forms[fi].form_name);
              let get_cur_formdata = multipleList[i].annotation_forms[fi].form_data;
              if (Array.isArray(get_cur_formdata)) {
                if (get_cur_formdata.length > 0) {
                  multipleList[i].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata, 'multipleannotationupdateformpublish');
                }
              }
              if(multipleList[i].annotation_forms[fi].hasOwnProperty('ext_form_data')){
                if(multipleList[i].annotation_forms[fi].ext_form_data != null && multipleList[i].annotation_forms[fi].ext_form_data.length!=0){
                  let ext_get_cur_formdata = multipleList[i].annotation_forms[fi].ext_form_data;
                  if (Array.isArray(ext_get_cur_formdata)) {
                    if (ext_get_cur_formdata.length > 0) {
                      multipleList[i].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(ext_get_cur_formdata, 'multipleannotationupdateformpublish');
                    }
                  }else if(ext_get_cur_formdata != ""){
                    ext_get_cur_formdata = JSON.parse(ext_get_cur_formdata);
                    if (ext_get_cur_formdata.length > 0) {
                      multipleList[i].annotation_forms[fi].ext_form_data = this.textCheckService.changingformelementpublish(ext_get_cur_formdata, 'multipleannotationupdateformpublish');
                    }
                  }
                }
              }
            }
            
          }
          
          if (multipleList[i].annotation_links.length > 0) {
            if (Array.isArray(multipleList[i].annotation_links)) {
              for(let li=0;li<multipleList[i].annotation_links.length;li++){
                if(multipleList[i].annotation_links[li].document_id==''){
                  multipleList[i].annotation_links[li].link_type = this.textCheckService.changeFormat(multipleList[i].annotation_links[li].link_type);
                }
                else if(multipleList[i].annotation_links[li].document_id!=''){
                  multipleList[i].annotation_links[li].link_type = this.textCheckService.changeFormat(multipleList[i].annotation_links[li].link_type);
                }
                if(multipleList[i].annotation_links[li].hasOwnProperty('location')){
                  multipleList[i].annotation_links[li].location = this.textCheckService.changeFormat(multipleList[i].annotation_links[li].location);
                }
              }
            }
          }
          if (multipleList[i].annotation_media.length > 0) {
            if (Array.isArray(multipleList[i].annotation_media)) {
              for(let li=0;li<multipleList[i].annotation_media.length;li++){
                if(multipleList[i].annotation_media[li].media_name!=''){
                  multipleList[i].annotation_media[li].media_name = this.textCheckService.changeFormat(multipleList[i].annotation_media[li].media_name);
                }
                if(multipleList[i].annotation_media[li].media_comment!=''){
                  multipleList[i].annotation_media[li].media_comment = this.textCheckService.changeFormat(multipleList[i].annotation_media[li].media_comment);
                }
                if(multipleList[i].annotation_media[li].hasOwnProperty("media_tags")){
                  if(multipleList[i].annotation_media[li].media_tags!=''){
                    multipleList[i].annotation_media[li].media_tags = this.textCheckService.changeFormat(multipleList[i].annotation_media[li].media_tags);
                  }
                }
              }
            }
          }
              //original_property
         if((typeof multipleList[i].original_property) == 'object'){
          if(multipleList[i].original_property.hasOwnProperty('annotation_data')){
            multipleList[i].original_property.annotation_data = this.textCheckService.changeFormat(multipleList[i].original_property.annotation_data);
          }
         }
          cloneLayerData[findLyaerIndex].annotations.push(multipleList[i]);
          currentLayers.push(cloneLayerData[findLyaerIndex]);
        }
      }
    }
    return currentLayers;
  }

  annotationMRRUpdate(layers, multipleList) {
    // undo sync uuid generate and stored area
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let generate_sync_uuid = this.generateSyncUUID();
    this.createDocumentStore_values.undovaluesstore.push(generate_sync_uuid);
    this.createDocumentStore_values.redovaluesstore = [];
    let getData = this.processMRRLayerData(layers, multipleList);
    let createdDate = new Date().toISOString();
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: generate_sync_uuid,
      updated_by_userid: this.su.user_id.toString(),
      layers: getData
    };
    console.log(parem);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "annotation/multi_select_annotation_web", 
    {...parem,token,"updated_by_userid":String(user_token.user_id)});
  }

  processMRRLayerData(layers, multipleList) {

    let cloneLayerData = layers;
    let currentLayers = [];
    let existLayer = [];
    for (let a = 0; a < cloneLayerData.length; a++) {
      cloneLayerData[a].annotations = [];
    }
    for (let i = 0; i < multipleList.length; i++) {
      let findLyaerIndex = cloneLayerData.findIndex((Ldata) => Ldata.layer_id == multipleList[i].layer_id);
      if (findLyaerIndex != -1) {
        let pushItem = cloneLayerData[findLyaerIndex];
        if (existLayer.some((check1) => check1 === pushItem.layer_id)) {
          let existLayerFindIndex = currentLayers.findIndex((Edata) => Edata.layer_id === pushItem.layer_id);
          if (existLayerFindIndex != -1) {
            let specificFields = new Object();
            specificFields["annotation_id"] = multipleList[i].annotation_id;
            specificFields["initial_position_x"] = multipleList[i].initial_position_x.toString();
            specificFields["initial_position_y"] = multipleList[i].initial_position_y.toString();
            specificFields["initial_width"] = multipleList[i].initial_width.toString();
            specificFields["initial_height"] = multipleList[i].initial_height.toString();
            if(multipleList[i].annotation_data != undefined && multipleList[i].annotation_data != ""){
              specificFields["annotation_data"] = multipleList[i].annotation_data;
            }
            if (multipleList[i].hasOwnProperty("initial_rotation")) {
              specificFields["initial_rotate"] = multipleList[i].initial_rotation.toString();
            }
            else {
              specificFields["initial_rotate"] = "0";
            }
            // currentLayers[existLayerFindIndex].annotations.push(multipleList[i]);
            currentLayers[existLayerFindIndex].annotations.push(specificFields);
          }
        }
        else {
          existLayer.push(cloneLayerData[findLyaerIndex].layer_id);
          let specificFields = new Object();
          specificFields["annotation_id"] = multipleList[i].annotation_id;
          specificFields["initial_position_x"] = multipleList[i].initial_position_x.toString();
          specificFields["initial_position_y"] = multipleList[i].initial_position_y.toString();
          specificFields["initial_width"] = multipleList[i].initial_width.toString();
          specificFields["initial_height"] = multipleList[i].initial_height.toString();
           if(multipleList[i].annotation_data != undefined && multipleList[i].annotation_data != ""){
              specificFields["annotation_data"] = multipleList[i].annotation_data;
            }
          if (multipleList[i].hasOwnProperty("initial_rotation")) {
            specificFields["initial_rotate"] = multipleList[i].initial_rotation.toString();
          }
          else {
            specificFields["initial_rotate"] = "0";
          }
          cloneLayerData[findLyaerIndex].annotations.push(specificFields);
          currentLayers.push(cloneLayerData[findLyaerIndex]);
        }
      }
    }
    return currentLayers;
  }

  getAnnotationDetails(getData) {
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";

    var parem = {
      annotation_id: getData,
      token,
      "updated_by_userid":String(user_token.user_id)
    };

    return this.Http.post<any>(this.APIBaseUrl + "annotation/get_media_data", parem);
  }

  createLayerPages(
    layerName,
    layerType,
    date,
    uuidDate,
    uuid,
    projectId,
    folderId,
    selectedPages
  ) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var createNewLayer = new createLayer();
    createNewLayer.created_by_user_id = this.su.user_id;
    createNewLayer.layer_id = this.su.user_id + "-" + uuid + "-" + uuidDate;
    createNewLayer.project_id = projectId;
    createNewLayer.layer_type = layerType;
    createNewLayer.is_visible_flag = true;
    createNewLayer.is_active_flag = false;
    createNewLayer.document_id = folderId;
    createNewLayer.is_default_flag = true;
    createNewLayer.is_removed = false;
    createNewLayer.annotations = [];
    createNewLayer.associated_pages = [];
    createNewLayer.created_date = date;
    createNewLayer.last_updated_date = date;
    // var associated_pages = selectedPages;
    // for (var i = 0; i < selectedPages.length; i++) {
    //   let pageValue = {
    //     page_id: selectedPages[i],
    //     layer_id: createNewLayer.layer_id,
    //     created_date: date,
    //     last_updated_date: date,
    //     version_number: 1,
    //     is_removed: false,
    //     document_id: folderId,
    //   };
    //   associated_pages.push(pageValue);
    // }
    createNewLayer.associated_pages = selectedPages;
    createNewLayer.is_locked_flag = false;
    layerName = this.textCheckService.changeFormat(layerName);
    createNewLayer.layer_name = layerName;
    let createdDate = new Date().toISOString();
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    var parem = {
      created_date: createdDate,
      last_updated_date: createdDate,
      sync_version_uuid: "0",
      updated_by_userid: this.su.user_id.toString(),
      layers: [createNewLayer],
      token
    };
    console.log(parem);
    return this.Http.post<createLayer[]>(
      this.APIBaseUrl + "annotation/create_form",
      parem
    ).pipe(retry(3));
  }

  getProjectfolder(project_id): Observable<any> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var sendData = new projectFolder();
    sendData.user_id = this.su.user_id;
    sendData.project_id = project_id;
    sendData.is_hidden = true;
    sendData.is_all_folders = true;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "folder/get_project_folders", 
      {...sendData,token}).pipe(retry(3));
  }

  getAllProjectDocument(project_id): Observable<any> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let sendData = new projectFolder();
    sendData.user_id = this.su.user_id;
    sendData.project_id = project_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + 'folder/get_project_document_pages_web', 
    {...sendData,token}).pipe(retry(3));
  }

  layerDatas: any[] = [];

  getformlist(projectId): Observable<forms[]> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let formlist = new forms();
    formlist.user_id = this.su.user_id;
    formlist.project_id = projectId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<forms[]>(this.APIBaseUrl + "formbuilder/get_project_forms_list", 
    {...formlist,token});
  }
  seticonsize(documentid, layerdata) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let list = new forms();
    list.user_id = this.su.user_id;
    list.created_date = new Date().toISOString();
    list.sync_version_uuid = "0";
    list.document_id = documentid;
    list.active_layer_id = "";
    list.page_data = layerdata;
    console.log((this.APIBaseUrl + "annotation/update_base_icon", list));
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<forms[]>(this.APIBaseUrl + "annotation/update_base_icon", 
    {...list,token});
  }
  getNewUUID() {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
  }
                                                                                              
  downloadfilepdf(url: string): Observable<Blob> {
    return this.Http.get(url, {
      responseType: 'blob'
    })
  }

  getAutoCADReport(documentId,requestId) {
    var autoCADinputs = new getDocumentDetails();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    autoCADinputs.document_id = documentId;
    autoCADinputs.request_id = requestId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "autocad/reverse_autocad", 
    {...autoCADinputs,token,"updated_by_userid":String(user_token.user_id)});
  }

  getAutoCADReport_secondapi(documentId,requestId) {
    var autoCADinputs = new getDocumentDetails();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    autoCADinputs.document_id = documentId;
    autoCADinputs.request_id = requestId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<any>(this.APIBaseUrl + "autocad/get_autocad_status", 
    {...autoCADinputs,token,"updated_by_userid":String(user_token.user_id)});
  }
 

  getMultipleAnnotationData(annotationIds:string[]){
    // let generateInputs = new multipleannotation();
    // let created_date = new Date().toISOString();
    // generateInputs.annotation_id = annotationIds;
    // generateInputs.created_date = created_date;
    // generateInputs.last_updated_date = created_date;
    // generateInputs.sync_version_uuid = "0";
    // generateInputs.updated_by_userid = this.su.user_id.toString();
    // generateInputs.user_id = this.su.user_id;
    // console.log(this.encrptdecrpt.getItem("APIBaseUrl") + "annotation/get_annotation_data_web", generateInputs);
    // return this.Http.post<multipleannotation[]>(this.APIBaseUrl + "annotation/get_annotation_data_web", generateInputs);
    var getSingleAnnotate = new Object();
    getSingleAnnotate["annotations"] = annotationIds;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<singleAnnotation[]>(this.encrptdecrpt.getItem("APIBaseUrl") + "annotation/get_multi_annotation_web",
    {...getSingleAnnotate,token,"updated_by_userid":String(user_token.user_id)}).pipe(retry(3));
  }

  getmediastorage(projectId,processId){
    let generateInputsMedia = new mediaStore();
    generateInputsMedia.project_id = projectId;
    generateInputsMedia.process_id = processId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<multipleannotation[]>(this.APIBaseUrl + "admin/photos_zip", 
    {...generateInputsMedia,token,"updated_by_userid":String(user_token.user_id)});
  }

  getmediastorageDownload(processId){
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.Http.post<multipleannotation[]>(this.APIBaseUrl + "report/get_csv_url", 
    {process_id:processId,token,"updated_by_userid":String(user_token.user_id)});
  }

  getundodatafromdb(id:string,documentid:string,action:string) : Observable<undoredomdl[]>{
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let undo_inputs = new undoredomdl();
    undo_inputs.sync_version_uuid = id;
    undo_inputs.user_id = this.su.user_id;
    undo_inputs.document_id = documentid;
    undo_inputs.action = action;
    console.log(this.APIBaseUrl+'annotation/annotation_undo_redo',undo_inputs);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.Http.post<undoredomdl[]>(this.APIBaseUrl+'annotation/annotation_undo_redo',
    {...undo_inputs,token});
  }

  generateSyncUUID(){
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let uuidGenerator = 'web-' + this.su.user_id + '-' + uuidv1().toUpperCase() + '-' + new Date().getTime();
    return uuidGenerator;
  }

  convertJSON(recive_convert_value: any) {
    if (recive_convert_value && recive_convert_value != "") {
      return recive_convert_value = Array.isArray(recive_convert_value) ? recive_convert_value : JSON.parse(recive_convert_value);
    }
    else if (recive_convert_value == null || recive_convert_value == undefined || recive_convert_value == "") {
      return [];
    }
  }

  functionstarttime(apiname) {
    var start = new Date().getTime();
    console.log(apiname + ' Start time: ' + start);
    return start
  }

  functionendtime(apiname, start) {
    var end = new Date().getTime();
    var time = end - start;
    console.log(apiname + ' end time: ' + end);
    console.log(apiname + ' Execution time: ' + time);
  }




  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy);
  }
}




// let checkData = layers;
    // let findAnnotation = checkData.map(layer => layer.annotations.filter(annotationA => annotationA.annotation_id==annotationId));
    // console.log(findAnnotation);
    // let getCurrentValue = findAnnotation.filter((data)=>data.length>0)
    // console.log(getCurrentValue[0]);
    // let checkLayerId = getCurrentValue[0].layer_id;
    // cloneLayerData.forEach((copyData) => {
    //   if (copyData.layer_id === activelayerId) {
    //     let filterAnnotation = copyData.annotations.filter((ad) => ad.annotation_id === annotationId);
    //     console.log(filterAnnotation);
    //     copyData.annotations = [];
    //     copyData.annotations = filterAnnotation;
    //   } else {
    //     copyData.annotations = [];
    //   }
    // });
    // return cloneLayerData;

// let long_names = countries
//   .map(country => country.address_components.filter(component => component.types.indexOf('country') > -1)  // get relevant components
//   .filter(components => components.length > 0)  // filter out any without a country component
//   .map(components => components[0].long_name);  // get long name of first country component