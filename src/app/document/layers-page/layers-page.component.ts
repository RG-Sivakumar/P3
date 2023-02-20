import { Component, OnInit, AfterViewInit, Inject,Input, OnDestroy, ChangeDetectorRef, EventEmitter, Output } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CreateDocumentService } from "../services/create-document.service";
import { v1 as uuidv1 } from "uuid";
import { DataserviceService } from "../services/dataservice.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { SharedService } from "src/app/shared/shared.service";
import { ShapeService } from "../services/shape.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _ from 'lodash';
import { Subscription } from "rxjs";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { ValueService } from "src/app/value.service";
import { DataService } from "src/app/data.service";
import { createDocumentVar } from "../createdocument/createdocumentvariables";
import { DocumentPagesService } from "../services/document-pages.service";
import { linewidthchanges } from "../createdocument/documentfunctions1";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-layers-page",
  templateUrl: "./layers-page.component.html",
  styleUrls: ["./layers-page.component.css"],
})
export class LayersPageComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: string;
  folderId: string;
  pagedata1: any;
  layerDatas: any[];
  addNewLayer: boolean = false;
  layerNameValue: string = "";
  changeViewWidth: string = "100%"
  reNameValue: string = "";
  layer_type: string = "blank";
  documentDetails: any[];
  selectedPages: any[] = [];
  reNameSelectPages: any[] = [];
  selectedLayer: any;
  optionsPermission: boolean = false;
  allPagesSelected = true;
  selectNeededOnly: boolean = true;
  layerDetails: boolean = true;
  deleteLayer: boolean = false;
  keepAnnotation: boolean = false;
  selectedValue: any = "noValue";
  show: boolean = false;
  renameLayer: boolean = false;
  reNameSelectPageCheck: boolean = false;
  annotationCount: any;
  su: login;
  mailid: string;
  receiveString: string = "";
  coordinateX: number;
  coordinateY: number;
  fillColor: string;
  strokeColor: string;
  checkedAnnotationIds: any[] = [];
  checkedAnnotationIdsBackup: any[] = [];
  changeArrow: boolean = false;
  currentPageId: string = "";
  selectedPageId: string = "";
  arrowChangeToggle: number = -1;
  accessCollapse: boolean = false;
  arrowsArray: any[] = [];
  changeViewWidthNumber: number = 440;
  showUILayerDatas: any[] = [];
  showUILayerDatas_backup: any[] = [];
  layerDataCloneUI: any[] = [];
  getlayerData$: Subscription;
  activeLayerId: string[] = [];
  currentActiveLayerId: string;
  activeLayerIdDraw: string;
  layerCheckBoxClick$: Subscription;
  multiselectedOn_Layer: boolean = false;
  multiSelector$: Subscription;
  page_data: any[] = [];
  public canvasElement: CanvasRenderingContext2D;
  userrole: any;
  projectid: string;
  lock: boolean;
  lockdata: any;
  layers11: any;
  pageid: any;
  @Input() layerPage_multiple_on_off: any = false;
  @Input() layerPage_check_ids: any = [];
  @Input() layerPage_single_select: any = [];
  @Input() rotate_and_resize : any = false;
  currentPage_associated_pages:any[] = [];
  @Output() lockupdatetrigger: EventEmitter<number> = new EventEmitter();
  annotation_hidden:boolean=false;
  createDocumentStore: createDocumentVar = null;
  showUILayerDatas_svg_view:any[] = [];
  lockenable: boolean=false;
  isReadonly_layer:boolean = false;
 

  constructor(
    private route: ActivatedRoute,
    private dataService: DataserviceService,
    private documentService: CreateDocumentService,
    private sharedService: SharedService,
    private shapeService: ShapeService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef, public userRoleGlobal: GlobalUserRoleService,
    private uuidService: ValueService,
    private shapeService1: ShapeService,
    private textCheckService:DataService,
    private documentPage_layer:DocumentPagesService,private documentPage:DocumentPagesService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal")
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.mailid = this.su.email_id;

    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    this.folderId = this.route.snapshot.queryParamMap.get("folderId");
    this.createDocumentStore = new createDocumentVar();
    this.getlayerData$ = this.dataService.layerDatafromnavigation.subscribe(async (receiveData: any) => {
      let getData123 = _.cloneDeep(receiveData);
      // convert special character of layer details
      getData123.layerDatas = this.changeSpecialCharactersLayer(getData123.layerDatas);
      this.layerDatas = getData123.layerDatas;
      this.page_data = getData123.page_data;
      this.scaleFactor = getData123.scaleFactor;
      this.selectedPageId = getData123.currentPageId
      console.log(this.selectedPageId)
      this.multiselectedOn_Layer = getData123.selection_type;
      var annotations = [];
      if (this.layerDatas.length == 0) {
        this.show = false;
      }
      for (var i = 0; i < this.layerDatas.length; i++) {
        annotations = [];
        if (this.layerDatas[i].is_active_flag == "true" || this.layerDatas[i].is_active_flag == true || this.layerDatas[i].is_active_flag == "1") {
          this.activeLayerIdDraw = this.layerDatas[i].layer_id;
        }
        for (var j = 0; j < this.layerDatas[i].annotations.length; j++) {
          if ((this.layerDatas[i].annotations[j].is_removed == false || this.layerDatas[i].annotations[j].is_removed == "false" || this.layerDatas[i].annotations[j].is_removed == "0") && !this.layerDatas[i].annotations[j].annotation_id.includes('-scale')) {
            annotations.push(this.layerDatas[i].annotations[j]);
          }
        }
        this.layerDatas[i].annotations = annotations;
      }
      if (this.pagedata1 != null) {
        this.pagedata1 = this.layerDatas[0].associated_pages.filter(res =>
          res.page_id == this.selectedPageId)
        console.log(this.pagedata1)
      }
      this.layerDataCloneUI = _.cloneDeep(this.layerDatas);
      console.log(this.layerDataCloneUI);
      this.currentPageId = getData123.currentPageId;
      let filterPageBasedLayers = [];
      this.currentPage_associated_pages = [];
      for (let i = 0; i < this.layerDataCloneUI.length; i++) {
        if (this.layerDataCloneUI[i].annotations.length > 0) {

          console.log(this.layerDataCloneUI[i].annotations)
          // Filter scale annotations 
          this.layerDataCloneUI[i].annotations = this.layerDataCloneUI[i].annotations.filter((ele => !ele.annotation_id.includes("-scale")))
          this.layerDataCloneUI[i].annotations.forEach(count => {
            if (count.annotation_forms != undefined && count.annotation_forms.length > 0) {
              count.annotation_forms = count.annotation_forms.length;
            }
            else if (count.annotation_forms != undefined && count.annotation_forms.length == 0) {
              count.annotation_forms = 0;
            }
            if (count.annotation_media != undefined && count.annotation_media.length > 0) {
              count.annotation_media = count.annotation_media.length;
            }
            else if (count.annotation_media != undefined && count.annotation_media.length == 0) {
              count.annotation_media = 0;
            }
            if (count.annotation_links != undefined && count.annotation_links.length > 0) {
              count.annotation_links = count.annotation_links.length;
            }
            else if (count.annotation_links != undefined && count.annotation_links.length == 0) {
              count.annotation_links = 0;
            }
          });
        }
        for (let j = 0; j < this.layerDataCloneUI[i].associated_pages.length; j++) {
          if (this.layerDataCloneUI[i].associated_pages[j].page_id == this.currentPageId) {
            filterPageBasedLayers.push(this.layerDataCloneUI[i]);
            if(JSON.stringify(this.layerDataCloneUI[i].associated_pages)!=JSON.stringify(this.currentPage_associated_pages))
             this.currentPage_associated_pages.push(this.layerDataCloneUI[i].associated_pages[j]);
          }
        }
        // To prevent duplicate layers we finding the duplicating layer and removing it.
        // if(filterPageBasedLayers!=null && filterPageBasedLayers.length>1){
        //   for(let x=0;x<filterPageBasedLayers.length;x++){
        //     for(let y=x+1;y<filterPageBasedLayers.length;y++){
        //       if(filterPageBasedLayers[x].layer_id==filterPageBasedLayers[y].layer_id){
        //         filterPageBasedLayers.splice(y,1);
        //       }
        //     }
        //   }
        // }
      }
      let AscendLayers = filterPageBasedLayers;
      filterPageBasedLayers = AscendLayers.sort((a, b) => a.layer_name.localeCompare(b.layer_name));

      filterPageBasedLayers.forEach(layerdata => {
        layerdata.associated_pages = layerdata.associated_pages.filter((pages) => pages.is_removed != true && pages.is_removed != "true");
      });
      this.showUILayerDatas = _.cloneDeep(filterPageBasedLayers);
      this.showUILayerDatas_backup = _.cloneDeep(filterPageBasedLayers);
      for(let i=0;i<this.showUILayerDatas.length;i++){
        let annotations = this.showUILayerDatas[i].annotations
        if(annotations.length > 4){
          let annotation_new = annotations.slice(0,5);
          let annotationsCopy = annotations.slice(5,annotations.length);
          
          // for(let j=0;j<10;j++){
          //   annotation_new.push(annotations[j])
          // }
          // for(let svg=0;svg<annotation_new.length;svg++){
          //   let get_annotation = annotation_new[svg];
          //   annotation_new[svg] = await this.annotation_view_svg(get_annotation);
          // }
          for(let svg=0;svg<annotation_new.length;svg++){
            let get_annotation = annotation_new[svg];
            annotation_new[svg] = this.annotation_view_svg_direct(get_annotation);
          }
          this.showUILayerDatas[i].annotations = annotation_new;
          this.showUILayerDatas_backup[i].annotations = annotationsCopy;
        }else{
          let annotation_new = this.showUILayerDatas[i].annotations;
          for(let svg=0;svg<annotation_new.length;svg++){
            let get_annotation = annotation_new[svg];
            annotation_new[svg] = this.annotation_view_svg_direct(get_annotation);
          }
          this.showUILayerDatas[i].annotations = annotation_new;
          this.showUILayerDatas_backup[i].annotations = []
        }
      }
      // this.getActiveLayerId();
      console.log(filterPageBasedLayers);
      this.checkedAnnotationIds = getData123.checkedAnnotationIdsBackup;
      if (this.checkedAnnotationIds == undefined) {
        this.checkedAnnotationIds = [];
      }
      if(getData123.hasOwnProperty('initial_click') && getData123.initial_click==true){
        this.arrowsArray = [];
        if(this.showUILayerDatas.length > 0){
          for(let c=0;c<this.showUILayerDatas.length;c++){
            this.arrowsArray.push(this.showUILayerDatas[c].layer_id);
          }
        }
      }
      else{
        console.log(this.arrowsArray);
      }
    });
    this.getDocumentDetails();
    this.multiSelector$ = this.dataService.multiSelectFooter.subscribe((status: boolean) => {
      console.log(status);
      this.multiselectedOn_Layer = status;
    });


    //layers check box
    this.layerCheckBoxClick$ = this.dataService.layerCheckBoxClick.subscribe((getValue) => {
      if (getValue.option == false) {
        this.checkedAnnotationIds = [];
        if (getValue.id == '') {
          this.checkedAnnotationIds = [];
        }
        else {
          this.checkedAnnotationIds.push(getValue.id);
        }
      }
      else {
        if (getValue.action == 'add') {
          this.checkedAnnotationIds.push(getValue.id);
        }
        else {
          let indexConst = this.checkedAnnotationIds.indexOf(getValue.id);
          console.log(indexConst);
          this.checkedAnnotationIds.splice(indexConst, 1);
        }
      }
    });

    //viewonlymodetrigger
    this.dataService.viewOnlyModeTrigger.subscribe((isReadyOnly: any) => {
      this.isReadonly_layer = isReadyOnly;
    });
    let get_view_only_mode = this.encrptdecrpt.getItem("viewonlys");
    if(get_view_only_mode != null){
      this.isReadonly_layer = get_view_only_mode;
    } 
    
  }
  async ngForCallback(layer_id, last) {
    if (last && layer_id != undefined) {
      let i = 0;
      // for(let i=0;i<this.showUILayerDatas.length;i++){
      this.showUILayerDatas.forEach(async (params) => {
        // console.log('annotationlength',this.showUILayerDatas_backup[i].annotations.length,'layerid',params.layer_id);
        if (params.layer_id != undefined && layer_id == params.layer_id) {
          let annotations = this.showUILayerDatas_backup[i].annotations;
          if (annotations.length > 9) {
            let annotation_new = annotations.slice(0, 10);
            let annotationsCopy = annotations.slice(10, annotations.length)
            for (let svg = 0; svg < annotation_new.length; svg++) {
              let get_annotation = annotation_new[svg];
              annotation_new[svg] = this.annotation_view_svg_direct(get_annotation);
            }
            console.log("looping1", annotations.length, annotationsCopy.length);
            params.annotations = [...params.annotations, ...annotation_new]
            this.showUILayerDatas_backup[i].annotations = annotationsCopy
            if (this.showUILayerDatas_backup[i].annotations.length == 0) {
              // annotation svg drawing
              // this.getActiveLayerId();
            }
          } else if (annotations.length > 0) {
            for (let svg = 0; svg < annotations.length; svg++) {
              let get_annotation = annotations[svg];
              annotations[svg] = this.annotation_view_svg_direct(get_annotation);
            }
            console.log("looping2", annotations.length);
            params.annotations = [...params.annotations, ...annotations]
            this.showUILayerDatas_backup[i].annotations = [];
            // annotation svg drawing
            // this.getActiveLayerId();
          }
        }
        i += 1;
      })
      // }
      // console.log(this.showUILayerDatas);
      let currentPage = this.showUILayerDatas[0].associated_pages.filter(ele => ele.page_id == this.selectedPageId);
      if (currentPage.length != 0) {
        if (currentPage[0].is_lock == true || currentPage[0].is_lock == "true") {
          this.lockenable = true;
        }
        else {
          this.lockenable = false;
        }
      }
    }
    return "";
  }
  myFunc() {
    console.log('in myFunc');
  }
  scaleFactor: any;

  

  ngOnInit(): void { 
    console.log(this.layerPage_multiple_on_off);
    if(this.layerPage_check_ids!=undefined && this.layerPage_multiple_on_off==true){
      this.checkedAnnotationIds = Object.assign([],this.layerPage_check_ids);
    }
    else if(this.layerPage_single_select!=undefined && this.layerPage_multiple_on_off==false){
      this.checkedAnnotationIds = Object.assign([],this.layerPage_single_select);

    }
    console.log(this.showUILayerDatas);
  }

  ngAfterViewInit(): void {
    // this.makeResizableDiv();
  }

  getScaleValueForAnnotation(propertiesannotationData,type){
  
    var annot_element_id = propertiesannotationData["toolbar_element_id"];
    var annot_initial_width = propertiesannotationData["initial_width"]
    var annot_initial_height = propertiesannotationData["initial_height"]
    let getStringTopLeft = this.shapeService1.getSetScaleWidthandHeight(propertiesannotationData);

    if (annot_element_id <= 10) {
      annot_initial_width = propertiesannotationData["initial_width"]
      annot_initial_height = propertiesannotationData["initial_height"]
    }
    else if (annot_element_id == 17 || annot_element_id == 19 || annot_element_id == 20) {
      let shape_width_height = this.shapeService1.getCanvaswidthandHeight(propertiesannotationData);
      annot_initial_width = getStringTopLeft.width
      annot_initial_height = getStringTopLeft.height

      var org_annot_width = shape_width_height.width;
      var org_annot_height = shape_width_height.height;

      annot_initial_width = annot_initial_width < 0 ? (org_annot_width + annot_initial_width) * this.scaleFactor : (org_annot_width) * this.scaleFactor

      annot_initial_height = getStringTopLeft.height < 0 ? (shape_width_height.height + getStringTopLeft.height) * this.scaleFactor : (shape_width_height.height) * this.scaleFactor
    }
    else {
      annot_initial_width = getStringTopLeft.width
      annot_initial_height = getStringTopLeft.height
    }

    if (this.scaleFactor != "" && Number(this.scaleFactor > 0)) {
      let annotMetadata = this.shapeService1.process_set_scale(annot_element_id, annot_initial_width, annot_initial_height, this.scaleFactor)
      let splitData = annotMetadata.split("==")
      if (type == "radius"){
        return splitData[0]
      }
      else if (type == "area"){
        return splitData[1]
      } else {
        return splitData[2];
      }
      let annotMetadataLength = splitData[0];
      let annotMetadataArea = splitData[1];
      let annotMetadataHeight = splitData[2];
    }
    else {
      return "N/A";
    }
  }

  async getActiveLayerId() {
    if (this.showUILayerDatas != undefined) {
      let clone_show_UI_layerdata = _.cloneDeep(this.showUILayerDatas);
      for (var i = 0; i < clone_show_UI_layerdata.length; i++) {
        for (var j = 0; j < clone_show_UI_layerdata[i].annotations.length; j++) {
          let get_annotation = clone_show_UI_layerdata[i].annotations[j];
          let get_path = await this.annotation_view_svg(get_annotation);
          this.showUILayerDatas[i].annotations[j] = get_path;
        }
        // find Remove layer instead of empty array showing, we can do optimization it will give better perfomance
        // let find_layer_index = this.showUILayerDatas.findIndex((layer)=>layer.layer_id==clone_show_UI_layerdata[i].layer_id);
        // if(find_layer_index!=-1){ 
        //   this.showUILayerDatas.splice(find_layer_index,1);  
        // }
        // this.showUILayerDatas.push(clone_show_UI_layerdata[i]);
      }
    }
  }


  checkStrokeColor(checkStroke) {
    switch (checkStroke) {
      case "blue":
        this.strokeColor = "rgba(0.999999999885,44.999999991,98.0000000025,1)";
        break;
      case "red":
        this.strokeColor = "rgba(188.00000001,9.00000000075,0,1)";
        break;
      case "orange":
        this.strokeColor = "rgba(244.0000000005,142.9999999935,0,1)";
        break;
      case "yellow":
        this.strokeColor = "rgba(255,255,0,1)";
        break;
      case "green":
        this.strokeColor = "rgba(152.000000007,208.9999999905,51,1)";
        break;
      case "default_blue":
        this.strokeColor = "rgba(0.999999999885,94.000000005,204.999999993,1)";
        break;
      case "purple":
        this.strokeColor = "rgba(108.000000009,46.0000000095,167.000000004,1)";
        break;
      case "pink":
        this.strokeColor = "rgba(222.9999999945,29.999999994,211.000000002,1)";
        break;
      case "dark_pink":
        this.strokeColor = "rgba(200.0000000025,50.000000007,177.0000000105,1)";
        break;
      case "light_blue":
        this.strokeColor = "rgba(127.9999999965,240.999999996,254.000000007,1)";
        break;
      case "brown":
        this.strokeColor = "rgba(123.999999999,77.9999999895,0.2509803922,1)";
        break;
      case "grey":
        this.strokeColor =
          "rgba(148.0000000095,148.0000000095,148.0000000095,1)";
        break;
      case "medium_grey":
        this.strokeColor = "rgba(204,204,204,1)";
        break;
      case "light_grey":
        this.strokeColor = "rgba(225.000000006,225.000000006,225.000000006,1)";
        break;
      case "white":
        this.strokeColor = "rgba(255,255,255,1)";
        break;
      case "clear":
        this.strokeColor = "";
        break;
      default:
        this.strokeColor = "rgba(0,0,0,1);";
    }
  }

  checkFillColor(checkFill) {
    switch (checkFill) {
      case "blue":
        this.fillColor = "rgba(0.999999999885,44.999999991,98.0000000025,1)";
        break;
      case "red":
        this.fillColor = "rgba(188.00000001,9.00000000075,0,1)";
        break;
      case "orange":
        this.fillColor = "rgba(244.0000000005,142.9999999935,0,1)";
        break;
      case "yellow":
        this.fillColor = "rgba(255,255,0,1)";
        break;
      case "green":
        this.fillColor = "rgba(152.000000007,208.9999999905,51,1)";
        break;
      case "default_blue":
        this.fillColor = "rgba(0.999999999885,94.000000005,204.999999993,1)";
        break;
      case "purple":
        this.fillColor = "rgba(108.000000009,46.0000000095,167.000000004,1)";
        break;
      case "pink":
        this.fillColor = "rgba(222.9999999945,29.999999994,211.000000002,1)";
        break;
      case "dark_pink":
        this.fillColor = "rgba(200.0000000025,50.000000007,177.0000000105,1)";
        break;
      case "light_blue":
        this.fillColor = "rgba(127.9999999965,240.999999996,254.000000007,1)";
        break;
      case "brown":
        this.fillColor = "rgba(123.999999999,77.9999999895,0.2509803922,1)";
        break;
      case "grey":
        this.fillColor = "rgba(148.0000000095,148.0000000095,148.0000000095,1)";
        break;
      case "medium_grey":
        this.fillColor = "rgba(204,204,204,1)";
        break;
      case "light_grey":
        this.fillColor = "rgba(225.000000006,225.000000006,225.000000006,1)";
        break;
      case "white":
        this.fillColor = "rgba(255,255,255,1)";
        break;
      case "clear":
        this.fillColor = "";
        break;
      default:
        this.fillColor = "rgba(0,0,0,1);";
    }
  }
  column: boolean = true;

  addNewLayerAuc() {
    this.addNewLayer = true;
    this.changeArrow = true;
    this.deleteLayer = false;
    this.optionsPermission = false;
    this.layerDetails = false;
    this.renameLayer = false;
    this.column = false;
    this.changeViewWidth = "730px";
    this.changeViewWidthNumber = 830;
    this.allPagesSelectedInitialy();
    // let getElementLayer = document.getElementById("layerAni");
    // getElementLayer.style.transition="0.5s ease-out transform";
    // this.sharedService.nextMessage("AddNewLayer");
  }

  givenOptions(layerData, layerid, page_id) {
    console.log(page_id, layerData)
    this.pageid =
      this.selectedLayer = layerData;
    this.layers11 = layerid
    this.optionsPermission = false;
    this.optionsPermission = true
    this.changeArrow = false;
    this.addNewLayer = false;
    this.deleteLayer = false;
    this.layerDetails = false;
    this.renameLayer = false;
    this.changeViewWidth = "100%";
    this.changeViewWidthNumber = 440;
    this.column = true;
    let pagedata1 = page_id.filter(ele => ele.page_id == this.currentPageId)

    console.log(pagedata1)

    if (pagedata1[0].is_lock == true || pagedata1[0].is_lock == "true" || pagedata1[0].is_lock == 1 || pagedata1[0].is_lock == "1") {

      this.lock = true;

    } else {

      this.lock = false;
    }
  }

  deleteLayerAuc() {
    this.deleteLayer = true;
    this.changeArrow = true;
    this.keepAnnotation = false;
    this.addNewLayer = false;
    this.optionsPermission = false;
    this.layerDetails = false;
    this.selectedValue = "noValue";
    this.renameLayer = false;
    this.changeViewWidth = "730px";
    this.changeViewWidthNumber = 830;
    this.column = false;
  }

  renameLayerAuc() {
    this.optionsPermission = false;
    this.changeArrow = true;
    this.addNewLayer = false;
    this.deleteLayer = false;
    this.layerDetails = false;
    this.renameLayer = true;
    this.column = false;
    this.changeViewWidth = "730px";
    this.changeViewWidthNumber = 830;
    this.reNameValue = this.selectedLayer.layer_name;
  }



  addLayerAuc(layerName) {
    if(layerName == undefined || layerName.trim() == ''){
      return;
    }
    this.changeArrow = false;
    this.show = true;
    console.log(this.selectedPages);
    let newlayerId = uuidv1().toUpperCase();
    let newCreateDate = new Date().toISOString();
    let layerDate = new Date().getTime();
    var associated_pages = [];
    console.log(this.selectedPages);
    for (var i = 0; i < this.selectedPages.length; i++) {
      let pageValue = {
        page_id: this.selectedPages[i],
        layer_id: this.su.user_id + "-" + newlayerId + "-" + layerDate,
        created_date: newCreateDate,
        last_updated_date: newCreateDate,
        version_number: 1,
        is_removed: false,
        is_lock: false,
        is_hidden: false,
        document_id: this.folderId,
        created_by_user_id: this.su.user_id
      };
      associated_pages.push(pageValue);
    }
    let tempNewLayer = {
      created_by_user_id: this.su.user_id,
      layer_id: this.su.user_id + "-" + newlayerId + "-" + layerDate,
      project_id: this.projectId,
      layer_type: this.layer_type,
      is_visible_flag: true,
      is_active_flag: false,
      document_id: this.folderId,
      is_default_flag: true,
      created_date: newCreateDate,
      last_updated_date: newCreateDate,
      is_removed: false,

      annotations: [],
      is_locked_flag: false,
      layer_name: layerName,
      associated_pages: associated_pages
    }

    this.changeViewWidth = "100%";
    this.changeViewWidthNumber = 440;
    this.column = true;
    console.log(this.selectedPages);
    if (this.layerDatas == undefined) {
      this.layerDatas = []

    }
    this.layerDatas.push(tempNewLayer);
    let pass_data = {layer_data:this.layerDatas,ids:-1};
    this.dataService.mediaTagsUpdate.emit(pass_data);

    console.log(this.layerDatas);
    var uuidDate = new Date().toISOString();
    var date = new Date().getTime();
    this.addNewLayer = false;

    if (this.selectedPages.length > 0) {
      this.documentService
        .createLayerPages(
          layerName,
          this.layer_type,
          newCreateDate,
          layerDate,
          newlayerId,
          this.projectId,
          this.folderId,
          associated_pages
        )
        .subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
            // this.dataService.layeractiveEnable.emit(false);
            this.show = false;
            this.layerNameValue = "";
            this.layerDetails = true;
            this.addNewLayer = false;
          }
          else {
            this.errorMessage();
          }
          // add collapse view new layer
          this.arrowsArray.push(tempNewLayer.layer_id);
          this.changeLayerUI(this.layerDatas);
          // this.showlayerUIChanges(tempNewLayer,'addlayerOption');
        });
    }
  }

  getDocumentDetails() {
    this.documentService
      .getDocumentDetails(this.projectId, this.folderId)
      .subscribe((response) => {
        console.log(response);
        this.documentDetails = response["response_body"]["document_list"];
        if (this.documentDetails != undefined) {
          this.documentDetails.filter((data) => {
            this.selectedPages.push(data.page_id);
          });
          this.documentDetails.forEach((data) => {
            this.reNameSelectPages.push(data.page_id);
          });
        }
      });
  }

  setActiveLayer(event, layerId) {
    this.show = true;
    let layerIndex = this.layerDatas.findIndex((Fdata) => Fdata.layer_id === layerId);
    if (layerIndex != -1) {
      this.layerDatas.forEach((data) => {
        data.is_active_flag = false;
      });
      this.layerDatas[layerIndex].is_active_flag = true;
      this.changeLayerUI(this.layerDatas);
      console.log(this.arrowsArray);
      // this.showlayerUIChanges(layerId,'active');
      let sendDocumentpageData = { type: 'activeupdate', structureData: this.layerDatas, active_layer_id:layerId }
      this.page_data[0].active_layer_id = layerId;
      let clonelockLayerData: any = _.cloneDeep(this.layerDatas);
      clonelockLayerData.document_id = this.page_data[0].document_id
      this.documentService.activeLayerUpdateForm(clonelockLayerData, layerId, this.page_data[0].page_id).subscribe((response) => {
        console.log(response);
        if (response["response_code"] == 200) {
          this.dataService.layerPageAllUpdateReceive.emit(sendDocumentpageData);
          this.show=false;
        }
        else {
          this.errorMessage();
        }
      });
    }
  }

  setActiveAuc() {
    this.changeViewWidth = "100%";
    this.changeViewWidthNumber = 440;
    this.changeArrow = false;
    this.column = true;
    let layers = [];
    this.layerDatas.forEach((data) => {
      if (data.layer_id === this.selectedLayer.layer_id) {
        data.is_active_flag = true;
        layers.push(data);
      } else {
        data.is_active_flag = false;
        layers.push(data);
      }
    });
    this.layerDatas = layers;
    this.layerDetails = true;
    this.optionsPermission = false;
    this.dataService.layerPageUpdateData.emit(this.layerDatas);
    this.documentService.setActiveLayerUpdate(layers).subscribe((response) => {
      console.log(response);
    });
  }

  setLockUnlock() {
    this.show = true;
    this.changeViewWidth = "100%";
    this.changeViewWidthNumber = 440;
    this.column = true;
    this.changeArrow = false;
    if(this.layerDatas.length==0){
      this.layerDatas=this.showUILayerDatas
    }
    console.log(this.layers11, this.currentPageId)
    let get_layer = this.layerDatas.filter(ele =>ele.layer_id == this.layers11)
    let get_associated_pages = get_layer[0].associated_pages;
    this.pagedata1 = get_associated_pages.filter(ele => ele.page_id == this.currentPageId)
    console.log(this.pagedata1)
    if (this.pagedata1[0].is_lock == true || this.pagedata1[0].is_lock == "true" || this.pagedata1[0].is_lock == 1 || this.pagedata1[0].is_lock == "1") {
      this.pagedata1[0].is_lock = false;
      this.lock = true;
    } else {
      this.pagedata1[0].is_lock = true;
      this.lock = false;
    }
    // let find_page_datas = 
    let get_associated_pages_index = get_associated_pages.findIndex((pages)=>pages.page_id==this.pagedata1[0].page_id);
    if(get_associated_pages_index > -1){
      get_associated_pages[get_associated_pages_index] = this.pagedata1[0];
      this.currentPage_associated_pages = get_associated_pages;
    }
    this.layerDatas.forEach((data) => {
      if (data.layer_id === this.selectedLayer.layer_id) {
        data.associated_pages = get_associated_pages;
      }
    });
    this.lockupdatetrigger.emit(1);
    console.log(this.layerDatas)
    this.layerDetails = true;
    this.optionsPermission = false;
    // this.changeLayerUI(this.layerDatas);
    this.showlayerUIChanges('', 'lock');
    let sendDocumentpageData = { type: 'lockupdate', structureData: this.layerDatas }
    this.dataService.layerPageAllUpdateReceive.emit(sendDocumentpageData);
    let clonelockLayerData = _.cloneDeep(this.layerDatas);
    this.documentService.layerUpdateForm1(clonelockLayerData, this.selectedLayer.layer_id,'updatelayer').subscribe((response) => {
      console.log(response);
      if (response["response_code"] == 200) {
        this.show = false;
      }
      else {
        this.errorMessage();
      }
    });
  }

  deleteLayerAPI(layerId) {
    this.show = true;
    this.changeViewWidth = "100%";
    this.changeViewWidthNumber = 440;
    this.column = true;
    this.changeArrow = false;
    this.deleteLayer = false;
    if (this.keepAnnotation == false || layerId == "noValue") {
      this.documentService.getOldLayerAnnotation(this.selectedLayer.layer_id).subscribe((singleresponse) => {
        console.log(singleresponse);
        console.log('yes');
        if (singleresponse["response_code"] == 200) {
          var getannotationDatas = _.cloneDeep(singleresponse["response_body"]["layer_data"]["annotations"]);
          if (getannotationDatas.length > 0) {
            getannotationDatas = getannotationDatas.filter((data) => data.page_id === this.currentPageId);
            let replacelayerannotations = this.layerDatas.findIndex((single) => single.layer_id == this.selectedLayer.layer_id);
            for (let aremove = 0; aremove < getannotationDatas.length; aremove++) {
              getannotationDatas[aremove].is_removed = true;
            }
            this.layerDatas[replacelayerannotations].annotations = getannotationDatas;
          }
          let layers = [];
          this.layerDatas.forEach((data) => {
            if (data.layer_id === this.selectedLayer.layer_id) {
              if (data.associated_pages.length > 0) {
                for (let i = 0; i < data.associated_pages.length; i++) {
                  if (data.associated_pages[i].page_id == this.currentPageId) {
                    data.associated_pages[i].is_removed = true
                  }
                }
              } else {
                data.is_removed = true;
              }
              layers.push(data);
            } else {
              layers.push(data);
            }
          });
          this.layerDatas = layers;

          let remove_deleted_backup = _.cloneDeep(this.layerDatas);

          this.layerDatas = remove_deleted_backup.filter((list) => {
            let layerCurrentPageData = list.associated_pages.filter((ele => ele.page_id == this.currentPageId));
            if (layerCurrentPageData.length > 0) {
              if (layerCurrentPageData[0].hasOwnProperty("is_removed") && layerCurrentPageData[0].hasOwnProperty("is_hidden") && this.createDocumentStore.data_allow_condition.includes(layerCurrentPageData[0].is_removed) && this.createDocumentStore.data_allow_condition.includes(layerCurrentPageData[0].is_hidden)) {
                return true;
              }
              else if (!layerCurrentPageData[0].hasOwnProperty("is_removed") || !layerCurrentPageData[0].hasOwnProperty("is_hidden")) {
                if (list.is_removed == "true" || list.is_removed == true || list.is_removed == "1") {
                  return false;
                }
                else {
                  return true;
                }
              }

            }
            else { //current page is not in associated pages
              return false;
            }
          });

          this.dataService.layerPageUpdateData.emit(remove_deleted_backup);
          this.showlayerUIChanges('', 'delete');
          let cloneLayerData = _.cloneDeep(layers);
          this.documentService.layerUpdateFormDelete(cloneLayerData, this.selectedLayer.layer_id,'deletelayer').subscribe((response) => {
            console.log(response);
            if (response["response_code"] == 200) {
              this.show = false;
              this.deleteLayer = false;
              console.log(layers);
            }
            else {
              this.errorMessage();
            }
          });
        }
        else{
          this.errorMessage();
        }
      });
    } else {
      var start=this.functionstarttime("start_api")
      this.documentService.getOldLayerAnnotation(this.selectedLayer.layer_id).subscribe((response) => {
        if (response["response_code"] == 200) {
      var getSingleAnnotations = _.cloneDeep(response["response_body"]["layer_data"]["annotations"]);
       let layers = [];
       var copylayerId = layerId;
    
           this.layerDatas.forEach((data) => {
        if (data.layer_id === this.selectedLayer.layer_id) {
              if (data.associated_pages.length > 0) {
                for (let i = 0; i < data.associated_pages.length; i++) {
                  if (data.associated_pages[i].page_id == this.currentPageId) {
                    data.associated_pages[i].is_removed = true
                  }
                }
              } else {
                data.is_removed = true;
              }
              layers.push(data);
            } else {
              layers.push(data);
            }
           
           })
          
       
          this.layerDatas = layers;
         
          if (getSingleAnnotations.length > 0) {
            getSingleAnnotations = getSingleAnnotations.filter((data) => data.page_id === this.currentPageId)

            var annot_delete = _.cloneDeep(getSingleAnnotations);
            annot_delete = annot_delete.filter((data) => data.page_id === this.currentPageId)

            let deleteLayerIndex = this.layerDatas.findIndex((single) => single.layer_id == this.selectedLayer.layer_id);
            this.layerDatas[deleteLayerIndex].annotations = annot_delete;
            this.layerDatas[deleteLayerIndex].annotations.forEach(deleteitem => {
              
              // let annotationIndex = this.layerDatas[deleteLayerIndex].annotations.findIndex((single) => single.annotation_id == item.annotation_id);
              deleteitem.is_removed = true;
            })

            getSingleAnnotations.forEach(item => {
              item.layer_id = layerId
              item.annotation_id = this.uuidService.generateUUID()
            });

            let filter_removed_annotation = getSingleAnnotations.filter((data)=> this.createDocumentStore.data_allow_condition.includes(data.is_removed));
            getSingleAnnotations = _.cloneDeep(filter_removed_annotation);

            let copyLayerIndex = this.layerDatas.findIndex((single) => single.layer_id == copylayerId);
            let getCurrentAnnotation = this.layerDatas[copyLayerIndex].annotations;
            let mergeOldNewAnnotations = [...getCurrentAnnotation, ...getSingleAnnotations];
            console.log(mergeOldNewAnnotations);
            this.layerDatas[copyLayerIndex].annotations = mergeOldNewAnnotations;
          }

          layers = this.layerDatas;
          let tempe_layers = this.layerDatas;
          let update_api_data = this.layerDatas;
          let cloneLayerData = _.cloneDeep(update_api_data);
          let emit_layer_data = _.cloneDeep(tempe_layers);
          let object_model_data = _.cloneDeep(tempe_layers);
          object_model_data = this.changeSpecialCharactersLayer(object_model_data);
          this.changeLayerUI(object_model_data);
          this.dataService.layerPageUpdateData.emit(emit_layer_data);
          // this.showlayerUIChanges()
          this.documentService.deleteandMoveUpdate(cloneLayerData, this.selectedLayer.layer_id, copylayerId, getSingleAnnotations,'deletelayer').subscribe((response) => {
            if (response["response_code"] == 200) {
              this.show = false;
              this.functionendtime("start_api",start)
              this.remove_deleted_layer_after_api();
            }
            else {
              this.errorMessage();
            }
          });
        }
      });
    }
  }


  // dummySelect() {
  //   var item = [];
  //   if (this.selectedLayer.annotations.length > 0) {
  //     for (var i = 0; i < this.selectedLayer.annotations.length; i++) {
  //       item.push(this.selectedLayer.annotations[i]);
  //     }
  //   }
  // }



  toggleVisibility(event, pageId) {
    if (event.target.checked == true) {
      this.selectedPages.push(pageId);
      if (this.documentDetails.length == this.selectedPages.length) {
        this.allPagesSelected = true;
      }
      else if (this.documentDetails.length != this.selectedPages.length) {
        this.allPagesSelected = false;
      }
    } else {
      for (var i = 0; i < this.selectedPages.length; i++) {
        if (this.selectedPages[i] == pageId) {
          this.selectedPages.splice(i, 1);
          if (this.selectedPages.length > 0 && this.documentDetails.length != this.selectedPages.length) {
            this.allPagesSelected = false;
          }
        }
        // if(this.selectedPages.length==0){
        //   this.allPagesSelected = true;
        //   var getTag1 = document.getElementsByClassName("checkbox-get");
        //   for (var i = 0; i < getTag1.length; i++) {
        //     (getTag1[i] as HTMLInputElement).checked = true;
        //   }
        //   for (var j = 0; j < this.documentDetails.length; j++) {
        //     this.selectedPages.push(this.documentDetails[j].page_id);
        //   }
        // }
      }
    }
  }

  checkPageId(pageid) {
    if (this.selectedPages.some((data) => data == pageid)) {
      return true;
    }
    else {
      return false;
    }
  }

  // addLayerAuc1(a,b){
  //   console.log(this.selectedPages);
  // }
  //   checkLayerLocked(associated_pages){
  // let pagedata = associated_pages.filter(ele => ele.page_id == this.selectedPageId)
  //     if(pagedata.length>0){
  //       if(pagedata[0].is_lock == true || pagedata[0].is_lock == "true" || pagedata[0].is_lock == 1 || pagedata[0].is_lock == "1"){
  //         this.lock=true;
  //         return 'visible'
  //       }else{
  //         this.lock=false;
  //       }
  //     }
  //     return 'hidden'
  //   }
  check(recevieassociated_pages, layerid, layerdetail) {
    if(recevieassociated_pages[0].is_lock!=true){
    console.log(this.lock)
    this.show = true;
    let associated_pages = recevieassociated_pages;
    let page_associated_pages_index = associated_pages.findIndex(ele => ele.page_id == this.selectedPageId);
    if (page_associated_pages_index > -1) {

      if (!associated_pages[page_associated_pages_index].hasOwnProperty('is_hidden')) {
        if (this.createDocumentStore.data_allow_conditionT.includes(layerdetail.is_visible_flag)) {
          layerdetail.is_visible_flag = false;
          // associated_pages[page_associated_pages_index].is_hidden=true;
        } else if (this.createDocumentStore.data_allow_condition.includes(layerdetail.is_visible_flag)) {
          layerdetail.is_visible_flag = true;
          // associated_pages[page_associated_pages_index].is_hidden=false;
        }
        let find_index=this.layerDatas.findIndex(item=>item.layer_id==layerid);
        if(find_index>-1){
          this.layerDatas[find_index]=layerdetail;
        }
      }
      else if (associated_pages[page_associated_pages_index].hasOwnProperty('is_hidden')) {
        if (this.createDocumentStore.data_allow_condition.includes(associated_pages[page_associated_pages_index].is_hidden)) {
          associated_pages[page_associated_pages_index].is_hidden = true;
          this.annotation_hidden=true;
        } else {
          associated_pages[page_associated_pages_index].is_hidden = false;
          this.annotation_hidden=false;
        }
      }
    
    }
    this.currentPage_associated_pages = associated_pages;
    // store layerdatas values
    let filter_layer_id = this.layerDatas.findIndex((layer_value)=>layer_value.layer_id==layerid);
    if(filter_layer_id > -1){
      this.layerDatas[filter_layer_id].associated_pages = associated_pages
    }
    // store layerdatas values
    this.showlayerUIChanges(layerid, 'visible');
    let sendDocumentpageData = { type: 'visibleupdate', structureData: this.layerDatas }
    let clonelockLayerData = _.cloneDeep(this.layerDatas);
    this.documentService.layerUpdateForm1(clonelockLayerData, layerid,'updatelayer').subscribe((response) => {
      console.log(response);
      if (response["response_code"] == 200) {
        this.show = false;
        console.log('layerdataapi after',_.cloneDeep(sendDocumentpageData))
        this.dataService.layerPageAllUpdateReceive.emit(sendDocumentpageData);
      }
      else {
        this.errorMessage();
      }
    });


  }

  }
  getlayeravailable(layerdetails) {
    if (layerdetails.associated_pages.filter((pages) => pages.page_id === this.selectedPageId).length > 0) {
      return true;
    }
    return false;
  }
  checkLayerVisible(associated_pages, layer) {

    if(this.rotate_and_resize==true){
      return 'assets/images/icons/P3WebIcon_36Eye.png'
    }

    let pagedata = associated_pages.filter(ele => ele.page_id == this.selectedPageId)



    if (pagedata.length > 0 && pagedata[0].is_hidden == undefined) {
      if (layer.is_visible_flag == "false" || layer.is_visible_flag == false || layer.is_visible_flag == 0 || layer.is_visible_flag == "0") {
        return 'assets/images/icons/P3WebIcon_37EyeSlash.png'
      }
      return 'assets/images/icons/P3WebIcon_36Eye.png'
    }



    if (pagedata.length > 0 && (pagedata[0].is_hidden == false || pagedata[0].is_hidden == true)) {

      if (pagedata[0].is_hidden == true || pagedata[0].is_hidden == "true" || pagedata[0].is_hidden == 1 || pagedata[0].is_hidden == "1") {

        return 'assets/images/icons/P3WebIcon_37EyeSlash.png'
      }
    }
    return 'assets/images/icons/P3WebIcon_36Eye.png'

  }
  layer(associated_pages) {
    let pagedata = associated_pages.filter(ele => ele.page_id == this.selectedPageId)
    if (pagedata.length > 0) {
      if (pagedata[0].is_lock == true || pagedata[0].is_lock == "true" || pagedata[0].lock == 1 || pagedata[0].is_lock == "1") {
        return "assets/images/document/P3_Documents_LockIcon.png"
      }
      else {

      }

    }
    return ""
  }
  keepAnnotationToggle(event) {
    if (event.target.checked == true) {
      this.keepAnnotation = true;
    } else {
      this.keepAnnotation = false;
    }
  }

  deselectAllPages(event) {
    if (event.target.checked == true) {
      this.allPagesSelected = true;
      var getTag = document.getElementsByClassName("page-checkbox");

      for (var i = 0; i < getTag.length; i++) {
        (getTag[i] as HTMLInputElement).checked = true;
      }
      this.selectNeededOnly = true;
      this.selectedPages = [];
      this.documentDetails.filter((data) => {
        this.selectedPages.push(data.page_id);
      });
    } else {
      this.allPagesSelected = !this.allPagesSelected;
      this.selectNeededOnly = false;
      this.selectedPages = [];
    }
  }

  currentPageSelect(event) {
    if (event.target.checked == true) {
      this.reNameSelectPages = [];
      this.reNameSelectPageCheck = !this.reNameSelectPageCheck;
    }
  }

  selectAllPages(event) {
    if (event.target.checked == true) {
      this.reNameSelectPageCheck = !this.reNameSelectPageCheck;
      this.documentDetails.forEach((data) => {
        this.reNameSelectPages.push(data.page_id);
      });
    }
  }

  // reNameAPI1(value){
  //   console.log(this.currentPageId);
  // }

  reNameAPI(reNameValue) {
    this.show = true;
    this.changeViewWidth = "100%";
    this.changeViewWidthNumber = 440;
    this.column = true;
    this.renameLayer = false;
    this.changeArrow = false;
    let layers = [];
    this.layerDatas.forEach((data) => {
      if (data.layer_id === this.selectedLayer.layer_id) {
        // reNameValue = this.textCheckService.changeFormat(reNameValue);
        data.layer_name = reNameValue;
        layers.push(data);
      } else {
        layers.push(data);
      }
    });
    // this.layerDatas = layers;
    this.dataService.getIdUpdated.emit(this.layerDatas);
    // latest comment
    //this.checkLayerPagesBasedShowData();
    // this.changeLayerUI(this.layerDatas);
    this.showlayerUIChanges(reNameValue, 'rename');
    let cloneLayerDataRename = _.cloneDeep(layers);
    this.documentService.layerUpdateForm1(cloneLayerDataRename, this.selectedLayer.layer_id,'property').subscribe((response) => {
      console.log(response);
      if (response["response_code"] == 200) {
        this.show = false;
        this.reNameValue = "";
        this.layerDetails = true;
      }
      else {
        this.errorMessage();
      }
    });
  }

  getIndex: number;
  sendIndex(index) {
    this.getIndex = index;
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.layerNameValue = changeUpperCaseProjectName;
    }
  }

  firstLetterCapitalRename(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.reNameValue = changeUpperCaseProjectName;
    }
  }

  checkchecked(layerDetails) {
    if (this.page_data != null) {
      if (this.page_data.length > 0) {
        if (this.page_data[0].active_layer_id == layerDetails.layer_id) {
          return true;
        }
      }
    }
    if ((layerDetails['is_active_flag'] == true || layerDetails['is_active_flag'] == 'true' || layerDetails['is_active_flag'] == '1') && this.page_data[0].active_layer_id != layerDetails.layer_id && this.page_data[0].active_layer_id == null) {
      console.log("TRUEEEE")
      return true;
    } else {
      return false;
    }

    // if (value == true || value == 'true' || value == '1') {
    //   return true;
    // }
    // else {
    //   return false;
    // }
  }

  checkedAccess: boolean = false;

  checkUncheckAnnotations(id) {
    if (this.checkedAnnotationIds.length > 0) {
      if (this.checkedAnnotationIds.some((data) => data == id)) {
        return true;
      }
    }
    else {
      return false;
    }
  }

  annotationChecked(id, event,annot_details) {
    console.log(this.currentPage_associated_pages,annot_details);
    let check_lock_final  = true;
    let visible_final = true;
    let allow_condition = ["false",false,0,"0"]; 
    if(this.currentPage_associated_pages.length>0){
      let filter_layer_id = this.currentPage_associated_pages.filter((locklayerdata)=>locklayerdata.layer_id===annot_details.layer_id && locklayerdata.page_id===annot_details.page_id);
      if(filter_layer_id.length>0){
        let check_lock_condtion = filter_layer_id[0].is_lock; 
        check_lock_final = allow_condition.includes(check_lock_condtion);
        let check_visible_condtion = filter_layer_id[0].is_hidden; 
        visible_final  = allow_condition.includes(check_visible_condtion);
      }
    }
    if (this.layerPage_multiple_on_off == false && check_lock_final==true && visible_final==true) {
      if (event.target.checked == true) {
        this.cdRef.detectChanges();
        this.layerPage_single_select = [];
        if(check_lock_final){
          this.layerPage_single_select.push(id);
          let addedIdOptions = { action: 'add', ids: this.layerPage_single_select }
          this.dataService.checkedAnnotationId.emit(addedIdOptions);
        }
        else{
          let addedIdOptions = { action: 'add', ids: this.layerPage_single_select };
          this.dataService.checkedAnnotationId.emit(addedIdOptions);
        }
      }
      else {
              this.layerPage_single_select = [];
              let addedIdOptions = { action: 'remove', ids: this.layerPage_single_select }
              this.dataService.checkedAnnotationId.emit(addedIdOptions);
        // if (this.checkedAnnotationIds.length == 0) {
        //   this.dataService.imageChangeDocHeaderSearch.emit(false);
        //   let ids = [];
        //   this.dataService.checkedAnnotationId.emit(ids);
        // }
      }
      console.log(this.checkedAnnotationIds);
      // this.dataService.sendMessage(id);
    }
    else if (this.layerPage_multiple_on_off == true && check_lock_final==true && visible_final==true) {
      if (event.target.checked == true) {
        this.layerPage_check_ids.push(id);
        let singleIdSend = [];
        singleIdSend.push(id);
        let addedIdOptions = { action: 'add', ids: singleIdSend }
        if(check_lock_final){
          this.dataService.checkedAnnotationId.emit(addedIdOptions);
        }
      }
      else {
        if (this.layerPage_check_ids.length > 0) {
          for (let i = 0; i < this.layerPage_check_ids.length; i++) {
            if (this.layerPage_check_ids[i] == id) {
              this.checkedAnnotationIds.splice(i, 1);
              let singleIdSend = [];
              singleIdSend.push(id);
              let addedIdOptions = { action: 'remove', ids: singleIdSend }
              if(check_lock_final){
                this.dataService.checkedAnnotationId.emit(addedIdOptions);
              }
            }
          }
        }
        // if (this.checkedAnnotationIds.length == 0) {
        //   this.dataService.imageChangeDocHeaderSearch.emit(false);
        //   let ids = [];
        //   this.dataService.checkedAnnotationId.emit(ids);
        // }
      }
      console.log(this.checkedAnnotationIds);
      // this.dataService.sendMessage(id);
    }

  }

  closeBox() {
    this.dataService.layeractiveEnable.emit(false);
  }

  makeResizableDiv() {
    const element = document.getElementById('resizersLayer');
    const resizers = document.querySelectorAll('.resizerLayer');
    const minimum_size = 300;
    let original_width = 440;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    let mousedown = false;
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener('mousedown', (e: any) => {
        console.log(resizers);
        if (this.column == true) {
          e.preventDefault();
          mousedown = true;
          original_width = this.changeViewWidthNumber;
          console.log(original_width);
          original_x = element.getBoundingClientRect().left;
          original_y = element.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
          window.addEventListener('mousemove', (e) => {
            if (mousedown == true) {
              resize(e);
            }
          });
          window.addEventListener('mouseup', (e) => {
            mousedown = false;
            stopResize(e);
          })
        }
      });

      const resize = (e) => {
        if (currentResizer.classList.contains('bottom-right')) {
          const width = original_width + (e.pageX - original_mouse_x);
          console.log(e.pageX, original_mouse_x, original_width);
          if (this.changeViewWidthNumber < width) {
            this.changeArrow = false;
          }
          else if (this.changeViewWidthNumber > width) {
            this.changeArrow = true;
          }
          if (width > minimum_size) {
            element.style.width = width + 'px';
            this.changeViewWidth = width + 'px';
            this.changeViewWidthNumber = width;
          }
          console.log(width);
        }
        else {
          const width = original_width - (e.pageX - original_mouse_x);
          if (this.changeViewWidthNumber < width) {
            this.changeArrow = false;
          }
          else if (this.changeViewWidthNumber > width) {
            this.changeArrow = true;
          }
          if (width > minimum_size) {
            element.style.width = width + 'px'
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
            this.changeViewWidth = width + 'px';
            this.changeViewWidthNumber = width;
          }
          console.log(width);
        }
      }

      const stopResize = (e) => {
        e.stopPropagation();
        window.removeEventListener('mousemove', (e) => { resize(e) });
      }
    }
  }
  delete() {
    this.deleteLayer = true;
  }
  collapse() {
    if (this.column == false) {
      this.optionsPermission = false;
      this.layerNameValue = "";
      this.addNewLayer = false;
      this.deleteLayer = false;
      this.layerDetails = false;
      this.renameLayer = false;
      this.column = true;
      this.changeViewWidth = "100%";
      this.changeViewWidthNumber = 440;
    }
    this.changeArrow = false;
  }

  checkExpand(layer_id,event) {
    event.preventDefault();
    if (this.arrowsArray.some((data) => data == layer_id)) {
      let find_index = this.arrowsArray.findIndex((layers)=>layers == layer_id);
      if(find_index > -1){
        this.arrowsArray.splice(find_index, 1);
      }
    }
    else {
      this.arrowsArray.push(layer_id);
    }
  }

  collpaseView(layer_id){
    let finalvalue = this.arrowsArray.some((dataCollpase) => dataCollpase == layer_id)
    
    let getElementHide = document.getElementById('test'+layer_id);
    if(getElementHide!=null){
      getElementHide.classList.remove('collapse');
      getElementHide.classList.remove('collapsing');
    }
    return finalvalue;

  }


  checkLayerPagesBasedShowData() {
    let filterPageBasedLayers = [];
    for (let i = 0; i < this.layerDataCloneUI.length; i++) {
      for (let j = 0; j < this.layerDataCloneUI[i].associated_pages.length; j++) {
        if (this.layerDataCloneUI[i].associated_pages[j].page_id == this.currentPageId) {
          filterPageBasedLayers.push(this.layerDataCloneUI[i]);
        }
      }
    }

    filterPageBasedLayers.forEach(layerdata => {
      layerdata.associated_pages = layerdata.associated_pages.filter((pages) => pages.is_removed != true && pages.is_removed != "true");
    });
    this.showUILayerDatas = filterPageBasedLayers;
    this.getActiveLayerId();
  }

  getExpand(layer_id) {
    if (this.arrowsArray.some((data) => data == layer_id)) {
      return "assets/images/Faq/P3_ArrowTop_Blue.png";
    }
    else {
      return "assets/images/Faq/P3_ArrowDown_Blue.png";
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

  changeLayerUI(layerData) {

    const myArray1 = layerData;
    this.layerDataCloneUI = _.cloneDeep(myArray1);
   
    let filterPageBasedLayers = [];
    for (let i = 0; i < this.layerDataCloneUI.length; i++) {
      this.layerDataCloneUI[i].layer_name = this.textCheckService.changeSpecialtoKeyFormat(this.layerDataCloneUI[i].layer_name);
      if (this.layerDataCloneUI[i].annotations.length > 0) {
        this.layerDataCloneUI[i].annotations.forEach(count => {
          if (count.annotation_forms != undefined && count.annotation_forms.length > 0) {
            count.annotation_forms = count.annotation_forms.length;
          }
          else if (count.annotation_forms != undefined && count.annotation_forms.length == 0) {
            count.annotation_forms = 0;
          }
          if (count.annotation_media != undefined && count.annotation_media.length > 0) {
            count.annotation_media = count.annotation_media.length;
          }
          else if (count.annotation_media != undefined && count.annotation_media.length == 0) {
            count.annotation_media = 0;
          }
          if (count.annotation_links != undefined && count.annotation_links.length > 0) {
            count.annotation_links = count.annotation_links.length;
          }
          else if (count.annotation_links != undefined && count.annotation_links.length == 0) {
            count.annotation_links = 0;
          }
        });
      }
      for (let j = 0; j < this.layerDataCloneUI[i].associated_pages.length; j++) {
        if (this.layerDataCloneUI[i].associated_pages[j].page_id == this.currentPageId) {
          filterPageBasedLayers.push(this.layerDataCloneUI[i]);
        }
      }

    }
    let AscendLayers = filterPageBasedLayers;
    filterPageBasedLayers = AscendLayers.sort((a, b) => a.layer_name.localeCompare(b.layer_name));

    let temp_unremove_layers = [];
    for(let rd=0;rd<filterPageBasedLayers.length;rd++){
      let get_assosciated_pages = filterPageBasedLayers[rd].associated_pages;
      let filter_current_page = get_assosciated_pages.filter((datas)=>datas.page_id==this.currentPageId);
      if(filter_current_page.length>0){
        let is_removed_check = filter_current_page[0].is_removed;
        if(this.createDocumentStore.data_allow_condition.includes(is_removed_check)){
          temp_unremove_layers.push(filterPageBasedLayers[rd]);
        }
      } 
    }
    // filterPageBasedLayers.forEach(layerdata => {
    //   layerdata.associated_pages = layerdata.associated_pages.filter((pages) => pages.is_removed != true && pages.is_removed != "true");
    // });
    this.showUILayerDatas = _.cloneDeep(temp_unremove_layers);
    this.showUILayerDatas_backup = _.cloneDeep(temp_unremove_layers);
    
    for(let i=0;i<this.showUILayerDatas.length;i++){
      let annotations = this.showUILayerDatas[i].annotations
      if(annotations.length > 4){
        let annotation_new = annotations.slice(0,5);
        let annotationsCopy = annotations.slice(5,annotations.length);
        this.showUILayerDatas[i].annotations = annotation_new;
        this.showUILayerDatas_backup[i].annotations = annotationsCopy;
      }else{
        this.showUILayerDatas_backup[i].annotations = []
      }
    }

    // this.cdRef.detectChanges();
    this.getActiveLayerId();
  }

  ngOnDestroy(): void {
    if (this.getlayerData$ != undefined) {
      this.getlayerData$.unsubscribe();
    }
    // if(this.layerCheckBoxClick$!=undefined){
    //   this.layerCheckBoxClick$.unsubscribe();
    // }
    // if(this.multiSelector$!=undefined){
    //   this.multiSelector$.unsubscribe();
    // }
  }

  showlayerUIChanges(receivevalue, option) {
    var ascendingOrder = [];
    switch (option) {
      case 'addlayerOption':
        let comingData = receivevalue;
        this.showUILayerDatas.push(comingData);
        let tempShowLayers = this.showUILayerDatas;
        ascendingOrder = tempShowLayers.sort((a, b) => a.layer_name.localeCompare(b.layer_name));
        this.showUILayerDatas = ascendingOrder;
        console.log(this.showUILayerDatas);
        break;
      case 'delete':
        let findDeleteIndex = this.showUILayerDatas.findIndex((data) => data.layer_id == this.selectedLayer.layer_id);
        if (findDeleteIndex != -1) {
          this.showUILayerDatas.splice(findDeleteIndex, 1);
          console.log(this.showUILayerDatas);
        }
        break;
      case 'rename':
        let findRenameIndex = this.showUILayerDatas.findIndex((data) => data.layer_id == this.selectedLayer.layer_id);
        if (findRenameIndex != -1) {
          this.showUILayerDatas[findRenameIndex].layer_name = receivevalue;
          console.log(this.showUILayerDatas);
          let tempShowLayers = this.showUILayerDatas;
          ascendingOrder = tempShowLayers.sort((a, b) => a.layer_name.localeCompare(b.layer_name));
          this.showUILayerDatas = ascendingOrder;
        }
        break;
      case 'lock':
        let findLockIndex = this.showUILayerDatas.findIndex((data) => data.layer_id == this.selectedLayer.layer_id);
        if (findLockIndex != -1) {
          let lock_page_Index = this.showUILayerDatas[findLockIndex].associated_pages.findIndex(data => data.page_id == this.selectedPageId)
          if(lock_page_Index>-1){
            this.showUILayerDatas[findLockIndex].associated_pages[lock_page_Index] = this.pagedata1[0];
          }
          // if (this.showUILayerDatas[findLockIndex].is_locked_flag == "0" || this.showUILayerDatas[findLockIndex].is_locked_flag == "false" || this.showUILayerDatas[findLockIndex].is_locked_flag == false) {
          //   this.showUILayerDatas[findLockIndex].is_locked_flag = true;
          // }
          // else if (this.showUILayerDatas[findLockIndex].is_locked_flag == "1" || this.showUILayerDatas[findLockIndex].is_locked_flag == "true" || this.showUILayerDatas[findLockIndex].is_locked_flag == true) {
          //   this.showUILayerDatas[findLockIndex].is_locked_flag = false;
          // }
          console.log(this.showUILayerDatas);
        }
        break;
      case 'visible':
        let findVisibleIndex = this.showUILayerDatas.findIndex((data) => data.layer_id == receivevalue);
        if (findVisibleIndex != -1) {
          // if (this.showUILayerDatas[findVisibleIndex].is_visible_flag == "0" || this.showUILayerDatas[findVisibleIndex].is_visible_flag == "false" || this.showUILayerDatas[findVisibleIndex].is_visible_flag == false) {
          //   this.showUILayerDatas[findVisibleIndex].is_visible_flag = true;
          // }
          // else if (this.showUILayerDatas[findVisibleIndex].is_visible_flag == "1" || this.showUILayerDatas[findVisibleIndex].is_visible_flag == "true" || this.showUILayerDatas[findVisibleIndex].is_visible_flag == true) {
          //   this.showUILayerDatas[findVisibleIndex].is_visible_flag = false;
          // }
          console.log(this.showUILayerDatas);
        }
        break;
      case 'active':
        let findActiveIndex = this.showUILayerDatas.findIndex((data) => data.layer_id == receivevalue);
        if (findActiveIndex != -1) {
          this.showUILayerDatas.forEach((datatemp) => {
            datatemp.is_active_flag = false;
          });
          this.showUILayerDatas[findActiveIndex].is_active_flag = true;
        }
        break;
    }

  }


  layerCheckboxEvent() {
    console.log('trigger');
  }

  allPagesSelectedInitialy() {
    this.selectedPages = [];
    this.allPagesSelected = true;
    var getTag = document.getElementsByClassName("page-checkbox");

    for (var i = 0; i < getTag.length; i++) {
      (getTag[i] as HTMLInputElement).checked = true;
    }
    this.selectNeededOnly = true;
    this.selectedPages = [];
    this.documentDetails.filter((data) => {
      this.selectedPages.push(data.page_id);
    });
  }

  remove_deleted_layer_after_api(){
    this.layerDatas = this.layerDatas.filter((list) => {
      let layerCurrentPageData = list.associated_pages.filter((ele => ele.page_id == this.currentPageId));
      if (layerCurrentPageData.length > 0) {
        if (layerCurrentPageData[0].hasOwnProperty("is_removed") && layerCurrentPageData[0].hasOwnProperty("is_hidden") && layerCurrentPageData[0].is_removed == false && layerCurrentPageData[0].is_hidden == false) {
          return true;
        }
        else if (!layerCurrentPageData[0].hasOwnProperty("is_removed") || !layerCurrentPageData[0].hasOwnProperty("is_hidden")) {
          if (list.is_removed == "true" || list.is_removed == true || list.is_removed == "1") {
            return false;
          }
          else {
            return true;
          }
        }
        else if(layerCurrentPageData[0].hasOwnProperty("is_removed") && layerCurrentPageData[0].hasOwnProperty("is_hidden") && layerCurrentPageData[0].is_removed == false){
          return true;
        }
      }
      else { //current page is not in associated pages
        return false;
      }
    });
  }

  async annotation_view_svg(changedata:any) {
    let clone_deep_data = _.cloneDeep(changedata);
    let get_svgPath = this.documentPage_layer.changesvgpath(clone_deep_data,'layer',true);
    return get_svgPath; 
  }

  annotation_view_svg_direct(changedata:any) {
    let clone_deep_data = _.cloneDeep(changedata);
    let get_svgPath = this.documentPage_layer.changesvgpath(clone_deep_data,'layer',true);
     //line shapes I have assigned extra 
     let lines = [13, 14, 15, 16];
     if (lines.includes(Number(get_svgPath.toolbar_element_id))) {
      get_svgPath.linewidth = get_svgPath.linewidth * 2;
     }
     // check resize shapes line width increase simple shapes only
     get_svgPath = linewidthchanges(get_svgPath);
    return get_svgPath; 
  }

  changeSpecialCharactersLayer(layerDetails){
    let getLayers = layerDetails;
    for(let mi=0;mi<getLayers.length;mi++){
      getLayers[mi].layer_name = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].layer_name);
      if(getLayers[mi].annotations.length>0){
        for(let ai=0;ai<getLayers[mi].annotations.length;ai++){
          getLayers[mi].annotations[ai].annotation_name = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_name);
          getLayers[mi].annotations[ai].annotation_label = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_label);
          getLayers[mi].annotations[ai].annotation_tags = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_tags);
          getLayers[mi].annotations[ai].annotation_data = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_data);
          if(getLayers[mi].annotations[ai].annotation_forms!=undefined && getLayers[mi].annotations[ai].annotation_forms.length!=undefined && getLayers[mi].annotations[ai].annotation_forms.length>0){
            for(let fi=0;fi<getLayers[mi].annotations[ai].annotation_forms.length;fi++){
              getLayers[mi].annotations[ai].annotation_forms[fi].form_name = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_forms[fi].form_name);
              let get_cur_formdata = getLayers[mi].annotations[ai].annotation_forms[fi].form_data;
              if(Array.isArray(get_cur_formdata)){
                if(get_cur_formdata.length>0){
                  getLayers[mi].annotations[ai].annotation_forms[fi].form_data = this.textCheckService.changeSpecialtokeyformatList(get_cur_formdata,'annotationupdateformpublish');
                }
              }
            }
          }
          if (getLayers[mi].annotations[ai].annotation_links!=undefined && getLayers[mi].annotations[ai].annotation_links.length!=undefined && getLayers[mi].annotations[ai].annotation_links.length > 0) {
            if (Array.isArray(getLayers[mi].annotations[ai].annotation_links)) {
              for(let li=0;li<getLayers[mi].annotations[ai].annotation_links.length;li++){
                if(getLayers[mi].annotations[ai].annotation_links[li].document_id==''){
                  getLayers[mi].annotations[ai].annotation_links[li].link_type = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_links[li].link_type);
                }
                else if(getLayers[mi].annotations[ai].annotation_links[li].document_id!=''){
                  getLayers[mi].annotations[ai].annotation_links[li].link_type = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_links[li].link_type);
                }
                if(getLayers[mi].annotations[ai].annotation_links[li].hasOwnProperty('location')){
                  if(getLayers[mi].annotations[ai].annotation_links[li].location!=undefined){
                    getLayers[mi].annotations[ai].annotation_links[li].location = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_links[li].location);
                  }
                }
              }
            }
          }
          if (getLayers[mi].annotations[ai].annotation_media!=undefined && getLayers[mi].annotations[ai].annotation_media.length!=undefined && getLayers[mi].annotations[ai].annotation_media.length > 0) {
            if (Array.isArray(getLayers[mi].annotations[ai].annotation_media)) {
              for(let li=0;li<getLayers[mi].annotations[ai].annotation_media.length;li++){
                if(getLayers[mi].annotations[ai].annotation_media[li].media_name!=''){
                  getLayers[mi].annotations[ai].annotation_media[li].media_name = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_media[li].media_name);
                }
                if(getLayers[mi].annotations[ai].annotation_media[li].media_comment!=''){
                  getLayers[mi].annotations[ai].annotation_media[li].media_comment = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_media[li].media_comment);
                }
                if(getLayers[mi].annotations[ai].annotation_media[li].hasOwnProperty("media_tags")){
                  if(getLayers[mi].annotations[ai].annotation_media[li].media_tags!=''){
                    getLayers[mi].annotations[ai].annotation_media[li].media_tags = this.textCheckService.changeSpecialtoKeyFormat(getLayers[mi].annotations[ai].annotation_media[li].media_tags);
                  }
                }
              }
            }
          }
        }
      }
    }
    return getLayers;
  }

  trackByFn(index:number, anot_data:any){
    return anot_data.annotation_id;
  }
  trackByFn_layer(index:number, layer_data:any){
    return layer_data.layer_id;
  }
  functionstarttime(apiname) {
    var start = new Date().getTime();
    console.log(apiname + ' Start time: ' + start);
    return start
  }

  functionendtime(apiname, start) {
    var end = new Date().getTime();
    var time = end - start;
    console.log(apiname + ' end time: ' + end);
    console.log(apiname + ' Execution timeeee: ' + time);
  }
}
