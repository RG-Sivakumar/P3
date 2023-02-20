import { Component, OnInit, AfterViewInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { CreateDocumentService } from '../services/create-document.service';
import { PanZoomConfig, PanZoomAPI, PanZoomModel } from 'ng2-panzoom';
import { trigger, transition, animate, style, state } from '@angular/animations'
import { ImageDownloadService } from './image-download.service';
import { HttpClient } from '@angular/common/http';
import panzoom, { PanZoom, PanZoomController } from "panzoom";
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment.prod';
import { DataimageService } from 'src/app/dataimage.service';
import { ShapeService } from '../services/shape.service';
import { PinchZoomComponent } from 'ngx-pinch-zoom';
import { PreviewimagedownloadpopupComponent } from '../createdocument/previewimage/previewimagedownloadpopup/previewimagedownloadpopup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as _ from 'lodash';
import { getFormById } from '../createdocument/formOperations';
import { elements } from 'src/app/formbuilder/Model/controlmodel';
import { ComponentsModule } from 'authguard/src/app/component/component.module';
import { FormlistService } from 'src/app/formbuilder/services/formlist.service';
import { json } from 'd3';
import { DataService } from 'src/app/data.service';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { DocumentPagesService } from '../services/document-pages.service';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import heic2any from "heic2any";

@Component({
  selector: 'app-annotation-view',
  templateUrl: './annotation-view.component.html',
  styleUrls: ['./annotation-view.component.css'],
  animations: [trigger("fade", [
    state("void", style({ opacity: 0 })),
    transition("void <=> *", [animate("0.5s ease")])
  ])]
})
export class AnnotationViewComponent implements OnInit, AfterViewInit {
  private panzoomConfig: PanZoomConfig = new PanZoomConfig;
  @Input() static: boolean = true;
  coordinateX: number = 0;
  coordinateY: number = 0;
  show: boolean = false;
  title: string = "annotation name";
  layerId: string = "";
  projectId: string;
  folderid: string = "89-080E5D58-7233-45D6-B127-B1224ACB103E-1610357483509";
  layerDatas: any[] = [];
  selectAnnotation: any = {};
  annotationid: string = "";
  pageId: string = "89-080E5D58-7233-45D6-B127-B1224ACB103E-1610357484152";
  public canvasElement: CanvasRenderingContext2D;
  strokeColor: string = "";
  fillColor: string = "";
  imgUrl: any;
  mousleaveEventRemove: any;
  realWidth: number;
  realHeight: number;
  imageset: any;
  activeIndex: any;
  fileName: any;
  imgstubid: any;
  imageId: any;
  documentData: any[] = [];
  projectData: any[] = [];
  pt: any;
  initPT: any;
  imgH: number;
  imgW: number;
  viewBoxWidth: any;
  viewBoxHeight: any;
  isMouseDown: boolean;
  isPanning: boolean;
  actionsEnabled: boolean = false;
  initialPageViewBox: string;
  pageViewBox: string;
  zoomViewBox: string;
  zoom: number = 1;
  viewBoxX: number;
  viewBoxY: number;
  public scale = 1.0;
  public scaleMultiplier = 0.8;
  pngFormat: boolean;
  pdfPageNumber: any;
  currentIndex: number = 0;
  formsCount: number = 0;
  stubCount: number = 0;
  photoCount: number = 0;
  linkCount: number = 0;
  createdDate: any = "12/4/2020, 11:26 AM";
  modifiedDate: any = "12/4/2020, 11:26 AM";
  mediaAccess: boolean = false;
  linkAccess: boolean = false;
  baseUrl: string;
  sKey1: string;
  sKey2: string;
  @ViewChild('pinch') pinchZoom: PinchZoomComponent;
  panStartOption: boolean = false;
  panzoomController: PanZoom;
  startPanx: any = 0;
  startPany: any = 0;
  DummyField: any;
  FieldResult: any;
  tagAccess: boolean = false;
  formscount1: any;
  datas: any = [];
  currentDate = new Date();
  attributess: any = [];
  editIndex: number = 0;
  condition_field_name: any = "";
  current_if_value: any = "";
  current_if_do: any = "";
  current_if_state: any = "";
  defaultArrray: any = [];
  currentFormId: any;
  currentFormName: any;
  currentFormHiddenStatus: any;
  modelFieldsForm: Array<elements> = [];
  formList: any = [];
  dbxposition: number = 0;
  dbyposition: number = 0;
  formListDefaultValues: any;
  layerDetails: any;
  seticonwidth: number = 0;
  seticonheight: number = 0;
  iconsize1: any;
  is_extend: boolean = false;
  real_Height : number = 45;
  annotation_svg_view:any = "";
  finalArray2: any[];
  display_String: any;


  constructor(private documentService: CreateDocumentService, private router: Router, private activateRoute: ActivatedRoute, public service20: DataService,
    private urlSerializer: UrlSerializer, private datePipe: DatePipe, private dialogbox: MatDialog,private dataService4: DataService,
    private imgdataService: DataimageService, private cdRef: ChangeDetectorRef, private shapeService: ShapeService, public service12: FormlistService,
    private documentPage:DocumentPagesService,private encrptdecrpt:EncryptDecryptService) {
    this.layerId = this.activateRoute.snapshot.queryParamMap.get("layer_id");
    this.annotationid = this.activateRoute.snapshot.queryParamMap.get("annotation_id");

  }


  ngOnInit(): void {
    this.securityCheck();
    this.getLayerData();
  }

  ngAfterViewInit(): void {
  }

  getFormList() {
    let req2 = this.documentService.getformlist(this.projectId).subscribe((response) => {
      console.log(response)
      var dateFilter = response["response_body"]["form_listing"];
      if (dateFilter != undefined) {
        var crateDateFilter = dateFilter.filter((createDate) => {
          return (createDate.created_date = this.datePipe.transform(
            createDate.created_date,
            "MM/dd/yyyy HH:mm:ss"
          ));
        });
        this.formList = crateDateFilter.filter((modifiedDate) => {
          return modifiedDate.last_updated_date != undefined
            ? (modifiedDate.last_updated_date = this.datePipe.transform(
              modifiedDate.last_updated_date,
              "MM/dd/yyyy HH:mm:ss"
            ))
            : (modifiedDate.last_updated_date = this.datePipe.transform(
              modifiedDate.created_date,
              "MM/dd/yyyy HH:mm:ss"
            ));
          });
          this.formList = crateDateFilter.filter((modifiedDate) => {
            return modifiedDate.last_updated_date != undefined
              ? (modifiedDate.last_updated_date = this.datePipe.transform(
                modifiedDate.last_updated_date,
                "MM/dd/yyyy HH:mm:ss"
              ))
              : (modifiedDate.last_updated_date = this.datePipe.transform(
                modifiedDate.created_date,
                "MM/dd/yyyy HH:mm:ss"
              ));
          });
          this.formList = this.formList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
          let responseValue = response["response_body"]["form_listing"];
          this.formListDefaultValues = _.cloneDeep(responseValue);
          console.log(this.formList);
          this.filterMarkedAnnotation();
          this.show = false;
      }
      else{
        this.filterMarkedAnnotation();
        this.show=false;
      }
    });
  }


  // pdfImg.style.transform = "scale(" + this.scale + ")";
  // getDocumentPages() {
  //   this.documentService
  //     .getDocumentDetails(this.projectid, this.folderid)
  //     .subscribe((response) => {
  //       
  //       var docData = response["response_body"]["document_list"];
  //       if (response["response_body"]["document_path"] != "") {
  //         this.pdfPageNumber = 1;
  //         this.imgUrl = response["response_body"]["document_path"];
  //         this.pngFormat = false;
  //       } else {
  //         this.pngFormat = true;
  //         var Page = docData.filter(ele => ele.page_id == this.pageId);
  //         this.imgUrl = Page[0].file_path;
  //         var img = document.createElement("img");
  //         img.onload = () => {
  //           this.realWidth = img.width;
  //           this.realHeight = img.height;
  //         };
  //         img.src = this.imgUrl;

  //       }


  //     });
  // }

  callBackFn(event) {
  }

  pageRendered(e) {
    let getElement1 = document.getElementById("pdfViewerHead");
    let getElement = getElement1.getElementsByClassName("page");
    this.pdfPageNumber = this.documentData[0].page_number;
    if (e.pageNumber == this.pdfPageNumber) {
      let getwidthheight = getElement[0].getBoundingClientRect();
      this.realWidth = getwidthheight.width;
      this.realHeight = getwidthheight.height;
      this.documentService.createDocumentStore_values.document_width = getwidthheight.width;
      this.documentService.createDocumentStore_values.document_height = getwidthheight.height;
      // getElement[0].setAttribute("id", "pdfImg");
      if (this.layerDatas == undefined || this.documentData == undefined || this.projectData == undefined) {
        this.filterMarkedAnnotation();
      }
    }
    // for (let i = 0; i < getElement.length; i++) {
    //   
    //   
    //   let pageNumberTemp = getElement[i].getAttribute("data-page-number");
    //   if (Number(pageNumberTemp) == this.pdfPageNumber) {
    //     
    //     let getwidthheight = getElement[i].getBoundingClientRect();
    //     this.realWidth = getwidthheight.width;
    //     this.realHeight = getwidthheight.height;
    //     getElement[i].setAttribute("id", "pdfImg");
    //     this.getLayerData();
    //   } else {
    //     getElement[i].removeAttribute("id");
    //   }
    // }
  }

  pdfCallCount: number = 1;

  ngForRendredPDF(e) {
    if (this.pdfCallCount == 1) {
      this.pdfCallCount += 1;
      this.pageRendered1(e);
    }
  }

  pageRendered1(e) {
    this.panzoomImgSetup();
    this.show = false;
    this.getFormList();
  }

  // for (let l = 0; l < this.layerDatas.length; l++) {
    //   if (this.layerDatas[l].is_removed == false || this.layerDatas[l].is_removed == "false") {
    //     this.coordinateX = this.layerDatas[l].initial_position_x;
    //     this.coordinateY = this.layerDatas[l].initial_position_y;
    //     let isnegativeCoordinates = false;
    //     if (this.coordinateX < 0 && this.coordinateY < 0) {
    //       this.coordinateX = -this.coordinateX;
    //       this.coordinateY = -this.coordinateY;
    //       isnegativeCoordinates = true;
    //     }
    //     this.getshapeDrawing1(this.layerDatas[l], isnegativeCoordinates);
    //   }
    // }

  getLayerData() {
    this.show = true;
    this.documentService.getLayerDetails(this.layerId, this.annotationid).subscribe((response) => {
        console.log(response);
        if (response["response_code"] == 200 && response["response_body"]["document_data"].length > 0) {
          var layerDetails = response["response_body"]["layer_data"];
          this.documentData = response["response_body"]["document_data"];
          this.projectData = response["response_body"]["project_data"];
          this.fileName = this.documentData[0].folder_name;
          this.projectId = this.projectData[0].project_id;
          if (response["response_body"]["document_data"][0].page_icon_data != null) {
            this.iconsize1 = response["response_body"]["document_data"][0].page_icon_data;
            var stringify = JSON.parse(this.iconsize1);
            this.seticonheight = stringify.height;
            this.seticonwidth = stringify.width;
          }
          if (this.documentData[0].document_path != "") {
            // this.pdfPageNumber = this.documentData[0].page_number;
            //this.imgUrl = this.documentData[0].document_path;
            // setTimeout(() => {
            //   this.pdfPageNumber = this.documentData[0].page_number;
            // },2700)
            this.imgUrl = environment.APIBaseUrl + "get_web_singed_file?file=" + this.documentData[0].document_path + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
            this.pngFormat = false;
            this.realHeight = this.documentData[0].height;
            this.realWidth = this.documentData[0].width;
            this.documentService.createDocumentStore_values.document_width = this.documentData[0].width;
            this.documentService.createDocumentStore_values.document_height = this.documentData[0].height;
            this.layerDatas = layerDetails.annotations;
            // this.filterMarkedAnnotation();
            var img = document.createElement("img");

            img.onload = () => {
              this.realWidth = img.width;
              this.realHeight = img.height;
              this.documentService.createDocumentStore_values.document_width = img.width;
              this.documentService.createDocumentStore_values.document_height = img.height;
              this.panzoomImgSetup();
              this.layerDatas = layerDetails.annotations;
              // this.filterMarkedAnnotation();
              this.getFormList();
              this.pdfPageNumber = this.documentData[0].page_number;
            };
            img.onerror = () => {
              this.show = false;
              const dialogOpen = new MatDialogConfig();
              dialogOpen.disableClose = true;
              this.dialogbox.open(LoaderComponent, {
                width: "420px"
              });
            };
          } else {
            this.pngFormat = true;
            this.pdfPageNumber = this.documentData[0].page_number;
            this.cdRef.detectChanges();
            this.imgUrl = environment.APIBaseUrl + "get_web_singed_file?file=" + this.documentData[0].file_path + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2()
            var img = document.createElement("img");
            img.onload = () => {
              this.realWidth = img.width;
              this.realHeight = img.height;
              this.documentService.createDocumentStore_values.document_width = img.width;
              this.documentService.createDocumentStore_values.document_height = img.height;
              this.panzoomImgSetup();
              this.layerDatas = layerDetails.annotations;
              // this.filterMarkedAnnotation();
              this.getFormList();
              this.pdfPageNumber = this.documentData[0].page_number;
            };
            img.onerror = () => {
              this.show = false;
              const dialogOpen = new MatDialogConfig();
              dialogOpen.disableClose = true;
              this.dialogbox.open(LoaderComponent, {
                width: "420px"
              });
            };
            img.src = this.imgUrl;
          }
        }
        else {
          this.show = false;
          const dialogOpen = new MatDialogConfig();
          dialogOpen.disableClose = true;
          this.dialogbox.open(LoaderComponent, {
            width: "420px"
          });
        }
      });
  }

  panzoomImgSetup() {
    let pdfImg1 = document.getElementById("pdfImg");

    this.panzoomController = panzoom(pdfImg1, {
      initialZoom: 1,
      onDoubleClick: (e) => {
        // `e` - is current double click event.
        return true; // tells the library to not preventDefault, and not stop propagation
      }
    });
    this.panzoomController.on('panstart', (e) => {

      // Note: e === instance.
    });

    this.panzoomController.on('pan', (e) => {

    });

    this.panzoomController.on('panend', (e) => {

    });
    this.panzoomController.on('zoom', (e) => {

    });
    this.panzoomController.on('transform', (e) => {
      // This event will be called along with events above.

    });
  }


  async filterMarkedAnnotation() {
    for (let k = 0; k < this.layerDatas.length; k++) {
      if (this.layerDatas[k].annotation_id == this.annotationid) {
        this.selectAnnotation = this.layerDatas[k];
        // svg annotation drawing
        await this.svg_annotation_drawing_image();
        console.log(this.selectAnnotation);
        if (this.selectAnnotation.annotation_forms.length > 0 && this.selectAnnotation.annotation_forms != undefined) {
          this.formsCount = this.selectAnnotation.annotation_forms.length;

            // convert special characters
            let get_db_data =  this.selectAnnotation;
            get_db_data.annotation_name = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_name);
            get_db_data.annotation_label = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_label);
            get_db_data.annotation_tags = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_tags);
            if(get_db_data.annotation_id==11){
              get_db_data.annotation_data = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_data);
            }
            if (get_db_data.annotation_forms.length > 0) {
              for (let fi = 0; fi < get_db_data.annotation_forms.length; fi++) {
                get_db_data.annotation_forms[fi].form_name = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_forms[fi].form_name);
                let get_cur_formdata = get_db_data.annotation_forms[fi].form_data;
                if (Array.isArray(get_cur_formdata)) {
                  if (get_cur_formdata.length > 0) {
                    get_db_data.annotation_forms[fi].form_data = this.dataService4.formfieldviewcharacter(get_cur_formdata, 'annotationgetformview');
                  }
                }
                if(get_db_data.annotation_forms[fi].is_extend == true){
                if(get_db_data.annotation_forms[fi].hasOwnProperty('ext_form_data')){
                  if(get_db_data.annotation_forms[fi].ext_form_data != null){
                    let get_cur_ext_formdata = get_db_data.annotation_forms[fi].ext_form_data;
                    if (Array.isArray(get_cur_ext_formdata)) {
                      if (get_cur_ext_formdata.length > 0) {
                        get_db_data.annotation_forms[fi].ext_form_data = this.dataService4.formfieldviewcharacter(get_cur_ext_formdata, 'annotationgetformview');
                      }
                    }else{
                      get_cur_ext_formdata = JSON.parse(get_cur_ext_formdata);
                      if (get_cur_ext_formdata.length > 0) {
                        get_db_data.annotation_forms[fi].ext_form_data = this.dataService4.formfieldviewcharacter(get_cur_ext_formdata, 'annotationgetformview');
                      }
                    }
                  }
                }
              }
              }
            }
            if (get_db_data.annotation_links.length > 0) {
              if (Array.isArray(get_db_data.annotation_links)) {
                for(let li=0;li<get_db_data.annotation_links.length;li++){
                  get_db_data.annotation_links[li].link_type = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_links[li].link_type);
                  if(get_db_data.annotation_links[li].hasOwnProperty('location')){
                    get_db_data.annotation_links[li].location = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_links[li].location);
                  }
                }
              }
            }
            if (get_db_data.annotation_media.length > 0) {
              if (Array.isArray(get_db_data.annotation_media)) {
                for(let li=0;li<get_db_data.annotation_media.length;li++){
                  get_db_data.annotation_media[li].media_name = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_media[li].media_name);
                  get_db_data.annotation_media[li].media_comment = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_media[li].media_comment);
                  if(get_db_data.annotation_media[li].hasOwnProperty("media_tags")){
                    get_db_data.annotation_media[li].media_tags = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_media[li].media_tags);
                  }
                }
              }
            }

            this.selectAnnotation = get_db_data;

          for (let j = 0; j < this.selectAnnotation.annotation_forms.length; j++) {

            //Filter the form builder form for the annotation form id. 
            let sortedForms = this.selectAnnotation.annotation_forms.sort((a, b) => b.form_name.localeCompare(a.form_name))
            //sort((a, b) => (a.last_updated_date != undefined ? a.last_updated_date : a.created_date).localeCompare(
            // b.last_updated_date != undefined ? b.last_updated_date : b.created_date));
            this.currentFormId = sortedForms[sortedForms.length - 1].form_id;
            this.currentFormName = sortedForms[sortedForms.length - 1].form_name;
            this.currentFormHiddenStatus = JSON.parse(sortedForms[sortedForms.length - 1].is_hidden);
           

            this.modelFieldsForm = this.selectAnnotation.annotation_forms.filter((ele => ele.form_id == sortedForms[sortedForms.length - 1].form_id))
            //taking the defult form details from Form builder for the current form
            var editedForm1 = this.formList.filter((ele => ele.form_id == this.currentFormId))
            var editedForm = _.cloneDeep(editedForm1);

            var newFormDataFelds;
            console.log(this.formList)
            console.log(editedForm)
            console.log(this.modelFieldsForm)

            var check_html_form = this.selectAnnotation.annotation_forms[j].form_data.filter(v => v.element_type === "uti-entry-field")
            console.log(check_html_form)
            let html_field_index = this.selectAnnotation.annotation_forms[j].form_data.findIndex(x => x.element_type === "uti-entry-field")
            console.log(html_field_index);
            let wmata_form=this.selectAnnotation.annotation_forms[j].form_data.filter(v => v.element_type === "uti-entry-field-WMATA")
            let wmata_form_index=this.selectAnnotation.annotation_forms[j].form_data.findIndex(v => v.element_type === "uti-entry-field-WMATA")
            if(wmata_form.length > 0 && wmata_form[0].element_data.hasOwnProperty('default_values') && wmata_form[0].element_data.default_values != undefined && wmata_form[0].element_data.default_values != ""){
              let get_default_value = wmata_form[0].element_data.default_values;
              let get_element_fields = wmata_form[0].element_data['fields'];
              var UI_data=this.UTIEntry_field_Wmata(get_element_fields, get_default_value);
              this.selectAnnotation.annotation_forms[j].form_data[wmata_form_index].element_data.default_values=UI_data;        
            }
            let timber_form=this.selectAnnotation.annotation_forms[j].form_data.filter(v => v.element_type === "uti-entry-field-TIMBER");
            let timber_form_index=this.selectAnnotation.annotation_forms[j].form_data.findIndex(v => v.element_type === "uti-entry-field-TIMBER")
            if(timber_form.length > 0 && timber_form[0].element_data.hasOwnProperty('default_values') && timber_form[0].element_data.default_values != undefined && timber_form[0].element_data.default_values != ""){
              let get_default_value1 = timber_form[0].element_data.default_values;
              let get_element_fields1 = timber_form[0].element_data['fields'];
              UI_data=JSON.stringify(get_default_value1);
              this.selectAnnotation.annotation_forms[j].form_data[timber_form_index].element_data.default_values=UI_data;        
            }
            //if HTML form - manipulate - default value for display
            if (check_html_form.length > 0) {
              var db_element_data = check_html_form[0].element_data;

              if (db_element_data.default_values == undefined) {
                db_element_data.default_value = ''
              }
              else {
                console.log(db_element_data)
                //unrated_qty=db_element_data.unrated_quantity

                // if(unrated_qty==undefined||unrated_qty=="undefined"){
                //     unrated_qty=''
                // }
                // if(db_element_type=="number"){
                //     if(db_element_data.label_text=='Total Element Quantity'){
                //         if(db_element_data.default_value==undefined || db_element_data.default_value==''){
                //             db_element_data.default_value=0
                //         }
                //         total_element_quantity='"'+db_element_data.default_value+'"'
                //     }
                // }
                console.log(db_element_data.default_values)
                var html_form = db_element_data.default_values
                var final_ut_json = []
                //let fields = formsfieldsarry
                if (html_form.length > 0) {

                  for (var m = 0; m < html_form.length; m++) {
                    //console.log(html_form[m])
                    var json_key = html_form[m]
                    let fields = db_element_data.fields
                    //console.log(fields)
                    var json = {}
                    for (var key in fields) {
                      let field_value = fields[key]

                      //console.log(field_value);
                      var final_keys
                      console.log(field_value.element_name)
                      if (field_value.element_name == 'CS') {
                        final_keys = 'cs'
                      } else if (field_value.element_name == 'Quantity') {
                        final_keys = 'qty'
                      }
                      else if (field_value.element_name == 'Not Counted?') {
                        final_keys = 'not-counted'
                      } else {
                        final_keys = 'code'
                      }
                      if (json_key[field_value.element_uuid] != undefined) {

                        // if(field_value.element_name=='Condition code'){
                        //     final_keys='code'
                        // }
                        json[final_keys] = json_key[field_value.element_uuid]
                        if (field_value.element_type == 'dropdown' || field_value.element_type == 'single_choice') {
                          console.log(json_key[field_value.element_data.options])
                          var data = field_value.element_data.options.filter(form_datas => form_datas.element_uuid === json_key[field_value.element_uuid]);
                          console.log(data)
                          var final_name
                          if (data.length > 0) {
                            final_name = data[0].name
                          }
                          json[final_keys] = final_name
                        } else if (field_value.element_type == 'multiple_choice') {
                          json[final_keys] = true
                        }
                      }
                      else {
                        json[final_keys] = ''
                        if (field_value.element_type == 'multiple_choice') {
                          json[final_keys] = false
                        }
                      }

                    }//for key in fields 
                    // json.unrated_quantity = 100
                    final_ut_json.push(json)
                    console.log(final_ut_json)
                    ///var data =fields.filter(annot => annot.element_uuid === key);
                  }//for m
                  console.log(JSON.stringify(final_ut_json))
                  this.selectAnnotation.annotation_forms[j].form_data[html_field_index].element_data.default_value = JSON.stringify(final_ut_json)
                }//if html form fields 

              }//else default value present

              //process.exit();
              // console.log("HTML Form    :  "+JSON.stringify(final_form_details))
              // if(final_form_details=="undefined" || final_form_details==undefined || final_form_details ==""){
              //     final_form_details = ''
              // }
              //process.exit();


            } //html  form 

            if(this.selectAnnotation.annotation_forms[j].is_extend == true){
             if(this.selectAnnotation.annotation_forms[j].ext_form_data != null){
               if(typeof this.selectAnnotation.annotation_forms[j].ext_form_data === 'string'){
                this.selectAnnotation.annotation_forms[j].ext_form_data = JSON.parse(this.selectAnnotation.annotation_forms[j].ext_form_data)
               }
             }
            }

            let merge_cell ;
            //Processing user conditions for the annotation mapped form 
           if(this.selectAnnotation.annotation_forms[j].is_extend && this.selectAnnotation.annotation_forms[j].ext_form_data != null){
              merge_cell = [...this.selectAnnotation.annotation_forms[j].form_data , ...this.selectAnnotation.annotation_forms[j].ext_form_data]
           }else{
             merge_cell = this.selectAnnotation.annotation_forms[j].form_data;
           }
            let processDataAf = this.process_use_conditions(merge_cell);
            var emptycell = processDataAf.filter(data=>data.is_hidden=="1");
            if (emptycell.length > 0) {
              for (var i = 0; i < emptycell.length; i++) {
                var referenceidss = emptycell[i].element_data.reference_id;
                var findingelementid = this.datas.filter(data => data.element_uuid == referenceidss);
                if (findingelementid.length > 0 && findingelementid[0].element_type == "empty_cell") {
                  findingelementid[0].is_hidden = "1";
                }
              }
            }
            let dummy_model = [];
            let attribute_model = [];
            if(this.selectAnnotation.annotation_forms[j].is_extend==true)
            { if(this.selectAnnotation.annotation_forms[j].ext_form_data != null){
              for(let i = 0; i < this.selectAnnotation.annotation_forms[j].ext_form_data.length ; i++){
                let filter_element = processDataAf.filter(data=> data.element_uuid == this.selectAnnotation.annotation_forms[j].ext_form_data[i].element_uuid);
                if(filter_element != null && filter_element.length > 0){
                dummy_model.push(filter_element[0]);
                }
              }
            }
              this.selectAnnotation.annotation_forms[j].ext_form_data = _.cloneDeep(dummy_model);
              for(let i = 0; i < this.selectAnnotation.annotation_forms[j].form_data.length ; i++){
                let filter_element = processDataAf.filter(data=> data.element_uuid == this.selectAnnotation.annotation_forms[j].form_data[i].element_uuid);
                if(filter_element != null && filter_element.length > 0){
                  attribute_model.push(filter_element[0]);
                }
              }
              this.selectAnnotation.annotation_forms[j].form_data = _.cloneDeep(attribute_model);
            }
            else
            {
              this.selectAnnotation.annotation_forms[j].form_data = processDataAf;
            }

          }
         this.FormulaCalc(this.selectAnnotation.annotation_forms);

        }
        if (this.selectAnnotation.annotation_media.length > 0 && this.selectAnnotation.annotation_media != undefined) {
          this.mediaAccess = true;
          let mediaRemoveDeleted = this.selectAnnotation.annotation_media.filter((MData) => {
            if (MData.is_removed == false || MData.is_removed == "false" || MData.is_removed == 0 || MData.is_removed == "0") {
              return MData;
            }
          })
          this.selectAnnotation.annotation_media = mediaRemoveDeleted;
          let tempstubcount = this.selectAnnotation.annotation_media.filter((data) => {
            return data.media_url == '' && (data.is_removed == false || data.is_removed == "false" || data.is_removed == 0 || data.is_removed == "0");
          });
          this.stubCount = tempstubcount.length;
          let tempphotocount = this.selectAnnotation.annotation_media.filter((data) => {
            return data.media_url != '' && (data.is_removed == false || data.is_removed == "false" || data.is_removed == 0 || data.is_removed == "0");
          });
          this.photoCount = tempphotocount.length;
        }
        if (this.selectAnnotation.annotation_tags.length > 0 && this.selectAnnotation.annotation_tags != undefined) {
          this.tagAccess = true;
        }
        if (this.selectAnnotation.annotation_links.length > 0 && this.selectAnnotation.annotation_links != undefined) {
          this.linkAccess = true;
          let linksRemoveDeleted = this.selectAnnotation.annotation_links.filter((LData) => {
            if (LData.is_removed == false || LData.is_removed == "false" || LData.is_removed == 0 || LData.is_removed == "0") {
              return LData;
            }
          })
          this.selectAnnotation.annotation_links = linksRemoveDeleted;
          this.linkCount = this.selectAnnotation.annotation_links.length;
        }
        this.createdDate = this.datePipe.transform(this.selectAnnotation.created_date, "MM/dd/yyyy HH:mm a");
        this.modifiedDate = this.datePipe.transform(this.selectAnnotation.last_updated_date, "MM/dd/yyyy HH:mm a");
        console.log(this.createdDate, this.modifiedDate);
        this.pdfPageNumber = this.documentData[0].page_number;
        if (this.selectAnnotation.annotation_media.length > 0) {
          for (let i = 0; i < this.selectAnnotation.annotation_media.length; i++) {
            if (this.currentIndex == i) {
              this.photoName = this.selectAnnotation.annotation_media[i].media_name;
            }
          }
        }
      }
    }
  }
  
  UTIEntry_field_Wmata(fields, defaultvalues) {
    // make json field wise showing array
    let make_final_temp_array = [];
    let sample_object = { "location": "", "decibels": "", "previouscondition": "", "flagforrReview": "", "Condition": "", "Comment": "" };
    for (let j = 0; j < defaultvalues.length; j++) {
      sample_object.location = "";
      sample_object.decibels = "";
      sample_object.previouscondition = "";
      sample_object.flagforrReview = "";
      sample_object.Condition = "";
      sample_object.Comment = "";
      for (let key in defaultvalues[j]) {
        for (let k = 0; k < fields.length; k++) {
          if (fields[k].element_uuid == key) {
            switch (k) {
              case 0:
                defaultvalues[j][key] = this.dataService4.changeSpecialtoKeyFormat(defaultvalues[j][key]);
                sample_object.location = defaultvalues[j][key];
                break;
              case 1:
                defaultvalues[j][key] = this.dataService4.changeSpecialtoKeyFormat(defaultvalues[j][key]);
                sample_object.decibels = defaultvalues[j][key];
                break;
              case 2:
                defaultvalues[j][key] = this.dataService4.changeSpecialtoKeyFormat(defaultvalues[j][key]);
                sample_object.previouscondition = defaultvalues[j][key];
                break;
              case 3:
                defaultvalues[j][key] = this.dataService4.changeSpecialtoKeyFormat(defaultvalues[j][key]);
                sample_object.flagforrReview = defaultvalues[j][key];
                break;
              case 4:
                let get_field_option = fields[k].element_data.options;
                let find_name_index = get_field_option.findIndex((uuid) => uuid.element_uuid == defaultvalues[j][key]);
                if (find_name_index > -1) {
                  sample_object.Condition = get_field_option[find_name_index].name;
                }
                else {
                  sample_object.Condition = defaultvalues[j][key];
                }
                break;
              case 5:
                defaultvalues[j][key] = this.dataService4.changeSpecialtoKeyFormat(defaultvalues[j][key]);
                sample_object.Comment = defaultvalues[j][key];
                break;
            }
          }
        }
      }
      let clone_sample_object = _.cloneDeep(sample_object);
      make_final_temp_array.push(clone_sample_object);
    }
    this.finalArray2 = make_final_temp_array;
    this.display_String=JSON.stringify(this.finalArray2);
    return this.display_String;
;
  }
  
  process_use_conditions(formData) {
    this.datas = formData;
    this.attributess = formData;
    this.defaultArrray = _.cloneDeep(formData);

    for (let i = 0; i < this.datas.length; i++) {
      this.editIndex = i;
      //taking the data if any conditions available
      if(this.datas[i].element_data.use_conditions == true){
        this.condition_field_name = this.datas[i].element_data.if_condition;
        this.current_if_value = this.datas[i].element_data.if_value;
        this.current_if_do = this.datas[i].element_data.if_do;
        this.current_if_state = this.datas[i].element_data.if_state;
      }else{
        this.condition_field_name = ""
        this.current_if_value = ""
        this.current_if_do = ""
        this.current_if_state = ""
      }
      if (this.condition_field_name != "") {

        //taking the current field attached with the use condition
        let UCitem = this.attributess.filter((ele => ele.element_uuid == this.condition_field_name))
        if (UCitem.length > 0) {
          if (UCitem[0].element_data.default_value == null) {
            UCitem[0].element_data.default_value = ""
          }
        } else {
          this.condition_field_name = ""
        }

        if (UCitem.length > 0 && this.current_if_state == 'is equal to') {
          if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "dropdown") {
            //if (this.current_if_value == UCitem[0].element_data.default_value) {
            //if the use condition field is a multi choice 
            let multyOpt = UCitem[0].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
            if (multyOpt.length > 0) {
              if (this.current_if_do == "hide") {
                if (multyOpt.length > 0 && multyOpt[0].default == true) {
                  this.datas[i].is_hidden = "1";
                } else {
                  this.datas[i].is_hidden = 0;
                }
              }
              else {

                if (multyOpt.length > 0 && multyOpt[0].default == false) {
                  this.datas[i].is_hidden = "1";
                } else {
                  this.datas[i].is_hidden = 0;
                }
              }
            }
          } else {
            if (this.current_if_value == UCitem[0].element_data.default_value) {
              if (this.current_if_do == "hide") {
                this.datas[i].is_hidden = "1";
              }
              else {
                this.datas[i].is_hidden = 0;
              }
            }
            else {
              if (this.current_if_do == "hide") {
                this.datas[i].is_hidden = 0;
              }
              else {
                this.datas[i].is_hidden = "1";
              }
            }
          }
        }
        else if (UCitem.length > 0 && this.current_if_state == 'is not equal to')//  Not equal to 
        {
          if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "dropdown") {
            //if (this.current_if_value == UCitem[0].element_data.default_value) {
            let multyOpt = UCitem[0].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
            if (this.current_if_do == "hide") {
              if (multyOpt.length > 0 && multyOpt[0].default != true) {
                this.datas[i].is_hidden = "1";
              } else {
                this.datas[i].is_hidden = 0;
              }
            }
            else {
              if (multyOpt.length > 0 && multyOpt[0].default != false) {
                this.datas[i].is_hidden = "1";
              } else {
                this.datas[i].is_hidden = 0;
              }
            }
          } else {
            if (this.current_if_value != UCitem[0].element_data.default_value) {
              if (this.current_if_do == "hide") {
                this.datas[i].is_hidden = "1";
              }
              else {
                this.datas[i].is_hidden = 0;
              }
            } else {
              if (this.current_if_do == "hide") {
                this.datas[i].is_hidden = 0;
              }
              else {
                this.datas[i].is_hidden = "1";
              }
            }
          }
        }
        else if (UCitem.length > 0 && this.current_if_state == 'is filled') //  Is filled  
        {
          //checing the processing fields contains single choice, mutichoice check box ,drop down
          if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown' || this.datas[i].element_type == 'checkbox') {
            //taking the current option attached with the field
            let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
            let defaultOptions = this.defaultArrray[i].element_data.options.filter((ele => ele.default == true))
            //taking the defult value index
            this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)
            let redioIndex = this.datas[i].element_data.options.findIndex((ele => ele.element_uuid == this.current_if_value))
            if (UCitem[0].element_type == 'multiple_choice') {
              let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
              UCitem12[0].default = false;
              this.datas[i].element_data.default_value = ""
              if (OptionSelected.length > 0) {
                this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
                UCitem12[0].default = true;
              }
            } else {
              if (UCitem[0].element_type == 'address') {
                if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
                  this.datas[i].element_data.options.forEach(element => {
                    element.default = false;
                  });
                  this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
                  UCitem12[0].default = true;
                } else {
                  if (this.activeIndex != -1) {
                    this.datas[i].element_data.options.forEach(element => {
                      element.default = false;
                    });
                    this.datas[i].element_data.options[this.activeIndex].default = true
                  } else {
                    this.datas[i].element_data.options.forEach(element => {
                      element.default = false;
                    });
                  }
                }
              } else {
                // UCitem12[0].default = false;
                // this.datas[i].element_data.default_value = null
                if ((UCitem[0].element_data.default_value != null) && (UCitem[0].element_data.default_value != "")) {
                  this.datas[i].element_data.options.forEach(element => {
                    element.default = false;
                  });
                  this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
                  UCitem12[0].default = true;
                } else {
                  if (this.activeIndex != -1) {
                    this.datas[i].element_data.options.forEach(element => {
                      element.default = false;
                    });
                    this.datas[i].element_data.options[this.activeIndex].default = true
                  } else {
                    this.datas[i].element_data.options.forEach(element => {
                      element.default = false;
                    });
                  }
                }
              }
            }
          }
          else {
            //checking the use condition field  contains single choice, mutichoice check box ,drop down
            if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
              let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
              this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
              if (OptionSelected.length > 0) {
                this.datas[i].element_data.default_value = this.current_if_value;
              }
            }
            else {
              this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
              if (UCitem[0].element_type == 'address') {
                if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
                  this.datas[i].element_data.default_value = this.current_if_value;
                }
              } else {
                if (UCitem[0].element_data.default_value != null && UCitem[0].element_data.default_value != "") {
                  this.datas[i].element_data.default_value = this.current_if_value;
                }
              }
            }

          }
        }
        else if (UCitem.length > 0 && this.current_if_state == 'is empty') // Is empty
        {
          //checing the processing fields contains single choice, mutichoice check box ,drop down
          if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown') {
            let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
            this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)

            if (UCitem[0].element_type == 'multiple_choice') {
              let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
              if (OptionSelected.length == 0) {
                UCitem12[0].default = true;
              }
            } else {
              if (UCitem[0].element_type == 'address') {
                if (UCitem[0].element_data.city == "" || UCitem[0].element_data.street_address1 == "" || UCitem[0].element_data.state == "" || UCitem[0].element_data.zip == "" || UCitem[0].element_data.street_address2 == "") {
                  this.datas[i].element_data.options.forEach(element => {
                    element.default = false;
                  });
                  UCitem12[0].default = true;
                } else {
                  if (this.activeIndex != -1) {
                    this.datas[i].element_data.options.forEach(element => {
                      element.default = false;
                    });
                    this.datas[i].element_data.options[this.activeIndex].default = true
                  } else {
                    this.datas[i].element_data.options.forEach(element => {
                      element.default = false;
                    });
                  }
                }
              } else {
                if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
                  this.datas[i].element_data.options.forEach(element => {
                    element.default = false;
                  });
                  UCitem12[0].default = true;
                } else {
                  if (this.activeIndex != -1) {
                    this.datas[i].element_data.options.forEach(element => {
                      element.default = false;
                    });
                    this.datas[i].element_data.options[this.activeIndex].default = true
                  } else {
                    this.datas[i].element_data.options.forEach(element => {
                      element.default = false;
                    });
                  }
                }
              }
            }
          }
          else {
            //checing the use condition  fields contains single choice, mutichoice check box ,drop down
            if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
              let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
              this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
              if (OptionSelected.length == 0) {
                this.datas[i].element_data.default_value = this.current_if_value;
              }
            }
            else {
              this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
              if (UCitem[0].element_type == 'address') {
                if (UCitem[0].element_data.city == "" && UCitem[0].element_data.street_address1 == "" && UCitem[0].element_data.state == "" && UCitem[0].element_data.zip == "" && UCitem[0].element_data.street_address2 == "") {
                  this.datas[i].element_data.default_value = this.current_if_value;
                }
              } else {
                if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
                  this.datas[i].element_data.default_value = this.current_if_value;
                }
              }
            }
          }
        } else { }
        //this.model.attributes = localdata;
      }
    } // for close 
    var localdata = [];
        localdata = this.datas;
        this.datas = [];
        this.datas = localdata;
    return this.datas;
  }

  FormulaCalc(formscount) {
    var DummyField;
    this.formscount1 = formscount;
    for (var i1 = 0; i1 < this.formscount1.length; i1++) {
      var fieldslist = this.formscount1[i1].form_data
      var fieldslistformid = this.formscount1[i1].form_id
      var FormulaFieldfind = fieldslist.filter(ele => ele.element_type == "calculation");
      var calculationValueUpdate = fieldslist.filter(ele => ele.element_type == "calculation");
      //var calculationValueUpdate = this.attributess.filter(ele => ele.element_type == "calculation");
      if (FormulaFieldfind.length > 0) {
        // if (FormulaFieldfind[0].element_data.calculation_value == "") { } else {
        var i = 0;
        FormulaFieldfind.forEach(calc => {

          if (FormulaFieldfind[i].element_data['calculation_value'] != "" && FormulaFieldfind[i].element_data['calculation_value'] != undefined) {

            if (FormulaFieldfind[i].element_data['calculation_value'].includes("AVG")) {

              // console.log(this.formscount1[i].form_name)
              this.modelFieldsForm = this.selectAnnotation.annotation_forms.filter((ele => ele.form_id == fieldslistformid))

              this.AvarageCalculation(calc, FormulaFieldfind[i], calculationValueUpdate[i])
            } else {
              var CalcValue = calc.element_data.calculation_value;
              var matches = [];
              var pattern = /\[(.*?)\]/g;
              var match;
              while ((match = pattern.exec(CalcValue)) != null) {
                matches.push(match[1]);
              }
              this.DummyField = calc.element_data.calculation_value;
              calc.element_data.calculation = calc.element_data.calculation_value
              matches.forEach(element => {

                //if (element == key) {
                var FieldFind = fieldslist.filter(ele => ele.element_uuid == element);
                if(FieldFind.length > 0){
                  this.FieldResult = FieldFind[0];
                  this.DummyField = this.DummyField.replace(element, FieldFind[0].element_data.label_text)
                  if (FieldFind[0].element_type == "single_choice" || FieldFind[0].element_type == "dropdown") {
                    var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
                    if (CalculatioField1.length > 0) {
                      if (CalculatioField1[0].calculated_value != "") {
                        if (calc.element_data.calculation.includes('[' + element + ']')) {
                          calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", CalculatioField1[0].calculated_value)
                        } else {
                          calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", CalculatioField1[0].calculated_value)
                        }
                      }
                      this.DummyField = calc.element_data.calculation
                    } else {
                      calc.element_data.calculation = this.DummyField
                    }
                  } else if (FieldFind[0].element_type == "multiple_choice" || FieldFind[0].element_type == "checkbox") {
                    var calculatedalltotal = 0;
                    var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
                    if (CalculatioField1.length > 0) {
                      CalculatioField1.forEach(ele => {
                        if (ele.calculated_value != "") {
                          calculatedalltotal = calculatedalltotal + Number(ele.calculated_value)
                        }
                      });
                      if (calculatedalltotal != 0) {
                        if (calc.element_data.calculation.includes('[' + element + ']')) {
                          calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", calculatedalltotal)
                        } else {
                          calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", calculatedalltotal)
                        }
                      }
                      this.DummyField = calc.element_data.calculation
                    } else {
                      calc.element_data.calculation = this.DummyField
                    }
                  }
                  //////////////////
                  else if (FieldFind[0].element_type == "calculation") {
                    if (FieldFind[0].element_data.calculation != "" && FieldFind[0].element_data.calculation != undefined) {
                      if (FieldFind[0].element_data.calculation.includes('[')) {
                        calc.element_data.calculation = this.DummyField
                      } else if (calc.element_data.calculation.includes('[' + element + ']')) {
                        calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", FieldFind[0].element_data.calculation)
                      } else {
                        calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", FieldFind[0].element_data.calculation)
                      }
                    }
                    if (this.FieldResult.element_data.calculation == "" || this.FieldResult.element_data.calculation == undefined) {
                      calc.element_data.calculation = this.DummyField
                    } else {
                      this.DummyField = calc.element_data.calculation
                    }
                  }
                  ///////////////////
                  else {
                    if (FieldFind[0].element_data.default_value != "" && FieldFind[0].element_data.default_value != null) {
                      if (calc.element_data.calculation.includes('[' + element + ']')) {
                        calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", FieldFind[0].element_data.default_value)
                      } else {
                        calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", FieldFind[0].element_data.default_value)
                      }
                    }
                    if (this.FieldResult.element_data.default_value == "" || this.FieldResult.element_data.default_value == undefined) {
                      calc.element_data.calculation = this.DummyField
                    } else {
                      this.DummyField = calc.element_data.calculation
                    }
                  }
                }
                //}
              })
              if (calc.element_data.calculation.includes('[')) {
                // calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation;
                FormulaFieldfind[i].element_data.calculation = calc.element_data.calculation;
              } else {

                if (calc.element_data.calculation.includes('.rounded()')) {
                  calc.element_data.calculation = calc.element_data.calculation.split(".rounded()").join("")

                  //calculationValueUpdate[i].element_data.calculation = eval(
                  FormulaFieldfind[i].element_data.calculation = eval(
                    calc.element_data.calculation
                  );
                  FormulaFieldfind[i].element_data.calculation = FormulaFieldfind[i].element_data.calculation != "" && FormulaFieldfind[i].element_data.calculation > 1 ? Math.round(FormulaFieldfind[i].element_data.calculation) : 1

                  //Decimal to 1, if default value is empty
                  FormulaFieldfind[i].element_data.calculation = FormulaFieldfind[i].element_data.default_value == "" ? FormulaFieldfind[i].element_data.calculation.toFixed(Number(1)) : FormulaFieldfind[i].element_data.calculation.toFixed(Number(FormulaFieldfind[i].element_data.default_value));

                  //FormulaFieldfind[i].element_data.calculation = FormulaFieldfind[i].element_data.calculation.toFixed(Number(FormulaFieldfind[i].element_data.default_value));
                } else {
                  FormulaFieldfind[i].element_data.calculation = eval(
                    calc.element_data.calculation
                  );
                  //Decimal to 1, if default value is empty
                  FormulaFieldfind[i].element_data.calculation = FormulaFieldfind[i].element_data.default_value == "" ? FormulaFieldfind[i].element_data.calculation.toFixed(Number(1)) : FormulaFieldfind[i].element_data.calculation.toFixed(Number(FormulaFieldfind[i].element_data.default_value));

                  //FormulaFieldfind[i].element_data.calculation = FormulaFieldfind[i].element_data.calculation.toFixed(Number(FormulaFieldfind[i].element_data.default_value));


                  let confirmedValue = calc.element_data.calculation;

                  let decimalCheck = Math.abs(confirmedValue);
                }
              }
              //this.FormulaCalc1();
            }
          }
          i++;
        });
        //}

      }
    }//forms count 
  }//  calculation

  //calcuating the avarage for calculation field
  AvarageCalculation(calc, FormulaFieldfind, calculationValueUpdate) {
    if (FormulaFieldfind.element_data['calculation_value'] != "" && FormulaFieldfind.element_data['calculation_value'] != undefined) {
      var CalcValue = calc.element_data.calculation_value;
      var matches = [];
      var pattern = /\[(.*?)\]/g;
      var match;
      while ((match = pattern.exec(CalcValue)) != null) {
        matches.push(match[1]);
      }
      this.DummyField = calc.element_data.calculation_value;
      calc.element_data.calculation = calc.element_data.calculation_value
      var count = 0;
      var value = 0
      calc.element_data.calculation = ""
      matches.forEach(element => {
        //if (element == key) {

        console.log(this.modelFieldsForm[0]['form_data'])
        var FieldFind = this.modelFieldsForm[0]['form_data'].filter(ele => ele["element_uuid"] == element);
        if (FieldFind.length > 0) {
          //if (FieldFind[0].element_data.default_value != "" && FieldFind[0].element_data.default_value != null) {
          if (FieldFind[0].element_type == "single_choice" || FieldFind[0].element_type == "dropdown") {
            var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
            if (CalculatioField1.length > 0) {
              if (CalculatioField1[0].calculated_value != "") {
                value = value + Number(CalculatioField1[0].calculated_value)
                count = count + 1;
              }
            }
          } else if (FieldFind[0].element_type == "multiple_choice" || FieldFind[0].element_type == "checkbox") {
            var calculatedalltotal = 0;
            var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
            if (CalculatioField1.length > 0) {
              CalculatioField1.forEach(ele => {
                if (ele.calculated_value != "") {
                  calculatedalltotal = calculatedalltotal + Number(ele.calculated_value)
                }
              });
              if (calculatedalltotal != 0) {
                value = value + calculatedalltotal
                count = count + 1;
              }
            }
          } else if (FieldFind[0].element_type == "calculation") {
            let varType = typeof(FieldFind[0].element_data["calculation"]) 
            if (FieldFind[0].element_data["calculation"] != "" && FieldFind[0].element_data["calculation"] != undefined) {
              if (varType == "string" && FieldFind[0].element_data["calculation"].includes('[')) {
                //calc.element_data.calculation = this.DummyField
              } else {
                value = value + Number(FieldFind[0].element_data["calculation"])
                count = count + 1;
              }
            }
          }
          else {
            if (FieldFind[0].element_data.default_value != "" && FieldFind[0].element_data.default_value != null) {
              value = value + Number(FieldFind[0].element_data.default_value);
              count = count + 1;
            }
          }
        }
        

        if (value != 0 && count != 0)
          calc.element_data.calculation = value / count;
      })
      if (calc.element_data.calculation == 0) {
        calc.element_data.calculation = ""
      }
      if (calc.element_data.calculation != "") {
        calculationValueUpdate.element_data.calculation = calc.element_data.calculation


        calculationValueUpdate.element_data.calculation = calculationValueUpdate.element_data.default_value == "" ? calculationValueUpdate.element_data.calculation.toFixed(Number(1)) : calculationValueUpdate.element_data.calculation.toFixed(Number(calculationValueUpdate.element_data.default_value));
        let confirmedValue = calc.element_data.calculation;
      } else {
        calculationValueUpdate.element_data.calculation = calc.element_data.calculation
      }
    }
    console.log(calculationValueUpdate)
  }

  //End Average calculation

  svg_annotation_drawing_image() {
    if (!this.selectAnnotation.annotation_id.includes('-scale')) {
        let clone_current_annotation = _.cloneDeep(this.selectAnnotation);
        let getsvg_path = this.documentPage.changesvgpath(clone_current_annotation,'document',true);
        this.annotation_svg_view = getsvg_path;
        // moving the current position start
        this.coordinateX = Number(this.selectAnnotation.initial_position_x);
        this.coordinateY = Number(this.selectAnnotation.initial_position_y);
        if (this.coordinateX < 0 && this.coordinateY < 0) {
          this.coordinateX = -(this.coordinateX);
          this.coordinateY = -(this.coordinateY);
        }
        if(this.coordinateX==0 && this.coordinateY==0){
          let get_shape_width = this.shapeService.getCanvaswidthandHeight(this.selectAnnotation);
          this.coordinateX = get_shape_width.left;
          this.coordinateY = get_shape_width.top;
        }
        let panx = -this.coordinateX + 394;
        let pany = -this.coordinateY + 201;
        if (panx > 0) {
          panx = 0;
        }
        if (pany > 0) {
          pany = 0;
        }
        this.panx = panx;
        this.pany = pany;
        this.startPanx = panx;
        this.startPany = pany;
        this.panzoomController.moveTo(panx, pany);
        // moving the current position end
        this.cdRef.detectChanges();
        let getElement = document.getElementById(clone_current_annotation.annotation_id);
        if(getElement!=null){
          getElement.classList.add('svg-block');
        }
    }
  }

  getshapeDrawingP2P3(getDataP2P3) {
    
    let getData = _.cloneDeep(getDataP2P3);
    getData.initial_position_x = getData.initial_position_x < 0 ? -(Number(getData.initial_position_x)) : Number(getData.initial_position_x);
    getData.initial_position_y = getData.initial_position_y < 0 ? -(Number(getData.initial_position_y)) : Number(getData.initial_position_y);
    var elementId = Number(getData.toolbar_element_id);
    var pdfImg = document.getElementById("pdfImg");
    var newcreatedElement = document.createElement("canvas");
    newcreatedElement.setAttribute("documentCanvas", "1");
    newcreatedElement.className = 'annot_canvas';
    getData.initial_height = Number(getData.initial_height);
    getData.initial_width = Number(getData.initial_width);
    var getHeight;
    var getWidth;
    let linewidthCount = 0;
    if(Number(getData.line_width)<1){
      getData.line_width = 5;
    }
    if (elementId > 11) {
      linewidthCount = Math.round(Number(getData.line_width) / 2);
    }
    else {
      linewidthCount = Math.round(Number(getData.line_width) / 6);
    }
    var shapeStringValueTemp = this.shapeService.getCanvaswidthandHeight(getData);
    getWidth = shapeStringValueTemp.width + 10;
    getHeight = shapeStringValueTemp.height + 10;
    newcreatedElement.style.position = "absolute";
    this.transparentBorder(newcreatedElement);
    newcreatedElement.style.zIndex = "1";

    if (true) {
      var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
      newcreatedElement.setAttribute("id", getData.annotation_id);
      newcreatedElement.setAttribute("width", getWidth);
      newcreatedElement.setAttribute("height", getHeight);
      var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
      newcreatedElement.style.top = Number(this.coordinateY) - 5 + "px";
      newcreatedElement.style.left = Number(this.coordinateX) - 5 + "px";

    }
    pdfImg.appendChild(newcreatedElement);
    this.colorBorder(newcreatedElement);
    let panx = -this.coordinateX + 394;
    let pany = -this.coordinateY + 201;
    if (panx > 0) {
      panx = 0;
    }
    if (pany > 0) {
      pany = 0;
    }
    this.panx = panx;
    this.pany = pany;
    this.startPanx = panx;
    this.startPany = pany;
    this.panzoomController.moveTo(panx, pany);
    this.canvasElement = newcreatedElement.getContext("2d");
    this.canvasElement.beginPath();
    this.canvasElement.globalAlpha = getData.opacity;
    // this.canvasBlurryRemove(newcreatedElement,this.canvasElement);

    if (getStringWidth != undefined) {
      let translateWidth = getStringWidth.width - newcreatedElement.width;
      let translateHeight = getStringWidth.height - newcreatedElement.height;
      let translateX = (translateWidth / 2) + getStringWidth.left;
      let translateY = (translateHeight / 2) + getStringWidth.top;
      let shapeLeft = translateX;
      let shapeTop = translateY;
      newcreatedElement.style.top = shapeTop + "px";
      newcreatedElement.style.left = shapeLeft + "px";

      this.canvasElement.translate(-translateX - 0.5, -translateY - 0.8);
      this.canvasElement.restore();
      if (getData.annotation_label.trim() != "") {
        this.shapeService.mainDrawingLabel(getData, pdfImg, shapeLeft, shapeTop, getWidth, getHeight, true);
      }
    }
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
    let xposition = Number(this.coordinateX);
    let yposition = Number(this.coordinateY);

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
              let actmovex = x;
              let actmovey = y;
              // actmovex = actmovex < 0 ? -(actmovex) : actmovex;
              // actmovey = actmovey < 0 ? -(actmovey) : actmovey;
              this.canvasElement.moveTo(actmovex, actmovey);
              break;
            case "line":
              let actlinex = x;
              let actliney = y;
              // actlinex = actlinex < 0 ? -(actlinex) : actlinex;
              // actliney = actliney < 0 ? -(actliney) : actliney;
              this.canvasElement.lineTo(actlinex, actliney);
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
                w = w;
                h = h;
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse((w / 2) + 2 + ((Number(getData.line_width) / 2) / 2), (h / 2) + 2 + ((Number(getData.line_width) / 2) / 2), w / 2, h / 2, Math.PI * 1, 0, 2 * Math.PI);
              }
              break;
          }
        }
        else if ((hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") && j == 1) {
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
        else if ((hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve") && j == 1) {
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
            let cp1linex = cp1x;
            let cp1liney = cp1y;
            let cp2linex = cp2x;
            let cp2liney = cp2y;
            let cxlinex = cx;
            let cxliney = cy;
            // cp1linex = cp1linex < 0 ? -(cp1linex) : cp1linex;
            // cp1liney = cp1liney < 0 ? -(cp1liney) : cp1liney;
            // cp2linex = cp2linex < 0 ? -(cp2linex) : cp2linex;
            // cp2liney = cp2liney < 0 ? -(cp2liney) : cp2liney;
            // cxlinex = cxlinex < 0 ? -(cxlinex) : cxlinex;
            // cxliney = cxliney < 0 ? -(cxliney) : cxliney;
            this.canvasElement.bezierCurveTo(cp1linex, cp1liney, cp2linex, cp2liney, cxlinex, cxliney);
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
          console.log(rectWidth, rectHeight);
          this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
          let rectlineWidth = this.globalLineWidth(getData.line_width);
          // newcreatedElement.setAttribute('width',(newcreatedElement.width + rectlineWidth).toString());
          // newcreatedElement.setAttribute('height',(newcreatedElement.height + rectlineWidth).toString());
          // newcreatedElement.style.top = this.coordinateY - (rectlineWidth/2) + 'px';
          // newcreatedElement.style.left = this.coordinateX - (rectlineWidth/2) + 'px';
          this.canvasElement.rect(
            ((Number(getData.line_width) / 2) / 2) + 1,
            ((Number(getData.line_width) / 2) / 2) + 1,
            rectWidth,
            rectHeight);
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.checkStrokeColor1(checkFill);
      this.canvasElement.fill();
    }
    if (elementId == 17 || elementId == 18 || elementId == 1) {
      console.log(elementId);
      this.canvasElement.closePath();
    }

    if (elementId <= 11) {
      this.canvasElement.lineWidth = Math.round(Number(getData.line_width) / (6));
    }
    else if (elementId > 11) {
      this.canvasElement.lineWidth = Number(getData.line_width) / (2);
    }
    this.canvasElement.strokeStyle = this.checkStrokeColor1(getData.stroke_color);
    this.canvasElement.stroke();
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
        this.strokeColor = "rgba(0.999999999885,44.999999991,98.0000000025,1)";
        break;
      default:
        this.strokeColor = "rgba(0.999999999885,44.999999991,98.0000000025,1)";
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
        this.fillColor = "rgba(0.999999999885,44.999999991,98.0000000025,1)";
        break;
      default:
        this.fillColor = "rgba(0.999999999885,44.999999991,98.0000000025,1)";
    }
  }

  firstImagePart: boolean = false;

  getIconChange(element) {
    let getValue = element.getAttribute("aria-expanded");
    getValue = !getValue;
    if (getValue) {
      this.firstImagePart = getValue
    }
    else {
      this.firstImagePart = getValue
    }
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


  //Perform calculation 
  getCalculatedValue(value) {
    value = value.toFi
    return value.toFixed(2)
  }

  colorBorder(getElementSelect) {
    getElementSelect.style.backgroundColor = "rgba(0,0,255,0.3)";
    // getElementSelect.style.border = "2px dashed blue";
    getElementSelect.style.backgroundPosition = "0 0, 0 0, 100% 0, 0 100%";
    getElementSelect.style.backgroundSize = "2px 100%, 100% 2px, 2px 100% , 100% 2px";
    getElementSelect.style.backgroundRepeat = "no-repeat";
    getElementSelect.style.backgroundImage = "repeating-linear-gradient(0deg, blue, blue 6px, transparent 6px, transparent 10px), repeating-linear-gradient(90deg, blue, blue 6px, transparent 6px, transparent 10px), repeating-linear-gradient(blue, blue 6px, transparent 6px, transparent 10px), repeating-linear-gradient(270deg, blue, blue 6px, transparent 6px, transparent 10px)";
  }
  transparentBorder(data) {
    data.style.backgroundColor = "transparent";
    // data.style.border = "2px solid transparent";
    data.style.backgroundPosition = "0 0, 0 0, 100% 0, 0 100%";
    data.style.backgroundSize = "3px 100%, 100% 3px, 3px 100% , 100% 3px";
    data.style.backgroundRepeat = "no-repeat";
    data.style.backgroundImage = "repeating-linear-gradient(0deg, transparent, transparent 10px, transparent 10px, transparent 20px), repeating-linear-gradient(90deg, transparent, transparent 10px, transparent 10px, transparent 20px), repeating-linear-gradient(180deg, transparent, transparent 10px, transparent 10px, transparent 20px), repeating-linear-gradient(270deg, transparent, transparent 10px, transparent 10px, transparent 20px)";
  }

  showLinkArrow: boolean = false;

  getAreaExpand(element1) {
    let value = element1.getAttribute("aria-expanded");

    if (value == false) {
      this.showLinkArrow = true;
    }
    else {
      this.showLinkArrow = false;
    }
  }

  openurl(url) {
    window.open(url);
  }

  document(documentName, folderId, page_id) {
    let deactivateFilterToolbar = { allChecked: true, pointsChecked: false, freehandChecked: false, vertexChecked: false, rectangleChecked: false };
    // localStorage.setItem("toolbarFilterItem", JSON.stringify(deactivateFilterToolbar));
    this.encrptdecrpt.setItem("toolbarFilterItem",deactivateFilterToolbar);//security
    // this.router.navigate(["/document/documentview"], {
    //   queryParams: {
    //     project_id: this.documentData[0].project_id,
    //     documentName: documentName,
    //     folderId: folderId,
    //     projectName: this.projectData[0].project_name,
    //     folderlevel: this.documentData[0].folder_level,
    //     pfolderid: this.documentData[0].parent_folder_id,
    //     openLinkWindow: false,
    //   },
    // });
    let queryValue = {
      project_id: this.documentData[0].project_id,
      documentName: documentName,
      folderId: folderId,
      projectName: this.projectData[0].project_name,
      folderlevel: this.documentData[0].folder_level,
      pfolderid: this.documentData[0].parent_folder_id,
      page_id: page_id,
      openLinkWindow: true,
    }
    const tree = this.router.createUrlTree(["/document/documentview"], {
      queryParams: {
        project_id: this.documentData[0].project_id,
        documentName: documentName,
        folderId: folderId,
        projectName: this.projectData[0].project_name,
        folderlevel: this.documentData[0].folder_level,
        pfolderid: this.documentData[0].parent_folder_id,
        page_id: page_id,
        openLinkWindow: true,
      }
    });
    let url = this.urlSerializer.serialize(tree);
    window.open(url);

    // const queryParams = {
    //   project_id: this.documentData[0].project_id,
    //   documentName: documentName,
    //   folderId: folderId,
    //   projectName: this.projectData[0].project_name,
    //   folderlevel: 0,
    //   pfolderid: this.documentData[0].parent_folder_id,
    //   page_id: page_id,
    //   openLinkWindow: true,
    // };
    // const urlTree = this.router.createUrlTree([], {
    //   queryParams: queryParams,
    //   relativeTo: documentview,
    //   skipLocationChange: true
    // });
    // window.open('/#' + urlTree.toString());
  }
  photoName: string = "";
  sendCurrentImage(indexValue) {
    this.currentIndex = indexValue;
    for (let i = 0; i < this.selectAnnotation.annotation_media.length; i++) {
      if (this.currentIndex == i) {
        this.photoName = this.selectAnnotation.annotation_media[i].media_name;
      }
    }
  }

  increaseCurrentIndex() {
    this.currentIndex = this.currentIndex + 1;
    for (let i = 0; i < this.selectAnnotation.annotation_media.length; i++) {
      if (this.currentIndex == i) {
        this.photoName = this.selectAnnotation.annotation_media[i].media_name;
      }
    }
  }

  decreaseCurrentIndex() {
    this.currentIndex = this.currentIndex - 1;
    for (let i = 0; i < this.selectAnnotation.annotation_media.length; i++) {
      if (this.currentIndex == i) {
        this.photoName = this.selectAnnotation.annotation_media[i].media_name;
      }
    }
  }

  downloadImage(url, name, annotationPhotos) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogbox.open(PreviewimagedownloadpopupComponent, {
      width: "380px",
      data: {
        filename: name,
        imageset: annotationPhotos,
        img_url: url
      }
    });
  }

  // getDownloadImage() {
  //   this.imageService.getData('https://picsum.photos/200/300/?random')
  //     .subscribe(
  //       imgData => this.data = imgData,
  //       err => 
  //     );
  // }

  // downloadImage(url){
  //   this.http.get(url, { responseType: 'blob' }).subscribe(val => {
  //     
  //     const url = URL.createObjectURL(val);
  //     downloadUrl(url, 'image.png');
  //     URL.revokeObjectURL(url);
  //   });
  // }



  zoomOut(event) {
    // event.stopPropagation();

    var getImageElement = document.getElementById("pdfImg");
    this.scale *= this.scaleMultiplier;
    getImageElement.style.transform = "scale(" + this.scale + ") translate(" + this.panx + "px," + this.pany + "px)";

    let element = { x: this.panx, y: this.pany, scale: this.scale };
    // this.panzoomController.setTransformOrigin(element);
    // let currentWidthHeight = getImageElement.getBoundingClientRect();
    // this.realHeight = currentWidthHeight.height;
    // this.realWidth = currentWidthHeight.width;
    // 
  }


  zoomOut1(event) {
    event.stopPropagation();
    let getImageContainer = document.getElementById("ImagecontainerView");
    var getImageElement = document.getElementById("pdfImg");
    this.scale *= this.scaleMultiplier;
    this.scale *= this.scaleMultiplier;
    getImageElement.style.transform = "scale(" + this.scale + ")";
    this.cdRef.detectChanges();
    let getImageContainerSize = getImageContainer.getBoundingClientRect();
    let currentWidthHeight = getImageElement.getBoundingClientRect();
    let currentViewX = currentWidthHeight.width;
    let currentViewY = currentWidthHeight.height;
    let centerX = getImageContainerSize.width - currentViewX;
    let centerY = getImageContainerSize.height - currentViewY;
    let panZoomElement = panzoom(document.querySelector('#pdfImg'), {
      initialZoom: this.scale,
    });
    let viewImageDiv = document.getElementById("pdfImg");
    if (centerX > 0) {
      viewImageDiv.style.left = centerX / 2 + 'px';
    }
    else if (centerX <= 0) {
      viewImageDiv.style.left = 5 + 'px';
    }
    if (centerY > 0) {
      viewImageDiv.style.top = centerY / 2 + 'px';
    }
    else if (centerY <= 0) {
      viewImageDiv.style.top = 5 + 'px';
    }
    // panZoomElement.centerOn('pdfImg');
  }

  zoomIn(event) {
    // event.stopPropagation();

    var getImageElement = document.getElementById("pdfImg");
    this.scale /= this.scaleMultiplier;
    getImageElement.style.transform = "scale(" + this.scale + ") translate(" + this.panx + "px," + this.pany + "px)";

    let element = { x: this.panx, y: this.pany, scale: this.scale };
    // this.panzoomController.setTransformOrigin(element);
    // let currentWidthHeight = getImageElement.getBoundingClientRect();
    // this.realHeight = currentWidthHeight.height;
    // this.realWidth = currentWidthHeight.width;
    // 
  }

  zoomIn2(event) {
    event.preventDefault();
    let getcurrent = this.panzoomController.getTransform();
    this.panzoomController.smoothZoom(getcurrent.x, getcurrent.y, 1.25);
  }

  zoomOut2(event) {
    event.preventDefault();
    let getcurrent = this.panzoomController.getTransform();
    this.panzoomController.smoothZoom(getcurrent.x, getcurrent.y, 0.8);
  }

  zoomIn1(event) {
    event.stopPropagation();

    let getImageContainer = document.getElementById("ImagecontainerView");

    var getImageElement = document.getElementById("pdfImg");
    this.scale /= this.scaleMultiplier;
    this.scale /= this.scaleMultiplier;
    getImageElement.style.transform = "scale(" + this.scale + ")";

    this.cdRef.detectChanges();
    let getImageContainerSize = getImageContainer.getBoundingClientRect();

    let currentWidthHeight = getImageElement.getBoundingClientRect();

    let currentViewX = currentWidthHeight.width;
    let currentViewY = currentWidthHeight.height;
    let centerX = getImageContainerSize.width - currentViewX;
    let centerY = getImageContainerSize.height - currentViewY;

    let centerCenter = { x: 0.5, y: 0.5 };
    let panZoomElement = panzoom(document.querySelector('#pdfImg'), {
      initialZoom: this.scale,
      transformOrigin: centerCenter
    });
    let viewImageDiv = document.getElementById("pdfImg");
    if (centerX > 0) {
      viewImageDiv.style.left = centerX / 2 + 'px';
    }
    else if (centerX <= 0) {
      viewImageDiv.style.left = 5 + 'px';
    }
    if (centerY > 0) {
      viewImageDiv.style.top = centerY / 2 + 'px';
    }
    else if (centerY <= 0) {
      viewImageDiv.style.top = 5 + 'px';
    }
    viewImageDiv.style.transition = "all 1s ease";
    // panZoomElement.centerOn('pdfImg');
  }

  actualSize(event) {
    event.stopPropagation();

    var getImageElement = document.getElementById("pdfImg");
    this.scale = 1;
    getImageElement.style.transform = "scale(" + this.scale + ")";

    this.panzoomController.moveTo(this.startPanx, this.startPany)
    this.panx = this.startPanx;
    this.pany = this.startPany;
    // let currentWidthHeight = getImageElement.getBoundingClientRect();
    // this.realHeight = currentWidthHeight.height;
    // this.realWidth = currentWidthHeight.width;
    // 
  }

  getActiveLayerId() {
    var canvasArea = document.querySelectorAll("canvas");
    if (canvasArea.length > 0) {
      for (var i = 0; i < canvasArea.length; i++) {
        if (canvasArea[i].getAttribute('aria-label') == null) {
          canvasArea[i].remove();
        }
        else {
          if ((canvasArea[i].getAttribute('id') != "myCanvas" && canvasArea[i].getAttribute('aria-label').includes("Page") == false)) {
            canvasArea[i].remove();
          }
        }
      }
    }
  }


  panx: any = 0;
  pany: any = 0;

  getshapeDrawing(getData, isnegativeCoordinates) {
    var elementId = Number(getData.toolbar_element_id);
    var pdfImg = document.getElementById("pdfImg");
    var newcreatedElement = document.createElement("canvas");
    newcreatedElement.setAttribute("documentCanvas", "1");
    newcreatedElement.className = 'annot_canvas';
    // newcreatedElement.classList.add("disabled");
    getData.initial_height = Number(getData.initial_height);
    getData.initial_width = Number(getData.initial_width);
    var getHeight;
    var getWidth;
    let linewidthCount = 0;
    if (elementId > 11) {
      linewidthCount = Math.round(Number(getData.line_width) / 2);
    }
    else {
      linewidthCount = Math.round(Number(getData.line_width) / 6);
    }
    var shapeStringValueTemp = this.shapeService.getCanvaswidthandHeight(getData);

    if (getData.initial_width <= 0 && getData.initial_height <= 0 && elementId >= 12 && elementId <= 18) {
      let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData);
      if (Number(getData.initial_position_x) != 0) {
        let getChangedString = this.changeStringValue(getData);
        getData.annotation_data = getChangedString;
        getData.initial_position_x = Number(getData.initial_position_x);
        getData.initial_position_y = Number(getData.initial_position_y);
        this.coordinateX = getData.initial_position_x < 0 ? -(getData.initial_position_x) : getData.initial_position_x;
        this.coordinateY = getData.initial_position_y < 0 ? -(getData.initial_position_y) : getData.initial_position_y;
      }
      else {
        this.coordinateX = getDrawWidthandHeight.left;
        this.coordinateY = getDrawWidthandHeight.top;
      }
      if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
        if (getData.line_width > 20) {
          getWidth = getDrawWidthandHeight.width + (Number(getData.line_width) * 4);
          getHeight = getDrawWidthandHeight.height + (Number(getData.line_width) * 4);
        }
        else {
          getWidth = getDrawWidthandHeight.width + (Number(getData.line_width));
          getHeight = getDrawWidthandHeight.height + (Number(getData.line_width));
        }
      }
      else {
        if (getData.line_width > 20) {
          getWidth = getDrawWidthandHeight.width + (Number(getData.line_width) * 4);
          getHeight = getDrawWidthandHeight.height + (Number(getData.line_width) * 4);
        }
        else {
          getWidth = getDrawWidthandHeight.width + (Number(getData.line_width));
          getHeight = getDrawWidthandHeight.height + (Number(getData.line_width));
        }
      }
    }
    else if (getData.initial_width != 0 && getData.initial_height != 0 && elementId >= 12 && elementId <= 18) {

      console.log(getData.initial_width, getData.initial_height);
      if (getData.line_width > 20) {
        getHeight = getData.initial_height + (Number(getData.line_width) * 4);
        getWidth = getData.initial_width + (Number(getData.line_width) * 4);
      }
      else {
        getHeight = getData.initial_height + Number(getData.line_width);
        getWidth = getData.initial_width + Number(getData.line_width);
      }
    }
    else if (elementId <= 11 && getData.initial_height != 0 && getData.initial_width != 0) {
      this.coordinateX = getData.initial_position_x;
      this.coordinateY = getData.initial_position_y;
      getWidth = Number(getData.initial_width) + (Number(getData.line_width) / (6) * 4);
      getHeight = Number(getData.initial_height) + (Number(getData.line_width) / (6) * 4);
      if (elementId == 5 || elementId == 9) {
        getWidth = Number(getData.initial_width) + (Number(getData.line_width) / (6) * 4);
        getHeight = Number(getData.initial_height) + (Number(getData.line_width) / (6) * 4);
      }
    }
    else if (elementId <= 11) {
      console.log(this.seticonwidth, this.seticonheight)
      if ((this.seticonwidth == undefined || this.seticonwidth == 0) && (this.seticonheight == undefined || this.seticonheight == 0)) {
        getWidth = 35 + linewidthCount;
        getHeight = 35 + linewidthCount;
        if (elementId == 5 || elementId == 9) {
          getWidth = 35 + (linewidthCount * 2);
          getHeight = 35 + (linewidthCount * 2);
        }
      }
      else {
        getWidth = this.seticonwidth + linewidthCount;
        getHeight = this.seticonheight + linewidthCount;
      }
    }
    else if (elementId == 19 || elementId == 20) {
      if (getData.annotation_data.includes('move') && getData.initial_width != 0 && getData.initial_height != 0) {
        let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData);
        getWidth = getDrawWidthandHeight.width + (Number(getData.line_width) / 2);
        getHeight = getDrawWidthandHeight.height + (Number(getData.line_width) / 2);
        this.coordinateX = Number(getData.initial_position_x) - 35 - ((Number(getData.line_width) / 2) / 2);
        this.coordinateY = Number(getData.initial_position_y) - 35 - ((Number(getData.line_width) / 2) / 2);
      }
      else if (getData.annotation_data.includes('move') && getData.initial_position_x != 0 && getData.initial_position_y != 0) {
        let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData);
        getWidth = getDrawWidthandHeight.width + (Number(getData.line_width));
        getHeight = getDrawWidthandHeight.height + (Number(getData.line_width));
        this.coordinateX = Number(getData.initial_position_x) - ((Number(getData.line_width) / 2));
        this.coordinateY = Number(getData.initial_position_y) - ((Number(getData.line_width) / 2));
      }
      else {
        let stringValue = getData.annotation_data;
        let splitString = stringValue.replaceAll('--', '-n');
        splitString = splitString.replaceAll(':-', ':n');
        let hypenSplitCD = splitString.split("-");
        let colonSplitCD = hypenSplitCD[1].replaceAll('n', '-').split(":");
        colonSplitCD[0] = Number(colonSplitCD[0]) < 0 ? - (Number(colonSplitCD[0])) : Number(colonSplitCD[0]);
        colonSplitCD[1] = Number(colonSplitCD[1]) < 0 ? - (Number(colonSplitCD[1])) : Number(colonSplitCD[1]);
        // let negativeElipseRectX = colonSplitCD[2] < 0 ? true : false;
        // let negativeElipseRectY = colonSplitCD[3] < 0 ? true : false;  
        colonSplitCD[2] = Number(colonSplitCD[2]) < 0 ? - (Number(colonSplitCD[2])) : Number(colonSplitCD[2]);
        colonSplitCD[3] = Number(colonSplitCD[3]) < 0 ? - (Number(colonSplitCD[3])) : Number(colonSplitCD[3]);
        if (elementId == 19) {
          getWidth = parseInt(colonSplitCD[2]) + 4 + Number(getData.line_width) / (2);
          getHeight = parseInt(colonSplitCD[3]) + 4 + Number(getData.line_width) / (2);
        }
        else {
          getWidth = parseInt(colonSplitCD[2]) + 20 + Number(getData.line_width) / (2);
          getHeight = parseInt(colonSplitCD[3]) + 20 + Number(getData.line_width) / (2);
        }
        if (Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {
          this.coordinateX = Number(getData.initial_position_x);
          this.coordinateY = Number(getData.initial_position_y);
          this.coordinateY = this.coordinateY - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          this.coordinateX = this.coordinateX - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          // commented by ganesh at 04.06.2021 purpose of rectange position change after move
          // getData.initial_width = 0;
          // getData.initial_height = 0;
          // getData.initial_position_x = 0;
          // getData.initial_position_y = 0;
        }
        else if (Number(getData.initial_position_x) != 0 && Number(getData.initial_position_y) != 0) {
          this.coordinateX = Number(getData.initial_position_x);
          this.coordinateY = Number(getData.initial_position_y);
          this.coordinateY = this.coordinateY - (getHeight / 2);
          this.coordinateX = this.coordinateX - (getWidth / 2);
        }
        else {
          // if(negativeElipseRectX){
          //   
          //   this.coordinateX = -(colonSplitCD[2]) < 0 ? -(colonSplitCD[0]) + colonSplitCD[2] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[0] - ((Number(getData.line_width) / 2) / 2);
          // }
          // if(negativeElipseRectY){
          //   this.coordinateY = -(colonSplitCD[3]) < 0 ? -(colonSplitCD[1]) + colonSplitCD[3] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[1] - ((Number(getData.line_width) / 2) / 2);
          // }
          // if(!negativeElipseRectX && !negativeElipseRectY){
          this.coordinateX = colonSplitCD[0] - 10 - ((Number(getData.line_width) / 2) / 2);
          this.coordinateY = colonSplitCD[1] - 10 - ((Number(getData.line_width) / 2) / 2);
          // }
          // colonSplitCD[2] = colonSplitCD[2] < 0 ? -(colonSplitCD[2]) : colonSplitCD[2];
          // colonSplitCD[3] = colonSplitCD[3] < 0 ? -(colonSplitCD[3]) : colonSplitCD[3];
        }
        console.log(getWidth, getHeight);
      }
    }
    newcreatedElement.style.position = "absolute";
    this.transparentBorder(newcreatedElement);
    newcreatedElement.style.zIndex = "1";
    if (
      elementId == 12 ||
      elementId == 17 ||
      elementId == 18 ||
      elementId == 14 ||
      elementId == 13 ||
      elementId == 19 ||
      elementId == 20 ||
      elementId == 15 ||
      elementId == 16
    ) {
      newcreatedElement.setAttribute("id", getData.annotation_id);
      var complexElementWidth = 0;
      var complexElementHeight = 0;
      if ((elementId == 13 || elementId == 14) && getData.initial_height == 0) {
        newcreatedElement.setAttribute("width", getWidth + 20);
        newcreatedElement.setAttribute("height", getHeight + 20);
        complexElementWidth = getWidth + 20;
        complexElementHeight = getHeight + 20;
      }
      else if (elementId != 19 && elementId != 20 && getData.initial_height == 0) {
        newcreatedElement.setAttribute("width", getWidth + 20);
        newcreatedElement.setAttribute("height", getHeight + 20);
        complexElementWidth = getWidth + 20;
        complexElementHeight = getHeight + 20;
      }
      else {
        newcreatedElement.setAttribute("width", getWidth);
        newcreatedElement.setAttribute("height", getHeight);
        complexElementWidth = getWidth;
        complexElementHeight = getHeight;
      }

      if (getData.initial_width != 0 && getData.initial_height != 0 && (elementId >= 12 && elementId <= 18)) {
        let topResizeSimple = 0;
        let leftResizeSimple = 0;
        if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
          newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
          newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
          topResizeSimple = this.coordinateY - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          leftResizeSimple = this.coordinateX - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
          if (getData.line_width > 20) {
            let cloneLineWidthChange = _.cloneDeep(getData);
            let getStringMethod = this.shapeService.resizeFunctionLineWidth(cloneLineWidthChange, false, newcreatedElement.width, newcreatedElement.height);
            getData.annotation_data = getStringMethod.shapeString;
            newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) - getStringMethod.yDifference + "px";
            newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) - getStringMethod.xDifference + "px";
            topResizeSimple = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) - getStringMethod.yDifference;
            leftResizeSimple = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) - getStringMethod.xDifference;
          }
          if (getData.annotation_label.trim() != "") {
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
          }
        }
        else {
          newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2)) + 'px';
          newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2)) + 'px';
          topResizeSimple = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2));
          leftResizeSimple = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2));
          if (getData.line_width > 20) {
            let cloneLineWidthChange = _.cloneDeep(getData);
            let getStringMethod = this.shapeService.resizeFunctionLineWidth(cloneLineWidthChange, false, newcreatedElement.width, newcreatedElement.height);
            getData.annotation_data = getStringMethod.shapeString;
            newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2)) - getStringMethod.yDifference + "px";
            newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2)) - getStringMethod.xDifference + "px";
            topResizeSimple = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2)) - getStringMethod.yDifference;
            leftResizeSimple = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2)) - getStringMethod.xDifference;
          }
          if (getData.annotation_label.trim() != "") {
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
          }
        }
      }
      else if (getData.initial_position_x != 0 && getData.initial_position_y != 0 && (elementId >= 12 && elementId <= 18)) {
        let topResizeSimple = 0;
        let leftResizeSimple = 0;
        if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
          newcreatedElement.style.top = Number(this.coordinateY) - (newcreatedElement.height / 2) + 'px';
          newcreatedElement.style.left = Number(this.coordinateX) - (newcreatedElement.width / 2) + 'px';
          topResizeSimple = Number(this.coordinateY) - (newcreatedElement.height / 2);
          leftResizeSimple = Number(this.coordinateX) - (newcreatedElement.width / 2);
          if (getData.line_width > 20) {
            let cloneLineWidthChange = _.cloneDeep(getData);
            let getStringMethod = this.shapeService.resizeFunctionLineWidth(cloneLineWidthChange, false, newcreatedElement.width, newcreatedElement.height);
            getData.annotation_data = getStringMethod.shapeString;
            newcreatedElement.style.top = Number(this.coordinateY) - (newcreatedElement.height / 2) + "px";
            newcreatedElement.style.left = Number(this.coordinateX) - (newcreatedElement.width / 2) + "px";
          }
          if (getData.annotation_label.trim() != "") {
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
          }
        }
        else {
          newcreatedElement.style.top = Number(this.coordinateY) - (newcreatedElement.height / 2) + 'px';
          newcreatedElement.style.left = Number(this.coordinateX) - (newcreatedElement.width / 2) + 'px';
          topResizeSimple = Number(this.coordinateY) - (newcreatedElement.height / 2);
          leftResizeSimple = Number(this.coordinateX) - (newcreatedElement.width / 2);
          if (getData.line_width > 20) {
            let cloneLineWidthChange = _.cloneDeep(getData);
            let getStringMethod = this.shapeService.resizeFunctionLineWidth(cloneLineWidthChange, false, newcreatedElement.width, newcreatedElement.height);
            getData.annotation_data = getStringMethod.shapeString;
            newcreatedElement.style.top = Number(this.coordinateY) - (newcreatedElement.height / 2) + "px";
            newcreatedElement.style.left = Number(this.coordinateX) - (newcreatedElement.width / 2) + "px";
          }
          if (getData.annotation_label.trim() != "") {
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
          }
        }
      }
      else if (elementId == 19 || elementId == 20) {

        if (getData.annotation_data.includes('move') && elementId == 19 && getData.initial_height != 0) {
          newcreatedElement.style.top = Number(getData.initial_position_y) - (17.5) - ((Number(getData.line_width) / 2)) + "px";
          newcreatedElement.style.left = Number(getData.initial_position_x) - (17.5) - ((Number(getData.line_width) / 2)) + "px";
          if (getData.annotation_label.trim() != "") {
            let topResizeSimple = Number(getData.initial_position_y) - (35) + 10;
            let leftResizeSimple = Number(getData.initial_position_x) - (35) + 10;
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
          }
        }
        else if (getData.annotation_data.includes('move') && elementId == 20 && getData.initial_height != 0) {
          newcreatedElement.style.top = Number(getData.initial_position_y) - (17.5) + "px";
          newcreatedElement.style.left = Number(getData.initial_position_x) - (17.5) + "px";
          if (getData.annotation_label.trim() != "") {
            let topResizeSimple = Number(getData.initial_position_y) - (17.5);
            let leftResizeSimple = Number(getData.initial_position_x) - (17.5);
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
          }
        }
        else if (getData.annotation_data.includes('move') && elementId == 19 && getData.initial_position_x != 0) {
          newcreatedElement.style.top = Number(this.coordinateY) - (35) + 10 + "px";
          newcreatedElement.style.left = Number(this.coordinateX) - (35) + 10 + "px";
          if (getData.annotation_label.trim() != "") {
            let topResizeSimple = Number(this.coordinateY) - (35) + 10;
            let leftResizeSimple = Number(this.coordinateX) - (35) + 10;
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
          }
        }
        else if (getData.annotation_data.includes('move') && elementId == 20 && getData.initial_position_x != 0) {
          newcreatedElement.style.top = Number(this.coordinateY) - (17.5) + "px";
          newcreatedElement.style.left = Number(this.coordinateX) - (17.5) + "px";
          if (getData.annotation_label.trim() != "") {
            let topResizeSimple = Number(this.coordinateY) - (17.5);
            let leftResizeSimple = Number(this.coordinateX) - (17.5);
            this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
          }
        }
        else {
          newcreatedElement.style.top = this.coordinateY + "px";
          newcreatedElement.style.left = this.coordinateX + "px";
          if (getData.annotation_label.trim() != "") {
            this.shapeService.mainDrawingLabel(getData, pdfImg, this.coordinateX, this.coordinateY, complexElementWidth, complexElementHeight);
          }
        }
      }
      else {
        let topResizeSimple = 0;
        let leftResizeSimple = 0;
        newcreatedElement.style.top = this.coordinateY - (Number(getData.line_width) / 2) + "px";
        newcreatedElement.style.left = this.coordinateX - (Number(getData.line_width) / 2) + "px";
        newcreatedElement.style.marginTop = - 10 + "px";
        newcreatedElement.style.marginLeft = - 10 + "px";
        topResizeSimple = Number(this.coordinateY) - (Number(getData.line_width) / 2);
        leftResizeSimple = Number(this.coordinateX) - (Number(getData.line_width) / 2);
        if (getData.line_width > 20) {
          let cloneLineWidthChange = _.cloneDeep(getData);
          let getStringMethod = this.shapeService.resizeFunctionLineWidth(cloneLineWidthChange, false, newcreatedElement.width, newcreatedElement.height);
          getData.annotation_data = getStringMethod.shapeString;
          newcreatedElement.style.top = this.coordinateY - (Number(getData.line_width) / 2) - getStringMethod.yDifference + "px";
          newcreatedElement.style.left = this.coordinateX - (Number(getData.line_width) / 2) - getStringMethod.xDifference + "px";
          topResizeSimple = Number(this.coordinateY) - (Number(getData.line_width) / 2) - getStringMethod.yDifference;
          leftResizeSimple = Number(this.coordinateX) - (Number(getData.line_width) / 2) - getStringMethod.xDifference;
        }
        if (getData.annotation_label.trim() != "") {
          this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
        }
      }
      // else if(getData.initial_height == 0&&getData.initial_position_x==0&&getData.initial_position_y==0) {
      //   newcreatedElement.style.marginTop = - 10 + "px";
      //   newcreatedElement.style.marginLeft = - 10 + "px";
      // }
    }
    else if (
      elementId == 15 ||
      elementId == 16
    ) {
      newcreatedElement.setAttribute("id", getData.annotation_id);
      newcreatedElement.setAttribute("width", getWidth + getData.line_width + getData.line_width + 10);
      newcreatedElement.setAttribute("height", getHeight + getData.line_width + getData.line_width + 10);
      newcreatedElement.style.top = this.coordinateY - getData.line_width - getData.line_width + "px";
      newcreatedElement.style.left = this.coordinateX - getData.line_width - getData.line_width + "px";
      newcreatedElement.style.marginTop = -getData.line_width - 2.5 + "px";
      newcreatedElement.style.marginLeft = -getData.line_width - 2.5 + "px";
    }
    else if (elementId == 11) {

      let staticValue = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-44:0 controlpoint-49:0 curveEnd-49:5 line-49:15 controlpoint-49:20 curveEnd-44:20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10";
      var getText = getData.annotation_data.split('text-');
      console.log(getText);
      let textheight = 20;
      console.log(typeof getText[1]);
      if (typeof getText[1] != undefined) {
        if (getData.hasOwnProperty("annotation_label") && getData.annotation_label.trim() != '') {
          let textvalue = getData.annotation_label.trim();
          getText.push(textvalue);
        }
        else {
          let textvalue = "     ";
          getText.push(textvalue);
        }

      }
      getText[1] = getText[1].replaceAll("`~", " ");
      getText[1] = getText[1].replaceAll("~`", "-");
      getText[1] = getText[1].replaceAll("~~~", ":");
      newcreatedElement.setAttribute("id", getData.annotation_id);
      let textCount = 20;
      if (getText[1].length < 5) {
        textCount = 27;
      }
      else if (getText[1].length > 12) {
        textCount = 12;
      }

      if (Number(getData.initial_width) == 0) {
        let canvas12 = document.createElement("canvas");
        canvas12.style.width = "200px";
        let context = canvas12.getContext("2d");
        let fontSizeget = getText[1].length > 15 ? 9 : getText[1].length <= 6 ? 10 : 7;
        context.font = "17px times new roman";
        context.fillText(getText[1], 0, 0);
        let widthget = context.measureText(getText[1]).width;
        console.log(widthget);
        let formattedWidth = Math.ceil(widthget);
        formattedWidth = formattedWidth + textCount;
        canvas12.innerHTML = getText[1];
        canvas12.style.fontWeight = "500";
        canvas12.style.fontSize = "17px";
        var textWidth = formattedWidth;
        let currentAnnotationData = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-" + getText[1] + "";
        let widththerom = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10";
        let x1Coordinate = [];
        let y1Coordinate = [];
        let cloneGetData = _.cloneDeep(getData);
        cloneGetData.annotation_data = getText[0];
        /* widththerom = widththerom.trim();
        let splitData123 = widththerom.split(" ");
        for (var im = 0; im < splitData123.length; im++) {
          console.log(splitData123[im]);
          let hypenSplit = splitData123[im].split("-");
          let colonSplit = hypenSplit[1].split(":");
          x1Coordinate.push(colonSplit[0]);
          y1Coordinate.push(colonSplit[1]);
        }
        let startx = Math.min.apply(null, x1Coordinate);
        let endx = Math.max.apply(null, x1Coordinate);
        let starty = Math.min.apply(null, y1Coordinate);
        let endy = Math.max.apply(null, y1Coordinate); */
        let getShapeStringWidth = this.shapeService.getCanvaswidthandHeight(cloneGetData);
        var textshapewidth = getShapeStringWidth.width;
        var textshapeheight = getShapeStringWidth.height;
        // getData.annotation_data = currentAnnotationData;
        console.log(textshapewidth, textshapeheight);
        console.log(currentAnnotationData);
        var newOne = textshapewidth + textCount;
        console.log(newOne);
        newcreatedElement.setAttribute("width", newOne.toString());
        newcreatedElement.setAttribute("height", ((Number(getData.line_width) / 2) + 50).toString());
        var textShapexyWidth = (newOne - textshapewidth) / 2;
        textShapexyWidth = textShapexyWidth < 0 ? -(textShapexyWidth) : textShapexyWidth;
        var textShapexyHeight = (50 - textshapeheight) / 2;
        textShapexyWidth = textShapexyWidth;
        console.log(textShapexyWidth, textShapexyHeight);
        let textshapetop = Number(this.coordinateY) - (newcreatedElement.height / 2);
        let textshapeleft = Number(this.coordinateX) - (newcreatedElement.width / 2);
        textshapetop = textshapetop < 0 ? 0 : textshapetop;
        textshapeleft = textshapeleft < 0 ? 0 : textshapeleft;
        let canvasRightSideCheck = newOne + textshapeleft;
        if(this.realWidth < canvasRightSideCheck){
          var checkDifference = canvasRightSideCheck - this.realWidth;
          console.log(checkDifference);
          textshapeleft = textshapeleft - checkDifference;
          console.log(textshapeleft);
        }
        newcreatedElement.style.top = textshapetop + "px";
        newcreatedElement.style.left = textshapeleft + "px";
      }
      else if (Number(getData.initial_width) != 0) {
        let cloneGetData = _.cloneDeep(getData);
        cloneGetData.annotation_data = getText[0];
        let getShapeStringWidth = this.shapeService.getCanvaswidthandHeight(cloneGetData);
        var textWidth = Number(getData.initial_width);
        let textHeight = Number(getData.initial_height) + (Number(getData.line_width) / 6);
        newcreatedElement.setAttribute("width", (textWidth).toString());
        newcreatedElement.setAttribute("height", (textHeight).toString());
        /* let subtractX = this.dbxposition - 17.5 -  (linewidthCount/2);
        let subtractY = this.dbyposition - 17.5 - (linewidthCount/2); */
        let subtractX = this.dbxposition - 17.5 - (newcreatedElement.width / 2);
        let subtractY = this.dbyposition - 17.5 - (newcreatedElement.height / 2);
        subtractX = subtractX < 0 ? 0 : subtractX;
        subtractY = subtractY < 0 ? 0 : subtractY;
        let canvasRightSideCheck = newOne + subtractX;
        if(this.realWidth < canvasRightSideCheck){
          var checkDifference = canvasRightSideCheck - this.realWidth;
          console.log(checkDifference);
          subtractX = subtractX - checkDifference;
          console.log(subtractX);
        }
        newcreatedElement.style.top = Number(subtractY) + "px";
        newcreatedElement.style.left = Number(subtractX) + "px";
      }
      if (getData.annotation_label != "") {
        var labelElement = document.createElement("p");
        // pdfImg.appendChild(labelElement);
        labelElement.setAttribute("annotationLabel", "1");
        labelElement.setAttribute("id", "label" + getData.annotation_id);
        labelElement.style.color = this.checkStrokeColor1(getData.stroke_color);
        let fontSizeget = getText[1].length > 15 ? 9 : getText[1].length <= 6 ? 10 : 7;
        var fontSizeBaseHeight = (shapeStringValueTemp.height / 2);
        labelElement.style.fontSize = fontSizeBaseHeight + 'px';
        labelElement.style.fontWeight = "500";
        labelElement.style.position = "absolute";
        labelElement.style.top = "0px";
        labelElement.style.left = "0px";
        labelElement.innerHTML = getData.annotation_label;
        labelElement.style.lineHeight = "1";
        labelElement.style.textAlign = "center";
        labelElement.style.pointerEvents = "none";
        labelElement.style.zIndex = "9";
        labelElement.style.whiteSpace = "nowrap";
        var numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;
        console.log(numberOfLineBreaks);
        if (numberOfLineBreaks != 0) {
          labelElement.style.whiteSpace = "pre-wrap";
        }
        console.log(getData.annotation_label);
        let measurement = (labelElement.clientHeight);
        let measurement1 = (labelElement.clientWidth);
        console.log(measurement, measurement1);
        if (Number(getData.initial_height) != 0 && Number(getData.initial_width) != 0) {

          let findDifferencex = newcreatedElement.width - measurement1;
          let findDifferencey = newcreatedElement.height - measurement;
          let subtractX = this.dbxposition - 17.5 - (linewidthCount / 2);
          let subtractY = this.dbyposition - 17.5 - (linewidthCount / 2);
          labelElement.style.top = Number(subtractY) + (findDifferencey / 2) + "px";
          labelElement.style.left = Number(subtractX) + (findDifferencex / 2) + "px";
        }
        else {
          labelElement.style.top = Number(this.coordinateY) - (measurement / 2) + "px";
          labelElement.style.left = Number(this.coordinateX) - (measurement1 / 2) + 8 + "px";
        }
        labelElement.style.wordBreak = "break-word";
        // if (getData.initial_rotation != undefined && getData.initial_rotation != 0) {
        //   
        //   let dx = getData.initial_rotation > 0 ? (labelElement.clientWidth / 2) : (-15);
        //   let dy = getData.initial_rotation > 0 ? (-15) : labelElement.clientHeight / 2;
        //   labelElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';
        //   console.log('matrix(' + Math.cos(getData.initial_rotation), Math.sin(getData.initial_rotation), -(Math.sin(getData.initial_rotation)), Math.cos(getData.initial_rotation), dx, dy + ')');
        //   // console.log(this.canvasElement.getTransform());
        //   // this.canvasElement.restore();
        // }
      }

    }
    else {
      console.log(getWidth, getHeight);
      var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
      newcreatedElement.setAttribute("id", getData.annotation_id);
      newcreatedElement.setAttribute("width", getWidth);
      newcreatedElement.setAttribute("height", getHeight);
      if (Number(getData.initial_height) != 0 && Number(getData.initial_width) != 0) {
        let subtractX = this.dbxposition - 17.5;
        let subtractY = this.dbyposition - 17.5;
        newcreatedElement.style.top = subtractY - ((Number(getData.line_width) / 6) * 2) + "px";
        newcreatedElement.style.left = subtractX - ((Number(getData.line_width) / 6) * 2) + "px";
        if (getData.annotation_label.trim() != "") {
          let topResizeSimple = subtractY - ((Number(getData.line_width) / 6) * 2);
          let leftResizeSimple = subtractX - ((Number(getData.line_width) / 6) * 2);
          this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
        }
      }
      else {
        var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
        newcreatedElement.style.top = Number(this.coordinateY) + "px";
        newcreatedElement.style.left = Number(this.coordinateX) + "px";
        newcreatedElement.style.marginLeft = -getWidth / 2 + "px";
        newcreatedElement.style.marginTop = -getHeight / 2 + "px";
        if (getData.annotation_label.trim() != "") {
          let topResizeSimple = Number(this.coordinateY);
          let leftResizeSimple = Number(this.coordinateX);
          this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
        }
      }
    }
    // if(getData.annotation_label.trim()!=""){
    //   this.shapeService1.mainDrawingLabel(getData,pdfImg,newcreatedElement.style.top,newcreatedElement.style.left);
    // }
    pdfImg.appendChild(newcreatedElement);
    this.colorBorder(newcreatedElement);
    let panx = -this.coordinateX + 394;
    let pany = -this.coordinateY + 201;
    if (panx > 0) {
      panx = 0;
    }
    if (pany > 0) {
      pany = 0;
    }
    this.panx = panx;
    this.pany = pany;
    this.startPanx = panx;
    this.startPany = pany;
    this.panzoomController.moveTo(panx, pany);
    this.canvasElement = newcreatedElement.getContext("2d");

    this.canvasElement.beginPath();
    // this.canvasBlurryRemove(newcreatedElement,this.canvasElement);
    this.canvasElement.globalAlpha = getData.opacity;
    
    if (elementId >= 1 && elementId <= 10 && (Number(getData.initial_width) < 35) && (Number(getData.initial_height) < 35) &&
      (Number(getData.initial_width) != 0) && (Number(getData.initial_height) != 0)) {

      let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width) - 4.5;
      let currentDBgetH = Number(getData.initial_height) - 4.5;
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    if (elementId >= 12 && elementId <= 18 && Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {

      let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width);
      let currentDBgetH = Number(getData.initial_height);
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if ((elementId == 19) && getData.annotation_data.includes('move')) {

      let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width) + 17.5;
      let currentDBgetH = Number(getData.initial_height) + 17.5;
      let actualratio = actualCanvasWH.width / actualCanvasWH.height;
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if (elementId == 20 && getData.annotation_data.includes('move')) {
      let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
      let currentDBgetW = Number(getData.initial_width);
      let currentDBgetH = Number(getData.initial_height);
      let actualratio = (actualCanvasWH.width + 35) / (actualCanvasWH.height + 35);
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if (elementId == 11 && Number(getData.initial_height) == 0) {
      let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
      let currentDBgetW = newcreatedElement.width;
      let currentDBgetH = newcreatedElement.height;
      let actualratio = (actualCanvasWH.width) / (actualCanvasWH.height);
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / (actualCanvasWH.width);
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if (elementId == 11 && Number(getData.initial_height) != 0) {
      let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
      console.log(actualCanvasWH);

      let currentDBgetW = actualCanvasWH.width;
      let currentDBgetH = actualCanvasWH.height;
      let actualratio = (newcreatedElement.width) / (newcreatedElement.height);
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / (actualCanvasWH.width);
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }
    else if(elementId<11 && Number(getData.initial_height)!=0 && Number(getData.initial_position_x)!=0){
      let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
      let currentDBgetWJSON = Number(getData.initial_width);
      let currentDBgetHJSON = Number(getData.initial_height);
      let currentDBgetW = currentDBgetWJSON;
      let currentDBgetH = currentDBgetHJSON;
      if(currentDBgetWJSON != currentDBgetHJSON){
        if(currentDBgetWJSON<currentDBgetHJSON){
          currentDBgetW = currentDBgetWJSON;
          currentDBgetH = currentDBgetWJSON;
        }
        else{
          currentDBgetW = currentDBgetHJSON;
          currentDBgetH = currentDBgetHJSON;
        }
      }
      let actualratio = (actualCanvasWH.width) / (actualCanvasWH.height);
      let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
      var scaleFactor1 = 0;
      if (actualratio > fixedratio) {
        scaleFactor1 = Number(currentDBgetW) / (actualCanvasWH.width);
      }
      else {
        scaleFactor1 = Number(currentDBgetH) / (actualCanvasWH.height);
      }
      this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
    }

    // To Repoint the drawn shape inside the canvas center.
    // --------------
    console.log(getStringWidth);
    if (getStringWidth != undefined && getData.initial_height == 0) {
      let translateWidth = getStringWidth.width - newcreatedElement.width;
      let translateHeight = getStringWidth.height - newcreatedElement.height;
      let translateX = (translateWidth / 2) + getStringWidth.left;
      let translateY = (translateHeight / 2) + getStringWidth.top;
      this.canvasElement.translate(-translateX, -translateY);
      this.canvasElement.restore();
    }
    // if (elementId>=12&&getData.initial_position_x != 0&&getData.initial_position_y != 0) {
    //   let getDrawWidthandHeight = this.shapeService1.getCanvaswidthandHeight(getData); 
    //   let translateWidth = getDrawWidthandHeight.width - newcreatedElement.width;
    //   let translateHeight = getDrawWidthandHeight.height - newcreatedElement.height;
    //   let translateX = (translateWidth / 2) + getDrawWidthandHeight.left;
    //   let translateY = (translateHeight / 2) + getStringWidth.top;
    //   this.canvasElement.translate(-translateX, -translateY);
    //   this.canvasElement.restore();
    // }
    // ---------------

    //Rotate shape drawing setup start
    if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 11) {
      let dx = getData.initial_rotation > 0 ? (getWidth / 2) : (-15);
      let dy = getData.initial_rotation > 0 ? (-15) : getHeight / 2;
      newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';
      console.log('matrix(' + Math.cos(getData.initial_rotation), Math.sin(getData.initial_rotation), -(Math.sin(getData.initial_rotation)), Math.cos(getData.initial_rotation), dx, dy + ')');
      // console.log(this.canvasElement.getTransform());
      // this.canvasElement.restore();
    }
    //Rotate shape drawing setup end

    // newcreatedElement = this.shapeService1.createHIDPIcanvs(getWidth,getHeight,7,newcreatedElement);
    // let ratio = 2;
    // newcreatedElement.width = newcreatedElement.clientWidth * ratio;
    // newcreatedElement.height = newcreatedElement.clientHeight * ratio;
    // this.canvasElement.scale(ratio,ratio);
    // newcreatedElement.style.width = getWidth + "px";
    // newcreatedElement.style.height = getHeight + "px";

    // newcreatedElement.width = getWidth * 2;
    // newcreatedElement.height = getHeight * 2; 
    if (elementId == 11) {

      if (Number(getData.initial_width) == 0) {
        newcreatedElement.setAttribute("width", (newOne + (Number(getData.line_width) / 6)).toString());
        let textshapetop = Number(this.coordinateY) - (newcreatedElement.height / 2);
        let textshapeleft = Number(this.coordinateX) - (newcreatedElement.width / 2);
        textshapetop = textshapetop < 0 ? 0 : textshapetop;
        textshapeleft = textshapeleft < 0 ? 0 : textshapeleft;
        let canvasRightSideCheck = newOne + textshapeleft;
        if(this.realWidth < canvasRightSideCheck){
          var checkDifference = canvasRightSideCheck - this.realWidth;
          console.log(checkDifference);
          textshapeleft = textshapeleft - checkDifference;
          console.log(textshapeleft);
        }
        newcreatedElement.style.top = textshapetop + "px";
        newcreatedElement.style.left = textshapeleft + "px";
        textShapexyWidth = (newcreatedElement.width - textshapewidth) / 2;
        textShapexyWidth = textShapexyWidth < 0 ? -(textShapexyWidth) : textShapexyWidth;
        textShapexyHeight = (newcreatedElement.height - textshapeheight) / 2;
      }
      else if (Number(getData.initial_width) != 0) {
        var textWidth = Number(getData.initial_width) + (Number(getData.line_width) / 2);
        let textHeight = Number(getData.initial_height) + (Number(getData.line_width) / 2);
        newcreatedElement.setAttribute("width", (textWidth).toString());
        newcreatedElement.setAttribute("height", (textHeight).toString());
        /* let subtractX = this.dbxposition - 17.5 -  (linewidthCount/2);
        let subtractY = this.dbyposition - 17.5 - (linewidthCount/2); */
        let subtractX = this.dbxposition - 17.5 - ((Number(getData.line_width) / 2) / 2);
        let subtractY = this.dbyposition - 17.5 - ((Number(getData.line_width) / 2) / 2);
        subtractX = subtractX < 0 ? 0 : subtractX;
        subtractY = subtractY < 0 ? 0 : subtractY;
        let canvasRightSideCheck = newOne + subtractX;
        if(this.realWidth < canvasRightSideCheck){
          var checkDifference = canvasRightSideCheck - this.realWidth;
          console.log(checkDifference);
          subtractX = subtractX - checkDifference;
          console.log(subtractX);
        }
        newcreatedElement.style.top = Number(subtractY) + "px";
        newcreatedElement.style.left = Number(subtractX) + "px";
        let subtractX1 = this.dbxposition - 35 - ((Number(getData.line_width) / 2) / 2);
        let subtractY1 = this.dbyposition - 35 - ((Number(getData.line_width) / 2) / 2);
        let measurement = (labelElement.clientHeight);
        let measurement1 = (labelElement.clientWidth);
        let findDifferencex = newcreatedElement.width - measurement1;
        let findDifferencey = newcreatedElement.height - measurement;
        labelElement.style.top = Number(subtractY1) + (findDifferencey / 2) + "px";
        labelElement.style.left = Number(subtractX1) + (findDifferencex / 2) + 12 + "px";

      }
      if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 12) {
        let dx = getData.initial_rotation > 0 ? (newcreatedElement.width / 2) : (-15);
        let dy = getData.initial_rotation > 0 ? (-15) : newcreatedElement.height / 2;
        newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';
        console.log('matrix(' + Math.cos(getData.initial_rotation), Math.sin(getData.initial_rotation), -(Math.sin(getData.initial_rotation)), Math.cos(getData.initial_rotation), dx, dy + ')');
        // console.log(this.canvasElement.getTransform());
        // this.canvasElement.restore();
      }
    }
    this.canvasElement.imageSmoothingQuality = "high";
    this.canvasElement.imageSmoothingEnabled = true;
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
        if (hypenSplit.length > 2) {
          let localString1 = hypenSplit[1] + '-' + hypenSplit[2];
          hypenSplit = [hypenSplit[0], localString1];
        }
        if (hypenSplit != '') {
          var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
          colonSplit[0] = this.shapeService.scientificToDecimal(Number(colonSplit[0]));
          colonSplit[1] = this.shapeService.scientificToDecimal(Number(colonSplit[1]));
        }
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
          var x = Math.round(parseFloat(colonSplit[0]));
          var y = Math.round(parseFloat(colonSplit[1]));
          var w = Math.round(parseFloat(colonSplit[2]));
          var h = Math.round(parseFloat(colonSplit[3]));

          switch (hypenSplit[0]) {
            case "move":
              if (
                getData.toolbar_element_id >= 12 && (Number(getData.initial_position_y) != 0 && Number(getData.initial_height) == 0) &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16) {
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10 + ((Number(getData.line_width) / 2) / 2),
                  y - this.coordinateY + 10 + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16
              ) {
                //Freehand shapes except ellipse and rectangle
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10 + (Number(getData.line_width) / 2),
                  y - this.coordinateY + 10 + (Number(getData.line_width) / 2)
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16) {
                this.canvasElement.moveTo(
                  x + ((Number(getData.line_width) / 2) / 2),
                  y + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if ((getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16) && (Number(getData.initial_position_y) != 0)) {
                //Line and line axial shape
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10 + ((Number(getData.line_width) / 2) / 2),
                  y - this.coordinateY + 10 + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16) {
                //Line and line axial shape
                this.canvasElement.moveTo(
                  x - this.coordinateX + 10 + (Number(getData.line_width) / 2),
                  y - this.coordinateY + 10 + (Number(getData.line_width) / 2)
                );
              }
              else {
                //Simple shapes initial
                if (elementId == 11) {
                  if (Number(getData.initial_height) != 0 && Number(getData.initial_width) != 0) {
                    this.canvasElement.moveTo(x + ((linewidthCount / 2)), y + ((linewidthCount / 2)));
                  }
                  else {
                    this.canvasElement.moveTo(x + textShapexyWidth, y + textShapexyHeight);
                  }
                }
                else {
                  this.canvasElement.moveTo(x, y);
                }
              }
              if (elementId == 13 && j == 1) {
                previous.x = x - this.coordinateX + 10;
                previous.y = y - this.coordinateY + 10;
                a++;
              }
              break;
            case "line":
              this.canvasElement.clearRect(
                0,
                0,
                newcreatedElement.width,
                newcreatedElement.height
              );
              if (
                getData.toolbar_element_id >= 12 && (Number(getData.initial_position_y) != 0 && Number(getData.initial_height) == 0) &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10 + ((Number(getData.line_width) / 2) / 2),
                  y - this.coordinateY + 10 + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16
              ) {
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10 + (Number(getData.line_width) / 2),
                  y - this.coordinateY + 10 + (Number(getData.line_width) / 2)
                );
              }
              else if (
                getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
                getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16) {
                this.canvasElement.lineTo(
                  x + ((Number(getData.line_width) / 2) / 2),
                  y + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if ((getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16) && (Number(getData.initial_position_y) != 0)) {
                //Line and line axial shape
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10 + ((Number(getData.line_width) / 2) / 2),
                  y - this.coordinateY + 10 + ((Number(getData.line_width) / 2) / 2)
                );
              }
              else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16) {
                //Line and line axial shape
                this.canvasElement.lineTo(
                  x - this.coordinateX + 10 + (Number(getData.line_width) / 2),
                  y - this.coordinateY + 10 + (Number(getData.line_width) / 2)
                );
              }
              else {
                if (elementId == 11) {
                  if (Number(getData.initial_height) != 0 && Number(getData.initial_width) != 0) {
                    if (getData.annotation_id == '8-58EA4D87-32AD-4D51-B01B-BF991BBAA38B-1620732281199') {

                    }
                    this.canvasElement.lineTo(x + ((linewidthCount / 2)), y + ((linewidthCount / 2)));
                  }
                  else {
                    this.canvasElement.lineTo(x + textShapexyWidth, y + textShapexyHeight);
                  }
                }
                else {
                  this.canvasElement.lineTo(x, y);
                }
              }
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
                w = w;
                h = h;
                console.log(w, h);
                var r = (w * w) / (8 * h) + h / 2;
                this.canvasElement.ellipse((w / 2) + 2 + ((Number(getData.line_width) / 2) / 2), (h / 2) + 2 + ((Number(getData.line_width) / 2) / 2), w / 2, h / 2, Math.PI * 1, 0, 2 * Math.PI);
              }
              break;
          }
        }
        else if ((hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") && j == 1) {
          if (hypenSplit[0] == "controlpoint") {
            cpx = parseFloat(colonSplit[0]);
            cpy = parseFloat(colonSplit[1]);
          }
          if (hypenSplit[0] == "curveEnd") {
            var ex = parseFloat(colonSplit[0]);
            var ey = parseFloat(colonSplit[1]);
            if (elementId == 11) {
              if (Number(getData.initial_height) != 0 && Number(getData.initial_width) != 0) {
                this.canvasElement.quadraticCurveTo(cpx + ((linewidthCount / 2)), cpy + ((linewidthCount / 2)), ex + ((linewidthCount / 2)), ey + ((linewidthCount / 2)));
              }
              else {
                this.canvasElement.quadraticCurveTo(cpx + textShapexyWidth, cpy + textShapexyHeight, ex + textShapexyWidth, ey + textShapexyHeight);
              }
            }
            else {
              this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
            }
          }
        }
        else if ((hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve") && j == 1) {
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
            // this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
            if (getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 && getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16) {
              this.canvasElement.bezierCurveTo(cp1x + ((Number(getData.line_width) / 2) / 2), cp1y + ((Number(getData.line_width) / 2) / 2), cp2x + ((Number(getData.line_width) / 2) / 2), cp2y + ((Number(getData.line_width) / 2) / 2), cx + ((Number(getData.line_width) / 2) / 2), cy + ((Number(getData.line_width) / 2) / 2));
            }
            else {
              console.log(cp1x, cp1y, cp2x, cp2y, cx, cy);
              this.canvasElement.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
            }
          }
        }
        else if (hypenSplit[0] == "drawRect" && j == 1) {
          // let colonSplit = hypenSplit[j].split(":");
          colonSplit[0] = Number(colonSplit[0]);
          colonSplit[1] = Number(colonSplit[1]);
          colonSplit[2] = Number(colonSplit[2]);
          colonSplit[3] = Number(colonSplit[3]);
          colonSplit[0] = colonSplit[0] < 0 ? -(colonSplit[0]) : colonSplit[0];
          colonSplit[1] = colonSplit[1] < 0 ? -(colonSplit[1]) : colonSplit[1];
          colonSplit[2] = colonSplit[2] < 0 ? -(colonSplit[2]) : colonSplit[2];
          colonSplit[3] = colonSplit[3] < 0 ? -(colonSplit[3]) : colonSplit[3];
          let rectX = parseFloat(colonSplit[0]);
          let rectY = parseFloat(colonSplit[1]);
          let rectWidth = parseFloat(colonSplit[2]);
          let rectHeight = parseFloat(colonSplit[3]);
          console.log(rectWidth, rectHeight);
          this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
          let rectlineWidth = this.globalLineWidth(getData.line_width);
          let convertMinuspointX = shapeStringValueTemp.width < 0 ? -(shapeStringValueTemp.width) : shapeStringValueTemp.width;
          let convertMinuspointY = shapeStringValueTemp.height < 0 ? -(shapeStringValueTemp.height) : shapeStringValueTemp.height;
          let getLeftPosistion = (newcreatedElement.width - convertMinuspointX) / 2;
          let getTopPosistion = (newcreatedElement.height - convertMinuspointY) / 2;
          // newcreatedElement.style.left =  
          console.log(getLeftPosistion, getTopPosistion,rectWidth,rectHeight);
          this.canvasElement.rect(getLeftPosistion, getTopPosistion,rectWidth,rectHeight);
        }
      }
    }
    if (
      elementId != 12 &&
      elementId != 14 &&
      elementId != 13 &&
      elementId != 15
    ) {
      var checkFill = getData.fill_color;
      this.canvasElement.fillStyle = this.checkStrokeColor1(checkFill);
      this.canvasElement.fill();
    }
    if (elementId == 17 || elementId == 18 || elementId == 1) {
      console.log(elementId);
      this.canvasElement.closePath();
    }
    // this.canvasElement.drawImage(newcreatedElement,0,0,50,50,0,0,10,50);
    // latest
    // if (getData.line_width / 5 < 1) {
    //   this.canvasElement.lineWidth = 1;
    // }
    // else {
    //   this.canvasElement.lineWidth = this.globalLineWidth(getData.line_width);
    // }
    // if ((elementId == 15 || elementId == 16 || elementId == 12 || elementId == 13 || elementId == 14) && getData.line_width != 0) {
    //   this.canvasElement.lineWidth = this.globalLineWidth(getData.line_width) + 1;
    // }
    if (elementId <= 11) {
      this.canvasElement.lineWidth = Math.round(Number(getData.line_width) / (6));
    }
    else if (elementId > 11) {
      this.canvasElement.lineWidth = Number(getData.line_width) / (2);
    }
    this.canvasElement.strokeStyle = this.checkStrokeColor1(getData.stroke_color);
    this.canvasElement.stroke();
    newcreatedElement.style.overflow = "visible";
    newcreatedElement.style.display = "block";
    if (elementId == 11) {
      // newcreatedElement.appendChild(labelElement);
      // labelElement.style.top = '0px';
      // labelElement.style.left = '0px';
      this.canvasElement.font = 'bold ' + fontSizeBaseHeight + 'px Calibri';
      this.canvasElement.textAlign = 'center';
      this.canvasElement.textBaseline = 'middle';
      this.canvasElement.fillStyle = this.checkStrokeColor1(getData.stroke_color);
      let getStringSplit = getData.annotation_data.split(' ');
      let secondLineget = getStringSplit[1].split('-');
      let colonsplitsecond = secondLineget[1].split(':');
      let ypositionCalc = (newcreatedElement.height) / 2;
      let xpositionCalc = (newcreatedElement.width) / 2
      this.canvasElement.fillText(getData.annotation_label, xpositionCalc + (Number(colonsplitsecond[0]) / 2), ypositionCalc);
    }

    // this.canvasElement.lineCap = "square";
    // this.canvasElement.lineJoin = "miter";
    // if (elementId >= 12 && elementId <= 18 && getData.initial_height != 0 && getData.initial_width != 0) {
    //   newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width)/2)/2) + 'px';
    //   newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width)/2)/2) + 'px';
    // }
    // let getimagedata = this.canvasElement.getImageData(0,0,newcreatedElement.width,newcreatedElement.height);
    // console.log(getimagedata)
    // let imagedata = getimagedata.data;
    // for (var i = 0; i < imagedata.length; i+= 4) {
    //   imagedata[i] = imagedata[i] ^ 255; // Invert Red
    //   imagedata[i+1] = imagedata[i+1] ^ 255; // Invert Green
    //   imagedata[i+2] = imagedata[i+2] ^ 255; // Invert Blue
    // }
    // this.canvasElement.putImageData(getimagedata,0,0);
  }


  // getshapeDrawing(getData, isnegativeCoordinates) {
  //   var elementId = Number(getData.toolbar_element_id);
  //   var pdfImg = document.getElementById("pdfImg");
  //   var newcreatedElement = document.createElement("canvas");
  //   newcreatedElement.setAttribute("documentCanvas", "1");
  //   getData.initial_height = Number(getData.initial_height);
  //   getData.initial_width = Number(getData.initial_width);
  //   var getHeight;
  //   var getWidth;
  //   var shapeStringValueTemp = this.shapeService.getCanvaswidthandHeight(getData);
  //   if (getData.initial_width <= 0 && getData.initial_height <= 0 && elementId >= 12 && elementId <= 18) {
  //     let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData);
  //     if (Number(getData.initial_position_x) != 0) {
  //       let getChangedString = this.changeStringValue(getData);
  //       getData.annotation_data = getChangedString;
  //       getData.initial_position_x = Number(getData.initial_position_x);
  //       getData.initial_position_y = Number(getData.initial_position_y);
  //       this.coordinateX = getData.initial_position_x < 0 ? -(getData.initial_position_x) : getData.initial_position_x;
  //       this.coordinateY = getData.initial_position_y < 0 ? -(getData.initial_position_y) : getData.initial_position_y;
  //     }
  //     else {
  //       this.coordinateX = getDrawWidthandHeight.left - ((Number(getData.line_width) / 2) / 2);
  //       this.coordinateY = getDrawWidthandHeight.top - ((Number(getData.line_width) / 2) / 2);
  //     }
  //     if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
  //       getWidth = getDrawWidthandHeight.width + Number(getData.line_width) / (2);
  //       getHeight = getDrawWidthandHeight.height + Number(getData.line_width) / (2);
  //     }
  //     else {
  //       getWidth = getDrawWidthandHeight.width + Number(getData.line_width) / (2);
  //       getHeight = getDrawWidthandHeight.height + Number(getData.line_width) / (2);
  //     }

  //   }
  //   else if (getData.initial_width != 0 && getData.initial_height != 0 && elementId >= 12 && elementId <= 18) {
  //     getHeight = getData.initial_height + 3 + Number(getData.line_width) / (2);
  //     getWidth = getData.initial_width + 3 + Number(getData.line_width) / (2);
  //     console.log(getData.initial_width, getData.initial_height);
  //     // this.coordinateX = getData.initial_position_x;
  //     // this.coordinateY = getData.initial_position_y;
  //     let getWidthResize = this.shapeService.getCanvaswidthandHeight(getData);
  //   }
  //   else if (elementId <= 11 && getData.initial_height != 0 && getData.initial_width != 0) {
  //     this.coordinateX = getData.initial_position_x;
  //     this.coordinateY = getData.initial_position_y;
  //     getWidth = Number(getData.initial_width) + (Number(getData.line_width) / (6) * 2);
  //     getHeight = Number(getData.initial_height) + (Number(getData.line_width) / (6) * 2);
  //     if (elementId == 5 || elementId == 9) {
  //       getWidth = Number(getData.initial_width) + (Number(getData.line_width) / (6) * 2);
  //       getHeight = Number(getData.initial_height) + (Number(getData.line_width) / (6) * 2);
  //     }
  //   }
  //   else if (elementId <= 11) {
  //     getWidth = 35 + Number(getData.line_width) / (6);
  //     getHeight = 35 + Number(getData.line_width) / (6);
  //     if (elementId == 5 || elementId == 9) {
  //       getWidth = 35 + (Number(getData.line_width) / (6) * 2);
  //       getHeight = 35 + (Number(getData.line_width) / (6) * 2);
  //     }
  //   }
  //   else if (elementId == 19 || elementId == 20) {
  //     if (getData.annotation_data.includes('move') && getData.initial_width != 0 && getData.initial_height != 0) {
  //       let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData);
  //       getWidth = getDrawWidthandHeight.width + (Number(getData.line_width) / 2);
  //       getHeight = getDrawWidthandHeight.height + (Number(getData.line_width) / 2);
  //       this.coordinateX = Number(getData.initial_position_x) - 35 - ((Number(getData.line_width) / 2) / 2);
  //       this.coordinateY = Number(getData.initial_position_y) - 35 - ((Number(getData.line_width) / 2) / 2);
  //     }
  //     else if (getData.annotation_data.includes('move') && getData.initial_position_x != 0 && getData.initial_position_y != 0) {
  //       let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData);
  //       getWidth = getDrawWidthandHeight.width + (Number(getData.line_width) / 2);
  //       getHeight = getDrawWidthandHeight.height + (Number(getData.line_width) / 2);
  //       this.coordinateX = Number(getData.initial_position_x) - ((Number(getData.line_width) / 2) / 2);
  //       this.coordinateY = Number(getData.initial_position_y) - ((Number(getData.line_width) / 2) / 2);
  //     }
  //     else {
  //       let stringValue = getData.annotation_data;
  //       let splitString = stringValue.replaceAll('--', '-n');
  //       splitString = splitString.replaceAll(':-', ':n');
  //       let hypenSplitCD = splitString.split("-");
  //       let colonSplitCD = hypenSplitCD[1].replaceAll('n', '-').split(":");
  //       colonSplitCD[0] = Number(colonSplitCD[0]);
  //       colonSplitCD[1] = Number(colonSplitCD[1]);
  //       colonSplitCD[2] = Number(colonSplitCD[2]);
  //       colonSplitCD[3] = Number(colonSplitCD[3]);
  //       if (Number(getData.initial_position_x) != 0) {
  //         this.coordinateX = Number(getData.initial_position_x);
  //         this.coordinateY = Number(getData.initial_position_y);
  //         this.coordinateY = this.coordinateY - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
  //         this.coordinateX = this.coordinateX - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
  //         getData.initial_width = 0;
  //         getData.initial_height = 0;
  //         getData.initial_position_x = 0;
  //         getData.initial_position_y = 0;
  //       }
  //       else {
  //         this.coordinateX = colonSplitCD[2] < 0 ? (colonSplitCD[0]) + colonSplitCD[2] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[0] - ((Number(getData.line_width) / 2) / 2);
  //         this.coordinateY = colonSplitCD[3] < 0 ? colonSplitCD[1] + colonSplitCD[3] - ((Number(getData.line_width) / 2) / 2) : colonSplitCD[1] - ((Number(getData.line_width) / 2) / 2);
  //         colonSplitCD[2] = colonSplitCD[2] < 0 ? -(colonSplitCD[2]) : colonSplitCD[2];
  //         colonSplitCD[3] = colonSplitCD[3] < 0 ? -(colonSplitCD[3]) : colonSplitCD[3];
  //       }
  //       if (elementId == 19) {
  //         getWidth = parseInt(colonSplitCD[2]) + 4 + Number(getData.line_width) / (2);
  //         getHeight = parseInt(colonSplitCD[3]) + 4 + Number(getData.line_width) / (2);
  //       }
  //       else {
  //         getWidth = parseInt(colonSplitCD[2]) + 4 + Number(getData.line_width) / (2);
  //         getHeight = parseInt(colonSplitCD[3]) + 4 + Number(getData.line_width) / (2);
  //       }
  //       console.log(getWidth, getHeight);
  //     }
  //   }
  //   newcreatedElement.style.position = "absolute";
  //   this.transparentBorder(newcreatedElement);
  //   newcreatedElement.style.zIndex = "1";
  //   if (
  //     elementId == 12 ||
  //     elementId == 17 ||
  //     elementId == 18 ||
  //     elementId == 14 ||
  //     elementId == 13 ||
  //     elementId == 19 ||
  //     elementId == 20 ||
  //     elementId == 15 ||
  //     elementId == 16 ||
  //     isnegativeCoordinates == true
  //   ) {
  //     newcreatedElement.setAttribute("id", getData.annotation_id);
  //     var complexElementWidth = 0;
  //     var complexElementHeight = 0;
  //     if ((elementId == 13 || elementId == 14) && getData.initial_height == 0) {
  //       newcreatedElement.setAttribute("width", getWidth + 25);
  //       newcreatedElement.setAttribute("height", getHeight + 25);
  //       complexElementWidth = getWidth + 25;
  //       complexElementHeight = getHeight + 25;
  //     }
  //     else if (elementId != 19 && elementId != 20 && getData.initial_height == 0) {
  //       newcreatedElement.setAttribute("width", getWidth + 20);
  //       newcreatedElement.setAttribute("height", getHeight + 20);
  //       complexElementWidth = getWidth + 20;
  //       complexElementHeight = getHeight + 20;
  //     }
  //     else {
  //       newcreatedElement.setAttribute("width", getWidth);
  //       newcreatedElement.setAttribute("height", getHeight);
  //       complexElementWidth = getWidth;
  //       complexElementHeight = getHeight;
  //     }
  //     if (getData.initial_width != 0 && getData.initial_height != 0 && (elementId >= 12 || elementId == 18)) {
  //       if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
  //         newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
  //         newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
  //         if (getData.annotation_label.trim() != "") {
  //           let topResizeSimple = this.coordinateY - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
  //           let leftResizeSimple = this.coordinateX - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
  //           this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
  //         }
  //       }
  //       else {
  //         newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
  //         newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
  //         if (getData.annotation_label.trim() != "") {
  //           let topResizeSimple = this.coordinateY - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
  //           let leftResizeSimple = this.coordinateX - (35 / 2) - ((Number(getData.line_width) / 2) / 2);
  //           this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
  //         }
  //       }
  //     }
  //     else if (getData.initial_position_x != 0 && getData.initial_position_y != 0 && (elementId >= 12 || elementId == 18)) {
  //       if (shapeStringValueTemp.width < 2 || shapeStringValueTemp.height < 2) {
  //         newcreatedElement.style.top = Number(this.coordinateY) - (newcreatedElement.height / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
  //         newcreatedElement.style.left = Number(this.coordinateX) - (newcreatedElement.width / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
  //         if (getData.annotation_label.trim() != "") {
  //           let topResizeSimple = this.coordinateY - (newcreatedElement.height / 2) - ((Number(getData.line_width) / 2) / 2);
  //           let leftResizeSimple = this.coordinateX - (newcreatedElement.width / 2) - ((Number(getData.line_width) / 2) / 2);
  //           this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
  //         }
  //       }
  //       else {
  //         newcreatedElement.style.top = Number(this.coordinateY) - (newcreatedElement.height / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
  //         newcreatedElement.style.left = Number(this.coordinateX) - (newcreatedElement.width / 2) - ((Number(getData.line_width) / 2) / 2) + 'px';
  //         if (getData.annotation_label.trim() != "") {
  //           let topResizeSimple = this.coordinateY - (newcreatedElement.height / 2) - ((Number(getData.line_width) / 2) / 2);
  //           let leftResizeSimple = this.coordinateX - (newcreatedElement.width / 2) - ((Number(getData.line_width) / 2) / 2);
  //           this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, complexElementWidth, complexElementHeight);
  //         }
  //       }
  //     }
  //     else if (elementId == 19 || elementId == 20) {
  //       if (getData.annotation_data.includes('move') && elementId == 19) {
  //         newcreatedElement.style.top = Number(getData.initial_position_y) - (35) + 10 + "px";
  //         newcreatedElement.style.left = Number(getData.initial_position_x) - (35) + 10 + "px";
  //         if (getData.annotation_label.trim() != "") {
  //           let topResizeSimple = Number(getData.initial_position_y) - (35) + 10;
  //           let leftResizeSimple = Number(getData.initial_position_x) - (35) + 10;
  //           this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
  //         }
  //       }
  //       else if (getData.annotation_data.includes('move') && elementId == 20) {
  //         // newcreatedElement.setAttribute('width',(Number(getWidth)+10).toString());
  //         // newcreatedElement.setAttribute('height',(Number(getHeight)+10).toString());
  //         newcreatedElement.style.top = Number(getData.initial_position_y) - (17.5) + "px";
  //         newcreatedElement.style.left = Number(getData.initial_position_x) - (17.5) + "px";
  //         if (getData.annotation_label.trim() != "") {
  //           let topResizeSimple = Number(getData.initial_position_y) - (17.5);
  //           let leftResizeSimple = Number(getData.initial_position_x) - (17.5);
  //           this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
  //         }
  //       }
  //       else {
  //         newcreatedElement.style.top = this.coordinateY + "px";
  //         newcreatedElement.style.left = this.coordinateX + "px";
  //         if (getData.annotation_label.trim() != "") {
  //           this.shapeService.mainDrawingLabel(getData, pdfImg, this.coordinateX, this.coordinateY, complexElementWidth, complexElementHeight);
  //         }
  //       }
  //     }
  //     else {
  //       newcreatedElement.style.top = this.coordinateY + "px";
  //       newcreatedElement.style.left = this.coordinateX + "px";
  //       newcreatedElement.style.marginTop = - 10 + "px";
  //       newcreatedElement.style.marginLeft = - 10 + "px";
  //       if (getData.annotation_label.trim() != "") {
  //         this.shapeService.mainDrawingLabel(getData, pdfImg, this.coordinateX, this.coordinateY, complexElementWidth, complexElementHeight);
  //       }
  //     }
  //     // else if(getData.initial_height == 0&&getData.initial_position_x==0&&getData.initial_position_y==0) {
  //     //   newcreatedElement.style.marginTop = - 10 + "px";
  //     //   newcreatedElement.style.marginLeft = - 10 + "px";
  //     // }
  //   }
  //   else if (
  //     elementId == 15 ||
  //     elementId == 16
  //   ) {
  //     newcreatedElement.setAttribute("id", getData.annotation_id);
  //     newcreatedElement.setAttribute("width", getWidth + getData.line_width + getData.line_width + 10);
  //     newcreatedElement.setAttribute("height", getHeight + getData.line_width + getData.line_width + 10);
  //     newcreatedElement.style.top = this.coordinateY - getData.line_width - getData.line_width + "px";
  //     newcreatedElement.style.left = this.coordinateX - getData.line_width - getData.line_width + "px";
  //     newcreatedElement.style.marginTop = -getData.line_width - 2.5 + "px";
  //     newcreatedElement.style.marginLeft = -getData.line_width - 2.5 + "px";
  //   }
  //   else if (elementId == 11) {
  //     let staticValue = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-44:0 controlpoint-49:0 curveEnd-49:5 line-49:15 controlpoint-49:20 curveEnd-44:20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-123"
  //     let getText = getData.annotation_data.split('text-');
  //     console.log(getText);
  //     let canvas12 = document.createElement("canvas");
  //     canvas12.style.width = "200px";
  //     let textCount = 20;
  //     let context = canvas12.getContext("2d");
  //     context.font = "14px times new roman";
  //     context.fillText(getText[1], 0, 0);
  //     let widthget = context.measureText(getText[1]).width;
  //     console.log(widthget);
  //     if (getText[1].length < 5) {
  //       textCount = 27;
  //     }
  //     else if (getText[1].length > 12) {
  //       textCount = 5;
  //     }
  //     // let ruler = document.createElement("p");
  //     // ruler.style.width = "auto";
  //     // ruler.style.position = 'absolute';
  //     // ruler.style.whiteSpace = 'nowrap';
  //     // ruler.innerHTML = getText[1];
  //     // let getEle = document.getElementById("welldone");
  //     // getEle.appendChild(ruler);
  //     // console.log(ruler.clientWidth,ruler.clientHeight);
  //     let formattedWidth = Math.ceil(widthget);
  //     // let canvas12 =  document.createElement("p");
  //     console.log(formattedWidth);
  //     let minusXposition = formattedWidth < 50 ? 10 : 5;
  //     formattedWidth = formattedWidth + textCount;
  //     canvas12.innerHTML = getText[1];
  //     canvas12.style.fontWeight = "500";
  //     canvas12.style.fontSize = "14px";
  //     var textWidth = formattedWidth;
  //     let currentAnnotationData = "move-0:10 line-20:10 line-20:5 controlpoint-20:0 curveEnd-25:0 line-" + Number(textWidth) + ":0 controlpoint-" + Number(textWidth + 5) + ":0 curveEnd-" + Number(textWidth + 5) + ":5 line-" + Number(textWidth + 5) + ":15 controlpoint-" + Number(textWidth + 5) + ":20 curveEnd-" + Number(textWidth) + ":20 line-25:20 controlpoint-20:20 curveEnd-20:15 line-20:10 text-" + getText[1] + ""
  //     let x1Coordinate = [];
  //     let y1Coordinate = [];
  //     currentAnnotationData = currentAnnotationData.trim();
  //     let splitData123 = currentAnnotationData.split(" ");
  //     for (var im = 0; im < splitData123.length - 1; im++) {
  //       console.log(splitData123[im]);
  //       let hypenSplit = splitData123[im].split("-");
  //       let colonSplit = hypenSplit[1].split(":");
  //       x1Coordinate.push(colonSplit[0]);
  //       y1Coordinate.push(colonSplit[1]);
  //     }
  //     let startx = Math.min.apply(null, x1Coordinate);
  //     let endx = Math.max.apply(null, x1Coordinate);
  //     let starty = Math.min.apply(null, y1Coordinate);
  //     let endy = Math.max.apply(null, y1Coordinate);
  //     let textshapewidth = (endx - startx);
  //     let textshapeheight = (endy - starty);
  //     getData.annotation_data = currentAnnotationData;
  //     console.log(textshapewidth, textshapeheight);
  //     console.log(currentAnnotationData);
  //     newcreatedElement.setAttribute("id", getData.annotation_id);
  //     let newOne = textWidth;
  //     console.log(newOne);
  //     newcreatedElement.setAttribute("width", newOne.toString());
  //     newcreatedElement.setAttribute("height", "50");
  //     var textShapexyWidth = (newOne - textshapewidth) / 2;
  //     var textShapexyHeight = (50 - textshapeheight) / 2;
  //     textShapexyWidth = textShapexyWidth - 5;
  //     console.log(textShapexyWidth, textShapexyHeight);
  //     newcreatedElement.style.top = this.coordinateY + "px";
  //     newcreatedElement.style.left = Number(this.coordinateX) + "px";
  //     newcreatedElement.style.marginLeft = - (newOne / 2) + "px";
  //     newcreatedElement.style.marginTop = -(50 / 2) + "px";
  //     if (getData.annotation_label != "") {
  //       let labelElement = document.createElement("p");
  //       pdfImg.appendChild(labelElement);
  //       labelElement.setAttribute("annotationLabel", "1");
  //       labelElement.setAttribute("id", "label" + getData.annotation_id);
  //       labelElement.style.color = this.checkStrokeColor1(getData.stroke_color);
  //       labelElement.style.fontSize = (newOne / 1.5) + '%';
  //       labelElement.style.fontWeight = "500";
  //       labelElement.style.position = "absolute";
  //       labelElement.style.top = this.coordinateY + "px";
  //       labelElement.style.left = Number(this.coordinateX) + "px";
  //       labelElement.innerHTML = getData.annotation_label;
  //       labelElement.style.lineHeight = "1";
  //       labelElement.style.textAlign = "center";
  //       labelElement.style.pointerEvents = "none";
  //       labelElement.style.zIndex = "9";
  //       var numberOfLineBreaks = (getData.annotation_label.match(/\n/g) || []).length;
  //       console.log(numberOfLineBreaks);
  //       if (numberOfLineBreaks != 0) {
  //         labelElement.style.whiteSpace = "pre-wrap";
  //       }
  //       console.log(getData.annotation_label);
  //       let measurement = (labelElement.clientHeight);
  //       let measurement1 = (labelElement.clientWidth);
  //       console.log(measurement, measurement1);
  //       labelElement.style.marginLeft = -(measurement1 / 2) + "px";
  //       labelElement.style.marginTop = -(measurement / 2) + "px";
  //       labelElement.style.wordBreak = "break-word";
  //     }
  //   }
  //   else {
  //     console.log(getWidth, getHeight);
  //     var getStringWidth = this.shapeService.getCanvaswidthandHeight(getData);
  //     newcreatedElement.setAttribute("id", getData.annotation_id);
  //     newcreatedElement.setAttribute("width", getWidth);
  //     newcreatedElement.setAttribute("height", getHeight);
  //     if (Number(getData.initial_height) != 0 && Number(getData.initial_width) != 0) {
  //       let subtractX = this.dbxposition - 17.5;
  //       let subtractY = this.dbyposition - 17.5;
  //       newcreatedElement.style.top = subtractY - ((Number(getData.line_width) / 6)) + "px";
  //       newcreatedElement.style.left = subtractX - ((Number(getData.line_width) / 6)) + "px";
  //       if (getData.annotation_label.trim() != "") {
  //         let topResizeSimple = subtractY - ((Number(getData.line_width) / 6));
  //         let leftResizeSimple = subtractX - ((Number(getData.line_width) / 6));
  //         this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
  //       }
  //     }
  //     else {
  //       newcreatedElement.style.top = Number(this.coordinateY) + "px";
  //       newcreatedElement.style.left = Number(this.coordinateX) + "px";
  //       newcreatedElement.style.marginLeft = -getWidth / 2 + "px";
  //       newcreatedElement.style.marginTop = -getHeight / 2 + "px";
  //       if (getData.annotation_label.trim() != "") {
  //         let topResizeSimple = Number(this.coordinateY);
  //         let leftResizeSimple = Number(this.coordinateX);
  //         this.shapeService.mainDrawingLabel(getData, pdfImg, leftResizeSimple, topResizeSimple, getWidth, getHeight);
  //       }
  //     }
  //   }
  //   pdfImg.appendChild(newcreatedElement);
  //   this.colorBorder(newcreatedElement)
  //   let panx = -this.coordinateX + 394;
  //   let pany = -this.coordinateY + 201;
  //   if (panx > 0) {
  //     panx = 0;
  //   }
  //   if (pany > 0) {
  //     pany = 0;
  //   }
  //   this.panx = panx;
  //   this.pany = pany;
  //   this.startPanx = panx;
  //   this.startPany = pany;
  //   this.panzoomController.moveTo(panx, pany);
  //   this.canvasElement = newcreatedElement.getContext("2d");

  //   this.canvasElement.beginPath();
  //   // this.canvasBlurryRemove(newcreatedElement,this.canvasElement);
  //   this.canvasElement.globalAlpha = getData.opacity;
  //   if (elementId >= 1 && elementId <= 10 && (Number(getData.initial_width) < 35) && (Number(getData.initial_height) < 35) &&
  //     (Number(getData.initial_width) != 0) && (Number(getData.initial_height) != 0)) {
  //     let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
  //     let currentDBgetW = Number(getData.initial_width) - 5;
  //     let currentDBgetH = Number(getData.initial_height) - 5;
  //     let actualratio = actualCanvasWH.width / actualCanvasWH.height;
  //     let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
  //     var scaleFactor1 = 0;
  //     if (actualratio > fixedratio) {
  //       scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
  //     }
  //     else {
  //       scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
  //     }
  //     this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
  //   }
  //   if (elementId >= 12 && elementId <= 18 && Number(getData.initial_width) != 0 && Number(getData.initial_height) != 0) {
  //     let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
  //     let currentDBgetW = Number(getData.initial_width);
  //     let currentDBgetH = Number(getData.initial_height);
  //     let actualratio = actualCanvasWH.width / actualCanvasWH.height;
  //     let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
  //     var scaleFactor1 = 0;
  //     if (actualratio > fixedratio) {
  //       scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
  //     }
  //     else {
  //       scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
  //     }
  //     this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
  //   }
  //   else if ((elementId == 19) && getData.annotation_data.includes('move')) {
  //     let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
  //     let currentDBgetW = Number(getData.initial_width) + 17.5;
  //     let currentDBgetH = Number(getData.initial_height) + 17.5;
  //     let actualratio = actualCanvasWH.width / actualCanvasWH.height;
  //     let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
  //     var scaleFactor1 = 0;
  //     if (actualratio > fixedratio) {
  //       scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
  //     }
  //     else {
  //       scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
  //     }
  //     this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
  //   }
  //   else if (elementId == 20 && getData.annotation_data.includes('move')) {
  //     let actualCanvasWH = this.shapeService.getCanvaswidthandHeight(getData);
  //     let currentDBgetW = Number(getData.initial_width);
  //     let currentDBgetH = Number(getData.initial_height);
  //     let actualratio = (actualCanvasWH.width + 35) / (actualCanvasWH.height + 35);
  //     let fixedratio = Number(currentDBgetW) / Number(currentDBgetH);
  //     var scaleFactor1 = 0;
  //     if (actualratio > fixedratio) {
  //       scaleFactor1 = Number(currentDBgetW) / actualCanvasWH.width;
  //     }
  //     else {
  //       scaleFactor1 = Number(currentDBgetH) / actualCanvasWH.height;
  //     }
  //     this.canvasElement.setTransform(scaleFactor1, 0, 0, scaleFactor1, 0, 0);
  //   }

  //   // To Repoint the drawn shape inside the canvas center.
  //   // --------------
  //   console.log(getStringWidth);
  //   if (getStringWidth != undefined && getData.initial_height == 0) {
  //     let translateWidth = getStringWidth.width - newcreatedElement.width;
  //     let translateHeight = getStringWidth.height - newcreatedElement.height;
  //     let translateX = (translateWidth / 2) + getStringWidth.left;
  //     let translateY = (translateHeight / 2) + getStringWidth.top;
  //     this.canvasElement.translate(-translateX, -translateY);
  //     this.canvasElement.restore();
  //   }
  //   // if (elementId>=12&&getData.initial_position_x != 0&&getData.initial_position_y != 0) {
  //   //   let getDrawWidthandHeight = this.shapeService.getCanvaswidthandHeight(getData); 
  //   //   let translateWidth = getDrawWidthandHeight.width - newcreatedElement.width;
  //   //   let translateHeight = getDrawWidthandHeight.height - newcreatedElement.height;
  //   //   let translateX = (translateWidth / 2) + getDrawWidthandHeight.left;
  //   //   let translateY = (translateHeight / 2) + getStringWidth.top;
  //   //   this.canvasElement.translate(-translateX, -translateY);
  //   //   this.canvasElement.restore();
  //   // }
  //   // ---------------

  //   //Rotate shape drawing setup start
  //   if (getData.initial_rotation != undefined && getData.initial_rotation != 0 && elementId < 12) {
  //     let dx = getData.initial_rotation > 0 ? (getWidth / 2) : (-15);
  //     let dy = getData.initial_rotation > 0 ? (-15) : getHeight / 2;
  //     newcreatedElement.style.transform = 'matrix(' + Math.cos(getData.initial_rotation) + ',' + Math.sin(getData.initial_rotation) + ',' + -(Math.sin(getData.initial_rotation)) + ',' + Math.cos(getData.initial_rotation) + ',' + 0 + ',' + 0 + ')';
  //     console.log('matrix(' + Math.cos(getData.initial_rotation), Math.sin(getData.initial_rotation), -(Math.sin(getData.initial_rotation)), Math.cos(getData.initial_rotation), dx, dy + ')');
  //     // console.log(this.canvasElement.getTransform());
  //     // this.canvasElement.restore();
  //   }
  //   //Rotate shape drawing setup end

  //   // newcreatedElement = this.shapeService.createHIDPIcanvs(getWidth,getHeight,7,newcreatedElement);
  //   // let ratio = 2;
  //   // newcreatedElement.width = newcreatedElement.clientWidth * ratio;
  //   // newcreatedElement.height = newcreatedElement.clientHeight * ratio;
  //   // this.canvasElement.scale(ratio,ratio);
  //   // this.canvasElement.imageSmoothingQuality = "high";
  //   getData.annotation_data = getData.annotation_data.trim();
  //   var spaceSplit = getData.annotation_data.split(" ");

  //   var previous = { x: 0, y: 0 };
  //   var current = { x: 0, y: 0 };
  //   var a = 0;
  //   var last_mousex = this.coordinateX;
  //   var last_mousey = this.coordinateY;
  //   var mousex = 0;
  //   var mousey = 0;
  //   var cpx = 0;
  //   var cpy = 0;
  //   let cp1x = 0;
  //   let cp1y = 0;
  //   let cp2x = 0;
  //   let cp2y = 0;
  //   let cx = 0;
  //   let cy = 0;
  //   for (var i = 0; i < spaceSplit.length; i++) {
  //     var splitString = spaceSplit[i].replaceAll('--', '-n');
  //     splitString = splitString.replaceAll(':-', ':n');
  //     var hypenSplit = splitString.split("-");
  //     for (var j = 0; j < hypenSplit.length; j++) {
  //       var colonSplit = hypenSplit[j].replaceAll('n', '-').split(":");
  //       if (
  //         j == 1 &&
  //         hypenSplit[0] != "curveEnd" &&
  //         hypenSplit[0] != "controlpoint" &&
  //         hypenSplit[0] != "drawRect" &&
  //         hypenSplit[0] != "controlpoint1" &&
  //         hypenSplit[0] != "controlpoint2" &&
  //         hypenSplit[0] != "endCurve"
  //       ) {
  //         //Ellipse negative value is coming convert positive from ipad
  //         var x = parseFloat(colonSplit[0]);
  //         var y = parseFloat(colonSplit[1]);
  //         var w = parseFloat(colonSplit[2]);
  //         var h = parseFloat(colonSplit[3]);

  //         switch (hypenSplit[0]) {
  //           case "move":
  //             if (
  //               getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
  //               getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
  //             ) {
  //               //Freehand shapes except ellipse and rectangle
  //               this.canvasElement.moveTo(
  //                 x - this.coordinateX + 10,
  //                 y - this.coordinateY + 10
  //               );
  //             }
  //             else if (
  //               getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
  //               getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
  //               this.canvasElement.moveTo(
  //                 x,
  //                 y
  //               );
  //             }
  //             else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
  //               //Line and line axial shape
  //               this.canvasElement.moveTo(
  //                 x - this.coordinateX + 10,
  //                 y - this.coordinateY + 10
  //               );
  //             }
  //             else {
  //               //Simple shapes initial
  //               if (elementId == 11) {
  //                 let calHeight = newcreatedElement.clientHeight / 2;
  //                 this.canvasElement.moveTo(x + textShapexyWidth, y + textShapexyHeight);
  //               }
  //               else {
  //                 this.canvasElement.moveTo(x, y);
  //               }
  //             }
  //             if (elementId == 13 && j == 1) {
  //               previous.x = x - this.coordinateX + 10;
  //               previous.y = y - this.coordinateY + 10;
  //               a++;
  //             }
  //             break;
  //           case "line":
  //             this.canvasElement.clearRect(
  //               0,
  //               0,
  //               newcreatedElement.width,
  //               newcreatedElement.height
  //             );
  //             if (
  //               getData.toolbar_element_id >= 12 && Number(getData.initial_height) == 0 &&
  //               getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true
  //             ) {
  //               this.canvasElement.lineTo(
  //                 x - this.coordinateX + 10,
  //                 y - this.coordinateY + 10
  //               );
  //             }
  //             else if (
  //               getData.toolbar_element_id >= 12 && Number(getData.initial_height) != 0 &&
  //               getData.toolbar_element_id <= 20 && getData.toolbar_element_id != 15 && getData.toolbar_element_id != 16 || isnegativeCoordinates == true) {
  //               this.canvasElement.lineTo(
  //                 x,
  //                 y
  //               );
  //             }
  //             else if (getData.toolbar_element_id == 15 || getData.toolbar_element_id == 16 || isnegativeCoordinates == true) {
  //               this.canvasElement.lineTo(
  //                 x - this.coordinateX + 10,
  //                 y - this.coordinateY + 10
  //               );
  //             }
  //             else {
  //               if (elementId == 11) {
  //                 let calHeight = newcreatedElement.clientHeight / 2;
  //                 this.canvasElement.lineTo(x + textShapexyWidth, y + textShapexyHeight);
  //               }
  //               else {
  //                 this.canvasElement.lineTo(x, y);
  //               }
  //             }
  //             break;
  //           case "ovalIn":
  //             if (elementId == 1 || elementId == 8) {
  //               var r = (w * w) / (8 * h) + h / 2;
  //               this.canvasElement.arc(
  //                 newcreatedElement.clientWidth / 2,
  //                 newcreatedElement.clientHeight / 2.3, r, 0, 2 * Math.PI
  //               );
  //             } else if (elementId == 19) {
  //               w = w < 0 ? -(w) : w;
  //               h = h < 0 ? -(h) : h;
  //               w = w;
  //               h = h;
  //               console.log(w, h);
  //               var r = (w * w) / (8 * h) + h / 2;
  //               this.canvasElement.ellipse((w / 2) + 2 + ((Number(getData.line_width) / 2) / 2), (h / 2) + 2 + ((Number(getData.line_width) / 2) / 2), w / 2, h / 2, Math.PI * 1, 0, 2 * Math.PI);
  //             }
  //             break;
  //         }
  //       }
  //       else if (hypenSplit[0] == "controlpoint" || hypenSplit[0] == "curveEnd") {
  //         if (hypenSplit[0] == "controlpoint") {
  //           cpx = parseFloat(colonSplit[0]);
  //           cpy = parseFloat(colonSplit[1]);
  //         }
  //         if (hypenSplit[0] == "curveEnd") {
  //           var ex = parseFloat(colonSplit[0]);
  //           var ey = parseFloat(colonSplit[1]);
  //           if (elementId == 11) {
  //             this.canvasElement.quadraticCurveTo(cpx + textShapexyWidth, cpy + textShapexyHeight, ex + textShapexyWidth, ey + textShapexyHeight);
  //           }
  //           else {
  //             this.canvasElement.quadraticCurveTo(cpx, cpy, ex, ey);
  //           }

  //         }
  //       }
  //       else if (hypenSplit[0] == "controlpoint1" || hypenSplit[0] == "controlpoint2" || hypenSplit[0] == "endCurve" && j == 1) {
  //         if (hypenSplit[0] == "controlpoint1") {
  //           cp1x = parseFloat(colonSplit[0]);
  //           cp1y = parseFloat(colonSplit[1]);
  //         }
  //         else if (hypenSplit[0] == "controlpoint2") {
  //           cp2x = parseFloat(colonSplit[0]);
  //           cp2y = parseFloat(colonSplit[1]);
  //         }
  //         else if (hypenSplit[0] == "endCurve") {
  //           cx = parseFloat(colonSplit[0]);
  //           cy = parseFloat(colonSplit[1]);
  //           this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
  //           this.canvasElement.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
  //         }
  //       }
  //       else if (hypenSplit[0] == "drawRect" && j == 1) {
  //         // let colonSplit = hypenSplit[j].split(":");
  //         colonSplit[0] = Number(colonSplit[0]);
  //         colonSplit[1] = Number(colonSplit[1]);
  //         colonSplit[2] = Number(colonSplit[2]);
  //         colonSplit[3] = Number(colonSplit[3]);
  //         colonSplit[2] = colonSplit[2] < 0 ? -(colonSplit[2]) : colonSplit[2];
  //         colonSplit[3] = colonSplit[3] < 0 ? -(colonSplit[3]) : colonSplit[3];
  //         let rectX = parseFloat(colonSplit[0]);
  //         let rectY = parseFloat(colonSplit[1]);
  //         let rectWidth = parseFloat(colonSplit[2]);
  //         let rectHeight = parseFloat(colonSplit[3]);
  //         console.log(rectWidth, rectHeight);
  //         this.canvasElement.clearRect(0, 0, newcreatedElement.width, newcreatedElement.height);
  //         let rectlineWidth = this.globalLineWidth(getData.line_width);
  //         // newcreatedElement.setAttribute('width',(newcreatedElement.width + rectlineWidth).toString());
  //         // newcreatedElement.setAttribute('height',(newcreatedElement.height + rectlineWidth).toString());
  //         // newcreatedElement.style.top = this.coordinateY - (rectlineWidth/2) + 'px';
  //         // newcreatedElement.style.left = this.coordinateX - (rectlineWidth/2) + 'px';
  //         this.canvasElement.rect(
  //           ((Number(getData.line_width) / 2) / 2) + 1,
  //           ((Number(getData.line_width) / 2) / 2) + 1,
  //           rectWidth,
  //           rectHeight);
  //       }
  //     }
  //   }
  //   if (
  //     elementId != 12 &&
  //     elementId != 14 &&
  //     elementId != 13 &&
  //     elementId != 15
  //   ) {
  //     var checkFill = getData.fill_color;
  //     this.canvasElement.fillStyle = this.checkStrokeColor1(checkFill);
  //     this.canvasElement.fill();
  //   }
  //   if ((elementId == 17 || elementId == 18) && (spaceSplit.length - 1 == i) && (j == 1)) {
  //     console.log(elementId);
  //     this.canvasElement.closePath();
  //   }
  //   // this.canvasElement.drawImage(newcreatedElement,0,0,50,50,0,0,10,50);
  //   // latest
  //   // if (getData.line_width / 5 < 1) {
  //   //   this.canvasElement.lineWidth = 1;
  //   // }
  //   // else {
  //   //   this.canvasElement.lineWidth = this.globalLineWidth(getData.line_width);
  //   // }
  //   // if ((elementId == 15 || elementId == 16 || elementId == 12 || elementId == 13 || elementId == 14) && getData.line_width != 0) {
  //   //   this.canvasElement.lineWidth = this.globalLineWidth(getData.line_width) + 1;
  //   // }
  //   if (elementId < 11) {
  //     this.canvasElement.lineWidth = Number(getData.line_width) / (6);
  //   }
  //   else if (elementId >= 11) {
  //     this.canvasElement.lineWidth = Number(getData.line_width) / (2);
  //   }
  //   this.canvasElement.strokeStyle = this.checkStrokeColor1(getData.stroke_color);
  //   this.canvasElement.stroke();
  //   newcreatedElement.style.overflow = "visible";
  //   newcreatedElement.style.display = "block";
  //   // this.canvasElement.lineCap = "square";
  //   // this.canvasElement.lineJoin = "miter";
  //   // if (elementId >= 12 && elementId <= 18 && getData.initial_height != 0 && getData.initial_width != 0) {
  //   //   newcreatedElement.style.top = Number(this.coordinateY) - (35 / 2) - ((Number(getData.line_width)/2)/2) + 'px';
  //   //   newcreatedElement.style.left = Number(this.coordinateX) - (35 / 2) - ((Number(getData.line_width)/2)/2) + 'px';
  //   // }
  //   // let getimagedata = this.canvasElement.getImageData(0,0,newcreatedElement.width,newcreatedElement.height);
  //   // console.log(getimagedata)
  //   // let imagedata = getimagedata.data;
  //   // for (var i = 0; i < imagedata.length; i+= 4) {
  //   //   imagedata[i] = imagedata[i] ^ 255; // Invert Red
  //   //   imagedata[i+1] = imagedata[i+1] ^ 255; // Invert Green
  //   //   imagedata[i+2] = imagedata[i+2] ^ 255; // Invert Blue
  //   // }
  //   // this.canvasElement.putImageData(getimagedata,0,0);
  // }

  assignDates(option) {

    if (option == "current") {
      return new Date();
    }
    else if (option == "none") {
      return;
    }
    else {
      return option;
    }
  }

  securityCheck() {
    this.baseUrl = environment.APIBaseUrl + "get_web_singed_file?file=";
    this.sKey1 = "&key1=" + this.imgdataService.securityKey1();
    this.sKey2 = "&key2=" + this.imgdataService.securityKey2();

  }



  enablePan() {

    this.panStartOption = true;
  }

  startPan() {

    if (this.panStartOption == true) {

      this.panzoomController.resume();
    }
  }

  stopPan() {

    this.panStartOption = false;
  }

  checkStrokeColor1(checkStroke) {
    if (checkStroke.includes("#")) {
      if (checkStroke == "#NNNNNN00") {
        return "transparent";
      } else {
        return checkStroke;
      }
    }
    else {
      checkStroke = checkStroke.toLowerCase();
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

  globalLineWidth(width) {
    console.log('line width html');
    let linewidth = Number(width);
    let newLineWidth = 0;
    if (linewidth > 30) {
      newLineWidth = linewidth / 5;
    }
    else {
      newLineWidth = linewidth / 5;
    }

    if (newLineWidth < 1) {
      return 1;
    }
    else {
      return newLineWidth;
    }
  }

  changeStringValue(data) {
    let getnewString = this.shapeService.xyPositionDiff(data);
    let getStringValue = getnewString.shapeString;
    return getStringValue;
  }

  changeSource(event, element_id) {
    //sample hiec --> "https://alexcorvi.github.io/heic2any/demo/1.heic"
    // element.src = "assets/images/projectdetails/P3_ImageIcon_Blue600.png";
    console.log(element_id + event.srcElement.currentSrc)
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
    let get_append_parent = document.getElementById('mediaimagehead_preview' + element_id);
    if (get_append_parent != null) {
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
      .then((conversionResult: any) => {
        var url = URL.createObjectURL(conversionResult);
        let element: any = document.getElementById("imageviewer" + element_id);
        element.src = url;
        let getElement_Loader = document.getElementById('mediaimageheadLoader' + element_id);
        if (getElement_Loader != null) {
          getElement_Loader.remove();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  changeSource1(event, element_id) {
    //sample hiec --> "https://alexcorvi.github.io/heic2any/demo/1.heic"
    // element.src = "assets/images/projectdetails/P3_ImageIcon_Blue600.png";
    console.log(element_id + event.srcElement.currentSrc)
    let createElement = document.createElement('img');
    createElement.setAttribute('src', "assets/images/spin.gif");
    createElement.setAttribute('id', 'mediaimageshowLoader' + element_id);
    createElement.style.position = "absolute";
    createElement.style.top = "50%";
    createElement.style.left = "50%";
    createElement.style.height = "50px";
    createElement.style.width = "50px";
    createElement.style.marginLeft = "-25px";
    createElement.style.marginTop = "-25px";
    let get_append_parent = document.getElementById('imageslideshow');
    if (get_append_parent != null) {
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
      .then((conversionResult: any) => {
        var url = URL.createObjectURL(conversionResult);
        let element: any = document.getElementById("imageviewershow" + element_id);
        element.src = url;
        let getElement_Loader = document.getElementById('mediaimageshowLoader' + element_id);
        if (getElement_Loader != null) {
          getElement_Loader.remove();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

}

// http://localhost:4200/annotationView?layer_id=8-E42348F0-8259-11EB-83B6-57AED4630D0D-1615460815615&annotation_id=8-896B5C10-8293-11EB-8BA4-C9E482B133D3-1615485574225
// http://localhost:4200/annotationView?layer_id=8-E42348F0-8259-11EB-83B6-57AED4630D0D-1615460815615&annotation_id=8-D8A77A70-8293-11EB-8BA4-C9E482B133D3-1615485707159
// http://localhost:4200/annotationView?layer_id=8-E42348F0-8259-11EB-83B6-57AED4630D0D-1615460815615&annotation_id=8-F826D530-8293-11EB-8BA4-C9E482B133D3-1615485760003

// http://localhost:4200/annotationView?layer_id=8-7A28FFB0-810C-11EB-A67E-9B68966943CD-1615317615403&annotation_id=8-21159890-829A-11EB-8AE0-81A49CE5D484-1615488405657



// "8-71530930-810C-11EB-A67E-9B68966943CD-1615317600579"