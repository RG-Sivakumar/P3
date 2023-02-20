import { Component, OnInit } from "@angular/core";
import { ExternaluserService } from "../services/externaluser.service";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-resetpassword",
  templateUrl: "./resetpassword.component.html",
  styleUrls: ["./resetpassword.component.css"],
})
export class ResetpasswordComponent implements OnInit {
  constructor(
    public service: ExternaluserService,
    private route: ActivatedRoute,
    private encrptdecrpt:EncryptDecryptService
  ) { }
  key: any;
  newPassword: any;
  confirmPassword: any;
  id: any;
  emailId: any;
  show = true;
  hide = false;
  error = false;
  showPassword = false;
  showPassword1 = false;
  overlay: boolean;
  ngOnInit(): void {
    // localStorage.removeItem("rememberMe");
    this.encrptdecrpt.removeItem("rememberMe");//security
    // localStorage.removeItem("loggedIn");
    this.encrptdecrpt.removeItem("loggedIn");//security
    this.key = this.route.snapshot.queryParamMap.get("key");
    this.id = this.route.snapshot.queryParamMap.get("id");
    this.emailId = this.route.snapshot.queryParamMap.get("email");
  }
  fieldTextType: boolean;
  passwordonClick() {
    this.fieldTextType = !this.fieldTextType;
    this.showPassword = true;
  }
  passwordoffClick() {
    this.fieldTextType = !this.fieldTextType;
    this.showPassword = false;
  }
  fieldTextType1: boolean;
  passwordonClick1() {
    this.fieldTextType1 = !this.fieldTextType1;
    this.showPassword1 = true;
  }
  passwordoffClick1() {
    this.fieldTextType1 = !this.fieldTextType1;
    this.showPassword1 = false;
  }
  reset_password() {
    // localStorage.setItem("APIBaseUrl", environment.APIBaseUrl);
    this.encrptdecrpt.setItem("APIBaseUrl",environment.APIBaseUrl);//security
    this.service
      .passwordReset(this.key, this.emailId, this.id, this.newPassword)
      .subscribe((data) => {
        var status = data["response_code"];

        if (status == 200) {
          this.show = false;
          this.hide = true;
        } else {
          this.error = true;
          this.show = false;
          this.hide = false;
        }
      });
  }
}
