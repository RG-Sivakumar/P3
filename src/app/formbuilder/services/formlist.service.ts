import { Injectable, EventEmitter } from "@angular/core";
import { forms } from "../Model/formslistmodel";
import { login } from "src/app/projectmanagement/models/login-model";
import { HttpClient } from "@angular/common/http";
import { project } from "src/app/project-dashboard/models/project-model";
import { Subject, Observable } from "rxjs";
import { duplicate } from "../Model/duplicateformmodel";
import { importForm } from "../Model/importForm.model";
import { defaultForm } from "src/app/formbuilder/Model/defaultform.model";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { csvFormatRows } from "d3";
import { csvform } from "../Model/exportformmodel";

@Injectable({
  providedIn: "root",
})
export class FormlistService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  readonly APIBaseExportUrl = environment.APIExportUrl;
  su: login;
  projectId: string;
  formData = new forms();

  constructor(private http: HttpClient,private encrptdecrpt:EncryptDecryptService) { }
  getformlist(): Observable<forms[]> {
    var formlist = new forms();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    formlist.user_id = this.su.user_id;
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    formlist.project_id = this.projectId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<forms[]>(
      this.APIBaseUrl + "formbuilder/get_project_forms_list",
      {...formlist,token}
    );
  }
  Rename(form_id, form_name): Observable<forms[]> {
    var rename = new forms();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    rename.user_id = this.su.user_id;
    rename.form_id = form_id;
    rename.form_name = form_name;
    rename.created_date=createdDate;
    rename.last_updated_date=createdDate;
    rename.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/rename_form",
      {...rename,token}
    );
  }

  getAllFormTag(projectId): Observable<forms[]> {
    var getFormtag = new forms();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    getFormtag.user_id = this.su.user_id;
    getFormtag.project_id = projectId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/get_project_forms_tags",
      {...getFormtag,token}
    );
  }
  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy);
  }
  gettag(form_id): Observable<forms[]> {
    var tag = new forms();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";

    tag.user_id = this.su.user_id;
    tag.form_id = form_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/get_form_tags",
      {...tag,token}
    );
  }
  AddTag(form_id, form_tag_name, project_id): Observable<forms[]> {
    var tag = new forms();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    tag.user_id = this.su.user_id;
    tag.form_id = form_id;
    tag.form_tag_name = form_tag_name.split(",");
    tag.project_id = project_id;
    tag.created_date=createdDate;
    tag.last_updated_date=createdDate;
    tag.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/add_form_tag",
      {...tag,token}
    );
  }
  RemoveTag(form_id, form_tag_id): Observable<forms[]> {
    var tag = new forms();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    tag.user_id = this.su.user_id;
    tag.form_id = form_id;
    tag.form_tag_id = form_tag_id;
    tag.created_date=createdDate;
    tag.last_updated_date=createdDate;
    tag.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/remove_form_tag",
      {...tag,token}
    );
  }
  moreinfo(form_id): Observable<forms[]> {
    var info = new forms();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    info.user_id = this.su.user_id;
    info.form_id = form_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/get_form_metrices",
      {...info,token}
    );
  }
  hide(form_id, is_hidden): Observable<forms[]> {
    var hide = new forms();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    hide.user_id = this.su.user_id;
    hide.form_id = form_id;
    hide.is_hidden = Boolean(is_hidden);
    hide.created_date=createdDate;
    hide.last_updated_date=createdDate;
    hide.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/hide_or_unhide_form",
      {...hide,token}
    );
  }
  unhide(form_id): Observable<forms[]> {
    var hide = new forms();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    hide.user_id = this.su.user_id;
    hide.form_id = form_id;
    hide.is_hidden = false;
    hide.created_date=createdDate;
    hide.last_updated_date=createdDate;
    hide.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/hide_or_unhide_form",
      {...hide,token}
    );
  }
  createform(uuid, date, form,extendflag): Observable<forms[]> {
    var create = new forms();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    create.user_id = this.su.user_id;
    create.project_id = this.encrptdecrpt.getItem("projectIdlocal");
    create.form_id = this.su.user_id + "-" + uuid.toString() + "-" + date;
    create.form_name = form;
    create.created_date=createdDate;
    create.last_updated_date=createdDate;
    create.sync_version_uuid="0";
    create.is_extend=extendflag;
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/create_form",
      {...create,token}
    );
  }
  Duplicateform(uuid, date, form, form_id) {
    var dup = new duplicate();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    dup.user_id = this.su.user_id;
    dup.source_project_id = this.encrptdecrpt.getItem("projectIdlocal");
    dup.source_form_id = form_id;
    dup.new_form_name = form;
    dup.destination_project_ids = this.encrptdecrpt.getItem("projectIdlocal");
    dup.destination_form_id = this.su.user_id + "-" + uuid.toString() + "-" + date;
    dup.created_date=createdDate;
    dup.last_updated_date=createdDate;
    dup.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/duplicate_form",
      {...dup,token}
    );
  }
  csvForm(email,documentid,formid,link,pageid,exporttype,project_id){
    let csvforms= new csvform();
    csvforms.email_id=email;
    csvforms.document_id=documentid
    csvforms.form_id=formid;
    csvforms.is_link=link;
    csvforms.page_id=pageid;
    csvforms.export_type=exporttype
    csvforms.project_id=project_id
    return this.http.post<csvform[]>(
      this.APIBaseExportUrl + "p3_export_files",csvforms
    );
  }
  getAllProjectForms() {
    var user = new duplicate();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    user.user_id = this.su.user_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/get_all_forms_list_for_user",
      {...user,token}
    );
  }

  importForms(uuidImportFormIds, sourceFormIds): Observable<importForm[]> {
    var importFormData = new importForm();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    importFormData.user_id = this.su.user_id;
    importFormData.destination_project_id = this.encrptdecrpt.getItem(
      "projectIdlocal"
    );
    importFormData.destination_form_ids = uuidImportFormIds;
    importFormData.source_form_ids_sepearated_by_comma = sourceFormIds;
    importFormData.created_date=createdDate;
    importFormData.last_updated_date=createdDate;
    importFormData.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.http.post<importForm[]>(
      this.APIBaseUrl + "formbuilder/import_form",
      {...importFormData,token}
    );
  }

  importForms1(importFormData): Observable<importForm[]> {
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.http.post<importForm[]>(
      this.APIBaseUrl + "formbuilder/import_form",
      {...importFormData,token}
    );
  }
  get_form_data(form_id) {
    var gfd = new forms();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    gfd.user_id = this.su.user_id;
    gfd.form_id = form_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "formbuilder/get_form_data",
      {...gfd,token,} 
    );
  }

  createDefaultForm(
    uuid,
    date,
    defaultName,
    projectId
  ): Observable<defaultForm[]> {
    var createDefaultForm = new defaultForm();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    createDefaultForm.user_id = this.su.user_id;
    createDefaultForm.project_id = projectId;
    createDefaultForm.form_name = defaultName;
    createDefaultForm.form_id = this.su.user_id + "-" + uuid + "-" + date;
    createDefaultForm.created_date=createdDate;
    createDefaultForm.last_updated_date=createdDate;
    createDefaultForm.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.http.post<defaultForm[]>(
      this.APIBaseUrl + "formbuilder/create_form",
      {...createDefaultForm,token}
    );
  }

  loaderActivated = new EventEmitter<any>();

}

