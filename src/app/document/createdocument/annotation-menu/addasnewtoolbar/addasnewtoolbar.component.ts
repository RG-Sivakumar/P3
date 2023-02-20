import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToolbarlistService } from "src/app/toolbar/services/toolbarlist.service";
import { ActivatedRoute } from "@angular/router";
import { ToolbardesignComponent } from "src/app/toolbar/toolbardesign/toolbardesign.component";
import { ToolbardesignService } from "src/app/toolbar/services/toolbardesign.service";
import { ProjectlistService } from "src/app/project-dashboard/my-project/services/projectlist.service";
import { ReadonlyService } from "src/app/document/services/readonly.service";
import { v1 as uuidv1 } from "uuid";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DataService } from "src/app/data.service";
import _ from "lodash";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-addasnewtoolbar",
  templateUrl: "./addasnewtoolbar.component.html",
  styleUrls: ["./addasnewtoolbar.component.css"],
})
export class AddasnewtoolbarComponent implements OnInit {
  projectId: string;
  toolbarList: string[];
  show: boolean = false;

  toolbarId: string;
  callback1: any;
  getIndex: number = 0;
  su: any;
  annotationName: any;
  mutiarray: any[] = [];
  toolbarListData: any[];
  convertToolbarListData: any[] = [];
  selectAnnotationData: any;
  toolbarData: any[] = [];
  selectedToolbarIds: string[] = [];
  formlist: any[] = [];
  defaultForms:any [] = [];
  stampValue:number=0;


