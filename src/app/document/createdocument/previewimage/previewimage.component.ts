import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy, Renderer2,ElementRef } from "@angular/core";
import {
  SwiperComponent,
  SwiperDirective,
  SwiperConfigInterface,
} from "ngx-swiper-wrapper";
import * as Hammer from 'hammerjs';
import { DataimageService } from "src/app/dataimage.service";
import { CreateDocumentService } from "../../services/create-document.service";
import { Location } from "@angular/common";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AddasnewdocumentComponent } from "./addasnewdocument/addasnewdocument.component";
import { TagmediaComponent } from "../mediamenu/tagmedia/tagmedia.component";
import { DataserviceService } from "../../services/dataservice.service";
import { DeletemediaComponent } from "../mediamenu/deletemedia/deletemedia.component";
import { ShareOptionComponent } from "../share-option/share-option.component";
import Swiper from 'swiper';
import { Indicator, IndicatorAnimations } from './indicator';
import { trigger, transition, query, style, animate, group, state } from '@angular/animations';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { fromEvent } from "rxjs";
import { takeWhile } from "rxjs/operators"
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
import { RefreshWindowComponent } from "./refresh-window/refresh-window.component";
import { filter } from 'rxjs/operators'
import { PreviewimagedownloadpopupComponent } from "./previewimagedownloadpopup/previewimagedownloadpopup.component";
import * as _ from 'lodash';
import { MatSnackBar } from "@angular/material/snack-bar";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import heic2any from "heic2any";
import panzoom from "panzoom";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { StateChange } from "ng-lazyload-image";

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}


const left = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
      optional: true,
    }),
  ]),
];

const right = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
      optional: true,
    }),
  ]),
];

@Component({
  selector: "app-previewimage",
  templateUrl: "./previewimage.component.html",
  styleUrls: ["./previewimage.component.css"],
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0%)' })),
      state('right', style({ transform: 'translateX(0%)' })),
      transition('* => *', animate(300))
    ])],
  
})
export class PreviewimageComponent implements OnInit, AfterViewInit, OnDestroy {
  width: any;
  img_url: any = null;
  comment: any;
  imageset: Array<any> = [];
  stubid: any;
  scaleValue: number = 1;
  comments: any;
  layerDatas: any[];
  propertiesannotationData: any;
  filename: any;
  getimageData: any;
  projectid: any;
  folderlevel: any;
  pfolderid: any;
  // images: any[];
  activeIndex: number = 0;
  imgstubid: any;
  mediaData: any = "";
  multipleSelectOn: boolean = false;
  multiselectionList: any[] = [];
  indicators;
  eventText = '';
  alive: boolean = true;
  result: string;
  swipeSide: string = "none";
  projectFolderList: any[] = [];
  public scale = 1.0;
  public scaleMultiplier = 0.8;
  @ViewChild('usefulSwiper', { static: false }) usefulSwiper: SwiperComponent;
  annotatinId: any;
  imageId: any;
  baseUrl: string;
  sKey1: string;
  sKey2: string;
  iPad: boolean;
  projectId: string;
  folderId: string;
  pageload: boolean;
  getId: any;
  activeLayerIdDraw: any;
  show: boolean = false;
  userrole:any = "";
  deletes: boolean;
  isReadonly: boolean=false;
  disablemode_noMedia:boolean = false;

