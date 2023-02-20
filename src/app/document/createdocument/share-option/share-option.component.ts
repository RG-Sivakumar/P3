import { Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { DomSanitizer } from '@angular/platform-browser';
import { DataserviceService } from '../../services/dataservice.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from "src/environments/environment.prod";
import { CreateDocumentService } from '../../services/create-document.service';
import { DataimageService } from 'src/app/dataimage.service';
import { isThisSecond } from 'date-fns';
import { DataService } from 'src/app/data.service';
import { AlertmessageComponent } from '../../alertmessage/alertmessage.component';
import html2canvas from 'html2canvas';
import { GlobalUserRoleService } from 'src/app/global-user-role.service';
import { v1 as uuidv1 } from "uuid";
import { login } from 'src/app/projectmanagement/models/login-model';
import { SuccessAutoCADComponent } from './success-auto-cad/success-auto-cad.component';
import { SuccessComponent } from '../../success/success.component';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { AttachmentfileComponent } from 'src/app/project-dashboard/attachmentfile/attachmentfile.component';
import { ImportAutocadComponent } from './import-autocad/import-autocad.component';
import { FormlistComponent } from 'src/app/formbuilder/formlist/formlist.component';
import { FormlistpopupComponent } from '../../formlistpopup/formlistpopup.component';
import { FormlistService } from 'src/app/formbuilder/services/formlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { threadId } from 'worker_threads';

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
  constructor(public documentService: CreateDocumentService, public dataService: DataService,private encrptdecrpt:EncryptDecryptService,
    public dialogRef: MatDialogRef<ShareOptionComponent>,public services:FormlistService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.documentDetails = this.data.documentDetails;
    console.log(this.documentDetails);
  }


  async downloadFile(data, filename = 'data', receiveHeaderData) {
    this.documentidss = this.documentDetails[0]["document_id"];
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
    this.documentidss = this.documentDetails[0]["document_id"];
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
  data1: string;
  loader: boolean = false;

  constructor(public documentService: CreateDocumentService, public dataService: DataService,
    public dialogRef: MatDialogRef<ShareOptionComponent>,private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.documentDetails = this.data.documentDetails;

  }
  async downloadFile(data, filename = 'data', receiveHeaderData) {
    this.documentidss = this.documentDetails[0]["document_id"]
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal")
    this.expo = receiveHeaderData;
    let csvData = this.ConvertToCSV(data, this.expo);
    let replaceData = csvData.replace(/’/g, "'").replace(/“/g, "''");
    console.log(replaceData);
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
    console.log(objArray, headerList);
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
      var cnt = 1;
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
            // line += '"' + array[i][head] + '",';

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
  selector: 'app-share-option',
  templateUrl: './share-option.component.html',
  styleUrls: ['./share-option.component.css'],
  providers: [AppService, Appreport],
})
export class ShareOptionComponent implements OnInit {
  projectId: any;
  expo: any;
  export_type:any;
  autoCAD=false;
  readonly APIBaseUrl = environment.APIBaseUrl;
  loader: boolean = false;
  documentDetails: any;
  documentidss: string;
  img: any;
  getAllDocumentPagesValue: any[] = [];
  message: any;
  docpath: any;
  page: any;
  doct: any;
  info: boolean = false;
  @ViewChild('pdfImg') pdfImg: ElementRef
  value: boolean = false;
  expo1: any;
  su: login;
  pdfURL: string = "";
  pdfPgeNumber: number = 1;
  width: any;
  height: any;
  is_link:boolean=false;

  private subscription: Subscription;
  private timer: Observable<any>;
  pageId: any;
  linkcheckstring: string="no";
  select_autocad: any;

  constructor(private dialogClose: MatDialog, public documentService: CreateDocumentService, private sanitizer: DomSanitizer, private appService: AppService,
    public imgdataService: DataimageService, private httpClient: HttpClient, public dataservice: DataserviceService, public dialog: MatDialog, public service4: Appreport,
    public userRoleGlobal: GlobalUserRoleService, public dialogRef: MatDialogRef<ShareOptionComponent>,private encrptdecrpt:EncryptDecryptService,private dataservice1: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,public services:FormlistService,public _snackbar:MatSnackBar) {
    console.log(this.data);
    this.documentDetails = this.data.documentDetails;
    this.docpath = this.data.docpath;

    console.log(this.docpath, this.height, this.width);
    this.page = this.data.singlePageNumber;
    this.pageId=this.data.pageId;
    if (this.docpath != undefined) {
      this.pdfURL = environment.APIBaseUrl + "get_web_singed_file?file=" + this.docpath.document_path + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
      console.log(this.pdfURL);
    }
    else {
      this.loader = false;
    }


    // this.doct=( this.docpath["document_path"].split("https://plannotate3devbucket.s3.amazonaws.com/Documents/")) 
    //  console.log(this.doct)
  }


  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }
  getWidth: any;
  getHeight: any;
  getBase64Image(img) {

    this.img = img

  }
  download() {
    console.log('hit');

    if (this.img != null) {
      this.loader = true
      var orientationMode: any
      let imageData = this.APIBaseUrl + "get_web_singed_file?file=" + this.img + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2()

      var imgElement = document.createElement("img");
      imgElement.onload = () => {
        var imageWidth = imgElement.width;
        var imageHeight = imgElement.height;

        var orientationMode: any = 'p';
        if (imageWidth > imageHeight) {
          orientationMode = 'l';
        }
        else {
          orientationMode = 'p';
        }

        const doc = new jsPDF(orientationMode, 'pt', 'a4');
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        doc.addImage(imageData, 'JPEG', 0, 0, width, height);
        doc.save(this.data.title1 + '-Export.pdf');
      }
      imgElement.src = imageData;

      this.dialogClose.closeAll();
      this.loader = false;
    } else {
      this.info = true;
      this.loader = true
      this.dataservice.htmlelement1.emit(this.info)
      this.timer = Observable.timer(1000); // 5000 millisecond means 5 seconds
      this.subscription = this.timer.subscribe(() => {

        this.loader = false;
        this.dialog.closeAll();
      });
    }
  }
  download1() {
    console.log('hit');
    this.dialogClose.closeAll();
    this.docpath = this.data.docpath

    let imageData = this.APIBaseUrl + "get_web_singed_file?file=" + this.docpath["document_path"] + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2()
    window.location.assign(imageData)


  }
  closeBox() {
    this.dialogClose.closeAll();
  }


  sanitize(url: any) {
    this.img = url

    return this.img;
  }
  download12() {
    //wait 2 seconds

    console.log('hit');
    this.value = true;
    if (this.value == true) {
      this.loader = true
      this.dataservice.htmlelement.emit(this.value)
      console.log(this.value)
      this.timer = Observable.timer(5000); // 5000 millisecond means 5 seconds
      this.subscription = this.timer.subscribe(() => {

        this.loader = false;
        this.dialog.closeAll();
      });



    }




  }
  export() {
    this.loader = true;
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getreport(this.documentidss, "", false, processuuid).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        let getUrl = response["response_body"]["csv_url"];
        let addsecretKey = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrl + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        this.httpClient.get(addsecretKey).subscribe((data) => {
          console.log(data);
          let getcsvData = data["csv_data"];
          let headerdataValue = data["csv_header"];
          this.loader = true;
          this.appService.downloadFile(getcsvData, this.data.title1, headerdataValue);
        });
      }
      else if (response['response_code'] == 201 || response['response_code'] == 205) {
        this.errorMessagePopup('annotation');
      }
      else {
        this.secondgetReport(processuuid);
      }
    },
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });
  }

  exportBlankasPdf(){
    this.loader = true;
    this.export_type="export_blank_page_as_pdf";
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    var linkflag=this.linkcheckstring;
    var pageId=this.pageId;
    this.documentService.getreportnewwithlink(this.su.email_id,"","",pageId,this.export_type,linkflag).subscribe((response) => {
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
            status:"false",
            title: "export"}
        });
        this.dialogRef.close();
      }
    },
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });

  }

  exportPageasPdf(){
    this.loader = true;
    this.export_type="export_page_as_pdf";
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    var linkflag=this.linkcheckstring;
    var pageId=this.pageId;
    this.documentService.getreportnewwithlink(this.su.email_id,"","",pageId,this.export_type,linkflag).subscribe((response) => {
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
            status:"false",
            title: "export"}
        });
        this.dialogRef.close();
      }
    },
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });

  }

  exportBlankDocumentasPdf(){
    this.loader = true;
    this.export_type="export_blank_document_as_pdf";
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    var linkflag=this.linkcheckstring;
    this.documentService.getreportnewwithlink(this.su.email_id,"",this.documentidss, "",this.export_type,linkflag).subscribe((response) => {
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
            status:"false",
            title: "export"}
        });
        this.dialogRef.close();
      }
    },
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });

  }

  exportDocumentasPdf(){
    this.loader = true;
    this.export_type="export_document_as_pdf";
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    var linkflag=this.linkcheckstring;
    this.documentService.getreportnewwithlink(this.su.email_id,"",this.documentidss, "",this.export_type,linkflag).subscribe((response) => {
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
            status:"false",
            title: "export"}
        });
        this.dialogRef.close();
      }
    },
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });

  }
  importdocument(){
    const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  this.autoCAD=false;
   const dialogRef=this.dialog.open(ImportAutocadComponent, {
    panelClass: "my-class",
    data:{
      document_id:this.documentDetails[0].document_id,
      page_id:this.documentDetails[0].page_id,
      layer_id:this.documentDetails[0].active_layer_id,
      project_id: this.encrptdecrpt.getItem("projectIdlocal"),
      autoCAD:this.autoCAD
    }
   })
  }

  exportnew() {
    this.loader = true;
    this.export_type="export_document_as_csv";
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getreportnew(this.su.email_id,"",this.documentidss, "",this.export_type).subscribe((response) => {
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
            status:"false",
            title: "export"}
        });
        this.dialogRef.close();
      }
    },
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });
  }

  secondgetReport(processuuid) {
    this.documentService.getreport1(processuuid).subscribe((datasecond) => {
      console.log(datasecond);
      let getsecondResponse = datasecond["response_code"];
      let getsecondResponsestatus = datasecond["response_body"]["status"];
      if (getsecondResponse == 200 && getsecondResponsestatus == 1) {
        let getResponsevalue = datasecond;
        let getUrl = getResponsevalue["response_body"]["csv_url"];
        let addsecretKey = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrl + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        this.httpClient.get(addsecretKey).subscribe((data) => {
          console.log(data);
          let getcsvData = data["csv_data"];
          let headerdataValue = data["csv_header"];
          this.loader = true;
          this.appService.downloadFile(getcsvData, this.data.title1, headerdataValue);
        });
      }
      else if (getsecondResponsestatus == 0) {
        setTimeout(() => {
          this.secondgetReport(processuuid);
        }, 30000);
      }
      else {
        this.errorMessagePopup('servererror');
      }
    },
      (error) => {
        console.log(error);
        this.errorMessagePopup('servererror');
      });
  }

  errorMessagePopup(platformName) {
    this.loader = false;
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    var dialogrefModel = this.dialog.open(AlertmessageComponent, {
      data: { platform: platformName }
    });
  }

  is_link_toggle(check_value) {
    if (check_value.checked == true) {
      this.is_link = true;
    }
    else if (check_value.checked == false) {
      this.is_link = false;
    }
  }

  exportphotos() {
    this.loader = true;
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getphotos(this.documentidss, "", false, processuuid).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        let getUrl = response["response_body"]["csv_url"];
        let addsecretKey = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrl + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        this.httpClient.get(addsecretKey).subscribe((data) => {
          console.log(data);
          let getcsvData = data["csv_data"];
          let headerdataValue = data["csv_header"];
          this.loader = true;
          this.service4.downloadFile1(getcsvData, this.data.title1, headerdataValue);
        });
      }
      else if (response['response_code'] == 201 || response['response_code'] == 205) {
        this.errorMessagePopup('media');
      }
      else {
        this.secondgetReport(processuuid);
      }
    },
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });
  }
  
  exportphotosnew() {
    this.export_type="export_document_media_report";
    this.loader = true;
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getphotosnew(this.su.email_id,"",this.documentidss, "",this.export_type).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        console.log("Success");
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
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });
  }
  
  downloadMedia() {
    this.export_type="export_media_document_files";
    this.loader = true;
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getmediastoragenew(this.su.email_id,"",this.documentidss, "",this.export_type).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        console.log("Success");
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
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });
  }
 
  


  exportreport() {
    console.log('exportreport');
    this.loader = true;
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getcsvreport(this.documentidss, "", false, processuuid).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        let getUrl = response["response_body"]["csv_url"];
        let addsecretKey = environment.APIBaseUrl + "get_web_singed_file?file=" + getUrl + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        this.httpClient.get(addsecretKey).subscribe((data) => {
          console.log(data);
          let getcsvData = data["csv_data"];
          let headerdataValue = data["csv_header"];
          this.loader = true;
          this.service4.downloadFile(getcsvData, this.data.title1, headerdataValue);
        });
      }
      else if (response['response_code'] == 201 || response['response_code'] == 205) {
        this.errorMessagePopup('annotation');
      }
      else {
        this.secondgetReport(processuuid);
      }
    },
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });
  }

  exportreportnew() {
    console.log('exportreport');
    this.export_type="export_document_report";
    this.loader = true;
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var annontationidDate = new Date().getTime();
    var processuuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getcsvreportnew(this.su.email_id,"",this.documentidss, "",this.export_type).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {
        console.log("Success");
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
      (error) => {
        console.log(error);
        this.secondgetReport(processuuid);
      });
  }

  downloadPdfGet(): void {
    // this.loader=true;
    console.log(this.documentDetails);

    if (this.docpath != undefined) {
      this.loader = true;
      this.documentService.downloadfilepdf(this.pdfURL).subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl
        a.download = this.data.title1 + ' - Export.pdf';
        a.click();
        this.loader = false;
        URL.revokeObjectURL(objectUrl);
      });
    }
    else if (this.docpath == undefined) {
      if (this.documentDetails.length > 0) {
        this.loader = true;
        let findPotraitLandscapeURL = this.APIBaseUrl + "get_web_singed_file?file=" + this.documentDetails[0].file_path + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
        var imgElement = document.createElement("img");
        imgElement.onload = () => {
          var imageWidth = imgElement.width;
          var imageHeight = imgElement.height;

          var orientationMode: any = 'p';
          if (imageWidth > imageHeight) {
            orientationMode = 'l';
          }
          else {
            orientationMode = 'p';
          }
          const fieldhseet = new jsPDF(orientationMode, 'pt', 'a4');
          var width = fieldhseet.internal.pageSize.getWidth();
          var height = fieldhseet.internal.pageSize.getHeight();
          fieldhseet.deletePage(1);
          for (let k = 0; k < this.documentDetails.length; k++) {
            let imageURL = this.documentDetails[k].file_path;
            let imageData = this.APIBaseUrl + "get_web_singed_file?file=" + imageURL + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
            fieldhseet.addPage();
            fieldhseet.setPage(k + 1);
            fieldhseet.addImage(imageData, 'JPEG', 0, 0, width, height);
          }
          // let pageCount = fieldhseet.getNumberOfPages();
          // console.log(pageCount);
          // if (this.documentDetails.length < pageCount) {
          //   fieldhseet.deletePage(pageCount);
          // }
          this.loader = false;
          fieldhseet.save(this.data.title1 + ' - Export.pdf');
          this.dialogRef.close();
        };
        imgElement.src = findPotraitLandscapeURL;

      }
    }

  }


  pageRendered1(event) {
    console.log(event);
    this.loader = false;
    let getDocumentPages = document.querySelectorAll("div.page");
    console.log(getDocumentPages);

  }

  exportAutocad() {
    this.loader = true;
    console.log(this.documentDetails[0].document_id);
    var documentId = this.documentDetails[0].document_id;
    let annontationidDate = new Date().getTime();
    var requestId = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    this.documentService.getAutoCADReport(documentId,requestId).subscribe((response) => {
      console.log(response);
      this.loader = false;
      let sendValue = response;
      this.dialogRef.close();
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      var dialogrefModel = this.dialog.open(SuccessAutoCADComponent, {
        width: "380px",
        data: { autoCadData: sendValue }
      });
    },
      (error) => {
        // console.log(error);
        // let sendValue = { 'response_code': 404 };
        // this.dialogRef.close();
        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        // dialogConfig.autoFocus = true;
        // var dialogrefModel = this.dialog.open(SuccessAutoCADComponent, {
        //   width: "380px",
        //   data: { autoCadData: sendValue }
        // });
        this.autoCad_Second_API_call(documentId,requestId);
      }
    );
  }

  autoCad_Second_API_call(documentId,requestId){
    this.documentService.getAutoCADReport_secondapi(documentId,requestId).subscribe((response) => {
      if(response["response_code"]==200){
        console.log(response)
        let get_status = response["response_body"][0]["status"];
        if (get_status == 1) {
          this.loader = false;
          let sendValue = {"response_code": response["response_code"],"response_body":response["response_body"][0]["json_url"]};
          this.dialogRef.close();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          var dialogrefModel_auto = this.dialog.open(SuccessAutoCADComponent, {
            width: "380px",
            data: { autoCadData: sendValue }
          });
        }
        else {
          setTimeout(()=>{
            console.log('after 10 seconds');
            this.autoCad_Second_API_call(documentId,requestId)
          },10000);
        }
      }
      (error)=>{
        console.log(error);
        this.loader = false;
        let sendValue = { 'response_code': 404 };
        this.dialogRef.close();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        var dialogrefModel_auto_1 = this.dialog.open(SuccessAutoCADComponent, {
          width: "380px",
          data: { autoCadData: sendValue }
        });
      }
    });
  }
