import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CreateDocumentService } from "../../services/create-document.service";
import { DataserviceService } from "../../services/dataservice.service";
import { DocumentshareddataService } from "../../services/documentshareddata.service";
import { CreatedocumentComponent } from "../createdocument.component";
import * as _ from 'lodash';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-link-option-menu",
  templateUrl: "./link-option-menu.component.html",
  styleUrls: ["./link-option-menu.component.css"],
})
export class LinkOptionMenuComponent implements OnInit {
  linkOption: boolean = true;
  addRename: boolean = false;
  deletePurpose: boolean = false;
  annotationLink: any;
  getRename = "";
  activatedAnnotationId: string;
  layerDatas: any[];
  show: boolean = false;
  createComponent: any;
  multipleSelectOn: boolean = false;
  linkCountUrl: number = 0;
  multiselectionList: any[];
  annotationLinkId: string = "";
  getId: any;
  activeLayerIdDraw: any;
  id: any;
  value_id: any;
  constructor(
    private dialogRef: MatDialogRef<LinkOptionMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: CreateDocumentService,
    private dataShareService: DataserviceService,
    private documentShareDataService: DocumentshareddataService,
    private _snackBar: MatSnackBar,
  ) {
    this.annotationLink = this.data.annotationLink;
    console.log(this.annotationLink);
    this.activatedAnnotationId = this.data.activatedAnnotationId;
    this.layerDatas = this.data.layerDatas;
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.multiselectionList = this.data.multiselectionList;
    this.getId = this.data.getId;
   
    this.id=this.data.getActiveId
    console.log(this.id,this.data)
    this.activeLayerIdDraw = this.data.activeLayerIdDraw;
    console.log(this.annotationLink);
  }

  ngOnInit(): void { }

  openRename() {
    this.linkOption = false;
    this.addRename = true;
    this.deletePurpose = false;
  }

  openDelete() {
    this.linkOption = false;
    this.addRename = false;
    this.deletePurpose = true;
  }

  closeBox() {
    this.dialogRef.close();
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      this.getRename = changeUpperCaseProjectName;
    }
  }

  renameAuc(rename) {
    
    this.show = true;
    var layers = [];
    if(this.multipleSelectOn==false){
    
    for (var i = 0; i < this.layerDatas.length; i++) {
      
      var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
      if(currentAnnotationData.length>0){
        
        this.dataShareService.sendLinkedPageData(currentAnnotationData[0]);
        var currentLink = currentAnnotationData[0].annotation_links.filter((ele => ele.annotation_link_id == this.annotationLink.annotation_link_id))
        if (currentLink.length > 0) {
          currentLink[0].link_type = rename;
        }
        break;
      }
      var pass_data = {layer_data:this.layerDatas,ids:1,curren_data:"",activeId:"",index:0};    
    }
    }
  if(this.multipleSelectOn==true){
  
    var datas= this.layerDatas.filter((ele => ele.layer_id == this.activeLayerIdDraw))
    var currentAnnotationDatas = datas[0].annotations.filter((ele => ele.annotation_id == this.id))
    if(currentAnnotationDatas.length>0){
        
      this.dataShareService.sendLinkedPageData(currentAnnotationDatas[0]);
      var currentLink = currentAnnotationDatas[0].annotation_links.filter((ele => ele.annotation_link_id == this.annotationLink.annotation_link_id))
      if (currentLink.length > 0) {
        currentLink[0].link_type = rename;
      }
       pass_data = {layer_data:this.layerDatas,ids:1,curren_data:currentAnnotationDatas,activeId:this.id,index:this.data.index};
    }
  }
    
    
    this.dataShareService.mediaTagsUpdate.emit(pass_data);
    let generateCloneLayer = _.cloneDeep(this.layerDatas);
    if(this.id!=undefined){
      this.value_id=this.id
    }else{
      this.value_id=this.getId 
    }
    this.documentService.annotationUpdateForm1(generateCloneLayer, this.value_id, this.activeLayerIdDraw,'link').subscribe((response) => {
      console.log(response);
      if (response["response_code"] == 200) {
        this.show = false;
        this.dialogRef.close();
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

  deleteAuction() {
    this.show = true;
    for (var i = 0; i < this.layerDatas.length; i++) {
      var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
      console.log(currentAnnotationData);
      if(currentAnnotationData.length>0){
        this.dataShareService.sendLinkedPageData(currentAnnotationData[0]);
        let itemIndex = currentAnnotationData[0].annotation_links.findIndex(item => item.annotation_link_id == this.annotationLink.annotation_link_id);
        if(itemIndex>-1){
          currentAnnotationData[0].annotation_links[itemIndex].is_removed = true;
          var linkedPageCountCheck = currentAnnotationData[0].annotation_links.filter((data) => {
            return data.is_removed == 0;
          })
          this.linkCountUrl = linkedPageCountCheck.length

        }
      }
      
    }
    if (this.multipleSelectOn == true) {
      // let templinkCount = 0;
      // for (var i = 0; i < this.layerDatas.length; i++) {
      //   for (var j = 0; j < this.layerDatas[i].annotations.length; j++) {
      //     for (let f = 0; f < this.multiselectionList.length; f++) {
      //       if (this.multiselectionList[f].annotation_id == this.layerDatas[i].annotations[j].annotation_id) {
      //         templinkCount = templinkCount + this.layerDatas[i].annotations[j].annotation_links.length;
      //       }
      //     }
      //   }
      // }
      // this.linkCountUrl = templinkCount;
      // console.log('multiple');
    }
    //this.layerDatas = layers;
    
    let generateCloneLayer = _.cloneDeep(this.layerDatas);
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
    // this.documentService.UpdateForm(layers).subscribe((response) => {
    //   console.log(response);
    // });
  }
}
