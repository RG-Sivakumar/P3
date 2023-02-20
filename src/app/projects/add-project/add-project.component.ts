import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from "@angular/material/dialog";
import { v1 as uuidv1 } from "uuid";
import { AddcontentService } from "../services/addcontent.service";
import { SelectfolderComponent } from "../selectfolder/selectfolder.component";
import { SelectFolderComponent } from "../select-folder/select-folder.component";
import { MoreoptionService } from "../services/moreoption.service";
import { ProjectfolderService } from "../services/projectfolder.service";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { DataService } from "src/app/data.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import {FieldselectfolderComponent} from "src/app/projects/fieldselectfolder/fieldselectfolder.component"

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.css"],
})
export class AddProjectComponent implements OnInit {
  addProject: boolean = false;
  addNewFolder: boolean = false;
  addNewSubFolder: boolean = false;
  folderName: string = "";
  subfolderName: string = "";
  projectId: string;
  uuidValue: string;
  show: boolean = false;
  receivefolders = [];
  callback: any;
  addRename: boolean = false;
  renameFoldername: string;
  folderId: string;
  parentFolderId: string;
  folderLevel: number;
  getRename: string = "";
  withoutAnnotation: boolean = false;
  pageCount: number;
  pageId: string[] = [];
  copyDocument: boolean = false;
  withAnnotation: boolean = false;
  getPageIds: string[] = [];
  folderflag: number;
  projecDetailstList: any;
  documentId: string = "";
  su: login;
  layerName: string = "default";
  layerType = "blank";
  keepTextName: string = "";
  ShowHideProjectList: any[] = [];
  hiddenFlag: any;
  projectName: string = "";
  copyType: any;
  user_id: number;
  oldFolderId: any;


  constructor(
    private dialog: MatDialog,
    private dialogbox: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addcontentservice: AddcontentService,
    private moreoptionservice: MoreoptionService,
    private projectFolderService: ProjectfolderService,
    private documentService: CreateDocumentService,
    private dataService: DataService,
    private userRoleGlobal:GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    var receiveDatas = this.data;
    this.copyType = receiveDatas.copytype;
    this.addNewFolder = receiveDatas.addNewFolderAccess;
    this.addNewSubFolder = receiveDatas.addNewSubFolderAccess;
    this.projectId = receiveDatas.projectId;
    this.receivefolders = receiveDatas.receivefolder;
    this.addRename = receiveDatas.renameaccess;
    this.renameFoldername = receiveDatas.folderName;
    let tempkeepTextName = receiveDatas.folderName;
    this.hiddenFlag = receiveDatas.hiddenFlag;
    this.oldFolderId = receiveDatas.oldFolerID;
    this.ShowHideProjectList = receiveDatas.ShowHideProjectList;
    if (tempkeepTextName != undefined) {
      var rest = tempkeepTextName.substring(0, tempkeepTextName.lastIndexOf("("));
      var last = tempkeepTextName.substring(tempkeepTextName.lastIndexOf("(") + 1, tempkeepTextName.length);
      console.log(rest + "," + rest.length + "," + last);
      if (rest.length == 0) {
        this.keepTextName = receiveDatas.folderName.trim();
      }
      else {
        this.keepTextName = rest.trim();
      }
    }
    console.log(this.keepTextName);
    this.folderId = receiveDatas.folderId;
    this.parentFolderId = receiveDatas.parentFolderId;
    this.folderLevel = receiveDatas.folderLevel;
    this.withoutAnnotation = receiveDatas.withoutAnnotation;
    this.copyDocument = receiveDatas.copyDocument;
    this.withAnnotation = receiveDatas.withAnnotation;
    this.folderflag = receiveDatas.folderflag;
    this.callback = receiveDatas.callback;
    this.projecDetailstList = receiveDatas.projecDetailstList;
    this.projectName = receiveDatas.project_name;
    console.log(this.projectName);
    if (this.withAnnotation == true) {
      this.moreoptionservice
        .getDocumentPageId(this.projectId, this.folderId)
        .subscribe((res) => {
          console.log(res);
          var documentList = res["response_body"]["document_list"];
          for (var i = 0; i < documentList.length; i++) {
            this.getPageIds.push(documentList[i].page_id);
          }
          console.log(this.getPageIds);
          this.getlayerIdandAnnotationId();
        });
    }

    // if (this.copyDocument == true) {
    //   this.moreoptionservice.getDocumentCount(this.projectId, this.folderId).subscribe((res) => {
    //     console.log(res);
    //     this.pageCount = Object.keys(
    //       res["response_body"]["document_list"]).length;
    //     for (var i = 0; i < this.pageCount; i++) {
    //       this.pageId.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime());
    //     }
    //   });
    // }
  }

