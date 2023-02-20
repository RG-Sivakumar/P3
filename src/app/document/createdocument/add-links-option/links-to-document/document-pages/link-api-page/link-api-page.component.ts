import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { v1 as uuidv1 } from "uuid";
import { login } from "src/app/projectmanagement/models/login-model";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { MoreoptionService } from "src/app/projects/services/moreoption.service";
import { ActivatedRoute } from "@angular/router";
import * as _ from 'lodash';
import { MatSnackBar } from "@angular/material/snack-bar";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { SuccessComponent } from "src/app/document/success/success.component";

@Component({
  selector: "app-link-api-page",
  templateUrl: "./link-api-page.component.html",
  styleUrls: ["./link-api-page.component.css"],
})
export class LinkApiPageComponent implements OnInit {
  selectOptionValue: string = "D";
  activatedAnnotationId: string;
  projectFolder: any;
  selectPage: any;
  su: login;
  layerDatas: any[];
  show: boolean = false;
  pageId: string[] = [];
  newLinkName: string = '';
  multipleSelectOn: boolean = false;
  multiselectionList: any;
  linkCountDocument: number = 0;
  page_count: number;
  newDoc_id: string;
  pageIndex: number;
  docFolderId: any;
  getId: any;
  activeLayerIdDraw: any;
  selectedLocation: any;
  Link_option_clicked: boolean = false;
  link_names: string = "";
  projectName:string = "";

  constructor(
    private dialogRef: MatDialogRef<LinkApiPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: CreateDocumentService,
    private dataShareService: DataserviceService,
    private moreoptionservice: MoreoptionService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private encrptdecrpt:EncryptDecryptService,
    private dialogbox: MatDialog,
  ) {
    this.getId = this.data.getId;
    this.activeLayerIdDraw = this.data.activeLayerIdDraw;
    this.activatedAnnotationId = this.data.activatedAnnotationId;
    this.projectFolder = this.data.projectFolder;
    this.selectPage = this.data.selectPage;
    this.layerDatas = this.data.layerDatas;
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.multiselectionList = this.data.multiselectionList;
    this.page_count = this.data.pageCount;
    this.pageIndex = this.data.selectPage.page_number - 1;
    this.docFolderId = this.data.docFolderId;
    this.selectedLocation = this.data.selectedLocation;
    console.log(this.data);
    this.projectName = this.route.snapshot.queryParamMap.get("projectName");
    console.log(this.projectName);
  }

  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  selectOption(value) {
    this.selectOptionValue = value;
  }
  