exportfromautocad(){
  console.log(this.documentDetails);
  this.dialogRef.close();
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  this.autoCAD=true;
   const dialogRef=this.dialog.open(ImportAutocadComponent, {
    panelClass: "my-class",
    data:{
      document_id:this.documentDetails[0].document_id,
      page_id:this.documentDetails[0].page_id,
      layer_id:this.documentDetails[0].active_layer_id,
      project_id: this.encrptdecrpt.getItem("projectIdlocal"),
      autoCAD:this.autoCAD
    }
   })
   dialogRef.afterClosed().subscribe((result) => {
    this.select_autocad=result
    console.log(this.select_autocad,"ssssssssssssssssssss")
   })
   
}
  // exportnew method copy below 
  pdfexport(export_type) {
    this.loader = true;
    this.export_type=export_type;
    this.documentidss = this.documentDetails[0]["document_id"];
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    var pageId=this.pageId;
    // export document method no need page id
    if(export_type=='export_blank_document_as_pdf' || export_type == 'export_document_as_pdf'|| export_type == 'export_document_as_pdf_with_local_links'){
      pageId = "";
    }
    // link toggle false below type
    let get_is_link = this.is_link;
    if(export_type == "export_blank_page_as_pdf" || export_type == "export_blank_document_as_pdf"){
      get_is_link = false;
    }
    this.documentService.getpdfexport(this.su.email_id,this.projectId,this.documentidss,pageId,this.export_type,get_is_link).subscribe((response) => {
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
  
  public ngOnDestroy() {
    if (this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }
  exportcsvforforms(){
    this.loader=true;
    let doc=this.documentDetails[0]["document_id"]
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    this.services.getformlist().subscribe((data) => {
      console.log(data);
      
      if(data["response_code"]==200 ){
        
        this.loader=false;
        let permission=data["response_body"]["user_permission"]
        let listing=data["response_body"]["form_listing"]
        listing=listing.filter(res=>(res.is_hidden!=1))
        if(listing.length!=0){
    this.dialog.open(FormlistpopupComponent,{
      width: '40%',
     data:{
      project_id:this.projectId,
      document_id:doc,
      show_form:false,
      permission:permission,
      listing:listing
      
     }
    
    }
  );
        }
        else{
          this._snackbar.open('No Forms Available', null,
{
  horizontalPosition: 'center',
  verticalPosition: 'top',
});
this.dialog.closeAll()
        }
      }else{
this.loader=false

      }
  })
  }

}




