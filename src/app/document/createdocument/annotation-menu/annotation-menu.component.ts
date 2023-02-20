import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  EventEmitter,
  Output,
} from "@angular/core";
import {
  MatDialogRef,
  MatDialogConfig,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AnnotationDeleteComponent } from "../annotation-delete/annotation-delete.component";
import { ReadonlyService } from "../../services/readonly.service";
import { DataserviceService } from "../../services/dataservice.service";
import { UseasnewtoolbarComponent } from "./useasnewtoolbar/useasnewtoolbar.component";
import { addDays } from "date-fns";
import { AddasnewtoolbarComponent } from "./addasnewtoolbar/addasnewtoolbar.component";
import { AddtotoolbarstampComponent } from "./addtotoolbarstamp/addtotoolbarstamp.component";
import { CreateDocumentService } from "../../services/create-document.service";
import { ShapeService } from "../../services/shape.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { login } from "src/app/projectmanagement/models/login-model";
import * as _ from 'lodash';
import { SetBaseIconsizeComponent } from "../../set-base-iconsize/set-base-iconsize.component";
import { DocumentPagesService } from "../../services/document-pages.service";
import { linewidthchanges } from "../documentfunctions1";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-annotation-menu",
  templateUrl: "./annotation-menu.component.html",
  styleUrls: ["./annotation-menu.component.css"],
})
export class AnnotationMenuComponent implements OnInit, AfterViewInit {
  layerDatas: any[];
  activateIdDraw: string;
  annotationId: string;
  annotationName: string;
  annotationData: any[];
  propertiesannotationData: any[];
  propertiesannotationDataString: string;
  multiselectionList: any[];
  strokeColor: string = "";
  fillColor: string = "";
  multipleSelectOn: boolean = false;
  show: boolean;
  elementHandW: any;
  rapidModeOn: boolean = false;
  toolbarElementId: number = 0;
  toolbarListData: any[];
  selectAnnotationData: any = "";
  showMoveLayerOption: boolean = false;
  formlist: any[] = [];
  defaultForms: any[] = [];
  is_stamp: any;
  su: login
  annotationstring: any;
  pagenumber: any;
  rotate: boolean=false;
  copy:boolean=false;
  coordinateX: any = 0;
  coordinateY: any = 0;
  copyannotation: boolean = false;
  single_view_svg_menu:any="";
  copyandmoveMode:string="move";
  btwenDocument_m_c_enable:boolean = false;
  cuurentpageId: any;
  rapidShotModeOn: boolean = false;
  showGroupOption: any = false;

  constructor(
    private dialogRef: MatDialogRef<AnnotationMenuComponent>,
    private dialogBox: MatDialog,
    private readonlyservice: ReadonlyService,
    private dataService: DataserviceService,
    private documentService: CreateDocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private shapeServiceMenu: ShapeService,
    private _snackBar: MatSnackBar,
    private documentPage:DocumentPagesService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.pagenumber = this.data.pagenumber
    console.log(this.pagenumber)
    this.rapidShotModeOn = this.data.rapidShotMode; 
    this.multiselectionList = this.data.multiselectionList1
    this.annotationId = this.data.annotation_id;
    console.log(this.data.multiselectionList1)
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.layerDatas = this.data.layerData;
    this.cuurentpageId=this.data.currentPage;
    this.activateIdDraw = this.data.activateIdDraw;
    this.elementHandW = this.data.singleDataReceived;
    this.headerSvgDrawing();
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.toolbarElementId = this.data.selectAnnotationData.toolbar_element_id;
    this.toolbarListData = this.data.toolbarListData;
    this.selectAnnotationData = this.data.selectAnnotationData;
    this.formlist = this.data.formlist;
    this.defaultForms = this.data.defaultForms;
    this.rotate=this.data.rotateandresize1;
    console.log('rate',this.rotate);
    this.copy=this.data.copyenable;
    console.log(this.data);
    this.showGroupOption = this.data.groupOption;
    this.rapidModeOn = this.toolbarElementId <= 9 ? true : false;
    for (var i = 0; i < this.layerDatas.length; i++) {
      for (var j = 0; j < this.layerDatas[i].annotations.length; j++) {
        if (
          this.annotationId == this.layerDatas[i].annotations[j].annotation_id
        ) {
          this.annotationData = this.layerDatas[i].annotations[j];
          this.annotationName = this.layerDatas[i].annotations[j].annotation_name;
          this.propertiesannotationDataString = this.layerDatas[i].annotations[j].annotation_data;
        }
      }
    }
    
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
  }