  addLinkAuction(newLinkName) {
    this.Link_option_clicked = true;
    this.show = true;
    if (this.selectOptionValue == "N") {
      this.newDoc_id = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
      for (var i = 0; i < this.page_count; i++) {
        this.pageId.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime());
      }
      if (this.multipleSelectOn == false) {
        let uuiddate = new Date().getTime();
        let uuidCopy = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + uuiddate;
        let date = new Date().toISOString();
        if (newLinkName == "") {
          this.link_names = this.projectFolder.folder_name;
        } else {
          this.link_names = newLinkName;
        }
        this.link_names=this.duplicatecheckingname(this.link_names);
        this.selectedLocation = this.selectedLocation.split(">");
        this.selectedLocation.splice(this.selectedLocation.length - 1,1,this.link_names);
        this.selectedLocation = this.selectedLocation.join("> ");
        var createJSONCopy = {
          annotation_id: this.activatedAnnotationId,
          annotation_link_id: uuidCopy,
          created_by_user_id: this.projectFolder.created_by_user_id,
          created_date: date,
          document_id: this.newDoc_id,
          is_removed: false,
          last_updated_date: date,
          location :  this.selectedLocation,
          link_path: this.pageId[this.pageIndex],
          link_type: this.link_names,
          version_number: 0
        };
        var layers = [];
        for (var i = 0; i < this.layerDatas.length; i++) {
          var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
          if(currentAnnotationData.length>0){
          currentAnnotationData[0].annotation_links.push(createJSONCopy);
          this.linkCountDocument = currentAnnotationData[0].annotation_links.length;
          }
          layers.push(this.layerDatas[i]);
        }
      }
      else if (this.multipleSelectOn == true) {
        let templinkCountDocument = 0;
        for (var a = 0; a < this.multiselectionList.length; a++) {
          let uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
          var date = new Date().toISOString();
          if (newLinkName == "") {
            this.link_names = this.projectFolder.folder_name;
          } else {
            this.link_names = newLinkName;
          }
          this.link_names=this.duplicatecheckingname(this.link_names);
          let createJSONnew1 = {
            annotation_id: this.multiselectionList[a].annotation_id,
            annotation_link_id: uuid,
            created_by_user_id: this.su.user_id,
            created_date: date,
            document_id: this.newDoc_id,
            is_removed: false,
            last_updated_date: date,
            link_path: this.pageId[this.pageIndex],
            link_type: this.link_names,
            version_number: 0
          };
          this.multiselectionList[a].annotation_links.push(createJSONnew1);
          let findLayerIndex = this.layerDatas.findIndex((LData) => LData.layer_id === this.multiselectionList[a].layer_id);
          if (findLayerIndex != -1) {
            let findAnnotationIndex = this.layerDatas[findLayerIndex].annotations.findIndex((AData) => AData.annotation_id === this.multiselectionList[a].annotation_id);
            if (findAnnotationIndex != -1) {
              this.layerDatas[findLayerIndex].annotations[findAnnotationIndex].annotation_links = this.multiselectionList[a].annotation_links;
              templinkCountDocument = templinkCountDocument + this.layerDatas[findLayerIndex].annotations[findAnnotationIndex].annotation_links.length;
            }
          }
        }
        this.linkCountDocument = templinkCountDocument;
      }
      this.moreoptionservice.copywithoutAnnotLinks(this.projectFolder.project_id, 
        this.projectFolder.parent_folder_id, this.projectFolder.folder_id, 
        this.newDoc_id, newLinkName, this.projectFolder.folder_level, this.pageId).subscribe((res) => {
        console.log(res);
        if(res["response_code"]==200){
          this.createLayer(this.newDoc_id, this.projectFolder.project_id, this.pageId);
        }
        else{
          this.errorMessage();
        }
      });
    }
    else if (this.selectOptionValue == "C") {
      this.newDoc_id = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
      for (var i = 0; i < this.page_count; i++) {
        this.pageId.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime());
      }
      if (this.multipleSelectOn == false) {
        let uuiddate = new Date().getTime();
        let uuidCopy = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + uuiddate;
        let date = new Date().toISOString();
        if (newLinkName == "") {
          this.link_names = this.projectFolder.folder_name;
        } else {
          this.link_names = newLinkName;
        }
        this.link_names=this.duplicatecheckingname(this.link_names);
        this.selectedLocation = this.selectedLocation.split(">");
        this.selectedLocation.splice(this.selectedLocation.length - 1,1,this.link_names);
        this.selectedLocation = this.selectedLocation.join("> ");
        console.log(this.selectedLocation);
        var createJSONCopy1 = {
          annotation_id: this.activatedAnnotationId,
          annotation_link_id: uuidCopy,
          created_by_user_id: this.su.user_id,
          created_date: date,
          document_id: this.newDoc_id,
          is_removed: false,
          location :  this.selectedLocation,
          last_updated_date: date,
          link_path: this.pageId[this.pageIndex],
          link_type: this.link_names,
          version_number: 0
        };
        var layers = [];
        for (var i = 0; i < this.layerDatas.length; i++) {
          var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
          if(currentAnnotationData.length>0){
            currentAnnotationData[0].annotation_links.push(createJSONCopy1);
            this.linkCountDocument = currentAnnotationData[0].annotation_links.length;
            break;
          }
          layers.push(this.layerDatas[i]);
        }
        console.log(layers);
      }
      else if (this.multipleSelectOn == true) {
        let templinkCountDocument = 0;
        for (let a = 0; a < this.multiselectionList.length; a++) {
          console.log(this.multiselectionList[a]);
          var uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
          var date = new Date().toISOString();
          if (newLinkName == "") {
            this.link_names = this.projectFolder.folder_name;
          } else {
            this.link_names = newLinkName;
          }
          this.link_names=this.duplicatecheckingname(this.link_names);
          let createJSONExactMultiple = {
            annotation_id: this.multiselectionList[a].annotation_id,
            annotation_link_id: uuid,
            created_by_user_id: this.su.user_id,
            created_date: date,
            document_id: this.newDoc_id,
            is_removed: false,
            last_updated_date: date,
            link_path: this.pageId[this.pageIndex],
            link_type: this.link_names,
            version_number: 0
          };
          this.multiselectionList[a].annotation_links.push(createJSONExactMultiple);
          let findLayerIndex = this.layerDatas.findIndex((LData) => LData.layer_id === this.multiselectionList[a].layer_id);
          if (findLayerIndex != -1) {
            let findAnnotationIndex = this.layerDatas[findLayerIndex].annotations.findIndex((AData) => AData.annotation_id === this.multiselectionList[a].annotation_id);
            if (findAnnotationIndex != -1) {
              this.layerDatas[findLayerIndex].annotations[findAnnotationIndex].annotation_links = this.multiselectionList[a].annotation_links;
              templinkCountDocument = templinkCountDocument + this.layerDatas[findLayerIndex].annotations[findAnnotationIndex].annotation_links.length;
            }
          }
        }
        this.linkCountDocument = templinkCountDocument;
      }
      this.moreoptionservice.copywithAnnotLinks(this.projectFolder.project_id, 
        this.projectFolder.parent_folder_id, this.projectFolder.folder_id, 
        this.newDoc_id, newLinkName, this.projectFolder.folder_level, this.pageId,this.projectName).subscribe((response) => {
        console.log(response);
        if(response["response_code"] == 200){
          var generateCloneLayerExact = _.cloneDeep(this.layerDatas);
          if(this.multipleSelectOn==true){
            this.documentService.annotationMultipleUpdate(generateCloneLayerExact,this.multiselectionList,'link').subscribe((responseLayer) => {
              console.log(responseLayer);
              if (responseLayer["response_code"] == 200) {
                this.show = false;
                let layerDataTemp = {layervalue:this.layerDatas,multiplelist:this.multiselectionList};
                this.dataShareService.getIdUpdated.emit(layerDataTemp);
                this.dialogRef.close();
                this.dialogbox.open(SuccessComponent, {
                  width: '500px',
                  data: {
                    status: "true",
                    title: "copydocument",
                  }
                });
              }
              else {
                this.errorMessage();
              }
            });
          }
          else{
            this.documentService.annotationUpdateForm1(generateCloneLayerExact, this.getId, this.activeLayerIdDraw,'link').subscribe((response) => {
              console.log(response);
              if (response["response_code"] == 200) {
                this.show = false;
                this.dataShareService.getIdUpdated.emit(this.layerDatas);
                this.dialogRef.close();
                this.dialogbox.open(SuccessComponent, {
                  width: '500px',
                  data: {
                    status: "true",
                    title: "copydocument",
                  }
                });
              }
              else {
                this.errorMessage();
              }
            });
          }
        }
        else{
          this.errorMessage();
        }
      });
     
    } else if (this.selectOptionValue == "D") {
      if (this.multipleSelectOn == false) {
        console.log(newLinkName);
        console.log(this.projectFolder.folder_name);
        var uuiddate = new Date().getTime();
        var uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + uuiddate;
        var date = new Date().toISOString();
        if (newLinkName == "") {
          this.link_names = this.projectFolder.folder_name;
        } else {
          this.link_names = newLinkName;
        }
        this.link_names=this.duplicatecheckingname(this.link_names);
        this.selectedLocation = this.selectedLocation.split(">");
        this.selectedLocation.splice(this.selectedLocation.length - 1,1,this.link_names);
        this.selectedLocation = this.selectedLocation.join("> ");
        console.log(this.selectedLocation);
        // IPAD payload added
        let createlinkJSON = {
          annotation_id: this.getId,
          annotation_link_id: uuid,
          created_by_user_id: this.su.user_id,
          created_date: date,
          document_id: this.docFolderId,
          is_removed: false,
          last_updated_date: date,
          link_path: this.selectPage.page_id,
          link_type: this.link_names,
          location :  this.selectedLocation,
          version_number: 0
        };
        var layers = [];
        for (var i = 0; i < this.layerDatas.length; i++) {
          var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
          if(currentAnnotationData.length>0){
            currentAnnotationData[0].annotation_links.push(createlinkJSON);
            this.linkCountDocument = currentAnnotationData[0].annotation_links.length;
          }
          layers.push(this.layerDatas[i]);
        }
        var generateCloneLayerPage = _.cloneDeep(this.layerDatas);
        this.documentService.annotationUpdateForm1(generateCloneLayerPage, this.getId, this.activeLayerIdDraw,'link').subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
            this.show = false;
            this.dataShareService.getIdUpdated.emit(this.layerDatas);
            this.dialogRef.close();
          }
          else {
            this.errorMessage();
          }
        });
      }
      else if (this.multipleSelectOn == true) {
        let templinkCountDocument = 0;
        for (let a = 0; a < this.multiselectionList.length; a++) {
          var uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
          let date = new Date().toISOString();
          if (newLinkName == "") {
            this.link_names = this.projectFolder.folder_name;
          } else {
            this.link_names = newLinkName;
          }
          this.link_names=this.duplicatecheckingname(this.link_names);
          let createLinkMultipleJSON = {
            annotation_id: this.multiselectionList[a].annotation_id,
            annotation_link_id: uuid,
            created_by_user_id: this.su.user_id,
            created_date: date,
            document_id: this.selectPage.document_id,
            is_removed: false,
            last_updated_date: date,
            link_path: this.selectPage.page_id,
            link_type: this.link_names,
            version_number: 0
          };
          console.log(createLinkMultipleJSON);
          this.multiselectionList[a].annotation_links.push(createLinkMultipleJSON);
          let findLayerIndex = this.layerDatas.findIndex((LData) => LData.layer_id === this.multiselectionList[a].layer_id);
          if (findLayerIndex != -1) {
            let findAnnotationIndex = this.layerDatas[findLayerIndex].annotations.findIndex((AData) => AData.annotation_id === this.multiselectionList[a].annotation_id);
            if (findAnnotationIndex != -1) {
              this.layerDatas[findLayerIndex].annotations[findAnnotationIndex].annotation_links = this.multiselectionList[a].annotation_links;
              templinkCountDocument = templinkCountDocument + this.layerDatas[findLayerIndex].annotations[findAnnotationIndex].annotation_links.length;
            }
          }
        }
        this.linkCountDocument = templinkCountDocument;
        var generateCloneLayerPageM = _.cloneDeep(this.layerDatas);
        this.documentService.annotationMultipleUpdate(generateCloneLayerPageM, this.multiselectionList,'link').subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
            this.show = false;
            let layerDataTemp = {layervalue:this.layerDatas,multiplelist:this.multiselectionList};
            this.dataShareService.getIdUpdated.emit(layerDataTemp);
            this.dialogRef.close();
          }
          else {
            this.errorMessage();
          }
        });
      }
    }
  }

  duplicatecheckingname(name){
    for (var i = 0; i < this.layerDatas.length; i++) {
      var currentAnnotationData = this.layerDatas[i].annotations.find(({annotation_id})=> annotation_id == this.getId);
      var count=0;
      if(currentAnnotationData){
        if(currentAnnotationData.annotation_links!=null && currentAnnotationData.annotation_links.length>0){
          for(let k=0;k<currentAnnotationData.annotation_links.length;k++){
            if(currentAnnotationData.annotation_links[k].is_removed!=true){
              let tempname=currentAnnotationData.annotation_links[k].link_type;
              tempname=tempname.split('(');
                if(tempname[0].trim()===name.trim()){
                count=count+1;
                }
            }
          }
          if(count!=0){
            name = name.trim() + " (" + count + ")";
          }
        }
        else{
          return name;
        }
        break;
      }
      else{
        return name;
      }
    }
    return name;
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.newLinkName = changeUpperCaseProjectName;
    }
  }

  closeBox() {
    this.dialogRef.close();
  }

  createLayer(documentId, projectId, pageId) {
    var uuidDate = new Date().getTime();
    var date = new Date().toISOString();
    this.documentService
      .defaultcreateLayerLinkedPage(
        uuidDate,
        date,
        uuidv1().toUpperCase(),
        projectId,
        documentId,
        pageId
      )
      .subscribe((responseLayer123) => {
        console.log(responseLayer123);
        if (responseLayer123["response_code"] == 200) {
          var generateCloneLayer = _.cloneDeep(this.layerDatas);
          if(this.multipleSelectOn==true){
            this.documentService.annotationMultipleUpdate(generateCloneLayer, this.multiselectionList,'link').subscribe((response) => {
              console.log(response);
              if (response["response_code"] == 200) {
                this.show = false;
                let layerDataTemp = {layervalue:this.layerDatas,multiplelist:this.multiselectionList};
                this.dataShareService.getIdUpdated.emit(layerDataTemp);
                this.dialogRef.close();
              }
              else {
                this.errorMessage();
              }
            });
          }
          else{
            this.documentService.annotationUpdateForm1(generateCloneLayer, this.getId, this.activeLayerIdDraw,'link').subscribe((response) => {
              console.log(response);
              if (response["response_code"] == 200) {
                this.show = false;
                this.dataShareService.getIdUpdated.emit(this.layerDatas);
                this.dialogRef.close();
              }
              else {
                this.errorMessage();
              }
            });
          }
        }
        else {
          this.errorMessage();
        }
      });
  }

  errorMessage() {
    this.show = false;
    this._snackBar.open('Sync is an error', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }
}
