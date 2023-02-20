import { Component, Inject, Input, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { FormmappingService } from "../../services/formmapping.service";
import { ToolbardesignService } from "src/app/toolbar/services/toolbardesign.service";
import { DataserviceService } from "../../services/dataservice.service";

// import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";

import { CreateDocumentService } from "../../services/create-document.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import _ from "lodash";
import { isThisSecond } from "date-fns";
import { DataService } from "src/app/data.service";
import { createDocumentVar } from "../createdocumentvariables";
import { ShapeService } from "../../services/shape.service";
import { DocumentPagesService } from "../../services/document-pages.service";
import { linewidthchanges } from "../documentfunctions1";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { DocumenttagService } from "../../services/documenttag.service";
import { HttpEventType } from "@angular/common/http";

@Component({
  selector: "app-searchpage",
  templateUrl: "./searchpage.component.html",
  styleUrls: ["./searchpage.component.css"],
})
export class SearchpageComponent implements OnInit, OnDestroy, AfterViewInit {
  annotationsList: any[] = [];
  toolbarItem: any[] = [];
  id: any;
  Attributes: boolean = false;
  data: any[];
  datas: any[];
  show: boolean = false;
  searchWord: string = "";
  layerDatas: any;
  settingAPIValue: any;
  changeArrow: boolean = false;
  propertiesannotationData: any[];
  propertiesannotationDataString: string;
  multipleSelectOn: boolean = false;
  currentpageidsearch: string = "";
  buttonColors: { color: string, checkedvalue: boolean }[] = [
    { color: "blue", checkedvalue: false },
    { color: "red", checkedvalue: false },
    { color: "orange", checkedvalue: false },
    { color: "yellow", checkedvalue: false },
    { color: "green", checkedvalue: false },
    { color: "default_blue", checkedvalue: false },
    { color: "purple", checkedvalue: false },
    { color: "pink", checkedvalue: false },
  ];
  buttonColors2: { color: string, checkedvalue: boolean }[] = [
    { color: "dark_pink", checkedvalue: false },
    { color: "light_blue", checkedvalue: false },
    { color: "brown", checkedvalue: false },
    { color: "grey", checkedvalue: false },
    { color: "medium_grey", checkedvalue: false },
    { color: "light_grey", checkedvalue: false },
    { color: "white", checkedvalue: false },
  ];

  //   shapeList:any[] = ['Circle','Octagon','Square','Triangle','Star','Diamond','Camera','Arrow','Text','Freehand Line','Polyline Arrow',
  // 'Polyline','Line','Line Axial','Polygon','Freehand Area','Ellipse','Rectangle'];

  shapesList: any[] = [{ shape1: 'Circle', shape2: 'Freehand Line' }, { shape1: 'Octagon', shape2: 'Polyline Arrow' }, { shape1: 'Square', shape2: 'Polyline' },
  { shape1: 'Triangle', shape2: 'Line' }, { shape1: 'Star', shape2: 'Line Axial' }, { shape1: 'Diamond', shape2: 'Polygon' }, { shape1: 'Flag', shape2: 'Freehand Area' },
  { shape1: 'Camera', shape2: 'Ellipse' },
  { shape1: 'Arrow', shape2: 'Rectangle' }, { shape1: 'Text', shape2: '' }]


  singleannotationIds: string[] = [];
  documentAnnotations = [];
  checkStub: boolean = false;
  filterAnnotations: any[] = [];
  changeViewWidth: number = 398;
  getlayerData$: Subscription;
  tagchecked: boolean = false;
  folderId: string;
  projectId: string;
  refresh: boolean = false;
  clonedata: any[];
  currentPageLayerData: any[] = [];
  @Input() msgFromParent1: boolean;
  @Input() msgFromParent2: any;
  @Input() msgFromParent3: any;
  @Input() displayannotation_search: any;
  ids_remover$: Subscription = null;
  ids_getting$: Subscription = null;
  searchannotationIds: string[] = [];
  coordinateX: number = 0;
  coordinateY: number = 0;
  userlist: any[] = [];
  documentAnnotations_svg_view: any[] = [];
  documentAnnotations_svg_view_backup: any[] = [];
  searchOptionEmitter$: Subscription = null;
  searchAnnotations: any = [];
  allannotattion: boolean = true;
  allChecked: boolean = true;
  mediaChecked: boolean = false;
  formChecked: boolean = false;
  stubAllow: boolean = false;
  mediaAllow: boolean = false;
  formsAllow: boolean = false;
  tagallow: boolean = false;
  shapeAllow: boolean = false;
  shapeColorAllow: boolean = false;
  selectAnnotationNames: string[] = [];
  color: string = "";
  fillColorCheck: boolean = false;
  fillColorsArray: any[] = [];
  filter_annotation_ids: string[] = [];
  loadingtype: string = "loading..."
  circleLoader: boolean = false;
  loadingPercentage:number = 0;

  checkboxvalidation: any;

  constructor(
    public dataService: DataserviceService,
    private datePipe: DatePipe,
    private documentService: CreateDocumentService, private route: ActivatedRoute,
    private dataService4: DataService,
    private documentPage_search: DocumentPagesService,
    private encrptdecrpt: EncryptDecryptService,
    private documentService_1: DocumenttagService,
  ) {
    console.log(this.displayannotation_search, this.msgFromParent1);
    this.folderId = this.route.snapshot.queryParamMap.get("folderId");
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    this.currentpageidsearch = this.encrptdecrpt.getItem(this.projectId + "currentpage")
    this.documentAnnotations = this.displayannotation_search;
    if (this.currentpageidsearch != null || this.currentpageidsearch != undefined) {
      // this.show = true;
      this.circleLoader = true;
      this.getlayerdatafromapi()
    }

    this.ids_remover$ = this.dataService.getannotationid.subscribe(ids => {
      console.log(ids);
      if (typeof ids === 'string') {
        if (ids != "") {
          this.searchannotationIds = [];
          this.searchannotationIds.push(ids);
        }
        else {
          this.searchannotationIds = [];
        }
      }
      else {
        this.searchannotationIds = ids;
      }
    });

    this.ids_getting$ = this.dataService.search_annotation.subscribe((res) => {
      this.documentAnnotations = this.displayannotation_search;
      if(res!=undefined){
        console.log(Array.isArray(res));
        var multiselect=Array.isArray(res);
        if(multiselect==true){
          var data=res;
          for(var j=0;j<data.length;j++){
            if(this.documentAnnotations_svg_view!=null && this.documentAnnotations_svg_view.length>0){
              var index1=this.documentAnnotations_svg_view.findIndex(item=>item.annotation_id===data[j].annotation_id);
              this.documentAnnotations_svg_view.splice(index1,1);
            }
          }
          var copppy=_.cloneDeep(this.documentAnnotations_svg_view);
          this.documentAnnotations_svg_view=[];
          this.documentAnnotations_svg_view=copppy;
        }  
        else{
          var index=this.documentAnnotations_svg_view.findIndex(item=>item.annotation_id===res);
          if(index!=-1){
            var coppy=_.cloneDeep(this.documentAnnotations_svg_view);
            this.documentAnnotations_svg_view=[];
            coppy.splice(index,1);
            this.documentAnnotations_svg_view=coppy;
          } 
        }   
      }
      this.single_convertShapeSvg(this.displayannotation_search[this.displayannotation_search.length - 1]);
    })

    // this.dataService.currentpageidsearch.subscribe((response) => {
    //   this.currentpageidsearch = response;
    //   console.log(this.currentpageidsearch)
    //   this.getlayerdatafromapi()
    // });

    // this.dataService.searchannotationCheckbox.subscribe((status)=>{
    //   if(status==false){
    //     this.searchannotationIds = [];
    //   }
    // })

    this.searchOptionEmitter$ = this.dataService.searchoption.subscribe((status) => {
      console.log(status)
      this.show = true;
      this.circleLoader = true;
      if (status) {
        this.currentpageidsearch = this.encrptdecrpt.getItem(this.projectId + "currentpage")
        this.getlayerdatafromapi();
      }
    })

  }

  getlayerdatafromapi() {
    var start = new Date().getTime();
    console.log('getAnnotation api' + ' Start time: ' + start);
    let percentage_loading = 0;
    this.documentService.getAnnotationFormlist_search(this.projectId, this.folderId, this.currentpageidsearch).subscribe((data: any) => {
      console.log(HttpEventType,data);
      if (data.type === HttpEventType.DownloadProgress) {
        percentage_loading = Math.round(100 * data.loaded / data.total);
        console.log(percentage_loading);
        this.loadingPercentage = percentage_loading;
      }
      if (data.type === HttpEventType.Response && data["body"]["response_code"] == 200) {
        var end = new Date().getTime();
        var time = end - start;
        console.log('getAnnotation api' + ' end time: ' + end);
        console.log('getAnnotation api' + ' Execution time: ' + time);
        let initial_layer_data = data["body"]["response_body"]["layer_data"];
       this.checkboxvalidation=initial_layer_data
       console.log(this.checkboxvalidation)
      for(let i=0;i<this.checkboxvalidation.length;i++){
        for(let j=0;j<this.checkboxvalidation[i].annotations.length;j++){
          console.log(this.checkboxvalidation[i].annotations)
          for(let k=0;k<this.checkboxvalidation[i].associated_pages.length;k++){
            if(this.checkboxvalidation[i].associated_pages[k].is_lock==false) {
          this.checkboxvalidation[i].annotations[j].invalid_check=false
          }
          else{
            this.checkboxvalidation[i].annotations[j].invalid_check=true
          }
        }
        }

      }
      console.log(this.checkboxvalidation)
        this.documentAnnotations = [];
        this.userlist = data["body"]["response_body"]["user_list"];
        for (let ma = 0; ma < initial_layer_data.length; ma++) {
          let filterPageValue = initial_layer_data[ma].associated_pages.filter((pageMap) => pageMap.page_id == this.currentpageidsearch);
          if (filterPageValue.length > 0) {
            if ((filterPageValue[0].is_removed == 'false' || filterPageValue[0].is_removed == false || filterPageValue[0].is_removed == "0" || filterPageValue[0].is_removed == 0)) {
              let filterRemoveAnnotation = initial_layer_data[ma].annotations.filter((AData) => {
                if ((AData.is_removed == 'false' || AData.is_removed == false || AData.is_removed == "0" || AData.is_removed == 0) && !AData.annotation_id.includes('-scale')) {
                  return AData;
                }
              });
              initial_layer_data[ma].annotations = filterRemoveAnnotation;
              this.documentAnnotations = [...this.documentAnnotations, ...filterRemoveAnnotation];
            }
          }
        }
        if (this.documentAnnotations.length > 0) {
          // this.searchAnnotations = this.documentAnnotations;
          // this.filterAnnotations = this.documentAnnotations;
          // search svg drawing
          this.convertShapeSvg();
          this.show = false;
          if(percentage_loading == 100){
            setTimeout(()=>{
              this.circleLoader = false;
            },1000)    
          }
          // let filter_annotation_ids = [];
          // for (let ad = 0; ad < annotation_numbers.length; ad++) {
          //   filter_annotation_ids.push(annotation_numbers[ad].annotation_id);
          // }
          var start_data = new Date().getTime();
          console.log('getAnnotation data api' + ' Start time: ' + start_data);
          // this.documentService.getMultipleAnnotationData(filter_annotation_ids).subscribe((response) => {
          //   console.log(response);
          //   if (response["response_code"] == 200) {
          //     var end_data = new Date().getTime();
          //     var time_data = end_data - start_data;
          //     console.log('getAnnotation data api' + ' end time: ' + end_data);
          //     console.log('getAnnotation data api' + ' Execution time: ' + time_data);
          //     this.documentAnnotations = response["response_body"]["annotation_data"];
          //     for (let dc = 0; dc < this.documentAnnotations.length; dc++) {
          //       // convert special characters
          //       let get_db_data = this.documentAnnotations[dc];
          //       get_db_data.annotation_name = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_name);
          //       get_db_data.annotation_label = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_label);
          //       get_db_data.annotation_tags = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_tags);
          //       get_db_data.annotation_data = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_data);
          //       if (get_db_data.annotation_forms.length > 0) {
          //         for (let fi = 0; fi < get_db_data.annotation_forms.length; fi++) {
          //           get_db_data.annotation_forms[fi].form_name = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_forms[fi].form_name);
          //           let get_cur_formdata = get_db_data.annotation_forms[fi].form_data;
          //           if (Array.isArray(get_cur_formdata)) {
          //             if (get_cur_formdata.length > 0) {
          //               get_db_data.annotation_forms[fi].form_data = this.dataService4.formfieldviewcharacter(get_cur_formdata, 'annotationgetformview');
          //             }
          //           }
          //         }
          //       }
          //       if (get_db_data.annotation_links.length > 0) {
          //         if (Array.isArray(get_db_data.annotation_links)) {
          //           for (let li = 0; li < get_db_data.annotation_links.length; li++) {
          //             get_db_data.annotation_links[li].link_type = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_links[li].link_type);
          //             if (get_db_data.annotation_links[li].hasOwnProperty('location')) {
          //               get_db_data.annotation_links[li].location = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_links[li].location);
          //             }
          //           }
          //         }
          //       }
          //       if (get_db_data.annotation_media.length > 0) {
          //         if (Array.isArray(get_db_data.annotation_media)) {
          //           for (let li = 0; li < get_db_data.annotation_media.length; li++) {
          //             get_db_data.annotation_media[li].media_name = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_media[li].media_name);
          //             get_db_data.annotation_media[li].media_comment = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_media[li].media_comment);
          //             if (get_db_data.annotation_media[li].hasOwnProperty("media_tags")) {
          //               get_db_data.annotation_media[li].media_tags = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_media[li].media_tags);
          //             }
          //           }
          //         }
          //       }
          //       this.documentAnnotations[dc] = get_db_data;
          //       let annot_data = Object.assign({}, this.documentAnnotations[dc]);
          //       let convert_date_format_create = this.datePipe.transform(annot_data.created_date, "MM/dd/yyyy 'at' h:mm a");
          //       annot_data.last_updated_date = annot_data.last_updated_date != undefined ? annot_data.last_updated_date : annot_data.created_date;
          //       let convert_date_format_update = this.datePipe.transform(annot_data.last_updated_date, "MM/dd/yyyy 'at' h:mm a");
          //       annot_data.created_date = convert_date_format_create;
          //       annot_data.last_updated_date = convert_date_format_update;
          //       let tags = annot_data.annotation_tags.toString();
          //       annot_data.annotation_tags = tags.split(",");
          //       this.documentAnnotations[dc] = annot_data;
          //     }
          //     this.searchAnnotations = this.documentAnnotations;
          //     this.filterAnnotations = this.documentAnnotations;
          //     // search svg drawing
          //     this.convertShapeSvg();
          //   }

          // });
        }
        else {
          this.documentAnnotations = [];
          this.searchAnnotations = [];
          // this.filterAnnotations = [];
          this.documentAnnotations_svg_view = [];
          this.show = false;
        this.circleLoader = false;
        }
      }
      else if(data.type === HttpEventType.Response && data.status != 200 && data["body"]["response_code"] != 200) {
        this.documentAnnotations = [];
        this.searchAnnotations = [];
        // this.filterAnnotations = [];
        this.show = false;
        this.circleLoader = false;
      }
    }
    );
    // this.show = false;
  }

  ngOnInit(): void {
 
    console.log(this.msgFromParent2,this.msgFromParent3);
    if (this.msgFromParent2 != undefined && this.msgFromParent1 == true) {
      this.searchannotationIds = Object.assign([], this.msgFromParent2);
    }
    else if (this.msgFromParent3 != undefined && this.msgFromParent1 == false) {
      this.searchannotationIds = Object.assign([], this.msgFromParent3);
    }
    console.log(this.layerDatas)
  }

  ngAfterViewInit(): void {
    this.makeResizableDiv();
    console.log(this.displayannotation_search);
  }

  // trackChatMessage(index: number, documentAnnotations:any) {
  //   return documentAnnotations.annotation_id;
  // }

  attributeClick(e) {
    this.Attributes = e.target.checked;
    if (this.Attributes == true) {
      this.allChecked = false;
      this.annotationfilter();
      // this.setFillColor('');
    }
    else {

      this.annotationfilter();
    }
    console.log(this.Attributes);
  }

  // applyFilter(filtervalue){
  //   let searchItems = this.searchAnnotations;
  //   let searchTags = this.searchAnnotations;
  //   var a = filtervalue;
  //   if (filtervalue.length != 0) {
  //     console.log(searchItems);
  //     if (searchItems != undefined) {
  //       var annofilter = [];
  //       searchItems.forEach((data) => {
  //         if (data.annotation_name.toLowerCase().includes(a.toLowerCase()) || data.created_date.includes(a) ||
  //           (data.last_updated_date != undefined ? data.last_updated_date.includes(a) : data.created_date.includes(a)) ||
  //           data.annotation_tags.some((tag) => tag.toLowerCase().includes(a.toLowerCase()))) {
  //           annofilter.push(data);
  //         }

  //         else {
  //           let getuserId = data.created_by_user_id;
  //           let user_find = data.updated_by_user_id;
  //           let getvalidusername_created = this.getcreated(getuserId);
  //           let getvalidusername_modified = this.getmodified(getuserId);
  //           if (getvalidusername_created.toLowerCase().includes(a.toLowerCase()) || getvalidusername_modified.toLowerCase().includes(a.toLowerCase())) {
  //             annofilter.push(data);
  //           }
  //         }
  //       });
  //       if (this.allChecked == false) {
  //         console.log("SS")
  //         for (let k = 0; k < searchTags.length; k++) {
  //           let forms_accept = false;
  //           let check_stub = false;
  //           for (let l = 0; l < searchTags[k].annotation_forms.length; l++) {
  //             for (let m = 0; m < searchTags[k].annotation_forms[l].form_data.length; m++) {
  //               if (searchTags[k].annotation_forms[l].form_data[m].element_type == 'multiple_choice' ||
  //                 searchTags[k].annotation_forms[l].form_data[m].element_type == 'single_choice' ||
  //                 searchTags[k].annotation_forms[l].form_data[m].element_type == 'dropdown' || searchTags[k].annotation_forms[l].form_data[m].element_type == 'checkbox') {
  //                 for (let n = 0; n < searchTags[k].annotation_forms[l].form_data[m].element_data.options.length; n++) {
  //                   if (searchTags[k].annotation_forms[l].form_data[m].element_data.options[n].name != undefined &&
  //                     searchTags[k].annotation_forms[l].form_data[m].element_data.options[n].name != "") {
  //                     if (searchTags[k].annotation_forms[l].form_data[m].element_data.options[n].name.toString().toLowerCase().includes(a.toLowerCase())) {
  //                       annofilter.push(searchTags[k]);
  //                       forms_accept = true;
  //                     }
  //                   }
  //                 }
  //               }
  //               else if ((searchTags[k].annotation_forms[l].form_data[m].element_type != 'multiple_choice' ||
  //                 searchTags[k].annotation_forms[l].form_data[m].element_type != 'single_choice' ||
  //                 searchTags[k].annotation_forms[l].form_data[m].element_type != 'dropdown' ||
  //                 searchTags[k].annotation_forms[l].form_data[m].element_type != 'date' ||
  //                 searchTags[k].annotation_forms[l].form_data[m].element_type != 'address') &&
  //                 searchTags[k].annotation_forms[l].form_data[m].element_data.default_value != undefined &&
  //                 searchTags[k].annotation_forms[l].form_data[m].element_data.default_value != "") {
  //                 console.log(searchTags[k].annotation_forms[l].form_data[m].element_data.default_value);
  //                 if (searchTags[k].annotation_forms[l].form_data[m].element_data.default_value.toString().toLowerCase().includes(a.toLowerCase())) {
  //                   annofilter.push(searchTags[k]);
  //                   forms_accept = true;
  //                 }
  //               }
  //               else if (searchTags[k].annotation_forms[l].form_data[m].element_type == 'date') {
  //                 if (searchTags[k].annotation_forms[l].form_data[m].element_data.default_date_time.toString().toLowerCase().includes(a.toLowerCase())) {
  //                   annofilter.push(searchTags[k]);
  //                   forms_accept = true;
  //                 }
  //               }
  //               else if (searchTags[k].annotation_forms[l].form_data[m].element_type == 'address') {
  //                 if (searchTags[k].annotation_forms[l].form_data[m].element_data.street_address1.toLowerCase().includes(a.toLowerCase()) ||
  //                   searchTags[k].annotation_forms[l].form_data[m].element_data.street_address2.toLowerCase().includes(a.toLowerCase()) ||
  //                   searchTags[k].annotation_forms[l].form_data[m].element_data.state.toLowerCase().includes(a.toLowerCase()) ||
  //                   searchTags[k].annotation_forms[l].form_data[m].element_data.city.toLowerCase().includes(a.toLowerCase()) ||
  //                   searchTags[k].annotation_forms[l].form_data[m].element_data.zip.toLowerCase().includes(a.toLowerCase())) {
  //                   annofilter.push(searchTags[k]);
  //                   forms_accept = true;
  //                 }
  //               }
  //               else if (searchTags[k].annotation_forms[l].form_data[m].element_type == 'calculation') {
  //                 if (searchTags[k].annotation_forms[l].form_data[m].element_data.calculation.toString().toLowerCase().includes(a.toLowerCase())) {
  //                   annofilter.push(searchTags[k]);
  //                   forms_accept = true;
  //                 }
  //               }
  //             }
  //           }
  //           if (searchTags[k].annotation_media.length > 0 && forms_accept == false && (this.checkStub == true)) {

  //             let filter_stubs = searchTags[k].annotation_media.filter((data_url) => data_url.media_url == '');
  //             let find_exist_ornot = filter_stubs.some((datamedia) => datamedia.media_name.toLowerCase().includes(a.toLowerCase()));
  //             if (find_exist_ornot == true) {
  //               annofilter.push(searchTags[k]);
  //               console.log(find_exist_ornot);
  //               check_stub = true;
  //             }
  //           }
  //           if (searchTags[k].annotation_media.length > 0 && forms_accept == false && check_stub == false && this.mediaChecked == true) {
  //             let filter_photos = searchTags[k].annotation_media.filter((data_url) => data_url.media_url != '');
  //             let find_exist_ornot = filter_photos.some((datamedia) => datamedia.media_name.toLowerCase().includes(a.toLowerCase()));
  //             if (find_exist_ornot == true) {
  //               annofilter.push(searchTags[k]);
  //               console.log(find_exist_ornot);
  //             }
  //           }
  //         }
  //         console.log(annofilter);
  //       }
  //     }
  //     else {
  //       var annofilter: any[] = [];
  //     }
  //   } else {
  //     this.documentAnnotations = this.searchAnnotations;
  //   }

  //   if (a.length > 0) {
  //     let arrResult = annofilter;
  //     let setObj = new Set();
  //     console.log(annofilter);
  //     let findDuplicate = arrResult.reduce((acc, item) => {
  //       if (!setObj.has(item.annotation_id)) {
  //         setObj.add(item.annotation_id);
  //         acc.push(item);
  //       }
  //       return acc;
  //     }, []);
  //     console.log(findDuplicate);
  //     this.documentAnnotations = findDuplicate;
  //     this.convertShapeSvg();
  //   }
  //   else if (a.length == 0) {
  //     this.annotationfilter();
  //   }
  //   console.log(this.documentAnnotations);
  // };

  applyFilter(filtervalue) {
    let searchItems = this.searchAnnotations;
    let searchTags = this.searchAnnotations;
    var a = filtervalue;
    if (filtervalue.length != 0) {
      console.log(searchItems);
      if (searchItems != undefined) {
        var annofilter = [];
        searchItems.forEach((data) => {
          if (data.annotation_name.toLowerCase().includes(a.toLowerCase()) || data.created_date.includes(a) ||
            (data.last_updated_date != undefined ? data.last_updated_date.includes(a) : data.created_date.includes(a)) ||
            data.annotation_tags.some((tag) => tag.toLowerCase().includes(a.toLowerCase()))) {
            annofilter.push(data);
          }

          else {
            let getuserId = data.created_by_user_id;
            let user_find = data.updated_by_user_id;
            let getvalidusername_created = this.getcreated(getuserId);
            let getvalidusername_modified = this.getmodified(getuserId);
            if (getvalidusername_created.toLowerCase().includes(a.toLowerCase()) || getvalidusername_modified.toLowerCase().includes(a.toLowerCase())) {
              annofilter.push(data);
            }
          }
        });
        if (this.allChecked == false) {
          for (let k = 0; k < searchTags.length; k++) {
            let forms_accept = false;
            let check_stub = false;
            for (let l = 0; l < searchTags[k].annotation_forms.length; l++) {
              for (let m = 0; m < searchTags[k].annotation_forms[l].form_data.length; m++) {
                if (searchTags[k].annotation_forms[l].form_data[m].element_type == 'multiple_choice' ||
                  searchTags[k].annotation_forms[l].form_data[m].element_type == 'single_choice' ||
                  searchTags[k].annotation_forms[l].form_data[m].element_type == 'dropdown' || searchTags[k].annotation_forms[l].form_data[m].element_type == 'checkbox') {
                  for (let n = 0; n < searchTags[k].annotation_forms[l].form_data[m].element_data.options.length; n++) {
                    if (searchTags[k].annotation_forms[l].form_data[m].element_data.options[n].name != undefined &&
                      searchTags[k].annotation_forms[l].form_data[m].element_data.options[n].name != "") {
                      if (searchTags[k].annotation_forms[l].form_data[m].element_data.options[n].name.toString().toLowerCase().includes(a.toLowerCase())) {
                        annofilter.push(searchTags[k]);
                        forms_accept = true;
                      }
                    }
                  }
                }
                else if ((searchTags[k].annotation_forms[l].form_data[m].element_type != 'multiple_choice' ||
                  searchTags[k].annotation_forms[l].form_data[m].element_type != 'single_choice' ||
                  searchTags[k].annotation_forms[l].form_data[m].element_type != 'dropdown' ||
                  searchTags[k].annotation_forms[l].form_data[m].element_type != 'date' ||
                  searchTags[k].annotation_forms[l].form_data[m].element_type != 'address') &&
                  searchTags[k].annotation_forms[l].form_data[m].element_data.default_value != undefined &&
                  searchTags[k].annotation_forms[l].form_data[m].element_data.default_value != "") {
                  console.log(searchTags[k].annotation_forms[l].form_data[m].element_data.default_value);
                  if (searchTags[k].annotation_forms[l].form_data[m].element_data.default_value.toString().toLowerCase().includes(a.toLowerCase())) {
                    annofilter.push(searchTags[k]);
                    forms_accept = true;
                  }
                }
                else if (searchTags[k].annotation_forms[l].form_data[m].element_type == 'date') {
                  if (searchTags[k].annotation_forms[l].form_data[m].element_data.default_date_time.toString().toLowerCase().includes(a.toLowerCase())) {
                    annofilter.push(searchTags[k]);
                    forms_accept = true;
                  }
                }
                else if (searchTags[k].annotation_forms[l].form_data[m].element_type == 'address') {
                  if (searchTags[k].annotation_forms[l].form_data[m].element_data.street_address1.toLowerCase().includes(a.toLowerCase()) ||
                    searchTags[k].annotation_forms[l].form_data[m].element_data.street_address2.toLowerCase().includes(a.toLowerCase()) ||
                    searchTags[k].annotation_forms[l].form_data[m].element_data.state.toLowerCase().includes(a.toLowerCase()) ||
                    searchTags[k].annotation_forms[l].form_data[m].element_data.city.toLowerCase().includes(a.toLowerCase()) ||
                    searchTags[k].annotation_forms[l].form_data[m].element_data.zip.toLowerCase().includes(a.toLowerCase())) {
                    annofilter.push(searchTags[k]);
                    forms_accept = true;
                  }
                }
                else if (searchTags[k].annotation_forms[l].form_data[m].element_type == 'calculation') {
                  if (searchTags[k].annotation_forms[l].form_data[m].element_data.calculation.toString().toLowerCase().includes(a.toLowerCase())) {
                    annofilter.push(searchTags[k]);
                    forms_accept = true;
                  }
                }
              }
            }
            if (searchTags[k].annotation_media.length > 0 && forms_accept == false && (this.checkStub == true)) {
              let filter_stubs = searchTags[k].annotation_media.filter((data_url) => data_url.media_url == '');
              let find_exist_ornot = filter_stubs.some((datamedia) => datamedia.media_name.toLowerCase().includes(a.toLowerCase()));
              if (find_exist_ornot == true) {
                annofilter.push(searchTags[k]);
                console.log(find_exist_ornot);
                check_stub = true;
              }
            }
            if (searchTags[k].annotation_media.length > 0 && forms_accept == false && check_stub == false && this.mediaChecked == true) {
              let filter_photos = searchTags[k].annotation_media.filter((data_url) => data_url.media_url != '');
              let find_exist_ornot = filter_photos.some((datamedia) => datamedia.media_name.toLowerCase().includes(a.toLowerCase()));
              if (find_exist_ornot == true) {
                annofilter.push(searchTags[k]);
                console.log(find_exist_ornot);
              }
            }
          }
          console.log(annofilter);
        }
      }
      else {
        var annofilter: any[] = [];
      }
    } else {
      this.documentAnnotations = this.searchAnnotations;
    }

    if (a.length > 0) {
      let arrResult = annofilter;
      let setObj = new Set();
      console.log(annofilter);
      let findDuplicate = arrResult.reduce((acc, item) => {
        if (!setObj.has(item.annotation_id)) {
          setObj.add(item.annotation_id);
          acc.push(item);
        }
        return acc;
      }, []);
      console.log(findDuplicate);
      this.documentAnnotations = findDuplicate;
      this.convertShapeSvg();
    }
    else if (a.length == 0) {
      this.annotationfilter();
    }
    console.log(this.documentAnnotations);
  };

  // annotationfilter() {
  //   console.log(this.tagchecked, this.formChecked, this.checkStub, this.mediaChecked);
  //   this.shapeAllow = false;
  //   let annotationdata = this.filterAnnotations.filter((item) => {
  //     console.log(this.tagchecked, this.formChecked, this.checkStub, this.mediaChecked);
  //     if (this.tagchecked == false && this.formChecked == false && this.checkStub == false && this.mediaChecked == false) {
  //       this.allChecked = true;
  //       console.log(this.allChecked)
  //       return true;
  //     }
  //     else if (this.mediaChecked == true && this.checkStub && this.formChecked && this.tagchecked) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;
  //       annotationMedia.forEach((data) => {
  //         if (data.media_url != "") {
  //           this.mediaAllow = true;
  //         }
  //       });

  //       if (this.mediaAllow == true) {
  //         this.mediaAllow = false;
  //         let annotationMedia = item.annotation_media;
  //         annotationMedia.forEach((data) => {
  //           if (data.media_url == "") {
  //             this.stubAllow = true;
  //           }
  //         });
  //       }
  //       if (this.stubAllow == true) {
  //         this.stubAllow = false;
  //         if (item.annotation_forms.length > 0) {
  //           this.formsAllow = true;
  //         }
  //       }

  //       if (this.formsAllow == true) {
  //         this.formsAllow = false;
  //         let annotationtag = item.annotation_tags;
  //         annotationtag.forEach((data) => {
  //           console.log(data)
  //           if (data != "") {
  //             this.tagallow = true;
  //           }
  //         });
  //       }

  //       if (this.tagallow == true) {
  //         this.tagallow = false;
  //         return true;
  //       }
  //       console.log(this.shapeAllow, this.fillColorsArray.length, this.selectAnnotationNames.length);
  //     }
  //     else if (this.mediaChecked == true && this.checkStub && this.formChecked) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;
  //       annotationMedia.forEach((data) => {
  //         if (data.media_url != "") {
  //           this.mediaAllow = true;
  //         }
  //       });
  //       if (this.mediaAllow == true) {
  //         this.mediaAllow = false;
  //         let annotationMedia = item.annotation_media;
  //         annotationMedia.forEach((data) => {
  //           if (data.media_url == "") {
  //             this.stubAllow = true;
  //           }
  //         });
  //       }
  //       if (this.stubAllow == true) {
  //         this.stubAllow = false;
  //         if (item.annotation_forms.length > 0) {
  //           return true;
  //         }
  //       }
  //     }
  //     else if (this.tagchecked == true && this.checkStub && this.formChecked) {
  //       this.allChecked = false;
  //       let annotationtag = item.annotation_tags;
  //       annotationtag.forEach((data) => {
  //         console.log(data)
  //         if (data != "") {
  //           this.tagallow = true;
  //         }
  //       });
  //       if (this.tagallow == true) {
  //         this.tagallow = false;
  //         let annotationMedia = item.annotation_media;
  //         annotationMedia.forEach((data) => {
  //           if (data.media_url == "") {
  //             this.stubAllow = true;
  //           }
  //         });
  //       }
  //       if (this.stubAllow == true) {
  //         this.stubAllow = false;
  //         if (item.annotation_forms.length > 0) {
  //           return true;
  //         }
  //       }
  //     }
  //     else if (this.mediaChecked == true && this.tagchecked && this.formChecked) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;
  //       annotationMedia.forEach((data) => {
  //         if (data.media_url != "") {
  //           this.mediaAllow = true;
  //         }
  //       });
  //       if (this.mediaAllow == true) {
  //         this.mediaAllow = false;
  //         if (item.annotation_forms.length > 0) {
  //           this.formsAllow = true;
  //         }
  //       }
  //       if (this.formsAllow == true) {
  //         this.formsAllow = false;
  //         let annotationtag = item.annotation_tags;
  //         annotationtag.forEach((data) => {
  //           console.log(data)
  //           if (data != "") {
  //             this.tagallow = true;
  //           }
  //         });
  //       }
  //       if (this.tagallow == true) {
  //         this.tagallow = false;
  //         return true;
  //       }
  //     }
  //     else if (this.mediaChecked == true && this.checkStub) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;
  //       annotationMedia.forEach((data) => {
  //         if (data.media_url != "") {
  //           this.mediaAllow = true;
  //         }
  //       });
  //       if (this.mediaAllow == true) {
  //         this.mediaAllow = false;
  //         let annotationMedia = item.annotation_media;
  //         annotationMedia.forEach((data) => {
  //           if (data.media_url == "") {
  //             this.stubAllow = true;
  //           }
  //         });
  //       }
  //       if (this.stubAllow == true) {
  //         this.stubAllow = false;
  //         return true;
  //       }
  //     }
  //     else if (this.mediaChecked == true && this.formChecked) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;

  //       annotationMedia.forEach((data) => {
  //         if (data.media_url != "") {
  //           this.mediaAllow = true;
  //         }
  //       });
  //       if (this.mediaAllow == true) {
  //         this.mediaAllow = false;
  //         if (item.annotation_forms.length > 0) {
  //           return true;
  //         }
  //       }
  //     }
  //     else if (this.mediaChecked == true && this.tagchecked) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;
  //       annotationMedia.forEach((data) => {
  //         if (data.media_url != "") {
  //           this.mediaAllow = true;
  //         }
  //       });
  //       if (this.mediaAllow == true) {
  //         this.mediaAllow = false;
  //         let annotationtag = item.annotation_tags;
  //         annotationtag.forEach((data) => {
  //           console.log(data)
  //           if (data != "") {
  //             this.tagallow = true;
  //           }
  //         });
  //       }
  //       if (this.tagallow == true) {
  //         this.tagallow = false;
  //         return true;
  //       }
  //     }
  //     else if (this.checkStub == true && this.formChecked) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;
  //       annotationMedia.forEach((data) => {
  //         if (data.media_url == "") {
  //           this.stubAllow = true;
  //         }
  //       });
  //       if (this.stubAllow == true) {
  //         this.stubAllow = false;
  //         if (item.annotation_forms.length > 0) {
  //           this.formsAllow = true;
  //         }
  //       }
  //       if (this.formsAllow == true) {
  //         this.formsAllow = false;
  //         return true;
  //       }
  //     }
  //     else if (this.checkStub == true && this.tagchecked) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;
  //       annotationMedia.forEach((data) => {
  //         if (data.media_url == "") {
  //           this.stubAllow = true;
  //         }
  //       });
  //       if (this.stubAllow == true) {
  //         this.stubAllow = false;
  //         let annotationtag = item.annotation_tags;
  //         annotationtag.forEach((data) => {
  //           console.log(data)
  //           if (data != "") {
  //             this.tagallow = true;
  //           }
  //         });
  //         if (this.tagallow == true) {
  //           this.tagallow = false;
  //           return true;
  //         }
  //       }
  //     }
  //     else if (this.formChecked == true && this.tagchecked) {
  //       this.allChecked = false;
  //       if (item.annotation_forms.length > 0) {
  //         this.stubAllow = true;
  //       }
  //       if (this.stubAllow == true) {
  //         this.stubAllow = false;
  //         let annotationtag = item.annotation_tags;
  //         annotationtag.forEach((data) => {
  //           console.log(data)
  //           if (data != "") {
  //             this.tagallow = true;
  //           }
  //         });
  //         if (this.tagallow == true) {
  //           this.tagallow = false;
  //           return true;
  //         }
  //       }
  //     }
  //     else if (this.formChecked == true) {
  //       this.allChecked = false;
  //       console.log(item.annotation_forms.length)
  //       if (item.annotation_forms.length > 0) {
  //         this.formsAllow = true;
  //       }
  //       if (this.formsAllow == true) {
  //         this.formsAllow = false;
  //         return true;
  //       }
  //     }
  //     else if (this.mediaChecked == true) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;
  //       annotationMedia.forEach((data) => {
  //         if (data.media_url != "") {
  //           this.mediaAllow = true;
  //         }
  //       });
  //       if (this.mediaAllow == true) {
  //         this.mediaAllow = false;
  //         return true;
  //       }
  //     }
  //     else if (this.checkStub == true) {
  //       this.allChecked = false;
  //       let annotationMedia = item.annotation_media;
  //       annotationMedia.forEach((data) => {
  //         if (data.media_url == "") {
  //           this.stubAllow = true;
  //         }
  //       });
  //       if (this.stubAllow == true) {
  //         this.stubAllow = false;
  //         return true;
  //       }
  //     }
  //     else if (this.tagchecked == true) {
  //       console.log(this.tagchecked)
  //       this.allChecked = false;
  //       let annotationtag = item.annotation_tags;
  //       annotationtag.forEach((data) => {
  //         console.log(data)
  //         if (data != "") {
  //           this.tagallow = true;
  //         }
  //       });
  //       if (this.tagallow == true) {
  //         this.tagallow = false;
  //         return true;
  //       }
  //     }
  //   });

  //   console.log(annotationdata, this.Attributes);
  //   this.documentAnnotations = annotationdata;
  //   this.searchAnnotations = annotationdata;
  //   if (this.searchWord != undefined && this.searchWord != null && this.searchWord != "") {
  //     let search_word = this.searchWord.trim();
  //     this.applyFilter(search_word);
  //   }
  //   else{
  //     this.convertShapeSvg();
  //   }
  //   // if(this.allChecked==false){
  //   //   this.checkedShape3();
  //   // }
  // }

  setFillColor(color) {
    if (color == 'clear') {
      this.fillColorCheck = !this.fillColorCheck;
      if (this.fillColorCheck == true) {
        let colorClear = { color: "clear", checkedvalue: false };
        this.fillColorsArray.push(colorClear);
      }
      else if (this.fillColorCheck == false) {
        for (let j = 0; j < this.fillColorsArray.length; j++) {
          if (this.fillColorsArray[j].color == color) {
            this.fillColorsArray.splice(j, 1);
          }
        }

      }
    }
    let color1 = this.buttonColors.filter((data) => { return data.color == color });
    if (color1.length > 0) {
      color1[0].checkedvalue = !color1[0].checkedvalue;
      if (color1[0].checkedvalue == true) {
        this.fillColorsArray.push(color1[0]);
      }
      else {
        for (let j = 0; j < this.fillColorsArray.length; j++) {
          if (this.fillColorsArray[j].checkedvalue == false && this.fillColorsArray[j].color == color) {
            this.fillColorsArray.splice(j, 1);
          }
        }
      }
    }
    let color2 = this.buttonColors2.filter((data) => { return data.color == color });
    if (color2.length > 0) {
      color2[0].checkedvalue = !color2[0].checkedvalue;
      if (color2[0].checkedvalue == true) {
        this.fillColorsArray.push(color2[0]);
      }
      else {
        for (let j = 0; j < this.fillColorsArray.length; j++) {
          if (this.fillColorsArray[j].checkedvalue == false && this.fillColorsArray[j].color == color) {
            this.fillColorsArray.splice(j, 1);
          }
        }
      }
    }
    console.log(color1, color2);
    console.log(this.color);
    console.log(this.fillColorsArray);
    this.annotationfilter();
    // let annotationfillcolordata = this.searchAnnotations.filter((item) => {
    //   if (color && item.fill_color == color) {
    //     return true;
    //   }
    //   return false;
    // });
    // this.documentAnnotations = annotationfillcolordata;
  }

  annotationChecked(id, event,option) {
    console.log(option)
    if (this.msgFromParent1 == false) {
      if (event.target.checked == true) {
        this.searchannotationIds = [];
        this.searchannotationIds.push(id);
        this.dataService.searchannotationId.emit(this.searchannotationIds);
      }
      else {
        this.searchannotationIds = [];
        this.dataService.searchannotationId.emit(this.searchannotationIds);
      }
    }
    else {
      if (event.target.checked == true) {
        this.searchannotationIds.push(id);
        let addId = [];
        addId.push(id);
        this.dataService.searchannotationId.emit(addId);
      }
      else {
        let remove_id_index = this.searchannotationIds.findIndex((ids) => ids === id);
        let removeId = [];
        removeId.push(this.searchannotationIds[remove_id_index]);
        this.searchannotationIds.splice(remove_id_index, 1);
        this.dataService.searchannotationId.emit(removeId);
      }
    }
  }

  makeResizableDiv() {
    const element = document.getElementById('resizersSearch');
    const resizers = document.querySelectorAll('.resizerSearch');
    const minimum_size = 250;
    let original_width = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    let mousedown = false;
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener('mousedown', (e: any) => {
        // if(this.column==true){
        e.preventDefault();
        mousedown = true;
        original_width = this.changeViewWidth;
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
          stopResize(e)
        })
        // }
      });

      const resize = (e) => {
        if (currentResizer.classList.contains('bottom-right')) {
          const width = original_width + (e.pageX - original_mouse_x);
          if (this.changeViewWidth < width) {
            this.changeArrow = false;
          }
          else if (this.changeViewWidth > width) {
            this.changeArrow = true;
          }
          if (width > minimum_size) {
            element.style.width = width + 'px';
            this.changeViewWidth = width;
          }
          console.log(width);
        }
        else {
          const width = original_width - (e.pageX - original_mouse_x)
          if (this.changeViewWidth < width) {
            this.changeArrow = false;
          }
          else if (this.changeViewWidth > width) {
            this.changeArrow = true;
          }
          if (width > minimum_size) {
            element.style.width = width + 'px'
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
            this.changeViewWidth = width;
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

  annotationfilter1() {
    console.log(this.allChecked, this.tagchecked);
    this.allChecked = true;
    this.tagchecked = false;
    this.mediaChecked = false;
    this.checkStub = false;
    this.formChecked = false;
    console.log(this.tagchecked)
    this.annotationfilter();
  }

  getcreated(user_id) {
    if (this.userlist.length > 0) {
      let filter_user_name = this.userlist.filter((data) => data.user_id == user_id);
      if (filter_user_name.length > 0) {
        return filter_user_name[0].first_name + ' ' + filter_user_name[0].last_name;
      }
    }
  }

  getmodified(user_id,option?) {
    // The below if conditon is for temporary purpose(till the server side changes for copy annotation)  
    if(user_id==undefined){
      user_id=option.created_by_user_id;
    }
    if (this.userlist.length > 0) {
      let filter_user_name = this.userlist.filter((data) => data.user_id == user_id);
      if (filter_user_name.length > 0) {
        return filter_user_name[0].first_name + ' ' + filter_user_name[0].last_name;
      }
    }
  }

  async convertShapeSvg() {
    // return new Promise(async (resolve) => {
    let clone_document_list = _.cloneDeep(this.documentAnnotations);
    this.documentAnnotations_svg_view = [];
    if (clone_document_list.length > 0) {
      for (let k = 0; k < clone_document_list.length; k++) {
        let get_annotation = clone_document_list[k];
        // let find_already_exist = this.documentAnnotations_svg_view.findIndex((shape)=>shape.annotation_id==get_annotation.annotation_id);
        // if(find_already_exist==-1){
        //   let get_path = await this.annotation_view_svg(get_annotation);
        //   this.documentAnnotations_svg_view.push(get_path);
        // }
        // else{
        //   this.documentAnnotations_svg_view.splice(find_already_exist,1);
        // }
        let get_path = await this.annotation_view_svg(get_annotation);
        //line shapes I have assigned extra 
        let lines = [13, 14, 15, 16];
        if (lines.includes(Number(get_path.toolbar_element_id))) {
          get_path.linewidth = get_path.linewidth * 2;
        }
        // check resize shapes line width increase simple shapes only
        get_path = linewidthchanges(get_path);
        this.documentAnnotations_svg_view.push(get_path);
      }
      this.documentAnnotations_svg_view_backup = this.documentAnnotations_svg_view;
    }
    else {
      this.documentAnnotations_svg_view = [];
      this.documentAnnotations_svg_view_backup = [];
    }
    //   resolve(200);
    // });

  }

  async single_convertShapeSvg(getdata) {
    let clone_document_list = _.cloneDeep(getdata);
    if (clone_document_list != undefined) {
      let get_annotation = clone_document_list;
      let find_already_exist = this.documentAnnotations_svg_view.findIndex((shape) => shape.annotation_id == get_annotation.annotation_id);
      if (find_already_exist == -1) {
        let get_path = await this.annotation_view_svg(get_annotation);
        //line shapes I have assigned extra 
        let lines = [13, 14, 15, 16];
        if (lines.includes(Number(get_path.toolbar_element_id))) {
          get_path.linewidth = get_path.linewidth * 2;
        }
        // check resize shapes line width increase simple shapes only
        get_path = linewidthchanges(get_path);
        this.documentAnnotations_svg_view.push(get_path);
      }
      // let find_already_exist = this.documentAnnotations_svg_view.findIndex((shape)=>shape.annotation_id==get_annotation.annotation_id);
      // if(find_already_exist==-1){
      //   let get_path = await this.annotation_view_svg(get_annotation);
      //   this.documentAnnotations_svg_view.push(get_path);
      // }
      // else{
      //   this.documentAnnotations_svg_view.splice(find_already_exist,1);
      // }
    }
    // else{
    //   this.documentAnnotations_svg_view = [];
    // } 
  }

  async annotation_view_svg(changedata: any) {
    let clone_deep_data = _.cloneDeep(changedata);
    let get_svgPath = this.documentPage_search.changesvgpath(clone_deep_data, 'searchpage', true);
    return get_svgPath;

  }

  filter_annotation(annotation_object) {
    if (this.searchWord != "") {
      let data = annotation_object;
      let search_key = this.searchWord.trim();
      if (data.annotation_name.toLowerCase().includes(search_key.toLowerCase()) || data.created_date.includes(search_key) ||
        (data.last_updated_date != undefined ? data.last_updated_date.includes(search_key) : data.created_date.includes(search_key)) ||
        data.annotation_tags.some((tag) => tag.toLowerCase().includes(search_key.toLowerCase()))) {
        return true;
      }
      else {
        let getuserId_create = data.created_by_user_id;
        let getuserId_modified = data.updated_by_user_id;
        let getvalidusername_created = this.getcreated(getuserId_create);
        let getvalidusername_modified = this.getmodified(getuserId_modified);
        if (getvalidusername_created.toLowerCase().includes(search_key.toLowerCase()) || getvalidusername_modified.toLowerCase().includes(search_key.toLowerCase())) {
          return true;
        }
      }
      if (this.allChecked == false) {
        let forms_accept = false;
        let check_stub = false;
        for (let l = 0; l < data.annotation_forms.length; l++) {
          for (let m = 0; m < data.annotation_forms[l].form_data.length; m++) {
            if (data.annotation_forms[l].form_data[m].element_type == 'multiple_choice' ||
              data.annotation_forms[l].form_data[m].element_type == 'single_choice' ||
              data.annotation_forms[l].form_data[m].element_type == 'dropdown' ||
              data.annotation_forms[l].form_data[m].element_type == 'checkbox') {
              for (let n = 0; n < data.annotation_forms[l].form_data[m].element_data.options.length; n++) {
                if (data.annotation_forms[l].form_data[m].element_data.options[n].name != undefined &&
                  data.annotation_forms[l].form_data[m].element_data.options[n].name != "") {
                  if (data.annotation_forms[l].form_data[m].element_data.options[n].name.toString().toLowerCase().includes(search_key.toLowerCase())) {
                    forms_accept = true;
                    return true;
                  }
                }
              }
            }
            else if ((data.annotation_forms[l].form_data[m].element_type != 'multiple_choice' ||
              data.annotation_forms[l].form_data[m].element_type != 'single_choice' ||
              data.annotation_forms[l].form_data[m].element_type != 'dropdown' ||
              data.annotation_forms[l].form_data[m].element_type != 'date' ||
              data.annotation_forms[l].form_data[m].element_type != 'address') &&
              data.annotation_forms[l].form_data[m].element_data.default_value != undefined &&
              data.annotation_forms[l].form_data[m].element_data.default_value != "") {
              if (data.annotation_forms[l].form_data[m].element_data.default_value.toString().toLowerCase().includes(search_key.toLowerCase())) {
                forms_accept = true;
                return true;
              }
            }
            else if (data.annotation_forms[l].form_data[m].element_type == 'date') {
              if (data.annotation_forms[l].form_data[m].element_data.default_date_time.toString().toLowerCase().includes(search_key.toLowerCase())) {
                forms_accept = true;
                return true;
              }
            }
            else if (data.annotation_forms[l].form_data[m].element_type == 'address') {
              if (data.annotation_forms[l].form_data[m].element_data.street_address1.toLowerCase().includes(search_key.toLowerCase()) ||
                data.annotation_forms[l].form_data[m].element_data.street_address2.toLowerCase().includes(search_key.toLowerCase()) ||
                data.annotation_forms[l].form_data[m].element_data.state.toLowerCase().includes(search_key.toLowerCase()) ||
                data.annotation_forms[l].form_data[m].element_data.city.toLowerCase().includes(search_key.toLowerCase()) ||
                data.annotation_forms[l].form_data[m].element_data.zip.toLowerCase().includes(search_key.toLowerCase())) {
                forms_accept = true;
                return true;
              }
            }
            else if (data.annotation_forms[l].form_data[m].element_type == 'calculation') {
              if (data.annotation_forms[l].form_data[m].element_data.calculation.toString().toLowerCase().includes(search_key.toLowerCase())) {
                forms_accept = true;
                return true;
              }
            }
          }
        }
        if (data.annotation_media.length > 0 && forms_accept == false && (this.checkStub == true)) {
          let filter_stubs = data.annotation_media.filter((data_url) => data_url.media_url == '');
          let find_exist_ornot = filter_stubs.some((datamedia) => datamedia.media_name.toLowerCase().includes(search_key.toLowerCase()));
          if (find_exist_ornot == true) {
            check_stub = true;
            return true;
          }
        }
        if (data.annotation_media.length > 0 && forms_accept == false && check_stub == false && this.mediaChecked == true) {
          let filter_photos = data.annotation_media.filter((data_url) => data_url.media_url != '');
          let find_exist_ornot = filter_photos.some((datamedia) => datamedia.media_name.toLowerCase().includes(search_key.toLowerCase()));
          if (find_exist_ornot == true) {
            return true;
          }
        }
      }
      // values not matching anything mean return false
      return false;
    }
    else {
      return true;
    }
  }

  search_annotation_action() {
    if (this.searchWord != "" || this.allChecked == false) {
      this.circleLoader = true;
      const search_inputs = {
        page_id: this.currentpageidsearch, all_data: this.allChecked, user_id: 1, is_tag: this.tagchecked,
        is_stub: this.checkStub, is_photo: this.mediaChecked, is_form: this.formChecked, search_key: this.searchWord
      }
      this.documentService_1.get_search_annotation(search_inputs).subscribe((response) => {
        console.log(response);
        if (response["response_code"] == 200) {
          let get_filter_annot = response["response_body"];
          if (get_filter_annot.length > 0) {
            this.documentAnnotations_svg_view = this.documentAnnotations_svg_view_backup.filter((origi_data) => get_filter_annot.some((temp_data) => origi_data.annotation_id == temp_data.annotation_id));
          }
          else{
            this.documentAnnotations_svg_view = [];
          }
        this.circleLoader = false;
        }
      })
    }
    else {

      // revert back to the all annotation when all click and no search key word typing
      // this.filterAnnotations = this.documentAnnotations;
      this.documentAnnotations_svg_view = this.documentAnnotations_svg_view_backup;
    }
  }

  annotationfilter() {
    console.log(this.tagchecked, this.formChecked, this.checkStub, this.mediaChecked);
    if (this.tagchecked == false && this.formChecked == false && this.checkStub == false && this.mediaChecked == false) {
      this.allChecked = true;
      this.search_annotation_action();
    }
    else if (this.tagchecked == true || this.formChecked == true || this.checkStub == true || this.mediaChecked == true) {
      this.allChecked = false;
      this.search_annotation_action();
    }
  }

  trackbyFunction(index, item) {
    return item.annotation_id;
  }

  ngOnDestroy(): void {
    this.searchAnnotations.forEach((data) => {
      console.log(data);
      data.annotation_tags = data.annotation_tags.toString();
    });
    console.log(this.searchAnnotations);
    if (this.ids_remover$ != null) {
      this.ids_remover$.unsubscribe();
    }
    if (this.ids_getting$ != null) {
      this.ids_getting$.unsubscribe();
    }
    if (this.searchOptionEmitter$ != null) {
      this.searchOptionEmitter$.unsubscribe();
    }

  }


  // checkedShape1(event, name) {
  //   let toolbarId: any = 0;
  //   if (name == 'Circle') {
  //     toolbarId = 1;
  //   }
  //   else if (name == 'Octagon') {
  //     toolbarId = 2;
  //   }
  //   else if (name == 'Square') {
  //     toolbarId = 3;
  //   }
  //   else if (name == 'Triangle') {
  //     toolbarId = 4;
  //   }
  //   else if (name == 'Star') {
  //     toolbarId = 5;
  //   }
  //   else if (name == 'Diamond') {
  //     toolbarId = 6;
  //   }
  //   else if (name == 'Flag') {
  //     toolbarId = 7;
  //   }
  //   else if (name == 'Camera') {
  //     toolbarId = 8;
  //   }
  //   else if (name == 'Arrow') {
  //     toolbarId = 9;
  //   }
  //   else if (name == 'Text') {
  //     toolbarId = 11;
  //   }
  //   else if (name == 'Freehand Line') {
  //     toolbarId = 12;
  //   }
  //   else if (name == 'Polyline Arrow') {
  //     toolbarId = 13;
  //   }
  //   else if (name == 'Polyline') {
  //     toolbarId = 14;
  //   }
  //   else if (name == 'Line') {
  //     toolbarId = 15;
  //   }
  //   else if (name == 'Line Axial') {
  //     toolbarId = 16;
  //   }
  //   else if (name == 'Freehand Area') {
  //     toolbarId = 17;
  //   }
  //   else if (name == 'Polygon') {
  //     toolbarId = 18;
  //   }
  //   else if (name == 'Ellipse') {
  //     toolbarId = 19;
  //   }
  //   else if (name == 'Rectangle') {
  //     toolbarId = 20;
  //   }
  //   var data: any[] = [];
  //   if (event.target.checked == true) {
  //     this.selectAnnotationNames.push(toolbarId);
  //     this.selectAnnotationNames.forEach((toolbarIdlist) => {
  //       this.filterAnnotations.forEach((list) => {
  //         if (list.toolbar_element_id == toolbarIdlist) {
  //           data.push(list);
  //         }
  //       });
  //     });
  //   }
  //   else if (event.target.checked == false) {
  //     this.selectAnnotationNames = this.selectAnnotationNames.filter((data) => { return data != toolbarId });
  //     if (this.selectAnnotationNames.length == 0) {
  //       this.filterAnnotations.forEach((element) => {
  //         if (this.allChecked == true) {
  //           data.push(element);
  //         }
  //       });
  //     }
  //     else {
  //       this.selectAnnotationNames.forEach((toolbarIdlist) => {
  //         this.filterAnnotations.forEach((list) => {
  //           if (list.toolbar_element_id == toolbarIdlist) {
  //             data.push(list);
  //           }
  //         });
  //       });
  //     }
  //   }
  //   console.log(this.selectAnnotationNames);
  //   this.annotationfilter();
  // }



}
