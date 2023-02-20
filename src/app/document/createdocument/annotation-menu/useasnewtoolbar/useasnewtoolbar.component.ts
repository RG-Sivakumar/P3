import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToolbarlistService } from "src/app/toolbar/services/toolbarlist.service";
import { v1 as uuidv1 } from "uuid";
import { ToolbardesignService } from "src/app/toolbar/services/toolbardesign.service";
import { ProjectlistService } from "src/app/project-dashboard/my-project/services/projectlist.service";
import { element } from "src/app/toolbar/model/toolbarelement.model";
import { SharedService } from "src/app/shared/shared.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { variable } from "@angular/compiler/src/output/output_ast";
import * as _ from 'lodash';
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
@Component({
  selector: "app-useasnewtoolbar",
  templateUrl: "./useasnewtoolbar.component.html",
  styleUrls: ["./useasnewtoolbar.component.css"],
})
export class UseasnewtoolbarComponent implements OnInit {
  projectid: string;
  date: any;
  disableds: boolean = false;
  projectId: string;
  su: any;
  getToolbarId: any;
  annotationName: any;
  selectAnnotationData:any={};
  show:boolean=false;
  multiselectOnUse:boolean=false;
  

  
  constructor(
    private dialogbox: MatDialogRef<UseasnewtoolbarComponent>,
    private toolbarService: ToolbarlistService,
    private toolbarDesignService: ToolbardesignService,
    private sharedService: SharedService,
    public service: ProjectlistService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService:DataserviceService,
    private textCheckService:DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    console.log(data);
    this.annotationName = data.getannotationDatas;
    this.selectAnnotationData = this.data.selectAnnotationData;
    console.log(data);
    this.multiselectOnUse = this.data.multiselect;
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  ngOnInit(): void {
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
  }

  onclose() {
    this.dialogbox.close();
    this.sharedService.nextMessage("useUsToolbar");
  }
  toolbarName: any;
  AddNewToolbarAuc(toolbarName) {
    this.show=true;
    this.sharedService.nextMessage("useUsToolbar");
    var date = new Date().getTime();
    toolbarName = this.textCheckService.changeFormat(toolbarName);
    this.toolbarService.createToolbar(this.projectId, toolbarName, uuidv1().toUpperCase(), date)
      .subscribe((res) => {
        if (res["response_code"] == 200) {
          console.log(res);
          this.getToolbarId = res["response_body"].toolbar_id;
          this.publishToolbar24072021(this.getToolbarId);
          // this.toolbarService.filter("Register Click");
        }
        else {
          this.errorMessage();
        }
      });
  }

  default_toolbar_content = [
    {
      element_category: "Circle",
      element_id: 1,
      element_name: "Circle",
      element_type: "circle",
      element_uuid: "0",
      is_removed: 0,
      version_number: 1,
      is_hidden: 0,
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 1,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp: 1,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
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
        shape:{
          annotation_data: "move-15:15 line-35:15 line-35:35 line-15:35 line-15:15 line-35:15",
          annotation_label: "",
          annotation_links: [],
          annotation_media: [],
          annotation_tags: "",
          element_id: 0,
          element_type: 3,
          fill_color: "#002F5F",
          initial_height: 0,
          initial_rotation: 0,
          initial_width: 0,
          is_stamp:this.data.stamp,
          stroke_color: "#002F5F",
        }
      },
    },
  ];

