import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ProjectlistService } from "../my-project/services/projectlist.service";
import { v1 as uuidv1 } from "uuid";
import { MatDialogRef } from "@angular/material/dialog";
import { NgForm } from "@angular/forms";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { FormlistService } from "src/app/formbuilder/services/formlist.service";
import { ToolbarlistService } from "src/app/toolbar/services/toolbarlist.service";
import { elementData } from "src/app/formbuilder/Model/controlmodel";
import { login } from "src/app/projectmanagement/models/login-model";
import { FormdataService } from "src/app/formbuilder/services/formdata.service";
import { ToolbardesignService } from "src/app/toolbar/services/toolbardesign.service";
import { element } from "src/app/toolbar/model/toolbarelement.model";
import { Router } from "@angular/router";
import { DataService } from "src/app/data.service";
import { ValueService } from "src/app/value.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-create-project",
  templateUrl: "./create-project.component.html",
  styleUrls: ["./create-project.component.css"],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
})
export class CreateProjectComponent implements OnInit, AfterViewInit {
  namedefault: string = "";
  uuidValue: string;
  userlogin: boolean = false;
  _result: Date;
  date: any;
  defaultName: string = "Default";
  formId: string;
  su: login;
  toolbarId: string;
  status: number;
  disable:boolean=false;
  projectId: string;
  fieldModel: Array<any>;
  fieldModel1: Array<any>;
  groupbyVariable: any;
  btnDisabled = false;
  defaultToolbarOrder: any[] = [];
  list: any[] = [];
  list1: any[] = [];
  list2: any[] = [];
  createFormDetails: any;
  specialCharRemoval: any;
  constructor(
    private router: Router,
    public service: ProjectlistService,
    public dialogbox: MatDialogRef<CreateProjectComponent>,
    private location: Location,
    private formService: FormlistService,
    private toolbarService: ToolbarlistService,
    private formDataService: FormdataService,
    private toolbarDesignService: ToolbardesignService,
    private dataService: DataService,
    private uuidService:ValueService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    // this.formDataService.get_form_elements_structure().subscribe((data) => {
    //   let field = data["response_body"].form_elements_template;
    //   field.map((item) => {
    //     let elementData = JSON.parse(item.element_data);
    //     item.element_data = elementData.element_data;
    //     return item;
    //   });
    //   this.fieldModel = field;
    //   for (var i = 0; i < 2; i++) {
    //     this.formelementClick(this.fieldModel[i]);
    //   }
    // });

    // this.toolbarDesignService
    //   .get_toolbar_elements_structure()
    //   .subscribe((data) => {
    //     let field1 = data["response_body"].toolbar_elements_template;
    //     field1.map((item) => {
    //       let elementData = JSON.parse(item.element_data);
    //       item.element_data = elementData;
    //       return item;
    //     });
    //     let ascendingElementOrder = field1;
    //     ascendingElementOrder.sort((a,b)=>a.element_data.element_order-b.element_data.element_order);
    //     this.fieldModel1 = ascendingElementOrder;  
    //     console.log(this.fieldModel1);
    //     for (var i = 0; i < this.fieldModel1.length; i++) {
    //       this.toolbarIconClick(this.fieldModel1[i]);
    //     }
    //     this.groupbyVariable = this.groupby(this.fieldModel1);
    //   });
  }

  ngOnInit(): void {
    this.service.getprojectlist().subscribe((data) => {
      console.log(data["response_body"]["projects"]);
      this.list1 = data["response_body"]["projects"];
      this.gethiddenProjectList();
    });
    // this.fillToolbar();
    // this.groupUpdate();
    this.reset();
    let uuid = this.uuidService.generateUUID();
    console.log(uuid);
    // this.checkChainFunction();
  }

  gethiddenProjectList() {
    this.service.hiddenproject().subscribe((data) => {
      console.log(data["response_body"]["Favoriteprojects"]);
      this.list2 = data["response_body"]["Favoriteprojects"];
    });
  }

  // checkChainFunction() {
  //   function f1() {
  //     return new Promise((resolve, reject) => {
  //       resolve();
  //     });
  //   }

  //   function f2() { }
  //   f1().then((res) => f2());
  // }
  //toolbar data
  // groupby = (items: any[], size = 4) => {
  //   let grouped = [];
  //   if (items != undefined) {
  //     for (let i = 0; i < items.length; i += size) {
  //       let data = items.slice(i, i + size);
  //       grouped.push(data);
  //     }
  //   }
  //   return grouped;
  // };

