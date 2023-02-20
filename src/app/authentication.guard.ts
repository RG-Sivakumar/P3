import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthguardServiceService } from './authguard-service.service';
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from './commonshared/services/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  readonly APIBaseUrl = environment.APIBaseUrl;
  constructor(private Authguardservice: AuthguardServiceService, private router: Router, private http: HttpClient,
    private encrptdecrpt:EncryptDecryptService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.Authguardservice.gettoken()) {
      // localStorage.setItem("returnUrl", state.url);
      this.encrptdecrpt.setItem("returnUrl",state.url);//security
      //this.router.navigateByUrl("/login", { queryParams: { returnUrl: state.url } });
      this.router.navigate(['projectmanagement/login'], { queryParams: { returnUrl: state.url } });
    }
    return this.Authguardservice.gettoken();
  }



  getConfirmation(code) {
    console.log(code)
    return this.http.post<any>(environment.APIBaseUrl+"user/user_guide", { user_uuid: code });
  }
}
