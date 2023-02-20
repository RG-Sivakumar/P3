import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { LoginService } from "../services/login.service";
import { NgForm } from "@angular/forms";
import { DeviceDetectorService } from "ngx-device-detector";
import {
  MatDialogConfig,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { ForgotpasswordComponent } from "../forgotpassword/forgotpassword.component";
import { ActivatedRoute, Router } from "@angular/router";
import { number } from "ngx-custom-validators/src/app/number/validator";
import { login } from "../models/login-model";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { UtilsService } from "src/app/shared/UtilsService";
import {ExternaluserpopupComponent} from "src/app/projectmanagement/externaluserpopup/externaluserpopup.component";
import * as settingsvalues from '../../commonshared/services/encrypt-settings'
@Component({
  selector: "app-userlogin",
  templateUrl: "./userlogin.component.html",
  styleUrls: ["./userlogin.component.css"],
})
export class UserloginComponent implements OnInit, AfterViewInit {
  showPassword = false;
  recoverform: any;
  show = false;
  overlay = false;
  responseMessage: string;
  remember = false;
  latitude: any;
  longitude: any;
  theCheckbox = false;
  deviceInfo: any;
  versionBrowswe: any;
  platformName: any;
  hidemessage: boolean = false;
  err_message: string;
  su: login;
  block: boolean = false;
  errBlock: boolean = false;
  // rememberMe = this.encrptdecrpt.getItem("rememberMe");
  // localvalue = this.encrptdecrpt.getItem("loggedIn");
  rememberMe = this.encrptdecrpt.getItem("rememberMe");//security;
  localvalue = this.encrptdecrpt.getItem("loggedIn");//security;
  rm: boolean;
  signInbuttonDis: boolean = false;
  setBaseIconSize: any = {
    setBaseIconSizeHeight: "50",
    setBaseIconSizeWidth: "50",
    setBaseIconPagesAllowed: [],
  };
  setScale: any = [];
  returnUrl: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public service: LoginService,
    private deviceService: DeviceDetectorService,
    private dialog: MatDialog,
    private encrptdecrpt:EncryptDecryptService,
    private utilService:UtilsService
  ) {
    this.epicFunction();
    // localStorage.setItem("scale", JSON.stringify(this.setScale));
    // localStorage.setItem("setBaseiconSize",JSON.stringify(this.setBaseIconSize));
    this.encrptdecrpt.setItem("setBaseiconSize",this.setBaseIconSize);//security
    this.rememberMe = this.encrptdecrpt.getItem("rememberMe");//security;
    this.localvalue = this.encrptdecrpt.getItem("loggedIn");//security;
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
  username() { }
  @ViewChild("password") passwordValue: ElementRef;
  @ViewChild("email_id") emailValue: ElementRef;

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'projectdashboard/myproject';
    console.log(this.returnUrl);
    if (
      this.service.formData.email_id == undefined ||
      this.service.formData.password == undefined ||
      this.service.formData.email_id == "" ||
      this.service.formData.password == "" ||
      this.service.formData.password.length == 0 ||
      this.service.formData.email_id.length == 0
    ) {
      this.errBlock = false;
      this.signInbuttonDis = true;
    }
    var username = this.encrptdecrpt.getItem("email_id");//security;
    if (username != null) {
      this.service.formData.email_id = username;
    }
    if (this.rememberMe == "true") {
      this.router.navigateByUrl("projectdashboard/myproject");
    }
    this.service.getPosition().then((pos) => {
      this.latitude = pos.lat;
      this.longitude = pos.lng;
    });
  }

  ngAfterViewInit() {
  }
  epicFunction() {
    //
    this.deviceInfo = this.deviceService.getDeviceInfo();
    // const isMobile = this.deviceService.isMobile();
    // const isTablet = this.deviceService.isTablet();
    // const isDesktopDevice = this.deviceService.isDesktop();
    this.platformName = this.deviceInfo.browser;
    this.versionBrowswe = this.deviceInfo.browser_version;
    //
    //
    //
  }
  toggleVisibility(e) {
    this.remember = e.target.checked;
    // localStorage.setItem("rememberMe", JSON.stringify(this.remember));
    this.encrptdecrpt.setItem("rememberMe",this.remember);//security
    //localStorage.setItem("NewrememberMe", JSON.stringify(this.remember));
    // localStorage.setItem(
    //   "username",
    //   JSON.stringify(this.service.formData.email_id)
    // );
  }

  onSubmit(form: NgForm) {  
    // if (this.rm == true) {
    //   localStorage.setItem(
    //     "username",
    //     JSON.stringify(this.service.formData.email_id)
    //   );
    // }
    let regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (form.value.email_id == undefined || form.value.password == undefined) {
      this.errBlock = false;
      this.signInbuttonDis = true;
    } else if (
      form.value.email_id == "" ||
      form.value.email_id == undefined ||
      regexp.test(form.value.email_id) == false
    ) {
      this.block = true;
      this.errBlock = true;
      this.signInbuttonDis = false;
      this.err_message = "Please enter a valid Email Address";
    } else if (form.value.password == "" || form.value.password == undefined) {
      this.errBlock = true;
      this.block = false;
      this.signInbuttonDis = false;
      this.err_message = "Password must be minimum 4 characters";
    } else if (form.value.password.length <= 3) {
      this.errBlock = true;
      this.block = false;
      this.signInbuttonDis = false;
      this.err_message = "Password must be minimum 4 characters";
    } else {
      this.block = false;
      this.overlay = true;
      this.show = true;
      this.errBlock = false;
      this.signInbuttonDis = false;
      // localStorage.setItem("rememberMe", JSON.stringify(this.remember));
      this.encrptdecrpt.setItem("rememberMe",this.remember);//security
      if (this.remember == null) {
        // localStorage.setItem("rememberMe", JSON.stringify(false));
        this.encrptdecrpt.setItem("rememberMe",false);//security
      }
      // localStorage.setItem("email_id", JSON.stringify(form.value.email_id));
      this.encrptdecrpt.setItem("email_id",form.value.email_id);//security
      // localStorage.setItem("APIBaseUrl", environment.APIBaseUrl);
      this.encrptdecrpt.setItem("APIBaseUrl",environment.APIBaseUrl);//security
      this.service
        .UserLogin(
          form.value.email_id,
          form.value.password,
          this.platformName,
          this.versionBrowswe,
          this.latitude,
          this.longitude
        )
        .subscribe((res) => {
          
          let value = form.value.password.split("")
          // localStorage.setItem("user_token", btoa(form.value.password));
          this.encrptdecrpt.setItem("user_token", form.value.password);//security
          // localStorage.removeItem("password");
          this.encrptdecrpt.removeItem("password");//security
          var status = res["response_code"];
          // if (status != 200) {
          // }
          if (status == 200) {
            // localStorage.setItem(
            //   "loggedIn",
            //   JSON.stringify(res["response_body"])
            // );
            let resEncryptString;
            if (form.value.email_id.includes('@wje.com')) {
              resEncryptString = this.encrptdecrpt.decrypt(res["response_body"],settingsvalues.mterasfoktj);
            } else {
              resEncryptString = this.encrptdecrpt.decrypt(res["response_body"],settingsvalues.toeraatpaas);
            }
            let resEncrypt = JSON.parse(resEncryptString) 
            let valid_user_access_token = this.utilService.parseencrypetedkey(form.value.email_id,resEncrypt.user_access_token)
            if(valid_user_access_token !== undefined){
              this.encrptdecrpt.setItem("session_token", valid_user_access_token);//security
              this.encrptdecrpt.setItem("loggedIn", resEncrypt);//security
              this.router.navigateByUrl(this.returnUrl);
              this.resetForm();
            }else{
              this.show = false;
              this.overlay = false;
              this.err_message = "You have entered an incorrect email address or password.  Please try again.";
              this.hidemessage = true;
              this.errBlock = true;
              this.service.formData.password = "";
            }
          }
          else if(status == 202){
            this.externalUserpopup(form.value.email_id);
            this.hidemessage = true;
            this.errBlock = true;
            this.service.formData.password = "";
            this.show = false;
            this.overlay = false;
          }
          else{
            this.show = false;
            this.overlay = false;
            this.err_message = "You have entered an incorrect email address or password.  Please try again.";
            this.hidemessage = true;
            this.errBlock = true;
            this.service.formData.password = "";
          }
        },
          (error) => {
            console.log(error);
            this.show = false;
            this.overlay = false;
            this.hidemessage = true;
            this.errBlock = true;
            this.err_message = "Internal Server Error";
          });
    }
  }
  externalUserpopup(email?) {
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";

    let dialogRef = this.dialog.open(ExternaluserpopupComponent, {
      width: "450px",
      panelClass: "my-class",
      data: {
        Email:email 
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      if(res.data == true){
       this.forgotPassword(email);
      }
    })
  }

  forgotPassword(email?) {
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";

    let dialogRef = this.dialog.open(ForgotpasswordComponent, {
      panelClass: "class",
      data: {
        Email:email 
      }
    });
  }

  resetForm(form?: NgForm) {
    //optional
    if (form != null) form.resetForm();
    this.service.formData = {
      email_id: "",
      password: "",
      first_name: "",
      last_name: "",
      last_loggedin_platform_type: "",
      last_loggedin_platform_name: "",
      last_loggedin_platform_version: 0,
      last_loggedin_gps_latitude: 0,
      last_loggedin_gps_longitude: 0,
      user_id: 0,
      user_access_token:""
    };
  }

  errorMessageTrigger(email, password) {
    if (password != null) {
      if (email.length > 0 && password.length) {
        // this.errBlock = false;
        this.signInbuttonDis = false;
      } else {
        this.errBlock = false;
        this.signInbuttonDis = true;
      }
    }
  }

  disableRightClick() {
    return false
  }
}