  // formelementClick(item) {
  //   let _item = this.simpleClone(item);
  //   let item1 = { ..._item };
  //   let item2 = JSON.stringify(item1);
  //   let item3 = JSON.parse(item2);

  //   this.model.attributes.splice(this.model.attributes.length, 0, item3);
  // }
  // simpleClone(obj: any) {
  //   return Object.assign({}, obj);
  // }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.service.formData.project_name = changeUpperCaseProjectName;
    }
  }

  onSubmit(form: NgForm) {
    console.log(form.value.project_name);
    let firstLetter = form.value.project_name[0].toUpperCase();
    let otherletters = form.value.project_name.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    console.log(changeUpperCaseProjectName);
    this.service.loaderActivated.emit(true);
    // this.btnDisabled = true;
    this.disable=true;
    this.date = new Date().getTime();
    var name = changeUpperCaseProjectName;
    let count = 1;
    console.log(this.list1, this.list2);
    this.list = [...this.list1, ...this.list2];
    while (this.list.find((e) => e.project_name.trim() === name.trim())) {
      name = form.value.project_name + " (" + count + ")";
      count++;
    }
    name = this.dataService.changeFormat(name);
    this.service.createproject(uuidv1().toUpperCase(), name, this.date).subscribe((res) => {
      this.status = res["response_code"];

      if (this.status == 200) {
        this.projectId = res["response_body"]["project_master"].project_id;
        // this.disable=false;
        // this.router.navigateByUrl("projectdashboard/myproject");
        // this.dialogbox.close();
        this.create_stub_reference();
      }
      else
      {
        this.disable=false;
      }
      // this.service.filter("Register click");
    });
  }

  create_stub_reference(){
    
    this.service.create_stub_reference_api(this.projectId,"0001","IMG-$~_true_~^").subscribe((response)=>{
      console.log(response);
      
      if(response["response_code"]==200){
        this.disable=false;
        this.router.navigateByUrl("projectdashboard/myproject");
        this.dialogbox.close();
      }
      else{
        this.disable=false;
      }
      this.service.filter("Register click");
    })

  }

  changeFormat(name) {

    this.specialCharRemoval = name.split("'").join("’");
    this.specialCharRemoval = this.specialCharRemoval.split("\"").join("“");
  }
  // getFormId: string;
  // createDefaultForms() {
  //   this.date = new Date().getTime();
  //   this.formService
  //     .createDefaultForm(uuidv1().toUpperCase(), this.date, this.defaultName, this.projectId)
  //     .subscribe((res) => {
  //       console.log(res);
  //       this.getFormId = res["response_body"].form_id;
  //       this.publish(this.getFormId);
  //     });
  // }

  // modelFields: Array<elementData> = [];
  // model: any = {
  //   name: "Form name...",
  //   description: "Form Description...",
  //   theme: {
  //     bgColor: "ffffff",
  //     textColor: "555555",
  //     bannerImage: "",
  //   },
  //   attributes: this.modelFields,
  // };

  // publish(formId) {
  //   let sendElement = this.model.attributes.map((val, index) => {
  //     // val.element_data.element_order = index;
  //     val.element_order = index;
  //     return val;
  //   });
  //   let Updatemodel: any = {
  //     user_id: this.su.user_id,
  //     form_id: formId,
  //     form_data: sendElement,
  //     form_element_count: this.model.attributes.length,
  //   };

  //   this.formDataService.update_form_data(Updatemodel).subscribe((data) => {
  //     console.log(data);
  //     this.createFormDetails = data['response_body'];
  //     this.createDefaultToolbarAuc();
  //   });
  // }

  // modelFields1: Array<element> = [];
  // model1: any = {
  //   name: "Form name...",
  //   description: "Form Description...",
  //   theme: {
  //     bgColor: "ffffff",
  //     textColor: "555555",
  //     bannerImage: "",
  //   },
  //   attributes: this.modelFields1,
  // };

  // toolbar_content: any = {
  //   numberofitems: 51,
  //   toolbarItem: this.modelFields1,
  //   groupByToolar: function () {
  //     let items = this.toolbarItem;
  //     let size = 3;
  //     let grouped = [];
  //     if (items != undefined) {
  //       for (let i = 0; i < items.length; i += size) {
  //         let data = items.slice(i, i + size);
  //         grouped.push(data);
  //       }
  //     }
  //     return grouped;
  //   },
  //   toolbarGroup: this.groupby(this.modelFields1),
  // };

  // default_toolbar_content = [
  //   {
  //     version_number: "0",
  //     element_name: "Circle",
  //     is_hidden: "0",
  //     element_type: "circle",
  //     element_id: 1,
  //     element_category: "Circle",
  //     is_removed: "0",
  //     element_data: {
  //       element_order: 0,
  //       element_type: "circle",
  //       element_name: "Circle",
  //       element_id: 1,
  //       stroke_color: "black",
  //       element_category: "Circle",
  //       opacity: 1,
  //       element_label: "Circle",
  //       line_width: 5,
  //       fill_color: "red",
  //     },
  //   },
  //   {
  //     element_type: "octagon",
  //     element_id: 2,
  //     version_number: "0",
  //     element_category: "Octagon",
  //     is_hidden: "0",
  //     is_removed: "0",
  //     element_name: "Octagon",
  //     element_data: {
  //       element_name: "Octagon",
  //       element_category: "Circle",
  //       opacity: 1,
  //       fill_color: "red",
  //       stroke_color: "black",
  //       element_id: 2,
  //       line_width: 5,
  //       element_label: "Octagon",
  //       element_type: "octagon",
  //       element_order: 0,
  //     },
  //   },
  //   {
  //     element_id: 3,
  //     is_hidden: "0",
  //     element_type: "square",
  //     element_category: "Square",
  //     element_name: "Square",
  //     is_removed: "0",
  //     version_number: "0",
  //     element_data: {
  //       opacity: 1,
  //       stroke_color: "black",
  //       element_name: "Square",
  //       line_width: 5,
  //       element_type: "square",
  //       element_label: "Square",
  //       element_order: 1,
  //       fill_color: "red",
  //       element_category: "Square",
  //       element_id: 3,
  //     },
  //   },
  //   {
  //     is_hidden: "0",
  //     is_removed: "0",
  //     element_type: "triangle",
  //     element_category: "Triangle",
  //     version_number: "0",
  //     element_id: 4,
  //     element_name: "Triangle",
  //     element_data: {
  //       element_name: "Triangle",
  //       stroke_color: "black",
  //       element_category: "Triangle",
  //       element_id: 4,
  //       fill_color: "red",
  //       element_label: "Triangle",
  //       element_type: "triangle",
  //       element_order: 2,
  //       line_width: 5,
  //       opacity: 1,
  //     },
  //   },
  //   {
  //     element_type: "star",
  //     is_hidden: "0",
  //     version_number: "0",
  //     element_category: "Star",
  //     is_removed: "0",
  //     element_id: 5,
  //     element_name: "Star",
  //     element_data: {
  //       element_order: 3,
  //       stroke_color: "black",
  //       element_name: "Star",
  //       line_width: 5,
  //       fill_color: "red",
  //       element_type: "star",
  //       element_id: 5,
  //       element_category: "Star",
  //       element_label: "Star",
  //       opacity: 1,
  //     },
  //   },
  //   {
  //     element_type: "diamond",
  //     element_id: 6,
  //     element_category: "Diamond",
  //     is_hidden: "0",
  //     version_number: "0",
  //     element_name: "Diamond",
  //     is_removed: "0",
  //     element_data: {
  //       element_id: 6,
  //       stroke_color: "black",
  //       element_name: "Diamond",
  //       line_width: 5,
  //       opacity: 1,
  //       element_label: "Diamond",
  //       element_type: "diamond",
  //       fill_color: "red",
  //       element_category: "Diamond",
  //       element_order: 4,
  //     },
  //   },
  //   {
  //     element_id: 7,
  //     version_number: "0",
  //     element_name: "Flag",
  //     is_hidden: "0",
  //     is_removed: "0",
  //     element_category: "Flag",
  //     element_type: "flag",
  //     element_data: {
  //       element_id: 7,
  //       line_width: 5,
  //       fill_color: "red",
  //       element_type: "flag",
  //       element_category: "Flag",
  //       element_label: "Flag",
  //       opacity: 1,
  //       element_order: 5,
  //       element_name: "Flag",
  //       stroke_color: "black",
  //     },
  //   },
  //   {
  //     element_type: "camera",
  //     element_name: "Camera",
  //     version_number: "0",
  //     is_removed: "0",
  //     element_category: "Camera",
  //     element_id: 8,
  //     is_hidden: "0",
  //     element_data: {
  //       element_category: "Camera",
  //       fill_color: "red",
  //       element_name: "Camera",
  //       element_label: "Camera",
  //       element_type: "camera",
  //       opacity: 1,
  //       element_order: 6,
  //       stroke_color: "black",
  //       element_id: 8,
  //       line_width: 5,
  //     },
  //   },
  //   {
  //     element_name: "Arrow",
  //     version_number: "0",
  //     element_category: "Arrow",
  //     element_type: "arrow",
  //     element_id: 9,
  //     is_removed: "0",
  //     is_hidden: "0",
  //     element_data: {
  //       element_category: "Arrow",
  //       element_order: 7,
  //       line_width: 5,
  //       element_name: "Arrow",
  //       opacity: 1,
  //       element_id: 9,
  //       element_type: "arrow",
  //       element_label: "Arrow",
  //       stroke_color: "black",
  //       fill_color: "red",
  //     },
  //   },
  //   {
  //     element_id: 10,
  //     is_hidden: "0",
  //     is_removed: "0",
  //     version_number: "0",
  //     element_type: "Callout",
  //     element_name: "Callout",
  //     element_category: "Callout",
  //     element_data: {
  //       opacity: 1,
  //       element_name: "Callout",
  //       element_order: 8,
  //       fill_color: "red",
  //       element_type: "callout",
  //       line_width: 5,
  //       element_category: "Callout",
  //       element_label: "Callout",
  //       stroke_color: "black",
  //       element_id: 10,
  //     },
  //   },
  //   {
  //     element_type: "text",
  //     element_category: "Text",
  //     element_id: 11,
  //     is_removed: "0",
  //     element_name: "Text",
  //     is_hidden: "0",
  //     version_number: "0",
  //     element_data: {
  //       opacity: 1,
  //       fill_color: "red",
  //       stroke_color: "black",
  //       element_id: 11,
  //       element_category: "Text",
  //       element_label: "Text",
  //       element_name: "Text",
  //       line_width: 5,
  //       element_order: 9,
  //       element_type: "text",
  //     },
  //   },
  //   {
  //     version_number: "0",
  //     element_type: "freehand_line",
  //     element_name: "Freehand Line",
  //     is_removed: "0",
  //     element_category: "Freehand Line",
  //     element_id: 12,
  //     is_hidden: "0",
  //     element_data: {
  //       element_category: "Freehand Line",
  //       element_type: "freehand_line",
  //       element_name: "Freehand Line",
  //       stroke_color: "black",
  //       opacity: 1,
  //       line_width: 5,
  //       fill_color: "red",
  //       element_label: "Freehand Line",
  //       element_order: 10,
  //       element_id: 12,
  //     },
  //   },
  //   {
  //     is_removed: "0",
  //     is_hidden: "0",
  //     element_type: "polyline_arrow",
  //     element_id: 13,
  //     element_name: "Polyline Arrow",
  //     version_number: "0",
  //     element_category: "Polyline Arrow",
  //     element_data: {
  //       opacity: 1,
  //       element_label: "Polyline Arrow",
  //       line_width: 5,
  //       element_id: 13,
  //       element_name: "Polyline Arrow",
  //       stroke_color: "black",
  //       element_category: "Polyline Arrow",
  //       fill_color: "red",
  //       element_order: 11,
  //       element_type: "polyline_arrow",
  //     },
  //   },
  //   {
  //     element_name: "Polyline",
  //     element_category: "Polyline",
  //     element_id: 14,
  //     version_number: "0",
  //     is_removed: "0",
  //     is_hidden: "0",
  //     element_type: "polyline",
  //     element_data: {
  //       element_label: "Polyline",
  //       fill_color: "red",
  //       element_name: "Polyline",
  //       element_order: 12,
  //       element_category: "Polyline",
  //       element_type: "polyline",
  //       opacity: 1,
  //       stroke_color: "black",
  //       line_width: 5,
  //       element_id: 14,
  //     },
  //   },
  //   {
  //     element_category: "Line",
  //     element_type: "line",
  //     element_name: "Line",
  //     element_id: 15,
  //     is_hidden: "0",
  //     version_number: "0",
  //     is_removed: "0",
  //     element_data: {
  //       element_order: 13,
  //       opacity: 1,
  //       line_width: 5,
  //       element_id: 15,
  //       element_category: "Line",
  //       element_type: "line",
  //       fill_color: "red",
  //       stroke_color: "black",
  //       element_label: "Line",
  //       element_name: "Line",
  //     },
  //   },
  //   {
  //     element_category: "Line Axial",
  //     element_type: "line_axial",
  //     is_removed: "0",
  //     element_id: 16,
  //     element_name: "Line Axial",
  //     is_hidden: "0",
  //     version_number: "0",
  //     element_data: {
  //       element_type: "line_axial",
  //       line_width: 5,
  //       opacity: 1,
  //       element_order: 14,
  //       element_id: 16,
  //       fill_color: "red",
  //       element_category: "Line Axial",
  //       element_label: "Line Axial",
  //       stroke_color: "black",
  //       element_name: "Line Axial",
  //     },
  //   },
  //   {
  //     element_category: "Freehand Area",
  //     is_removed: "0",
  //     is_hidden: "0",
  //     element_id: 17,
  //     version_number: "0",
  //     element_type: "freehand_area",
  //     element_name: "Freehand Area",
  //     element_data: {
  //       opacity: 1,
  //       element_order: 15,
  //       element_category: "Freehand Area",
  //       element_name: "Freehand Area",
  //       fill_color: "red",
  //       stroke_color: "black",
  //       element_type: "freehand_area",
  //       element_label: "Freehand Area",
  //       line_width: 5,
  //       element_id: 17,
  //     },
  //   },
  //   {
  //     element_type: "polygon",
  //     version_number: "0",
  //     is_removed: "0",
  //     element_category: "Polygon",
  //     element_name: "Polygon",
  //     is_hidden: "0",
  //     element_id: 18,
  //     element_data: {
  //       element_category: "Polygon",
  //       element_name: "Polygon",
  //       line_width: 5,
  //       stroke_color: "black",
  //       opacity: 1,
  //       element_order: 16,
  //       element_label: "Polygon",
  //       fill_color: "red",
  //       element_id: 18,
  //       element_type: "polygon",
  //     },
  //   },
  //   {
  //     element_type: "drawn_ellipse",
  //     is_hidden: "0",
  //     element_name: "Drawn Ellipse",
  //     is_removed: "0",
  //     version_number: "0",
  //     element_category: "Drawn Ellipse",
  //     element_id: 19,
  //     element_data: {
  //       element_order: 17,
  //       stroke_color: "black",
  //       line_width: 5,
  //       opacity: 1,
  //       element_name: "Drawn Ellipse",
  //       element_type: "drawn_ellipse",
  //       element_label: "Drawn Ellipse",
  //       fill_color: "red",
  //       element_id: 19,
  //       element_category: "Drawn Ellipse",
  //     },
  //   },
  //   {
  //     version_number: "0",
  //     is_hidden: "0",
  //     element_type: "drawn_rectangle",
  //     is_removed: "0",
  //     element_category: "Drawn Rectangle",
  //     element_id: 20,
  //     element_name: "Drawn Rectangle",
  //     element_data: {
  //       line_width: 5,
  //       element_category: "Drawn Rectangle",
  //       opacity: 1,
  //       fill_color: "red",
  //       element_order: 18,
  //       element_name: "Drawn Rectangle",
  //       element_id: 20,
  //       element_type: "drawn_rectangle",
  //       element_label: "Drawn Rectangle",
  //       stroke_color: "black",
  //     },
  //   },
  // ];

  // icon_object = {
  //   baseurl: "./assets/images/ProjectsScreen/",

  //   geticon: function (index) {
  //     //functions
  //     return this.baseurl + this.icons[index - 1];
  //   },
  //   groupby: function () {
  //     let items = this.icons;
  //     let size = 4;
  //     let grouped = [];
  //     for (let i = 0; i < items.length; i += size) {
  //       let data = items.slice(i, i + size);
  //       grouped.push(data);
  //     }
  //     return grouped;
  //   },

  //   icons: [
  //     "P3_Toolbar_CircleIcon.png",
  //     "P3_Toolbar_OctagonIcon.png",
  //     "P3_Toolbar_SquareIcon.png",
  //     "P3_Toolbar_TriangleIcon.png",
  //     "P3_Toolbar_StarIcon.png",
  //     "P3_Toolbar_DiamondIcon.png",
  //     "P3_Toolbar_FlagIcon.png",
  //     "P3_Toolbar_CameraIcon.png",
  //     "P3_Toolbar_ArrowIcon.png",
  //     "P3_Toolbar_CalloutIcon.png",
  //     "P3_Toolbar_TextIcon.png",
  //     "P3_Toolbar_FreehandLineIcon.png",
  //     "P3_Toolbar_PolylineArrowIcon.png",
  //     "P3_Toolbar_PolylineIcon.png",
  //     "P3_Toolbar_LineIcon.png",
  //     "P3_Toolbar_LineAxialIcon.png",
  //     "P3_Toolbar_FreehandAreaIcon.png",
  //     "P3_Toolbar_PolygonIcon.png",
  //     "P3_Toolbar_DrawnEllipseIcon.png",
  //     "P3_Toolbar_DrawnRectangleIcon.png",
  //   ],
  // };

  // getToolbarId: string;
  // createDefaultToolbarAuc() {
  //   this.date = new Date().getTime();
  //   this.toolbarService
  //     .createDefaultToolbar(
  //       uuidv1().toUpperCase(),
  //       this.date,
  //       this.defaultName,
  //       this.projectId
  //     )
  //     .subscribe((res) => {
  //       this.getToolbarId = res["response_body"].toolbar_id;
  //       this.publishToolbar(this.getToolbarId);
  //     });
  // }

  // fillToolbar(start = 0) {
  //   if (this.modelFields)
  //     for (let i = start; i < 51; i++) {
  //       let ele: element = new element();
  //       ele.element_id = -1;
  //       ele.placeholderNumber = i + 1;
  //       this.modelFields1.push(ele);
  //     }
  //   //.groupeddata = this.groupby(this.sample);
  // }

  // toolbarIconClick = (item) => {
  //   if (this.fieldModel1.length < 1) {
  //     let index = this.modelFields1.findIndex(
  //       (toolbar) => toolbar.element_id == -1
  //     );
  //     item._id = item.element_name + "-" + new Date().getTime();
  //     this.toolbar_content.toolbarItem[index] = item;
  //     this.groupUpdate();
  //   }
  // };

  // groupUpdate() {
  //   this.toolbar_content.toolbarGroup = this.groupby(
  //     this.toolbar_content.toolbarItem,
  //     3
  //   );
  // }

  // publishToolbar(getToolbarId) {
  //   console.log(this.createFormDetails);  
  //   var parseExpectedFormat = JSON.parse(this.createFormDetails.form_data);
  //   this.createFormDetails.form_data = parseExpectedFormat;
  //   let formlistData = [];
  //   for(let b=0;b<this.fieldModel1.length;b++){
  //     formlistData = [];
  //     formlistData.push(this.createFormDetails);
  //     this.fieldModel1[b].element_data.forms_list_data = formlistData;
  //   }
  //   let UpdateToolbarModel: any = {
  //     user_id: this.su.user_id,
  //     toolbar_id: getToolbarId,
  //     toolbar_data: this.fieldModel1,
  //     // toolbar_data: this.groupbyVariable,
  //     toolbar_element_count: this.fieldModel1.length,
  //   };

  //   console.log("UpdateToolbarModel", JSON.stringify(UpdateToolbarModel));

  //   this.toolbarDesignService
  //     .update_toolbar_data(UpdateToolbarModel)
  //     .subscribe((data) => {
  //       console.log(data);
  //       this.service.filter("Register Click");
  //     });
  // }

  ngAfterViewInit() { }

  onClose() {
    this.dialogbox.close();
  }

  option() {
    this.date = new Date().getTime();
  }

  myFunction(event)
  {
    this.dataService.specialCharacterPasteRestrict(event);
  }

  reset() {
    this.service.formData = {
      user_id: 0,
      start_index: 0,
      count: 0,
      project_name: "",
      project_id: "",
      folder_id: "",
      project_tag_name: "",
      project_tag_id: 0,
      search_keyword: "",
      current_user_id: 0,
      is_owner_flag: false,
      first_name: "",
      last_name: "",
      email_id: "",
      status: "",
      view_permission_flag: true,
      edit_permission_flag: true,
      admin_permission_flag: true,
      created_date: "",
      last_updated_date: "",
      sync_version_uuid: "",
      updated_by_userid: "",
    };
  }
}