  getlayerIdandAnnotationId() { }

  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.user_id = this.su.user_id;
  }

  btnDisabled = false;
  AddNewFolderAuc(folder_name) {

    let firstLetter = folder_name[0].toUpperCase();
    let otherletters = folder_name.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    let tempcheckName = changeUpperCaseProjectName.trim();
    var duplicateCheckname = changeUpperCaseProjectName.trim();
    console.log(changeUpperCaseProjectName);
    let count = 1;
    while (this.ShowHideProjectList.find((data) => data.folder_name.toLowerCase() === duplicateCheckname.toLowerCase())) {
      duplicateCheckname = tempcheckName + " (" + count + ")";
      count++;
    }
    var date = new Date().getTime();
    this.btnDisabled = true;
    this.addcontentservice.loaderActivated.emit(true);
    duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
    this.addcontentservice.addNewFolder(duplicateCheckname, this.projectId, uuidv1().toUpperCase(), date)
      .subscribe((res) => {
        this.addcontentservice.filter("Register click");
        // this.callback(folder_name);
      });
    this.dialogbox.close();

  }

  renameAuc(renameProject) {

    let firstLetter = renameProject[0].toUpperCase();
    let otherletters = renameProject.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    let tempcheckName = changeUpperCaseProjectName.trim();
    var duplicateCheckname = changeUpperCaseProjectName.trim();
    console.log(this.keepTextName.toLowerCase(), tempcheckName.toLowerCase());
    if (this.keepTextName.toLowerCase() != tempcheckName.toLowerCase()) {
      this.addcontentservice.loaderActivated.emit(true);
      console.log(changeUpperCaseProjectName);
      let count = 1;
      while (this.ShowHideProjectList.find((data) => data.folder_name.toLowerCase() === duplicateCheckname.toLowerCase())) {
        duplicateCheckname = tempcheckName + " (" + count + ")";
        count++;
        console.log(duplicateCheckname, changeUpperCaseProjectName, count);
      }
      this.btnDisabled = true;
      duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
      this.moreoptionservice
        .renameFolderName(
          duplicateCheckname,
          this.folderId,
          this.parentFolderId,
          this.folderLevel,
          this.hiddenFlag
        )
        .subscribe((res) => {
          this.moreoptionservice.filter("Register click");
        });
    }

    this.dialogbox.close();
  }

  myFunction(event)
  {
    this.dataService.specialCharacterPasteRestrict(event);
  }

  AddNewSubFolderAuc(subfolder_name) {
    let firstLetter = subfolder_name[0].toUpperCase();
    let otherletters = subfolder_name.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    let tempcheckName = changeUpperCaseProjectName.trim();
    var duplicateCheckname = changeUpperCaseProjectName.trim();
    console.log(changeUpperCaseProjectName);
    let count = 1;
    while (this.ShowHideProjectList.find((data) => data.folder_name.toLowerCase() === duplicateCheckname.toLowerCase())) {
      duplicateCheckname = tempcheckName + " (" + count + ")";
      count++;
    }
    duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
    const dialogRef = new MatDialogConfig();
    dialogRef.disableClose = true;
    dialogRef.autoFocus = true;
    this.dialog.open(SelectFolderComponent, {
      data: {
        subfolderName: duplicateCheckname,
        projectId: this.projectId,
        callback: this.callback,
        projecDetailstList: this.projecDetailstList,
        subFolderSelect: true,
      },
    });
    this.dialogbox.close();
  }

  CopyDocumentwithoutAnnotaion(documentName) {
    documentName = documentName.trim();
    let firstLetter = documentName[0].toUpperCase();
    let otherletters = documentName.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    let tempcheckName = changeUpperCaseProjectName.trim();
    var duplicateCheckname = changeUpperCaseProjectName.trim();
    let count = 1;
    while (this.ShowHideProjectList.find((data) => data.folder_name.toLowerCase() === duplicateCheckname.toLowerCase())) {
      duplicateCheckname = tempcheckName + " (" + count + ")";
      count++;
    }
    const dialogRef = new MatDialogConfig();
    dialogRef.disableClose = true;
    dialogRef.autoFocus = true;
    duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
    this.dialog.open(SelectFolderComponent, {
      data: {
        documentName: duplicateCheckname,
        projectId: this.projectId,
        folderId: this.folderId,
        pageId: this.pageId,
        callback: this.callback,
        projecDetailstList: this.projecDetailstList,
        withoutAnnotationSelect: true,
        copyDocument: this.copyDocument,
      },
    });
    this.dialogbox.close();

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
        this.pageId
      )
      .subscribe((response) => {
        console.log(response)
        this.documentService.filter("Refresh Start");
        this.addcontentservice.filter("Register Click");
      });
  }

  CopyDocumentwithAnnotaion(documentName) {
    if (this.copyType == "project") {
      this.CopyDocumentwithAnnotaion_project(documentName);
    }
    else {
      let firstLetter = documentName[0].toUpperCase();
      let otherletters = documentName.slice(1);
      let changeUpperCaseProjectName = firstLetter + otherletters;
      let tempcheckName = changeUpperCaseProjectName.trim();
      var duplicateCheckname = changeUpperCaseProjectName.trim();
      let count = 1;
      while (this.ShowHideProjectList.find((data) => data.folder_name.toLowerCase() === duplicateCheckname.toLowerCase())) {
        duplicateCheckname = tempcheckName + " (" + count + ")";
        count++;
      }
      const dialogRef = new MatDialogConfig();
      dialogRef.disableClose = true;
      dialogRef.autoFocus = true;
      duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
      this.dialog.open(SelectFolderComponent, {
        data: {
          documentName: duplicateCheckname,
          projectId: this.projectId,
          folderId: this.folderId,
          callback: this.callback,
          projecDetailstList: this.projecDetailstList,
          withAnnotationSelect: true,
          copyDocument: this.copyDocument,
          project_name: this.projectName
        },
      });
      this.dialogbox.close();
    }
  }

  CopyDocumentwithAnnotaion_project(documentName) {
    let firstLetter = documentName[0].toUpperCase();
    let otherletters = documentName.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    let tempcheckName = changeUpperCaseProjectName.trim();
    var duplicateCheckname = changeUpperCaseProjectName.trim();
    let count = 1;
    while (this.ShowHideProjectList.find((data) => data.folder_name.toLowerCase() === duplicateCheckname.toLowerCase())) {
      duplicateCheckname = tempcheckName + " (" + count + ")";
      count++;
    }
    this.projectFolderService.getProjectfolder(this.user_id, this.projectId).subscribe((res) => {
      console.log(res);
      var foldersList = res.response_body.project_master;
      var specialCharsremoved = this.dataService.changeSpecialtokeyformatList(foldersList, 'documentlist')	
      const dialogRef = new MatDialogConfig();
      dialogRef.disableClose = true;
      dialogRef.autoFocus = true;
      duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
      this.dialog.open(FieldselectfolderComponent, {
        data: {
          oldFolderID:this.oldFolderId,
          projectId: this.projectId,
          document_name: duplicateCheckname,
          noofPage: 1,
          mode: "portrait",
          projecDetailstList: foldersList,
          type: "project",
          su :this.su,
        },
      });
      this.dialogbox.close();
    })
    
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.getRename = changeUpperCaseProjectName;
    }
  }

  firstLetterCapitalRename(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.renameFoldername = changeUpperCaseProjectName;
    }
  }
  
  firstLetterCapitalNewFolder(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.folderName = changeUpperCaseProjectName;
    }
  }

  firstLetterCapitalSubFolder(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.subfolderName = changeUpperCaseProjectName;
    }
  }

  closeBox() {
    this.dialogbox.close();
  }
}
