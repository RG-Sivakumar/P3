import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { login } from "src/app/projectmanagement/models/login-model";
import { toolbar } from "../Model/toolbarmodel";
import { CreateToolbar } from "../model/createtoolbar";
import { Subject, Observable } from "rxjs";
import { MoreInformation } from "../model/moreInformation.model";
import { ImportToolbar } from "../model/importToolbar.model";
import { copyforms } from "../model/copytoolbar";
import { defaultToolbar } from "../model/defaultToolbar.model";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Injectable({
  providedIn: "root",
})
export class ToolbarlistService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  su: login;
  formData = new toolbar();
  constructor(private http: HttpClient,private encrptdecrpt:EncryptDecryptService) { }
  gettoolbarlist(projectId): Observable<toolbar[]> {
    var toollist = new toolbar();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    console.log(this.su.user_id);
    toollist.user_id = this.su.user_id;
    toollist.project_id = projectId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<toolbar[]>(
      this.APIBaseUrl + "toolbar/get_project_toolbar_list",
      {...toollist,token}
    );
  }

  createToolbar(
    projectId,
    toolbarName,
    uuid,
    date
  ): Observable<CreateToolbar[]> {
    console.log(projectId, toolbarName, uuid, date);
    var toolbarCreateData = new CreateToolbar();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    toolbarCreateData.user_id = this.su.user_id;
    toolbarCreateData.project_id = projectId;
    toolbarCreateData.toolbar_name = toolbarName;
    toolbarCreateData.toolbar_id = this.su.user_id + "-" + uuid + "-" + date;
    toolbarCreateData.created_date=createdDate;
    toolbarCreateData.last_updated_date=createdDate;
    toolbarCreateData.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<CreateToolbar[]>(
      this.APIBaseUrl + "toolbar/create_toolbar",
      {...toolbarCreateData,token}
    );
  }

  getProjectAllTag(projectId): Observable<CreateToolbar[]> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var getAllProjectToolbarTagData = new CreateToolbar();
    getAllProjectToolbarTagData.user_id = this.su.user_id;
    getAllProjectToolbarTagData.project_id = projectId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<CreateToolbar[]>(
      this.APIBaseUrl + "toolbar/get_project_toolbar_tags",
      {...getAllProjectToolbarTagData,token}
    );
  }

  renametoolbarName(toolbarId, toolbarName): Observable<CreateToolbar[]> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var getToolbarReName = new CreateToolbar();
    let createdDate = new Date().toISOString();
    getToolbarReName.user_id = this.su.user_id;
    getToolbarReName.toolbar_id = toolbarId;
    getToolbarReName.toolbar_name = toolbarName;
    getToolbarReName.created_date=createdDate;
    getToolbarReName.last_updated_date=createdDate;
    getToolbarReName.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    console.log(this.APIBaseUrl + "toolbar/rename_toolbar", getToolbarReName);
    return this.http.post<CreateToolbar[]>(
      this.APIBaseUrl + "toolbar/rename_toolbar",
      {...getToolbarReName,token}
    );
  }

  toolbarTag(toolbarId): Observable<CreateToolbar[]> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var getToolbarTags = new CreateToolbar();
    // let createdDate = new Date().toISOString();
    getToolbarTags.user_id = this.su.user_id;
    getToolbarTags.toolbar_id = toolbarId;
    // getToolbarTags.created_date=createdDate;
    // getToolbarTags.last_updated_date=createdDate;
    // getToolbarTags.sync_version_uuid="0";
    // getToolbarTags.updated_by_userid=this.su.user_id.toString();
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<CreateToolbar[]>(
      this.APIBaseUrl + "toolbar/get_toolbar_tags",
      {...getToolbarTags,token}
    );
  }

  addTagname(projectId, toolbarId, toolbartagName) {
    var addTagSendData = new CreateToolbar();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    addTagSendData.user_id = this.su.user_id;
    addTagSendData.toolbar_id = toolbarId;
    addTagSendData.toolbar_tag_name = toolbartagName.split(",");
    addTagSendData.project_id = projectId;
    addTagSendData.created_date=createdDate;
    addTagSendData.last_updated_date=createdDate;
    addTagSendData.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    console.log(this.APIBaseUrl + "toolbar/add_toolbar_tag", addTagSendData);
    return this.http.post<any>(
      this.APIBaseUrl + "toolbar/add_toolbar_tag",
      {...addTagSendData,token}
    );
  }

  removeClickTag(toolbarId, toolbarTagId) {
    var receiveRemovetoolbartagData = new CreateToolbar();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    receiveRemovetoolbartagData.user_id = this.su.user_id;
    receiveRemovetoolbartagData.toolbar_id = toolbarId;
    receiveRemovetoolbartagData.toolbar_tag_id = toolbarTagId;
    receiveRemovetoolbartagData.created_date=createdDate;
    receiveRemovetoolbartagData.last_updated_date=createdDate;
    receiveRemovetoolbartagData.sync_version_uuid="0";
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "toolbar/remove_toolbar_tag",
      {...receiveRemovetoolbartagData,token}
    );
  }

  getMoreInformation(toolbarId): Observable<MoreInformation[]> {
    var getMoreInformationData = new MoreInformation();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    getMoreInformationData.user_id = this.su.user_id;
    getMoreInformationData.toolbar_id = toolbarId;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<MoreInformation[]>(
      this.APIBaseUrl + "toolbar/get_toolbar_metrices",
      {...getMoreInformationData,token});
  }

  getAllProjecttoolbarlist(): Observable<MoreInformation[]> {
    var getAllToolbarlist = new MoreInformation();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    getAllToolbarlist.user_id = this.su.user_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<MoreInformation[]>(
      this.APIBaseUrl + "toolbar/get_all_toolbar_list_for_user",
      {...getAllToolbarlist,token}
    );
  }

  importForms(uuidImportFormIds, sourceFormIds) {
    var importToolbarData = new ImportToolbar();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    importToolbarData.user_id = this.su.user_id;
    importToolbarData.source_toolbar_ids_sepearated_by_comma = sourceFormIds;
    importToolbarData.destination_project_id = this.encrptdecrpt.getItem(
      "projectIdlocal"
    );
    importToolbarData.destination_toolbar_ids = uuidImportFormIds;
    importToolbarData.created_date=createdDate;
    importToolbarData.last_updated_date=createdDate;
    importToolbarData.sync_version_uuid="0";
    console.log(this.APIBaseUrl + "toolbar/import_toolbar", importToolbarData)
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "toolbar/import_toolbar",
      {...importToolbarData,token}
    );
  }

  duplicat(new_toolbar_name, project_id, toolbar_id, uuid, date) {
    var dup = new copyforms();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    dup.user_id = this.su.user_id;
    dup.source_project_id = project_id;
    dup.source_toolbar_id = toolbar_id;
    dup.new_toolbar_name = new_toolbar_name;
    dup.destination_project_ids = project_id;
    dup.destination_toolbar_id = this.su.user_id + "-" + uuid + "-" + date;
    dup.created_date=createdDate;
    dup.last_updated_date=createdDate;
    dup.sync_version_uuid="0";
    console.log(this.APIBaseUrl + "toolbar/duplicate_toolbar", dup);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<copyforms[]>(
      this.APIBaseUrl + "toolbar/duplicate_toolbar",
      {...dup,token}
    );
  }

  hide(toolbar_id) {
    var hide = new toolbar();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    hide.user_id = this.su.user_id;
    hide.toolbar_id = toolbar_id;
    hide.is_hidden = true;
    hide.created_date=createdDate;
    hide.last_updated_date=createdDate;
    hide.sync_version_uuid="0";
    console.log(this.APIBaseUrl + "toolbar/hide_or_unhide_toolbar", hide);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "toolbar/hide_or_unhide_toolbar",
      {...hide,token}
    );
  }
  unhide(toolbar_id) {
    var hide = new toolbar();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    hide.user_id = this.su.user_id;
    hide.toolbar_id = toolbar_id;
    hide.is_hidden = false;
    hide.created_date=createdDate;
    hide.last_updated_date=createdDate;
    hide.sync_version_uuid="0";
    console.log(this.APIBaseUrl + "toolbar/hide_or_unhide_toolbar", hide);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "toolbar/hide_or_unhide_toolbar",
      {...hide,token}
    );
  }

  update_toolbar_data(ModelData) {
    return console.log(ModelData);
  }

  createDefaultToolbar(
    uuid,
    date,
    defaultName,
    projectId
  ): Observable<defaultToolbar[]> {
    var createDefaultToolbar = new defaultToolbar();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    createDefaultToolbar.user_id = this.su.user_id;
    createDefaultToolbar.project_id = projectId;
    createDefaultToolbar.toolbar_name = defaultName;
    createDefaultToolbar.toolbar_id = this.su.user_id + "-" + uuid + "-" + date;
    createDefaultToolbar.created_date = createdDate;
    createDefaultToolbar.last_updated_date = createdDate;
    createDefaultToolbar.sync_version_uuid = "0";
    console.log(
      this.APIBaseUrl + "toolbar/create_toolbar",
      createDefaultToolbar
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<defaultToolbar[]>(
      this.APIBaseUrl + "toolbar/create_toolbar",
      {...createDefaultToolbar,token}
    );
  }

  loaderActivated = new EventEmitter<any>();
  //  getProjectName(projectId):Observable<toolbar[]>{
  //   var getInformation = new toolbar();
  //   this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  //   getInformation.user_id = this.su.user_id;
  //   getInformation.project_id = projectId;
  //   return this.http.post<toolbar[]>(this.APIBaseUrl+'dashboard/get_basic_project_info',getInformation);
  //  }

  private refreshNeed$ = new Subject<any>();

  get _refreshNeed$() {
    return this.refreshNeed$;
  }

  private _listners = new Subject<any>();
  listen(): Observable<any> {
    return this._listners.asObservable();
  }
  filter(filterBy: string) {
    this._listners.next(filterBy);
  }
}
