import { Injectable, EventEmitter } from "@angular/core";
import { login } from "../models/login-model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { UtilsService } from "src/app/shared/UtilsService";
import * as settingsvalues from '../../commonshared/services/encrypt-settings'
import { settings } from "cluster";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  formData = new login();
  readonly APIBaseUrl = environment.APIBaseUrl;
  constructor(private http: HttpClient,private encrptdecrpt:EncryptDecryptService, private utilService:UtilsService) { 

  }

  UserLogin(
    emailid,
    password,
    platform_name,
    platform_version,
    lat,
    lon
  ): Observable<any> {
    var endUrl;
    let user = new login();
    {
      (user.email_id = emailid),
        (user.password = password),
        (user.last_loggedin_platform_type = "web"),
        (user.last_loggedin_platform_name = platform_name),
        (user.last_loggedin_platform_version = platform_version),
        (user.last_loggedin_gps_latitude =
          user.last_loggedin_gps_latitude == undefined ? 0 : lat),
        (user.last_loggedin_gps_longitude =
          user.last_loggedin_gps_longitude == undefined ? 0 : lon);
      // (user.last_loggedin_gps_latitude = lat),
      // (user.last_loggedin_gps_longitude = lon);
      // (user.last_loggedin_gps_latitude = 34.052235),
      // (user.last_loggedin_gps_longitude = 118.243683);
    }
    if (user.email_id.includes("@wje.com")&&environment.APIBaseUrl=="https://api.plannotate3.com:3002/planotate30/api/v2/") {
      endUrl = "user/user_login_wje_v2"
    } 
    else {
      // endUrl = "user/user_login"
      endUrl = "user/user_login_v2"
    }
    user.user_access_token = this.utilService.findencrypetedkey(user.email_id)

    if (user.email_id.includes('@wje.com')) {
      user.password = this.encrptdecrpt.encrypt(user.password,settingsvalues.mterasfoktj);
    } else {
      user.password = this.encrptdecrpt.encrypt(user.password,settingsvalues.toeraatpaas);
    }

    // console.log(user.password);
    console.log(environment.APIBaseUrl + endUrl, user, {observe: "response"});
    let encryptLoginData;
    if (user.email_id.includes('@wje.com')) {
      encryptLoginData = this.encrptdecrpt.encrypt(user,settingsvalues.mterasfoktj);
    } else {
      encryptLoginData = this.encrptdecrpt.encrypt(user,settingsvalues.toeraatpaas);
    }
    return this.http.post<any>(environment.APIBaseUrl + endUrl,{"U2FsdGVkX1+Nc50uJo1fDvIcH/IJcruHaEMqk8IANqk=":encryptLoginData});
  }

  ForgotPassword(emailid): Observable<any> {
    var user = new login();
    {
      user.email_id = emailid;
    }
    console.log(user);
    console.log(this.APIBaseUrl + "user/forgot_password", user, {
      observe: "response",
    });
    return this.http.post<any>(
      this.APIBaseUrl + "user/forgot_password",
      user
    );
  }
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  routeChange = new EventEmitter<any>();

  updateStatus(status: string) {
    console.log(status);
  }
}