  publishToolbar24072021(getToolbarId) {
    let toggletoolbarData: any = [];  
    for (let tI = 0; tI < this.annotationName.length; tI++) {
      var toolelementTemp = this.default_toolbar_content.find(
        (ele) => ele.element_id == this.annotationName[tI].toolbar_element_id
      );
      // converting special character
      this.annotationName[tI].annotation_name = this.textCheckService.changeFormat(this.annotationName[tI].annotation_name);
      this.annotationName[tI].annotation_label = this.textCheckService.changeFormat(this.annotationName[tI].annotation_label);
      this.annotationName[tI].annotation_tags = this.textCheckService.changeFormat(this.annotationName[tI].annotation_tags);
      this.annotationName[tI].annotation_data = this.textCheckService.changeFormat(this.annotationName[tI].annotation_data);
      if (this.annotationName[tI].annotation_forms.length > 0) {
        for (let fi = 0; fi < this.annotationName[tI].annotation_forms.length; fi++) {
          this.annotationName[tI].annotation_forms[fi].form_name = this.textCheckService.changeFormat(this.annotationName[tI].annotation_forms[fi].form_name);
          let get_cur_formdata = this.annotationName[tI].annotation_forms[fi].form_data;
          if (Array.isArray(get_cur_formdata)) {
            if (get_cur_formdata.length > 0) {
              this.annotationName[tI].annotation_forms[fi].form_data = this.textCheckService.changingformelementpublish(get_cur_formdata, 'annotationupdateformpublish');
            }
          }
        }
      }
      if (this.annotationName[tI].annotation_links.length > 0) {
        if (Array.isArray(this.annotationName[tI].annotation_links)) {
          for (let li = 0; li < this.annotationName[tI].annotation_links.length; li++) {
            if (this.annotationName[tI].annotation_links[li].document_id == '') {
              this.annotationName[tI].annotation_links[li].link_type = this.textCheckService.changeFormat(this.annotationName[tI].annotation_links[li].link_type);
            }
            else if (this.annotationName[tI].annotation_links[li].document_id != '') {
              this.annotationName[tI].annotation_links[li].link_type = this.textCheckService.changeFormat(this.annotationName[tI].annotation_links[li].link_type);
            }
            if (this.annotationName[tI].annotation_links[li].hasOwnProperty('location')) {
              console.log(this.annotationName[tI].annotation_links[li].location);
              if (this.annotationName[tI].annotation_links[li].location != undefined) {
                this.annotationName[tI].annotation_links[li].location = this.textCheckService.changeFormat(this.annotationName[tI].annotation_links[li].location);
              }
            }
          }
        }
      }
      if (this.annotationName[tI].annotation_media.length > 0) {
        if (Array.isArray(this.annotationName[tI].annotation_media)) {
          for (let li = 0; li < this.annotationName[tI].annotation_media.length; li++) {
            if (this.annotationName[tI].annotation_media[li].media_name != '') {
              this.annotationName[tI].annotation_media[li].media_name = this.textCheckService.changeFormat(this.annotationName[tI].annotation_media[li].media_name);
            }
            if (this.annotationName[tI].annotation_media[li].media_comment != '') {
              this.annotationName[tI].annotation_media[li].media_comment = this.textCheckService.changeFormat(this.annotationName[tI].annotation_media[li].media_comment);
            }
            if(this.annotationName[tI].annotation_media[li].hasOwnProperty("media_tags")){
              if (this.annotationName[tI].annotation_media[li].media_tags != '') {
                this.annotationName[tI].annotation_media[li].media_tags = this.textCheckService.changeFormat(this.annotationName[tI].annotation_media[li].media_tags);
              }
            }
          }
        }
      }
      var toolelement = _.cloneDeep(toolelementTemp);
      toolelement.element_name = this.annotationName[tI].annotation_name;
      toolelement.element_data.element_name = this.annotationName[tI].annotation_name;
      toolelement.element_data.fill_color = this.annotationName[tI].fill_color;
      toolelement.element_data.stroke_color = this.annotationName[tI].stroke_color;
      toolelement.element_data.line_width = this.annotationName[tI].line_width;
      toolelement.element_data.opacity = this.annotationName[tI].opacity;
      toolelement.element_data.shape.stroke_color = this.annotationName[tI].stroke_color;
      toolelement.element_data.shape.initial_width = this.annotationName[tI].initial_width;
      toolelement.element_data.shape.annotation_data = this.annotationName[tI].annotation_data;
      toolelement.element_data.shape.fill_color = this.annotationName[tI].fill_color;
      toolelement.element_data.shape.initial_rotation = this.annotationName[tI].initial_rotation;
      toolelement.element_data.shape.initial_height = this.annotationName[tI].initial_height;
      toolelement.element_data.shape.initial_width = this.annotationName[tI].initial_width;
      toolelement.element_data.shape.annotation_label = this.annotationName[tI].annotation_label;
      toolelement.element_data.shape.annotation_media = [];
      toolelement.element_data.shape.annotation_links = this.annotationName[tI].annotation_links;
      toolelement.element_data.shape.annotation_tags = this.annotationName[tI].annotation_tags;
      toolelement.element_data.shape.element_id = this.annotationName[tI].toolbar_element_id;
      toolelement.element_data.element_order = tI;
      toolelement.element_data.shape.is_stamp = 1;
      if (this.annotationName[tI].hasOwnProperty("annotation_forms")) {
        if (this.annotationName[tI].annotation_forms.length > 0) {
          toolelement.element_data.forms_list_data = this.annotationName[tI].annotation_forms;
        }
        else {
          toolelement.element_data.forms_list_data = [];
        }
      }
      toolelement.element_uuid = this.su.user_id + uuidv1().toUpperCase() + new Date().getTime();
      toggletoolbarData.push(toolelement);
    }

    var elements = [];
    elements = [...toggletoolbarData];
    var UpdateToolbarModel: any = {
      user_id: this.su.user_id,
      toolbar_id: getToolbarId,
      toolbar_data: elements,
      toolbar_element_count: elements.length,
    };
    console.log("UpdateToolbarModel", UpdateToolbarModel);


    this.toolbarDesignService.update_toolbar_data(UpdateToolbarModel).subscribe((data) => {
        console.log(data);
        if (data["response_code"] == 200) {
          this.show = false;
          this.dataService.useasToolbarlistUpdate.emit();
          this.dialogbox.close();
        }
        else {
          this.errorMessage();
          this.dialogbox.close();
        }
      });
  }