  constructor(
    private dialogClose: MatDialogRef<AddasnewtoolbarComponent>,
    private toolbarlistService: ToolbarlistService,
    private route: ActivatedRoute,
    private toolbarDesignService: ToolbardesignService,
    public service: ProjectlistService,
    private readonlyservice: ReadonlyService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataserviceService,
    private _snackBar: MatSnackBar,
    private textCheckService:DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    console.log(data);
    this.annotationName = this.data.dataToSend;
    this.toolbarListData = this.data.toolbarListData;
    this.formlist = this.data.formlist;
    this.defaultForms = this.data.defaultForms;
    this.stampValue = this.data.stamp;
    console.log(data);
    for (let i = 0; i < this.toolbarListData.length; i++) {
      
      // let convertJsonList = (this.toolbarListData[i].toolbar_data);
      // let jointoolbarId = { toolbarId: this.toolbarListData[i].toolbar_id, convertJsonList: convertJsonList };
      // this.convertToolbarListData.push(jointoolbarId);
      console.log(this.convertToolbarListData);
    }
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  ngOnInit(): void {

  }

  closeBox() {
    
    if (this.selectedToolbarIds.length > 0) {
      this.show = true;
      for (let i = 0; i < this.selectedToolbarIds.length; i++) {
        this.toolbarId = this.selectedToolbarIds[i];
         let gettoolbarData = this.toolbarListData.filter((data) => { return this.selectedToolbarIds[i] == data.toolbar_id });
        // this.toolbarData = JSON.parse(gettoolbarData[0].toolbar_data);
        if (this.toolbarData == null) {
          this.toolbarData = [];
        }
        console.log(this.toolbarId);
        console.log(this.toolbarData);
        this.localUpdateValue(this.selectedToolbarIds[i]);
      }
    }
    else {
      this.dataService.multiSelectFooter.emit(false);
      this.dialogClose.close();
    }
  }

  localUpdateValue(getToolbarId) {
    let toggletoolbarData: any = [];
    for(let ts=0;ts<this.annotationName.length;ts++){
      var toolelementoriginal = this.default_toolbar_content.find(
        (ele) => ele.element_id == this.annotationName[ts].toolbar_element_id
      );
      var toolelement=_.cloneDeep(toolelementoriginal);
      // converting special character
      this.annotationName[ts].annotation_name = this.textCheckService.changeFormat(this.annotationName[ts].annotation_name);
      this.annotationName[ts].annotation_label = this.textCheckService.changeFormat(this.annotationName[ts].annotation_label);
      this.annotationName[ts].annotation_tags = this.textCheckService.changeFormat(this.annotationName[ts].annotation_tags);
      this.annotationName[ts].annotation_data = this.textCheckService.changeFormat(this.annotationName[ts].annotation_data);
      if (this.annotationName[ts].annotation_forms.length > 0) {
        for (let fi = 0; fi < this.annotationName[ts].annotation_forms.length; fi++) {
          this.annotationName[ts].annotation_forms[fi].form_name = this.textCheckService.changeFormat(this.annotationName[ts].annotation_forms[fi].form_name);
          let get_cur_formdata = this.annotationName[ts].annotation_forms[fi].form_data;
          if (Array.isArray(get_cur_formdata)) {
            if (get_cur_formdata.length > 0) {
              this.annotationName[ts].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata, 'annotationupdateformpublish');
            }
          }
        }
      }
      if (this.annotationName[ts].annotation_links.length > 0) {
        if (Array.isArray(this.annotationName[ts].annotation_links)) {
          for (let li = 0; li < this.annotationName[ts].annotation_links.length; li++) {
            if (this.annotationName[ts].annotation_links[li].document_id == '') {
              this.annotationName[ts].annotation_links[li].link_type = this.textCheckService.changeFormat(this.annotationName[ts].annotation_links[li].link_type);
            }
            else if (this.annotationName[ts].annotation_links[li].document_id != '') {
              this.annotationName[ts].annotation_links[li].link_type = this.textCheckService.changeFormat(this.annotationName[ts].annotation_links[li].link_type);
            }
            if (this.annotationName[ts].annotation_links[li].hasOwnProperty('location')) {
              console.log(this.annotationName[ts].annotation_links[li].location);
              if (this.annotationName[ts].annotation_links[li].location != undefined) {
                this.annotationName[ts].annotation_links[li].location = this.textCheckService.changeFormat(this.annotationName[ts].annotation_links[li].location);
              }
            }
          }
        }
      }
      if (this.annotationName[ts].annotation_media.length > 0) {
        if (Array.isArray(this.annotationName[ts].annotation_media)) {
          for (let li = 0; li < this.annotationName[ts].annotation_media.length; li++) {
            if (this.annotationName[ts].annotation_media[li].media_name != '') {
              this.annotationName[ts].annotation_media[li].media_name = this.textCheckService.changeFormat(this.annotationName[ts].annotation_media[li].media_name);
            }
            if (this.annotationName[ts].annotation_media[li].media_comment != '') {
              this.annotationName[ts].annotation_media[li].media_comment = this.textCheckService.changeFormat(this.annotationName[ts].annotation_media[li].media_comment);
            }
            if(this.annotationName[ts].annotation_media[li].hasOwnProperty("media_tags")){
              if (this.annotationName[ts].annotation_media[li].media_tags != '') {
                this.annotationName[ts].annotation_media[li].media_tags = this.textCheckService.changeFormat(this.annotationName[ts].annotation_media[li].media_tags);
              }
            }
          }
        }
      }
      toolelement.element_name = this.annotationName[ts].annotation_name;
      toolelement.element_data.element_name = this.annotationName[ts].annotation_name;
      toolelement.element_data.fill_color = this.annotationName[ts].fill_color;
      toolelement.element_data.stroke_color = this.annotationName[ts].stroke_color;
      toolelement.element_data.line_width = this.annotationName[ts].line_width;
      toolelement.element_data.opacity = this.annotationName[ts].opacity;
      toolelement.element_data.shape.stroke_color = this.annotationName[ts].stroke_color;
      toolelement.element_data.shape.initial_width = this.annotationName[ts].initial_width;
      toolelement.element_data.shape.annotation_data = this.annotationName[ts].annotation_data;
      toolelement.element_data.shape.fill_color = this.annotationName[ts].fill_color;
      toolelement.element_data.shape.annotation_label = this.annotationName[ts].annotation_label;
      toolelement.element_data.shape.initial_rotation = this.annotationName[ts].initial_rotation;
      toolelement.element_data.shape.initial_height = this.annotationName[ts].initial_height;
      toolelement.element_data.shape.initial_width = this.annotationName[ts].initial_width;
      toolelement.element_data.shape.element_id = this.annotationName[ts].toolbar_element_id;
      toolelement.element_data.shape.annotation_media = [];
      toolelement.element_data.shape.annotation_links = [];
      toolelement.element_data.shape.annotation_tags = "";
      toolelement.element_data.shape.is_stamp = this.stampValue;
      toolelement.element_data.element_order = this.toolbarData.length + ts;
      if (this.annotationName[ts].hasOwnProperty("annotation_forms")) {
        if (this.annotationName[ts].annotation_forms.length > 0) {
          this.annotationName[ts].annotation_forms.forEach(forms1 => {
            let changeFormdefault = this.defaultForms.filter((formId) => forms1.form_id == formId.form_id);
            console.log(changeFormdefault[0]);
            if(typeof changeFormdefault[0].form_data=="string" ){
            forms1.form_data = JSON.parse(changeFormdefault[0].form_data);
            }else{
              forms1.form_data =changeFormdefault[0].form_data
            }
          });
          toolelement.element_data.forms_list_data = this.annotationName[ts].annotation_forms;
        }
        else {
          toolelement.element_data.forms_list_data = [];
        }
      }
      toolelement.element_uuid = this.su.user_id + uuidv1().toUpperCase() + new Date().getTime();
      toggletoolbarData.push(toolelement);
      console.log(toolelement);
      console.log(this.annotationName);
    }
    console.log(this.toolbarData);
    console.log(toggletoolbarData);
    this.toolbarData =toggletoolbarData;
    console.log(this.toolbarData);
    let UpdateToolbarModel: any = {
      toolbar_id: [getToolbarId],
      user_id: this.su.user_id,
      toolbar_data: this.toolbarData,
     
    };
    for (let k = 0; k < this.convertToolbarListData.length; k++) {
      if (this.toolbarId == this.convertToolbarListData[k].toolbarId) {
        this.convertToolbarListData[k].convertJsonList = this.toolbarData;
      }
    }
    console.log(UpdateToolbarModel);
    this.publishToolbar(UpdateToolbarModel);
  }



