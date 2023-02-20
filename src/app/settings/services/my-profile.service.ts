import { Injectable } from "@angular/core";
import { login } from "src/app/projectmanagement/models/login-model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Injectable({
  providedIn: "root",
})
export class MyProfileService {
  readonly APIBaseUrl = environment.APIBaseUrl;
  su: login;

  constructor(private Http: HttpClient,private encrptdecrpt:EncryptDecryptService) { }

  getMyProfile() {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var logindetails = new login();
    logindetails.user_id = this.su.user_id;
    console.log(
      this.APIBaseUrl + "user/get_my_profile",
      logindetails
    );
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<any>(
      this.APIBaseUrl + "user/get_my_profile",
      {...logindetails,token}
    );
  }

  updateProfile(firstName, lastName, email, password): Observable<login[]> {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var updateProfileDetails = new login();
    updateProfileDetails.user_id = this.su.user_id;
    updateProfileDetails.first_name = firstName;
    updateProfileDetails.last_name = lastName;
    updateProfileDetails.email_id = email;
    updateProfileDetails.password = password;
    let token = this.encrptdecrpt.getItem("session_token") || "{}";
    return this.Http.post<login[]>(
      this.APIBaseUrl + "user/update_my_profile",
      {...updateProfileDetails,token,"updated_by_userid":String(this.su.user_id)}
    );
  }
}