  publishToolbar(getToolbarId) {
    let toggletoolbarData: any = [];
    this.annotationName.forEach((element) => {
      console.log(element.annotation_name);
      var toolelement = this.default_toolbar_content.find(
        (ele) => ele.element_id == element.toolbar_element_id
      );
      toolelement.element_name = this.annotationName[0].annotation_name;
      toolelement.element_data.element_name = this.annotationName[0].annotation_name;
      toolelement.element_data.fill_color = this.annotationName[0].fill_color;
      toolelement.element_data.stroke_color = this.annotationName[0].stroke_color;
      toolelement.element_data.line_width = this.annotationName[0].line_width;
      toolelement.element_data.opacity = this.annotationName[0].opacity;
      toolelement.element_data.shape.stroke_color = this.annotationName[0].stroke_color;
      toolelement.element_data.shape.initial_width = this.annotationName[0].initial_width;
      toolelement.element_data.shape.annotation_data = this.annotationName[0].annotation_data;
      toolelement.element_data.shape.fill_color = this.annotationName[0].fill_color;
      toolelement.element_data.shape.initial_rotation = this.annotationName[0].initial_rotation;
      toolelement.element_data.shape.initial_height = this.annotationName[0].initial_height;
      toolelement.element_data.shape.initial_width = this.annotationName[0].initial_width;
      toolelement.element_data.shape.annotation_label = this.annotationName[0].annotation_label;
      toolelement.element_data.shape.annotation_media = this.annotationName[0].annotation_media;
      toolelement.element_data.shape.annotation_links = this.annotationName[0].annotation_links;
      toolelement.element_data.shape.annotation_tags = this.annotationName[0].annotation_tags;
      toolelement.element_data.shape.element_id = this.annotationName[0].toolbar_element_id;
      if(this.annotationName[0].hasOwnProperty("annotation_forms")){
        if(this.annotationName[0].annotation_forms.length>0){
          toolelement.element_data.forms_list_data = this.annotationName[0].annotation_forms;
        }
        else{
          toolelement.element_data.forms_list_data = [];
        }
      }
      toolelement.element_uuid = this.su.user_id + uuidv1().toUpperCase() + new Date().getTime();
      toggletoolbarData.push(toolelement);
    });
    var elements = [];
    elements = [...toggletoolbarData];
    let UpdateToolbarModel: any = {
      user_id: this.su.user_id,
      toolbar_id: getToolbarId,
      toolbar_data: elements,
      toolbar_element_count: elements.length,
    };

    console.log("UpdateToolbarModel", UpdateToolbarModel);

    this.toolbarDesignService
      .update_toolbar_data(UpdateToolbarModel).subscribe((data) => {
        console.log(data);
        if(data["response_code"]==200){
          this.show=false;
          this.dataService.useasToolbarlistUpdate.emit();
          this.dialogbox.close();
        }
        else{
          this.errorMessage();
          this.dialogbox.close();
        }
      });
  }

  errorMessage() {
    // this.show = false;
    this._snackBar.open('Sync is an error', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }
  firstLetterCapital(word){
    console.log(word);
    if(word){
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter+othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.toolbarName = changeUpperCaseProjectName;
    }
    console.log(this.toolbarName);
  }
}
