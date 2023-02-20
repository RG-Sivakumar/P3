import { Component, Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { empty, EmptyError } from 'rxjs';
import { login } from 'src/app/projectmanagement/models/login-model';
import { AlertmessageComponent } from '../alertmessage/alertmessage.component';
import { CreateDocumentService } from '../services/create-document.service';
import { v1 as uuidv1 } from "uuid";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";
import { DataimageService } from 'src/app/dataimage.service';
import { ValueService } from 'src/app/value.service';
import {SuccessComponent} from '../success/success.component';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { FormlistpopupComponent } from '../formlistpopup/formlistpopup.component';
import { FormlistService } from 'src/app/formbuilder/services/formlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class Appreport {
  documentidss: string;
  expo: any;
  projectId: any;
  documentDetails: any;
  route: any;
  data1: any;
  loader: boolean = false;
  expo1: any;
  change: boolean;

  constructor(public documentService: CreateDocumentService,private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<Shareoption1Component>) {

  }


  async downloadFile(data, filename = 'data', receiveHeaderData) {
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal")
    this.expo = receiveHeaderData;
    let csvData = this.ConvertToCSV(data, this.expo);
    let replaceData = csvData.replace(/’/g, "'").replace(/“/g, "''");
    let blob = new Blob(['\ufeff' + replaceData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    this.loader = false;
    this.dialogRef.close();
  }
  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = '';

    for (let index in headerList) {

      row += headerList[index] + ',';
    }

    row = row.slice(0, -1)

    str += row + '\n';
    if (!array || !array.length) {
      return;
    }

    for (let i = 0; i < array.length; i++) {

      let line = '' + '';

      for (let index in headerList) {
        let head = headerList[index];


        if (array[i][head] == undefined) {
          line += '"' + "" + '",'
        }
        else {
          var regex = /(\w+)\s(\w+)/;
          if (array[i][head].includes("HYPERLINK")) {
            this.data1 = array[i][head].replace("=HYPERLINK(", "");
            let removeDoubtQuotes = array[i][head].split('"');
            this.data1 = removeDoubtQuotes[1];
            line += '=HYPERLINK("' + this.data1 + '")' + ',';
          } else {
            if (array[i][head].includes("[{")) {
              array[i][head] = array[i][head].replace(/"/g, "“");
              line += '' + JSON.stringify(array[i][head]) + ',';
            }
            else {
              line += '"' + array[i][head] + '",';
            }

          }
        }
      }
      line = line.slice(0, -1)
      str += line + '\r\n';
    }
    return str;
  }
}

@Injectable()
export class AppService {
  documentidss: string;
  expo: any;
  projectId: any;
  documentDetails: any;
  route: any;
  data1: any;
  loader: boolean = false;
  expo1: any;
  change: boolean;
  constructor(public documentService: CreateDocumentService,private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<Shareoption1Component>) {

  }


  async downloadFile(data, filename = 'data', receiveHeaderData) {
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    this.expo = receiveHeaderData;
    let csvData = this.ConvertToCSV(data, this.expo);
    let replaceData = csvData.replace(/’/g, "'").replace(/“/g, "''");
    let blob = new Blob(['\ufeff' + replaceData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    this.loader = false;
    this.dialogRef.close();
  }

  async downloadFile1(data, filename = 'data', receiveHeaderData) {
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal")
    this.expo = receiveHeaderData;
    let csvData = this.ConvertToCSV(data, this.expo);
    let replaceData = csvData.replace(/’/g, "'").replace(/“/g, "''");
    let blob = new Blob(['\ufeff' + replaceData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    this.loader = false;
    this.dialogRef.close();
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = '';

    for (let index in headerList) {

      row += headerList[index] + ',';
    }

    row = row.slice(0, -1)

    str += row + '\n';
    if (!array || !array.length) {
      return;
    }

    for (let i = 0; i < array.length; i++) {

      let line = '' + '';

      for (let index in headerList) {
        let head = headerList[index];


        if (array[i][head] == undefined) {
          line += '"' + "" + '",'
        }
        else {
          var regex = /(\w+)\s(\w+)/;
          if (array[i][head].includes("HYPERLINK")) {
            this.data1 = array[i][head].replace("=HYPERLINK(", "");
            let removeDoubtQuotes = array[i][head].split('"');
            this.data1 = removeDoubtQuotes[1];
            line += '=HYPERLINK("' + this.data1 + '")' + ',';


          } else {

            if (array[i][head].includes("[{")) {
              array[i][head] = array[i][head].replace(/"/g, "“");
              line += '' + JSON.stringify(array[i][head]) + ',';
            }
            else {
              line += '"' + array[i][head] + '",';
            }

          }
        }
      }
      line = line.slice(0, -1)
      str += line + '\r\n';
    }
    return str;
  }

}


@Component({
  selector: 'app-shareoption1',
  templateUrl: './shareoption1.component.html',
  styleUrls: ['./shareoption1.component.css'],
  providers: [AppService, Appreport]
})

export class Shareoption1Component implements OnInit, OnDestroy {
  projectId: string;
  expo: any;
  loader: boolean = false;
  expo1: any;
  project_name: any;
  change: boolean;
  su: login;
  export_type:any;
  documentDetails: any;
  
  constructor(public documentService: CreateDocumentService,
    private appService: AppService, public service3: Appreport, 
    public dialog: MatDialog, public dialogRef: MatDialogRef<Shareoption1Component>,
    private httpClient:HttpClient,private imgdataService: DataimageService,public _snackBar:MatSnackBar,
    private valueService:ValueService,private encrptdecrpt:EncryptDecryptService,public services:FormlistService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.documentDetails = this.data.documentDetails;
      console.log
    }

  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  // exportNaveen(){
  //   let object1: any = {"csv_data": [{
      
  //   }
    
  //         console.log(data123);
  //         let getcsvData = data123["csv_data"];
  //         let headerdataValue = data123["csv_header"];
  //         this.loader = true;
  //         this.appService.downloadFile(getcsvData, 'first project', headerdataValue);
  // }
  //Old API for export CSV
  export() {
    this.change = true;
    this.loader = true;
    this.project_name =  this.data.title1
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getreport("", this.projectId, true, processuuid).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        let getUrl = response["response_body"]["csv_url"];
        let addsecretKey = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrl + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        this.httpClient.get(addsecretKey).subscribe((data) => {
          console.log(data);
          let getcsvData = data["csv_data"];
          let headerdataValue = data["csv_header"];
          this.loader = true;
          this.appService.downloadFile(getcsvData, this.project_name, headerdataValue);
        });
      }
      else if (response['response_code'] == 201 || response['response_code'] == 205) {
        this.errorMessagePopup('annotation');
      }
      else{
        this.secondgetReport(processuuid);
      }
    },
    (error)=>{
      console.log(error);
      this.secondgetReport(processuuid);
    });
  }

  exportnew() {
    this.change = true;
    this.loader = true;
    this.export_type="export_project_as_csv";
    this.project_name =  this.data.title1
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getreportnew(this.su.email_id, this.projectId, "", "",this.export_type).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
         console.log("Success");
         this.loader=false;
         var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: {
            status:"true",
            title: "export",
        }
        });
      }
      else{
        console.log("Wrong");
        this.loader=false;
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px', 
          data: { 
            status:"false",
            title: "export"}
        });
        this.dialogRef.close();
      }
    },
    (error)=>{
      console.log(error);
      this.secondgetReport(processuuid);
    });
  }


  secondgetReport(processuuid){
    this.documentService.getreport1(processuuid).subscribe((datasecond)=>{
      console.log(datasecond);
      let getsecondResponse = datasecond["response_code"];
      let getsecondResponsestatus = datasecond["response_body"]["status"];
      if(getsecondResponse==200 && getsecondResponsestatus==1){
        let getResponsevalue = datasecond;
        let getUrl = getResponsevalue["response_body"]["csv_url"];
        let addsecretKey = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrl + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        this.httpClient.get(addsecretKey).subscribe((data) => {
          console.log(data);
          let getcsvData = data["csv_data"];
          let headerdataValue = data["csv_header"];
          this.loader = true;
          this.appService.downloadFile(getcsvData, this.project_name, headerdataValue);
        });
      }
      else if(getsecondResponsestatus==0){
        setTimeout(()=>{
          this.secondgetReport(processuuid);
        },30000);
      }
      else{
        this.errorMessagePopup('servererror');
      }
    },
    (error)=>{
      console.log(error);
      this.errorMessagePopup('servererror');
    });
  }

  errorMessagePopup(platformName){
    this.loader = false;
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    var dialogrefModel = this.dialog.open(AlertmessageComponent, {
      data: { platform: platformName }
    });
  }

  exportreport() {
    this.change = false;
    this.loader = true;
    this.project_name =  this.data.title1
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getcsvreport("", this.projectId, true,processuuid).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        let getUrl = response["response_body"]["csv_url"];
        let addsecretKey = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrl + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        this.httpClient.get(addsecretKey).subscribe((data) => {
          console.log(data);
          let getcsvData = data["csv_data"];
          let headerdataValue = data["csv_header"];
          this.loader = true;
          this.service3.downloadFile(getcsvData, this.project_name, headerdataValue);
        });
      }
      else if (response['response_code'] == 201 || response['response_code'] == 205) {
        this.errorMessagePopup('annotation');
      }
      else{
        this.secondgetReport(processuuid);
      }
    },
    (error)=>{
      console.log(error);
      this.secondgetReport(processuuid);
    });
  }

  exportreportnew() {
    this.change = false;
    this.loader = true;
    this.project_name =  this.data.title1
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.export_type="export_project_report";
    this.documentService.getcsvreportnew(this.su.email_id, this.projectId, "", "",this.export_type).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        console.log("Wrong");
        this.loader=false;
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: { 
            status: "true",
            title:"export",
          }
        });
        this.dialogRef.close()
      }
      else{
        console.log("Wrong");
        this.loader=false;
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: { 
            status: "false",
            title:"export",
          }
        });
        this.dialogRef.close()
      }
    },
    (error)=>{
      console.log(error);
      this.secondgetReport(processuuid);
    });
  }

  pdfexport() {
    this.export_type = "export_project_document_as_pdf_with_links";
    this.loader = true;
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    let get_is_link = false;
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.documentService.getpdfexport(this.su.email_id,this.projectId,"","",this.export_type,get_is_link).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {       
         console.log("Success");                      
         this.loader=false;
         var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: {
            status:"true",
            title: "export",
        }
        });
        this.dialogRef.close();
      }
      else{
        console.log("Wrong");
        this.loader=false;
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: { 
            status:"pdffalse",
            title: "export"}
        });
        this.dialogRef.close();
      }
    },
      (error) => {
        console.log(error);
        this.errorMessagePopup('servererror');
      });
  }

  exportphotos() {
    this.change = false;
    this.loader = true;
    this.project_name =  this.data.title1
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getphotos("", this.projectId, true,processuuid).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        let getUrl = response["response_body"]["csv_url"];
        let addsecretKey = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrl + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        this.httpClient.get(addsecretKey).subscribe((data) => {
          console.log(data);
          let getcsvData = data["csv_data"];
          let headerdataValue = data["csv_header"];
          this.loader = true;
          this.appService.downloadFile1(getcsvData, this.project_name, headerdataValue);
        });
      }
      else if (response['response_code'] == 201 || response['response_code'] == 205) {
        this.errorMessagePopup('media');
      }
      else{
        this.secondgetReport(processuuid);
      }
    },
    (error)=>{
      console.log(error);
      this.secondgetReport(processuuid);
    });
  }
  exportphotosnew() {
    this.change = false;
    this.loader = true;
    this.export_type="export_project_media_report";
    this.project_name =  this.data.title1
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getphotosnew(this.su.email_id, this.projectId, "", "",this.export_type).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        console.log("Wrong");
        this.loader=false;
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: { 
            status: "true",
            title:"media",
          }
        });
        this.dialogRef.close()
      }
      else{
        console.log("Wrong");
        this.loader=false;
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: { 
            status: "false",
            title:"media",
          }
        });
        this.dialogRef.close()
      }
    },
    (error)=>{
      console.log(error);
      this.secondgetReport(processuuid);
    });
  }
  closeBox() {
    this.dialog.closeAll();
  }

  downloadPhotos(){
    this.loader = true;
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    let processId = this.valueService.generateUUID();
    this.documentService.getmediastorage(this.projectId,processId).subscribe((response)=>{
      console.log(response);
      if(response["response_code"]==200){
        this.documentService.getmediastorageDownload(processId).subscribe((responsesecond)=>{
          console.log(responsesecond);
          if(responsesecond["response_code"]==200){
            let getUrlMedia = responsesecond["response_body"]["csv_url"];
            let mediaurltemp = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrlMedia + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
            this.documentService.downloadfilepdf(mediaurltemp).subscribe(blob => {
              const a = document.createElement('a');
              const objectUrl = URL.createObjectURL(blob);
              a.href = objectUrl;
              a.download = this.data.title1+'.zip';
              this.loader = false;
              a.click();
              URL.revokeObjectURL(objectUrl);
              this.dialogRef.close();
            });
          }
        });
      }
      else if(response["response_code"]==205){
        // there is no document in this project
        this.errorMessagePopup('document');
      }
      else if(response["response_code"]==207){
        // there is no annotations in this project
        this.errorMessagePopup('annotation');
      }
      else if(response["response_code"]==202){
        // there is no media in this project
        this.errorMessagePopup('media');
      }
      else if(response["response_code"]==201){
        // Internal Server Error
        this.errorMessagePopup('servererror');
      }
    },(error)=>{
      this.secondgetReportMediaDownload(processId);
    });
  }
  
  downloadPhotosnew(){
    this.loader = true;
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    let processId = this.valueService.generateUUID();
    this.export_type="export_media_project_files";
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.documentService.getmediastoragenew(this.su.email_id, this.projectId, "", "",this.export_type).subscribe((response)=>{
      console.log(response);
      if(response["response_code"]==200){
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: {
            status: "true",
            title:  "media",
            }
        });
        this.dialogRef.close()
      }
      else {
        // Internal Server Error
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: {
            status: "false",
            title:  "media",
            }
        });
        this.dialogRef.close()
      }
    },(error)=>{
      this.secondgetReportMediaDownload(processId);
    });
  }

  secondgetReportMediaDownload(processId){
    this.documentService.getmediastorageDownload(processId).subscribe((responsesecond)=>{
      console.log(responsesecond);
      
      let getsecondResponseCodeM = responsesecond["response_code"];
      let getsecondResponsestatusM = responsesecond["response_body"]["status"];
      if(getsecondResponseCodeM==200 && getsecondResponsestatusM==1){
        let getUrlMedia = responsesecond["response_body"]["csv_url"];
        let mediaurltemp = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrlMedia + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        this.documentService.downloadfilepdf(mediaurltemp).subscribe(blob => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = this.data.title1+'.zip';
          this.loader = false;
          a.click();
          URL.revokeObjectURL(objectUrl);
          this.dialogRef.close();
        });
      }
      else if(getsecondResponsestatusM==0){
        setTimeout(()=>{
          this.secondgetReportMediaDownload(processId);
        },30000);
      }
      else{
        this.errorMessagePopup('servererror');
      } 
    },
    (error)=>{
      console.log(error);
      this.errorMessagePopup('servererror');
    });
  }

  ngOnDestroy(): void {
    this.loader = false;
  }
 
}


