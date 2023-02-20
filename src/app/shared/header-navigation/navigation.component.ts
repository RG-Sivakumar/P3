import {
  Component,
  AfterViewInit,
  EventEmitter,
  Output,
  OnInit,
  Renderer2,
  OnDestroy,
} from "@angular/core";
import {
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { StartSortComponent } from "src/app/sort-function/start-sort/start-sort.component";
import { MatTableDataSource } from "@angular/material/table";
import { ProjectlistService } from "src/app/project-dashboard/my-project/services/projectlist.service";
import { RouterEvent, Router, ActivatedRoute } from "@angular/router";
import { SearchService } from "src/app/search.service";
import { DataService } from "src/app/data.service";
import { EventGlobalService } from "src/app/event-global.service";
import { ValueService } from "src/app/value.service";
import { HeadertitleService } from "src/app/headertitle.service";
import { SharedService } from "../shared.service";
import { SettingPageComponent } from "src/app/document/setting-page/setting-page.component";
import { LayersPageComponent } from "src/app/document/layers-page/layers-page.component";
import { MoreoptionComponent } from "src/app/document/moreoption/moreoption.component";
import { tr } from "date-fns/locale";

import { Subscription } from "rxjs";
import { DocumentPagesService } from "src/app/document/services/document-pages.service";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { ShareOptionComponent } from "src/app/document/createdocument/share-option/share-option.component";
import { DocumentshareddataService } from "src/app/document/services/documentshareddata.service";
import { AddStubsComponent } from "src/app/projects/add-stubs/add-stubs.component";
import { environment } from "src/environments/environment.prod";
import { NoParentComponent } from "src/app/projects/no-parent/no-parent.component";
import { DocumentswitchpageComponent} from "src/app/document/moreoption/documentswitchpage/documentswitchpage.component";
import { Shareoption1Component } from "src/app/document/shareoption1/shareoption1.component";
import { ProjectfolderService } from "src/app/projects/services/projectfolder.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { stubTrue } from "lodash";
import { login } from "src/app/projectmanagement/models/login-model";
import { AlertmessageComponent } from "src/app/document/alertmessage/alertmessage.component";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { DocumentdetailsService } from "src/app/document/services/documentdetails.service";
import { document_input } from "src/app/document/models/documentmodel";
import { DeviceDetectorService } from "ngx-device-detector";
declare var $: any;

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
})

export class NavigationComponent implements AfterViewInit, OnInit, OnDestroy {
  page_Data: any[];
  @Output() toggleSidebar = new EventEmitter<void>();
  public config: PerfectScrollbarConfigInterface = {};
  listData: MatTableDataSource<any>;
  booleanvalue=true;
  disable1=false;
  public showSearch = false;
  list: any;
  sidebarnavItems: any;
  addprojectbutton: boolean;
  title: string;
  rotateandresize:boolean=false;
  mainTitle: string;
  showbutton = false;
  showbuttonToolbar = false;
  showFilter = true;
  selectedItem: any = "";
  showTitle: boolean = false;
  showdoc: boolean = false;
  showList: Boolean = false;
  buildActive: boolean = true;
  previewActive: boolean = false;
  publishActive: boolean = false;
  sorting: boolean = false;
  popupdata: any;
  pagenumber: any;
  projectId: string;
  projectName: string;
  setMainTitleCol: string = "col-lg-9";
  setFormTitleCol: string = "col-lg-4";
  totalPages: number = 1;
  singlePageNumber: number = 1;
  imgUrl: any = "assets/images/icons/P3WebIcon_Copy_White.png";
  multiselectimageToggle: boolean = false;
  moveElementHeaderValue: boolean = false;
  moveElementImg: any = "assets/images/icons/P3WebIcon_38Move_White.png";
  searchOptionToggle: boolean = false;
  folderId: string;
  layerPageSend$: Subscription;
  width: any;
  subscription: Subscription;
  pageName: string = "";
  layerDatasSearch: any;
  documentDetails: any;
  getMessage$: Subscription;
  pageName$: Subscription;
  searchLayerDatas$: Subscription;
  documentlistSend$: Subscription;
  imageChangeDocHeader$: Subscription;
  imageChangeDocHeaderSearch$: Subscription;
  sharedService$: Subscription;
  sendPageNumber$: Subscription;
  value_get$:Subscription;
  singlePagenumber$: Subscription;
  checkedAnnotationId$: Subscription;
  doc_path$: Subscription;
  setwidth$: Subscription;
  setHeight$: Subscription;
  docName$: Subscription;
  checkedAnnotationIdsBackup: any[] = [];
  currentPageId: string = "";
  currentPageId$: Subscription;
  previousDocumentData: any = {};
  previousRoute: string = "";
  getOpenLinkWindow: any = false;
  repointAccess$: Subscription;
  showUploadButton: boolean = false; searchIcon: string;
  docpath: any;
  width1: any;
  disable: boolean = false;
  height1: any;
  titles: any;
  title1: any;
  Allsubscription: Subscription;
  showcsv: boolean = false;
  synImage: boolean = false;
  layerColor: boolean = false;
  currentPageSync$: Subscription;
  projectid: string;
  userrole: any;
  closesearch$: Subscription;
  forms$: Subscription;
  moveElementRemove$: Subscription;
  closelayerbox$: Subscription;
  rotateValidSub$: Subscription;
  setScaleTriggerSubscribeNav$:Subscription;
  setScaleNav:boolean=false;
  isReadonly: any;
  moveflag1:any;
  su: login;
  multi_select$: Subscription;
  show: boolean=false;
  rapidmodeBool: any = false;
  setbgBool: any = false;
  deviceInfo: any;
  showUploadButtons: boolean=false;
  selection: any=false;
  copyAnnMultipleOption$: Subscription;
  copyMultipleEnable: boolean = false;
  alignAnnotationSelected$: Subscription;
  alignAnnotationEnable: boolean = false;
  groupingEnable: any = false;
  groupAnntsEnbled$: Subscription;


