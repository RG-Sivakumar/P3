import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { login } from "src/app/projectmanagement/models/login-model";
import { LoginService } from "src/app/projectmanagement/services/login.service";
import { AttachmentfileComponent } from "../../attachmentfile/attachmentfile.component";
import { ProjectlistService } from "../../my-project/services/projectlist.service";
import { ConfirmpopupComponent } from "../confirmpopup/confirmpopup.component";
import { environment } from "src/environments/environment.prod";
import { DataimageService } from "src/app/dataimage.service";
import { p3version } from 'src/app/models/version-global';
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
// import { NgxZendeskWebwidgetService } from "ngx-zendesk-webwidget";

@Component({
  selector: "app-support-request",
  templateUrl: "./support-request.component.html",
  styleUrls: ["./support-request.component.css"],
})

export class SupportRequestComponent implements OnInit {
  firstName: any;
  lastName: any;
  Email: any;
  DetailedDescription: any;
  Subject: any;
  Telephone: any
  diasableTag: boolean;
  requestResponce: any;
  su: login;
  requiredCheck: string;
  requiredCheck1: string;
  requiredCheck2: string;
  uploadDatas:any[] = [];
  attachmentURL:any[] = [];
  constructor(
    public router: Router, public dialog: MatDialog,
    public service: ProjectlistService,
    private imgdataService: DataimageService,
    private dataService:DataService,
    private encrptdecrpt:EncryptDecryptService
  ) // private _NgxZendeskWebwidgetService: NgxZendeskWebwidgetService
  {
    var UserData = this.encrptdecrpt.getItem("loggedIn");
    console.log(UserData);
    this.Email = UserData.email_id;
    this.firstName = UserData.first_name;
    this.firstName = this.dataService.changeSpecialtoKeyFormat(this.firstName);
    this.lastName = UserData.last_name;
    this.lastName = this.dataService.changeSpecialtoKeyFormat(this.lastName);
  }
  clickarrow() {
    this.router.navigateByUrl("/projectdashboard/support");
  }
  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  RequestSubmit() {
    console.log('request function');
    this.requestResponce = "";
    if (this.firstName == "" || this.lastName == "" || this.Email == "" || this.DetailedDescription == "" || this.Subject == "" || this.Telephone == "" || this.DetailedDescription == undefined || this.Subject == undefined || this.Telephone == undefined) {
      if (this.Telephone == "" || this.Telephone == undefined) {
        this.requiredCheck = "requiredClass";
        this.requiredCheck1 = ""
        this.requiredCheck2 = ""
      } else if (this.Subject == "" || this.Subject == undefined) {
        this.requiredCheck = ""
        this.requiredCheck2 = ""
        this.requiredCheck1 = "requiredClass";
      } else if (this.DetailedDescription == "" || this.DetailedDescription == undefined) {
        this.requiredCheck = ""
        this.requiredCheck1 = ""
        this.requiredCheck2 = "requiredClass";
      }
    } else {
      this.requiredCheck = ""
      this.requiredCheck1 = ""
      this.requiredCheck2 = ""
      // var statusRequest = {
      // "user_id":this.su.user_id,
      // "data": {
      //   "ticket": {
      //     "subject": this.Subject,
      //     "comment": {
      //       "body": this.DetailedDescription
      //     },
      //     "priority": "urgent"
      //   }
      // }
      let imagelist = "";
      for(let image=0;image<this.attachmentURL.length;image++){
        let imgurlTemp = this.attachmentURL[image];
        this.attachmentURL[image] = environment.APIBaseUrl + "get_web_singed_file?file=" + imgurlTemp + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        if(imagelist==""){
          imagelist = this.attachmentURL[image]
        }
        else{
          imagelist += '<br><br>' + this.attachmentURL[image];
        }
      }
      // let createImageTemplate = '[Version:3.0.5][Date:'+new Date().toISOString()+'] ';
      let createImageTemplate = '[Version:'+p3version.versionNumber+'][Date:'+new Date().toISOString()+'] ';
      this.DetailedDescription = this.dataService.changeFormat(this.DetailedDescription);
      if(imagelist!=""){
        createImageTemplate += this.DetailedDescription;
        createImageTemplate +='<br><br> Attachments :<br>' +imagelist; 
      }
      else{
        createImageTemplate += this.DetailedDescription;
      }
      console.log(this.DetailedDescription);
      
      this.Subject = this.dataService.changeFormat(this.Subject);
      var statusRequest = {
        "data": {
          "subject": this.Subject,  
          "comment": createImageTemplate,
        },
        "user_id": this.su.user_id,
      }
      // }
      this.service.supportRequestSend(statusRequest).subscribe((res) => {
        this.Telephone = "";
        this.Subject = "";
        this.DetailedDescription = "";
        var status = res.response_code;
        console.log(res);
        const dialgoConfig = new MatDialogConfig();
        dialgoConfig.disableClose = true;
        dialgoConfig.autoFocus = true;
        let dialogref = this.dialog.open(ConfirmpopupComponent, {
          width: "450px",
          panelClass: "my-class",
        });
        if(res["response_code"]==200){
          this.uploadDatas = [];
          createImageTemplate = "";
          this.attachmentURL = [];
        }
        // this.requestResponce = res.response_message
      });
    }
  }

  openUploadBox() {
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    let dialogref = this.dialog.open(AttachmentfileComponent, {
      panelClass: "my-class",
    }).afterClosed().subscribe((data)=>{
      if(data!=undefined){
        let pathValue = [];
        this.uploadDatas = data;
        for(let i=0;i<data.length;i++){
          pathValue.push(data[i].path); 
        }
        this.attachmentURL = pathValue;
      }
    });
  }

  removeTag(index){
    if(this.uploadDatas.length>0){
      this.uploadDatas.splice(index,1);
      let pathValue = [];
        for(let i=0;i<this.uploadDatas.length;i++){
          pathValue.push(this.uploadDatas[i].path); 
        }
        this.attachmentURL = pathValue;
    }
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.DetailedDescription = changeUpperCaseProjectName;
    }
  }

  firstLetterCapital1(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.Subject = changeUpperCaseProjectName;
    }
  }
}