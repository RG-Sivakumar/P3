import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CreateDocumentService } from "../../services/create-document.service";
import { DataserviceService } from "../../services/dataservice.service";
import * as _ from 'lodash';

@Component({
  selector: "app-annotation-delete",
  templateUrl: "./annotation-delete.component.html",
  styleUrls: ["./annotation-delete.component.css"],
})
export class AnnotationDeleteComponent implements OnInit {
  layerDatas: any[];
  annotationId: string;
  activateIdDraw: string;
  multipleSelectOn: boolean = false;
  show: boolean = false;
  multipleSelectionlist: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: CreateDocumentService,
    private dialogRef: MatDialogRef<AnnotationDeleteComponent>,
    private dataService: DataserviceService,
    private _snackBar: MatSnackBar
  ) {
    // this.dataService.searchselector.emit(false)
    this.annotationId = this.data.annotationId;
    this.layerDatas = this.data.layerData;
    this.activateIdDraw = this.data.activateIdDraw;
    this.multipleSelectionlist = this.data.multiselectionList;
    console.log(this.multipleSelectionlist);
    this.multipleSelectOn = this.data.multipleSelectOn;
    console.log(this.data);
  }
  ngOnInit(): void { }

  deleteAnnotationAuc() {
    console.log(this.layerDatas);
    this.show = true;
    if (this.multipleSelectOn == false) {
      for (var i = 0; i < this.layerDatas.length; i++) {
        let itemIndex = this.layerDatas[i].annotations.findIndex(item => item.annotation_id == this.annotationId);
        if (itemIndex != -1) {
          this.layerDatas[i].annotations[itemIndex].is_removed = true;
        }
      }
      let cloneDeleteData = _.cloneDeep(this.layerDatas);
      const send_document_page = Object.assign([], this.layerDatas);
      console.log(send_document_page);
      this.dataService.passValue(this.annotationId);
      this.documentService.annotationUpdateForm1(cloneDeleteData, this.annotationId, this.activateIdDraw,'property').subscribe((response) => {
        console.log(response);
        if (response["response_code"] == 200) {
          this.show = false;
      
          console.log(this.annotationId)
          
          this.dataService.statusUpdated.emit({'delete':send_document_page,'id':this.annotationId});
          this.dialogRef.close();
         
        }
        // else {
        //   this.errorMessage();
        // }
      });
    }
    else if (this.multipleSelectOn == true) {
      for (let da = 0; da < this.multipleSelectionlist.length; da++) {
        let findLayerIndex = this.layerDatas.findIndex((LData) => LData.layer_id === this.multipleSelectionlist[da].layer_id);
        if (findLayerIndex != -1) {
          let findAnnotationIndex = this.layerDatas[findLayerIndex].annotations.findIndex((AData) => AData.annotation_id === this.multipleSelectionlist[da].annotation_id);
          if (findAnnotationIndex != -1) {
            this.layerDatas[findLayerIndex].annotations[findAnnotationIndex].is_removed = true;
            this.multipleSelectionlist[da].is_removed = true;
          }
        }
      }

      let generateCloneLayer = _.cloneDeep(this.layerDatas);
      let clone_multi_anot = _.cloneDeep(this.multipleSelectionlist);
      console.log(this.multipleSelectOn, this.multipleSelectionlist)
      this.dataService.statusUpdated.emit({'delete':this.layerDatas,'id':clone_multi_anot});
      this.documentService.annotationMultipleUpdate(generateCloneLayer, clone_multi_anot,'property').subscribe((responseLayer) => {
        console.log(responseLayer);
        if (responseLayer["response_code"] == 200) {
          this.show = false;
        
          this.dataService.statusUpdated.emit({'delete':this.layerDatas,'id':clone_multi_anot});
          this.dialogRef.close();
        }
        else {
          this.errorMessage();
        }
      });

    }
  }

  //   console.log(this.layerDatas);
  //   this.dataService.statusUpdated.emit(this.layerDatas);
  //   this.dataService.imageChangeDocHeader.emit(true);
  //   this.documentService.deleteAnnotation(this.layerDatas).subscribe((response) => {
  //     console.log(response);
  //   });
  //   this.dialogRef.close();
  // }


  closeBox() {
    this.dialogRef.close();
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