  constructor(
    public userRoleGlobal: GlobalUserRoleService,
    public service: ProjectlistService,
    private dialog: MatDialog,
    public router: Router,
    public send: ValueService,
    public search: SearchService,
    private sendData: DataService,
    private eventsService: EventGlobalService,
    private headerService: HeadertitleService,
    private sharedService: SharedService,
    public _dataService: DataserviceService,
    private activateRoute: ActivatedRoute,
    private documentPage: DocumentPagesService,
    public dataService1: DocumentshareddataService,
    private projectIdService: ProjectfolderService,
    private encrptdecrpt:EncryptDecryptService,
    private document_credential:DocumentdetailsService,
    public deviceService: DeviceDetectorService
  ) {

    console.log(this.searchOptionToggle);
    console.log(this.userRoleGlobal.disableMode);
    // this.page_Data = this.data.popupdata.data;
    // this.layerDatas = this.data.layerData;
    this.value_get$=this.projectIdService.autocademit.subscribe((data)=>{
     this.selection=data.selected
     console.log( this.selection,"asssssssssssssssssssssss")
    })
    this.projectIdService.data.subscribe((data) => {
      console.log(typeof data, data);
      this.projectId = data.projectId;
      this.projectName = data.projectName;
      console.log(this.projectId, this.projectName);
      if (data == '1') {
        this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
        this.projectName = this.encrptdecrpt.getItem("projectName");
        console.log(this.projectId, this.projectName);
      }
    });
    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log(this.deviceInfo);
    if( this.deviceInfo.os=="Windows"){
this.showUploadButtons=true
  }else if( this.deviceInfo.os.includes("Mac")){
    this.showUploadButtons=true 
  }else{
    this.showUploadButtons=false
  }
    this._dataService.viewOnlyModeTrigger.subscribe((isReadyOnly: any) => {
      this.isReadonly = isReadyOnly;
    });

    this.groupAnntsEnbled$ =  this._dataService.groupingAnntsTrigger.subscribe((data: any) => {
      this.groupingEnable = data;
    });
    
this._dataService.searchselector.subscribe(res=>{
  
  if(res==false){
    this.searchOptionToggle=false
    this.searchImage = "assets/images/header/P3_SearchIcon _White.png";
  }else{
    this.searchOptionToggle=true
    this.searchImage = "assets/images/P3_SearchIcon _Orange.png";
  }
})
    this._dataService.userroleshare.subscribe((role: any) => {
      this.userrole = role;
      console.log(this.userrole);
    });
    // this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.folderId = this.activateRoute.snapshot.queryParamMap.get("folderId");
    console.log(this.folderId);
    // this.projectName = this.activateRoute.snapshot.queryParamMap.get("projectName");

    this.getOpenLinkWindow = this.activateRoute.snapshot.queryParamMap.get("openLinkWindow");
    this.docName$ = this.headerService.title.subscribe((title) => {
      let get_title = title;
      this.title = this.sendData.changeSpecialtoKeyFormat(get_title);
      console.log(this.title)
    });
    // this.pageName$ = this._dataService.pageName.subscribe((data) => {
    //   let get_page_name = data;
    //   this.pageName = this.sendData.changeSpecialtoKeyFormat(get_page_name);
    // }); done
    this.searchLayerDatas$ = this._dataService.searchLayerDatas.subscribe((data) => {
      this.layerDatasSearch = data;
    });
    // this.documentlistSend$ = this._dataService.documentlistSend.subscribe((response) => {
    //   this.documentDetails = response;
    //   console.log(this.documentDetails); done
    // });
    this.documentlistSend$ = this.document_credential.current_documents_data.subscribe((response:document_input)=>{
      console.log(response)
      if(response != null){
        this.documentDetails = response.document_details;
        this.popupdata = response;
        this.totalPages = this.documentDetails.length;
        this.singlePageNumber = response.pageNumber;
        this.currentPageId = response.currentPageId;
        this.pageName = this.sendData.changeSpecialtoKeyFormat(response.pageName);
      }
    });
    // this.doc_path$ = this._dataService.doc_path.subscribe((response) => {
    //   this.docpath = response;
    //   console.log(this.docpath);
    // }); no need
    this.imageChangeDocHeader$ = this._dataService.imageChangeDocHeader.subscribe((data) => {
      this.multiselectimageToggle = true;
      this.selectMultiIcons();
    });
    this._dataService.moveAccessCancel.subscribe((data) => {
      this.moveElementHeaderValue = true;
      this.moveElementAccess();
    });
    this.moveElementRemove$ =  this._dataService.moveAccessRemove.subscribe((data) => {
      this.moveElementRemove();
    });
     this.closelayerbox$ = this._dataService.layerBoxCloseTrigger.subscribe((data) => {
       this.closeLayerBox();
     });
    // this._dataService.repointAccess.subscribe((data) => {
    //   this.moveElementHeaderValue = true;
    //   this.moveElementAccess();
    // });
    // this.closesearch$=this._dataService.closesearchfromdocument.subscribe((ids: any) => {
    //   this.searchOptionToggle = false;
    //   this.searchImage = "assets/images/header/P3_SearchIcon _White.png";
    // });

    this.checkedAnnotationId$ = this._dataService.checkedAnnotationId.subscribe((ids: any) => {
      this.checkedAnnotationIdsBackup = ids;
    });
    this.multi_select$ =  this._dataService.multiSelectFooter.subscribe((multiple:any)=>{
        if(multiple == false ){
          this.imgUrl = "assets/images/icons/P3WebIcon_Copy_White.png";
          this.multiselectimageToggle = false;
        }else{
          this.imgUrl = "assets/images/icons/P3WebIcon_Copy_Orange.png";
          this.multiselectimageToggle = true;
        }
    });

    this.imageChangeDocHeaderSearch$ = this._dataService.imageChangeDocHeaderSearch.subscribe((data) => {
      this.multiselectimageToggle = data;
      this.searchOptionClose(data);
    });
    this.layerPageSend$ = this._dataService.navgiationSendData.subscribe(
      (layerDatas: any) => {
        this.layerDatas = layerDatas;
      }
    );
    this.sharedService$ = this.sharedService.listen().subscribe((m: any) => {
      this.BuildToolbar();
      this.ngOnInit();
    });
    // this.sendPageNumber$ = this.documentPage.sendPageNumber.subscribe((data) => {
    //   this.totalPages = data; done
    // });
    // this.singlePagenumber$ = this.documentPage.singlePagenumber.subscribe((data) => {
    //   this.singlePageNumber = data; done
    // });
    // this.currentPageId$ = this.documentPage.currentPageId.subscribe((data) => {
    //   this.currentPageId = data; done
    // });
    this.currentPageSync$ = this._dataService.synActionCompleteNew.subscribe((data) => {
      this.synImage = data;
      this.show=false;
    });
    this.closeSearch();
    router.events.forEach((event) => {
      if (event instanceof RouterEvent) {
        if (event["url"].includes("settings/my-profile") || event["url"].includes("projectdashboard/support") || event["url"].includes("projectdashboard/About") || event["url"].includes("settings/signout") || event["url"].includes("formbuilder/formSupport")) {
          this.disable = true;
          this.disable1=true;
          this.showSearch = false
        }
        else{
          this.disable = false;
          this.disable1=false;
        }
        if (event["url"].includes("document/documentview")) {
          this.showdoc = true;
          this.showFilter = true;
          this.sorting = false;
           this.imgUrl="assets/images/icons/P3WebIcon_Copy_White.png";
          this.searchImage = "assets/images/header/P3_SearchIcon _White.png";
          this.moveElementImg = "assets/images/icons/P3WebIcon_38Move_White.png";
        } else {
          this.showdoc = false;
          this.sorting = true;
        }
      }
      if (event instanceof RouterEvent) {
        if (event["url"].includes("formbuilder/formEdit?")) {
          this.showbutton = true;
          this.showFilter = false;
          this.headerService.maintitle.subscribe((mainTitle) => {
            this.mainTitle = mainTitle;
          });
          this.forms$ = this._dataService.formoption.subscribe((statuss: boolean) => {
            this.showbutton = statuss
            console.log(this.showbutton);
          })
          this.setFormTitleCol = "col-lg-7";
        } else if (event["url"].includes("toolbar/toolbardesign")) {
          this.setFormTitleCol = "col-lg-7";
        } else {
          this.setFormTitleCol = "col-lg-4";
          this.showbutton = false;
          this.showFilter = true;
        }
      }

      if (event instanceof RouterEvent) {
        if (event["url"].includes("toolbar/toolbardesign")) {
          this.showbuttonToolbar = true;
          this.showFilter = false;
          this.forms$ = this._dataService.formoption.subscribe((statuss: boolean) => {
            this.showbuttonToolbar = statuss
            console.log(this.showbutton);
          })
        } else {
          this.showbuttonToolbar = false;
          // this.showFilter = true;
        }
        if (event["url"].includes("projectsection/mainproject") || event["url"].includes("formbuilder/formlist") || event["url"].includes("toolbar/toolbarlist") || event["url"].includes("projectsection/Hidden") || event["url"].includes("formbuilder/formSupport")) {
          this.showUploadButton = true;
          this.showcsv = true;
         
          this.searchIcon = "230px";
        } else {
          this.searchIcon = "130px";
          this.showcsv = false;
          this.showUploadButton = false;
         
        }
      }
    });
    router.events.forEach((event) => {
      if (event instanceof RouterEvent) {

        if (event["url"].includes("formbuilder/formEdit?") || event["url"].includes("toolbar/toolbardesign") ||
          event["url"].includes("document/documentview")
        ) {

          this.showTitle = true;
        } else {
          this.showTitle = false;
        }
      }
    });
    this.setScaleTriggerSubscribeNav$ = this._dataService.setScaleTrigger.subscribe(
      (status: any) => {
        this.setScaleNav = status;
      }
    );
    this.copyAnnMultipleOption$ = this._dataService.copyAnnotationMultiple.subscribe((status:any)=>{
       console.log(status);
       if(status == "withData"){
        this.copyMultipleEnable = true;
       }
       else if(status == "false"){
        this.copyMultipleEnable = false;
       }
    })
    this.alignAnnotationSelected$ = this._dataService.annotationAlignment.subscribe((status)=>{
      if(status.type == "start"){
        this.alignAnnotationEnable = true;
      }
      else if(status.type == "end"){
        this.alignAnnotationEnable = false;
      }
    })
  
  }
  ngOnInit(): void {
    this.headerService.maintitle.subscribe((mainTitle) => {
      this.mainTitle = mainTitle;
    });
    this.buildActive = true;
    this.previewActive = false;
    this.publishActive = false;
    // this._dataService.sharedMessagepreviousDocumentBackup.subscribe(data => {
    //   this.previousDocumentData = data;
    // })

    this.rotateValidSub$ =  this.dataService1.currentRotateandResizeMessage.subscribe(data => {
      this.rotateandresize = data;
    });

    this._dataService.moveflag.subscribe(
      data=>
      {
         this.moveflag1=data;
      }
    )
    
  }