  toggleVisibility(event, value, index) {
    this.getIndex = index;
    if (event.target.checked) {
      this.selectedToolbarIds.push(value.toolbar_id);
      // this.publishToolbar(this.toolbarId);
    }
    else {
      let index = this.selectedToolbarIds.indexOf(value.toolbar_id);
      if (index > -1) {
        this.selectedToolbarIds.splice(index, 1);
      }
    }
  }

  default_toolbar_content = [
    {
      element_name: "Circle",
      is_hidden: 0,
      element_type: "circle",
      element_id: 1,
      element_category: "Circle",
      element_uuid: "0",
      is_removed: 0,
      version_number: 1,
      element_data: {
        element_category: "Circle",
        element_id: 1,
        element_label: "Circle",
        element_name: "Circle",
        element_order: 0,
        element_type: "circle",
        fill_color: "#002F5F",
        stroke_color: "#002F5F",
        forms_list_data: [],
        opacity: 1,
        line_width: 5,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 1,
          element_type: "circle",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_type: "octagon",
      element_id: 2,
      version_number: 1,
      element_category: "Octagon",
      is_hidden: 0,
      element_uuid: "0", is_removed: 0,
      element_name: "Octagon",
      element_data: {
        element_name: "Octagon",
        element_category: "Circle",
        opacity: 1,
        fill_color: "#002F5F",
        stroke_color: "#002F5F", forms_list_data: [],
        element_id: 2,
        line_width: 5,
        element_label: "Octagon",
        element_type: "octagon",
        element_order: 0,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 2,
          element_type: "octagon",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_id: 3,
      is_hidden: 0,
      element_type: "square",
      element_category: "Square",
      element_name: "Square",
      element_uuid: "0", is_removed: 0,
      version_number: 1,
      element_data: {
        opacity: 1,
        stroke_color: "#002F5F", forms_list_data: [],
        element_name: "Square",
        line_width: 5,
        element_type: "square",
        element_label: "Square",
        element_order: 1,
        fill_color: "#002F5F",
        element_category: "Square",
        element_id: 3,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 3,
          element_type: "square",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      is_hidden: 0,
      element_uuid: "0", is_removed: 0,
      element_type: "triangle",
      element_category: "Triangle",
      version_number: 1,
      element_id: 4,
      element_name: "Triangle",
      element_data: {
        element_name: "Triangle",
        stroke_color: "#002F5F", forms_list_data: [],
        element_category: "Triangle",
        element_id: 4,
        fill_color: "#002F5F",
        element_label: "Triangle",
        element_type: "triangle",
        element_order: 2,
        line_width: 5,
        opacity: 1,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 4,
          element_type: "triangle",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_type: "star",
      is_hidden: 0,
      version_number: 1,
      element_category: "Star",
      element_uuid: "0", is_removed: 0,
      element_id: 5,
      element_name: "Star",
      element_data: {
        element_order: 3,
        stroke_color: "#002F5F", forms_list_data: [],
        element_name: "Star",
        line_width: 5,
        fill_color: "#002F5F",
        element_type: "star",
        element_id: 5,
        element_category: "Star",
        element_label: "Star",
        opacity: 1,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 5,
          element_type: "star",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_type: "diamond",
      element_id: 6,
      element_category: "Diamond",
      is_hidden: 0,
      version_number: 1,
      element_name: "Diamond",
      element_uuid: "0", is_removed: 0,
      element_data: {
        element_id: 6,
        stroke_color: "#002F5F", forms_list_data: [],
        element_name: "Diamond",
        line_width: 5,
        opacity: 1,
        element_label: "Diamond",
        element_type: "diamond",
        fill_color: "#002F5F",
        element_category: "Diamond",
        element_order: 4,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 6,
          element_type: "diamond",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_id: 7,
      version_number: 1,
      element_name: "Flag",
      is_hidden: 0,
      element_uuid: "0", is_removed: 0,
      element_category: "Flag",
      element_type: "flag",
      element_data: {
        element_id: 7,
        line_width: 5,
        fill_color: "#002F5F",
        element_type: "flag",
        element_category: "Flag",
        element_label: "Flag",
        opacity: 1,
        element_order: 5,
        element_name: "Flag",
        stroke_color: "#002F5F", forms_list_data: [],
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 7,
          element_type: "flag",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_type: "camera",
      element_name: "Camera",
      version_number: 1,
      element_uuid: "0", is_removed: 0,
      element_category: "Camera",
      element_id: 8,
      is_hidden: 0,
      element_data: {
        element_category: "Camera",
        fill_color: "#002F5F",
        element_name: "Camera",
        element_label: "Camera",
        element_type: "camera",
        opacity: 1,
        element_order: 6,
        stroke_color: "#002F5F", forms_list_data: [],
        element_id: 8,
        line_width: 5,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 8,
          element_type: "camera",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_name: "Arrow",
      version_number: 1,
      element_category: "Arrow",
      element_type: "arrow",
      element_id: 9,
      element_uuid: "0", is_removed: 0,
      is_hidden: 0,
      element_data: {
        element_category: "Arrow",
        element_order: 7,
        line_width: 5,
        element_name: "Arrow",
        opacity: 1,
        element_id: 9,
        element_type: "arrow",
        element_label: "Arrow",
        stroke_color: "#002F5F", forms_list_data: [],
        fill_color: "#002F5F",
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 9,
          element_type: "arrow",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_id: 10,
      is_hidden: 0,
      element_uuid: "0", is_removed: 0,
      version_number: 1,
      element_type: "Callout",
      element_name: "Callout",
      element_category: "Callout",
      element_data: {
        opacity: 1,
        element_name: "Callout",
        element_order: 8,
        fill_color: "#002F5F",
        element_type: "callout",
        line_width: 5,
        element_category: "Callout",
        element_label: "Callout",
        stroke_color: "#002F5F", forms_list_data: [],
        element_id: 10,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 10,
          element_type: "callout",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_type: "text",
      element_category: "Text",
      element_id: 11,
      element_uuid: "0", is_removed: 0,
      element_name: "Text",
      is_hidden: 0,
      version_number: 1,
      element_data: {
        opacity: 1,
        fill_color: "#002F5F",
        stroke_color: "#002F5F", forms_list_data: [],
        element_id: 11,
        element_category: "Text",
        element_label: "Text",
        element_name: "Text",
        line_width: 5,
        element_order: 9,
        element_type: "text",
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 11,
          element_type: "text",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      version_number: 1,
      element_type: "freehand_line",
      element_name: "Freehand Line",
      element_uuid: "0", is_removed: 0,
      element_category: "Freehand Line",
      element_id: 12,
      is_hidden: 0,
      element_data: {
        element_category: "Freehand Line",
        element_type: "freehand_line",
        element_name: "Freehand Line",
        stroke_color: "#002F5F", forms_list_data: [],
        opacity: 1,
        line_width: 5,
        fill_color: "#002F5F",
        element_label: "Freehand Line",
        element_order: 10,
        element_id: 12,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 12,
          element_type: "freehand_line",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_uuid: "0", is_removed: 0,
      is_hidden: 0,
      element_type: "polyline_arrow",
      element_id: 13,
      element_name: "Polyline Arrow",
      version_number: 1,
      element_category: "Polyline Arrow",
      element_data: {
        opacity: 1,
        element_label: "Polyline Arrow",
        line_width: 5,
        element_id: 13,
        element_name: "Polyline Arrow",
        stroke_color: "#002F5F", forms_list_data: [],
        element_category: "Polyline Arrow",
        fill_color: "#002F5F",
        element_order: 11,
        element_type: "polyline_arrow",
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 13,
          element_type: "polyline_arrow",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_name: "Polyline",
      element_category: "Polyline",
      element_id: 14,
      version_number: 1,
      element_uuid: "0", is_removed: 0,
      is_hidden: 0,
      element_type: "polyline",
      element_data: {
        element_label: "Polyline",
        fill_color: "#002F5F",
        element_name: "Polyline",
        element_order: 12,
        element_category: "Polyline",
        element_type: "polyline",
        opacity: 1,
        stroke_color: "#002F5F", forms_list_data: [],
        line_width: 5,
        element_id: 14,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 14,
          element_type: "polyline",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_category: "Line",
      element_type: "line",
      element_name: "Line",
      element_id: 15,
      is_hidden: 0,
      version_number: 1,
      element_uuid: "0", is_removed: 0,
      element_data: {
        element_order: 13,
        opacity: 1,
        line_width: 5,
        element_id: 15,
        element_category: "Line",
        element_type: "line",
        fill_color: "#002F5F",
        stroke_color: "#002F5F", forms_list_data: [],
        element_label: "Line",
        element_name: "Line",
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 15,
          element_type: "line",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_category: "Line Axial",
      element_type: "line_axial",
      element_uuid: "0", is_removed: 0,
      element_id: 16,
      element_name: "Line Axial",
      is_hidden: 0,
      version_number: 1,
      element_data: {
        element_type: "line_axial",
        line_width: 5,
        opacity: 1,
        element_order: 14,
        element_id: 16,
        fill_color: "#002F5F",
        element_category: "Line Axial",
        element_label: "Line Axial",
        stroke_color: "#002F5F", forms_list_data: [],
        element_name: "Line Axial",
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 16,
          element_type: "line_axial",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_category: "Freehand Area",
      element_uuid: "0", is_removed: 0,
      is_hidden: 0,
      element_id: 17,
      version_number: 1,
      element_type: "freehand_area",
      element_name: "Freehand Area",
      element_data: {
        opacity: 1,
        element_order: 15,
        element_category: "Freehand Area",
        element_name: "Freehand Area",
        fill_color: "#002F5F",
        stroke_color: "#002F5F", forms_list_data: [],
        element_type: "freehand_area",
        element_label: "Freehand Area",
        line_width: 5,
        element_id: 17,
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 17,
          element_type: "freehand_area",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_type: "polygon",
      version_number: 1,
      element_uuid: "0", is_removed: 0,
      element_category: "Polygon",
      element_name: "Polygon",
      is_hidden: 0,
      element_id: 18,
      element_data: {
        element_category: "Polygon",
        element_name: "Polygon",
        line_width: 5,
        stroke_color: "#002F5F", forms_list_data: [],
        opacity: 1,
        element_order: 16,
        element_label: "Polygon",
        fill_color: "#002F5F",
        element_id: 18,
        element_type: "polygon",
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 18,
          element_type: "polygon",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      element_type: "drawn_ellipse",
      is_hidden: 0,
      element_name: "Drawn Ellipse",
      element_uuid: "0", is_removed: 0,
      version_number: 1,
      element_category: "Drawn Ellipse",
      element_id: 19,
      element_data: {
        element_order: 17,
        stroke_color: "#002F5F", forms_list_data: [],
        line_width: 5,
        opacity: 1,
        element_name: "Drawn Ellipse",
        element_type: "drawn_ellipse",
        element_label: "Drawn Ellipse",
        fill_color: "#002F5F",
        element_id: 19,
        element_category: "Drawn Ellipse",
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 19,
          element_type: "drawn_ellipse",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
    {
      version_number: 1,
      is_hidden: 0,
      element_type: "drawn_rectangle",
      element_uuid: "0", is_removed: 0,
      element_category: "Drawn Rectangle",
      element_id: 20,
      element_name: "Drawn Rectangle",
      element_data: {
        line_width: 5,
        element_category: "Drawn Rectangle",
        opacity: 1,
        fill_color: "#002F5F",
        element_order: 18,
        element_name: "Drawn Rectangle",
        element_id: 20,
        element_type: "drawn_rectangle",
        element_label: "Drawn Rectangle",
        stroke_color: "#002F5F", forms_list_data: [],
        shape: {
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 20,
          element_type: "drawn_rectangle",
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 2,
          stroke_color: "#002F5F",
          rearrange_anno_data: ""
        }
      },
    },
  ];
  publishToolbar(UpdateToolbarModelFinal) {
    console.log("UpdateToolbarModel", UpdateToolbarModelFinal);
    this.toolbarDesignService.merge_toolbar_data(UpdateToolbarModelFinal).subscribe((data) => {
      console.log(data);
      if (data["response_code"] == 200) {
        this.show = false;
        this.convertToolbarListData=data["response_body"]
        for (let k = 0; k <this.convertToolbarListData.length; k++) {
      var toolbar_data=data["response_body"][k].toolbar_data
      console.log(toolbar_data)
      if(typeof toolbar_data=="string"){
        this.convertToolbarListData[k].convertJsonList=JSON.parse(toolbar_data)
      }else{
        this.convertToolbarListData[k].convertJsonList=toolbar_data
      }
    }
        this.dataService.toolbarDataShapes.emit(this.convertToolbarListData);
        this.dataService.multiSelectFooter.emit(false);
        this.dialogClose.close();
      }
      else {
        this.errorMessage();
        this.dataService.multiSelectFooter.emit(false);
        this.dialogClose.close();
      }
    });
  }

  // publishToolbar(UpdateToolbarModelFinal) {
  //   console.log("UpdateToolbarModel", UpdateToolbarModelFinal);
  //   this.toolbarDesignService.update_toolbar_data(UpdateToolbarModelFinal).subscribe((data) => {
  //     console.log(data);
  //     if (data["response_code"] == 200) {
  //       this.show = false;
  //       this.dataService.toolbarDataShapes.emit(this.convertToolbarListData);
  //       this.service.filter("Register Click");
  //       this.dialogClose.close();
  //       this.dataService.multiSelectFooter.emit(false);
  //     }
  //     else {
  //       this.errorMessage();
  //       this.dataService.multiSelectFooter.emit(false);
  //       this.dialogClose.close();
  //     }
  //   });
  // }

  errorMessage() {
    this.show = false;
    this._snackBar.open('Sync is an error', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }
}
