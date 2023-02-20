import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router, RouterEvent } from "@angular/router";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { DocumentshareddataService } from "src/app/document/services/documentshareddata.service";
import * as _ from 'lodash';
import { MatSnackBar } from "@angular/material/snack-bar";
import { documentdatas } from "../../datamanage";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-deletemedia",
  templateUrl: "./deletemedia.component.html",
  styleUrls: ["./deletemedia.component.css"],
})
export class DeletemediaComponent implements OnInit {
  
  layerDatas: any;
  multipleSelectOn: boolean = false;
  multiselectionList: any[];
  mediaCount: number = 0;
  message: any;
  activeLayerIdDraw: any;
  stubData:any;
  show: boolean = false;
  constructor(
    private dialo: MatDialogRef<DeletemediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: DataserviceService,
    private documentService: CreateDocumentService,
    private documentShareDataService: DocumentshareddataService,
    public router: Router,
    private _snackBar: MatSnackBar,
    private encrptdecrpt:EncryptDecryptService
  ) {
    console.log(this.data.deletes)
    this.stubData = data.stubData;
    console.log(this.stubData);
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.layerDatas = this.data.layerDatas;
    this.multiselectionList = this.data.multiselectionList;
    this.message = this.data.message;
    this.activeLayerIdDraw = this.data.activeLayerIdDraw
    console.log(this.layerDatas,this.data.getId);

  }

  ngOnInit(): void { }
  closeBox() {
    this.dialo.close();
  }
  delete() {
    this.show=true;
    let layers = [];
    if (this.layerDatas != undefined) {
      for (var i = 0; i < this.layerDatas.length; i++) {
        
        var currentAnnotationMediaData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.data.getId))
        if(currentAnnotationMediaData.length>0){
          this.dataService.sendMessage(currentAnnotationMediaData[0]);
          let mediaData = currentAnnotationMediaData[0].annotation_media.filter(item => item.stub_id == this.data.stubIdData);
          if(mediaData.length>0){
            mediaData[0].is_removed = true;
            mediaData[0].is_changed = true;
            mediaData[0].last_updated_date = new Date().toISOString();
            var mediaCountCheck = currentAnnotationMediaData[0].annotation_media.filter((data) => {
              return data.is_removed == 0;
            })
            this.mediaCount = mediaCountCheck.length;
            break;
          }
        }
      }
      // this.documentShareDataService.updatemediaCount(this.mediaCount);
       // update createdocument page Is media value true reflect the changes 
      let pass_data = {layer_data:this.layerDatas,ids:-1};
      this.dataService.mediaTagsUpdate.emit(pass_data);
      console.log(this.router.url);
      if (this.router.url.includes("previewImage")) {
        this.dataService.searchLayerDatas.emit(this.layerDatas);
        let make_object = {type:"delete",annotation_id:this.data.getId,stub_id:this.data.stubIdData}
        // localStorage.setItem("deleted_stub",JSON.stringify(make_object));
        this.encrptdecrpt.setItem("deleted_stub",make_object);//security
      }
      let generateCloneLayer = _.cloneDeep(this.layerDatas);
     
      this.documentService.annotationUpdateForm1(generateCloneLayer,this.data.getId, this.activeLayerIdDraw,'media').subscribe((response) => {
        console.log(generateCloneLayer,this.data.getId)
        console.log(response);
        if (response["response_code"] == 200) {
          this.show = false;
          this.dialo.close();
        }
        else {
          this.errorMessage();
        }
      });
      // this.documentService.annotationUpdateForm(this.layerDatas)
      //   .subscribe((response) => {
      //     console.log(response);
      //   });
    }
  }
  delete1() {
    this.show=true;
    let layers = [];

    if (this.layerDatas != undefined) {
      for (var i = 0; i < this.layerDatas.length; i++) {
        
        var currentAnnotationMediaData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.stubData.annotation_id))
        if(currentAnnotationMediaData.length>0){
          // this.dataService.sendMessage(currentAnnotationMediaData[0]);
          let mediaData = currentAnnotationMediaData[0].annotation_media.filter(item => item.stub_id == this.stubData.stub_id);
          if(mediaData.length>0){
            mediaData[0].is_removed = true;
            mediaData[0].is_changed = true;
            mediaData[0].last_updated_date = new Date().toISOString();
            var mediaCountCheck = currentAnnotationMediaData[0].annotation_media.filter((data) => {
              return data.is_removed == 0;
            })
            this.mediaCount = mediaCountCheck.length;
            break;
          }
        }
      }
      // this.documentShareDataService.updatemediaCount(this.mediaCount);
      let ids = {"annotation_id":this.stubData.annotation_id,"stub_id":this.stubData.stub_id}
      let pass_data = {layer_data:this.layerDatas,ids:ids};
      this.dataService.mediaTagsUpdate.emit(pass_data);
      console.log(this.router.url);
      if (this.router.url.includes("previewImage")) {
        console.log('previewpage');
        this.dataService.searchLayerDatas.emit(this.layerDatas);
      }
      let generateCloneLayer = _.cloneDeep(this.layerDatas);
     
      this.documentService.annotationUpdateForm1(generateCloneLayer, this.stubData.annotation_id, this.activeLayerIdDraw,'media').subscribe((response) => {
        console.log(generateCloneLayer,this.data.getId)
        console.log(response);
        if (response["response_code"] == 200) {
          this.show = false;
          this.dialo.close();
        }
        else {
          this.errorMessage();
        }
      });
      // this.documentService.annotationUpdateForm(this.layerDatas)
      //   .subscribe((response) => {
      //     console.log(response);
      //   });
    }
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