  async headerSvgDrawing(){
    if(this.data.singleDataReceived!=undefined){
      //header svg drawing
      let svg_changes = await this.annotation_view_svg(this.data.singleDataReceived);
       //line shapes I have assigned extra 
       let lines = [13,14,15,16];
       if(lines.includes(Number(svg_changes.toolbar_element_id))){
         svg_changes.linewidth = svg_changes.linewidth * 2;
       }
       // check resize shapes line width increase simple shapes only
       svg_changes = linewidthchanges(svg_changes);
       this.single_view_svg_menu = svg_changes;
    }
  }

  deleteAnnotation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
  
    this.dialogBox.open(AnnotationDeleteComponent, {
      width: "380px",
      data: {
        layerData: this.layerDatas,
        activateIdDraw: this.activateIdDraw,
        annotationId: this.annotationId,
        multiselectionList: this.multiselectionList,
        multipleSelectOn: this.multipleSelectOn,
        searchoption : this.data.searchoption
      },
    });
    this.dialogRef.close();
   
  }

  closeBox() {
    this.dialogRef.close();
  }
  editAnnotation() {
    this.dialogRef.close();
    if (this.multiselectionList == undefined) {
      this.dataService.editAnnotation.emit(this.annotationData);
    } else if (this.multiselectionList != undefined) {
      this.dataService.editAnnotation.emit(this.multiselectionList);
    }
  }

  rotateandResize() {
    this.rotate=true;
    this.dialogRef.close();
    this.dataService.rotateandResize.emit(this.annotationData);
  }

  alignAnnotation() {
    let sendDocumentpageData = {annotationData: this.annotationData,type: 'start'}
    this.dataService.annotationAlignment.emit(sendDocumentpageData);
    this.dialogRef.close();
  }

  public propertycanvasElement: CanvasRenderingContext2D;
  public canvasElement: CanvasRenderingContext2D;

  

  copyAnnotationwithOutData() {
    if (this.multipleSelectOn == true) {
      this.dataService.copyAnnotation.emit('withoutData');
    } else if (this.multipleSelectOn == false) {
      this.dataService.copyAnnotationSingle.emit('withoutData');
    }
    this.dialogRef.close();
  }

  copyAnnotationwithData() {
    if (this.multipleSelectOn == true) {
      this.dataService.copyAnnotation.emit('withData');
    } else if (this.multipleSelectOn == false) {
      this.dataService.copyAnnotationSingle.emit('withData');
    }
    this.dialogRef.close();
  }

  copyAnnotationwithData_multiple() {
    this.dataService.copyAnnotationMultiple.emit('withData');
    this.dialogRef.close();
  }


  usetoolbar: boolean = false;
  UseasToolbar() {
    
    // this.usetoolbar = true;
    // var annotationData = {
    //   usetoolbar: this.usetoolbar,
    //   layerdata: this.annotationData,
    // };
    // this.readonlyservice.sendMessage(annotationData);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataToSend: any[] = [];
    if (this.multipleSelectOn == true) {
      dataToSend = [...this.multiselectionList];
    }
    else {
      dataToSend.push(this.annotationData);
    }
    let dialogref = this.dialogBox.open(UseasnewtoolbarComponent, {
      width: "420px",
      data: { selectAnnotationData: this.selectAnnotationData, getannotationDatas: dataToSend, multiselect: this.multipleSelectOn },

    });
    this.dialogRef.close();
  }
  addtonewtoolbar: boolean = false;

  addasNewToolbar(e) {
    console.log(e)
    this.is_stamp = 2;
    this.addtonewtoolbar = true;
    // latest comment
    // var annotationData = {addtoolbar: this.addtonewtoolbar,addlayerdata: this.annotationData};
    // console.log(annotationData);
    // this.readonlyservice.sendAnnotationMessage(annotationData);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataToSend: any[] = [];
    if (this.multipleSelectOn == true) {
      dataToSend = [...this.multiselectionList];
    } else {
      dataToSend.push(this.annotationData);
    }
    let dialogref = this.dialogBox.open(AddasnewtoolbarComponent, {
      width: "420px",
      data: {
        toolbarListData: this.toolbarListData, formlist: this.formlist, defaultForms: this.defaultForms,
        dataToSend: dataToSend, selectAnnotationData: this.selectAnnotationData, stamp: this.is_stamp
      },
    });
    this.dialogRef.close();
  }

  removeGroupSingle(){
    this.dataService.removeGroupSingle.emit(this.annotationId);
    this.dialogRef.close();
  }


  addtostamptoolbar: boolean = false;
  AddtoToolbarStamp(e) {
  
    console.log(e)
    if (e == 1) {
      this.is_stamp = 1
    }
    else if (e == 0) {
      this.is_stamp = 0
    }
    else {
      console.log(e);
    }
    this.addtostamptoolbar = true;
    var annotationData = {
      addstamptoolbar: this.addtostamptoolbar,
      addlayerdata: this.annotationData,
    };
    
    this.readonlyservice.sendStampMessage(annotationData);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataToSend: any[] = [];
    if (this.multipleSelectOn == true) {
      dataToSend = [...this.multiselectionList];
    } else {
      dataToSend.push(this.annotationData);
    }
    let dialogref = this.dialogBox.open(AddtotoolbarstampComponent, {
      width: "420px",
      data: { toolbarListData: this.toolbarListData, dataToSend: dataToSend, selectAnnotationData: this.selectAnnotationData, stamp: this.is_stamp },
    });
    this.dialogRef.close();
  }

  setBseIcon() {
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogBox.open(SetBaseIconsizeComponent, {
      data: { annotation_data: this.elementHandW, pagenumber: this.pagenumber, layerDatas: this.layerDatas }

    });
    this.dialogRef.close();
  }

  rapidShotMode() {
    let rapidShot = { name: "rapidShot", data: this.rapidModeOn };
    this.dialogRef.close(rapidShot);
  }

  openMoveLayer() {
    console.log(this.layerDatas);
    let filterPageBasedLayers = [];
    for(var i=0;i<this.layerDatas.length;i++){
      for(var j=0;j<this.layerDatas[i].associated_pages.length;j++){
         if(this.layerDatas[i].associated_pages[j].page_id == this.cuurentpageId){
          filterPageBasedLayers.push(this.layerDatas[i]);
         }
      }
    }
    this.layerDatas=_.cloneDeep(filterPageBasedLayers);
    this.showMoveLayerOption = true;
  }

  layerSelectAction(layerId) {
    let copyData = "";
    let newAnnId;
    if (this.multipleSelectOn == false) {
      if (this.selectAnnotationData["layer_id"] != layerId) {
        this.show = true;
        for (let i = 0; i < this.layerDatas.length; i++) {
          let itemIndex = this.layerDatas[i].annotations.findIndex(item => item.annotation_id == this.annotationId);
          if (itemIndex != -1) {
            var putAnnotationData = {};
            copyData = _.cloneDeep(this.layerDatas[i].annotations[itemIndex])
            var removeAnnotationData = JSON.parse(JSON.stringify(this.layerDatas[i].annotations[itemIndex]));
            const cloneoriginalData = Object.assign({}, copyData);
            this.layerDatas[i].annotations[itemIndex]["is_removed"] = true;
            let layerFind = this.layerDatas.findIndex(layertemp => layertemp.layer_id == layerId);
            if (layerFind != -1) {
              console.log(cloneoriginalData);
              cloneoriginalData["layer_id"] = layerId;
              cloneoriginalData["annotation_id"] = this.documentService.getNewUUID();
              cloneoriginalData["is_removed"] = false;
              if (cloneoriginalData["annotation_media"].length > 0) {
                cloneoriginalData["annotation_media"].forEach(element => {
                  element["annotation_id"] = cloneoriginalData["annotation_id"];
                  element["annotation_media_id"] = this.documentService.getNewUUID();
                  element["stub_id"] = this.documentService.getNewUUID();
                });
              }
              if (cloneoriginalData["annotation_links"].length > 0) {
                cloneoriginalData["annotation_links"].forEach(element => {
                  element["annotation_id"] = cloneoriginalData["annotation_id"];
                  element["annotation_link_id"] = this.documentService.getNewUUID();
                });
              }
              putAnnotationData = cloneoriginalData;
              newAnnId = cloneoriginalData["annotation_id"];
              this.layerDatas[layerFind].annotations.push(cloneoriginalData);
            }
          }
        }
        console.log(this.layerDatas);
        let moveLayer = { name: "moveLayer", data: this.layerDatas,newID: newAnnId};
        const copyTempArray = this.layerDatas;
        const cloneCopylayerData = [];
        copyTempArray.forEach(val2 => cloneCopylayerData.push(Object.assign({}, val2)));
        console.log(cloneCopylayerData, removeAnnotationData, putAnnotationData);
        this.documentService.movelayerUpdateForm(cloneCopylayerData, removeAnnotationData, putAnnotationData).subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
            this.show = false;
            this.dialogRef.close(moveLayer);
          }
          else {
            this.errorMessage();
          }
        });
      }
      else {
        let moveLayer = { name: "moveLayer", data: this.layerDatas};
        this.dialogRef.close(moveLayer);
      }
    }
    else if (this.multipleSelectOn == true) {
      this.show = true;
      let removeSameLayerAnnotation = this.multiselectionList.filter((dataremove)=>dataremove.layer_id!=layerId)
      console.log(removeSameLayerAnnotation);
      if(removeSameLayerAnnotation.length>0){
      var deleteAnnotationPackage = [];
      var pushAnnotationPackage = [];
      for (let ms = 0; ms < removeSameLayerAnnotation.length; ms++) {
        let layerFindA = this.layerDatas.findIndex(item => item.layer_id == removeSameLayerAnnotation[ms].layer_id);
        if (layerFindA > -1) {
          let itemIndex = this.layerDatas[layerFindA].annotations.findIndex(item => item.annotation_id == removeSameLayerAnnotation[ms].annotation_id);
          if (itemIndex > -1) {
            var putAnnotationData = {};
            copyData = this.layerDatas[layerFindA].annotations[itemIndex];
            const cloneoriginalData = Object.assign({}, copyData);
            this.layerDatas[layerFindA].annotations[itemIndex]["is_removed"] = true;
            var removeAnnotationData = JSON.parse(JSON.stringify(this.layerDatas[layerFindA].annotations[itemIndex]));
            let layerFind = this.layerDatas.findIndex(layertemp => layertemp.layer_id == layerId);
            if (layerFind != -1) {
              console.log(cloneoriginalData);
              cloneoriginalData["layer_id"] = layerId;
              cloneoriginalData["annotation_id"] = this.documentService.getNewUUID();
              cloneoriginalData["is_removed"] = false;
              if (cloneoriginalData["annotation_media"].length > 0) {
                cloneoriginalData["annotation_media"].forEach(element => {
                  element["annotation_id"] = cloneoriginalData["annotation_id"];
                  element["annotation_media_id"] = this.documentService.getNewUUID();
                  element["stub_id"] = this.documentService.getNewUUID();
                });
              }
              if (cloneoriginalData["annotation_links"].length > 0) {
                cloneoriginalData["annotation_links"].forEach(element => {
                  element["annotation_id"] = cloneoriginalData["annotation_id"];
                  element["annotation_link_id"] = this.documentService.getNewUUID();
                });
              }
              putAnnotationData = cloneoriginalData;
              this.layerDatas[layerFind].annotations.push(cloneoriginalData);
              deleteAnnotationPackage.push(removeAnnotationData);
              pushAnnotationPackage.push(cloneoriginalData);
              console.log(deleteAnnotationPackage,pushAnnotationPackage);
            }
          }
        }
      }
      
      let moveLayer = { name: "moveLayer", data: this.layerDatas,newID: newAnnId  };
      const copyTempArray = this.layerDatas;
      const cloneCopylayerData = [];
      copyTempArray.forEach(val2 => cloneCopylayerData.push(Object.assign({}, val2)));
      this.documentService.movelayerMultipleUpdateForm(cloneCopylayerData, deleteAnnotationPackage, pushAnnotationPackage).subscribe((response) => {
        console.log(response);
        if (response["response_code"] == 200) {
          this.show = false;
          this.dialogRef.close(moveLayer);
        }
        else {
          this.errorMessage();
        }
      });
      }
      else{
        let moveLayer = { name: "moveLayer", data: this.layerDatas };
        this.dialogRef.close(moveLayer);
      }
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

  async annotation_view_svg(changedata:any) {
    let clone_deep_data = _.cloneDeep(changedata);
    let get_svgPath = this.documentPage.changesvgpath(clone_deep_data,'annotationmenu',true);
    return get_svgPath;
  }

  moveAnnotation_btw_Document(){
    this.btwenDocument_m_c_enable = true;
    this.copyandmoveMode = "move";
  }

  moveAnnotation_btw_Document_direct(){
    this.copyandmoveMode = "move";
    let copy_move_temp = {name:"btw_doc_copy_move",type:"move_with_data"};
    this.dialogRef.close(copy_move_temp);
  }

  copyAnnotation_btw_Document(){
    this.btwenDocument_m_c_enable = true;
    this.copyandmoveMode = "copy";
  }

  wdata_anot_btw_doc(){
    let copy_move_temp = {name:"btw_doc_copy_move",type:"move_with_data"};
    if(this.copyandmoveMode=='move'){
      copy_move_temp = {name:"btw_doc_copy_move",type:"move_with_data"};
    }
    else if(this.copyandmoveMode=='copy'){
      copy_move_temp = {name:"btw_doc_copy_move",type:"copy_with_data"};
    }
    this.dialogRef.close(copy_move_temp);
  }

  wodata_anot_btw_doc(){
    let copy_move_temp = {name:"btw_doc_copy_move",type:"move_without_data"};
    if(this.copyandmoveMode=='move'){
      copy_move_temp = {name:"btw_doc_copy_move",type:"move_without_data"};
    }
    else if(this.copyandmoveMode=='copy'){
      copy_move_temp = {name:"btw_doc_copy_move",type:"copy_without_data"};
    }
    this.dialogRef.close(copy_move_temp);
  }

  
  

}
