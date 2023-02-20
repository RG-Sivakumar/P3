import { Component,Inject, OnInit } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../services/login.service";
import { ConfirmpopupComponent } from "./confirmpopup/confirmpopup.component";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.component.html",
  styleUrls: ["./forgotpassword.component.css"],
})
export class ForgotpasswordComponent implements OnInit {
  externalUserEmail: any;
  responseMessage: any;
  show = true;
  err_message: string;
  errBlock: boolean = false;
  block: boolean = false;
  constructor(
    public dialogbox: MatDialogRef<ForgotpasswordComponent>,
    private router: Router,
    public service: LoginService,
    private dialog: MatDialog,
    private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.resetForm();
  }

  ngOnInit(): void {
    this.externalUserEmail = this.data.Email;
     if(this.externalUserEmail==undefined){
      this.externalUserEmail="";
     }
   }
  close() {
    this.dialogbox.close();
  }
  onSubmit(form: NgForm) {
    let regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (
      form.value.email_id == "" ||
      form.value.email_id == undefined ||
      regexp.test(form.value.email_id) == false
    ) {
      this.block = true;
      this.errBlock = true;
      this.err_message = "Please enter a valid email address.";
    } else {
      // localStorage.setItem("APIBaseUrl", environment.APIBaseUrl);
      this.encrptdecrpt.setItem("APIBaseUrl",environment.APIBaseUrl);//security
      if (form.value.email_id.includes("@wje.com")) {
        this.dialogbox.close();
        const dialgoConfig = new MatDialogConfig();
        dialgoConfig.disableClose = true;
        dialgoConfig.autoFocus = true;
        dialgoConfig.width = "100%";
        let dialogRef = this.dialog.open(ConfirmpopupComponent, {
          panelClass: "class",
          width: "600px",
          data: {
            message: "WJE Employees must contact the IT department to reset their network password."
          }
        });
        this.resetForm();
      }
      else {
        this.service.ForgotPassword(form.value.email_id).subscribe((res) => {
          var status = res["response_code"];
          this.block = false;
          this.errBlock = false;
          console.log( this.responseMessage)
          if (status == 200) {
            this.dialogbox.close();
            const dialgoConfig = new MatDialogConfig();
            dialgoConfig.disableClose = true;
            dialgoConfig.autoFocus = true;
            dialgoConfig.width = "100%";
            let dialogRef = this.dialog.open(ConfirmpopupComponent, {
              panelClass: "class",
              width: "600px",
              data: {
                message: "Please check your email for instructions on how to reset your password."
              }
            });
            this.resetForm();
          }
          else{
            this.responseMessage ="You have entered an incorrect email address. Please try again.";
          }
        });
      }
    }
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
}