  constructor(
    public _dataService: DataimageService,
    private documentService: CreateDocumentService,
    private _location: Location,
    private dialogbox: MatDialog,
    private dataService: DataserviceService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private imgdataService: DataimageService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public userRoleGlobal: GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    console.log(userRoleGlobal);
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.annotatinId = this.route.snapshot.queryParamMap.get("id");
    this.imageId = this.route.snapshot.queryParamMap.get("mid");
    console.log(this.route.snapshot.queryParamMap.get("id"),this.route.snapshot.queryParamMap.get("mid"))
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          if (this.annotatinId == null) {
            this.pageload = false
            const dialogconfig = new MatDialogConfig();
            // dialogconfig.autoFocus = true;
            // dialogconfig.disableClose = true;
            // this.dialogbox.open(RefreshWindowComponent, {
            //   width: "380px",

            // }).afterClosed().subscribe((res) => {
              this._location.back();
            // })
          }
        }
      })
    // this.projectId = this.route.snapshot.queryParamMap.get("project_id")
    // this.folderId = this.route.snapshot.queryParamMap.get("folderId")
    if (this.annotatinId == null) {
      this.iPad = false
    } else {
      this.pageload = true
      this.iPad = true
    }
    var swiper = new Swiper('.swiper-container');
    this.indicators = new Indicator();
    // this.documentService
    //   .getAnnotationFormlist(this.projectId, this.folderId)
    //   .subscribe((response) => {
    //     this.layerDatas = [];
    //     let layer_data = response["response_body"]["layer_datas"];

    //   })

    // get Preview page data start
    // let get_preview_data : any = this.encrptdecrpt.getItem("preview_image_data");
    let get_preview_data : any = (<any>window).pass_variable
    if(get_preview_data == undefined){
      get_preview_data = this.encrptdecrpt.getItem("preview_image_data")
     }
    if(get_preview_data != null){
    
    get_preview_data = get_preview_data;
    console.log(get_preview_data);
    this.pageload = true;
    console.log(get_preview_data.imgUrl);
    this.img_url = get_preview_data.imgUrl;
    this.imageset = get_preview_data.FormData;
    this.comments = get_preview_data.Comment;
    this.imgstubid = get_preview_data.Stubid;
    this.layerDatas = get_preview_data.LayerData;
    this.propertiesannotationData = get_preview_data.AnnotationData;
    this.filename = get_preview_data.name;
    this.projectid = get_preview_data.projectid;
    this.folderlevel = get_preview_data.folderlevel;
    this.pfolderid = get_preview_data.pfolderid;
    this.multipleSelectOn = get_preview_data.multipleSelectOn;
    this.multiselectionList = get_preview_data.multiselectionList;
    this.projectFolderList = get_preview_data.projectFolderList;
    this.getId = get_preview_data.getId;
    this.activeLayerIdDraw = get_preview_data.activeLayerIdDraw;
    console.log(get_preview_data);
    this.getActiveIndex();
    this.getMediaStubList();  
  }

    this.dataService.searchLayerDatas.subscribe((data) => {
      this.layerDatas = data;
      this.getMediaStubList();
      console.log(data);
      // update the localstorage values changes for delete and tags upgrades
      // let get_location_storage_values : any = this.encrptdecrpt.getItem("preview_image_data");    
      let get_location_storage_values : any = (<any>window).pass_variable  
      get_location_storage_values = get_location_storage_values;
      if(get_location_storage_values !=null && get_location_storage_values != undefined){
        get_location_storage_values.LayerData = data;
        // localStorage.setItem("preview_image_data",JSON.stringify(get_location_storage_values));
        // this.encrptdecrpt.setItem("preview_image_data",get_location_storage_values);//security
        
      }
    });
    this.isReadonly = this.encrptdecrpt.getItem("viewonlys");
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    });
  }


  zoomOut(event) {

    event.stopPropagation();
    let getImageContainer = document.getElementById("swipeSection");
    var getImageElement = document.getElementById("getOne");
    this.scaleValue *= this.scaleMultiplier;
    this.scale *= this.scaleMultiplier;
    getImageElement.style.transform = "scale(" + this.scaleValue + ")";
    let getImageContainerSize = getImageContainer.getBoundingClientRect();
    let currentWidthHeight = getImageElement.getBoundingClientRect();
    let currentViewX = currentWidthHeight.width;
    let currentViewY = currentWidthHeight.height;
    let centerX = getImageContainerSize.width - currentViewX;
    let centerY = getImageContainerSize.height - currentViewY;
    let panZoomElement = panzoom(document.querySelector('#getOne'), {
      initialZoom: this.scaleValue,
    });
    panZoomElement.pause();
    let viewImageDiv = document.getElementById("getOne");
    // let viewImageDiv = document.getElementById("pdfImg");
    viewImageDiv.style.left = (centerX/2) > 15 ? centerX / 2 + 'px' : '15px';
    viewImageDiv.style.top = (centerY/2) > 15 ? centerY / 2 + 'px' : '15px';

    // if (centerX > 0) {
    //   viewImageDiv.style.left = centerX / 2 + 'px';
    // }
    // else if (centerX <= 0) {
    //   viewImageDiv.style.left = 15 + 'px';
    // }
    // if (centerY > 0) {
    //   viewImageDiv.style.top = centerY / 2 + 'px';
    // }
    // else if (centerY <= 0) {
    //   viewImageDiv.style.top = 15 + 'px';
    // }
    // panZoomElement.centerOn('pdfImg');
  }

  zoomIn(event) {
    event.stopPropagation();
    console.log('zoom In');
    let getImageContainer = document.getElementById("swipeSection");
    console.log(getImageContainer);
    var getImageElement = document.getElementById("getOne");
    this.scaleValue /= this.scaleMultiplier;
    this.scale /= this.scaleMultiplier;
    getImageElement.style.transform = "scale(" + this.scaleValue + ")";
    console.log(this.scaleValue);
    let getImageContainerSize = getImageContainer.getBoundingClientRect();
    console.log(getImageContainerSize);
    let currentWidthHeight = getImageElement.getBoundingClientRect();
    console.log(currentWidthHeight);
    let currentViewX = currentWidthHeight.width;
    let currentViewY = currentWidthHeight.height;
    let centerX = getImageContainerSize.width - currentViewX;
    let centerY = getImageContainerSize.height - currentViewY;
    console.log(currentViewX, currentViewY);
    let panZoomElement = panzoom(document.querySelector('#getOne'), {
      initialZoom: this.scaleValue,
    });
    panZoomElement.pause();
    let viewImageDiv = document.getElementById("getOne");
    viewImageDiv.style.left = (centerX/2) > 15 ? centerX / 2 + 'px' : '15px';
    viewImageDiv.style.top = (centerY/2) > 15 ? centerY / 2 + 'px' : '15px';
    // if (centerX > 0) {
    //   viewImageDiv.style.left = centerX / 2 + 'px';
    // }
    // else if (centerX <= 0) {
    //   viewImageDiv.style.left = 2 + 'px';
    // }
    // if (centerY > 0) {
    //   viewImageDiv.style.top = centerY / 2 + 'px';
    // }
    // else if (centerY <= 0) {
    //   viewImageDiv.style.top = 2 + 'px';
    // }
    // panZoomElement.centerOn('pdfImg');
  }

  ngOnInit(): void {
    this.securityCheck();
    this.getDetails();
  }

  getDetails() {
    let get_preview_data = this.documentService.createDocumentStore_values.preview_image_data;
    console.log(get_preview_data);
    if (this.annotatinId != null) {
      this.documentService.getAnnotationDetails(this.annotatinId).subscribe((res) => {
        var status = res["response_code"];
        if (status == 200) {
          this.imageset = res["response_body"]["annotation_media_list"];
          if(this.imageset != undefined && this.imageset != null){
            let data_allow_condition = ["false", false, 0, "0"];
            this.imageset = this.imageset.filter((data) => {
              return data_allow_condition.includes(data.is_removed);
            });
            if(this.imageset != undefined && this.imageset != null && this.imageset.length > 0){
              this.activeIndex = this.imageset.findIndex(data => data.annotation_media_id == this.imageId)
              this.imgstubid = this.imageset[this.activeIndex].stub_id;
              this.filename = this.imageset[this.activeIndex].media_name;
            }
          }
        }
      });
    } else {
      // var emptyUrl = this.img_url
      // if (emptyUrl == null) {
      //   const dialogconfig = new MatDialogConfig();
      //   dialogconfig.autoFocus = true;
      //   dialogconfig.disableClose = true;
      //   this.dialogbox.open(RefreshWindowComponent, {
      //     width: "380px",

      //     //  multiselectionList:this.multiselectionList,
      //   });
      // }
    }

  }
  @ViewChild("widgetsContent") widgetsContent: ElementRef;

  hidePreviousRight() {
    this.widgetsContent.nativeElement.scrollLeft += 50;
    this.widgetsContent.nativeElement.style.scrollBehaviour = "smooth";
  }
  hidePrevious() {
    this.widgetsContent.nativeElement.scrollLeft -= 56;
    this.widgetsContent.nativeElement.style.scrollBehaviour = "smooth";
  }

  mySwiper: Swiper;

  ngAfterViewInit(): void {
    // var myElement = document.getElementById('hitarea');
    // var mc = new Hammer(myElement);
    const hammerConfig = new HammerGestureConfig();
    const hammer = hammerConfig.buildHammer(document.getElementById('swipeSection'));
    var getOneElement = document.getElementById('getOne');
    console.log(hammer);
    fromEvent(hammer, "swipe").pipe(
      takeWhile(() => this.alive))
      .subscribe((res: any) => {
        this.swipeSide = res.deltaX < 0 ? 'left' : 'right'
        console.log(res);
        this.scale = 1;
        this.scaleValue = 1;
        // this.renderer.setStyle(getOneElement,"transform",`translate3d(0, 0, 0) translate(${res.deltaX}px,${res.deltaY}px)`)
        if (this.swipeSide == 'left' && this.activeIndex != this.imageset.length - 1) {
          this.activeIndex = this.activeIndex + 1;
          this.getMediaStubList();
        }
        else if (this.swipeSide == 'right' && this.activeIndex != 0) {
          this.activeIndex = this.activeIndex - 1;
          this.getMediaStubList();
        }
        console.log(this.activeIndex, this.swipeSide);
      });
    this.dragScrollAction();
    this.mySwiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      autoplay: 3000,
      spaceBetween: 30
    });
  }
  slides = [
    'https://via.placeholder.com/300x200/FF5733/ffffff',
    'https://via.placeholder.com/300x200/C70039/ffffff',
    'https://via.placeholder.com/300x200/900C3F/ffffff'
  ];

  getActiveIndex() {
    if(this.multipleSelectOn==false){
    this.activeIndex = this.imageset.findIndex(item => item.stub_id == this.imgstubid);
    }else{
     
        console.log('multiple');
        let tempmediaList = [];
        if (this.layerDatas != undefined) {
          for (let k = 0; k < this.multiselectionList.length; k++) {
            let find_layer_id = this.layerDatas.findIndex((layer_level)=>layer_level.layer_id==this.multiselectionList[k].layer_id);
            if(find_layer_id > -1){
              let get_annotation_index = this.layerDatas[find_layer_id].annotations.findIndex((annotation_level)=>annotation_level.annotation_id==this.multiselectionList[k].annotation_id);
              if(get_annotation_index > -1){
                let get_media_list = this.layerDatas[find_layer_id].annotations[get_annotation_index].annotation_media;
                if(get_media_list.length>0){
                  let data_allow_condition = ["false",false,0,"0"];
                  get_media_list = get_media_list.filter((media_list)=> data_allow_condition.includes(media_list.is_removed));
                  if(get_media_list.length>0){
                    tempmediaList = [...tempmediaList,...get_media_list];
                  }
                }
              }
            }
          }
          this.imageset = tempmediaList;
          this.activeIndex = this.imageset.findIndex(item => item.stub_id == this.imgstubid);
        
        // for (var i = 0; i < this.layerDatas.length; i++) {
        //   for (var j = 0; j < this.layerDatas[i].annotations.length; j++) {
        //     for (var k = 0; k < this.layerDatas[i].annotations[j].annotation_media.length; k++) {
        //       if (this.propertiesannotationData["annotation_id"] == this.layerDatas[i].annotations[j].annotation_id) {
        //         if (this.layerDatas[i].annotations[j].annotation_media[k].stub_id == this.imgstubid) {
        //           this.activeIndex = k;
        //         }
        //       }
        //     }
        //   }
        // }
      }
    }
    // for (var i = 0; i < this.layerDatas.length; i++) {
    //   for (var j = 0; j < this.layerDatas[i].annotations.length; j++) {
    //     for (var k = 0; k < this.layerDatas[i].annotations[j].annotation_media.length; k++) {
    //       if (this.propertiesannotationData["annotation_id"] == this.layerDatas[i].annotations[j].annotation_id) {
    //         if (this.layerDatas[i].annotations[j].annotation_media[k].stub_id == this.imgstubid) {
    //           this.activeIndex = k;
    //         }
    //       }
    //     }
    //   }
    // }
  }


  imageClick(image, comment, stubid, index, mediaName) {
    this.activeIndex = index;
    this.imgstubid = stubid;
    this.img_url = image;
    this.comments = comment;
    this.filename = mediaName;
    console.log(this.activeIndex, this.imgstubid, this.img_url, this.comments);
    if (this.multipleSelectOn == false) {
      for (var i = 0; i < this.layerDatas.length; i++) {
        for (var j = 0; j < this.layerDatas[i].annotations.length; j++) {
          for (var k = 0; k < this.layerDatas[i].annotations[j].annotation_media.length; k++) {
            if (this.propertiesannotationData["annotation_id"] == this.layerDatas[i].annotations[j].annotation_id) {
              if (this.layerDatas[i].annotations[j].annotation_media[k].stub_id == stubid) {
                this.mediaData = this.layerDatas[i].annotations[j].annotation_media[k];
                console.log(this.mediaData);
                console.log(this.propertiesannotationData);
              }
            }
          }
        }
      }
    }
    else if (this.multipleSelectOn == true) {
      for (var i = 0; i < this.layerDatas.length; i++) {
        for (var j = 0; j < this.layerDatas[i].annotations.length; j++) {
          for (let k = 0; k < this.multiselectionList.length; k++) {
            if (this.multiselectionList[k].annotation_id == this.layerDatas[i].annotations[j].annotation_id) {
              for (let m = 0; m < this.layerDatas[i].annotations[j].annotation_media.length; m++) {
                if (stubid == this.layerDatas[i].annotations[j].annotation_media[m].stub_id) {  
                  this.propertiesannotationData = this.layerDatas[i].annotations[j];
                  this.mediaData = this.layerDatas[i].annotations[j].annotation_media[m];
                }
              }
            }
          }
        }
      }
      for (var i = 0; i < this.multiselectionList.length; i++) {
        for (var k = 0; k < this.multiselectionList[i].annotation_media.length; k++) {
          if (stubid == this.multiselectionList[i].annotation_media[k].stub_id) {
            this.mediaData = this.multiselectionList[i].annotation_media[k];
            this.propertiesannotationData = this.multiselectionList[i];
            console.log(this.propertiesannotationData);
          }
        }
      }
    }
  }

  imageClick1(index) {
    this.activeIndex = index;
    this.imgstubid = this.imageset[index].stub_id;
    console.log(this.imageset, this.img_url)
    this.img_url = this.imageset[index].media_url;
    this.filename = this.imageset[index].media_name;
    this.comments = this.imageset[index].media_comment;
    this.getId = this.imageset[index].annotation_id;
    this.scale = 1;
    this.scaleValue = 1;
    if(this.multipleSelectOn==true){
      this.getCurrentAnnotationData(this.imgstubid);
    }
  }

  

  ngOnDestroy(): void {
    this.getimageData.unsubscribe();
    // 
    this.alive = false;
  }
  // closeBox(comment) {
  //   console.log(this.stubid);

  //   this.dialogClose.close({ data: comment, data1: this.stubid });
  // }
  commentUpdate(comment) {
    console.log(comment)
    this.show = true;
    //media section with Normal image.  
    if (this.layerDatas != undefined) {
      for (var i = 0; i < this.layerDatas.length; i++) {
        let annotationData1 = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId));
        if(annotationData1.length>0){
          let stub = annotationData1[0].annotation_media.filter((mdata)=>mdata.stub_id == this.imgstubid);
          if(stub.length>0){
            stub[0].media_comment = comment;
            stub[0].is_changed = true;
            break;
          }
        }
      }
      let generateCloneLayer = _.cloneDeep(this.layerDatas);
      this.documentService.annotationUpdateForm1(generateCloneLayer, this.getId, this.activeLayerIdDraw,'media').subscribe((response) => {
        console.log(response);
        if (response["response_code"] == 200) {
          this.show = false;
        }
        else {
          this.errorMessage();
        }
      });
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

  

  backClicked() {
    window.close();
    let enableSelected = this.encrptdecrpt.getItem("preSelectAnnotationId");
    if(enableSelected!=null && enableSelected!=undefined){
      if(enableSelected.hasOwnProperty('id')){
        let annotationId = enableSelected.id;
        let previewBack = { status:false, id: annotationId };
        // localStorage.setItem("preSelectAnnotationId", JSON.stringify(previewBack));
        this.encrptdecrpt.setItem("preSelectAnnotationId",previewBack);//security
        console.log(enableSelected)
      }
    }
    this._location.back();
  }

  public config: SwiperConfigInterface = {
    direction: "horizontal",
    slidesPerView: 8,
    navigation: true,
  };

  @ViewChild(SwiperComponent) componentRef: SwiperComponent;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public toggleSlidesPerView() {
    if (this.config.slidesPerView !== 1) {
      this.config.slidesPerView = 1;
    } else {
      this.config.slidesPerView = 8;
    }
  }

  addAsNewDocument() {
    console.log(this.img_url)
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = false;
    dialogconfig.disableClose = true;
    this.dialogbox.open(AddasnewdocumentComponent, {
      width: "380px",
      data: {
        projectid: this.projectid,
        folderlevel: this.folderlevel,
        pfolderid: this.pfolderid,
        media_url: this.img_url,
        projectFolderList: this.projectFolderList
      },
    });
  }

  tagsPage() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialogbox.open(TagmediaComponent, {
      width: "380px",
      data: { stubId: this.imgstubid, stubData: this.mediaData, layerDatas: this.layerDatas, getId: this.propertiesannotationData['annotation_id'], activeLayerIdDraw: this.activeLayerIdDraw }
    });
  }

  deleteImage() {
    
    this.deletes=false;
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    console.log( this.mediaData)
    this.dialogbox.open(DeletemediaComponent, {
      width: "380px",
      data: {
        deletes:this.deletes,
        stubIdData: this.imgstubid,
        layerDatas: this.layerDatas,
        multipleSelectOn: false,
        message: "Are you sure you want to delete item?",
        getId: this.propertiesannotationData.annotation_id,
        activeLayerIdDraw: this.activeLayerIdDraw
      },
      //  multiselectionList:this.multiselectionList,
    });
  }

  getMediaStubList() {
    if (this.multipleSelectOn == false) {
      console.log('one');
      if (this.layerDatas != undefined) {
        for (var i = 0; i < this.layerDatas.length; i++) {
          for (var j = 0; j < this.layerDatas[i].annotations.length; j++) {
            if (this.propertiesannotationData["annotation_id"] == this.layerDatas[i].annotations[j].annotation_id) {
              console.log(this.layerDatas[i].annotations[j].annotation_media);
              if (this.layerDatas[i].annotations[j].annotation_media.length > 0) {
                this.imageset = this.layerDatas[i].annotations[j].annotation_media;
                let data_allow_condition = ["false",false,0,"0"];
                this.imageset = this.imageset.filter((data) => {
                  return data_allow_condition.includes(data.is_removed);
                })
                console.log(this.imageset);
                if(this.imageset.length>0){
                  if (this.activeIndex > this.imageset.length - 1) {
                    this.activeIndex = this.activeIndex - 1;
                    this.img_url = this.imageset[this.activeIndex].media_url;
                    this.comments = this.imageset[this.activeIndex].media_comment;
                    this.imgstubid = this.imageset[this.activeIndex].stub_id;
                    this.filename = this.imageset[this.activeIndex].media_name;
                  }
                  else if (this.activeIndex < this.imageset.length - 1 || this.activeIndex == this.imageset.length - 1) {
                    this.img_url = this.imageset[this.activeIndex].media_url;
                    this.comments = this.imageset[this.activeIndex].media_comment;
                    this.imgstubid = this.imageset[this.activeIndex].stub_id;
                    this.filename = this.imageset[this.activeIndex].media_name;
                  }
                }
                else {
                  this.img_url = null;
                  this.comments = "";
                  this.imgstubid = "";
                  this.filename = "";
                  this.disablemode_noMedia = true;
                }
                console.log(this.activeIndex);
              }
              else {
                this.img_url = null;
                this.comments = "";
                this.imgstubid = "";
                this.filename = "";
                this.disablemode_noMedia = true;
              }
            }
          }
        }
      }
    }
    else if (this.multipleSelectOn == true) {
      console.log('multiple');
      let tempmediaList = [];
      if (this.layerDatas != undefined) {
        for (let k = 0; k < this.multiselectionList.length; k++) {
          let find_layer_id = this.layerDatas.findIndex((layer_level)=>layer_level.layer_id==this.multiselectionList[k].layer_id);
          if(find_layer_id > -1){
            let get_annotation_index = this.layerDatas[find_layer_id].annotations.findIndex((annotation_level)=>annotation_level.annotation_id==this.multiselectionList[k].annotation_id);
            if(get_annotation_index > -1){
              let get_media_list = this.layerDatas[find_layer_id].annotations[get_annotation_index].annotation_media;
              if(get_media_list.length>0){
                let data_allow_condition = ["false",false,0,"0"];
                get_media_list = get_media_list.filter((media_list)=> data_allow_condition.includes(media_list.is_removed));
                if(get_media_list.length>0){
                  tempmediaList = [...tempmediaList,...get_media_list];
                }
              }
            }
          }
        }
        this.imageset = tempmediaList;
        console.log(this.imageset);
        if (this.imageset.length == 0) {
          this.img_url = null;
          this.comments = "";
          this.imgstubid = "";
          this.filename = "";
          this.disablemode_noMedia = true;
        }
        else if (this.activeIndex > this.imageset.length - 1) {
          this.activeIndex = this.activeIndex - 1;
          this.img_url = this.imageset[this.activeIndex].media_url;
          this.comments = this.imageset[this.activeIndex].media_comment;
          this.imgstubid = this.imageset[this.activeIndex].stub_id;
          this.filename = this.imageset[this.activeIndex].media_name;
          this.getCurrentAnnotationData(this.imgstubid);
        }
        else if (this.activeIndex < this.imageset.length - 1 || this.activeIndex == this.imageset.length - 1) {
          
          this.img_url = this.imageset[this.activeIndex].media_url;
          this.comments = this.imageset[this.activeIndex].media_comment;
          this.imgstubid = this.imageset[this.activeIndex].stub_id;
          this.filename = this.imageset[this.activeIndex].media_name;
          this.getCurrentAnnotationData(this.imgstubid);
        }
      }
    }
  }

  getCurrentAnnotationData(stubId) {
    for (var i = 0; i < this.layerDatas.length; i++) {
      for (var j = 0; j < this.layerDatas[i].annotations.length; j++) {
        for (let k = 0; k < this.multiselectionList.length; k++) {
          if (this.multiselectionList[k].annotation_id == this.layerDatas[i].annotations[j].annotation_id) {
            for (let m = 0; m < this.layerDatas[i].annotations[j].annotation_media.length; m++) {
              if (this.layerDatas[i].annotations[j].annotation_media[m].stub_id == stubId) {
                this.propertiesannotationData = this.layerDatas[i].annotations[j];
              }
            }
          }
        }
      }
    }
  }

  openShare() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogbox.open(PreviewimagedownloadpopupComponent, {
      width: "380px",
      data: {
        filename: this.filename,
        imageset: this.imageset,
        img_url: this.img_url
      }
    });
  }

  onSwipe(evt) {
    console.log(evt);
    const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : '';
    const y = Math.abs(evt.deltaY) > 40 ? (evt.deltaY > 0 ? 'down' : 'up') : '';

    this.eventText += `${x} ${y}<br/>`;
    console.log(this.eventText);
  }
  onPress(evt) {
    console.log(evt);
    const gestureIndicator = this.indicators.display(
      evt.center.x,
      evt.center.y,
      50
    );

    let time = 0;
    gestureIndicator.interval = setInterval(() => {
      gestureIndicator.size += 1;
    }, 10);
    this.eventText += `(${evt.center.x}, ${evt.center.y})<br/>`;
    console.log('yes');
  }

  onPressUp(evt) {
    console.log(evt);
    const indicator = this.indicators.gestureIndicators[0];
    if (indicator) {
      clearInterval(indicator.interval);
      this.indicators.hide(indicator);
    }
    console.log('yes up');
  }

  getOvan(evt) {
    console.log(evt);
    // var mc = new Hammer(document.body);
    // mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
    // mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
    // console.log(document.body.style.touchAction)
  }

  dragScrollAction() {
    const slider = document.querySelector(".items");
    console.log(slider);
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e: any) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.clientLeft;
      scrollLeft = slider.scrollLeft;
      console.log(startX, scrollLeft);
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mousemove", (e: any) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.clientLeft;
      const walk = (x - startX) * 5; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
      console.log(walk);
    });

    slider.addEventListener("touchstart", (e: any) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.clientLeft;
      scrollLeft = slider.scrollLeft;
      console.log(startX, scrollLeft);
    });
    slider.addEventListener("touchend", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("touchmove", (e: any) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.clientLeft;
      const walk = (x - startX) * 5; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
      console.log(walk);
    });
  }
  securityCheck() {
    this.baseUrl = environment.APIBaseUrl + "get_web_singed_file?file=";
    this.sKey1 = "&key1=" + this.imgdataService.securityKey1()
    this.sKey2 = "&key2=" + this.imgdataService.securityKey2()
  }
  //   onPrint(){

  //     window.print();

  // }

  changeSourcecollection(event,element_id) {  
    //sample hiec --> "https://alexcorvi.github.io/heic2any/demo/1.heic"
    console.log(element_id+event.srcElement.currentSrc)
    // let elementScroll: any = document.getElementById("imageviewerScroll" + element_id);
    // if (elementScroll != null) {
    //   elementScroll.src = '/src/assets/images/spin.gif';
    // }
    let createElement = document.createElement('img');
    createElement.setAttribute('src',"assets/images/spin.gif");
    createElement.setAttribute('id','imageviewerScrollLoader'+element_id);
    createElement.style.position="absolute";
    createElement.style.top="50%";
    createElement.style.left="50%";
    createElement.style.height="50px";
    createElement.style.width="50px";
    createElement.style.marginLeft="-25px";
    createElement.style.marginTop="-25px";
    let get_append_parent = document.getElementById('imageviewerScrollHead'+element_id);
    if(get_append_parent!=null){
      get_append_parent.appendChild(createElement);
    }
    fetch(event.srcElement.currentSrc)
    .then((res) => res.blob())
    .then((blob) => heic2any({
      blob,
      toType: "image/jpeg",
    }).catch((e) => {
      console.log(e);
    }))
    .then((conversionResult:any) => {
      var url = URL.createObjectURL(conversionResult);
      let elementScroll : any= document.getElementById("imageviewerScroll"+element_id);
      if(elementScroll!=null){
        elementScroll.src = url;
        let getElement_Loader = document.getElementById('imageviewerScrollLoader'+element_id);
        if(getElement_Loader!=null){
          getElement_Loader.remove();
        }
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }

  changeSourcegetOne(element_id,url) {  
    //sample hiec --> "https://alexcorvi.github.io/heic2any/demo/1.heic"
    let currentURL = this.baseUrl+url+this.sKey1+this.sKey2;
    fetch(currentURL)
    .then((res) => res.blob())
    .then((blob) => heic2any({
      blob,
      toType: "image/jpeg",
    }).catch((e) => {
      console.log(e);
    }))
      .then((conversionResult:any) => {
        var url = URL.createObjectURL(conversionResult);
        let element: any = document.getElementById(element_id);
        if (element != null) {
          // element.src = url;
          element.setAttribute("lazyLoad",url);
        }
      })
    .catch((e) => {
      console.log(e);
    });
  }

  myCallbackFunction(event: StateChange,parent_id,element_id,url) {
    switch (event.reason) {
      case 'loading-failed':
          console.log('load failed',parent_id,element_id,url);
          this.changeSource(parent_id,element_id,url);
        break;
    }
  }

  changeSource(parent_id,element_id,url) {
    //sample hiec --> "https://alexcorvi.github.io/heic2any/demo/1.heic"
    // element.src = "assets/images/projectdetails/P3_ImageIcon_Blue600.png";
    console.log(this.baseUrl+url+this.sKey1+this.sKey2);
    let currentURL = this.baseUrl+url+this.sKey1+this.sKey2;
    let createElement = document.createElement('img');
    createElement.setAttribute('src', "assets/images/spin.gif");
    createElement.setAttribute('id', 'mediaimageheadLoader' + element_id);
    createElement.style.position = "absolute";
    createElement.style.top = "50%";
    createElement.style.left = "50%";
    createElement.style.height = "50px";
    createElement.style.width = "50px";
    createElement.style.marginLeft = "-25px";
    createElement.style.marginTop = "-25px";
    let get_append_parent = document.getElementById(parent_id);
    if (get_append_parent != null) {
      get_append_parent.appendChild(createElement);
    }
    fetch(currentURL)
      .then((res) => res.blob())
      .then((blob) => heic2any({
        blob,
        toType: "image/jpeg",
      }).catch((e) => {
        console.log(e);
      }))
      .then((conversionResult: any) => {
        var url = URL.createObjectURL(conversionResult);
        let element: any = document.getElementById(element_id);
        element.src = url;
        element.setAttribute("lazyLoad",url);
        let getElement_Loader = document.getElementById('mediaimageheadLoader' + element_id);
        if (getElement_Loader != null) {
          getElement_Loader.remove();
        }
        // return url;
      })
      .catch((e) => {
        console.log(e);
      });
  }


}
