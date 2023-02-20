import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MatDialogConfig,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DocumentrenameComponent } from "./documentrename/documentrename.component";
import { DocumentswitchpageComponent } from "./documentswitchpage/documentswitchpage.component";
import { DataserviceService } from "../services/dataservice.service";
import { ManageTagComponent } from "src/app/toolbar/toolbarlist/manage-tag/manage-tag.component";
import { DocumentManagetagComponent } from "./document-managetag/document-managetag.component";
import { toggleValue } from "../models/toggleChange.model";
import { EventGlobalService } from "src/app/event-global.service";
import { FiltertoolbarComponent } from "./filtertoolbar/filtertoolbar.component";
import { ReadonlyService } from "../services/readonly.service";
import { SharedService } from "src/app/shared/shared.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-moreoption",
  templateUrl: "./moreoption.component.html",
  styleUrls: ["./moreoption.component.css"],
})
export class MoreoptionComponent implements OnInit {
  page_Data: any[];
  pagenumber: any;
  labelView: boolean;
  dateMdOtoR: any;
  myProperty = true;
  readonly_Data: any;
  isReadonly: any=false;
  layerDatas:any;
  pageName:string="";
  pageId:string="";
  documentId:string="";
  userrole: string;
  projectid: any;
  multiselect: boolean=false;
  constructor(
    private dialo: MatDialogRef<MoreoptionComponent>,
    private dialog: MatDialog,
    public _dataService: DataserviceService,
    private eventsService: EventGlobalService,
    public readonlydataService: ReadonlyService,
    private sharedService: SharedService,public userRoleGlobal: GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
   
    this.page_Data = this.data.popupdata.document_details;
    console.log(this.page_Data);
    this.projectid=this.encrptdecrpt.getItem("projectIdlocal")
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    this.layerDatas = this.data.layerData;
    console.log(this.page_Data,this.layerDatas);
    this.multiselect=this.data.multiselect;
    this.pagenumber = this.data.popupdata.pageNumber;
    console.log(this.page_Data);
    this.isReadonly = this.encrptdecrpt.getItem("viewonlys");
    this.isRapidmode = this.encrptdecrpt.getItem("rapidmodes");
    console.log(this.isReadonly);
    for(let i=0;i<this.page_Data.length;i++){
      if(this.page_Data[i].page_number==this.pagenumber){
        this.pageId = this.page_Data[i].page_id;
        this.pageName = this.page_Data[i].page_name;
        this.documentId = this.page_Data[i].document_id;
        console.log(this.pageId, this.pageName, this.documentId);
      }
    }
    this._dataService.viewOnlyModeChecked.subscribe((res)=>{
      this.isReadonly = res;
     
      // event.target.checked = res;
    })
  }

  ngOnInit(): void {
    this.readonly_Data = false;
    this._dataService.currentMessage.subscribe((message) => {
      this.labelView = message;
    });
  }
  closeBox() {
    this.dialo.close();
  }

  rename() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(DocumentrenameComponent, {
      width: "380px",
      data: {
        pageid: this.pageId,
        docid: this.documentId,
        pagename: this.pageName,
      },
    });

    this.dialo.close();
  }
  groupAnnts() {
    this._dataService.groupingAnntsTrigger.emit(true);
    this.dialo.close();
  }
  documentSwitch() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(DocumentswitchpageComponent, {
      width: "450px",
      data: {page_Data:this.page_Data,layerDatas:this.layerDatas,popupdata:this.data.popupdata},
    });
    this.dialo.close();
  }
  documentTag() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(DocumentManagetagComponent, {
      width: "380px",
      data: {
        pageid: this.pageId,
      },
    });
    this.dialo.close();
  }
  filterToolbr() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(FiltertoolbarComponent, {
      width: "450px",
    });
    this.dialo.close();
  }
  toggleVisibility(event) {
    if (event.target.checked == true) {
      this._dataService.changeMessage(true);
      this.eventsService.broadcast("labelView", true);
    } else {
      this._dataService.changeMessage(false);
      this.eventsService.broadcast("labelView", false);
    }
  }
  readOnly(event) {
    // this.readonly_Data = event.target.checked;
    // this.sharedService.nextMessage("Viewonly");
    
    if(event.target.checked==true){
      this.isReadonly=true;
      this._dataService.viewOnlyModeTrigger.emit(true);
      // localStorage.setItem("viewonlys",this.isReadonly );
      this.encrptdecrpt.setItem("viewonlys",this.isReadonly);//security
    }
    else{
      this.isReadonly=false;
      this._dataService.viewOnlyModeTrigger.emit(false);
      // localStorage.setItem("viewonlys",this.isReadonly );
      this.encrptdecrpt.setItem("viewonlys",this.isReadonly);//security
    }
  }
  isRapidmode = false
  rapidShotMode(event) {
    // this.readonly_Data = event.target.checked;
    // this.sharedService.nextMessage("Viewonly");
    
    if(event.target.checked==true){
      this.isRapidmode=true;
      this._dataService.rapidModeTrigger.emit(true);
      // localStorage.setItem("viewonlys",this.isReadonly );
      this.encrptdecrpt.setItem("rapidmodes",this.isRapidmode);//security
    }
    else{
      this.isRapidmode=false;
      this._dataService.rapidModeTrigger.emit(false);
      // localStorage.setItem("viewonlys",this.isReadonly );
      this.encrptdecrpt.setItem("rapidmodes",this.isRapidmode);//security
      this.encrptdecrpt.setItem("setbgIndexBool",false);
    }
    this.dialo.close();
  }
  setScale(){
    this.dialo.close();
    this._dataService.setScaleTrigger.emit(true);
  }
}
