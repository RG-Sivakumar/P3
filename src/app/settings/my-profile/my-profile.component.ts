import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { MyProfileService } from "../services/my-profile.service";
import { Router } from "@angular/router";
import { EventGlobalService } from "src/app/event-global.service";
// import { Pipe } from '@angular/core';
import { HeadertitleService } from "src/app/headertitle.service";
import { last } from "rxjs/operators";
import { ValueService } from "src/app/value.service";
import { DataService } from "src/app/data.service";
import { MatDialog } from "@angular/material/dialog";
import { ProfilePopupComponent } from "./profile-popup/profile-popup.component";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

// @Pipe({
//   name: 'filter'
// })

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.css"],
})
export class MyProfileComponent implements OnInit {
  loggedin = this.encrptdecrpt.getItem("loggedIn");
  firstName: string = "";
  lastName: string = "";
  emailAddress: string = "";
  passwordReceive: string = this.encrptdecrpt.getItem("user_token");
  firstNameEdit: boolean = true;
  LastNameEdit: boolean = true;
  passwordEdit: boolean = true;
  message: string;
  spinner: boolean = false;
  editOptionDisabled: boolean = false;
  passwordCount: string = "";
  @ViewChild("firstNameValue") myInput: ElementRef;
  @ViewChild("lastNameValue") myInput1: ElementRef;
  @ViewChild("passwordValue") myInput2: ElementRef;
  first_name: string;
  last_name: string;
  passwordChange: string;
  submitButtonAction: boolean = true;
  passwordcount:number = 0;
  origin_token:string = "";

  constructor(
    private myprofileservice: MyProfileService,
    public router: Router,
    private eventsService: EventGlobalService,
    private headerService: HeadertitleService,
    private dataService:DataService,
    public dialogBox: MatDialog,
    private encrptdecrpt:EncryptDecryptService
  ) {
    if (this.loggedin === null) {
      this.router.navigateByUrl("projectmanagement/login");
    }
    this.myprofileservice.getMyProfile().subscribe((res) => {
      console.log(res);
      this.first_name = res["response_body"].first_name;
      this.last_name = res["response_body"].last_name;
      this.first_name = this.dataService.changeSpecialtoKeyFormat(this.first_name);
      this.last_name = this.dataService.changeSpecialtoKeyFormat(this.last_name);
      this.emailAddress = res["response_body"].email_id;
      // this.emailAddress='ganesh@wje.com';
      console.log(this.emailAddress)
      var checkEmail = this.emailAddress.split("@");
      if (checkEmail[1].toLowerCase() == "wje.com") {
        this.editOptionDisabled = true;
      }
      console.log(res["response_body"].password);
      console.log(this.firstName);
    });
    this.passwordReceive = this.encrptdecrpt.getItem("user_token");
    this.passwordReceive = this.dataService.changeSpecialtoKeyFormat(this.passwordReceive);
    // store the password place
    this.origin_token = this.passwordReceive;
    this.passwordcount = this.passwordReceive.length;
    for (var i = 0; i < this.passwordReceive.length; i++) {
      this.passwordCount = this.passwordCount + " ";
      console.log(this.passwordCount);
      console.log(this.passwordCount.length);
    }
  }
  ngOnInit(): void {
    this.headerService.setTitle("My Profile");
  }

  focusInputFirstName() {
    this.firstNameEdit = false;
    this.myInput.nativeElement.focus();
  }

  againHideFirst() {
    this.firstNameEdit = true;
  }

  focusInputLastName() {
    this.LastNameEdit = false;
    this.myInput1.nativeElement.focus();
  }

  againHideLast() {
    this.LastNameEdit = true;
  }
  focusInputpassword() {
    this.passwordEdit = false;
    this.myInput2.nativeElement.focus();
  }

  againHidepassword() {
    this.passwordEdit = true;
    this.passwordCount = "";
    for (var i = 0; i < this.origin_token.length; i++) {
      this.passwordCount = this.passwordCount + " ";
      console.log(this.passwordCount);
      console.log(this.passwordCount.length);
    }
  }

  passwordLength: boolean = false;

  formSubmit(firstNameValue, lastNameValue, email,dummy) {
    let password = this.origin_token;
    if (firstNameValue == "" || firstNameValue == undefined) {
      const dialogRef = this.dialogBox.open(ProfilePopupComponent, {
        data: {
         firstname : true,
         lastname : false,
         password : false
        }
      }
      )
    }
  else if (lastNameValue == "" || lastNameValue == undefined) {
      const dialogRef = this.dialogBox.open(ProfilePopupComponent, {
        data: {
         firstname : false,
         lastname : true,
         password : false
        }
      }
      )
  }
  else  if (password.length <= 3 || password == "" || password == undefined) {
      // this.passwordLength = true;
      password = this.passwordReceive;
      const dialogRef = this.dialogBox.open(ProfilePopupComponent, {
        data: {
         firstname : false,
         lastname : false,
         password : true
        }
      }
      )
    } else {
      this.passwordLength = false;
      console.log(firstNameValue, lastNameValue, email, password);
      // var a = localStorage.setItem("user_token", btoa(password));
      var a = this.encrptdecrpt.setItem("user_token",password);//security;
      // localStorage.removeItem("password");
      this.encrptdecrpt.removeItem("password");//security
      console.log(a);
      this.spinner = true;
      firstNameValue = this.dataService.changeFormat(firstNameValue);
      lastNameValue = this.dataService.changeFormat(lastNameValue);
      password = this.dataService.changeFormat(password);
      this.myprofileservice
        .updateProfile(firstNameValue, lastNameValue, email, password)
        .subscribe((res) => {
          this.submitButtonAction = true;
          console.log(res);
          this.spinner = false;
          this.first_name = res["response_body"].first_name;
          this.first_name = this.dataService.changeSpecialtoKeyFormat(this.first_name);
          this.last_name = res["response_body"].last_name;
          this.last_name = this.dataService.changeSpecialtoKeyFormat(this.last_name);
          this.passwordCount = "";
          this.passwordReceive = this.encrptdecrpt.getItem("user_token");
          for (var i = 0; i < this.passwordReceive.length; i++) {
            this.passwordCount = this.passwordCount + " ";
            console.log(this.passwordCount);
          }
        });
    }
  }

  firstNameValueFunc(firstNamevalue, lastNamevalue) {
    console.log("yes");
  }
  lastNameValueFunc(firstNamevalue, lastNamevalue, passwordValue) {
    console.log("yes");
  }
  passwordValueFunc(firstNamevalue, lastNamevalue, passwordValue) {
    console.log("yes");
  }

  checkSpecialChar(){
    this.first_name = this.dataService.changeFormat(this.first_name);;
  }

  checkSpecialCharLast(){
    this.last_name = this.dataService.changeFormat(this.last_name);
  }

  passwordenteredfield(pass_word){
    console.log(this.passwordCount)
    console.log(pass_word)
    this.passwordCount = "";
    this.origin_token = pass_word;
  }
}
