import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialog,
} from "@angular/material/dialog";
import { DocumentPagesComponent } from "./document-pages/document-pages.component";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-links-to-document",
  templateUrl: "./links-to-document.component.html",
  styleUrls: ["./links-to-document.component.css"],  
})

export class LinksToDocumentComponent implements OnInit, AfterViewInit {
  projectFolderList: any[];
  documentDetails: any[];
  activatedAnnotationId: string;
  searhWorkLinktoDocument: any;
  layerDatas: any[];
  show: boolean = false;
  linkDocument: boolean = false;
  multipleSelectOn: boolean = false;
  multiselectionList: any;
  documentname: any;
  documentList: any[] = [];
  allDocumentPages: any[];
  getId: any;
  activeLayerIdDraw: any;
  projectName: any;
  constructor(
    private dialogRef: MatDialogRef<LinksToDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogBox: MatDialog,
    private route: ActivatedRoute,
    private dataService:DataService,
  ) {
    this.getId = this.data.getId;
    this.activeLayerIdDraw = this.data.activeLayerIdDraw;
    this.linkDocument = this.data.linkDocument;
    this.projectName = this.data.projectName;
    this.projectFolderList = this.data.projectFolderList;
    this.documentDetails = this.data.documentDetails;
    this.layerDatas = this.data.layerDatas;
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.multiselectionList = this.data.multiselectionList;
    this.activatedAnnotationId = this.data.activatedAnnotationId;
    this.allDocumentPages = this.data.allDocumentPages;
    console.log(this.data);
    this.documentList = this.projectFolderList.filter((data) => {
      return data.is_folder_flag == 0;
    });
    for (let i = 0; i < this.documentList.length; i++) {
      this.documentList[i].folder_name = this.dataService.changeSpecialtoKeyFormat(this.documentList[i].folder_name);
      this.documentList[i]["Location"] = this.getLocation(this.documentList[i]);
      let count = 0;
      for (let j = 0; j < this.allDocumentPages.length; j++) {
        if (this.documentList[i].folder_id == this.allDocumentPages[j].document_id) {
          count = count + 1;
          this.documentList[i].totalPages = count;
        }
      }
    }
  }

  ngOnInit(): void {
    this.documentname = this.route.snapshot.queryParamMap.get("documentName");
  }

  ngAfterViewInit() {
    
  }
  
  openDocumentPages(projectFolder) {
    let selectPages = this.allDocumentPages.filter((data) => {
      if (data.document_id == projectFolder['folder_id']) {
        return data;
      }
    });
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogBox.open(DocumentPagesComponent, {
      width: "380px",
      data: {
        selectPages: selectPages,
        activatedAnnotationId: this.activatedAnnotationId,
        layerDatas: this.layerDatas,
        multipleSelectOn: this.multipleSelectOn,
        multiselectionList: this.multiselectionList,
        documentName: projectFolder['folder_name'],
        selectedFolder: projectFolder,
        Location:projectFolder["Location"],
        docFolderId: projectFolder['folder_id'],
        getId: this.getId,
        activeLayerIdDraw: this.activeLayerIdDraw
      },
    });
    this.dialogRef.close();
  }

  getLocation(details) {
    let findDocumentDetails = this.projectFolderList.find(({folder_id}) => folder_id == details.folder_id);
    // let filterDocumentDetails = this.projectFolderList.filter((folderList) => {
    //   if (folderList.folder_id == details.folder_id) {
    //     return folderList;
    //   }
    // });
    if (findDocumentDetails) {
      let searchFolderId = findDocumentDetails.folder_id;
      let searchLevel = findDocumentDetails.folder_level;
      let searchDisplayFolder = [];
      searchDisplayFolder.push(searchFolderId);
      for (let count = searchLevel; count > 0; count--) {
        let filterSearchArray = this.projectFolderList.find(({folder_id}) => folder_id == searchFolderId);
        if(filterSearchArray){
          searchDisplayFolder.push(filterSearchArray.parent_folder_id);
          searchFolderId = filterSearchArray.parent_folder_id;
        }
      }
      let finalArray = [];
      for (let j = 0; j < searchDisplayFolder.length; j++) {
        let filterIdPick = this.projectFolderList.find(({folder_id}) => folder_id == searchDisplayFolder[j]);
        if(filterIdPick){
          finalArray.push(filterIdPick);
        }
      }
      finalArray = finalArray.filter((value, index) => finalArray.indexOf(value) === index);
      let sortFolderLevel = finalArray.sort((a, b) => a.folder_level - b.folder_level);
      let generateLocation = 'Location: ' + this.projectName + ' > ';
      for (let j = 0; j < sortFolderLevel.length; j++) {
        if (j != sortFolderLevel.length - 1) {
          generateLocation = generateLocation + sortFolderLevel[j].folder_name + ' > ';
        }
        else {
          generateLocation = generateLocation + sortFolderLevel[j].folder_name;
        }
      }
      generateLocation = this.dataService.changeSpecialtoKeyFormat(generateLocation);
      return generateLocation;
    }
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.searhWorkLinktoDocument = changeUpperCaseProjectName;
    }
  }

  closeBox() {
    this.dialogRef.close();
  }

}
