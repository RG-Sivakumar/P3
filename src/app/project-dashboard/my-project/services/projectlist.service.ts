import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { login } from "src/app/projectmanagement/models/login-model";
import { HttpClient } from "@angular/common/http";
import { project } from "../../models/project-model";
import { Subject } from "rxjs";
import { map, catchError, retry } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";
import { ValueService } from "src/app/value.service";
import { project_stub_val } from "../../models/project_stub.model";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { DeleteformComponent } from "src/app/formbuilder/deleteform/deleteform.component";

@Injectable({
  providedIn: "root",
})
export class ProjectlistService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  su: login;
  formData = new project();
  constructor(private http: HttpClient, private uuidService:ValueService,
    private encrptdecrpt:EncryptDecryptService) { }

  getprojectlist(): Observable<any> {
    var projectlist = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    console.log(this.su.user_id);
    projectlist.user_id = this.su.user_id;
    projectlist.start_index = 0;
    projectlist.count = 0;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    console.log(
      this.APIBaseUrl + "project/get_my_project_listing",
      projectlist
    );
    return this.http
      .post<any>(
        this.APIBaseUrl + "project/get_my_project_listing",
        {...projectlist,token}
      )
      .retryWhen((error) => error.delay(500));
  }

  getprojectuserpermission(project_id) {
    var projectlist = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    console.log(this.su.user_id);
    projectlist.current_user_id = this.su.user_id;
    projectlist.project_id = project_id;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http
      .post<any>(
        this.APIBaseUrl + "project/get_project_user_permission",
        {...projectlist,token}
      )
      .retryWhen((error) => error.delay(500));
  }

  createproject(uuid, pro, date) {
    var projects = new project();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    projects.user_id = this.su.user_id;
    projects.project_name = pro;
    projects.project_id = this.uuidService.generateUUID();
    projects.folder_id = this.uuidService.generateUUID();
    projects.created_date = createdDate;
    projects.last_updated_date = createdDate;
    projects.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "project/create_project_web", projects);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/create_project_web",
      {...projects,token} 
    );
  }
  recentproject() {
    var recent = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";

    recent.user_id = this.su.user_id;
    console.log(recent);
    console.log(
      this.APIBaseUrl + "project/get_recent_project_listing",
      recent
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/get_recent_project_listing",
      {...recent,token}
    );
  }
  favouriteproject() {
    var favourite = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    favourite.user_id = this.su.user_id;
    favourite.start_index = 0;
    favourite.count = 0;
    console.log(
      this.APIBaseUrl + "project/get_my_favorite_project_listing",
      favourite
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/get_my_favorite_project_listing",
      {...favourite,token}
    );
  }
  hiddenproject() {
    var hidden = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    hidden.user_id = this.su.user_id;
    hidden.start_index = 0;
    hidden.count = 0;
    console.log(this.APIBaseUrl + "project/get_my_hidden_project_listing",
      hidden
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/get_my_hidden_project_listing",
      {...hidden,token}
    );
  }
  AddFavorite(project_id) {
    var Favorite = new project();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    Favorite.user_id = this.su.user_id;
    Favorite.project_id = project_id;
    Favorite.created_date = createdDate;
    Favorite.last_updated_date = createdDate;
    Favorite.sync_version_uuid = "0";
    console.log(
      this.APIBaseUrl + "project/add_project_to_favorite",
      Favorite
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/add_project_to_favorite",
      {...Favorite,token}
    );
  }
  RemoveFavorite(project_id) {
    var Favorite = new project();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    Favorite.user_id = this.su.user_id;
    Favorite.project_id = project_id;
    Favorite.created_date = createdDate;
    Favorite.last_updated_date = createdDate;
    Favorite.sync_version_uuid = "0";
    console.log(
      this.APIBaseUrl + "project/remove_project_from_favorite",
      Favorite
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "project/remove_project_from_favorite",
      {...Favorite,token}
    );
  }
  Rename(project_id, m: project, duplicateCheckname) {
    var rename = new project();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    rename.user_id = this.su.user_id;
    rename.project_name = duplicateCheckname;
    rename.project_id = project_id;
    rename.created_date = createdDate;
    rename.last_updated_date = createdDate;
    rename.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "project/rename_project", rename);
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "project/rename_project",
      {...rename,token}
    );
  }
  RemoveHide(project_id) {
    var hide = new project();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    hide.user_id = this.su.user_id;
    hide.project_id = project_id;
    hide.created_date = createdDate;
    hide.last_updated_date = createdDate;
    hide.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "project/unhide_the_favorite", hide);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/unhide_the_favorite",
      {...hide,token}
    );
  }
  AddHide(project_id) {
    var hide = new project();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    hide.user_id = this.su.user_id;
    hide.project_id = project_id;
    hide.created_date = createdDate;
    hide.last_updated_date = createdDate;
    hide.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "project/hide_the_favorite", hide);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/hide_the_favorite",
      {...hide,token}
    );
  }
  projectinfo(project_id) {
    var projectinfo = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    projectinfo.user_id = this.su.user_id;
    projectinfo.project_id = project_id;
    console.log(this.APIBaseUrl + "project/get_basic_project_info", projectinfo);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(this.APIBaseUrl + "project/get_basic_project_info", 
    {...projectinfo,token});
  }
  getTag(project_id) {
    var taglist = new project();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    taglist.user_id = this.su.user_id;
    taglist.project_id = project_id;
    taglist.created_date = createdDate;
    taglist.last_updated_date = createdDate;
    taglist.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "project/get_project_tags", taglist);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(this.APIBaseUrl + "project/get_project_tags", {...taglist,token});
  }
  AddTag(project_id, project_tag_name) {
    var tag = new project();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    tag.user_id = this.su.user_id;
    tag.project_tag_name = project_tag_name.split(",");
    tag.project_id = project_id;
    tag.created_date = createdDate;
    tag.last_updated_date = createdDate;
    tag.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "project/add_project_tag", tag);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/add_project_tag",
      {...tag,token} 
    );
  }
  RemoveTag(project_id, project_tag_id) {
    var tag = new project();
    let createdDate = new Date().toISOString();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    tag.user_id = this.su.user_id;
    tag.project_tag_id = Number(project_tag_id);
    tag.project_id = project_id;
    tag.created_date = createdDate;
    tag.last_updated_date = createdDate;
    tag.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "project/remove_project_tag", tag);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/remove_project_tag",
      {...tag,token}
    );
  }
  searchUser(searchs) {
    var search = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    search.user_id = this.su.user_id;
    search.search_keyword = searchs;
    console.log(this.APIBaseUrl + "project/search_users", search);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/search_users",
      {...search,token}
    );
  }
  GetUser(project_id) {
    var user = new project();
    user.project_id = project_id;
    console.log(this.APIBaseUrl + "project/get_project_users", user);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "project/get_project_users",
      {...user,token,"updated_by_userid":String(user_token.user_id)}
    );
  }
  AddUser(project_id, status, userid) {
    let createdDate = new Date().toISOString();
    var user = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    user.current_user_id = this.su.user_id;
    user.user_id = userid;
    user.project_id = project_id;
    user.is_owner_flag = false;
    user.status = status;
    user.created_date = createdDate;
    user.last_updated_date = createdDate;
    user.sync_version_uuid = "0";
    console.log(this.APIBaseUrl + "project/add_user_to_project", user);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/add_user_to_project",
      {...user,token}
    );
  }
  RemoveUser(project_id, userid) {
    var user = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    user.user_id = userid;
    user.current_user_id = this.su.user_id;
    user.project_id = project_id;
    console.log(this.APIBaseUrl + "project/remove_user_from_project", user);
    let token = this.encrptdecrpt.getItem("session_token") || "{}"; 
    return this.http.post<any>(
      this.APIBaseUrl + "project/remove_user_from_project",
      {...user,token}
    );
  }
  AddExternalUser(external: project, project_id) {
    console.log(external);
    var user = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    user.current_user_id = this.su.user_id;
    user.first_name = external.first_name;
    user.last_name = external.last_name;
    user.email_id = external.email_id;
    user.project_id = project_id;
    console.log(this.APIBaseUrl + "project/add_external_user", user);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(this.APIBaseUrl + "project/add_external_user",
    {...user,token});
  }
  AddPermission(project_id, userid, view, edit, admin) {
    var userpermission = new project();
    userpermission.user_id = userid;
    userpermission.project_id = project_id;
    userpermission.user_id = userid;
    userpermission.view_permission_flag = Boolean(view);
    userpermission.edit_permission_flag = Boolean(edit);
    userpermission.admin_permission_flag = Boolean(admin);
    console.log(
      this.APIBaseUrl + "project/update_permission_for_project",
      userpermission
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/update_permission_for_project",
      {...userpermission,token,"updated_by_userid":String(user_token.user_id)} 
    );
  }

  getProjectAllTag() {
    var getAllTagSendData = new project();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    getAllTagSendData.user_id = this.su.user_id;
    console.log(
      this.APIBaseUrl + "project/get_all_projects_tags",
      getAllTagSendData
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<any>(
      this.APIBaseUrl + "project/get_all_projects_tags",
      {...getAllTagSendData,token} 
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

  supportRequestSend(statusRequest) {
    console.log(statusRequest);
    console.log(this.APIBaseUrl + "folder/support_submit_request", statusRequest);
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}"; 
    return this.http.post<any>(this.APIBaseUrl + "folder/support_submit_request", 
    {...statusRequest,token}
    );
  }

  displayImages() {
    var obj = {
      file: "https://plannotate3devbucket.s3.amazonaws.com/Documents/1-0d5d5750-f430-11ea-b88e-49a61349c1b2-1599829780802/1-0d5d5750-f430-11ea-b88e-49a61349c1b2-1599829780802_6-DCB4C2BE-AEE4-425C-BE74-D430F42E12E6-1600497513428_page1.png",
      key1: "C9zKeDLsNtvnIwO4y2J0ix3hP5oRYEgSb6QcTkWHZfqFrUjBpmdGuXV78AlaM1",
      key2: "2nDcvrB5YX8zus@%Gsh%q2wMAcqZFP"
    }
    console.log("http://localhost:3002/planotate30/api/v2/getfile", obj);
    return this.http.post<any>("http://localhost:3002/planotate30/api/v2/getfile", obj);
  }

  create_stub_reference_api(projectId,stubId,stubName):Observable<project_stub_val[]>{
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let stub_input = new project_stub_val();
    stub_input.project_id = projectId;
    stub_input.stub_id = stubId;
    stub_input.stub_name = stubName;
    stub_input.user_id = this.su.user_id;
    stub_input.created_date = new Date().toISOString();
    delete stub_input.updated_by_userid;
    console.log(this.http.post<project_stub_val[]>(this.APIBaseUrl+"annotation/add_annotation_stub_name",stub_input))
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.http.post<project_stub_val[]>(this.APIBaseUrl+"annotation/add_annotation_stub_name",
    {...stub_input,token});
  }
}