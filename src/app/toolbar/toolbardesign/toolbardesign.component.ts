import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  OnDestroy,
  Output,
} from "@angular/core";
import { ToolbardesignService } from "../services/toolbardesign.service";
import { toolelementData, element } from "../model/toolbarelement.model";
import { DropEffect, DndDropEvent } from "ngx-drag-drop";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { AddformComponent } from "./addform/addform.component";
import { DeleteToolbarComponent } from "./delete-toolbar/delete-toolbar.component";
import { DuplicateToolbarComponent } from "./duplicate-toolbar/duplicate-toolbar.component";
import { FormlistService } from "src/app/formbuilder/services/formlist.service";
import { HeadertitleService } from "src/app/headertitle.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CopyformelementComponent } from "./copyformelement/copyformelement.component";
import { FormnameService } from "src/app/formname.service";
import { Observable, Subscription } from "rxjs";
import { FormService } from "src/app/form.service";
import { SharedService } from "src/app/shared/shared.service";
import { PreviewToolbarComponent } from "./preview-toolbar/preview-toolbar.component";
import { ToolbarShapeDetails } from "../model/toolbarSetting.model";
import { cachedDataVersionTag } from "v8";
import { Placeholder } from "@angular/compiler/src/i18n/i18n_ast";
import { data } from "jquery";
import { isThisMonth } from "date-fns";
import { HostListener } from '@angular/core';
import { v1 as uuidv1 } from "uuid";
import { login } from "src/app/projectmanagement/models/login-model";
import { ToolbarexitconfirmComponent } from "./toolbarexitconfirm/toolbarexitconfirm.component";
import { Location } from "@angular/common";
import { DataService } from "src/app/data.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { ShapeService } from "src/app/document/services/shape.service";
import { CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { ConditionalExpr } from "@angular/compiler";
import { url } from "inspector";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";


@Component({
  selector: "app-toolbardesign",
  templateUrl: "./toolbardesign.component.html",
  styleUrls: ["./toolbardesign.component.css"],
})
export class ToolbardesignComponent implements OnInit, AfterViewInit,OnDestroy {
  deleteimg = true;
  deleteimg1 = false;
  copyimg = true;
  copyimg1 = false;
  closeBox1 = false;
  ind: any;
  isReadonly:any;
  toolbar_id: any;
  annotationToolbar: Array<any>;
  groupbyVariable: any;
  sample = [];
  groupeddata = [];
  iconsample = [];
  formname: string[];
  itemValue: any = [];
  subscription_getform$: Subscription;
  set: any;
  name: string[];
  slider: boolean = false;
  forms: any;
  sec: string[];
  formNamelist = [];
  colorNone: any;
  bgChangeIndex: { outIndex: number; innerIndex1: number } = {
    outIndex: 0,
    innerIndex1: 0,
  };
  remember: boolean;
  formlist: string[];
  updatedvalue: any[] = [];
  toolbarId: string;
  overlay = false;
  newSelectedStroke: string;
  newSelectedFill: string;
  Form_id: string;
  formss: any;
  val: string;
  toogleChange: boolean = false;
  getformName: any[];
  show: boolean = false;
  su: login;
  fillcolor:Boolean=false;
  admin: any;
  edit: any;
  view: any;
  buttonColors: any[] = [
    { "color": "blue", "color_code": "#002F5F" },
    { "color": "red", "color_code": "#BC0900" },
    { "color": "orange", "color_code": "#F48F00" },
    { "color": "yellow", "color_code": "#FFFF00" },
    { "color": "green", "color_code": "#98D133" },
    { "color": "default_blue", "color_code": "#015ECD" },
    { "color": "purple", "color_code": "#6C2EA7" },
    { "color": "pink", "color_code": "#DF1ED3" },
  ];
  buttonColors2: any[] = [
    { "color": "dark_pink", "color_code": "#C832B1" },
    { "color": "light_blue", "color_code": "#80F1FE" },
    { "color": "brown", "color_code": "#7C4E40" },
    { "color": "grey", "color_code": "#949494" },
    { "color": "medium_grey", "color_code": "#CCCCCC" },
    { "color": "black", "color_code": "#000000" },
    { "color": "white", "color_code": "#FFFFFF" },
  ];
  userid = this.encrptdecrpt.getItem("loggedIn") || "{}";
  selectedItem: any;
  settingAPIValue: any;
  filtered_Toolbar: any;
  support: boolean = false;
  Builder: boolean = true;
  labelText: string = "";
  labelname: string = "";
  labelText1: string = "";
  fillColor: string = "blue";
  strokeColor: string = "blue";
  previewToolbarData: any = [];
  permissionDisable = false;
  pageFrom: string = "";
  stampShapes: any[] = [];
  @ViewChildren('stampLabel') stampElement: QueryList<any>;
  @ViewChildren('stampLabelPreview') stampElementPreview: QueryList<any>;
  public canvasElement: CanvasRenderingContext2D;
  coordinateX: any = 0;
  coordinateY: any = 0;
  title: string;
  projectid: string;
  userrole: any;
  publishToolbarSend$:Subscription;
//   trackById = ktdTrackById;
//   layout: KtdGridLayout = [
//     {id: '0', x: 0, y: 0, w: 4, h: 3},
//     {id: '1', x: 5, y: 0, w: 4, h: 3},
//     {id: '2', x: 3, y: 7, w: 4, h: 3},
//     {id: '3', x: 2, y: 0, w: 4, h: 3},
//     {id: '4', x: 5, y: 3, w: 4, h: 3},
//     {id: '5', x: 0, y: 4, w: 4, h: 3},
//     {id: '6', x: 9, y: 0, w: 4, h: 3},
//     {id: '7', x: 9, y: 4, w: 4, h: 3},
//     {id: '8', x: 3, y: 2, w: 4, h: 3},
//     {id: '9', x: 7, y: 0, w: 4, h: 3},
//     {id: '10', x: 2, y: 4, w: 4, h: 3},
//     {id: '11', x: 2, y: 0, w: 4, h: 3}
// ];
  cols = 12;
  rowHeight = 50;
  compactType: 'vertical' | 'horizontal' | null = 'vertical';
  isDragging:boolean = false;
  currentTransition:any = "transform 500ms ease, width 500ms ease, height 500ms ease";
  loader1: boolean=false;
  filteredFormList: any;

  constructor(
    private TService: ToolbardesignService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private headerTitleService: HeadertitleService,
    private messageService: FormnameService,
    public service: FormlistService,
    private service2: FormService,
    private sharedService: SharedService,
    private router: Router,
    public dataService2:DataserviceService,
    private _location: Location,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
    public userRoleGlobal:GlobalUserRoleService,
    public shapeService:ShapeService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.title = this.route.snapshot.queryParamMap.get("toolbarName");
    this.toolbarId = this.route.snapshot.queryParamMap.get("toolbarId");
    this.toolbarId = this.route.snapshot.queryParamMap.get("toolbarId");
    this.pageFrom = this.route.snapshot.queryParamMap.get("pageFrom");
    this.admin = this.encrptdecrpt.getItem("Admin");
    this.edit = this.encrptdecrpt.getItem("Edit");
    this.view = this.encrptdecrpt.getItem("View");
    if (this.admin == 0 && this.edit == 0 && this.view == 1) {
      this.permissionDisable = true;
    }
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    
    this.publishToolbarSend$ = this.sharedService.publishToolbarSend.subscribe((message) => {
      
      switch (message) {
        case "PublishToolbar":
          this.publish();
          break;
        case "BuildToolbar":
          this.buildToolbar();
          break;
      }
    });
    this.sharedService.sendandGetPreview.subscribe((data) => {
      this.goToolbarPreview();
    });
    this.messageService.getaddFormRefresh.subscribe((data) => {
      this.getaddFormList();
    });

    this.isReadonly = this.encrptdecrpt.getItem("viewonlys");
    this.subscription_getform$ = this.messageService.getForm().subscribe((message) => {
    this.exitconfirm=false;
    let localFormList = message.forms_list_data;
      if (localFormList != undefined) {
        var formList = this.mergeFormName(localFormList, this.filteredFormList);
        this.getformName = formList
      }
      else {
        this.getformName = message.forms_list_data;
      }
      this.formname = message;
    });
    this.val = this.encrptdecrpt.getItem("forms");
    this.headerTitleService.setTitle(this.title);
    // localStorage.setItem('builder', 'toolbar');
    this.encrptdecrpt.setItem("builder",'toolbar');//security
    this.fillToolbar();
  }
  
  fillToolbar(start = 0) {
   
    if (this.modelFields)
      for (let i = start; i < 36; i++) {
        let ele: element = new element();
        ele.element_id = -1;
        ele.placeholderNumber = i + 1;
        this.modelFields.push(ele);
      }
  }
  placeHolderCorrection() {
    var aser = this.modelFields;
    this.modelFields.forEach((element, index) => {
      if (element.element_id == -1) { 
        element.placeholderNumber = index + 1;
      }
    });
  }

  closeBox() {
    this.closeBox1 = false;
  }
  closeBoxOverlay() {
    this.overlay = false;
    this.sharedService.filter("Refresh Click");
  }
  groupby = (items: any[], size = 4) => {
    let grouped = [];
    if (items != undefined) {
      for (let i = 0; i < items.length; i += size) {
        let data = items.slice(i, i + size);
        grouped.push(data);
      }
    }
    return grouped;
  };
  previewToolbarOn: boolean = false;
  isDisabled: boolean = false;
  goToolbarPreview() {
    this.previewToolbarOn = true;
    this.isDisabled = true;
    this.dragScrollAction();
    this.getStampElementPreview();

  }
  toolbarName: string = "";
  ngOnInit(): void {
    console.log(this.previewToolbarData)
    this.headerTitleService.setTitle(this.title);
    // localStorage.setItem('supportBack', JSON.stringify(true));
    this.encrptdecrpt.setItem("supportBack",true);//security
    this.show = true;
    this.getToolBarElementData();
  }
  getToolBarElementData() {
    this.TService.get_toolbar_elements_structure().subscribe((data) => {
      let field = data["response_body"].toolbar_elements_template;
      
      field.map((item) => {
        let elementData = JSON.parse(item.element_data);
        if (elementData.element_id == 7 || elementData.element_id == 9 || elementData.element_id == 11 || elementData.element_id == 15 || elementData.element_id == 16 || elementData.element_id == 13 || elementData.element_id == 14 || elementData.element_id == 12) {
          elementData.line_width = 5;
        }
        if (elementData.element_id == 8) {
          elementData.stroke_color = "#FFFFFF";
        }
        item.element_data = elementData;
        
        return item;
      });
      let ascendingElementOrder = field;
      ascendingElementOrder.sort(
        (a, b) => a.element_data.element_order - b.element_data.element_order
      );
      this.annotationToolbar = ascendingElementOrder;
      this.groupbyVariable = this.groupby(this.annotationToolbar);
      this.getToolbarData();
     
    });
  }
  
  mergeFormName(localForm,mainForm){
    let get_changes_form = _.cloneDeep(localForm);
    let default_form_value = _.cloneDeep(mainForm);
    for(let i=0;i<get_changes_form.length;i++){
      let find_field_index = default_form_value.findIndex((id)=>id.form_id==get_changes_form[i].form_id);
      if(find_field_index>-1){
        get_changes_form[i].form_name = default_form_value[find_field_index].form_name;
      }
    }
    return get_changes_form;
  }
  getToolbarData() {
    this.TService.get_toolbar_data(this.toolbarId).subscribe((data) => {
      this.getFormList();
      this.sec = data["response_body"]["toolbar_listing"];
      var status = data["response_code"];
      if (status == 200) {
        this.toolbarName = data["response_body"].toolbar_listing[0].toolbar_name;
        this.toolbar_id = data["response_body"].toolbar_listing[0].toolbar_id;
        // user permission new api values get process
        let get_user_permission = data["response_body"]["user_permission"];
        if (get_user_permission != undefined && get_user_permission != null &&
          get_user_permission.length > 0) {

          if (get_user_permission[0].admin_permission_flag == true) {
            this.userrole = "admin";
          }
          else if (get_user_permission[0].edit_permission_flag == true) {
            this.userrole = "edit";
          }
          else if (get_user_permission[0].view_permission_flag == true) {
            this.userrole = "view";
          }
          else if (get_user_permission[0].view_permission_flag == false && get_user_permission[0].edit_permission_flag == false
            && get_user_permission[0].admin_permission_flag == false) {
            this.userrole = "view";
          }
          this.encrptdecrpt.setItem("userrole", this.projectid + "||" + this.userrole);//security
        }
      }
      if ( status == 200 && data.response_body.toolbar_listing[0].toolbar_data != null && data.response_body.toolbar_listing[0].toolbar_data!="[]" && data.response_body.toolbar_listing[0].toolbar_data!="" && data.response_body.toolbar_listing[0].toolbar_data!="\"\"") {
        let convertJson_response = JSON.parse(data.response_body.toolbar_listing[0].toolbar_data);
        convertJson_response = this.dataService.changeSpecialtokeyformatList(convertJson_response,'toolbarbuilder');
        var uy = convertJson_response;
        
        this.modelFields = convertJson_response;
        this.modelFields = this.modelFields.filter((ModelData)=>{
          if(ModelData.is_removed!='true'&&ModelData.is_removed!=true&&ModelData.is_removed!='1'){
            return ModelData;
          }
        })
        
        if (this.modelFields != null) {
          this.fillToolbar(this.modelFields ? this.modelFields.length : 0);
          for (var k = 0; k < this.modelFields.length; k++) {
            if (this.modelFields[k].element_id != -1) {
              //line width increase issue by 21.08.2021
              // if (this.modelFields[k].element_id == 7 || this.modelFields[k].element_id == 9 || this.modelFields[k].element_id == 11 || this.modelFields[k].element_id == 15 || this.modelFields[k].element_id == 16 || this.modelFields[k].element_id == 13 || this.modelFields[k].element_id == 14 || this.modelFields[k].element_id == 12) {
              //   this.modelFields[k].element_data.line_width = 5;
              // }
              if (this.modelFields[k].element_data.hasOwnProperty('shape')) {
                this.stampShapes.push(this.modelFields[k]);
              }
              
              this.previewToolbarData.push(this.modelFields[k]);
            }
            if (this.modelFields[k].is_removed == true) {
              this.modelFields[k].element_id = -1;
            }
            this.placeHolderCorrection();
          }
          this.toolbar_content.toolbarItem = this.modelFields;
          
          // this.getStampElement();
        }
      }
      this.groupUpdate();
    });
  }
  updateToolbarData: any;
  ngAfterViewInit() {
    let value = window.devicePixelRatio;
    // let a = 0;
    // if(this.stampElement.toArray.length>0){
    //   this.stampElement.changes.subscribe(t => {
    //     a = a + 1;
    //     this.ngForRendred1(t, a);
    //   });
    // }
    
  }


  ngForRendred1(t, a) {
    console.log(this.stampShapes);
    this.cdRef.detectChanges();
    if (this.stampShapes.length > 0&&a==1) {
      for (let k = 0; k < this.stampShapes.length; k++) {
        let getElement234 = document.getElementById(this.stampShapes[k].element_uuid);
        if (getElement234 != null) {
          let shapeAttributes;
          if (this.stampShapes[k].element_data.hasOwnProperty('shape')) {
            shapeAttributes = _.cloneDeep(this.stampShapes[k].element_data);
          }
          // if(shapeAttributes!=undefined&&shapeAttributes.element_id!=19&&shapeAttributes.element_id!=20&&shapeAttributes.element_id>-1){
          //     // if(Number(shapeAttributes.shape.initial_height)!=0&&Number(shapeAttributes.shape.initial_width)!=0){
          //     let getresizeShapeString = this.shapeService.resizeFunctionNewtoolbar(shapeAttributes, false);
          //       shapeAttributes.shape.annotation_data = getresizeShapeString.shapeString;  
          //     // }
          // }
          // this.shapeService.getshapeDrawingToolbar(shapeAttributes,false,this.stampShapes[k].element_uuid,'toolbarattribute','toolbar');
          if (shapeAttributes.element_id<21 || shapeAttributes['shape'].annotation_data.includes('move')) {
            if(shapeAttributes.element_id==19|| shapeAttributes.element_id==20){
            }
            if(shapeAttributes.shape.element_id==0){
              shapeAttributes.shape.element_id=shapeAttributes.element_id;
            }
            let oldDimenstion = this.shapeService.getCanvaswidthandHeight({ toolbar_element_id:shapeAttributes.shape.element_id, annotation_data: shapeAttributes.shape.annotation_data });
            let getresizeShapeString = this.changeShapeForWidthAndHeight(shapeAttributes.shape.annotation_data,45,45,shapeAttributes.shape.element_id);
            shapeAttributes.shape.annotation_data = getresizeShapeString;  
            let getnewwidthheightstring = this.changeShapePositionsInsideCanvas(getresizeShapeString,shapeAttributes.shape.element_id,oldDimenstion);
            shapeAttributes.shape.annotation_data = getnewwidthheightstring.annotationData;
            // let getresizeShapeString_1 = this.shapeService.resizeFunctionNewtoolbar(shapeAttributes, false);
            // shapeAttributes.shape.annotation_data = getresizeShapeString_1.shapeString;
          }
          if (shapeAttributes['shape'].is_stamp != 0) {
            this.shapeService.getshapeDrawingToolbar(shapeAttributes,false,this.stampShapes[k].element_uuid,'toolbarattribute','toolbar');
          }
        }
      }
    }
  }

  getStampElement() {
    if (this.stampShapes.length > 0) {
      for (let k = 0; k < this.stampShapes.length; k++) {
        let getElement234 = document.getElementById(this.stampShapes[k].element_uuid); 
      }
    }
  }

  groupUpdate() {  
    this.toolbar_content.toolbarGroup = this.groupby(this.toolbar_content.toolbarItem, 3);
    this.previewToolbarData = this.toolbar_content.toolbarItem.filter((data) =>
      data.element_id != -1
    );
    this.ngForRendred1(this.stampShapes, 1);
  }
  exitconfirm: boolean = true;
  publish() {
    this.loader1=true;
    console.log(typeof(this.isReadonly));
    if(this.isReadonly==false || this.isReadonly==null)
    {
      if(this.userrole != 'view') {
        this.show = true;
        this.previewToolbarOn = false;
        let clone_filter_toolbar = _.cloneDeep(this.toolbar_content.toolbarItem);
        this.filtered_Toolbar = clone_filter_toolbar.filter(
          (data) => data.element_id != -1
        );
        console.log(this.filtered_Toolbar);
        if(this.filtered_Toolbar!=undefined && this.filtered_Toolbar.length>0){
          for(let label=0;label<this.filtered_Toolbar.length;label++){
            this.filtered_Toolbar[label].element_name = this.dataService.changeFormat(this.filtered_Toolbar[label].element_name);
            this.filtered_Toolbar[label].element_data.element_name = this.dataService.changeFormat(this.filtered_Toolbar[label].element_data.element_name);
            if(this.filtered_Toolbar[label].element_data.hasOwnProperty('forms_list_data')){
              let getformlist_publish = this.filtered_Toolbar[label].element_data.forms_list_data;
              if(getformlist_publish!=undefined && getformlist_publish.length>0){
                for(let form=0;form<this.filtered_Toolbar[label].element_data.forms_list_data.length;form++){
                  // convert special character form name
                  let get_form_name = this.filtered_Toolbar[label].element_data.forms_list_data[form].form_name;
                  let change_form_name = this.dataService.changeFormat(get_form_name);
                  this.filtered_Toolbar[label].element_data.forms_list_data[form].form_name = change_form_name;
                 
                  // convert special character formdata
                  let current_formdata = this.filtered_Toolbar[label].element_data.forms_list_data[form].form_data;
                  if(current_formdata.length>0){
                    let get_response_form_data = current_formdata;
                    if(Array.isArray(get_response_form_data)){
                      if(get_response_form_data.length>0){
                        let get_change_char_sptoquotes = this.dataService.changingformelementpublish(get_response_form_data,'toolbarattachedforms');
                        this.filtered_Toolbar[label].element_data.forms_list_data[form].form_data = get_change_char_sptoquotes;
                      }
                    }
                  }
                  // conver spl characters for extend forms
                  let current_ext_formdata = this.filtered_Toolbar[label].element_data.forms_list_data[form].ext_form_data;
                 if(this.filtered_Toolbar[label].element_data.forms_list_data[form].is_extend == true){
                   if(current_ext_formdata != null){
                    if(current_ext_formdata.length>0){
                      let get_response_ext_form_data = current_ext_formdata;
                      if(Array.isArray(get_response_ext_form_data)){
                        if(get_response_ext_form_data.length>0){
                          let get_change_char_sptoquotes = this.dataService.changingformelementpublish(get_response_ext_form_data,'toolbarattachedforms');
                          this.filtered_Toolbar[label].element_data.forms_list_data[form].ext_form_data = get_change_char_sptoquotes;
                        }
                      }else{
                        get_response_ext_form_data = JSON.parse(get_response_ext_form_data);
                        let get_change_char_sptoquotes = this.dataService.changingformelementpublish(get_response_ext_form_data,'toolbarattachedforms');
                        this.filtered_Toolbar[label].element_data.forms_list_data[form].ext_form_data = get_change_char_sptoquotes;
                      }
                      
                    }
                   }
                  
                 }
                  
                }
              }
            }
          }
        }
        this.toolbar_content.toolbarItem.name = this.toolbar_content.toolbarItem.element_name;
        let UpdateToolbarModel: any = {
          user_id: this.userid.user_id,
          toolbar_id: this.route.snapshot.queryParamMap.get("toolbarId"),
          toolbar_data: this.filtered_Toolbar,
          toolbar_element_count: this.toolbar_content.toolbarItem.length,
        };
        
        this.previewToolbarData = this.filtered_Toolbar;
        this.updateToolbarData = UpdateToolbarModel;
        this.TService.update_toolbar_data(UpdateToolbarModel).subscribe((data) => {
          this.itemValue = [];
          this.show = false;
          this.updatedvalue = JSON.parse(data["response_body"].toolbar_data);
          for (var i = 0; i < this.updatedvalue.length; i++) {
            this.itemValue.push(this.toolbar_content.toolbarItem);
          }
          this.overlay = true;
        });
      }
      else if(this.userrole == 'view') {
        this.userRoleGlobal.permissionCheck();
        this.sharedService.filter("Refresh Click");
      }
    }
    else if(this.isReadonly==true)
    {
      this.userRoleGlobal.permissionCheck();
      this.sharedService.filter("Refresh Click");
    }
    this.exitconfirm = true;
  }


  icon_object = {
    baseurl: "./assets/images/ProjectsScreen/",
    geticon: function (index) {
      return this.baseurl + this.icons[index - 1];
    },
    groupby: function () {
      let items = this.icons;
      let size = 4;
      let grouped = [];
      for (let i = 0; i < items.length; i += size) {
        let data = items.slice(i, i + size);
        grouped.push(data);
      }
      return grouped;
    },
    icons: [
      "P3_Toolbar_CircleIcon.png",
      "P3_Toolbar_OctagonIcon.png",
      "P3_Toolbar_SquareIcon.png",
      "P3_Toolbar_TriangleIcon.png",
      "P3_Toolbar_StarIcon.png",
      "P3_Toolbar_DiamondIcon.png",
      "P3_Toolbar_FlagIcon.png",
      "P3_Toolbar_CameraIcon.png",
      "P3_Toolbar_ArrowIcon.png",
      "P3_Toolbar_CalloutIcon.png",
      "P3_Toolbar_TextIcon_New.png",
      "P3_Toolbar_FreehandLineIcon.png",
      "P3_Toolbar_PolylineArrowIcon.png",
      "P3_Toolbar_PolylineIcon.png",
      "P3_Toolbar_LineIcon.png",
      "P3_Toolbar_LineAxialIcon.png",
      "P3_Toolbar_FreehandAreaIcon.png",
      "P3_Toolbar_PolygonIcon.png",
      "P3_Toolbar_DrawnEllipseIcon.png",
      "P3_Toolbar_DrawnRectangleIcon.png",
    ],
  };
  modelFields: Array<element> = [];
  toolbar_content: any = {
    numberofitems: 51,
    toolbarItem: this.modelFields,
    groupByToolar: function () {
      let items = this.toolbarItem;
      let size = 3;
      let grouped = [];
      if (items != undefined) {
        for (let i = 0; i < items.length; i += size) {
          let data = items.slice(i, i + size);
          grouped.push(data);
        }
      }
      return grouped;
    },
    toolbarGroup: this.groupby(this.modelFields),
  };
  getIndex(event) {
    let i = 0;
    while (event.event["path"][i].id == "") {
      ++i;
      if (i == 5) {
        break;
      }
    }
    let d_id = event.event["path"][i].id.split("_")[0];
    let d_id1 = event.event["path"][i].id.split("_")[1];
    let newindex = 0;
    for (let j = 0; j <= 16; j++) {
      for (let k = 0; k <= 2; k++) {
        newindex++;
        if (j == d_id && k == d_id1) {
          return newindex;
        }
      }
    }
  }
  onDrop(event: DndDropEvent, list?: any[]) {
    
    if (list && event.dropEffect === "copy") {
      this.ind = this.getIndex(event);
      if (event.dropEffect === "copy")
        event.data.name = event.data.type + "-" + new Date().getTime();
      let index = this.ind - 1;
      if (typeof index === "undefined") {
        index = list.length;
      }
      // let count = 1;
      // this.modelFields.forEach((e) => {
      //   if (e.element_type === event.data.element_type) {
      //     var labelText = event.data.element_data.element_label + " (" + count + ")";
      //     count = count + 1;
      //     event.data.element_name = labelText;
      //     event.data.element_data.element_name = labelText;
      //   }
      //   count = count;
      // });
      this.duplicateNaming(event.data.element_id,event.data.element_data.element_label, event.data, "copy")
      let data = event.data;
      this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
      var annontationidDate = new Date().getTime();
      event.data.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
      var ToolFilterElement = list.filter(ele => ele.element_id != -1);
      if (ToolFilterElement.length > 0) {
        var toolistLength = ToolFilterElement.length
        list[toolistLength] = data;
      } else {
        list[0] = data;
      }
    } else if (list && event.dropEffect === "move") {
      var ToolFilterElement = list.filter(ele => ele.element_id != -1);
      if (this.modelFields != null) {
        if (event.data.element_id != -1) {
          var wew = event.data.element_uuid
          var dee = this.modelFields[0].element_uuid
          let drag_index = this.modelFields.findIndex(
            (x) => x.element_uuid == event.data.element_uuid
          );
          let droped_id = this.getIndex(event) - 1;
          if (this.modelFields[droped_id].element_id == -1) {
            var DragedElement = this.modelFields[drag_index]
            for (var i = drag_index; i < ToolFilterElement.length; i++) {
              this.modelFields[i] = this.modelFields[i + 1]
              if (i == ToolFilterElement.length - 1) {
                this.modelFields[i] = DragedElement
              }
            }
            var yyttt = this.modelFields
          } else {

            var DragedElement = this.modelFields[drag_index]
            for (var i = drag_index; i < droped_id; i++) {
              this.modelFields[i] = this.modelFields[i + 1]
              if (i == droped_id - 1) {
                this.modelFields[i + 1] = DragedElement
              }
            }
            var yyttt = this.modelFields
            // const temp = this.modelFields[droped_id];
            // this.modelFields[droped_id] = this.modelFields[drag_index];
            // this.modelFields[drag_index] = temp;
          }
        }
      }
      this.placeHolderCorrection();
    }
    this.groupUpdate();
  }
  onDragged(item: any, list: any[], effect: DropEffect) {
    
    if (effect === "move") {
      const index = list.indexOf(item);
    }
  }

  onDragCanceled(event: DragEvent) { }
  onDragover(event: DragEvent) { }
  onDragStart(event: DragEvent,outIndex,innerIndex) {
    let backupData = [];
    let headArrayToolbar = this.toolbar_content.toolbarGroup;
    let findElement = headArrayToolbar[outIndex][innerIndex];
    let modelFieldTemp = this.modelFields;
    let removeElementData = modelFieldTemp.findIndex((data)=>data.element_uuid===findElement.element_uuid);
    if(removeElementData!=-1){
      modelFieldTemp.splice(removeElementData,1);
    } 
    // this.toolbar_content.toolbarItem = modelFieldTemp;
    this.groupUpdate();
    this.exitconfirm=false
   }
  onDragEnd(event: DragEvent) {
    this.exitconfirm=false
   }
  onDraggableCopied(event: DragEvent) { }
  onDraggableLinked(event: DragEvent) { }
  toolbarIconClick = (item) => {
    this.exitconfirm=false
    let index = this.modelFields.findIndex(
      (toolbar) => toolbar.element_id == -1
    );
    // var count = 1;
    // this.modelFields.forEach((e) => {
    //   if (e.element_type === item.element_type) {
    //     var labelText = item.element_data.element_label + " (" + count + ")";
    //     count = count + 1;
    //     item.element_name = labelText;
    //     item.element_data.element_name = labelText;
    //   }
    //   count = count;
    // });
    this.duplicateNaming(item.element_id,item.element_data.element_label, item, "copy")
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var annontationidDate = new Date().getTime();
    item.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    console.log(item.element_uuid); 
    this.toolbar_content.toolbarItem[index] = this.dirtyClone(item);
    
    this.previewToolbarData = this.modelFields;
    this.groupUpdate();
  };
  Addforms() {
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(AddformComponent, {
      disableClose: true,
      panelClass: "my-class",
      data: {
        toolbarData: this.previewToolbarData,
        toolbarId: this.toolbarId,
        elementId: this.updateToolbarData.element_uuid,
        previousFormNames: this.previousFormName,
        exitconfirm:this.exitconfirm
      },
      width: "400px",
    })
  }
  bgChange: boolean;
  whatcome(index) {
    this.bgChange = index;
  }
  removeField() {
    this.exitconfirm=false;
    this.deleteimg = false;
    this.deleteimg1 = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dialogref = this.dialog.open(DeleteToolbarComponent, {
      disableClose: true,
      width: "380px",
      data: { toolbarDelete: true }
    });
    dialogref.afterClosed().subscribe((res) => {

      if (res.data == true) {
        
        let index = this.modelFields.findIndex(
          (x) => x.element_uuid === this.selectedItem.element_uuid
        );
        this.settingsPageView = false;
        this.settingAPIValue = undefined;
        this.modelFields[index].is_removed = true;
        this.modelFields[index].element_id = -1;
        this.modelFields.splice(index, 1);
        let ele: element = new element();
        ele.element_id = -1;
        ele.placeholderNumber = 36;
        this.modelFields.push(ele)
        this.placeHolderCorrection();
        this.groupUpdate();
        this.bgSetClick=!this.bgSetClick;
      }
    });
  }
  closeSettingPage() {
    this.bgSetClick = false;
    this.settingsPageView = false;
  }
  dirtyClone(item) {
    let item1 = JSON.stringify(item);
    let item2 = JSON.parse(item1);
    return item2;
  }
  copy(item) {
   
    this.copyimg = false;
    this.copyimg1 = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let ditem = this.dirtyClone(item);
    let dialogref = this.dialog.open(DuplicateToolbarComponent, {
      disableClose: true,
      width: "380px",
      data: {
        data: ditem,
        data1: this.modelFields
      }
    });
    dialogref.afterClosed().subscribe((res) => {
      var yuy = res.data;
      this.copyimg = true;
      this.copyimg1 = false;
      if (res != undefined) {
        this.exitconfirm=false;
        
        let index = this.modelFields.findIndex(
          (toolbar) => toolbar.element_id == -1
        );
        this.duplicateNaming(res.data.element_id,res.data.element_data.element_name, res.data, "copy")
        this.toolbar_content.toolbarItem[index] = res.data;
        this.groupUpdate();
      }
    });
  }

  removeFormPopup(formIndex, settingAPIValue) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dialogref = this.dialog.open(DeleteToolbarComponent, {
      disableClose: true,
      width: "400px",
      data: { formDelete: true, callbackFun: this.removeForm, indexValue: formIndex, settingAPIValue: settingAPIValue }
    });
    dialogref.afterClosed().subscribe((res) => {
      
      console.log(res.formData);
      this.exitconfirm=false;
      let localFormList = res.formData;
      var formList = this.mergeFormName(localFormList,this.filteredFormList);
      this.getformName = formList
    })
  }

  removeForm(formIndex, settingAPIValue) {
    this.exitconfirm=false;
    settingAPIValue.element_data.forms_list_data.splice(formIndex, 1);
    this.getformName = settingAPIValue.element_data.forms_list_data;
    this.previousFormName = settingAPIValue.element_data.form_name;
  }

  opacityValue: number = 0;
  lineWidth: number = 0;
  
  supportPage() {
    if(this.support==false){
      if (this.exitconfirm == true) {
        this.dataService2.formoption.emit(false)
        // localStorage.setItem('pageForm', this.pageFrom);
        this.encrptdecrpt.setItem("pageForm",this.pageFrom);//security
        // localStorage.setItem('builderId', this.toolbarId);
        this.encrptdecrpt.setItem("builderId",this.toolbarId);//security
        // localStorage.setItem('builderName', this.title);
        this.encrptdecrpt.setItem("builderName",this.title);//security
        this.support = true;
        this.Builder = false;
      }
      else if (this.exitconfirm == false) {
        const dialgoConfig = new MatDialogConfig();
        dialgoConfig.disableClose = true;
        dialgoConfig.autoFocus = true;
        let supportPageToolbar = this.dialog.open(ToolbarexitconfirmComponent,
          {
            width: "450px",
            panelClass: "my-class",
            data: { supportPageData: true }
          });
        supportPageToolbar.afterClosed().subscribe((response) => {
          console.log(response)
          if (response != undefined) {
            if (response.accessvalid) {
              if(response.publish){
                this.exit_publish();
                this.overlay = false;
              }
              this.dataService2.formoption.emit(false)
              // localStorage.setItem('pageForm', this.pageFrom);
              this.encrptdecrpt.setItem("pageForm",this.pageFrom);//security
              // localStorage.setItem('builderId', this.toolbarId);
              this.encrptdecrpt.setItem("builderId",this.toolbarId);//security
              // localStorage.setItem('builderName', this.title);
              this.encrptdecrpt.setItem("builderName",this.title);//security
              this.support = true;
              this.Builder = false;
            }
          }
        });
      }
    }
  }

  exitPage() {
    if (this.exitconfirm == true && this.pageFrom == "toolbarlist") {
      this.router.navigateByUrl("toolbar/toolbarlist");
    }
    else if (this.exitconfirm == true && this.pageFrom == "document") {
      this._location.back();
    }
    else if (this.pageFrom == "toolbarlist") {
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      let dialogref = this.dialog.open(ToolbarexitconfirmComponent,
        {
          width: "450px",
          panelClass: "my-class",
          data: { supportPageData: false }
        });
        dialogref.afterClosed().subscribe((res) => {
          if(res.publish){
            this.exit_publish();
            this._location.back();
          }else{
            this._location.back();
          }
        });
    }
    else if (this.pageFrom == "document") {
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      let dialogref = this.dialog.open(ToolbarexitconfirmComponent,
        {
          width: "450px",
          panelClass: "my-class",
          data: { supportPageData: false }
        });
        dialogref.afterClosed().subscribe((res) => {
          if(res.publish){
            this.exit_publish();
            this._location.back();
          }else{
            this._location.back();
          }
        });
    }
  }
  addOverlay = false;
  previousFormName: string[] = [];
  getFormId: string[] = [];
  settingsPageView: boolean = false;
  bgSetClick: boolean = false;
  label: any;
  toolbarClickMain(value, index, innerIndex) {
   console.log(value.element_uuid);
    
    this.labelname = value.element_data.element_name;
    if (value.element_id != -1) {
     
      this.bgSetClick = true;
      this.settingsPageView = true;
      if(value.element_data.element_name!=''){
      this.labelText = value.element_data.element_name;
      }else{
        this.labelText = value.element_data.element_type;
      }
      console.log(this.labelText)
      this.label = this.labelText;
      this.labelText1 = "";
      this.opacityValue = value.element_data.opacity;
      this.lineWidth = value.element_data.line_width;
      this.bgChangeIndex.outIndex = index;
      this.bgChangeIndex.innerIndex1 = innerIndex;
      this.updateToolbarData = value;
      this.selectedItem = this.dirtyClone(value);
      this.settingAPIValue = value;
      if (this.settingAPIValue.element_data.opacity != "") {
        this.settingAPIValue.element_data.opacity = Number(this.settingAPIValue.element_data.opacity).toFixed(2)
        this.settingAPIValue.element_data.opacity.toString()
      }
      if (this.settingAPIValue.element_data.line_width != "") {
        this.settingAPIValue.element_data.line_width =Number(this.settingAPIValue.element_data.line_width).toFixed(2)
        this.settingAPIValue.element_data.line_width.toString()
      }
      let localFormList = value.element_data.forms_list_data;
      if(localFormList!=undefined){
         var formList = this.mergeFormName(localFormList,this.filteredFormList);
         this.getformName = formList
      }
      else{
        this.getformName = value.element_data.forms_list_data;
      }
      if (value.element_data.form_name) {
      
        var getFormIdlocal = value.element_data.form_name;
        for (var i = 0; i < getFormIdlocal.length; i++) {
          this.previousFormName.push(getFormIdlocal[i]);
        }
      }
    }
    else {
      this.settingsPageView = false;
      this.bgSetClick = false;
      
    }
  }
  newUpdatedAuc(item) {
    var yu = this.labelText
  
    this.labelText = this.settingAPIValue.element_data.element_name;
    this.duplicateNaming(1,this.labelText, item, "change")
    this.labelText1 = "";
  }
  getaddFormList() {
    var value = this.selectedItem;
   
      let localFormList = value.element_data.forms_list_data;
      if(localFormList!=undefined){
        var formList = this.mergeFormName(localFormList,this.filteredFormList);
        this.getformName = formList
     }
     else{
       this.getformName = value.element_data.forms_list_data;
     }

    // this.getformName = value.element_data.forms_list_data;
    if (value.element_data != null) {
      this.exitconfirm=false;
      
      var getFormIdlocal = value.element_data.forms_list_data;
      for (var i = 0; i < getFormIdlocal.length; i++) {
        this.previousFormName.push(getFormIdlocal[i]);
      }
    }
    this.publish();
  }
  getStatus(getValue) { }
  setColorStroke(selectColor, settingAPIValue) {
    this.exitconfirm=false;
    let modifyStrokeColor = Object.assign({},settingAPIValue);
    modifyStrokeColor.element_data.stroke_color = selectColor;
    if (selectColor == "white-clr1") {
      modifyStrokeColor.element_data.stroke_color = "#NNNNNN00"
    }
    // if (selectColor == "white-clr1") {
    //   modifyStrokeColor.element_data.stroke_color = "#000000"
    // }
    this.settingAPIValue = modifyStrokeColor;
    if(modifyStrokeColor.element_data.hasOwnProperty('shape')){
      this.settingAPIValue.element_data.shape.stroke_color = modifyStrokeColor.element_data.stroke_color;
      this.redrawShapes(this.settingAPIValue);
    }
  }
  setColorFill(selectColor, settingAPIValue) {
  console.log()
    this.exitconfirm=false;
    let modifyFillColor = Object.assign({},settingAPIValue);
   
    
    modifyFillColor.element_data.fill_color = selectColor;
    if (selectColor == "white-clr1") {
      modifyFillColor.element_data.fill_color = "#NNNNNN00"
    }
    this.settingAPIValue = modifyFillColor;
    if(modifyFillColor.element_data.hasOwnProperty('shape')){
      this.settingAPIValue.element_data.shape.fill_color = modifyFillColor.element_data.fill_color;
      this.redrawShapes(settingAPIValue);
    }
  }
  checkStrokeColor(checkStroke) {
    if (checkStroke.includes("#")) {
      if (checkStroke == "#NNNNNN00") {
        return "transparent";
      } else {
        return checkStroke;
      }
    } else {
      switch (checkStroke) {
        case "blue":
          // this.strokeColor = "#012D62";
          // return "#012D62";
          this.strokeColor = "#002F5F";
          return "#002F5F";
        case "red":
          this.strokeColor = "#BC0900";
          return "#BC0900";
        case "orange":
          this.strokeColor = "#F48F00";
          return "#F48F00";
        case "yellow":
          this.strokeColor = "#FFFF00";
          break;
        case "green":
          this.strokeColor = "#98D133";
          break;
        case "default_blue":
          this.strokeColor = "#015ECD";
          break;
        case "purple":
          this.strokeColor = "#6C2EA7";
          break;
        case "pink":
          this.strokeColor = "#DF1ED3";
          break;
        case "dark_pink":
          this.strokeColor = "#C832B1";
          break;
        case "light_blue":
          this.strokeColor = "#80F1FE";
          break;
        case "brown":
          this.strokeColor = "#7C4E40";
          break;
        case "grey":
          this.strokeColor = "#949494";
          break;
        case "medium_grey":
          this.strokeColor = "#CCCCCC";
          break;
          case "black":
            this.strokeColor = "#000000";
          break;
        case "light_grey":
          this.strokeColor = "#E1E1E1";
          break;
        case "white":
          this.strokeColor = "#FFFFFF";
          break;
        case "clear":
          this.strokeColor = "#NNNNNN00";
          break;
        default:
          this.strokeColor = checkStroke;
      }
    }
  }
  checkFillColor(checkFill) {
    console.log(checkFill)
    if (checkFill.includes("#")) {
      if (checkFill == "#NNNNNN00") {

        return "transparent";
      } else {
        return checkFill;
      }

    } else {
      switch (checkFill) {
        case "blue":
          // this.fillColor = "#012D62";
          this.fillColor = "#002F5F";
          break;
        case "red":
          this.fillColor = "#BC0900";
          break;
        case "orange":
          this.fillColor = "#F48F00";
          break;
        case "yellow":
          this.fillColor = "#FFFF00";
          break;
        case "green":
          this.fillColor = "#98D133";
          break;
        case "default_blue":
          // this.fillColor = "#012D62";
          this.fillColor = "#002F5F";
          break;
        case "purple":
          this.fillColor = "#6C2EA7";
          break;
        case "pink":
          this.fillColor = "#DF1ED3";
          break;
        case "dark_pink":
          this.fillColor = "#C832B1";
          break;
        case "light_blue":
          this.fillColor = "#80F1FE";
          break;
        case "brown":
          this.fillColor = "#7C4E40";
          break;
        case "grey":
          this.fillColor = "#949494";
          break;
        case "medium_grey":
          this.fillColor = "#CCCCCC";
          break;
          case "black":
            this.fillColor = "#000000";
            break;
        case "light_grey":
          this.fillColor = "#E1E1E1";
          break;
        case "white":
          this.fillColor = "#FFFFFF";
          break;
        case "clear":
          this.fillColor = "#NNNNNN00";
          break;
        default:
          this.fillColor = checkFill;
      }
    }
  }


  closeSetting() {
    this.bgSetClick = false;
    this.settingAPIValue = undefined;
    this.settingsPageView = false;
  }
  getFormListProject: any[];
  getFormList() {
    this.service.getformlist().subscribe((data) => {
      this.getFormListProject = data["response_body"]["form_listing"];
      var formbuilderForm = _.cloneDeep(this.getFormListProject);
      this.filteredFormList = formbuilderForm.filter((id)=>id.is_hidden == 0)
      this.show = false;
    });
  }
  copyelement(formId, formName) {
    var formData = "";
    if (this.getformName.length > 0) {
      for (var i = 0; i < this.getformName.length; i++) {
        if (formId == this.getformName[i].form_id) {
          formData = this.getformName[i];
        }
      }
    }
    this.remember = true;
    this.remember = true;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(CopyformelementComponent, {
      disableClose: true,
      width: "600px",
      panelClass: "my-class",
      data: {
        Form_id: formId,
        toolbarData: this.updateToolbarData,
        toolbarId: this.toolbarId,
        formData: formData,
        form: formName,
        previousFormNames: this.previousFormName,
        editFlag: true,
        exitconfirm:this.exitconfirm,
        formsList:this.getFormListProject
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      
     
      if( res==true && this.exitconfirm==true){
        this.exitconfirm=true
      }else{
        this.exitconfirm=false
      }
    })
  }

 slide(){
   this.exitconfirm=false
   this.redrawShapes(this.settingAPIValue)
 }
    
  valueupdateLabelText(event) {
    if (this.labelText1 == "") {
      this.settingAPIValue.element_data.element_name = this.labelText;
      this.settingAPIValue.element_name = this.labelText;
    } else {
      this.settingAPIValue.element_data.element_name = this.labelText1;
      this.settingAPIValue.element_name = this.labelText1;
    }
  }
  checkNumbersOnly(event) {
    if ([69, 187, 188, 189].includes(event.keyCode)) {
      event.preventDefault();
    }
  }
  checkLimitNumber(event) {
    this.exitconfirm=false;
    if (
      this.opacityValue == 0 &&
      this.settingAPIValue.element_data.opacity == null
    ) {
      if ([50, 51, 52, 53, 54, 55, 56, 57].includes(event.keyCode)) {
        event.preventDefault();
      }
    } else if (this.opacityValue == 1) {
      if (![8, 46].includes(event.keyCode)) {
        event.preventDefault();
      } else {
        if (event.target.value == "") {
          this.opacityValue = 0;
          this.settingAPIValue.element_data.opacity = "";
        } else if (event.target.value > 1) {
          this.settingAPIValue.element_data.opacity = 1;
          this.opacityValue = 1;
        } else {
          this.opacityValue = event.target.value;
        }
      }
    }
  }
  checkOpacity(event) {
    if (event.target.value > 1) {
      this.opacityValue = 0;
      this.settingAPIValue.element_data.opacity = "";
      event.preventDefault();
    } else if (event.target.value == "") {
      this.opacityValue = 0;
      this.settingAPIValue.element_data.opacity = "";
    } else {
      this.opacityValue = this.settingAPIValue.element_data.opacity;
    }
    if(this.settingAPIValue.element_data.hasOwnProperty('shape')){
      this.redrawShapes(this.settingAPIValue);
    }
  }
  changeOpacity1(opacity) {
    if (opacity != "") {
      opacity = Number(opacity).toFixed(2)
      opacity.toString()
    }
    this.exitconfirm=false;
    this.settingAPIValue.element_data.opacity = opacity;
    
    if(this.settingAPIValue.element_data.hasOwnProperty('shape')){
      this.redrawShapes(this.settingAPIValue);
    }
  }
  checkLimitNumberLine(event) {
    this.exitconfirm=false;
    if (
      this.lineWidth == 0 &&
      this.settingAPIValue.element_data.line_width == null
    ) {
      if ([50, 51, 52, 53, 54, 55, 56, 57].includes(event.keyCode)) {
        event.preventDefault();
      }
    } else if (this.lineWidth == 10) {
      if (![8, 46].includes(event.keyCode)) {
        event.preventDefault();
      } else {
        if (event.target.value == "") {
          this.opacityValue = 0;
          this.settingAPIValue.element_data.line_width = "";
        } else if (event.target.value > 10) {
          this.settingAPIValue.element_data.line_width = 1;
          this.lineWidth = 1;
        } else {
          this.lineWidth = event.target.value;
        }
      }
    }
  }

  @ViewChildren('linewidthslider') linewidthslider: ElementRef;

  checklineWidth(event, value) {
    this.exitconfirm=false;
    
    let elementMap = document.getElementById("linemapping");
    if (value != null ) {
      if (value > 50||value>50.01) {
    this.settingAPIValue.element_data.line_width = 50;
        (elementMap as HTMLInputElement).value = "50";
      } 
      else if(value==0){
        this.settingAPIValue.element_data.line_width ="1";
        (elementMap as HTMLInputElement).value = "1";
      }
    }
    else {
      this.settingAPIValue.element_data.line_width = value;
      // (elementMap as HTMLInputElement).value = value.toString();
    }
    if(this.settingAPIValue.element_data.hasOwnProperty('shape')){
      this.redrawShapes(this.settingAPIValue);
    } 
  }

  novalueOut(event, value) {
    
    let elementMap = document.getElementById("linemapping");
    if (value == null  || value == "0") {
      this.lineWidth = 1;
      this.settingAPIValue.element_data.line_width = 1;
      
      (elementMap as HTMLInputElement).value = "1";
    }
  }

  // checklineWidth(event) {
  //   if (event.target.value > 10) {
  //     this.lineWidth = 0;
  //     this.settingAPIValue.element_data.line_width = "";
  //     event.preventDefault();
  //   } else if (event.target.value == "") {
  //     this.lineWidth = 0;
  //     this.settingAPIValue.element_data.line_width = "";
  //   } else {
  //     this.lineWidth = this.settingAPIValue.element_data.line_width;
  //   }
  // }  

  changeLineWidth(linewidth) {
  this.exitconfirm=false;
   console.log(linewidth)
    this.exitconfirm=false;
    if (linewidth != "") {
      linewidth = Math.trunc(linewidth)
      linewidth.toString()
    }
      
     
      this.settingAPIValue.element_data.line_width =linewidth;
     
    
    if(this.settingAPIValue.element_data.hasOwnProperty('shape')){
      this.redrawShapes(this.settingAPIValue);
    }
  }

  stop(event, value) {
    
    if (event.code == "KeyE") {
      event.preventDefault();
    }
  }



  @ViewChild("widgetsContent") widgetsContent: ElementRef;
  hidePrevious() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  }
  hideNext() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }
  dragScrollAction() {
    const slider = document.querySelector(".items");
    let isDown = false;
    let startX;
    let scrollLeft;
    slider.addEventListener("mousedown", (e: any) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.clientLeft;
      scrollLeft = slider.scrollLeft;
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
    });
  }
  buildToolbar() {
    this.previewToolbarOn = false;
    this.isDisabled = false;
  }
  getStrokeColor(checkStroke) {
    if (checkStroke.includes("#")) {
      if (checkStroke == "#NNNNNN00") {
        return "transparent";
      } else {
        return checkStroke;
      }
    }
    else {
      switch (checkStroke) {
        case "blue":
          return "#002F5F";
        case "red":
          return "#BC0900";
        case "orange":
          return "#F48F00";
        case "yellow":
          return "#FFFF00";
        case "green":
          return "#98D133";
        case "default_blue":
          return "#015ECD";
        case "purple":
          return "#6C2EA7";
        case "pink":
          return "#DF1ED3";
        case "dark_pink":
          return "#C832B1";
        case "light_blue":
          return "#80F1FE";
        case "brown":
          return "#7C4E40";
        case "grey":
          return "#949494";
        case "medium_grey":
          return "#CCCCCC";
        case "light_grey":
          return "#000000";
        case "white":
          return "#FFFFFF";
        case "clear":
          return "#NNNNNN00";
        default:
          return "#002F5F";
      }
    }
  }
  getFillColor(checkFill) {
    if (checkFill.includes("#")) {
      if (checkFill == "#NNNNNN00") {
        return "transparent";
      } else {
        return checkFill;
      }
    } else {
      switch (checkFill) {
        case "blue":
          return "#002F5F";
        case "red":
          return "#BC0900";
        case "orange":
          return "#F48F00";
        case "yellow":
          return "#FFFF00";
        case "green":
          return "#98D133";
        case "default_blue":
          return "#015ECD";
        case "purple":
          return "#6C2EA7";
        case "pink":
          return "#DF1ED3";
        case "dark_pink":
          return "#C832B1";
        case "light_blue":
          return "#80F1FE";
        case "brown":
          return "#7C4E40";
        case "grey":
          return "#949494";
        case "medium_grey":
          return "#CCCCCC";
        case "light_grey":
          return "#000000";
        case "white":
          return "#FFFFFF";
        case "clear":
          return "#NNNNNN00";
        default:
          return "#002F5F";
      }
    }
  }

  getFreehandshape() {
    const points = [
      [100, 50],
      [50, 15],
      [5, 60],
      [10, 20],
      [20, 10],
      [30, 190],
      [40, 10],
      [50, 60],
      [60, 120],
      [70, 10],
      [80, 50],
      [90, 50],
      [120, 10],
      [150, 80],
      [160, 10],
    ];
    const lineProperties = (pointA, pointB) => {
      const lengthX = pointB[0] - pointA[0];
      const lengthY = pointB[1] - pointA[1];
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX),
      };
    };
    const controlPointCalc = (current, previous, next, reverse) => {
      const c = current;
      const p = previous ? previous : c;
      const n = next ? next : c;
      const smoothing = 0.2;
      const o = lineProperties(p, n);
      const rev = reverse ? Math.PI : 0;
      const x = c[0] + Math.cos(o.angle + rev) * o.length * smoothing;
      const y = c[1] + Math.sin(o.angle + rev) * o.length * smoothing;
      return [x, y];
    };
    const svgPathRender = (points) => {
      const d = points.reduce((acc, e, i, a) => {
        if (i > 0) {
          const cs = controlPointCalc(a[i - 1], a[i - 2], e, true);
          const ce = controlPointCalc(e, a[i - 1], a[i + 1], true);
          return `${acc} C ${cs[0]},${cs[1]} ${ce[0]},${ce[1]} ${e[0]},${e[1]}`;
        } else {
          return `${acc} M ${e[0]},${e[1]}`;
        }
      }, "");
      return `<path d="${d}" fill="none" stroke="black" />`;
    };
    const svg = document.querySelector(".svg");
    svg.innerHTML = svgPathRender(points);
  }
  firstLetterCapitalLabel(word) {
    
    if (word) {
      this.exitconfirm=false;
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      this.labelText = changeUpperCaseProjectName;
    }
    if(this.labelText!=""){
        this.settingAPIValue.element_data.element_name = this.labelText;
        this.settingAPIValue.element_name = this.labelText;
    }
  }


  duplicateNaming(id,name, item, mode) {   
    let count = 1;
    var labelText = name;
    var checkArry;
    var matches;
    var duplicateName;
    var ToolFilterElement = this.modelFields.filter(ele => ele.element_id != -1);
    if (mode == "copy") {
      checkArry = ToolFilterElement;
    } else {
      checkArry = ToolFilterElement.filter(ele => ele.element_type != item.element_type);
    }
    duplicateName = checkArry.filter(ele => ele.element_data.element_name.split("(")[0].trim() === name.trim());
    if (duplicateName.length > 0) {
      labelText=name + " (" + duplicateName.length  + ")";
    }
    else {
      labelText = name;
    }
    this.labelText = labelText;
    // item.element_data.label_text = labelText;
    // item.element_data.element_name_alias = labelText;
    item.element_name = labelText;
    item.element_data.element_name = labelText;
  }

  formsheaderCanvas(getData, id, realData) {
    
    
    if (getData.initial_position_x == undefined || getData.initial_position_y == undefined) {
      let values = this.getCanvaswidthandHeight(getData);
      this.coordinateX = values.left;
      this.coordinateY = values.top;
      if (this.coordinateX < 0 && this.coordinateY < 0) {
        this.coordinateX = -this.coordinateX;
        this.coordinateY = -this.coordinateY;
        this.show = false;
      }
    }
    else {
      this.coordinateX = getData.initial_position_x;
      this.coordinateY = getData.initial_position_y;
      if (this.coordinateX < 0 && this.coordinateY < 0) {
        this.coordinateX = -this.coordinateX;
        this.coordinateY = -this.coordinateY;
        this.show = false;
      }
    }

    var annotationLabel = getData.annotation_label;
    var elementId = realData.element_id;
    var pdfImg = document.getElementById(id);
    if (pdfImg.hasChildNodes() && pdfImg != null) {
      pdfImg.removeChild(pdfImg.childNodes[0]);
    }
    var newcreatedElement = document.createElement("canvas");
    if (getData.initial_rotation == undefined) {
      newcreatedElement.style.transform = "rotate(" + 0 + "deg)";
    } else if (getData.initial_rotation != undefined) {
      newcreatedElement.style.transform =
        "rotate(" + getData.initial_rotation + "deg)";
    }
    // newcreatedElement.style.opacity = getData.opacity;
    newcreatedElement.setAttribute("width", getData.initial_height);
    newcreatedElement.setAttribute("height", getData.initial_width);
    pdfImg.appendChild(newcreatedElement);
    var cpx = 0;
    var cpy = 0;
    this.canvasElement = newcreatedElement.getContext("2d");
    this.canvasElement.beginPath();
    this.canvasElement.globalAlpha = getData.opacity;
    let startingPointX = 0;
    let startingPointY = 0;
    var spaceSplit = getData.annotation_data.split(" ");
    for (var i = 0; i < spaceSplit.length; i++) {
      var hypenSplit = spaceSplit[i].split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint" &&
          hypenSplit[0] != "drawRect"
        ) {
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          switch (hypenSplit[0]) {
            case "move":
              // this.canvasElement.drawImage(urlImg,this.coordinateX,this.coordinateX)
              startingPointX = x;
              startingPointY = y;
              this.canvasElement.moveTo(x, y);
              break;
            case "line":
              this.canvasElement.clearRect(
                0,
                0,
                newcreatedElement.width,
                newcreatedElement.height
              );
              let pointsAdjustX = startingPointX - x
              let pointsAdjustY = startingPointY - y
              if (pointsAdjustX < 0) {
                pointsAdjustX = -(pointsAdjustX)
              }
              if (pointsAdjustY < 0) {
                pointsAdjustY = -(pointsAdjustY);
              }
              this.canvasElement.lineTo(x, y);
              break;
            case "ovalIn":
              this.canvasElement.clearRect(
                0,
                0,
                newcreatedElement.width,
                newcreatedElement.height
              );
              var r = (w * w) / (8 * h) + h / 2;
              this.canvasElement.arc(
                newcreatedElement.clientWidth / 2,
                newcreatedElement.clientHeight / 2.3,
                r,
                0,
                2 * Math.PI
              );
              break;
          }
        }
        else if (hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);
            this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);
          this.canvasElement.clearRect(0, 0, rectWidth, rectHeight);
          this.canvasElement.rect(
            0,
            0,
            rectWidth,
            rectHeight);
          
        }
        if (
          elementId != 12 &&
          elementId != 14 &&
          elementId != 13 &&
          elementId != 15
        ) {
          var checkFill = getData.fill_color;
          this.checkFillColor(checkFill);
          if (getData.fill_color != "clear") {
            this.canvasElement.fillStyle = this.fillColor;
            this.canvasElement.fill();
          }
        }
        // this.canvasElement.drawImage(newcreatedElement,0,0,50,50,0,0,10,50);
        this.canvasElement.lineWidth = getData.line_width;
        var checkStroke = getData.stroke_color;
        this.checkStrokeColor(checkStroke);
        this.canvasElement.strokeStyle = this.strokeColor;
        this.canvasElement.stroke();
      }
    }
  }

  myFunction(event)
  {
    this.dataService.specialCharacterPasteRestrict(event);
  }

  getCanvaswidthandHeight(getData) {
    let convertAnnotationWH = getData.annotation_data;
    let xCoordinate = [];
    let yCoordinate = [];
    let startx;
    let starty;
    let endx;
    let endy;
    let splitData = convertAnnotationWH.split(" ");
    for (var i = 0; i < splitData.length; i++) {
      let hypenSplit = splitData[i].split("-");
      let colonSplit = hypenSplit[1].split(":");
      xCoordinate.push(colonSplit[0]);
      yCoordinate.push(colonSplit[1]);
    }
    startx = Math.min.apply(null, xCoordinate);
    endx = Math.max.apply(null, xCoordinate);
    starty = Math.min.apply(null, yCoordinate);
    endy = Math.max.apply(null, yCoordinate);
    
    let getDrawWidthandHeight = this.calculateRectPos(
      startx,
      starty,
      endx,
      endy
    );
    return getDrawWidthandHeight;
  }

  calculateRectPos(startX, startY, endX, endY) {
    var width = endX - startX;
    var height = endY - startY;
    var posX = startX;
    var posY = startY;

    if (width < 0) {
      width = Math.abs(width);
      posX -= width;
    }

    if (height < 0) {
      height = Math.abs(height);
      posY -= height;
    }
    return {
      left: parseInt(posX),
      top: parseInt(posY),
      width: width,
      height: height,
    };
  }






  ngOnDestroy():void{
    if(this.publishToolbarSend$!=undefined){
      this.publishToolbarSend$.unsubscribe();
    }
    if(this.subscription_getform$ != undefined){
      this.subscription_getform$.unsubscribe();
    }
    this.stampElement.reset([]);
  }

  getShowing(item){
    return false;
    // if((item.is_removed==false||item.is_removed=='false')&&item.element_data.shape!=undefined&&item.element_data.shape.initial_height==0){
    //   return true;
    // }
    // else{
    //   return false;
    // } 
  }
  
  redrawShapes(settingAPIValue){
    let shapeAttributes = _.cloneDeep(settingAPIValue.element_data);
    if ((shapeAttributes.element_id<19 || shapeAttributes['shape'].annotation_data.includes('move')) && shapeAttributes.element_id>-1) {
      let getresizeShapeString = this.shapeService.resizeFunctionNewtoolbar(shapeAttributes, false);
      shapeAttributes.shape.annotation_data = getresizeShapeString.shapeString;  
    }
    //The below 5 lines are added for ticket number P3X-72 - Abarajithan
    let oldDimenstion = this.shapeService.getCanvaswidthandHeight({ toolbar_element_id:shapeAttributes.shape.element_id, annotation_data: shapeAttributes.shape.annotation_data })
    let getresizeShapeString = this.changeShapeForWidthAndHeight(shapeAttributes.shape.annotation_data,45,45,shapeAttributes.shape.element_id);
    shapeAttributes.shape.annotation_data = getresizeShapeString;  
    let getnewwidthheightstring = this.changeShapePositionsInsideCanvas(getresizeShapeString,shapeAttributes.shape.element_id,oldDimenstion);
    shapeAttributes.shape.annotation_data = getnewwidthheightstring.annotationData;
    if (shapeAttributes['shape'].is_stamp != 0) {
      this.shapeService.getshapeDrawingToolbar(shapeAttributes,false,settingAPIValue.element_uuid,'toolbarattribute','toolbar');
    }
    // if(shapeAttributes.element_id!=19&&shapeAttributes.element_id!=20&&shapeAttributes.element_id>-1){
    //     // if(Number(shapeAttributes.shape.initial_height)!=0&&Number(shapeAttributes.shape.initial_width)!=0){
          
    //       let getresizeShapeString = this.shapeService.resizeFunctionNewtoolbar(shapeAttributes, false);
    //       shapeAttributes.shape.annotation_data = getresizeShapeString.shapeString;
    //     // }
    // }
    // this.shapeService.getshapeDrawingToolbar(shapeAttributes,false,settingAPIValue.element_uuid,'toolbarattribute','toolbar');
    // this.shapeService.canvasToImageConvert(settingAPIValue.element_uuid,'toolbar',shapeAttributes);
  }
  // @Output('cdkDragMoved') moved: Observable<CdkDragMove<T>>
  startDragrowIndex:number = 0;
  startDragcolumnIndex:number = 0;
  endDragrowIndex:number = 0;
  endDragcolumnIndex:number = 0;
  dragStarted(event,outIndex,inIndex){
    console.log(event,outIndex,inIndex);
    this.startDragrowIndex = outIndex; 
    this.startDragcolumnIndex = inIndex;
  }

  // dragend123(event:CdkDragEnd,sell,dull){
  //   console.log(event);
  // }

  

  
  

  reorderDroppedItem(event: CdkDragDrop<number[]>,outerIndex) {
    this.exitconfirm=false;
    // same row/container? => move item in same row

    let currentRowIndex = event.container.id;
    let splithypen = currentRowIndex.split('-');
    this.endDragrowIndex = Number(splithypen[splithypen.length-1]);
    console.log(event,outerIndex,'endrow',this.endDragrowIndex);
    this.endDragcolumnIndex = event.currentIndex;
    if (event.previousContainer === event.container) {  
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // different rows? => transfer item from one to another list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // if(this.startDragrowIndex<this.endDragrowIndex && (event.distance.x>0 && event.distance.y>0)){
    //   let cloneData = _.cloneDeep(this.toolbar_content.toolbarGroup[this.endDragrowIndex]);
    //   let getDragElementrow = this.toolbar_content.toolbarGroup[this.endDragrowIndex];
    //   getDragElementrow[this.endDragcolumnIndex] = cloneData[this.endDragcolumnIndex+1];
    //   getDragElementrow[this.endDragcolumnIndex+1] = cloneData[this.endDragcolumnIndex];
    //   this.toolbar_content.toolbarGroup[this.endDragrowIndex] = getDragElementrow; 
    // }
    
    this.toolbar_content.toolbarItem = this.toolbar_content.toolbarGroup.reduce(
      (previous, current) => previous.concat(current),
      []
    );
    let items = _.cloneDeep(this.toolbar_content.toolbarItem);
    let sortedInValues = items.filter((elementIn)=>elementIn.element_id!=-1);
    let sortedOutValues = items.filter((elementOut)=>elementOut.element_id==-1);
    let arrangeEmptyBoxArray = [...sortedInValues,...sortedOutValues];
    this.toolbar_content.toolbarItem = arrangeEmptyBoxArray;
    this.modelFields = this.toolbar_content.toolbarItem;
    this.groupUpdate();

    // update items after drop: flatten matrix into list
    // example: [ [1,2,3], [4,5,6] ] => [1,2,3,4,5,6]
    // this.items = this.itemsTable.reduce(
    //   (previous, current) => previous.concat(current),
    //   []
    // );

    // re-initialize table - makes sure each row has same numbers of entries
    // example: [ [1,2], [3,4,5,6] ] => [ [1,2,3], [4,5,6] ]
  //  this.initTable();
  }

  geturl(i,o){
    return 'url(#head'+i+o+')';
  }
  geturlaxial(i,o){
    return 'url(#mark1head'+i+o+')';
  }

  geturlpreview(i,o){
    return 'url(#head'+i+')';
  }

  getStampElementPreview(){
  
    console.log(this.stampShapes,this.updateToolbarData)
    this.cdRef.detectChanges();
    if(this.stampShapes.length!=0){
    let getElementPreview = document.getElementById('preview'+this.stampShapes[0].element_uuid);
    console.log(getElementPreview);
    }
    if (this.stampShapes.length > 0) {
      for (let k = 0; k < this.stampShapes.length; k++) {
      
        if(this.stampShapes.length==0){
          let getElementPreview = document.getElementById('preview'+this.stampShapes[k].element_uuid);
          console.log(getElementPreview);
        }
        let getElement234 = document.getElementById('preview'+this.stampShapes[k].element_uuid);
        if (getElement234 != null) {
          let shapeAttributes_preview;
          if (this.stampShapes[k].element_data.hasOwnProperty('shape')) {
            shapeAttributes_preview = _.cloneDeep(this.stampShapes[k].element_data);
          }
          if (shapeAttributes_preview.element_id<19 || shapeAttributes_preview['shape'].annotation_data.includes('move')) {
            let getresizeShapeString = this.shapeService.resizeFunctionNewtoolbar(shapeAttributes_preview, false);
            shapeAttributes_preview.shape.annotation_data = getresizeShapeString.shapeString;
            // changing width and height based but annotaion some time not showing issue happending so commented
            // let getresizeShapeString = this.changeShapeForWidthAndHeight(shapeAttributes_preview.shape.annotation_data,35,35,shapeAttributes_preview.shape.element_id);
            // shapeAttributes_preview.shape.annotation_data = getresizeShapeString;  
          }
          if (shapeAttributes_preview['shape'].is_stamp != 0) {
            this.shapeService.getshapeDrawingDocToolbar(shapeAttributes_preview,false,('preview'+this.stampShapes[k].element_uuid), 'toolbarattribute' + k ,'DocPage','toolbarcanvasText' + this.stampShapes[k].element_uuid);
          }
        }
      }

      // for (let k = 0; k < this.modelFields.length; k++) {
      //   if (this.modelFields[k].element_data.hasOwnProperty("shape")) {
      //     var shapeAttributes = _.cloneDeep(this.modelFields[k].element_data);
      //     let getElementIn = document.getElementById(this.modelFields[k].element_uuid);
      //     if (getElementIn == null && shapeAttributes['shape'].is_stamp != 0) {
      //       break;
      //     }
      //     if (shapeAttributes.element_id < 19 || shapeAttributes['shape'].annotation_data.includes('move')) {
      //       let getresizeShapeString = this.shapeService.resizeFunctionDoctoolbar(shapeAttributes, false);
      //       shapeAttributes['shape'].annotation_data = getresizeShapeString.shapeString;
      //     }
      //     if (shapeAttributes['shape'].is_stamp != 0) {
      //       this.shapeService.getshapeDrawingDocToolbar(shapeAttributes, false, this.modelFields[k].element_uuid, 'toolbarattribute' + k, 'DocPage', 'toolbarcanvasText' + k);
      //     }
      //   }
      // }
    }
  }

  

  ngForRendredPreview(t, a) {
    console.log(this.stampShapes);
    this.cdRef.detectChanges();
    if (this.stampShapes.length > 0&&a==1) {
      for (let k = 0; k < this.stampShapes.length; k++) {
        let getElement234 = document.getElementById(this.stampShapes[k].element_uuid);
        if (getElement234 != null) {
          let shapeAttributes;
          if (this.stampShapes[k].element_data.hasOwnProperty('shape')) {
            shapeAttributes = _.cloneDeep(this.stampShapes[k].element_data);
          }
          // if(shapeAttributes!=undefined&&shapeAttributes.element_id!=19&&shapeAttributes.element_id!=20&&shapeAttributes.element_id>-1){
          //     // if(Number(shapeAttributes.shape.initial_height)!=0&&Number(shapeAttributes.shape.initial_width)!=0){
          //     let getresizeShapeString = this.shapeService.resizeFunctionNewtoolbar(shapeAttributes, false);
          //       shapeAttributes.shape.annotation_data = getresizeShapeString.shapeString;  
          //     // }
          // }
          // this.shapeService.getshapeDrawingToolbar(shapeAttributes,false,this.stampShapes[k].element_uuid,'toolbarattribute','toolbar');
          if (shapeAttributes.element_id<19 || shapeAttributes['shape'].annotation_data.includes('move')) {
            let getresizeShapeString = this.shapeService.resizeFunctionNewtoolbar(shapeAttributes, false);
            shapeAttributes.shape.annotation_data = getresizeShapeString.shapeString;  
          }
          if (shapeAttributes['shape'].is_stamp != 0) {
            this.shapeService.getshapeDrawingToolbar(shapeAttributes,false,this.stampShapes[k].element_uuid,'toolbarattribute','toolbar');
          }
        }
      }
    }
  }

  changeShapeForWidthAndHeight(strShape: string, widthToChange: number, heightToChange: number, toolbar_element_id: number) {
    var getshapedimensions = this.shapeService.getCanvaswidthandHeight({ toolbar_element_id, annotation_data: strShape })
    // if(widthToChange <= 20 || heightToChange <= 20){
    //   widthToChange = 35;
    //   heightToChange = 35;
    // }
    // widthToChange = widthToChange <= 20 ? 50 : widthToChange;
    // heightToChange = heightToChange <= 20 ? 50 : heightToChange;
    var widthDifference = widthToChange / (getshapedimensions.width)
    var heightDifference = heightToChange / (getshapedimensions.height)
    var scaleFactorValue = widthDifference > heightDifference ? heightDifference : widthDifference

    var xDiff = 0;
    var yDiff = 0;
    if (toolbar_element_id < 11) {
      let commonValue = widthToChange > heightToChange ? heightToChange : widthToChange
      widthDifference = commonValue / (getshapedimensions.width)
      heightDifference = commonValue / (getshapedimensions.height)
      scaleFactorValue = widthDifference > heightDifference ? heightDifference : widthDifference
    } else if (toolbar_element_id != 100) {

      xDiff = ((getshapedimensions.left * scaleFactorValue) - getshapedimensions.left)
      yDiff = ((getshapedimensions.top * scaleFactorValue) - getshapedimensions.top)

      //Jose Added -- Previous code before resize fix for normal shape

      // xDiff = xDiff + (xDiff/4)//((widthToChange - getshapedimensions.width)/2)
      // yDiff = yDiff + (yDiff/4)//((heightToChange - getshapedimensions.height)/2)

      ////////

      xDiff = xDiff + ((widthToChange - getshapedimensions.width) / 2)
      yDiff = yDiff + ((heightToChange - getshapedimensions.height) / 2)
    }

    let finalString = ""
    let splitData: any = strShape.split(" ");
    for (var i = 0; i < splitData.length; i++) {
      var splitString = splitData[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      let hypenSplit = splitString.split("-");
      if (hypenSplit.length > 2) {
        let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
        hypenSplit = [hypenSplit[0], localString1];
      }
      if (hypenSplit != '') {
        let colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");
        colonSplit[0] = this.shapeService.scientificToDecimal(Number(colonSplit[0]));
        colonSplit[1] = this.shapeService.scientificToDecimal(Number(colonSplit[1]));

        if (toolbar_element_id == 19 || toolbar_element_id == 20) {
          colonSplit[2] = this.shapeService.scientificToDecimal(Number(colonSplit[2]));
          colonSplit[3] = this.shapeService.scientificToDecimal(Number(colonSplit[3]));
          let widthDiff = widthToChange - getshapedimensions.width
          let heightDiff = heightToChange - getshapedimensions.height
          colonSplit[0] = colonSplit[0] - (widthDiff / 2);
          colonSplit[1] = colonSplit[1] - (heightDiff / 2);
          colonSplit[2] = colonSplit[2] + (widthDiff);
          colonSplit[3] = colonSplit[3] + (heightDiff);
          if (getshapedimensions.width != getshapedimensions.height) {
            if (widthToChange > getshapedimensions.width) {
              colonSplit[2] = getshapedimensions.width * scaleFactorValue;
            }
            else {
              colonSplit[2] = colonSplit[2] * heightDifference;
            }
            if (heightToChange > getshapedimensions.height) {
              colonSplit[3] = getshapedimensions.height * scaleFactorValue;
            }
            else {
              colonSplit[3] = colonSplit[3] * widthDifference;
            }
          }
          if(colonSplit[2] < 45 && colonSplit[3] < 45){
            let get_heigh_value = colonSplit[2] >= colonSplit[3] ? colonSplit[2] : colonSplit[3];
            let difference = 45 - get_heigh_value;
            colonSplit[2] = colonSplit[2] + difference;
            colonSplit[3] = colonSplit[3] + difference;
          }
          let localstring = hypenSplit[0] + "-" + colonSplit[0] + ":" + colonSplit[1] + ":" + colonSplit[2] + ":" + colonSplit[3]
          finalString = finalString != "" ? finalString + " " + localstring : localstring
        } else {
          colonSplit[0] = (colonSplit[0] * scaleFactorValue) - xDiff
          colonSplit[1] = (colonSplit[1] * scaleFactorValue) - yDiff

          let localstring = hypenSplit[0] + "-" + colonSplit[0] + ":" + colonSplit[1]
          finalString = finalString != "" ? finalString + " " + localstring : localstring
        }
      }
    }
    console.log("shape for base icon", finalString)

    let value = this.shapeService.getCanvaswidthandHeight({ toolbar_element_id, annotation_data: finalString })
    console.log("old", getshapedimensions, "new ", value, (widthToChange - getshapedimensions.width))
    return finalString;
  }

  changeShapePositionsInsideCanvas(strShape: string, toolbar_element_id: number,oldShapeDimentions:any) {
    var getshapedimensions = this.shapeService.getCanvaswidthandHeight({ toolbar_element_id, annotation_data: strShape })
    var xDiff = getshapedimensions.left
    var yDiff = getshapedimensions.top
    let finalString = ""
    let splitData: any = strShape.split(" ");
    for (var i = 0; i < splitData.length; i++) {
      var splitString = splitData[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      let hypenSplit = splitString.split("-");
      if (hypenSplit.length > 2) {
        let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
        hypenSplit = [hypenSplit[0], localString1];
      }
      if (hypenSplit != '' && hypenSplit[0] != "text") {
        let colonSplit = hypenSplit[1].replaceAll('n', '-').split(":");
        colonSplit[0] = this.shapeService.scientificToDecimal(Number(colonSplit[0]));
        colonSplit[1] = this.shapeService.scientificToDecimal(Number(colonSplit[1]));
        if ((toolbar_element_id == 19 || toolbar_element_id == 20) && !strShape.includes('move')) {
          colonSplit[0] = colonSplit[0] - xDiff;
          colonSplit[1] = colonSplit[1] - yDiff;
          colonSplit[2] = this.shapeService.scientificToDecimal(Number(colonSplit[2]));
          colonSplit[3] = this.shapeService.scientificToDecimal(Number(colonSplit[3]));

          let localstring = hypenSplit[0] + "-" + colonSplit[0] + ":" + colonSplit[1] + ":" + colonSplit[2] + ":" + colonSplit[3];
          finalString = finalString != "" ? finalString + " " + localstring : localstring;
        }
        else {
          colonSplit[0] = colonSplit[0] - xDiff;
          colonSplit[1] = colonSplit[1] - yDiff;
          let localstring = hypenSplit[0] + "-" + colonSplit[0] + ":" + colonSplit[1];
          finalString = finalString != "" ? finalString + " " + localstring : localstring;
        }
      } else if (hypenSplit != '' && hypenSplit[0] == "text") {
        finalString = finalString != "" ? finalString + " " + hypenSplit.join("-") : hypenSplit.join("-")
      }

      
    }
    console.log("shape for base icon", finalString)

    let value = this.shapeService.getCanvaswidthandHeight({ toolbar_element_id, annotation_data: finalString })
    console.log("old", getshapedimensions, "new ", value)
    let xDiff_final = getshapedimensions.left > 0 ? getshapedimensions.left - (value.width/2) : (oldShapeDimentions.width-value.width)/2
    let yDiff_final = getshapedimensions.top > 0 ? getshapedimensions.top - (value.height/2) : (oldShapeDimentions.height-value.height)/2
    return {annotationData:finalString,left:xDiff_final,top:yDiff_final,width:value.width,height:value.height}
  }


  previewshapedrawing(getData123, isnegativeCoordinates, id, labelid, source) {
    
    let getDataClone = _.cloneDeep(getData123);
    let fullData;
    let getData;
    var elementId;
    let getnewwidth;
    let getnewheight;
    if (source == 'DocPage') {
      fullData = getDataClone;
      getData = getDataClone.shape;
      elementId = getData.element_id;
      getnewheight = 35;
      getnewwidth = 35;
      var getDrawWidthandHeightTemp = this.shapeService.getCanvaswidthandHeight(getData);
    }
    else {
      fullData = getDataClone;
      getData = getDataClone.shape;
      elementId = getData.element_id;
      getnewheight = 35;
      getnewwidth = 35;
      var getDrawWidthandHeightTemp = this.shapeService.getCanvaswidthandHeightP2P3(getData);
    }
    getData.initial_position_x = 0;
    getData.initial_position_y = 0;
    this.coordinateX = getDrawWidthandHeightTemp.left - ((Number(fullData.line_width) / 2) / 2);
    this.coordinateY = getDrawWidthandHeightTemp.top - ((Number(fullData.line_width) / 2) / 2);

    var pdfImg = document.getElementById(id);

    if (pdfImg != null && pdfImg.firstChild != null) {
      // pdfImg.removeChild(pdfImg.firstChild);
      var child = pdfImg.lastElementChild;
      while (child) {
        pdfImg.removeChild(child);
        child = pdfImg.lastElementChild;
      }
    }
    if(pdfImg!=null){
      
      let getannotationLabelElement = pdfImg.querySelectorAll("p");
      if (getannotationLabelElement.length > 0) {
        for (var al = 0; al < getannotationLabelElement.length; al++) {
          if (getannotationLabelElement[al].getAttribute(labelid) != null) {
            getannotationLabelElement[al].remove();
          }
        }
      }
    }
    // let getannotationLabelElement = document.querySelectorAll("p");
    // if (getannotationLabelElement.length > 0) {
    //   for (var al = 0; al < getannotationLabelElement.length; al++) {
    //     if (getannotationLabelElement[al].getAttribute(labelid) != null) {
    //       getannotationLabelElement[al].remove();
    //     }
    //   }
    // }
    if (source == 'DocPage') {
      var newcreatedElement:any = document.getElementById(id);
      if(newcreatedElement==null){
        return;
      }
    }
    else{
      var newcreatedElement:any = document.createElement("canvas");
    // newcreatedElement.style.background="green";
      newcreatedElement.setAttribute("id", 'canvas' + id);
    }
    if(elementId!=11){
      newcreatedElement.style.top = 0 + "px";
      newcreatedElement.style.left = 0 + "px";
      newcreatedElement.setAttribute("width", getnewwidth);
      newcreatedElement.setAttribute("height", getnewheight);
    }
    else if (elementId == 11) {
      let staticValue = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-60:0 controlpoint-65:0 curveEnd-65:5 line-65:15 controlpoint-65:20 curveEnd-60:20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10"
      var getText = getData.annotation_data.split('text-');
      var textvalidate = getText[1]!=undefined ? getText[1] : '';
      if (getText.length>1 && typeof getText[1] != undefined) {
        if (getData.annotation_label.trim() != '') {
          let textvalue = getData.annotation_label.trim();
          getText.push(textvalue);
        }
        else {
          let textvalue = "     ";
          getText.push(textvalue);
        }
      }
      textvalidate = textvalidate.replaceAll("`~", " ");
      textvalidate = textvalidate.replaceAll("~`", "-");
      textvalidate = textvalidate.replaceAll("~~~", ":");
      let canvas12 = document.createElement("canvas");
      canvas12.style.width = "200px";
      let textCount = 20;
      let context = canvas12.getContext("2d");
      context.font = "17px times new roman";
      context.fillText(textvalidate, 0, 0);
      let widthget = context.measureText(textvalidate).width;
      if (textvalidate.length < 5) {
        textCount = 27;
      }
      else if (textvalidate.length > 12) {
        textCount = 5;
      }
      let formattedWidth = Math.ceil(widthget);
      formattedWidth = formattedWidth + textCount;
      canvas12.innerHTML = textvalidate;
      canvas12.style.fontWeight = "500";
      canvas12.style.fontSize = "17px";
      var textWidth = formattedWidth;
      let currentAnnotationData = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-" + getText[1] + ""
      let widththerom = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10";
      let x1Coordinate = [];
      let y1Coordinate = [];
      widththerom = widththerom.trim();
      let splitData123 = widththerom.split(" ");
      for (var im = 0; im < splitData123.length - 1; im++) {        
        // var splitString = splitData123[im].replaceAll('--', '-n');
        // splitString = splitString.replaceAll(':-', ':n');
        // var hypenSplit = splitString.split("-");
        // for (var j = 0; j < hypenSplit.length; j++) {
        //   var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");

        let hypenSplit = splitData123[im].split("-");
        let colonSplit = hypenSplit[1].split(":");
        x1Coordinate.push(colonSplit[0]);
        y1Coordinate.push(colonSplit[1]);
      }
      let startx = Math.min.apply(null, x1Coordinate);
      let endx = Math.max.apply(null, x1Coordinate);
      let starty = Math.min.apply(null, y1Coordinate);
      let endy = Math.max.apply(null, y1Coordinate);
      let textshapewidth = (endx - startx);
      let textshapeheight = (endy - starty);
      // getData.annotation_data = staticValue;
      // newcreatedElement.setAttribute("id", getData.annotation_id);
      let newOne = textWidth;
      newcreatedElement.setAttribute("width", "60");
      newcreatedElement.setAttribute("height", "50");
      var textShapexyWidth = (newOne - textshapewidth) / 2;
      var textShapexyHeight = (50 - textshapeheight) / 2;
      textShapexyWidth = textShapexyWidth - 5;
      
      newcreatedElement.style.top = 0 + "px";
      newcreatedElement.style.left = 0 + "px";
      // newcreatedElement.style.marginLeft = - (newOne / 2) + "px";
      // newcreatedElement.style.marginTop = -(50 / 2) + "px";
      if (getData.annotation_label!=undefined && getData.annotation_label != "") {
        let labelElement = document.createElement("p");
        // pdfImg.appendChild(labelElement);
        labelElement.setAttribute("annotationLabel", "1");
        labelElement.setAttribute("id", "label" + getData.annotation_id);
        labelElement.style.color = this.shapeService.checkStrokeColor1(getData.stroke_color);
        let fontSizeget = textvalidate.length > 15 ? 6 : textvalidate.length <= 6 ? 8 : 6;
        labelElement.style.fontSize = fontSizeget + 'px';
        labelElement.style.fontWeight = "500";
        labelElement.style.position = "absolute";
        labelElement.style.top = 20 + "px";
        labelElement.style.left = 10 + "px";
        
        labelElement.innerHTML = getData.annotation_label;
        labelElement.style.lineHeight = "1";
        labelElement.style.textAlign = "center";
        labelElement.style.pointerEvents = "none";
        labelElement.style.zIndex = "9";
        if(getData.annotation_label!=undefined){
          var numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;  
        }
        else{
          numberOfLineBreaks = 0;
        }
        if (numberOfLineBreaks != 0) {
          labelElement.style.whiteSpace = "pre-wrap";
        }
        
        let measurement = (labelElement.clientHeight);
        let measurement1 = (labelElement.clientWidth);
        
        // labelElement.style.marginLeft = -(measurement1 / 2) + 3 + "px";
        // labelElement.style.marginTop = -(measurement / 2) + "px";
        labelElement.style.wordBreak = "break-word";
        if (getData.initial_rotation != undefined && getData.initial_rotation != 0) {
          let dx = getData.initial_rotation > 0 ? (labelElement.clientWidth / 2) : (-15);
          let dy = getData.initial_rotation > 0 ? (-15) : labelElement.clientHeight / 2;
          labelElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';
          
          // 
          // this.canvasElement.restore();
        }
      }
    }

    if (getData.annotation_label!=undefined && getData.annotation_label != "" && elementId!=11) {
      this.shapeService.annotationLabelBackground(getData, id, labelid);
    }
    if(source!='DocPage'){
      pdfImg.appendChild(newcreatedElement);
    }
    this.canvasElement = newcreatedElement.getContext("2d");

    this.canvasElement.beginPath();
    // this.canvasBlurryRemove(newcreatedElement,this.canvasElement);

    //Rotate shape drawing setup start
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 12) {
      let dx = getData.initial_rotation > 0 ? (getnewwidth / 2) : (-15);
      let dy = getData.initial_rotation > 0 ? (-15) : getnewheight / 2;
      newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')'+' scale(0.7)';
      
      // 
      // this.canvasElement.restore();
    }
    //Rotate shape drawing setup end
    
    // if (getData.is_stamp != 4) {
    //   let actualCanvasWH = this.getCanvaswidthandHeight(getData);
    //   if (elementId < 12) {
    //     var currentDBgetW = getnewwidth - ((Number(fullData.line_width) / 6) * 2);
    //     var currentDBgetH = getnewheight - ((Number(fullData.line_width) / 6) * 2);
    //   }
    //   else {
    //     // let lineWidth = (Number(fullData.line_width) / 2);
    //     // lineWidth = lineWidth < 5 ? 1 : lineWidth;
    //     // actualCanvasWH.height = actualCanvasWH.height + lineWidth;
    //     // actualCanvasWH.width = actualCanvasWH.width + lineWidth;
    //     // var currentDBgetW = Number(getnewwidth);
    //     // var currentDBgetH = Number(getnewheight);
    //     var currentDBgetW = getnewwidth - ((Number(fullData.line_width) / 2));
    //     var currentDBgetH = getnewheight - ((Number(fullData.line_width) / 2));
    //   }
    //   let actualratio = actualCanvasWH.width / actualCanvasWH.height;
    //   let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
    //   var scaleFactor1 = 0;
    //   if (actualratio > fixedratio) {
    //     scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
    //   }
    //   else {
    //     scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
    //   }
    //   console.log(scaleFactor1);
    //   this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    //   this.canvasElement.textAlign="center";
    //   if(elementId==11){
    //     this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top + 50);
    //   }
    //   else if(elementId<12){
    //     this.canvasElement.translate(getDrawWidthandHeightTemp.left/scaleFactor1, getDrawWidthandHeightTemp.top/scaleFactor1);
    //   }
    //   // else{
    //   //   let translateWidth = actualCanvasWH.width - newcreatedElement.width;
    //   //   let translateHeight = actualCanvasWH.height - newcreatedElement.height;
    //   //   let translateX = (translateWidth / 2);
    //   //   let translateY = (translateHeight / 2);
    //   //   this.canvasElement.translate(translateX, translateY);  
    //   // }
    // }
    // else {
    //   let actualCanvasWH = this.getCanvaswidthandHeight(getData);
    //   if (elementId < 12) {
    //     var currentDBgetW = getnewwidth - ((Number(fullData.line_width) / 6) * 2);
    //     var currentDBgetH = getnewheight - ((Number(fullData.line_width) / 6) * 2);
    //   }
    //   else {
    //     var currentDBgetW = getnewwidth - (Number(fullData.line_width) / 2);
    //     var currentDBgetH = getnewheight - (Number(fullData.line_width) / 2);
    //   }
    //   var fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
    //   var scaleFactor1 = 0;
    //   if (source == "DocPage") {
    //     currentDBgetW = (currentDBgetW / 2);
    //     currentDBgetH = (currentDBgetH / 2);
    //     fixedratio = Number(currentDBgetW - 2) / Number(currentDBgetH - 2);
    //     let actualratio = actualCanvasWH.width / actualCanvasWH.height;
    //     if (actualratio > fixedratio) {
    //       scaleFactor1 = Number(currentDBgetW - 2) / (actualCanvasWH.width);
    //     }
    //     else {
    //       scaleFactor1 = Number(currentDBgetH - 2) / actualCanvasWH.height;
    //     }
    //   }
    //   else {
    //     var xreducer = Number(fullData.line_width) / 6;
    //     var yreducer = Number(fullData.line_width) / 6;
    //     fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
    //     let actualratio = actualCanvasWH.width / actualCanvasWH.height;
    //     if (actualratio > fixedratio) {
    //       scaleFactor1 = Number(currentDBgetW) / (actualCanvasWH.width);
    //     }
    //     else {
    //       scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
    //     }
    //   }
      
    //   if (getDrawWidthandHeightTemp != undefined && (getData.initial_height == 0 || getData.initial_height == undefined)) {
    //     if (source == "DocPage") {
    //       newcreatedElement.setAttribute("width", (currentDBgetW));
    //       newcreatedElement.setAttribute("height", (currentDBgetH));
    //       this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    //       this.canvasElement.translate(1, 1);
    //       this.canvasElement.restore();
    //     }
    //     else {
    //       newcreatedElement.setAttribute("width", (getnewwidth));
    //       newcreatedElement.setAttribute("height", (getnewheight));
    //       this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    //       if (getDrawWidthandHeightTemp != undefined) {
    //         let translateWidth = getDrawWidthandHeightTemp.width - newcreatedElement.width;
    //         let translateHeight = getDrawWidthandHeightTemp.height - newcreatedElement.height;
    //         let leftNegative = getDrawWidthandHeightTemp.left<0 ? 0 : getDrawWidthandHeightTemp.left;
    //         let topNegative = getDrawWidthandHeightTemp.top<0 ? 0 : getDrawWidthandHeightTemp.top;
    //         let translateX = (translateWidth / 2) + leftNegative;
    //         let translateY = (translateHeight / 2) + topNegative;
    //         if(elementId==11){
    //           console.log(translateWidth * scaleFactor1 ,translateHeight * scaleFactor1,
    //           newcreatedElement.width,newcreatedElement.height);
    //         }
    //         // console.log(translateX,translateY);
    //         // this.canvasElement.translate(translateX, translateY);
    //         // this.canvasElement.restore();
    //         // if (getData.is_stamp == 4 && elementId == 11) {
    //         //   getDrawWidthandHeightTemp.left = 0;
    //         //   getDrawWidthandHeightTemp.top = 0;
    //         //   
    //         // }
    //         if(elementId==11){
    //           this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top+5);
    //         }
    //         else{
    //           this.canvasElement.translate(-getDrawWidthandHeightTemp.left, -getDrawWidthandHeightTemp.top);
    //         }
            
    //         this.canvasElement.restore();
    //         // this.canvasElement.scale(scaleFactor1,scaleFactor1);
    //       }
    //     }
    //   }
    // }
    
    this.canvasElement.imageSmoothingQuality = "high";
    // newcreatedElement = this.createHIDPIcanvs(newcreatedElement.width, newcreatedElement.height, 72, newcreatedElement);
    this.canvasElement.globalAlpha = fullData.opacity;
    getData.annotation_data = getData.annotation_data.trim();
    var spaceSplit = getData.annotation_data.split(" ");
    var previous = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var a = 0;
    var last_mousex = this.coordinateX;
    var last_mousey = this.coordinateY;
    var mousex = 0;
    var mousey = 0;
    var cpx = 0;
    var cpy = 0;
    let cp1x = 0;
    let cp1y = 0;
    let cp2x = 0;
    let cp2y = 0;
    let cx = 0;
    let cy = 0;
    for (var i = 0; i < spaceSplit.length; i++) {
      var splitString = spaceSplit[i].replaceAll('--', '-n');
      splitString = splitString.replaceAll(':-', ':n');
      var hypenSplit = splitString.split("-");
      for (var j = 0; j < hypenSplit.length; j++) {
        var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
        if (
          j == 1 &&
          hypenSplit[0] != "curveEnd" &&
          hypenSplit[0] != "controlpoint" &&
          hypenSplit[0] != "drawRect" &&
          hypenSplit[0] != "controlpoint1" &&
          hypenSplit[0] != "controlpoint2" &&
          hypenSplit[0] != "endCurve"
        ) {
          //Ellipse negative value is coming convert positive from ipad
          var x = parseFloat(colonSplit[0]);
          var y = parseFloat(colonSplit[1]);
          var w = parseFloat(colonSplit[2]);
          var h = parseFloat(colonSplit[3]);
          switch (hypenSplit[0]) {
            case "move":
              this.canvasElement.moveTo(x-this.coordinateX,y - this.coordinateY);
              break;
            case "line":
              this.canvasElement.lineTo(x-this.coordinateX,y - this.coordinateY);
              break;
            case "ovalIn":
              if (elementId == 1 || elementId == 8) {
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.arc(
                  newcreatedElement.clientWidth / 2,
                  newcreatedElement.clientHeight / 2.3, r, 0, 2 * Math.PI
                );
              } else if (elementId == 19) {
                w = w < 0 ? -(w) : w;
                h = h < 0 ? -(h) : h;
                
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse((w / 2) + 2 + ((Number(fullData.line_width) / 2) / 2), (h / 2) + 2 + ((Number(fullData.line_width) / 2) / 2), w / 2, h / 2, Math.PI * 1, 0, 2 * Math.PI);
              }
              break;
          }
        }
        else if (hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);
            if (elementId == 11) {
              this.canvasElement.quadraticCurveTo(cpx + textShapexyWidth, cpy + textShapexyHeight, ex + textShapexyWidth, ey + textShapexyHeight);
            }
            else {
              this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
            }

          }
        }
        else if (hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve" && j == 1) {
          if (hypenSplit[0] == "controlpoint1") {
            cp1x = parseFloat(colonSplit[0]);
            cp1y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "controlpoint2") {
            cp2x = parseFloat(colonSplit[0]);
            cp2y = parseFloat(colonSplit[1]);
          }
          else if (hypenSplit[0] == "endCurve") {
            cx = parseFloat(colonSplit[0]);
            cy = parseFloat(colonSplit[1]);
            this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
            this.canvasElement.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          colonSplit[0] = Number(colonSplit[0]);
          colonSplit[1] = Number(colonSplit[1]);
          colonSplit[2] = Number(colonSplit[2]);
          colonSplit[3] = Number(colonSplit[3]);
          colonSplit[2] = colonSplit[2] < 0 ? -(colonSplit[2]) : colonSplit[2];
          colonSplit[3] = colonSplit[3] < 0 ? -(colonSplit[3]) : colonSplit[3];
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);
          
          this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
          // let rectlineWidth = this.globalLineWidth(getData.line_width);
          // newcreatedElement.setAttribute('width',(newcreatedElement.width + rectlineWidth).toString());
          // newcreatedElement.setAttribute('height',(newcreatedElement.height + rectlineWidth).toString());
          // newcreatedElement.style.top = this.coordinateY - (rectlineWidth/2) + 'px';
          // newcreatedElement.style.left = this.coordinateX - (rectlineWidth/2) + 'px';
          this.canvasElement.rect(
            ((Number(fullData.line_width) / 2) / 2) + 1,
            ((Number(fullData.line_width) / 2) / 2) + 1,
            rectWidth + 2,
            rectHeight + 2);
          // 
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15 &&
      elementId != 11
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.shapeService.checkStrokeColor1(checkFill);
      this.canvasElement.fill();
    }
    if (elementId == 17 || elementId == 18 || elementId == 1) {
      this.canvasElement.closePath();
    }
    
    // if(getData.hasOwnProperty('is_stamp')){
    //   this.canvasElement.lineWidth = Number(fullData.line_width) / (100);
    // }
    // else 
    if (elementId <= 11) {
      this.canvasElement.lineWidth = Number(fullData.line_width) / (10);
      if(elementId == 11){
        let lineCount = Number(fullData.line_width) / (10);
        if(lineCount<2){
          this.canvasElement.lineWidth = 2;
        }
      }
    }
    else if (elementId >11) {
      this.canvasElement.lineWidth = Number(fullData.line_width) / (2);
    }
    this.canvasElement.strokeStyle = this.shapeService.checkStrokeColor1(getData.stroke_color);
    this.canvasElement.stroke();
    newcreatedElement.style.overflow = "visible";
    newcreatedElement.style.display = "block";
    // this.canvasElement.lineCap = "square";
    // this.canvasElement.lineJoin = "miter";
    if (elementId >= 12 && elementId <= 18 && getData.initial_height != 0 && getData.initial_width != 0) {
      newcreatedElement.style.top = 0 + 'px';
      newcreatedElement.style.left = 0 + 'px';
    }

  }

  exit_publish() {
    this.loader1=true;
    console.log(typeof(this.isReadonly));
    if(this.isReadonly==false || this.isReadonly==null)
    {
      if(this.userrole != 'view') {
        this.show = true;
        this.previewToolbarOn = false;
        this.filtered_Toolbar = this.toolbar_content.toolbarItem.filter(
          (data) => data.element_id != -1
        );
        this.toolbar_content.toolbarItem.name = this.toolbar_content.toolbarItem.element_name;
        let UpdateToolbarModel: any = {
          user_id: this.userid.user_id,
          toolbar_id: this.route.snapshot.queryParamMap.get("toolbarId"),
          toolbar_data: this.filtered_Toolbar,
          toolbar_element_count: this.toolbar_content.toolbarItem.length,
        };
        
        this.previewToolbarData = this.filtered_Toolbar;
        this.updateToolbarData = UpdateToolbarModel;
        this.TService.update_toolbar_data(UpdateToolbarModel).subscribe((data) => {
          this.itemValue = [];
          this.show = false;
          // this.updatedvalue = JSON.parse(data["response_body"].toolbar_data);
          // for (var i = 0; i < this.updatedvalue.length; i++) {
          //   this.itemValue.push(this.toolbar_content.toolbarItem);
          // }
          // this.overlay = true;
        });
      }
      else if(this.userrole == 'view') {
        this.userRoleGlobal.permissionCheck();
        this.sharedService.filter("Refresh Click");
      }
    }
    else if(this.isReadonly==true)
    {
      this.userRoleGlobal.permissionCheck();
      this.sharedService.filter("Refresh Click");
    }
    this.exitconfirm = true;
  }

}


