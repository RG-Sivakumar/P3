import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { externalUser } from "../models/externaluser-model";
import { HttpClient } from "@angular/common/http";
import { login } from "../models/login-model";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Injectable({
  providedIn: "root",
})
export class ExternaluserService {
  formData = new externalUser();
  su: login;
  readonly APIBaseUrl = environment.APIBaseUrl;
  // readonly APIBaseUrl = "";
  constructor(private http: HttpClient,private encrptdecrpt:EncryptDecryptService) { }

  acceptInvitation(
    key,
    emailid,
    NewPassword,
    firstname,
    lastname
  ): Observable<any> {
    var user = new externalUser();
    {
      user.email_id = emailid;
      user.new_password = NewPassword;
      user.invitation_key = key;
      user.first_name = firstname;
      user.last_name = lastname;
    }
    return this.http.post<any>(
      this.APIBaseUrl + "project/accept_external_user_invitation",
      user
    );
  }

  isAlreadyUsedOrNot(key,emailId){
    var userCheckInorNot = new externalUser();
    userCheckInorNot.invitation_key = key;
    userCheckInorNot.email_id = emailId;
    return this.http.post<externalUser>(this.APIBaseUrl + "project/get_external_url_status",userCheckInorNot);
  }

  Useradd(users: externalUser) {
    var user = new externalUser();
    {
      user.first_name = users.first_name;
      user.last_name = users.last_name;
      user.email_id = users.email_id;
      user.project_id = users.project_id;
      console.log(this.APIBaseUrl + "project/add_external_user", user);
      let token = this.encrptdecrpt.getItem("session_token") || "{}";
      let user_token = this.encrptdecrpt.getItem("loggedIn") || "{}";
      return this.http.post<externalUser>(
        this.APIBaseUrl + "project/add_external_user",
        {...user,token}
      );
    }
  }

  passwordReset(key, email, id, password) {
    var user = new externalUser();
    {
      user.user_id = Number(id);
      user.email_id = email;
      user.reset_key = key;
      user.new_password = password;
      return this.http.post<externalUser>(
        this.APIBaseUrl + "user/change_password",
        user
      );
    }
  }
}
