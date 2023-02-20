import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogConfig,
  MatDialog,
} from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { LinkApiPageComponent } from "./link-api-page/link-api-page.component";

@Component({
  selector: "app-document-pages",
  templateUrl: "./document-pages.component.html",
  styleUrls: ["./document-pages.component.css"],
})
export class DocumentPagesComponent implements OnInit {
  selectPages: any[];
  activatedAnnotationId: string;
  layerDatas: any[];
  multipleSelectOn: boolean;
  multiselectionList: any;
  documentName: string = "";
  selectedFolder: any[] = [];
  pagecount: any;
  docFolderId: any;
  getId: any;
  activeLayerIdDraw: any;
  selectedLocation: any;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DocumentPagesComponent>,
    private dialogBox: MatDialog,
  ) {
    this.getId = this.data.getId;
    this.activeLayerIdDraw = this.data.activeLayerIdDraw
    this.selectPages = this.data.selectPages;
    this.pagecount = this.data.selectPages.length;
    this.activatedAnnotationId = this.data.activatedAnnotationId;
    this.layerDatas = this.data.layerDatas;
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.multiselectionList = this.data.multiselectionList;
    this.documentName = this.data.documentName;
    this.selectedFolder = this.data.selectedFolder;
    this.docFolderId = this.data.docFolderId;
    this.selectedLocation = this.data.Location;
  }

  ngOnInit(): void {
    
  }

  openLinkPage(singlePage) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogBox.open(LinkApiPageComponent, {
      width: "380px",
      data: {
        activatedAnnotationId: this.activatedAnnotationId,
        projectFolder: this.selectedFolder,
        selectPage: singlePage,
        layerDatas: this.layerDatas,
        multipleSelectOn: this.multipleSelectOn,
        multiselectionList: this.multiselectionList,
        pageCount: this.pagecount,
        docFolderId: this.docFolderId,
        selectedLocation : this.selectedLocation,
        getId: this.getId,
        activeLayerIdDraw: this.activeLayerIdDraw
      },
    });
    this.dialogRef.close();
  }

  closeBox() {
    this.dialogRef.close();
  }
}
