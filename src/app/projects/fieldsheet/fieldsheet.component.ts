import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialog,
} from "@angular/material/dialog";
import { v1 as uuidv1 } from "uuid";
import { AddcontentService } from "../services/addcontent.service";
import { FieldselectfolderComponent } from "../fieldselectfolder/fieldselectfolder.component";
import { login } from "src/app/projectmanagement/models/login-model";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { DataService } from "src/app/data.service";
import { FormControl, Validators } from "@angular/forms";
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

export class NumberValidators {

  static range(min: number, max: number): ValidatorFn {
      return (c: AbstractControl): { [key: string]: boolean } | null => {
          if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
              return { 'range': true };
          }
          return null;
      };
  }
}

@Component({
  selector: "app-fieldsheet",
  templateUrl: "./fieldsheet.component.html",
  styleUrls: ["./fieldsheet.component.css"],
})
export class FieldsheetComponent implements OnInit {
  mode: string = "portrait";
  validate: boolean = true;
  // modevalue:string="Potrait";
  documentName: any;
  pagesdocument: any;
  modevalue: any;
  projectId: string;
  callback: any;
  uuidValue: string;
  classactive: boolean = false;
  selectfolder = [];
  su: login;
  documentId: string;
  layerName: string = "default";
  layerType = "blank";
  page_id: any[] = [];
  projecDetailstList: any;
  ShowHideProjectList: any[] = [];
  imgSource: any = "assets/images/document/WJE PC - 4x4 Calc Pad_rev-1-potrait.png";

  constructor(
    private dialog: MatDialogRef<FieldsheetComponent>,
    private dialogbox: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addcontentservice: AddcontentService,
    private documentService: CreateDocumentService,
    private dataService: DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    var receiveData = this.data;
    this.projectId = receiveData.projectId;
    this.selectfolder = receiveData.receivefolder;
    this.callback = receiveData.callback;
    this.projecDetailstList = receiveData.projecDetailstList;
    this.ShowHideProjectList = receiveData.ShowHideProjectList;
  }

  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  firstLetterCapital(word) {

    if (word && word != 0) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.documentName = changeUpperCaseProjectName;
      let keyValue = changeUpperCaseProjectName.search("'");
      // if (keyValue > -1) {
      //   changeUpperCaseProjectName = changeUpperCaseProjectName.replaceAll("'", "‘");
      // }
      this.documentName = changeUpperCaseProjectName;
    }
  }

  AddNewFieldsheet(name, page) {
    console.log(typeof page);
    let firstLetter = name[0].toUpperCase();
    let otherletters = name.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    let tempcheckName = changeUpperCaseProjectName.trim();
    var duplicateCheckname = changeUpperCaseProjectName.trim();
    let count = 1;
    while (this.ShowHideProjectList.find((data) => data.folder_name.toLowerCase() === duplicateCheckname.toLowerCase())) {
      duplicateCheckname = tempcheckName + " (" + count + ")";
      count++;
    }
    this.page_id = [];
    for (var i = 0; i < page; i++) {
      var date = new Date().getTime();
      this.page_id.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + date);
    }
    if (this.selectfolder.length == 0 || !this.selectfolder.some((data) => {
      return data["is_folder_flag"] == 1;
    })
    ) {
      var date = new Date().getTime();
      var uuid = uuidv1().toUpperCase();
      this.documentId = this.su.user_id + "-" + uuid + "-" + date;
      this.addcontentservice.directlyAddFieldSheet(this.projectId, changeUpperCaseProjectName, page, this.mode, uuid, date, this.page_id).subscribe((res) => {
        console.log(res);
        this.createLayer(this.documentId);
        this.callback();
      });
      this.dialog.close();
    } else {
      duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
      const dialogRef = new MatDialogConfig();
      dialogRef.disableClose = true;
      dialogRef.autoFocus = true;
      this.dialogbox.open(FieldselectfolderComponent, {
        data: {
          projectId: this.projectId,
          document_name: duplicateCheckname,
          noofPage: page,
          mode: this.mode,
          projecDetailstList: this.projecDetailstList,
          callback: this.callback,
        },
      });
      this.dialog.close();
    }
  }

  myFunction(event)
  {
    this.dataService.specialCharacterPasteRestrict(event);
  }

  createLayer(documentId) {
    var uuidDate = new Date().getTime();
    var date = new Date().toISOString();
    this.documentService
      .defaultcreateLayer(
        this.layerName,
        this.layerType,
        uuidDate,
        date,
        uuidv1().toUpperCase(),
        this.projectId,
        documentId,
        this.page_id
      )
      .subscribe((response) => {
        this.documentService.filter("Refresh Start");
        this.addcontentservice.filter("Register Click");
      });
  }

  closeBox() {
    this.dialog.close();
  }

  changestatus(value) {
    if (value == 1) {
      this.mode = "portrait";
      this.imgSource = "assets/images/document/WJE PC - 4x4 Calc Pad_rev-1-potrait.png";
      return (this.classactive = false);
    } else {
      this.mode = "landscape";
      this.imgSource = "assets/images/document/WJE PC - 4x4 Calc Pad_rev-1-landscape.png";
      return (this.classactive = true);
    }
  }
  restrictEnable:boolean = false;


  restrictPages(count){
    console.log(typeof count,count); 
    let getElementNumberRestrict = (document.getElementById("exampleInputPassword1") as HTMLInputElement);
    if(this.restrictEnable==false){
      if(count<=20){
        getElementNumberRestrict.min = "1";
        this.pagesdocument = count;
        getElementNumberRestrict.value = count;
      } 
      else{
        getElementNumberRestrict.value = "20";
        this.pagesdocument = 20;
      }
    }
    
  }

  



  
}
