import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { DocumenttagService } from "src/app/document/services/documenttag.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { AddcontentService } from "src/app/projects/services/addcontent.service";
import { ValueService } from "src/app/value.service";
import { v1 as uuidv1 } from "uuid";
import { SelectFolderAnnotateComponent } from "../select-folder-annotate/select-folder-annotate.component";
@Component({
  selector: "app-addasnewdocument",
  templateUrl: "./addasnewdocument.component.html",
  styleUrls: ["./addasnewdocument.component.css"],
})
export class AddasnewdocumentComponent implements OnInit {
  projectid: any;
  page_id: any = [];
  mediaUrl: any;
  folderlevel: number;
  folderid: number;
  folderName: any;
  documentId: string = "";
  layerName: string = "default";
  layerType = "blank";
  su: login;
  projectFolderList: any[] = [];
  constructor(
    private newdocservice: DocumenttagService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogClose: MatDialogRef<AddasnewdocumentComponent>,
    private addcontentservice: AddcontentService,
    private documentService: CreateDocumentService,
    private valueServiceCase: ValueService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.projectFolderList = data.projectFolderList;
    console.log(data.url);
    this.mediaUrl= data.media_url;
    console.log(this.mediaUrl)
  }

  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }
  closeBox() {
    this.dialog.closeAll();
  }


  AddNewdoc() {
    let uuId = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
    let pageId = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
    this.newdocservice.addasNewDocAnnotate(
      this.projectid,
      pageId,
      this.mediaUrl,
      uuId,
      name,
      this.folderid,
      this.folderlevel,
    )
      .subscribe((res) => {
        console.log(res);
        this.documentId = uuId;
        this.page_id.push(pageId);
        this.createLayer(this.documentId);
        if (res.response_code == 200) {
          this.newdocservice.filter("Register Click");
        }
      });
    this.dialogClose.close();
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
        this.projectid,
        documentId,
        this.page_id
      )
      .subscribe((response) => {
        console.log(response);
        this.documentService.filter("Refresh Start");
        this.addcontentservice.filter("Register Click");
      });
  }

  goToSelectFolder(documentName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    // dialogConfig.width = "100%";
    this.dialog.open(SelectFolderAnnotateComponent, {
      data: {
        projectFolderList: this.projectFolderList,
        documentName: documentName,
        mediaUrl: this.mediaUrl

      },
    });
    this.dialogClose.close();
  }

  firstLetterCapital(word) {
    this.folderName = this.valueServiceCase.firstLetterCapital(word);
  }

  // document(documentName, folderId, page_id) {
  //   let deactivateFilterToolbar = { allChecked: true, pointsChecked: false, freehandChecked: false, vertexChecked: false, rectangleChecked: false };
  //   localStorage.setItem("toolbarFilterItem", JSON.stringify(deactivateFilterToolbar));
  //   const queryParams = {
  //     project_id: this.projectId,
  //     documentName: documentName,
  //     folderId: folderId,
  //     projectName: this.projectName,
  //     folderlevel: 0,
  //     pfolderid: this.parentFolderId,
  //     page_id: page_id,
  //     openLinkWindow: true,
  //   };
  //   const urlTree = this.router.createUrlTree([], {
  //     queryParams: queryParams,
  //     relativeTo: this.activateRoute,
  //     skipLocationChange: true
  //   });
  //   window.open('/#' + urlTree.toString());
  // }

}