  click() {
    this.router.navigateByUrl("projectmanagement/login");
  }

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: "assets/images/users/1.jpg",
      status: "online",
      from: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:30 AM",
    },
    {
      useravatar: "assets/images/users/2.jpg",
      status: "busy",
      from: "Sonu Nigam",
      subject: "I have sung a song! See you at",
      time: "9:10 AM",
    },
    {
      useravatar: "assets/images/users/2.jpg",
      status: "away",
      from: "Arijit Sinh",
      subject: "I am a singer!",
      time: "9:08 AM",
    },
    {
      useravatar: "assets/images/users/4.jpg",
      status: "offline",
      from: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:00 AM",
    },
  ];

  sortIcon: boolean = false;

  openSort(event) {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = false;
    dialogconfig.disableClose = false;
    this.dialog.open(StartSortComponent, {
      width: "380px",
      data: { callBack: this.changeWhite },
    });
    this.sortIcon = true;
  }
  changeWhite = () => {
    this.sortIcon = false;
    this.getImages();
  };
  getImages() {
    if (this.sortIcon == true) {
      return "assets/images/icons/P3WebIcon_11AppArrow_White.png";
    } else {
      return "assets/images/icons/P3WebIcon_11AppArrow_White.png";
    }
  }
  moreOption() {
    console.log(this.popupdata);
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    let dialogBoxMoreOption = this.dialog.open(MoreoptionComponent, {
      width: "380px",
      data: { popupdata: this.popupdata, layerData: this.layerDatasSearch,multiselect:this.multiselectimageToggle },
    });
  }
  ngAfterViewInit() { }

  displayData(event) { }

  redo() {
    // this.sharedService.nextMessage("Redo");
    this._dataService.redoAction.emit('redo');
  }
  undo() {
    this._dataService.undoAction.emit('undo');
  }
  applyFilter(value) {
    console.log(value)
    // this.sendData.changeMessage(value);
    this.eventsService.broadcast("on", value);
  }


  showsearchBox() {
    this.showSearch = !this.showSearch;
    this.searchWord = "";
    this.applyFilter("");
  }

  Build() {
    this.buildActive = true;
    this.previewActive = false;
    this.publishActive = false;
    this.sharedService.nextMessage("Build");
  }
  Preview() {
    this.buildActive = false;
    this.previewActive = true;
    this.publishActive = false;
    this.sharedService.nextMessage("Preview");
  }
  Publish() {
    this.buildActive = false;
    this.previewActive = false;
    this.publishActive = true;
    this.sharedService.nextMessage("Publish");
  }

  BuildToolbar() {
    this.buildActive = true;
    this.previewActive = false;
    this.publishActive = false;
    this.sharedService.publishToolbarSend.emit("BuildToolbar");
  }
  PreviewToolbar() {
    this.buildActive = false;
    this.previewActive = true;
    this.publishActive = false;
    // this.sharedService.nextMessage("PreviewToolbar");
    this.sharedService.sendandGetPreview.emit();
  }
  PublishToolbar() {
    this.buildActive = false;
    this.previewActive = false;
    this.publishActive = true;
    this.sharedService.publishToolbarSend.emit("PublishToolbar");
  }

  selectMultiIcons() {
    this.multiselectimageToggle = !this.multiselectimageToggle;
    if (this.multiselectimageToggle == true) {
      this.imgUrl = "assets/images/icons/P3WebIcon_Copy_Orange.png";
      this._dataService.multiSelectFooter.emit(true);
    } else {
      this.imgUrl = "assets/images/icons/P3WebIcon_Copy_White.png";
      this._dataService.multiSelectFooter.emit(false);
      let ids = [];
      this._dataService.searchannotationId.emit(ids);
      this._dataService.checkedAnnotationId.emit(ids);
    }
  }

  plusPage() {
    console.log('plus',this.singlePageNumber);
    console.log(typeof this.totalPages);
    if (this.totalPages > this.singlePageNumber) {
      console.log('plus');
      var page_number = this.singlePageNumber + 1;
      this.dataService1.switchPagesendPageNumber.emit(page_number);
    }
    else if(this.totalPages == this.singlePageNumber){
      console.log('last page');
      var page_number = 1;
      this.dataService1.switchPagesendPageNumber.emit(page_number);
    }
  }

  minusPage() {
    console.log('minus',this.singlePageNumber);
    if (1 < this.singlePageNumber) {
      var page_number = this.singlePageNumber - 1;
      this.dataService1.switchPagesendPageNumber.emit(page_number);
    }
    else if(this.singlePageNumber==1){
      console.log(this.documentDetails);
      if(this.documentDetails!=undefined && this.documentDetails!=null && this.documentDetails.length > 0){
        let get_last_page = this.documentDetails[this.documentDetails.length - 1];
        console.log(get_last_page);
        let get_page_number = get_last_page.page_number;
        this.dataService1.switchPagesendPageNumber.emit(get_page_number);
      }
    }
  }


  moveElementAccess() {
    this.rapidmodeBool = this.encrptdecrpt.getItem("rapidmodes");
    this.setbgBool = this.encrptdecrpt.getItem("setbgIndexBool");
    console.log(this.rapidmodeBool);
    if(this.rapidmodeBool == true && this.setbgBool == true){
       return
    }
    this.moveElementHeaderValue = !this.moveElementHeaderValue;
    if (this.moveElementHeaderValue == true) {
      this.moveElementImg = "assets/images/icons/P3WebIcon_38Move_Orange.png";
      this._dataService.copydatadialogclose.emit();
      this._dataService.moveAccess.emit(true);
    } else {
      this.moveElementImg = "assets/images/icons/P3WebIcon_38Move_White.png";
      this._dataService.moveAccess.emit(false);
    }
  }

  moveElementRemove(){
    this.moveElementHeaderValue = false;
    this.moveElementImg = "assets/images/icons/P3WebIcon_38Move_White.png";
  }

  searchOptionClose(selectoption) {
    if (this.multiselectimageToggle == true) {
      this.imgUrl =
        "assets/images/icons/P3WebIcon_Copy_Orange.png";
    } else {
      this.imgUrl = "assets/images/icons/P3WebIcon_Copy_White.png";

    }
  }

  searchImage: any = "assets/images/header/P3_SearchIcon _White.png";
  
  dialogBoxCloseOption: any;
  opensearch() {
   
    console.log(this.searchOptionToggle);
    this.searchOptionToggle = !this.searchOptionToggle;

    if (this.searchOptionToggle == false) {
      this.searchImage = "assets/images/header/P3_SearchIcon _White.png";
      this._dataService.searchselector.emit(false);
    } else {
      this.searchImage = "assets/images/P3_SearchIcon _Orange.png";
      //this.searchImage = "assets/images/header/P3_SearchIcon _White.png";
      this._dataService.searchselector.emit(true);
    }
  }

  layerDatas: any;

  openLayers() {
    this._dataService.navgiationgetData.emit();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(LayersPageComponent, {
      // width: "650px",
      position: { left: "0" },
      disableClose: true,
      panelClass: 'searchPageArrow',
      backdropClass: 'backdropBackground', // This is the "wanted" line,
      data: { layerDatas: this.layerDatas, checkedAnnotationIdsBackup: this.checkedAnnotationIdsBackup, currentPageId: this.currentPageId },
    });
  }

  layerImage: any = "assets/images/icons/P3WebIcon_42Layers_White.png";

  openLayersDup() {
    console.log(this.documentDetails);
    let getnewone = this.document_credential.get_current_document_value();
    console.log(getnewone);
    this.layerColor = !this.layerColor;
    if (this.layerColor == true) {
      this.layerImage = "assets/images/icons/P3WebIcon_42Layers_Orange.png";
      this._dataService.layeractiveEnable.emit(true);
    }
    else if (this.layerColor == false) {
      this.layerImage = "assets/images/icons/P3WebIcon_42Layers_White.png";
      this._dataService.layeractiveEnable.emit(false);
    }
  }
                                                       
  closeLayerBox() {
    this.layerColor = false;
    this.layerImage = "assets/images/icons/P3WebIcon_42Layers_White.png";
  }

  closeMultipleSelectionBox() {
    this.multiselectimageToggle = false;
    this.imgUrl = "assets/images/icons/P3WebIcon_Copy_White.png";
  }


  searchWord: any = "";

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.searchWord = changeUpperCaseProjectName;
    }
  }

  AddUser() {
    this.router.navigateByUrl("/projectmanagement/resetpassword");
  }

  closeSearch() {

    // this.searchWord = "";
    // this.showSearch = false;
    // this.sendData.changeMessage("");
    // this.eventsService.broadcast("on", "");
    this.eventsService.on("on", (a) => {

      if (a == "@`#11*(%") {
        this.searchWord = "";
        this.showSearch = false;
        this.sendData.changeMessage("");
      }

      // this.eventsService.broadcast("on", "");
    });
  }

  goToProjectDetails() {
    this.searchImage = "assets/images/header/P3_SearchIcon _White.png";
    this._dataService.viewOnlyModeTrigger.emit(false);
    this._dataService.viewOnlyModeChecked.emit(false);
    //hide toolbar name 
    this._dataService.changeMessage(false);
    this.eventsService.broadcast("labelView", false);
    // localStorage.setItem("viewonlys","false");
    this.encrptdecrpt.setItem("viewonlys",false);//security
    this.searchOptionToggle = false;
    this._dataService.searchoption.emit(false);
    this.closeMultipleSelectionBox();
    this.closeLayerBox();
    localStorage.removeItem("preSelectAnnotationId")
    // this.previousRoute = this.routingState.getPreviousUrl();
    localStorage.removeItem("preSelectAnnotationId");
    console.log(this.projectId, this.projectName);
    console.log(this.getOpenLinkWindow);
    if (this.getOpenLinkWindow == true || this.getOpenLinkWindow == "true") {
      this.selection=false
      window.close();
    }
    else {
      this.router.navigate(["projectsection/mainproject"], {
        queryParams: { project_id: this.projectId, project_name: this.projectName },
      });
    }
  }



  openShare() {
    this.title1 = this.title;
    console.log(this.title1);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(ShareOptionComponent, {
      width: "380px",
      data: {
        documentDetails: this.documentDetails,
        docpath: this.docpath,
        width1: this.width1,
        height1: this.height1,
        singlePageNumber: this.singlePageNumber,
        pageId:this.currentPageId,
        title1: this.title1
      }
    });
  }
  openShare1() {
    console.log('project share');
    // this.titles = this.title.split('.');
    this.title1 = this.title;
    console.log(this.title1);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(Shareoption1Component, {
      width: "380px",
      // disableClose: true,
      data: {
        documentDetails: this.documentDetails,
        singlePageNumber: this.singlePageNumber,
        title1: this.title1,
        pageId:this.currentPageId,
      }
    });
  }

  downloadLink() {
    let get_environment = environment.APIBaseUrl;
    if(get_environment=="https://api.plannotate3.com:3002/planotate30/api/v2/"){
      this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";//security
      let check_email = this.su.email_id;
      let split_at_after = check_email.split("@");
      console.log(split_at_after);
      if(split_at_after[1]=='wje.com'){
        let url = 'itms-services://?action=download-manifest&url=' + environment.iPadDownloadUrl + '';
        window.open(url);
      }
      else{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        var dialogrefModel = this.dialog.open(AlertmessageComponent, {
          data: { platform: 'ipaddownload' }
        });
      } 
    }
    else{
      let url = 'itms-services://?action=download-manifest&url=' + environment.iPadDownloadUrl + '';
      window.open(url);
    }
    // else {
    //   const dialogconfig = new MatDialogConfig();
    //   dialogconfig.disableClose = true;
    //   dialogconfig.autoFocus = true;
    //   this.dialogbox.open(NoParentComponent, {
    //     width: "380px",
    //     panelClass: "mat-dialog-container1",
    //     data: {
    //       documentvalid: true,
    //       message: "This feature is not available."
    //     },
    //   });
    // }
  }

  uploadStub() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(AddStubsComponent, {

    });
  }

  documentSwitch() {
    console.log('clicked');
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(DocumentswitchpageComponent, {
      width: "450px",
      data: {page_Data:this.popupdata.document_details,layerDatas:this.layerDatas,popupdata:this.popupdata},
    });
  }

  pageSync() {
    if (this.synImage == false) {
      this.show=true;
      this.synImage = !this.synImage;
      this._dataService.filtertool.emit(true);
      this._dataService.synActionNew.emit(true);
      //The below lines are added to deselect the selected annotations(multiselect and move) while syncing.
      if(this.multiselectimageToggle == true)
      {
        this._dataService.multiSelectFooter.emit(false);
        let ids = [];
        this._dataService.searchannotationId.emit(ids);
        this._dataService.checkedAnnotationId.emit(ids);
      }
      if(this.moveElementHeaderValue == true)
      {
        this.moveElementImg = "assets/images/icons/P3WebIcon_38Move_White.png";
        this._dataService.moveAccess.emit(false);
      }
    }
  }


  ngOnDestroy(): void {
    if(this.value_get$!= undefined){
      this.value_get$.unsubscribe;
    }
    if (this.layerPageSend$ != undefined) {
      this.layerPageSend$.unsubscribe;
    }
    if (this.closesearch$ != undefined) {
      this.closesearch$.unsubscribe;
    }
    if (this.setwidth$ != undefined || this.setwidth$ != null) {
      this.setwidth$.unsubscribe;
    }

    if (this.multi_select$ != undefined || this.multi_select$ != null) {
      this.multi_select$.unsubscribe;
    }

    if (this.doc_path$ != undefined || this.doc_path$ != null) {
      this.doc_path$.unsubscribe;
    }

    if (this.getMessage$ != undefined) {
      this.getMessage$.unsubscribe;
    }
    if (this.pageName$ != undefined) {
      this.pageName$.unsubscribe;
    }
    if (this.searchLayerDatas$ != undefined) {
      this.searchLayerDatas$.unsubscribe;
    }
    if (this.documentlistSend$ != undefined) {
      this.documentlistSend$.unsubscribe;
    }
    if (this.imageChangeDocHeader$ != undefined) {
      this.imageChangeDocHeader$.unsubscribe;
    }
    if (this.imageChangeDocHeaderSearch$ != undefined) {
      this.imageChangeDocHeaderSearch$.unsubscribe;
    }
    if (this.sharedService$ != undefined) {
      this.sharedService$.unsubscribe;
    }
    if (this.sendPageNumber$ != undefined) {
      this.sendPageNumber$.unsubscribe;
    }
    if (this.singlePagenumber$ != undefined) {
      this.singlePagenumber$.unsubscribe;
    }
    if (this.docName$ != undefined) {
      this.docName$.unsubscribe;
    }
    if (this.currentPageSync$ != undefined) {
      this.currentPageSync$.unsubscribe;
    }
    if (this.forms$ != undefined) {
      this.forms$.unsubscribe;
    }
    if (this.moveElementRemove$ != undefined) {
      this.moveElementRemove$.unsubscribe;
    }
    if (this.closelayerbox$ != undefined) {
      this.closelayerbox$.unsubscribe;
    }
    if (this.rotateValidSub$ != undefined) {
      this.rotateValidSub$.unsubscribe;
    }
    if (this.setScaleTriggerSubscribeNav$ != undefined) {
      this.setScaleTriggerSubscribeNav$.unsubscribe;
    }
    if(this.copyAnnMultipleOption$ != undefined){
      this.copyAnnMultipleOption$.unsubscribe;
    }
    if(this.alignAnnotationSelected$ != undefined){
      this.alignAnnotationSelected$.unsubscribe;
    }
    if (this.groupAnntsEnbled$ != undefined) {
      this.groupAnntsEnbled$.unsubscribe();
    }
  }
  downloads() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log(this.deviceInfo);
    if (this.deviceInfo.os == "Windows") {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'https://plannotate3ipadbuild.s3.amazonaws.com/LocalPdfBuild/PlannotateDocumentReader.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Old Link
      // https://plannotate3ipadbuild.s3.amazonaws.com/LocalPdfBuild/Plannotate-DocumentReader.exe
    } else if (this.deviceInfo.os.includes("Mac")) {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'https://plannotate3ipadbuild.s3.amazonaws.com/LocalPdfBuild/Plannotate-DocumentReader.dmg');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    else {


    }
  }

}
