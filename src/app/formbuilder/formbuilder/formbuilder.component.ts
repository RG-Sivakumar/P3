import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, ViewChildren } from "@angular/core";
import { value, elementData, option } from "../Model/controlmodel";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import swal from "sweetalert2";
import { FormdataService } from "../services/formdata.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormlistService } from "../services/formlist.service";
import { BLACK_ON_WHITE_CSS_CLASS } from "@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { FormdesignComponent } from "../formdesign/formdesign.component";
import { DeleteformComponent } from "../deleteform/deleteform.component";
import { DuplicateelementComponent } from "../duplicateelement/duplicateelement.component";
import { ValueService } from "src/app/value.service";
import { SharedService } from "src/app/shared/shared.service";
import { Subscription } from "rxjs";
import { HeadertitleService } from "src/app/headertitle.service";
import { v1 as uuidv1 } from "uuid";
import * as _ from 'lodash';
import {
  JAN,
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { Builder } from "protractor";
import { threadId } from "worker_threads";
import { NumberFieldComponent } from "../number-field/number-field.component";
import { eventNames } from "process";
import { OptiondeleteComponent } from "./optiondelete/optiondelete.component";
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import { DatePipe } from "@angular/common";
import { FormControl, NG_VALIDATORS, FormGroup } from "@angular/forms";
import { ExitconfirmComponent } from "../exitconfirm/exitconfirm.component";
import { HostListener } from '@angular/core';
import { login } from "src/app/projectmanagement/models/login-model";
import { Location } from "@angular/common";
import { DataService } from "src/app/data.service";
import { CdkDragDrop, moveItemInArray, CdkDrag, transferArrayItem, CdkDragMove } from '@angular/cdk/drag-drop';
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { number } from "ngx-custom-validators/src/app/number/validator";
import { toUpper } from "lodash";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
const moment = _rollupMoment || _moment;
import { weld_form_main } from "../../commonshared/components/weldform/weldform_main.model"
export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    var formatString = "YYYY-MM-DD";
    return moment(date).format(formatString);
  }
}

@Component({
  selector: "app-formbuilder",
  templateUrl: "./formbuilder.component.html",
  styleUrls: ["./formbuilder.component.css"],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
    },
    { provide: NG_VALIDATORS, useExisting: FormbuilderComponent, multi: true },
  ],
})

export class FormbuilderComponent implements OnInit {
  deletedlist: any;
  admin: any;
  edit: any;
  border = 2;
  view: any;
  date = new FormControl();
  su: login;
  overlay = false;
  align = "start";
  itemValue: any[] = [];
  value: any[];
  updatedvalue: any[] = [];
  checkedvalue: boolean = false;
  selectedValue: string = "Top";
  dateopt: any;
  subText = ""; // The text that should appear in the sub-display
  mainText: any = ""; // The text that should appear in the main display
  operand1: number; // The first operand
  operand2: number; // The second operand
  operator = ""; // The operator
  calculationString = "";
  // This is the string that denotes the operation being performed
  answered = false;
  // A flag to check whether the solution has been processed
  operatorSet = false; // You'll see how this is used soon
  settingPage: boolean = false;
  false: any;
  useCondition: boolean;
  closeBox1 = false;
  closeBox2: boolean = false;
  itemValuesModelAtr: any;
  iconsPart: any[] = [];
  fillColorPart: any[] = [];
  strokeColorPart: any[] = [];
  opacity: any[] = [];
  lineWidth: any[] = [];
  addPositiveValues: boolean = false;
  activeGreen: any;
  columnsAdd: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  fillColor: any[] = ["No Change", "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Cyan", "Magenta", "Pink", "Brown", "Gray", "Dark Gray", "Light Gray", "Black", "White", "Clear"];
  strokeColor: any[] = ["No Change", "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Cyan", "Magenta", "Pink", "Brown", "Gray", "Dark Gray", "Light Gray", "Black", "White", "Clear"];
  iconShape: any[];
  radioValue: number = 0;
  checkboxValue: number = 0;
  calculationAddFieldValue1: any[] = [];
  @Input("useCondition") useCondition1: boolean;
  useConditionIntialCheck: boolean = false;
  support: boolean = false;
  Builder: boolean = true;
  filterName: string;
  vaue: any;
  getDate: any;
  selected_feld_state: string;
  selectedItem_element_type: any;
  selectOptions_Local: any;
  selectedItem_element_type_Local: any;
  pickedItem_element_type: any;
  DummyField: any;
  calculationResult: any;
  FieldResult: any;
  OptionName: any;
  selectedField: any;
  selectionValueCheck: any;
  addressCheck: any;
  userrole: any;
  projectid: string;
  line_width:any;
  opacitydividervalue:any="0.1";
  linewidthdivider: string;
  opacitydivider: string;
  list: any;
  useconditionlist: any;
  elements_combined : any;
  labelNames: string[] = ["Single Line Text Label","Text Area Label","Text","Number","option 1","Dropdown Label",
  "Single Choice Label","Multiple Choice Label","Date Picker Label","Formula","Address Label", "General comments", "Description"];
  labelNameplacehdr: string[] = ["123","ABC"]
 @ViewChild('dropdownselect')dropdowncolors:ElementRef;
  inputBox: any;
  inputBox1: any;
  isReadonly: any;
  lineWidthbox: any;
  decimal: boolean = false;
  zero: boolean = false;
  Updatemodel: any = [];
  exist_element: any;
  elementtype: any;
  settings1: boolean = false;
  settings2: boolean = false;
  placeholder: string;
  weldform: boolean = false;
  copyweldForm: any;
  groupAnnAlreadyEnabled: boolean = false;
  groupingFieldPresent = false;

  onValChange(val: string, item) {
    this.exitconfirm = false;
    console.log(this.exitconfirm)
    this.selectedValue = val;
    this.updatelastmodified(item)
  }
  form_id: any;
  form_name: any;
  userid = this.encrptdecrpt.getItem("loggedIn") || "{}";
  subscription: Subscription;
  addFieldNumberValue: any[] = [];
  addlabel = "add";
  defaultDecimal: string = "";
  uc: any;
  permissionDisable = false;
  pageFrom: string = "";
  lineWidthValue = 1;
  is_extend: boolean = false;
  ext_form_element_count: any;
  visible: any = "hidden";
  realHeight: any = 200;
  empty_cell = {
    element_type: "empty_cell",
    element_name: "empty_cell",
    element_uuid: '',
    element_id: 14,
    is_hidden: 0,
    is_removed: 0,
    width: 0,
    height: 0,
    version_number: 0,
    element_order: 0,
    element_data: {
      reference_id: ''
    }
  }

  @ViewChild('opacitySlider') opacitySlider: ElementRef;
  linewidthvaluedivider: any = 1;
  linewidthvaluegrouping:any = 1;
  @ViewChildren('dropdownselect') dropdownValuesEle: HTMLAllCollection;
  old_backup_text: any = "";
  realWidth: any;
  disable_calculation_seperator: boolean = false;
  timber_form_datas: any = [];
  custom_forms: boolean = false;

  //welddata
  left: boolean = false;
  right: boolean = false;
  formContentleft: any[] = [];
  formContentright: any[] = [];
  show: boolean = false;
  output: boolean = false;
  // form structure
  weld_FormStructure: FormGroup = new FormGroup({
    weldId: new FormControl(),
    areaEntire: new FormControl(),
    interpretation: new FormControl(),
    repairType: new FormControl(),
    areaSpecific: new FormControl(),
    remarks: new FormControl()
  })
  weld_form_table: weld_form_main[] = []
  formShow: boolean = false;
  idkey: string = "abt";
  dummyInput1: any[] = [];
  dummyInput2: any[] = [];
  fieldsWeld: any[] = [];
  errorField = {
    edit_mode: 0,
    is_hidden: 0,
    element_id: 100,
    is_removed: 0,
    element_data: {
      if_do: "",
      options: [{
        icon: "",
        name: "Error",
        default: false,
        opacity: 1,
        attributes: false,
        fill_color: "",
        is_removed: false,
        line_width: 0,
        element_uuid: "",
        stroke_color: "",
        calculated_value: "",
        number_of_columns: "2"
      }],
      if_state: "",
      if_value: "",
      attributes: false,
      label_text: "Error",
      label_align: "Top",
      if_condition: "",
      use_conditions: false,
      number_of_columns: 1,
      element_name_alias: "ErrorBox",
      use_calculated_values: false
    },
    element_name: "Error",
    element_type: "checkbox",
    element_uuid: "",
    element_order: 0,
    version_number: 0,
    sync_version_uuid: "",
    updated_by_userid: 0
  }
  groupFieldValues = [
    {name:"not_started",value:"No Change"},
    {name:"inprogress",value:"No Change"},
    {name:"completed",value:"No Change"},
    {name:"error",value:"No Change"}
  ]
  color_details_syntax_1 = {
    not_started: "",
    inprogress: "",
    completed: "",
    error: ""
  }
  color_details_linewidth = {
    line_width:""
  }
  

  constructor(
    private dataService2: DataserviceService,
    public dialog: MatDialog,
    public FDService: FormdataService,
    public route: Router,
    private routes: ActivatedRoute,
    public service: FormlistService,
    public service4: ValueService,
    private sharedService: SharedService,
    private headerService: HeadertitleService,
    private router: Router,
    private dialogRef: MatDialog,
    private _location: Location,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef, public userRoleGlobal: GlobalUserRoleService,
    private encrptdecrpt: EncryptDecryptService
  ) {
    // getting the form name , id,  form query parameter
    this.form_name = this.routes.snapshot.queryParamMap.get("Form_name");
    this.form_id = this.routes.snapshot.queryParamMap.get("Form_id");
    this.pageFrom = this.routes.snapshot.queryParamMap.get("pageFrom");
    this.admin = this.encrptdecrpt.getItem("Admin");
    this.edit = this.encrptdecrpt.getItem("Edit");
    this.view = this.encrptdecrpt.getItem("View");
    // localStorage.setItem('builder', 'form');
    this.encrptdecrpt.setItem("builder", 'form');//security
    if (this.admin == 0 && this.edit == 0 && this.view == 1) {
      this.permissionDisable = true;
    }
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");

    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole) => {
      this.userrole = res_userrole;
    })
    this.subscription = this.sharedService.getMessage().subscribe((message) => {
      switch (message) {
        case "Publish":
          this.publish();
          break;
        case "Build":
          this.build();
          break;
        case "Preview":
          this.saveAndgoto();
          break;
        case "Delete":
          this.delete();
          break;
        default:
          break;
      }
    });
    this.headerService.setTitle(this.form_name);
    this.isReadonly = this.encrptdecrpt.getItem("viewonlys");
  }

  grpAnnsCheck(event, item) {
    var extend = false;
    item.element_data.grouping_enable = event.checked;
    let cloneModelAttributes = _.cloneDeep(this.model.attributes);
    if(this.is_extend == true){
      extend = true;
      var cloneExtendModelAttributes = _.cloneDeep(this.extend_model.attributes);
    }
    if (event.checked == true) {
      // let color_details_syntax = {
      //   not_started: "red",
      //   inprogress: "orange",
      //   completed: "blue",
      //   error: "green"
      // }
      // item.element_data.group_color_details = color_details_syntax;
      const erroruuid = item.element_uuid + "-errorCheckbox";
      this.errorField.element_uuid = erroruuid;
      const annontationidDate = new Date().getTime();
      const uuid_options = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate + "-errorCheckbox";
      this.errorField.element_data.options[0].element_uuid = uuid_options;
      const currentFieldIndexleft = cloneModelAttributes.findIndex(data => data.element_uuid == item.element_uuid);
      if (currentFieldIndexleft != -1) {
        const newindexleft = currentFieldIndexleft + 1;
        this.model.attributes.splice(newindexleft, 0, this.errorField);
      }
      // used to find index in multi-column forms.
      if(currentFieldIndexleft == -1 && extend == true){
        const currentFieldIndexright = cloneExtendModelAttributes.findIndex(data => data.element_uuid == item.element_uuid);
        if (currentFieldIndexright != -1) {
          const newindexright = currentFieldIndexright + 1;
          this.extend_model.attributes.splice(newindexright, 0, this.errorField);
        }   
      }
    }
    // The below code is used to remove the error check box option.
    else {
      console.log(cloneModelAttributes);
      let index = this.model.attributes.findIndex(data => data.element_uuid.includes("errorCheckbox"));
      if(index != -1){
        this.model.attributes.splice(index,1);
      }
      else if(extend == true && index == -1){
        let indexright = this.extend_model.attributes.findIndex(data => data.element_uuid.includes("errorCheckbox"));
        if(indexright != -1){
          this.extend_model.attributes.splice(indexright,1);
        }
      }
    }

  }

  checkfocus(label, item) {
    if (this.labelNames.includes(label)) {
      this.labelText = "";
      return
    }
    const remBracket=label.split("(", 1);
    console.log(remBracket)
    const trimName = remBracket[0].trim()
    if(this.labelNames.includes(trimName)){
      this.labelText = "";
    }
  }
  checkfocus_placeholder(label) {
    if (this.labelNameplacehdr.includes(label)) {
      this.placeholderText = "";
      return
    }
  }

  // form builder side bar icons
  icon_object = {
    baseurl: "./assets/images/icons/",
    geticon: function (index) {
      //functions
      if (index == 13) {
        return this.baseurl + this.icons[11];
      }
      else if(index == 14){
        return this.baseurl + this.icons[12];
      }
      else {
        return this.baseurl + this.icons[index - 1];
      }

    },
    icons: [
      "P3WebIcon_19TextCursor.png",
      "P3WebIcon_20ABox.png",
      "P3WebIcon_21Letters.png",
      "P3WebIcon_22Numbers.png",
      "P3_FormBuilder-DividerIcon.png",
      "P3WebIcon_25Tick.png",
      "P3WebIcon_23DropDown.png",
      "P3WebIcon_24Record.png",
      "P3WebIcon_25Tick.png",
      "P3WebIcon_26Calendar.png",
      "P3WebIcon_27Function.png",
      "P3WebIcon_28Location.png",
      "P3WebIcon_13Edit.png"
    ],
  };
  ngOnInit(): void {
    //Setting the form heading
    this.headerService.setTitle(this.form_name);
    // localStorage.setItem('supportBack', JSON.stringify(true));
    this.encrptdecrpt.setItem("supportBack", true);//security
    //Icon names and id set for form field attributes
    this.iconShape = [{
      "Shape": "No Change",
      "id": 0
    }, {
      "Shape": "Square",
      "id": 3
    },
    {
      "Shape": "Circle",
      "id": 1
    }, {
      "Shape": "Triangle",
      "id": 4
    }, {
      "Shape": "Octagon",
      "id": 2
    }, {
      "Shape": "Star",
      "id": 5
    }, {
      "Shape": "Diamond",
      "id": 6
    }, {
      "Shape": "Flag",
      "id": 7
    }, {
      "Shape": "Camera",
      "id": 8
    }, {
      "Shape": "Right Wide Arrow",
      "id": 9
    }
    ];
    this.FDService.get_form_elements_structure().subscribe((data) => {
      //retriving form element structure
      console.log(data["response_body"].form_elements_template);
      let field = data["response_body"].form_elements_template;
      field.map((item) => {
        var itemData = item.element_data;
        let elementData = JSON.parse(itemData);
        item.element_data = elementData.element_data;
        return item;
      });
      this.fieldModel = field;
      console.log(this.fieldModel);
    });

    //get form data

    this.service.get_form_data(this.form_id).subscribe((data) => {
      console.log(data);
      if (data["response_code"] == 200) {
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

        if (data.response_body.form_listing[0].is_extend == 0 || data.response_body.form_listing[0].is_extend == "0") {
          this.is_extend = false;
        } else {
          this.is_extend = true;
          if (data.response_body.form_listing[0].ext_form_data != null && data.response_body.form_listing[0].ext_form_data != "null") {
            this.extend_model.attributes = JSON.parse(data.response_body.form_listing[0].ext_form_data);
          }
        }
        if (data.response_body.form_listing[0].form_data != null && data.response_body.form_listing[0].form_data != "null") {
          this.model.attributes = JSON.parse(data.response_body.form_listing[0].form_data);
          console.log(this.model.attributes);
          
          if (this.model.attributes.length > 0) {
            let get_response_form_data = this.model.attributes;
            let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data, 'formbuilderfieldsview');
            this.model.attributes = get_change_char_sptoquotes;
            this.checkGroupingField(this.model.attributes)
          }
          this.model.attributes.sort((a, b) => a.element_order - b.element_order);
          this.model.attributes.forEach(item => {
            if (item.element_type == 'uti-entry-field' || item.element_type == 'uti-entry-field-WMATA' || item.element_type == 'uti-entry-field-TIMBER'
              || item.element_type == 'uti-entry-field-WMATA_WELD') {
              this.custom_forms = true;
              if (item.element_type == 'uti-entry-field-WMATA_WELD') {
                this.weldform = true;
                console.log(this.extend_model.attributes);
                item.is_removed = false;
                this.copyweldForm = item;
              }
            }
            if (item.element_type == "checkbox") {
              console.log(item.element_type);
              item.element_data.label_text = item.element_data.options[0].name;
              item.element_data.element_name_alias = item.element_data.options[0].name;
              this.labelText = item.element_data.label_text;
            }
            if (item.element_data.maximum_value != undefined && item.element_data.maximum_value != "") {
              if (item.element_data.maximum_value % 1 != 0) {
                console.log(item.element_data.maximum_value)
                item.element_data.maximum_value = item.element_data.maximum_value
              } else if (item.element_data.maximum_value.includes(".")) {
                item.element_data.maximum_value = item.element_data.maximum_value
              }

              else {
                item.element_data.maximum_value = item.element_data.maximum_value + ".0"
              }
            }

            if (item.element_data.minimum_value != "") {
              if (item.element_data.minimum_value % 1 != 0) {
                console.log(item.element_data.minimum_value)
                item.element_data.minimum_value = item.element_data.minimum_value
              } else if (item.element_data.minimum_value.includes(".")) {
                item.element_data.minimum_value = item.element_data.minimum_value
              } else {
                item.element_data.minimum_value = item.element_data.minimum_value + ".0"
              }
            }

            //  item.element.data.maximum_value=Number(item.element_data.maximum_value.toFixed(1))
            //  console.log(item.element.data.maximum_value.toString())

            //Calculation while coming into form 
            if ("calculation_value" in item.element_data) {
              //settings the default value for calculation decimel
              if (item.element_data.default_value == "") {
                item.element_data.default_value = "1";
              }
              if (item.element_data.calculation_value != "")
                this.FormfieldValueChange();
            }
          });
          // timber form data send place
          if (this.model.attributes != undefined && this.model.attributes != null && this.model.attributes.length > 0) {
            this.timber_form_datas = this.model.attributes;
          }
          else {
            this.timber_form_datas = [];
          }
        }
        if (data.response_body.form_listing[0].ext_form_data != null && data.response_body.form_listing[0].ext_form_data != "null" && this.is_extend) {
          this.extend_model.attributes = JSON.parse(data.response_body.form_listing[0].ext_form_data);
          console.log(this.extend_model.attributes);
          if (this.weldform == true) {
            this.extend_model.attributes.push(this.copyweldForm);
          }
          if (this.extend_model.attributes.length > 0) {
            let get_response_form_data = this.extend_model.attributes;
            let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data, 'formbuilderfieldsview');
            this.extend_model.attributes = get_change_char_sptoquotes;
          }
          this.extend_model.attributes.sort((a, b) => a.element_order - b.element_order);
          this.extend_model.attributes.forEach(item => {

            if (item.element_type == "checkbox") {
              console.log(item.element_type);
              item.element_data.label_text = item.element_data.options[0].name;
              item.element_data.element_name_alias = item.element_data.options[0].name;
              this.labelText = item.element_data.label_text;
            }
            if (item.element_data.maximum_value != undefined && item.element_data.maximum_value != "") {
              if (item.element_data.maximum_value % 1 != 0) {
                console.log(item.element_data.maximum_value)
                item.element_data.maximum_value = item.element_data.maximum_value
              } else if (item.element_data.maximum_value.includes(".")) {
                item.element_data.maximum_value = item.element_data.maximum_value
              }

              else {
                item.element_data.maximum_value = item.element_data.maximum_value + ".0"
              }
            }

            if (item.element_data.minimum_value != "") {
              if (item.element_data.minimum_value % 1 != 0) {
                console.log(item.element_data.minimum_value)
                item.element_data.minimum_value = item.element_data.minimum_value
              } else if (item.element_data.minimum_value.includes(".")) {
                item.element_data.minimum_value = item.element_data.minimum_value
              } else {
                item.element_data.minimum_value = item.element_data.minimum_value + ".0"
              }
            }

            //  item.element.data.maximum_value=Number(item.element_data.maximum_value.toFixed(1))
            //  console.log(item.element.data.maximum_value.toString())

            //Calculation while coming into form 
            if ("calculation_value" in item.element_data) {
              //settings the default value for calculation decimel
              item.element_data.default_value = "1";
              if (item.element_data.calculation_value != "")

                this.extend_FormfieldValueChange();
            }
          });
          console.log(this.model.attributes);

        }
        this.alignmenprocess();
      }
      else {
      }

    });

  }
  alignmenprocess() {
    if (this.is_extend == true) {
      let check_condition = ["false", false, 0, "0"];
      let column_one = _.cloneDeep(this.model.attributes);
      let column_two = _.cloneDeep(this.extend_model.attributes);
      var annontationidDate = new Date().getTime();
      this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
      console.log(this.model.attributes);
      console.log(this.extend_model.attributes);
      column_one = column_one.filter((data) => check_condition.includes(data.is_removed));
      column_two = column_two.filter((data) => check_condition.includes(data.is_removed));

      let elements_height = _.cloneDeep(this.element_details);

      if (column_one.length == column_two.length) {
        for (let i = 0; i < column_one.length; i++) {

          let temp_extend_holder = column_two.filter(ele => ele["element_data"].reference_id == column_one[i].element_uuid);
          if (temp_extend_holder.length == 0) {
            break;
          }
          let index = column_two.indexOf(temp_extend_holder[0]);
          console.log(index);
          let ele_one = this.element_details.filter(data => data.element_name == column_one[i].element_type);
          let ele_two = elements_height.filter(data => data.element_name == column_two[index].element_type);

          if (column_one[i].element_type == "multiple_choice" || column_one[i].element_type == "single_choice") {
            let option_list = column_one[i].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
            let option_list_length = option_list.length;
            let Option_to_add = 28 * option_list_length;
            if (ele_one[0].element_name == "multiple_choice" || ele_one[0].element_name == "single_choice") {
              ele_one[0].height = 40;
              ele_one[0].height += Option_to_add;
            }
          }
          if (column_two[index].element_type == "multiple_choice" || column_two[index].element_type == "single_choice") {
            let option_list = column_two[index].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
            let option_list_length = option_list.length;
            let Option_to_add = 28 * option_list_length;
            if (ele_two[0].element_name == "multiple_choice" || ele_two[0].element_name == "single_choice") {
              ele_two[0].height = 40;
              ele_two[0].height += Option_to_add;
            }
          }

          if (ele_one[0].height >= ele_two[0].height) {
            column_one[i].height = ele_one[0].height;
            column_two[index].height = ele_one[0].height;
          } else {
            column_one[i].height = ele_two[0].height;
            column_two[index].height = ele_two[0].height;
          }
        }

        this.model.attributes = column_one;
        this.extend_model.attributes = column_two;
        console.log(JSON.stringify(column_one));
        console.log(JSON.stringify(column_two));
      }
      else {
        if (column_one.length != column_two.length) {
          if (column_one.length > column_two.length) {
            let clone_model = {
              element_type: "empty_cell",
              element_name: "empty_cell",
              element_uuid: '',
              element_id: 14,
              is_hidden: 0,
              is_removed: 0,
              width: 0,
              height: 0,
              version_number: 0,
              element_order: 0,
              element_data: {
                reference_id: column_one[column_one.length - 1].element_uuid
              }
            }
            clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
            this.extend_model.attributes.splice(column_one.length, 0, clone_model);
          } else {
            let clone_model = {
              element_type: "empty_cell",
              element_name: "empty_cell",
              element_uuid: '',
              element_id: 14,
              is_hidden: 0,
              width: 0,
              height: 0,
              is_removed: 0,
              version_number: 0,
              element_order: 0,
              element_data: {
                reference_id: column_two[column_two.length - 1].element_uuid
              }
            }
            clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
            this.model.attributes.splice(column_two.length, 0, clone_model);
          }

        }

      }
    }
  }

  //setting page close
  closeBox() {
    this.isCompleted = []
    this.closeBox1 = false;
    this.closeBox2 = false;
    this.setBorder = false;
    this.addFieldPart = false;
    this.FormfieldValueChange();
    // check timber form changes happen

    if (this.timber_form_datas != undefined && this.timber_form_datas != null && this.timber_form_datas.length > 0) {
      this.timber_form_datas = this.model.attributes;
      this.dataService2.diameter_changes.emit(this.timber_form_datas);
    }
  }




  //options for dropdown singlechoice
  Options: option = {
    name: "",
  };
  toggle = false;
  isCompleted = []
  fieldModel: Array<any>;
  //style object for drag and drop section //optional
  modelFields: Array<elementData> = [];

  model: any = {
    name: "Form name...",
    description: "Form Description...",
    theme: {
      bgColor: "ffffff",
      textColor: "555555",
      bannerImage: "",
    },
    attributes: this.modelFields,
  };

  extend_model: any = {
    name: "Form name...",
    description: "Form Description...",
    theme: {
      bgColor: "ffffff",
      textColor: "555555",
      bannerImage: "",
    },
    attributes: [],
  };
  ele_detail: any;
  element_details: any = [
    { element_name: "single_line_text", width: 248, height: 60 },
    {
      element_name: "text_area",
      width: 248,
      height: 160
    },
    {
      element_name: "number",
      width: 248,
      height: 70
    },
    {
      element_name: "text_label",
      width: 248,
      height: 40
    },
    {
      element_name: "empty_cell",
      width: 0,
      height: 0
    },
    {
      element_name: "Divider",
      width: 248,
      height: 30
    }
    , {
      element_name: "checkbox",
      element_alias_name: 'option 1',
      width: 248,
      height: 51
    }
    , {
      element_name: "dropdown",
      width: 248,
      height: 60
    }
    , {
      element_name: "single_choice",
      width: 248,
      height: 56
    }
    , {
      element_name: "multiple_choice",
      width: 248,
      height: 56
    }
    , {
      element_name: "date",
      width: 248,
      height: 70
    }, {
      element_name: "calculation",
      width: 248,
      height: 70
    },
    {
      element_name: "address",
      width: 248,
      height: 160
    }
  ];
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  build() {
    this.overlay = false;
    this.sharedService.filter("Refresh Click");
    document.querySelector("#FAQ");
  }
  // form element publish section
  exitconfirm: boolean = true;
  sendElement = [];
  extend_sendElement = [];
  publish() {
    if ((this.isReadonly != true || this.isReadonly == null)) {
      if (this.userrole != 'view') {
        if (this.is_extend == false) {
          let clone_send_values = _.cloneDeep(this.model.attributes);
          this.sendElement = clone_send_values.map((val, index) => {
            // val.element_data.element_order = index;
            val.element_order = index;
            return val;
          });
          let createdDate = new Date().toISOString();
          // changing special character form fields
          if (Array.isArray(this.sendElement)) {
            if (this.sendElement.length > 0) {
              this.sendElement = this.dataService.changingformelementpublish(this.sendElement, 'formbuilder');
            }
          }
          this.Updatemodel = {
            user_id: this.userid.user_id,
            form_id: this.routes.snapshot.queryParamMap.get("Form_id"),
            form_data: this.sendElement,
            ext_form_data: this.extend_model.attributes,
            is_extend: this.is_extend,
            ext_form_element_count: this.extend_model.attributes.length,
            form_element_count: this.model.attributes.length,
          };
          console.log(JSON.stringify(this.sendElement));
          console.log(JSON.stringify(this.extend_model.attributes));
          this.FDService.update_form_data(this.Updatemodel).subscribe((data) => {
            this.itemValue = [];
            this.updatevalueRefresh();
            this.updatedvalue = JSON.parse(data["response_body"].form_data);
            for (var i = 0; i < this.updatedvalue.length; i++) {
              var labelName = this.updatedvalue[i].element_data.label_text;
              this.itemValue.push(labelName);
              console.log(this.itemValue)
            }
            this.overlay = true;

          });
        } else {
          let clone_send_values = _.cloneDeep(this.model.attributes);
          this.sendElement = clone_send_values.map((val, index) => {
            // val.element_data.element_order = index;
            val.element_order = index;
            return val;
          });
          // changing special character form fields
          if (Array.isArray(this.sendElement)) {
            if (this.sendElement.length > 0) {
              this.sendElement = this.dataService.changingformelementpublish(this.sendElement, 'formbuilder');
            }
          }

          let extend_clone_send_values = _.cloneDeep(this.extend_model.attributes);
          this.extend_sendElement = extend_clone_send_values.map((val, index) => {
            // val.element_data.element_order = index;
            val.element_order = index;
            return val;
          });
          // changing special character form fields
          if (Array.isArray(this.extend_sendElement)) {
            if (this.extend_sendElement.length > 0) {
              this.extend_sendElement = this.dataService.changingformelementpublish(this.extend_sendElement, 'formbuilder');
            }
          }
          // To remove the uti-weld-form from extend forms
          if (this.extend_sendElement.length != 0) {
            this.extend_sendElement = this.extend_sendElement.filter((data) => data.element_type != "uti-entry-field-WMATA_WELD")
          }
          this.Updatemodel = {
            user_id: this.userid.user_id,
            form_id: this.routes.snapshot.queryParamMap.get("Form_id"),
            form_data: this.sendElement,
            ext_form_data: this.extend_sendElement,
            is_extend: this.is_extend,
            ext_form_element_count: this.extend_model.attributes.length,
            form_element_count: this.model.attributes.length,
          };
          console.log(JSON.stringify(this.sendElement));
          console.log(JSON.stringify(this.extend_model.attributes));
          this.FDService.update_form_data(this.Updatemodel).subscribe((data) => {
            console.log(data);
            this.itemValue = [];
            this.updatevalueRefresh();
            this.updatedvalue = JSON.parse(data["response_body"].form_data);
            for (var i = 0; i < this.updatedvalue.length; i++) {
              var labelName = this.updatedvalue[i].element_data.label_text;
              this.itemValue.push(labelName);
              console.log(this.itemValue)
            }
            this.overlay = true;

          });
        }


        console.log(this.Updatemodel);

      }
      else if (this.userrole == 'view') {
        this.userRoleGlobal.permissionCheck();
      }
    }
    else {
      this.userRoleGlobal.permissionCheck();
    }
    this.exitconfirm = true;
  }

  updatevalueRefresh() {
    this.form_name = this.routes.snapshot.queryParamMap.get("Form_name");
    this.form_id = this.routes.snapshot.queryParamMap.get("Form_id");

    //get_form elelmrnt structure
    this.FDService.get_form_elements_structure().subscribe((data) => {
      console.log(data);
      let field = data["response_body"].form_elements_template;

      field.map((item) => {
        //  item.element_data=JSON.parse(item.element_data)
        let elementData = JSON.parse(item.element_data);
        item.element_data = elementData.element_data;

        // item.icon = this.icon_object.geticon(item.element_id)
        return item;
      });
      //
      //
      this.fieldModel = field;
    });

    //get form data
    this.service.get_form_data(this.form_id).subscribe((data) => {
      console.log(data)
      if (data.response_body.form_listing[0].form_data != null) {
        this.model.attributes = JSON.parse(data.response_body.form_listing[0].form_data);
        console.log(this.model.attributes);
        if (this.model.attributes.length > 0) {
          let get_response_form_data = this.model.attributes;
          let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data, 'formbuilderfieldsview');
          this.model.attributes = get_change_char_sptoquotes;
        }
      }
      if (data.response_body.form_listing[0].form_data != null) {

      }
      var status = data["response_code"];
      for (var i = 0; i < this.model.attributes.length; i++) {
        this.itemValue.push(this.model.attributes[i].element_data.label_text);
      }
    });
  }

  //public overlay close
  closeBoxOverlay() {
    this.overlay = false;
    this.sharedService.filter("Refresh Click");
  }
  // drop point form elemnt drop to the form builder
  onDrop(event: DndDropEvent, list?: any[], list2?: any[]) {
    //if it is a single check box the current option name need to assign to the label text and element_name_alias
    console.log("ondrop event triggered")
    if (event.data.element_type == "checkbox") {
      event.data.element_data.label_text = event.data.element_data.options[0].name;
      event.data.element_data.element_name_alias = event.data.element_data.options[0].name;
      this.labelText = event.data.element_data.label_text;
    }
    //if it a calculation field  dafukt value need to set as one at begning
    if (event.data.element_type == "calculation") {
      event.data.element_data.default_value = "1";
    }

    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var annontationidDate = new Date().getTime();
    // newchanges_ganesh
    // event.data.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;

    if (list && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      console.log('effect', event.dropEffect);
      //drop effect copy will work from dragging the element field to form builder
      if (event.dropEffect === "copy") {
        event.data.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
        if (event.data.element_data.hasOwnProperty('options') && event.data.element_data.options != "") {
          event.data.element_data.options.forEach((e) => {
            e.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
          });
        }
        event.data.element_name = event.data.element_type;
        //duplicate name checking function call
        this.duplicateNaming(event.data.element_data.label_text, event.data, 'copy')
      }
      var index = event.index;
      if (typeof index === "undefined") {
        index = list.length;
      }
      if (list.length > 0 && list[index] != undefined) {
        if (list[index].element_name == "empty_cell") {
          if (event.dropEffect === "copy") {
            event.data.element_data.reference_id = list[index]["element_data"].reference_id;
            event.data.element_uuid = list[index].element_uuid;
          }
          else if (event.dropEffect === "move") {
            event.data.element_data.reference_id = list[index]["element_data"].reference_id;
            list2[index]["element_data"].reference_id = event.data.element_uuid;
          }
          list.splice(index, 1, event.data);
        } else {
          // event.data.element_data.reference_id =  list2[index]["element_data"].reference_id;
          // event.data.element_uuid = list2[index].element_uuid;
          list.splice(index, 0, event.data);
        }
      } else {
        list.splice(index, 0, event.data);
        this.checkGroupingField(list)
      }


    }

    if (this.is_extend == true) {
      let custum_model = _.cloneDeep(this.model.attributes);
      custum_model = custum_model.filter((data) => data.is_removed == 0 || data.is_removed == "0");

      let extend_custum_model = _.cloneDeep(this.extend_model.attributes);
      extend_custum_model = extend_custum_model.filter((data) => data.is_removed == 0 || data.is_removed == "0");

      if (custum_model.length != extend_custum_model.length) {
        if (custum_model.length > extend_custum_model.length) {
          let clone_model = _.cloneDeep(this.empty_cell)
          clone_model["element_data"].reference_id = event.data.element_uuid;
          clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
          event.data["element_data"].reference_id = clone_model.element_uuid;
          this.extend_model.attributes.splice(index, 0, clone_model);
        } else {
          let clone_model = _.cloneDeep(this.empty_cell)
          clone_model["element_data"].reference_id = event.data.element_uuid;
          clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
          event.data["element_data"].reference_id = clone_model.element_uuid;
          this.model.attributes.splice(index, 0, clone_model);
        }

      }

      let check_condition = ["false", false, 0, "0"];
      if (this.model.attributes.length == this.extend_model.attributes.length) {
        for (let i = 0; i < this.model.attributes.length; i++) {

          let temp_extend_holder = this.extend_model.attributes.filter(ele => ele["element_data"].reference_id == this.model.attributes[i].element_uuid);
          let index = this.extend_model.attributes.indexOf(temp_extend_holder[0]);
          let elements_height = _.cloneDeep(this.element_details);
          console.log('temp_extend_holder', temp_extend_holder);
          console.log('index', index);
          console.log('elements_height', elements_height);
          let ele_one = this.element_details.filter(data => data.element_name == this.model.attributes[i].element_type);
          let ele_two = elements_height.filter(data => data.element_name == this.extend_model.attributes[index].element_type);

          if (this.model.attributes[i].element_type == "multiple_choice" || this.model.attributes[i].element_type == "single_choice") {
            let option_list = this.model.attributes[i].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
            let option_list_length = option_list.length;
            let Option_to_add = 26 * option_list_length;
            if (ele_one[0].element_name == "multiple_choice" || ele_one[0].element_name == "single_choice") {
              ele_one[0].height = 40;
              ele_one[0].height += Option_to_add;
            }
          }
          if (this.extend_model.attributes[index].element_type == "multiple_choice" || this.extend_model.attributes[index].element_type == "single_choice") {
            let option_list = this.extend_model.attributes[index].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
            let option_list_length = option_list.length;
            let Option_to_add = 26 * option_list_length;
            if (ele_two[0].element_name == "multiple_choice" || ele_two[0].element_name == "single_choice") {
              ele_two[0].height = 40;
              ele_two[0].height += Option_to_add;
            }
          }

          if (ele_one[0].height >= ele_two[0].height) {
            this.model.attributes[i].height = ele_one[0].height;
            this.extend_model.attributes[index].height = ele_one[0].height;
          } else {
            this.model.attributes[i].height = ele_two[0].height;
            this.extend_model.attributes[index].height = ele_two[0].height;
          }
        }
      }
    }
    // table view of two element

    for (let a = 0; a < this.model.attributes.length; a++) {
      console.log('model to extend');
      console.log("name", this.model.attributes[a].element_data.label_text);
      console.log("uuid", this.model.attributes[a].element_uuid);
      console.log("ext name", this.extend_model.attributes[a].element_data.label_text);
      console.log('ext refId', this.extend_model.attributes[a].element_data.reference_id);
      console.log('extend to model');
      console.log("ext name", this.extend_model.attributes[a].element_data.label_text);
      console.log("ext uuid", this.extend_model.attributes[a].element_uuid);
      console.log("name", this.model.attributes[a].element_data.label_text);
      console.log('refId', this.model.attributes[a].element_data.reference_id);
    }
  }
  extend_onDrop(event: DndDropEvent, list?: any[], list2?: any[]) {
    console.log("extend ondrop event triggered")
    if (event.data.element_type == "checkbox") {
      event.data.element_data.label_text = event.data.element_data.options[0].name;
      event.data.element_data.element_name_alias = event.data.element_data.options[0].name;
      this.labelText = event.data.element_data.label_text;
    }
    //if it a calculation field  dafukt value need to set as one at begning
    if (event.data.element_type == "calculation") {
      event.data.element_data.default_value = "1";
    }

    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var annontationidDate = new Date().getTime();
    // newchanges_ganesh
    // event.data.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;

    if (list2 && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      //drop effect copy will work from dragging the element field to form builder
      if (event.dropEffect === "copy") {
        // newchanges_ganesh
        event.data.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
        if (event.data.element_data.hasOwnProperty('options') && event.data.element_data.options != "") {
          event.data.element_data.options.forEach((e) => {
            e.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
          });
        }
        event.data.element_name = event.data.element_type;
        //duplicate name checking function call
        this.duplicateNaming(event.data.element_data.label_text, event.data, 'copy')
      }
      var index = event.index;
      console.log('from index', event.index);
      if (typeof index === "undefined") {
        index = list2.length;
      }
      if (list2.length > 0 && list2[index] != undefined) {
        if (list2[index].element_name == "empty_cell") {
          if (event.dropEffect === "copy") {
            event.data.element_data.reference_id = list2[index]["element_data"].reference_id;
            event.data.element_uuid = list2[index].element_uuid;
          }
          else if (event.dropEffect === "move") {
            event.data.element_data.reference_id = list2[index]["element_data"].reference_id;
            list[index]["element_data"].reference_id = event.data.element_uuid;
          }
          list2.splice(index, 1, event.data);
        } else {
          // event.data.element_data.reference_id =  list[index]["element_data"].reference_id;
          // event.data.element_uuid = list[index].element_uuid;
          list2.splice(index, 0, event.data);
        }
      } else {
        list2.splice(index, 0, event.data);
      }

    }

    let custum_model = _.cloneDeep(this.model.attributes);
    custum_model = custum_model.filter((data) => data.is_removed == 0 || data.is_removed == "0");

    let extend_custum_model = _.cloneDeep(this.extend_model.attributes);
    extend_custum_model = extend_custum_model.filter((data) => data.is_removed == 0 || data.is_removed == "0");

    if (custum_model.length != extend_custum_model.length) {
      if (custum_model.length > extend_custum_model.length) {
        let clone_model = _.cloneDeep(this.empty_cell);
        clone_model["element_data"].reference_id = event.data.element_uuid;
        clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
        event.data["element_data"].reference_id = clone_model.element_uuid;
        this.extend_model.attributes.splice(index, 0, clone_model);
      } else {
        let clone_model = _.cloneDeep(this.empty_cell);
        clone_model["element_data"].reference_id = event.data.element_uuid;
        clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
        event.data["element_data"].reference_id = clone_model.element_uuid;
        this.model.attributes.splice(index, 0, clone_model);
      }

    }

    let check_condition = ["false", false, 0, "0"];

    if (this.model.attributes.length == this.extend_model.attributes.length) {
      for (let i = 0; i < this.model.attributes.length; i++) {

        let temp_extend_holder = this.extend_model.attributes.filter(ele => ele["element_data"].reference_id == this.model.attributes[i].element_uuid);
        let index = this.extend_model.attributes.indexOf(temp_extend_holder[0]);

        let elements_height = _.cloneDeep(this.element_details);

        console.log('temp_extend_holder', temp_extend_holder);
        console.log('index', index);
        console.log('index', elements_height);
        let ele_one = this.element_details.filter(data => data.element_name == this.model.attributes[i].element_type);
        let ele_two = elements_height.filter(data => data.element_name == this.extend_model.attributes[index].element_type);

        if (this.model.attributes[i].element_type == "multiple_choice" || this.model.attributes[i].element_type == "single_choice") {
          let option_list = this.model.attributes[i].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
          let option_list_length = option_list.length;
          let Option_to_add = 26 * option_list_length;
          if (ele_one[0].element_name == "multiple_choice" || ele_one[0].element_name == "single_choice") {
            ele_one[0].height = 40;
            ele_one[0].height += Option_to_add;
          }
        }
        if (this.extend_model.attributes[index].element_type == "multiple_choice" || this.extend_model.attributes[index].element_type == "single_choice") {
          let option_list = this.extend_model.attributes[index].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
          let option_list_length = option_list.length;
          let Option_to_add = 26 * option_list_length;
          if (ele_two[0].element_name == "multiple_choice" || ele_two[0].element_name == "single_choice") {
            ele_two[0].height = 40;
            ele_two[0].height += Option_to_add;
          }
        }

        if (ele_one[0].height >= ele_two[0].height) {
          this.model.attributes[i].height = ele_one[0].height;
          this.extend_model.attributes[index].height = ele_one[0].height;
        } else {
          this.model.attributes[i].height = ele_two[0].height;
          this.extend_model.attributes[index].height = ele_two[0].height;
        }
      }
    }
    for (let a = 0; a < this.model.attributes.length; a++) {
      console.log('model to extend');
      console.log("name", this.model.attributes[a].element_data.label_text);
      console.log("uuid", this.model.attributes[a].element_uuid);
      console.log("ext name", this.extend_model.attributes[a].element_data.label_text);
      console.log('ext refId', this.extend_model.attributes[a].element_data.reference_id);
      console.log('extend to model');
      console.log("ext name", this.extend_model.attributes[a].element_data.label_text);
      console.log("ext uuid", this.extend_model.attributes[a].element_uuid);
      console.log("name", this.model.attributes[a].element_data.label_text);
      console.log('refId', this.model.attributes[a].element_data.reference_id);
    }
  }
  simpleClone(obj: any) {
    return Object.assign({}, obj);
  }

  onDragged(item: any, list: any[], list2: any[], effect: DropEffect) {
    console.log("ondrag event triggered")
    if (this.is_extend == true) {
      if (effect === "move") {
        let temp_model_del = list.findIndex(ele => ele.element_uuid == item.element_uuid);
        if (temp_model_del != -1) {
          let temp_element = list2[temp_model_del];
          if (list[temp_model_del].element_uuid == temp_element["element_data"].reference_id) {
            if (temp_element.element_name == "empty_cell") {
              list2.splice(temp_model_del, 1);
              list.splice(temp_model_del, 1);

            } else {
              let clone_model = _.cloneDeep(this.empty_cell)
              // add empty cell left model opposite based 
              clone_model["element_data"].reference_id = temp_element.element_uuid;
              // clone_model.element_uuid = temp_element["element_data"].reference_id;
              clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
              clone_model.height = temp_element.height;
              list.splice(temp_model_del, 1, clone_model);
              // list 2 extend model change the reference new id
              let clone_tem_element = _.cloneDeep(temp_element);
              clone_tem_element["element_data"].reference_id = clone_model.element_uuid;
              list2.splice(temp_model_del, 1, clone_tem_element)
              this.alignmenprocess();
            }
          }
        }
        // let itemIndex = list.indexOf(item);
        // list.splice(itemIndex,1);
      }
    }
    else {
      let itemIndex = list.indexOf(item);
      list.splice(itemIndex, 1);
    }
  }
  extend_onDragged(item: any, list: any[], list2: any[], effect: DropEffect) {
    console.log("extedn ondraggg function")
    if (effect === "move") {
      let temp_model_del = list2.findIndex(ele => ele.element_uuid == item.element_uuid);
      if (temp_model_del != -1) {
        let temp_element = list[temp_model_del];
        if (list2[temp_model_del].element_uuid == temp_element["element_data"].reference_id) {
          if (temp_element.element_name == "empty_cell") {
            list.splice(temp_model_del, 1);
            list2.splice(temp_model_del, 1);
          } else {
            // add empty cell right model opposite based 
            let clone_model = _.cloneDeep(this.empty_cell)
            clone_model["element_data"].reference_id = temp_element.element_uuid;
            // clone_model.element_uuid = temp_element["element_data"].reference_id;
            clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
            clone_model.height = temp_element.height;
            list2.splice(temp_model_del, 1, clone_model);
            // list model change the reference new id
            let clone_tem_element = _.cloneDeep(temp_element);
            clone_tem_element["element_data"].reference_id = clone_model.element_uuid;
            list.splice(temp_model_del, 1, clone_tem_element);
            this.alignmenprocess();
          }
        }
      }
    }
  }
  onDragCanceled(event: DragEvent) { }

  onDragover(event: DragEvent) {
  }

  onDragStart(event: DragEvent, item: any) {

  }

  onDragEnd(event: DragEvent, labelText, item) {
    console.log('dragend');
    if (this.userrole == 'view' || this.isReadonly == true || this.custom_forms == true) {
      // no need to execute
    }
    else {
      this.exitconfirm = false;
      this.itemValue.push(labelText);
    }
  }
  checkGroupingField(modelfields) {
    let modelAttributes_copy = _.cloneDeep(modelfields);
    let groupingPresent = modelAttributes_copy.filter(id => id.is_removed == false && id.element_type == 'group_field');
    if (groupingPresent.length > 0) {
      this.groupingFieldPresent = true;
    }
  }

  onDraggableCopied(event: DragEvent) { }

  onDraggableLinked(event: DragEvent) { }
  //form element click
  formelementClick(item, labelText) {
    //if it is a single check box the current option name need to assign to the label text and element_name_alias
    this.exitconfirm = false;
    if (item.element_type == "checkbox") {
      item.element_data.label_text = item.element_data.options[0].name;
      item.element_data.element_name_alias = item.element_data.options[0].name;
      this.labelText = item.element_data.label_text;
    }

    if (item.element_type == "single_choice") {
      item.element_data.options.forEach((e) => {
        let firsttypeLetter = e.name[0].toUpperCase();
        let othertypeletters = e.name.slice(1);
        let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
        e.name = changeUpperCaseProjectName;
      })
    }

    //if it a calculation field  dafukt value need to set as one at begning
    if (item.element_type == "calculation") {
      item.element_data.default_value = "1"
    }
    item.element_data.use_calculated_values = false
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";

    var annontationidDate = new Date().getTime();
    let _item = _.cloneDeep(item);
    _item.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    if (_item.element_data.hasOwnProperty('options') && _item.element_data.options != "") {
      _item.element_data.options.forEach((e) => {
        e.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
      });
    }
    this.duplicateNaming(_item.element_data.label_text, _item, 'copy')
    this.itemValue.push(labelText);
    let item1 = { ..._item };
    let item2 = JSON.stringify(item1);
    let item3 = JSON.parse(item2);
    console.log(item, _item);
    this.model.attributes.splice(this.model.attributes.length, 0, item3);
    this.checkGroupingField(this.model.attributes);

    // this.model.attributes.push(item)
    if (this.is_extend == true) {

      let custum_model = _.cloneDeep(this.model.attributes);
      custum_model = custum_model.filter((data) => data.is_removed == 0 || data.is_removed == "0");

      let extend_custum_model = _.cloneDeep(this.extend_model.attributes);
      extend_custum_model = extend_custum_model.filter((data) => data.is_removed == 0 || data.is_removed == "0");

      if (custum_model.length != extend_custum_model.length) {
        if (custum_model.length > extend_custum_model.length) {
          let clone_model = _.cloneDeep(this.empty_cell);
          clone_model["element_data"].reference_id = item3.element_uuid;
          clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
          item3["element_data"].reference_id = clone_model.element_uuid;
          this.extend_model.attributes.splice(extend_custum_model.length, 0, clone_model);
        } else {
          let clone_model = _.cloneDeep(this.empty_cell);
          clone_model["element_data"].reference_id = item3.element_uuid;
          clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
          item3["element_data"].reference_id = clone_model.element_uuid;
          this.model.attributes.splice(custum_model.length, 0, clone_model);
        }

      }

      let check_condition = ["false", false, 0, "0"];

      if (this.model.attributes.length == this.extend_model.attributes.length) {
        for (let i = 0; i < this.model.attributes.length; i++) {

          let temp_extend_holder = this.extend_model.attributes.filter(ele => ele["element_data"].reference_id == this.model.attributes[i].element_uuid);
          let index = this.extend_model.attributes.indexOf(temp_extend_holder[0]);

          let elements_height = _.cloneDeep(this.element_details);

          let ele_one = this.element_details.filter(data => data.element_name == this.model.attributes[i].element_type);
          let ele_two = elements_height.filter(data => data.element_name == this.extend_model.attributes[index].element_type);

          if (this.model.attributes[i].element_type == "multiple_choice" || this.model.attributes[i].element_type == "single_choice") {
            let option_list = this.model.attributes[i].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
            let option_list_length = option_list.length;
            let Option_to_add = 26 * option_list_length;
            if (ele_one[0].element_name == "multiple_choice" || ele_one[0].element_name == "single_choice") {
              ele_one[0].height = 40;
              ele_one[0].height += Option_to_add;
            }
          }
          if (this.extend_model.attributes[index].element_type == "multiple_choice" || this.extend_model.attributes[index].element_type == "single_choice") {
            let option_list = this.extend_model.attributes[index].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
            let option_list_length = option_list.length;
            let Option_to_add = 26 * option_list_length;
            if (ele_two[0].element_name == "multiple_choice" || ele_two[0].element_name == "single_choice") {
              ele_two[0].height = 40;
              ele_two[0].height += Option_to_add;
            }
          }

          if (ele_one[0].height >= ele_two[0].height) {
            this.model.attributes[i].height = ele_one[0].height;
            this.extend_model.attributes[index].height = ele_one[0].height;
          } else {
            this.model.attributes[i].height = ele_two[0].height;
            this.extend_model.attributes[index].height = ele_two[0].height;
          }
        }
      }

      this.alignmenprocess();
    }


  }
  editIndex: number;
  setBorder: boolean = false;
  labelText: string = "";
  labelText1: string = "";
  placeholderText: string = "";
  placeholderText1: string = "";
  toggle1: boolean = false;
  //display section

  //field click and settings page added
  showProperties(item, k) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    if (item.element_type == 'uti-entry-field' || item.element_type == 'uti-entry-field-WMATA' || item.element_type == 'uti-entry-field-TIMBER' ||
      item.element_type == 'uti-entry-field-WMATA_WELD' || item.element_uuid.includes('errorCheckbox')) {
      //nothing will happend no need to open setting page custom forms
      console.log("UTI-Forms")
    }
    else {
      this.settings1 = true;
      this.elementtype = item.element_type;
      if (item.element_type != 'empty_cell') {
        this.closeBox2 = false;
        console.log(this.exitconfirm)
        this.updatelastmodified(item)
        this.selectedField = item;
        if (item.element_type == "date") {
          if (item.element_data.default_date_time == "current") {
            this.DateDefault = false;
          }
          else {
            this.DateDefault = true;
          }
        }
        this.toggle1 = false;
        if (item.element_data.use_conditions == true) {
          console.log(this.model.attributes)
          this.pickedItem_element_type = item.element_type;
          this.pickedItem_selectOption = item.element_data.options;
          this.selected_feld_state = item.element_data.if_state;
          var UsecaseFilterElement = this.model.attributes.filter(ele => ele.element_uuid == item.element_data.if_condition);
          if (UsecaseFilterElement.length > 0) {
            this.selectedItem_element_type = UsecaseFilterElement[0].element_type;
            // this.selectOptions = UsecaseFilterElement[0].element_data.options;         
            let elementTypeName = UsecaseFilterElement[0].element_data;

            if (elementTypeName.hasOwnProperty('options')) {
              if (Array.isArray(elementTypeName.options)) {
                this.selectOptions = UsecaseFilterElement[0].element_data.options.filter(ele => ele.is_removed == false)
              }
            }
          }
        }
        if(item.element_data.hasOwnProperty('group_color_details') == true){
          let color_details = item.element_data.group_color_details;
          if(color_details != undefined){
            let completed = color_details.completed;
            let error = color_details.error;
            let inprogress = color_details.inprogress;
            let not_started = color_details.not_started;
            for (var i = 0; i < this.fillColor.length; i++) {
              if (this.fillColor[i] == not_started) {
                this.selectionNSvalue = this.fillColor[i];
              }
              if (this.fillColor[i] == inprogress) {
                this.selectionIPvalue = this.fillColor[i];
              }
              if (this.fillColor[i] == error) {
                this.selectionErrvalue = this.fillColor[i];
              }
              if (this.fillColor[i] == completed) {
                this.selectionCompvalue = this.fillColor[i];
              }
            }
          }
        }
        if(item.element_id == 14){
          let defaultCheck = item.element_data.options.findIndex(id => id.default == true);
          if(defaultCheck != -1){
             this.applySwitchcase(defaultCheck);
          } 
        }
        this.closeBox1 = true;
        console.log(item);

        let check_condition = ["false", false, 0, "0"];

        let condition_one = this.model.attributes.filter(ele =>
          ele.element_data.label_text != item.element_data.label_text);

        condition_one = condition_one.filter(data => check_condition.includes(data.is_hidden) && check_condition.includes(data.is_removed) && data.element_type != "empty_cell");

        let condition_two = this.extend_model.attributes.filter(ele =>
          ele.element_data.label_text != item.element_data.label_text);

        condition_two = condition_two.filter(data => check_condition.includes(data.is_hidden) && check_condition.includes(data.is_removed) && data.element_type != "empty_cell"
        && data.element_type != "uti-entry-field-WMATA_WELD");

        this.useconditionlist = [...condition_one, ...condition_two];
        console.log(this.useconditionlist)

        console.log(this.useconditionlist)
        item.toggle = false;
        this.setBorder = true;
        this.itemValuesModelAtr = item;
        if (item.element_type == "checkbox") {
          item.element_data.label_text = item.element_data.options[0].name;
          item.element_data.element_name_alias = item.element_data.options[0].name;
          let clonecondition_one = _.cloneDeep(this.useconditionlist);
          let checkBoxFields = clonecondition_one.filter(data => data.element_type == "checkbox" && data.element_data.hasOwnProperty("grouping_enable"));
          if(checkBoxFields.length > 0){
             let groupEnableCheck = checkBoxFields.filter(data => data.element_data.grouping_enable == true);
             this.groupAnnAlreadyEnabled = groupEnableCheck.length > 0 ? true : false;
          }
          else{
            this.groupAnnAlreadyEnabled = false;
          }
        }
        this.labelText = item.element_data.label_text;
        this.placeholderText = item.element_data.placeholder_text;
        this.labelText1 = "";
        this.placeholderText1 = "";
        this.editIndex = k;
        this.useConditionIntialCheck = false;
        this.addPositiveValues = false;
        this.activeGreen = -1;
        this.iconsPart = [];
        this.fillColorPart = [];
        this.strokeColorPart = [];
        this.opacity = [];
        this.lineWidth = [];
        if (this.itemValuesModelAtr.element_data.options != undefined) {
          for (
            var i = 0;
            i < this.itemValuesModelAtr.element_data.options.length;
            i++
          ) {
            this.iconsPart.push(
              this.itemValuesModelAtr.element_data.options[i].icon
            );
            this.fillColorPart.push(
              this.itemValuesModelAtr.element_data.options[i].fill_color
            );
            this.strokeColorPart.push(
              this.itemValuesModelAtr.element_data.options[i].stroke_color
            );
            this.opacity.push(
              this.itemValuesModelAtr.element_data.options[i].opacity
            );
            this.lineWidth.push(
              this.itemValuesModelAtr.element_data.options[i].line_width
            );
          }
        }

        if (item.toggle == false) {
          this.closeBox1 = true;
        }
        this.toggle = false;
        this.model.attributes.forEach((it) => {
          it != item ? (it.toggle = false) : (it.toggle = !item.toggle);
        });
        if (
          item.element_data.default_value == "" || item.element_data.default_value == "0" || item.element_data.default_value == "1" ||
          item.element_data.default_value == null
        ) {
          this.defaultDecimal = "";
          // item.element_data.calculation = Math.abs(item.element_data.calculation);
        } else {
          this.defaultDecimal = item.element_data.default_value;
          // item.element_data.calculation = Math.abs(item.element_data.calculation);
        }
        this.sendElement = this.model.attributes.map((val, index) => {
          // val.element_data.element_order = index;
          val.element_order = index;
          return val;
        });
        if(item.element_type == 'group_field' && item.element_data.hasOwnProperty('group_color_details') && item.element_data.group_color_details.hasOwnProperty('line_width')){
           this.linewidthvaluegrouping = Number(item.element_data.group_color_details.line_width)
        }
        if (item.element_type == 'Divider' && item.element_data.line_width != undefined) {
          let numberChange: any = Number(item.element_data.line_width);
          numberChange = numberChange.toFixed(2);
          this.linewidthvaluedivider = numberChange.toString();
        }
        else if (item.element_type == 'Divider' && item.element_data.line_width == undefined) {
          this.linewidthvaluedivider = "1.00";
        }
        if (item.element_type == 'Divider' && item.element_data.opacity != undefined) {
          let opacityChange: any = Number(item.element_data.opacity);
          opacityChange = opacityChange.toFixed(2);
          this.opacitydividervalue = opacityChange.toString();
        }
        else if (item.element_type == 'Divider' && item.element_data.opacity == undefined) {
          this.opacitydividervalue = "1.00";
        }
      }
    }

  }

  //click second columns
  extend_showProperties(item, k) {
    this.settings2 = true;
    if (item.element_type != 'empty_cell') {
      this.closeBox1 = false;
      console.log(this.exitconfirm)
      this.updatelastmodified(item)
      this.selectedField = item;
      if (item.element_type == 'uti-entry-field' || item.element_type == 'uti-entry-field-WMATA_WELD' || item.element_uuid.includes('errorCheckbox')) {
        //nothing will happend no need to open setting page
      } else {
        if (item.element_type == "date") {
          if (item.element_data.default_date_time == "current") {
            this.DateDefault = false;
          }
          else {
            this.DateDefault = true;
          }
        }
        this.toggle1 = false;
        if (item.element_data.use_conditions == true) {
          console.log(this.model.attributes)
          this.pickedItem_element_type = item.element_type;
          this.pickedItem_selectOption = item.element_data.options;
          this.selected_feld_state = item.element_data.if_state;
          var UsecaseFilterElement = this.model.attributes.filter(ele => ele.element_uuid == item.element_data.if_condition);
          if (UsecaseFilterElement.length > 0) {
            this.selectedItem_element_type = UsecaseFilterElement[0].element_type;
            // this.selectOptions = UsecaseFilterElement[0].element_data.options;         
            let elementTypeName = UsecaseFilterElement[0].element_data;

            if (elementTypeName.hasOwnProperty('options')) {
              if (Array.isArray(elementTypeName.options)) {
                this.selectOptions = UsecaseFilterElement[0].element_data.options.filter(ele => ele.is_removed == false)
              }
            }
          }
        }
        if(item.element_data.hasOwnProperty('group_color_details') == true){
          let color_details = item.element_data.group_color_details;
          if(color_details != undefined){
            let completed = color_details.completed;
            let error = color_details.error;
            let inprogress = color_details.inprogress;
            let not_started = color_details.not_started;
            for (var i = 0; i < this.fillColor.length; i++) {
              if (this.fillColor[i] == not_started) {
                this.selectionNSvalue = this.fillColor[i];
              }
              if (this.fillColor[i] == inprogress) {
                this.selectionIPvalue = this.fillColor[i];
              }
              if (this.fillColor[i] == error) {
                this.selectionErrvalue = this.fillColor[i];
              }
              if (this.fillColor[i] == completed) {
                this.selectionCompvalue = this.fillColor[i];
              }
            }
          }
        }
        if(item.element_id == 14){
          let defaultCheck = item.element_data.options.findIndex(id => id.default == true);
          if(defaultCheck != -1){
             this.applySwitchcase(defaultCheck);
          } 
        }
        this.closeBox2 = true;
        console.log(item);

        let check_condition = ["false", false, 0, "0"];

        let condition_one = this.model.attributes.filter(ele =>
          ele.element_data.label_text != item.element_data.label_text);
        condition_one = condition_one.filter(data => check_condition.includes(data.is_hidden) && check_condition.includes(data.is_removed) && data.element_type != "empty_cell");

        let condition_two = this.extend_model.attributes.filter(ele =>
          ele.element_data.label_text != item.element_data.label_text);

        condition_two = condition_two.filter(data => check_condition.includes(data.is_hidden) && check_condition.includes(data.is_removed) && data.element_type != "empty_cell"
        && data.element_type != "uti-entry-field-WMATA_WELD");
        this.useconditionlist = [...condition_one, ...condition_two];
        console.log(this.useconditionlist)

        item.toggle = false;
        this.setBorder = true;
        this.itemValuesModelAtr = item;
        if (item.element_type == "checkbox") {
          item.element_data.label_text = item.element_data.options[0].name;
          item.element_data.element_name_alias = item.element_data.options[0].name;
          let clonecondition_one = _.cloneDeep(this.useconditionlist);
          let checkBoxFields = clonecondition_one.filter(data => data.element_type == "checkbox" && data.element_data.hasOwnProperty("grouping_enable"));
          if(checkBoxFields.length > 0){
             let groupEnableCheck = checkBoxFields.filter(data => data.element_data.grouping_enable == true);
             this.groupAnnAlreadyEnabled = groupEnableCheck.length > 0 ? true : false;
          }
          else{
            this.groupAnnAlreadyEnabled = false;
          }
        }
        this.labelText = item.element_data.label_text;
        this.placeholderText = item.element_data.placeholder_text;
        this.labelText1 = "";
        this.placeholderText1 = "";
        this.editIndex = k;
        this.useConditionIntialCheck = false;
        this.addPositiveValues = false;
        this.activeGreen = -1;
        this.iconsPart = [];
        this.fillColorPart = [];
        this.strokeColorPart = [];
        this.opacity = [];
        this.lineWidth = [];
        if (this.itemValuesModelAtr.element_data.options != undefined) {
          for (
            var i = 0;
            i < this.itemValuesModelAtr.element_data.options.length;
            i++
          ) {
            this.iconsPart.push(
              this.itemValuesModelAtr.element_data.options[i].icon
            );
            this.fillColorPart.push(
              this.itemValuesModelAtr.element_data.options[i].fill_color
            );
            this.strokeColorPart.push(
              this.itemValuesModelAtr.element_data.options[i].stroke_color
            );
            this.opacity.push(
              this.itemValuesModelAtr.element_data.options[i].opacity
            );
            this.lineWidth.push(
              this.itemValuesModelAtr.element_data.options[i].line_width
            );
          }
        }

        if (item.toggle == false) {
          this.closeBox2 = true;
        }
        this.toggle = false;
        this.extend_model.attributes.forEach((it) => {
          it != item ? (it.toggle = false) : (it.toggle = !item.toggle);
        });
        if (
          item.element_data.default_value == "" || item.element_data.default_value == "0" || item.element_data.default_value == "1" ||
          item.element_data.default_value == null
        ) {
          this.defaultDecimal = "";
          // item.element_data.calculation = Math.abs(item.element_data.calculation);
        } else {
          this.defaultDecimal = item.element_data.default_value;
          // item.element_data.calculation = Math.abs(item.element_data.calculation);
        }
        this.sendElement = this.model.attributes.map((val, index) => {
          // val.element_data.element_order = index;
          val.element_order = index;
          return val;
        });
      }
      if(item.element_type == 'group_field' && item.element_data.hasOwnProperty('group_color_details') && item.element_data.group_color_details.hasOwnProperty('line_width')){
        this.linewidthvaluegrouping = Number(item.element_data.group_color_details.line_width)
     }
      if (item.element_type == 'Divider' && item.element_data.line_width != undefined) {
        let numberChange: any = Number(item.element_data.line_width);
        numberChange = numberChange.toFixed(2);
        this.linewidthvaluedivider = numberChange.toString();
      }
      else if (item.element_type == 'Divider' && item.element_data.line_width == undefined) {
        this.linewidthvaluedivider = "1.00";
      }
      if (item.element_type == 'Divider' && item.element_data.opacity != undefined) {
        let opacityChange: any = Number(item.element_data.opacity);
        opacityChange = opacityChange.toFixed(2);
        this.opacitydividervalue = opacityChange.toString();
      }
      else if (item.element_type == 'Divider' && item.element_data.opacity == undefined) {
        this.opacitydividervalue = "1.00";
      }
    }
  }
  dateOnly(value) {
    this.addPositiveValues = false;
  }

  showOptions: any = "";
  opacityValue: number = 0;
  selectionStrokeValue: number = 0;
  selectionFillValue: number = 0;
  selectionNSvalue: number = 0;
  selectionIPvalue: number = 0;
  selectionCompvalue: number = 0;
  selectionErrvalue: number = 0;
  selectionIconValue: number = 0;
  notStartedDefault:boolean = false;
  inProgressDefault:boolean = false;
  completedDefault:boolean = false;
  errorDefault:boolean = false;

  addOption(item, optionValue, option_uuid) {
    //attributes
    this.showOptions = this.itemValuesModelAtr.element_data.options[optionValue];
    //this.showOptions = 
    console.log(item + optionValue + "============" + option_uuid)
    console.log(this.showOptions)
    item.element_data.options[optionValue].attributes = true;
    this.selectionFillValue = 0;
    this.selectionStrokeValue = 0;
    this.selectionIconValue = 0;
    this.activeGreen = optionValue;
    this.addPositiveValues = true;


    if (this.showOptions.opacity != "") {
      this.showOptions.opacity = Number(this.showOptions.opacity).toFixed(2)
      this.showOptions.opacity.toString()
    }
    if (this.showOptions.line_width != "") {
      this.showOptions.line_width = Number(this.showOptions.line_width).toFixed(1)
      this.showOptions.line_width.toString()
    }
    let opacityValue = this.itemValuesModelAtr.element_data.options[optionValue].opacity;
    // this.getOpacityValue(opacityValue);
    this.lineWidthValue = this.itemValuesModelAtr.element_data.options[optionValue].line_width;
    this.lineWidthbox = this.itemValuesModelAtr.element_data.options[optionValue].line_width;
    this.OptionName = this.showOptions.name
    // var IconShape = this.itemValuesModelAtr.element_data.options[optionValue].icon
    // var fillC = this.itemValuesModelAtr.element_data.options[optionValue].fill_color;
    // var strokeC = this.itemValuesModelAtr.element_data.options[optionValue].stroke_color;

    var IconShape = this.showOptions.icon
    var fillC = this.showOptions.fill_color;
    var fillC1 = this.showOptions.fill_color;
    var strokeC = this.showOptions.stroke_color;
    for (var i = 0; i < this.fillColor.length; i++) {
      if (this.fillColor[i] == fillC) {
        this.selectionFillValue = i;
      }
      if (this.strokeColor[i] == strokeC) {
        this.selectionStrokeValue = i;
      }
    }
    this.selectionFillValue = fillC1;
    this.selectionStrokeValue = strokeC;


    for (var j = 0; j < this.iconShape.length; j++) {
      if (this.iconShape[j].Shape == IconShape) {
        this.selectionIconValue = j;
      }
    }
    this.selectionIconValue = IconShape;

  }

  //add valuse for dropdoem etc
  addValue(options) {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var annontationidDate = new Date().getTime();
    var uuid_element = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    var lengthFind = options.length + 1;
    this.Options = {
      attributes: false,
      calculated_value: "",
      default: false,
      element_uuid: uuid_element,
      fill_color: "",
      icon: "",
      is_removed: false,
      line_width: 0,
      name: "Option " + lengthFind,
      number_of_columns: "2",
      opacity: 1,
      stroke_color: "",
    };
    options.push(this.Options);
    this.alignmenprocess();
  }
  //copy field ffrom setttings
  copyField(item) {
    let _item = this.simpleClone(item);
    _item.toggle = false;
    this.modelFields.push(_item);
  }
  //remove popup
  removeField() {
    console.log(this.selectedField)
    if(this.selectedField.element_data.hasOwnProperty("grouping_enable") && this.selectedField.element_data.grouping_enable == true){
       return
    }
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogref = this.dialog.open(DeleteformComponent, {
      panelClass: "my-class",
    });

    dialogref.afterClosed().subscribe((res) => {
      if (res.data == true) {
        this.exitconfirm = false;
        this.closeBox1 = false;
        this.closeBox2 = false;
        this.selectedField.is_removed = true;
        if(this.selectedField.element_type == 'group_field'){
           this.groupingFieldPresent = false;
        }
        this.deletedlist = this.model.attributes.filter(ele =>
          ele.is_removed == true
        )

        if (this.is_extend == true) {
          let temp_extend_holder = this.extend_model.attributes.filter(ele => ele["element_data"].reference_id == this.selectedField.element_uuid);
          let index = this.extend_model.attributes.indexOf(temp_extend_holder[0]);

          if (temp_extend_holder[0].element_type == "empty_cell") {
            this.extend_model.attributes.splice(index, 1)
          } else {
            let clone_model = _.cloneDeep(this.empty_cell);
            clone_model.element_uuid = this.selectedField.element_uuid;
            clone_model["element_data"].reference_id = this.selectedField["element_data"].reference_id;
            this.model.attributes.splice(index, 0, clone_model);
          }
          this.alignmenprocess();
        }
      }
      if (this.model.attributes.length == this.deletedlist.length) {
        if (this.model.attributes.length == 0) {
          this.Builder = true;
        }
      }
    });
  }

  extend_removeField() {
    console.log(this.selectedField)
    if(this.selectedField.element_data.hasOwnProperty("grouping_enable") && this.selectedField.element_data.grouping_enable == true){
       return
    }
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogref = this.dialog.open(DeleteformComponent, {
      panelClass: "my-class",
    });

    dialogref.afterClosed().subscribe((res) => {
      if (res.data == true) {
        this.exitconfirm = false;
        this.closeBox1 = false;
        this.closeBox2 = false;
        this.selectedField.is_removed = true;
        this.deletedlist = this.extend_model.attributes.filter(ele =>
          ele.is_removed == true
        )

        let temp_extend_holder = this.model.attributes.filter(ele => ele["element_data"].reference_id == this.selectedField.element_uuid);
        let index = this.model.attributes.indexOf(temp_extend_holder[0]);

        if (temp_extend_holder[0].element_type == "empty_cell") {
          this.model.attributes.splice(index, 1)
        } else {
          let clone_model = _.cloneDeep(this.empty_cell);
          clone_model.element_uuid = this.selectedField.element_uuid;
          clone_model["element_data"].reference_id = this.selectedField["element_data"].reference_id;
          this.extend_model.attributes.splice(index, 0, clone_model);
        }

        this.alignmenprocess();
      }
      // if(this.extend_model.attributes.length==this.deletedlist.length)
      // {
      //   this.extend_model.attributes.length= 0; 
      //   this.Builder=true;

      // }
    });
  }

  dirtyClone(item) {
    let item1 = JSON.stringify(item);
    let item2 = JSON.parse(item1);
    return item2;
  }
  copy() {
    if(this.selectedField.element_type == 'group_field'){
        return
    }
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let cloneitem = this.simpleClone(this.selectedField);
    let ditem = this.dirtyClone(this.selectedField);
    let dialogref = this.dialog.open(DuplicateelementComponent, {
      panelClass: "my-class",
      data: ditem,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res != undefined) {
        let copyname;
        let _item = res.data;
        copyname = _item.element_data.label_text;
        _item.toggle = false;
        this.exitconfirm = false;
        this.duplicateNaming(copyname, _item, 'copy');
        this.model.attributes.push(_item);

        this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
        var annontationidDate = new Date().getTime();

        let clone_model = _.cloneDeep(this.empty_cell);
        clone_model["element_data"].reference_id = _item.element_uuid;
        clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
        _item["element_data"].reference_id = clone_model.element_uuid;
        this.extend_model.attributes.push(clone_model);

      }
      this.alignmenprocess();
    });
  }

  extend_copy() {
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let cloneitem = this.simpleClone(this.selectedField);
    let ditem = this.dirtyClone(this.selectedField);
    let dialogref = this.dialog.open(DuplicateelementComponent, {
      panelClass: "my-class",
      data: ditem,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res != undefined) {
        let copyname;
        let _item = res.data;
        copyname = _item.element_data.label_text;
        _item.toggle = false;
        this.exitconfirm = false;
        this.duplicateNaming(copyname, _item, 'copy');
        this.extend_model.attributes.push(_item);

        this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
        var annontationidDate = new Date().getTime();

        let clone_model = _.cloneDeep(this.empty_cell);
        clone_model["element_data"].reference_id = _item.element_uuid;
        clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
        _item["element_data"].reference_id = clone_model.element_uuid;
        this.model.attributes.push(clone_model);
      }
      this.alignmenprocess();
    });
  }
  DateDefault: boolean = true;
  hideDefault(item) {
    this.exitconfirm = false;
    item.default_date_time = "current";
    this.DateDefault = false;
    this.updatelastmodified(item)
  }
  dateNone(item) {
    this.exitconfirm = false;
    item.default_date_time = "none";
    this.DateDefault = true;
    this.updatelastmodified(item)
  }

  saveAndgoto() {
    this.overlay = false;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    this.dialog.open(FormdesignComponent, {
      disableClose: true,
      data: {
        dateopt: this.dateopt,
        model: this.model,
        is_extend: this.is_extend,
        extend_model: this.extend_model
      }
    });
    this.FDService.set(this.model);
  }
  totalValue: string = "";

  //Keyboard click
  keyboardClick(event) {
    var inputvalues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (inputvalues.includes(event.key)) {
      this.insertChar1(event.key)
    }
  }
  //adding the characters to the  calculation field
  insertChar1(key: any) {
    this.exitconfirm = false;
    if (key == "√") {
      this.disable_calculation_seperator = true;
    }
    else {
      this.disable_calculation_seperator = false;
    }
    var endPosition;
    var finalArray = [];
    //taking the current data available in the calculation field
    var myElement = (document.getElementById('text-element') as HTMLInputElement);
    // if (myElement.selectionStart == 0) {
    //   var startPosition = myElement.value.length;
    // } else {
    //taking cirsor position
    var startPosition = myElement.selectionStart;
    // }
    this.addFieldPart = this.false
    var CalculatioField = [];
    if (this.is_extend == true) {
      var combinedArr = [...this.model.attributes, ...this.extend_model.attributes];
      CalculatioField = combinedArr.filter(ele => ele.element_uuid == key);
    }
    else {
      //checking the current added fiels is a character or a number
      CalculatioField = this.model.attributes.filter(ele => ele.element_uuid == key);
    }
    this.numField = CalculatioField[0];
    //length is zero means its a charecter otherwaise its a fielsd
    if (CalculatioField.length > 0) {
      var fieldNameForcursor = "[" + CalculatioField[0].element_data.label_text + "]";
      key = "[" + this.numField.element_uuid + "]";
    }
    let modifiyItem;
    if (this.settings2 == true) {
      modifiyItem = this.extend_model.attributes[this.editIndex];
    }
    else {
      modifiyItem = this.model.attributes[this.editIndex];
    }
    var backend = myElement.value;
    var frontend = modifiyItem.element_data.calculation_value;
    var firstPart = myElement.value.slice(0, startPosition)
    var secondPart = myElement.value.slice(startPosition)
    //slice the last value for getting that is a number or a mathematical operation
    var key1 = firstPart.slice(-1);
    let isnum = /^\d+$/.test(key1);
    //var lastIndex = firstPart.lastIndexOf("[")
    var displayValue;
    //if it is a mathe mathical operation and its having vsome defult bvalue mean valus need to bimg butr calculation will not happend
    if (key1 == "" || key1 == "+" || key1 == "-" || key1 == "*" || key1 == "%" || key1 == "/" || key1 == "(" || key1 == ")" || key1 == "]" || (key1 != "[" && isnum == true)) {

      if (CalculatioField.length > 0) {
        endPosition = myElement.selectionStart + fieldNameForcursor.length;
        displayValue = firstPart + fieldNameForcursor + secondPart;
      } else {
        endPosition = myElement.selectionStart + key.length;
        displayValue = firstPart + key + secondPart;
      }
    } else {
      var indexValue = secondPart.indexOf("]");
      indexValue = firstPart.length + indexValue + 1
      var firstSec = myElement.value.substring(0, indexValue);
      var secodSec = myElement.value.substring(indexValue);
      endPosition = indexValue + key.length;
      displayValue = firstSec + key + secodSec;
    }


    var keyValue = displayValue
    var finalJson = keyValue;
    var secArr = [];
    var pattern = /\[(.*?)\]/g;
    var match2;
    while ((match2 = pattern.exec(finalJson)) != null) {
      secArr.push(match2[1]);
    }
    if (this.is_extend == true) {
      var combinedArr = [...this.model.attributes, ...this.extend_model.attributes];
      secArr.forEach(element => {
        var secondSec = combinedArr.filter(ele => ele.element_data.label_text == element);
        if (secondSec.length > 0) {
          finalJson = finalJson.replace("[" + element + "]", "[" + secondSec[0].element_uuid + "]")
        }
      })
    }
    else {
      secArr.forEach(element => {
        var secondSec = this.model.attributes.filter(ele => ele.element_data.label_text == element);
        if (secondSec.length > 0) {
          finalJson = finalJson.replace("[" + element + "]", "[" + secondSec[0].element_uuid + "]")
        }
      })
    }


    modifiyItem.element_data.calculation_value = finalJson;
    modifiyItem.element_data.calculation_display_value = displayValue
    setTimeout(() => {
      myElement.focus();
      myElement.setSelectionRange(endPosition, endPosition);
    }, 0);
    if (this.is_extend == true) {
      let dummy_model = [];
      let attribute_model = [];
      for (let i = 0; i < this.extend_model.attributes.length; i++) {
        let filter_element = combinedArr.filter(data => data.element_uuid == this.extend_model.attributes[i].element_uuid);
        if (filter_element != null) {
          dummy_model.push(filter_element[0]);
        }
      }
      this.extend_model.attributes = _.cloneDeep(dummy_model);

      for (let i = 0; i < this.model.attributes.length; i++) {
        let filter_element = combinedArr.filter(data => data.element_uuid == this.model.attributes[i].element_uuid);
        if (filter_element != null) {
          attribute_model.push(filter_element[0]);
        }
      }
      this.model.attributes = _.cloneDeep(attribute_model);
    }
    this.calculation(modifiyItem);
  }

  //calculating current formula field
  calculation(modifiyItem) {
    var combinedArr = [];
    if (this.is_extend == true) {
      combinedArr = [...this.model.attributes, ...this.extend_model.attributes];
    }
    else {
      combinedArr = this.model.attributes;
    }
    modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_value
    //modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_value
    if (modifiyItem.element_data.calculation_value != "" && modifiyItem.element_data.calculation_value != undefined) {
      if (modifiyItem.element_data.calculation_value.includes('[')) {
        var wers = modifiyItem.element_data.calculation_value;
        var matches = [];
        var pattern = /\[(.*?)\]/g;
        var match;
        while ((match = pattern.exec(wers)) != null) {
          matches.push(match[1]);
        }
        console.log(matches)
        matches.forEach(element => {
          var CalculatioField = combinedArr.filter(ele => ele.element_uuid == element);
          this.FieldResult = CalculatioField[0];
          if (CalculatioField[0].element_type == "single_choice" || CalculatioField[0].element_type == "dropdown") {
            var CalculatioField1 = CalculatioField[0].element_data.options.filter(ele => ele.default == true);
            if (CalculatioField1.length > 0) {
              if (CalculatioField1[0].calculated_value != "") {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", CalculatioField1[0].calculated_value)
              }
              else {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
              }
            }
            else {
              modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
            }
          } else if (CalculatioField[0].element_type == "multiple_choice" || CalculatioField[0].element_type == "checkbox") {
            var calculatedalltotal = 0;
            var CalculatioField1 = CalculatioField[0].element_data.options.filter(ele => ele.default == true);
            if (CalculatioField1.length > 0) {
              CalculatioField1.forEach(ele => {
                if (ele.calculated_value != "") {
                  calculatedalltotal = calculatedalltotal + Number(ele.calculated_value)
                }

              });
              if (calculatedalltotal != 0)
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", calculatedalltotal)
              else
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
            } else {
              modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
            }
          } else if (CalculatioField[0].element_type == "calculation") {

            if (CalculatioField[0].element_data.calculation != "" && CalculatioField[0].element_data.calculation != undefined) {
              if (CalculatioField[0].element_data.calculation.includes('[')) {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
              } else {
                //modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", CalculatioField[0].element_data.calculation)
              }
            }
            else {
              modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
            }
          }
          else {
            if (CalculatioField[0].element_data.default_value != "") {
              modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", CalculatioField[0].element_data.default_value)
            }
            else {
              modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", "[" + CalculatioField[0].element_data.label_text + "]")
            }
          }
        });
        if (modifiyItem.element_data.calculation.includes('[')) {
          modifiyItem.element_data.calculation = modifiyItem.element_data.calculation;
        } else {
          // modifiyItem.element_data.calculation = eval(
          //   modifiyItem.element_data.calculation
          // );
          let confirmedValue = modifiyItem.element_data.calculation;
          console.log(Math.abs(confirmedValue));
          let decimalCheck = Math.abs(confirmedValue);
          modifiyItem.element_data.calculation = Math.abs(confirmedValue);
          // if (decimalCheck % 1 == 0) {
          modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.toFixed(
            Number(modifiyItem.element_data.default_value)
          );
          // }
        }
      }
      else {

        modifiyItem.element_data.calculation = eval(modifiyItem.element_data.calculation);
        console.log(modifiyItem.element_data.default_value)
        modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.toFixed(Number(modifiyItem.element_data.default_value));
        //let confirmedValue = (modifiyItem.element_data.calculation.toFixed(Number(this.defaultDecimal)));
        // console.log((confirmedValue));
        // let decimalCheck = (confirmedValue);
        // modifiyItem.element_data.calculation = (confirmedValue);
        // // if (decimalCheck % 1 == 0) {
        // modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.toFixed(Number(modifiyItem.element_data.default_value));
      }
    }
    // if(this.is_extend==true)
    // {
    //   let dummy_model = [];
    // 		let attribute_model = [];
    // 		for(let i = 0; i < this.extend_model.attributes.length ; i++){
    // 			let filter_element = combinedArr.filter(data=> data.element_uuid == this.extend_model.attributes[i].element_uuid);
    // 			if(filter_element != null){
    // 			dummy_model.push(filter_element[0]);
    // 			}
    // 		}
    // 		this.extend_model.attributes = _.cloneDeep(dummy_model);

    // 		for(let i = 0; i < this.model.attributes.length ; i++){
    // 			let filter_element = combinedArr.filter(data=> data.element_uuid == this.model.attributes[i].element_uuid);
    // 			if(filter_element != null){
    // 				attribute_model.push(filter_element[0]);
    // 			}
    // 		}
    // 		this.model.attributes = _.cloneDeep(attribute_model);
    // }
  }
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  replaceAll(str, term, replacement) {
    return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
  }
  //function for keypad charctetr
  insertCharKeyPad(key: any, event) {
    let modifiyItem1 = this.model.attributes[this.editIndex];
    var wers = modifiyItem1.element_data.calculation_value;
    var matches = [];
    var pattern = /\.*?\]/g;
    var match;
    while ((match = pattern.exec(wers)) != null) {
      matches.push(match);
    }
    console.log(matches)
    if (
      [
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        187,
        189,
        190,
        191,
        8,
        46,
        37,
        39,
        16,
      ].includes(event.keyCode)
    ) {
      this.model.attributes;
      console.log(this.model.attributes);
      let modifiyItem = this.model.attributes[this.editIndex];
      console.log(modifiyItem);
      modifiyItem.element_data.calculation_value = undefined;
      modifiyItem.element_data.calculation_value =
        modifiyItem.element_data.calculation_value == undefined
          ? key
          : modifiyItem.element_data.calculation_value + key;

      // var a = this.model.attributes.slice(this.editIndex, 1, modifiyItem);
      modifiyItem.element_data.calculation = "";
      if (
        modifiyItem.element_data.calculation == "" ||
        modifiyItem.element_data.calculation == undefined
      ) {
        modifiyItem.element_data.calculation = key;
      } else {
        modifiyItem.element_data.calculation =
          modifiyItem.element_data.calculation + key;
      }
      var accept = modifiyItem.element_data.calculation_value.slice(-1);
      console.log(accept);
      if (
        accept != "+" &&
        accept != "-" &&
        accept != "*" &&
        accept != "%" &&
        accept != "/"
      ) {
        if (modifiyItem.element_data.calculation.includes('[')) {
          var wers = modifiyItem.element_data.calculation_value;
          var matches = [];
          var pattern = /\[(.*?)\]/g;
          var match;
          while ((match = pattern.exec(wers)) != null) {
            matches.push(match[1]);
          }
          console.log(matches)
          matches.forEach(element => {
            var CalculatioField = this.model.attributes.filter(ele => ele.element_data.label_text == element);
            if (CalculatioField[0].element_type == "single_choice" || CalculatioField[0].element_type == "dropdown") {
              var CalculatioField1 = CalculatioField[0].element_data.options.filter(ele => ele.default == true);
              if (CalculatioField1[0].calculated_value != "") {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", CalculatioField1[0].calculated_value)
              } else {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", 0)
              }
            } else if (CalculatioField[0].element_type == "multiple_choice") {
              var calculatedalltotal = 0;
              var CalculatioField1 = CalculatioField[0].element_data.options.filter(ele => ele.default == true);
              CalculatioField1.forEach(ele => {
                if (ele.calculated_value != "") {
                  calculatedalltotal = calculatedalltotal + ele.calculated_value
                } else {
                  calculatedalltotal = 0
                }
              });
              modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", calculatedalltotal)
            }
            else {
              modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", CalculatioField[0].element_data.default_value)
              var erer = modifiyItem.element_data.calculation
            }
          });
          modifiyItem.element_data.calculation = eval(
            modifiyItem.element_data.calculation
          );
          let confirmedValue = modifiyItem.element_data.calculation;
          console.log(Math.abs(confirmedValue));
          let decimalCheck = Math.abs(confirmedValue);
          modifiyItem.element_data.calculation = Math.abs(confirmedValue);
          //if (decimalCheck % 1 == 0) {
          modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.toFixed(
            Number(modifiyItem.element_data.default_value)
          );
          // }
        }
        else {
          modifiyItem.element_data.calculation = eval(
            modifiyItem.element_data.calculation
          );
          if (this.defaultDecimal == "") {
            this.defaultDecimal = "1";
          }
          let confirmedValue = modifiyItem.element_data.calculation.toFixed(Number(this.defaultDecimal));
          console.log((confirmedValue));
          let decimalCheck = (confirmedValue);
          modifiyItem.element_data.calculation = (confirmedValue);
          // if (decimalCheck % 1 == 0) {
          modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.toFixed(
            Number(modifiyItem.element_data.default_value)
          );
          // }
        }
      }
      if (this.defaultDecimal == "") {
        this.defaultDecimal = "1";
      }
      modifiyItem.element_data.default_value = this.defaultDecimal;
      if (isNaN(modifiyItem.element_data.calculation) == true && modifiyItem.element_data.calculation_value == "") {
        modifiyItem.element_data.calculation = undefined
      }
    }
  }

  movekeyUp(event, j) {
    console.log(event.keyCode);
    if (
      ![
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        187,
        189,
        190,
        191,
        8,
        46,
        37,
        39,
        16,
      ].includes(event.keyCode)
    ) {
      event.preventDefault();
    }
  }

  //calculation decimal value changes
  changeDecimalValue(val, event, decimalelement) {

    // check max length 10 start
    const keyValue = +event.key;
    const numberOnlyPattern = '[0-9]+';
    const newValue = decimalelement.value + (isNaN(keyValue) ? '' : keyValue.toString());
    const match = newValue.match(numberOnlyPattern);
    console.log(val, +newValue);
    console.log(typeof val, typeof +newValue);
    if (+newValue > 10 || !match || newValue === '') {
      event.preventDefault();
    }
    else {
      let modifiyItem = this.model.attributes[this.editIndex];
      if (newValue == "") {
        modifiyItem.element_data.default_value = "0";
      }
      else {
        modifiyItem.element_data.default_value = newValue;
      }
      this.calculation(modifiyItem);
    }
    // check max length 10 end

  }

  //decimal field is empty need to set to 1
  emptyDrop() {
    if (this.defaultDecimal == null) {
      this.defaultDecimal = "";
    }
  }
  checkOpacity() {
    let getlineElement = (<HTMLInputElement>document.getElementById("opacityId"));
    console.log(getlineElement.value);
    if (getlineElement.value != "") {
      var value = Number(getlineElement.value);
    }
    else if (getlineElement.value == "") {
      getlineElement.value = "";
    }
    console.log(value);
    if (value != null && getlineElement.value != "" && value != undefined) {
      if (value < 0) {
        console.log('0 below', value);
        this.opacityValue = 0.1;
        getlineElement.value = "0.1";
        this.showOptions.opacity = 0.1;

      }
      else if (value > 1) {
        console.log('1 above', value);
        this.opacityValue = 1;
        getlineElement.value = "1";
        this.showOptions.opacity = 1;

      }
      else if(Number.isNaN(value))
      {
        getlineElement.value = "";
        this.showOptions.opacity = "";
      }
      else {
        console.log('between', value);
        value = Number(value.toFixed(1));
        this.opacityValue = value;
        this.showOptions.opacity = value;

      }
    }
  }


  //use calculated value toogle button open
  getResult(event, item) {
    console.log(event.checked);
    this.updatelastmodified(item)
    item.element_data.use_calculated_values = event.checked;
  }

  //use calculated value toogle button open
  getIs_blank_opion(event, item) {
    console.log(event.checked);
    this.updatelastmodified(item);
    // ipad used string value for condition based method so we convert boolean value to string.
    item.element_data.is_blank_option = event.checked.toString();
    if (event.checked == true) {
      let get_options = item.element_data.options;
      if (get_options.length > 0) {
        this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
        var annontationidDate = new Date().getTime();
        var uuid_element = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
        var lengthFind = get_options.length + 1;
        this.Options = {
          attributes: false,
          calculated_value: "",
          default: false,
          element_uuid: uuid_element,
          fill_color: "",
          icon: "",
          is_blank_field: "true",
          is_removed: false,
          line_width: 0,
          name: " ",
          number_of_columns: "2",
          opacity: 1,
          stroke_color: "",
        };
        get_options.unshift(this.Options);
        this.alignmenprocess();
      }
    }
    else {
      let get_options = item.element_data.options;
      if (get_options.length > 0) {
        let find_empty_field = get_options.findIndex((emtpy_field) => emtpy_field.hasOwnProperty("is_blank_field"));
        if (find_empty_field > -1) {
          let get_emtpy_field = get_options[find_empty_field];
          let allow_condition = ["true", true, 1, "1"];
          if (get_emtpy_field.hasOwnProperty("attributes") && allow_condition.includes(get_emtpy_field.attributes)) {
            get_emtpy_field.is_removed = true;
            get_options[find_empty_field] = get_emtpy_field;
          }
          else {
            get_options.splice(find_empty_field, 1);
          }
        }
      }
    }
  }

  getblankoption(value) {
    let allow_condition = ["false", false, 0, "0"];
    if (allow_condition.includes(value.element_data.is_blank_option)) {
      return false;
    }
    else {
      return true;
    }

  }


  numField: any;

  //back button press from viortual key board
  buttonClear() {
    var combinedArr = [];
    if (this.is_extend == true) {
      combinedArr = [...this.model.attributes, ...this.extend_model.attributes];
    }
    else {
      combinedArr = this.model.attributes;
    }
    //taking current value in form builder calculation field
    var myElement = (document.getElementById('text-element') as HTMLInputElement);
    if (myElement.selectionStart == 0) {
      var startPosition = myElement.value.length;
    } else {
      var startPosition = myElement.selectionStart;
    }
    let modifiyItem;
    if (this.settings2 == true) {
      modifiyItem = this.extend_model.attributes[this.editIndex];
    }
    else {
      modifiyItem = this.model.attributes[this.editIndex];
    }
    //taking current form field
    var endPosition;
    //checkin any  form fields are available in the  calculaion
    if (myElement.value.includes('[')) {
      var fialDisplay;
      var finalJson;
      var finalArray = [];
      var backend = myElement.value;
      var frontend = modifiyItem.element_data.calculation_value;
      var matches = [];
      var matches8 = [];
      var pattern = /\[(.*?)\]/g;
      var match;
      var match1;
      //taking uuids from correspondig data
      while ((match = pattern.exec(backend)) != null) {
        matches.push(match[1]);
      }
      //taking Fields label tect from correspondig data
      while ((match1 = pattern.exec(frontend)) != null) {
        matches8.push(match1[1]);
      }
      //pushing local array with uuid and fiels name
      for (var i = 0; i < matches.length; i++) {
        finalArray.push({ 'key': matches[i], 'value': matches8[i] });
      }
      console.log(matches)
      //spliting the data from current cursor position
      //splitting up to two different parts
      var firstPart = myElement.value.slice(0, startPosition)
      var secondPart = myElement.value.slice(startPosition)
      var key1 = firstPart.slice(-1);
      //checking firt part last value is a ]
      if (key1 == "]") {
        //taaking last index of the  first part [
        var lastIndex = firstPart.lastIndexOf("[")
        endPosition = lastIndex + 1;
        //splitting up to [ from first par and compaining with the second part
        //getting the final display calculation
        fialDisplay = firstPart.substring(0, lastIndex) + secondPart;
        finalJson = fialDisplay;
        var secArr = [];
        var pattern = /\[(.*?)\]/g;
        var match2;
        //splitting with the squre bracket patten for re making the uuid , and creating array with that
        while ((match2 = pattern.exec(finalJson)) != null) {
          secArr.push(match2[1]);
        }
        //itreting with array and replacing with uuid for pay load
        secArr.forEach(element => {
          var secondSec = finalArray.filter(ele => ele.key == element);
          finalJson = finalJson.replace("[" + element + "]", "[" + secondSec[0].value + "]")
        })
        //assigning to payload
        modifiyItem.element_data.calculation_value = finalJson;
        setTimeout(() => {
          myElement.focus();
          myElement.setSelectionRange(endPosition, endPosition - 1);
        }, 0);
      }
      else {

        var er = key1
        //checking the values is a number in calcultion
        let isnum = /^\d+$/.test(key1);
        var lastIndex = firstPart.lastIndexOf("[")
        //checking the  last key of the first part is +,-,%,(,),*,[   
        if (key1 == "+" || key1 == "-" || key1 == "*" || key1 == "%" || key1 == "/" || key1 == "(" || key1 == ")" || (key1 != "[" && isnum == true)) {
          //taking the current end position and making the final display
          //checking the deleted one is an form fields or not
          var firstIndexOfSecond = secondPart.indexOf("]")
          var secondIndexOfSecond = secondPart.indexOf("[")
          if (secondIndexOfSecond == -1 && firstIndexOfSecond > 0) {
            var firstIndex = secondPart.indexOf("]")
            endPosition = lastIndex + 1;
            fialDisplay = firstPart.substring(0, lastIndex) + secondPart.substring(firstIndex + 1);
          } else if (firstIndexOfSecond < secondIndexOfSecond) {
            var firstIndex = secondPart.indexOf("]")
            endPosition = lastIndex + 1;
            fialDisplay = firstPart.substring(0, lastIndex) + secondPart.substring(firstIndex + 1);
          } else {
            endPosition = myElement.selectionEnd;
            var slicedPosition = myElement.value.slice(0, startPosition - 1) + secondPart;
            fialDisplay = slicedPosition
          }

        } else {
          ////taking the current end position and making the final display if it is string
          var firstIndex = secondPart.indexOf("]")
          endPosition = lastIndex + 1;
          fialDisplay = firstPart.substring(0, lastIndex) + secondPart.substring(firstIndex + 1);
        }
        finalJson = fialDisplay;
        var secArr = [];
        var pattern = /\[(.*?)\]/g;
        var match2;
        //splitting with the squre bracket patten for re making the uuid , and creating array with that
        while ((match2 = pattern.exec(finalJson)) != null) {
          secArr.push(match2[1]);
        }
        secArr.forEach(element => {
          var secondSec = finalArray.filter(ele => ele.key == element);
          finalJson = finalJson.replace("[" + element + "]", "[" + secondSec[0].value + "]")
        })
        modifiyItem.element_data.calculation_value = finalJson;
        //setting the current cursor position
        setTimeout(() => {
          myElement.focus();
          myElement.setSelectionRange(endPosition, endPosition - 1);
        }, 0);
      }
      //calculation started for the final result
      var key = modifiyItem.element_data.calculation_value.slice(-1);
      //checking the final value is any mathematical operation  if that true  no need for calculation  
      // need to bind the data
      if (key == "+" || key == "-" || key == "*" || key == "%" || key == "/") {
        //final display assignig to calculation display value
        modifiyItem.element_data.calculation_display_value = fialDisplay
        // taking the calulation value
        modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_value
        if (modifiyItem.element_data.calculation.includes('[')) {
          var wers = modifiyItem.element_data.calculation_value;
          var matches = [];
          var pattern = /\[(.*?)\]/g;
          var match;
          //making array with uuid
          while ((match = pattern.exec(wers)) != null) {
            matches.push(match[1]);
          }
          console.log(matches)
          matches.forEach(element => {
            //if there any defult value need to bind the data
            var CalculatioField = this.model.attributes.filter(ele => ele.element_uuid == element);
            this.FieldResult = CalculatioField[0];
            if (CalculatioField[0].element_type == "single_choice" || CalculatioField[0].element_type == "dropdown") {
              var CalculatioField1 = CalculatioField[0].element_data.options.filter(ele => ele.default == true);
              if (CalculatioField1.length > 0) {
                if (CalculatioField1[0].calculated_value != "") {
                  modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", CalculatioField1[0].calculated_value)
                }
              } else {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
              }
            } else if (CalculatioField[0].element_type == "multiple_choice" || CalculatioField[0].element_type == "checkbox") {
              var calculatedalltotal = 0;
              var CalculatioField1 = CalculatioField[0].element_data.options.filter(ele => ele.default == true);
              if (CalculatioField1.length > 0) {
                CalculatioField1.forEach(ele => {
                  if (ele.calculated_value != "") {
                    calculatedalltotal = calculatedalltotal + ele.calculated_value
                  }
                });
                if (calculatedalltotal != 0)
                  modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", calculatedalltotal)
              } else {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
              }
            }
            else {
              if (CalculatioField[0].element_data.default_value != "") {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", CalculatioField[0].element_data.default_value)
              }
              else {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
              }
            }
          });
          var key2 = modifiyItem.element_data.calculation.slice(-1);
          if (key2 == "+" || key2 == "-" || key2 == "*" || key2 == "%" || key2 == "/" || modifiyItem.element_data.calculation.includes('[')) {
            modifiyItem.element_data.calculation = modifiyItem.element_data.calculation;
          } else {
            //calculating the final result with eval function
            modifiyItem.element_data.calculation = eval(
              modifiyItem.element_data.calculation
            );
            let confirmedValue = modifiyItem.element_data.calculation;
            console.log(Math.abs(confirmedValue));
            let decimalCheck = Math.abs(confirmedValue);
            modifiyItem.element_data.calculation = Math.abs(confirmedValue);

            // doing the decimal fixes
            modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.toFixed(
              Number(modifiyItem.element_data.default_value)
            );
            // }
          }

          setTimeout(() => {
            myElement.focus();
            myElement.setSelectionRange(endPosition, endPosition - 1);
          }, 0);
        }
        else {
          //if there is only numbers calculate directly
          var key2 = modifiyItem.element_data.calculation.slice(-1);
          if (key2 == "+" || key2 == "-" || key2 == "*" || key2 == "%" || key2 == "/" || modifiyItem.element_data.calculation.includes('[')) {
            modifiyItem.element_data.calculation = modifiyItem.element_data.calculation;
          } else {
            modifiyItem.element_data.calculation = eval(modifiyItem
            );
            let confirmedValue = modifiyItem.element_data.calculation;
            console.log(Math.abs(confirmedValue));
            let decimalCheck = Math.abs(confirmedValue);
            modifiyItem.element_data.calculation = Math.abs(confirmedValue);

            // if (decimalCheck % 1 == 0) {
            modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.toFixed(Number(modifiyItem.element_data.default_value));
            // }
          }
        }
        //Setting the current position
        setTimeout(() => {
          myElement.focus();
          myElement.setSelectionRange(endPosition, endPosition - 1);
        }, 0);
      } else {
        modifiyItem.element_data.calculation_display_value = fialDisplay
        modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_value
        if (modifiyItem.element_data.calculation.includes('[')) {
          var wers = modifiyItem.element_data.calculation_value;
          var matches = [];
          var pattern = /\[(.*?)\]/g;
          var match;
          while ((match = pattern.exec(wers)) != null) {
            matches.push(match[1]);
          }
          console.log(matches)
          matches.forEach(element => {
            var CalculatioField = combinedArr.filter(ele => ele.element_uuid == element);
            this.FieldResult = CalculatioField[0];
            if (CalculatioField[0].element_type == "single_choice" || CalculatioField[0].element_type == "dropdown") {
              var CalculatioField1 = CalculatioField[0].element_data.options.filter(ele => ele.default == true);
              if (CalculatioField1.length > 0) {
                if (CalculatioField1[0].calculated_value != "") {
                  modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", CalculatioField1[0].calculated_value)
                }
              } else {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
              }
            } else if (CalculatioField[0].element_type == "multiple_choice" || CalculatioField[0].element_type == "checkbox") {
              var calculatedalltotal = 0;
              var CalculatioField1 = CalculatioField[0].element_data.options.filter(ele => ele.default == true);
              if (CalculatioField1.length > 0) {
                CalculatioField1.forEach(ele => {
                  if (ele.calculated_value != "") {
                    calculatedalltotal = calculatedalltotal + ele.calculated_value
                  }
                });
                if (calculatedalltotal != 0)
                  modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", calculatedalltotal)
              } else {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
              }
            }
            else {
              if (CalculatioField[0].element_data.default_value != "") {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.replace("[" + element + "]", CalculatioField[0].element_data.default_value)
              }
              else {
                modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value
              }
            }
          });

          if (modifiyItem.element_data.calculation.includes('[')) {
            modifiyItem.element_data.calculation = modifiyItem.element_data.calculation;
          } else {

            setTimeout(() => {
              myElement.focus();
              myElement.setSelectionRange(endPosition, endPosition - 1);
            }, 0);
            modifiyItem.element_data.calculation = eval(
              modifiyItem.element_data.calculation
            );
            let confirmedValue = modifiyItem.element_data.calculation;
            console.log(Math.abs(confirmedValue));
            let decimalCheck = Math.abs(confirmedValue);
            modifiyItem.element_data.calculation = Math.abs(confirmedValue);

            // if (decimalCheck % 1 == 0) {
            modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.toFixed(
              Number(modifiyItem.element_data.default_value)
            );
            // }
          }
        }
      }
    }
    else {
      //there is no form fields are there in the current calculation section
      endPosition = myElement.selectionEnd;
      var slicedPosition = myElement.value.slice(0, startPosition - 1) + myElement.value.slice(startPosition);
      myElement.selectionEnd = endPosition
      modifiyItem.element_data.calculation_value = slicedPosition;
      var key = modifiyItem.element_data.calculation_value.slice(-1);
      if (key == "+" || key == "-" || key == "*" || key == "%" || key == "/") {
        var b = modifiyItem.element_data.calculation_value;
        b = b.slice(0, b.length - 1);
        modifiyItem.element_data.calculation_display_value = modifiyItem.element_data.calculation_value
        modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_value

        setTimeout(() => {
          myElement.focus();
          myElement.setSelectionRange(endPosition, endPosition - 1);
        }, 0);
      } else {
        if (modifiyItem.element_data.calculation_value.includes('[')) {
          modifiyItem.element_data.calculation = modifiyItem.element_data.calculation_display_value;
        } else {
          modifiyItem.element_data.calculation_display_value = modifiyItem.element_data.calculation_value
          modifiyItem.element_data.calculation = eval(
            modifiyItem.element_data.calculation_value
          );
          if (modifiyItem.element_data.calculation != "" && modifiyItem.element_data.calculation != undefined) {
            modifiyItem.element_data.calculation = modifiyItem.element_data.calculation.toFixed(
              Number(modifiyItem.element_data.default_value)
            );
          }
        }
        //setting the current server position
        setTimeout(() => {
          myElement.focus();
          myElement.setSelectionRange(endPosition, endPosition - 1);
        }, 0);
      }
    }
    if (this.is_extend == true) {
      let dummy_model = [];
      let attribute_model = [];
      for (let i = 0; i < this.extend_model.attributes.length; i++) {
        let filter_element = combinedArr.filter(data => data.element_uuid == this.extend_model.attributes[i].element_uuid);
        if (filter_element != null) {
          dummy_model.push(filter_element[0]);
        }
      }
      this.extend_model.attributes = _.cloneDeep(dummy_model);

      for (let i = 0; i < this.model.attributes.length; i++) {
        let filter_element = combinedArr.filter(data => data.element_uuid == this.model.attributes[i].element_uuid);
        if (filter_element != null) {
          attribute_model.push(filter_element[0]);
        }
      }
      this.model.attributes = _.cloneDeep(attribute_model);
    }
  }


  addFieldPart = false;
  //calculation add field button click
  openNumberField() {
    var currentUUID = this.selectedField.element_uuid
    this.calculationAddFieldValue1 = [];
    var combinedArr = [];
    if (this.is_extend == true) {
      combinedArr = [...this.model.attributes, ...this.extend_model.attributes];
    }
    else {
      combinedArr = this.model.attributes;
    }
    var formFields = combinedArr;
    formFields.forEach(element => {
      if (element.element_type == 'number' && element.is_removed == false) {
        this.calculationAddFieldValue1.push(element);
      }
      if (element.element_type == 'calculation' && element.is_removed == false && element.element_uuid != currentUUID) {
        this.calculationAddFieldValue1.push(element);
      }
      if (element.element_type == "dropdown" || element.element_type == "single_choice" || element.element_type == "multiple_choice" || element.element_type == "checkbox") {
        if (element.element_data.use_calculated_values == true && element.is_removed == false) {
          this.calculationAddFieldValue1.push(element);
        }
      }
    });
    console.log(this.calculationAddFieldValue1)
    this.addFieldPart = true;
    if (this.is_extend == true) {
      let dummy_model = [];
      let attribute_model = [];
      for (let i = 0; i < this.extend_model.attributes.length; i++) {
        let filter_element = combinedArr.filter(data => data.element_uuid == this.extend_model.attributes[i].element_uuid);
        if (filter_element != null) {
          dummy_model.push(filter_element[0]);
        }
      }
      this.extend_model.attributes = _.cloneDeep(dummy_model);

      for (let i = 0; i < this.model.attributes.length; i++) {
        let filter_element = combinedArr.filter(data => data.element_uuid == this.model.attributes[i].element_uuid);
        if (filter_element != null) {
          attribute_model.push(filter_element[0]);
        }
      }
      this.model.attributes = _.cloneDeep(attribute_model);
    }
  }

  closeBoxAddField() {
    this.addFieldPart = false;
  }

  s(i) { }

  togglevar(useCondition, item) {
    item.use_conditions = useCondition;
    this.exitconfirm = false;
    console.log("item@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    if (item.if_condition == "") {
      this.selected_feld_state = "";
      this.selectedItem_element_type = "";
    }
    console.log(item);
  }

  togglevisibility(index, event) {
    var modifiySingleChoice = this.model.attributes[this.editIndex];
    if (event.target.checked == true) {

      for (var i = 0; i < modifiySingleChoice.element_data.options.length; i++) {
        if (index === i) {
          modifiySingleChoice.element_data.options[i].default = true;
          console.log(modifiySingleChoice.element_data.options[i].default);
        }
        else {
          modifiySingleChoice.element_data.options[i].default = false;
        }
      }
    }
    else {


      for (var i = 0; i < modifiySingleChoice.element_data.options.length; i++) {
        modifiySingleChoice.element_data.options[i].default = false;
        console.log(modifiySingleChoice.element_data.options[i].default);
      }
    }
    this.cdRef.detectChanges();
    console.log(modifiySingleChoice);
  }

  extend_togglevisibility(index, event) {
    var modifiySingleChoice = this.extend_model.attributes[this.editIndex];
    if (event.target.checked == true) {

      for (var i = 0; i < modifiySingleChoice.element_data.options.length; i++) {
        if (index === i) {
          modifiySingleChoice.element_data.options[i].default = true;
          console.log(modifiySingleChoice.element_data.options[i].default);
        }
        else {
          modifiySingleChoice.element_data.options[i].default = false;
        }
      }
    }
    else {


      for (var i = 0; i < modifiySingleChoice.element_data.options.length; i++) {
        modifiySingleChoice.element_data.options[i].default = false;
        console.log(modifiySingleChoice.element_data.options[i].default);
      }
    }
    this.cdRef.detectChanges();
    console.log(modifiySingleChoice);
  }

  deleteOptionItem: any;
  radioDefault(v) { }
  deleteOption(item, valueindex) {
    console.log(valueindex);
    this.deleteOptionItem = item;
    this.vaue = valueindex;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogref = this.dialog.open(OptiondeleteComponent, {
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res.data == true) {
        item.element_data.options[valueindex].is_removed = true;
        this.alignmenprocess();
      }

    });
  }
  delete() {
    console.log("super" + this.vaue);
    this.dialogRef.closeAll();
    this.deleteOptionItem.element_data.options.splice(this.vaue, 1);
  }
  checkedOnly = [];
  toggleCheckbox(event: any, index, value) {
    var remember = event.target.checked;
    if (remember == true) {
      this.checkedOnly.push(index);
    } else if (remember == false) {
      for (var i = 0; i < this.checkedOnly.length; i++) {
        if (this.checkedOnly[i] == index) {
          this.checkedOnly.splice(i, 1);
        }
      }
    }
  }

  supportPage() {
    if (this.support == false) {
      if (this.exitconfirm == true) {
        this.headerService.setTitle(this.form_name);
        this.dataService2.formoption.emit(false)
        console.log("console")
        // localStorage.setItem('pageForm', this.pageFrom);
        this.encrptdecrpt.setItem("pageForm", this.pageFrom);//security
        // localStorage.setItem('builderId', this.form_id);
        this.encrptdecrpt.setItem("builderId", this.form_id);//security
        // localStorage.setItem('builderName', this.form_name);
        this.encrptdecrpt.setItem("builderName", this.form_name);//security
        this.support = true;
        this.Builder = false;
      }
      else if (this.exitconfirm == false) {
        const dialgoConfig = new MatDialogConfig();
        dialgoConfig.disableClose = true;
        dialgoConfig.autoFocus = true;
        let supportDialog = this.dialog.open(ExitconfirmComponent, {
          width: "450px",
          panelClass: "my-class",
          data: { supportPageData: true }
        });
        supportDialog.afterClosed().subscribe((response) => {
          if (response != undefined) {
            if (response.accessvalid) {
              if (response.publish) {
                this.exit_publish();
              }
              else if (response.publish != undefined && response.publish == false) {
                this.exitconfirm = true;
              }
              this.headerService.setTitle(this.form_name);
              this.dataService2.formoption.emit(false)
              // localStorage.setItem('pageForm', this.pageFrom);
              this.encrptdecrpt.setItem("pageForm", this.pageFrom);//security
              // localStorage.setItem('builderId', this.form_id);
              this.encrptdecrpt.setItem("builderId", this.form_id);//security
              // localStorage.setItem('builderName', this.form_name);
              this.encrptdecrpt.setItem("builderName", this.form_name);//security
              this.support = true;
              this.Builder = false;
            }
          }
        });
      }
    }
  }

  exitPage() {
    // this.router.navigateByUrl("formbuilder/formlist");
    if (this.exitconfirm == true && this.pageFrom == "formlist") {
      this.router.navigateByUrl("formbuilder/formlist");
    } else if (this.exitconfirm == true && this.pageFrom == "document") {
      this._location.back();
    }
    else if (this.pageFrom == "formlist") {
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      let dialogref = this.dialog.open(ExitconfirmComponent, {
        width: "450px",
        panelClass: "my-class",
        data: { supportPageData: false }
      });
      dialogref.afterClosed().subscribe((res) => {
        console.log(res);
        if (res.publish) {
          this.exit_publish();
          this._location.back();
        } else {
          this._location.back();
        }
      });
    }
    else if (this.pageFrom == "document") {
      let enableSelected = this.encrptdecrpt.getItem("preSelectAnnotationId");
      let annotationId = enableSelected.id;
      let previewBack = { state: true, id: annotationId, location: 'form_builder' };
      // localStorage.setItem("preSelectAnnotationId", JSON.stringify(previewBack));
      this.encrptdecrpt.setItem("preSelectAnnotationId", previewBack);//security
      console.log(enableSelected);
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      let dialogref = this.dialog.open(ExitconfirmComponent, {
        width: "450px",
        panelClass: "my-class",
        data: { supportPageData: false }
      });
      dialogref.afterClosed().subscribe((res) => {
        console.log(res);
        if (res.publish) {
          this.exit_publish();
          this._location.back();
        } else {
          this._location.back();
        }
      });
    }
  }

  myFunction(event) {
    this.dataService.specialCharacterPasteRestrict(event);
  }

  checkMaxNumbersOnly(event, item, value) {
    console.log(event, item, value);
    if (item["element_type"] == "number" || item["element_type"] == "Number") {
      let minimumValue = item.element_data.minimum_value;
      console.log(minimumValue);
      if (minimumValue > event.target.value) {
        item.element_data.maximum_value = "";
      }
    }
  }

  updatelastmodified(item) {

    item.last_modified_date = new Date().toISOString();
  }

  valueupdateLabelText(event) {
    // console.log(this.itemValuesModelAtr);
    // if (this.labelText1 == "") {
    //   this.itemValuesModelAtr.element_data.label_text = this.labelText;
    //   this.itemValuesModelAtr.element_data.element_name_alias = this.labelText;
    // } else {
    //   this.itemValuesModelAtr.element_data.label_text = this.labelText1;
    //   this.itemValuesModelAtr.element_data.element_name_alias = this.labelText1;
    // }
  }

  valueupdateplaceholderText(event) {
    console.log(this.itemValuesModelAtr);
    if (this.placeholderText1 == "") {
      this.placeholderText1 = this.dataService.changeFormat(this.placeholderText1)
      this.itemValuesModelAtr.element_data.placeholder_text = this.placeholderText;
    } else {
      this.placeholderText1 = this.dataService.changeFormat(this.placeholderText1)
      this.itemValuesModelAtr.element_data.placeholder_text = this.placeholderText1;
    }
  }

  placeholdernewUpdateAuc(item) {
    item.element_data.placeholder_text = this.dataService.changeFormat(this.placeholderText1)
    this.placeholderText = item.element_data.placeholder_text;
    this.placeholderText1 = "";
    this.updatelastmodified(item)
  }

  labelnewUpdateAuc1(item) {
    this.labelText = this.labelText;
    item.element_data.label_text = this.labelText;
    item.element_data.element_name_alias = this.labelText;
    this.updatelastmodified(item)
  }

  labelnewUpdateAuc(item) {
    var yu = this.labelText;
    this.labelText1 = "";
    this.duplicateNaming(this.labelText, item, "change")
    this.updatelastmodified(item)
  }

  closeSettingPage() {
    this.closeBox1 = false;
    this.closeBox2 = false;
  }

  firstLetterCapitalLabel(word, item) {
    console.log('ngmodel');
    if (word) {
      // let get_value_change = this.dataService.restrictionofSpecialcharacter(word);
      // if(get_value_change==false){
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.labelText1 = changeUpperCaseProjectName;
      this.exitconfirm = false;
      this.labelText = this.labelText1;
      item.element_data.label_text = this.labelText;
      item.element_data.element_name_alias = this.labelText;
      // this.labelText = this.dataService.changeFormat(this.labelText)
      // }
      // else{
      //   this.labelText = this.old_backup_text;
      //   this.labelText1 = this.old_backup_text;
      // }
    } else {

    }
    if (item.element_type == "checkbox" && word != "") {
      item.element_data.options[0].name = this.labelText;
    }
    else if (item.element_type == "checkbox" && word == "") {
      item.element_data.options[0].name = ""
      item.element_data.element_name_alias = ""

    } else {

    }
  }

  onPaste(word, event) {
    console.log('paste', event.target.value);
    this.old_backup_text = event.target.value;
  }
  exelColumNameChange(word, item, Index) {
    if (word) {
      this.exitconfirm = false;
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.labelText1 = changeUpperCaseProjectName;
      // item.element_data.label_text = this.labelText1
      var exelLabelText = this.labelText1;
      item.element_data.element_name_alias = exelLabelText;
    }
    this.updatelastmodified(item)
  }

  firstLetterCapitalPlaceholdertext(word, item) {
    if (word) {
      this.exitconfirm = false;
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.placeholderText = changeUpperCaseProjectName;
      this.placeholderText = changeUpperCaseProjectName;
    }
    this.updatelastmodified(item)
  }

  firstLetterCapitaldefaultValue(index, word, item, value) {
    if (value.element_type != "checkbox") {
      if (word) {
        // this.exitconfirm = false;
        let firsttypeLetter = word[0].toUpperCase();
        let othertypeletters = word.slice(1);
        let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
        item.name = changeUpperCaseProjectName;
        item.name = changeUpperCaseProjectName;
        return item.name;
      } else {
        var valueIndex = index + 1
        item.name = ''
        if (item.name == '') {
          item.placeholder = "Option " + valueIndex
        }
        return item.placeholder;
      }
    }
    else if (value.element_type == "checkbox") {
      if (word) {
        // this.exitconfirm = false;
        let firsttypeLetter = word[0].toUpperCase();
        let othertypeletters = word.slice(1);
        let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
        item.name = changeUpperCaseProjectName;
        item.name = changeUpperCaseProjectName;
        return item.name;
      }
      else {

        item.name = ''
        if (item.name == '') {
          item.placeholder = "Option"
        }
        return item.placeholder;
      }


    }
    else {
      return item.name;
    }


  }

  firstLetterCapitalOptionName(word, item, event, index) {
    console.log(index)
    if (index.element_type != "checkbox") {
      if (event) {
        this.isCompleted = [];
        this.exitconfirm = false;
        this.isCompleted.push(item.element_uuid);
        let firsttypeLetter = event[0].toUpperCase();
        let othertypeletters = event.slice(1);
        let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
        item.name = changeUpperCaseProjectName;
        // item.name = this.dataService.changeFormat(item.name)
        return item.name;
      } else {
        item.name = ''
        return item.name;
      }
    }
    if (index.element_type == "checkbox") {

      if (event) {
        this.isCompleted = [];
        this.exitconfirm = false;
        this.isCompleted.push(item.element_uuid);
        let firsttypeLetter = event[0].toUpperCase();
        let othertypeletters = event.slice(1);
        let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
        item.name = changeUpperCaseProjectName;
        this.labelText = item.name
        index.element_data.element_name_alias = item.name
        return item.name;
      }
      else {
        this.labelText = ""
        item.name = ''
        index.element_data.element_name_alias = ""
        return item.name;
      }

    }
  }
  useCondtionText: boolean = true;
  useCondtionNumber: boolean = false;
  useCondtionSMD: boolean = false;
  hideAll: boolean = true;
  public SelectValue: any;
  public selectedItem: any = [];
  public selectOptions: any[] = [];
  public pickedItem_selectOption: any[] = [];

  useConditionOption(SelectValue, item) {
    console.log(item);
    this.exitconfirm = false;
    this.pickedItem_element_type = item.element_type;
    //if ("options" in item && item.options.length > 0) {

    if (item.hasOwnProperty('default_values')) {
      this.pickedItem_selectOption = item.element_data.options;
    }

    let check_condition = ["false", false, 0, "0"];
    let condition_one = this.model.attributes.filter(data => check_condition.includes(data.is_hidden) && check_condition.includes(data.is_removed));
    let condition_two = this.extend_model.attributes.filter(data => check_condition.includes(data.is_hidden) && check_condition.includes(data.is_removed));

    this.elements_combined = [...condition_one, ...condition_two];
    console.log(this.elements_combined)
    //}
    var UsecaseFilterElement = this.elements_combined.filter(ele => ele.element_uuid == SelectValue);
    this.addressCheck = UsecaseFilterElement[0].element_type
    this.selectedItem_element_type_Local = UsecaseFilterElement[0].element_type;
    // this.selectOptions_Local = UsecaseFilterElement[0].element_data.options;
    if (UsecaseFilterElement[0].element_data.hasOwnProperty('options')) {
      if (Array.isArray(UsecaseFilterElement[0].element_data.options)) {
        this.selectOptions_Local = UsecaseFilterElement[0].element_data.options.filter(ele => ele.is_removed == false)
      }
    }
    //  this.selectOptions_Local = UsecaseFilterElement[0].element_data.options.filter(ele=>ele.is_removed==false)
    this.selected_feld_state = this.selected_feld_state;
    if (this.selected_feld_state != "") {
      this.selectedItem_element_type = UsecaseFilterElement[0].element_type;
      // this.selectOptions = UsecaseFilterElement[0].element_data.options;
      this.selectOptions = UsecaseFilterElement[0].element_data.options.filter(ele => ele.is_removed == false)
    }
  }
  ditem: any = [];
  saveSelectValue(value, selectedItem, e) {
    this.exitconfirm = false;
    selectedItem.element_data.if_value = value;
    //selectedItem.element_data.if_value=value; 
    this.ditem = this.dirtyClone(selectedItem);
    //this.ditem.element_data.if_value=value;
  }
  conditionChange(SelectState, item) {
    this.exitconfirm = false;
    this.pickedItem_element_type = item.element_type;
    this.pickedItem_selectOption = item.element_data.options;
    this.selectedItem_element_type = this.selectedItem_element_type_Local;
    this.selectOptions = this.selectOptions_Local;
    this.selected_feld_state = SelectState;

    let check_condition = ["false", false, 0, "0"];
    let condition_one = this.model.attributes.filter(data => check_condition.includes(data.is_hidden) && check_condition.includes(data.is_removed));
    let condition_two = this.extend_model.attributes.filter(data => check_condition.includes(data.is_hidden) && check_condition.includes(data.is_removed));

    this.elements_combined = [...condition_one, ...condition_two];
    console.log(this.elements_combined)

    if (item.element_data.if_condition != "") {
      var UsecaseFilterElement = this.elements_combined.filter(ele => ele.element_uuid == item.element_data.if_condition);
      this.selectedItem_element_type = UsecaseFilterElement[0].element_type;
      // this.selectOptions = UsecaseFilterElement[0].element_data.options;
      if (UsecaseFilterElement[0].element_data.hasOwnProperty('options')) {
        if (Array.isArray(UsecaseFilterElement[0].element_data.option)) {
          this.selectOptions = UsecaseFilterElement[0].element_data.options.filter(ele => ele.is_removed == false)
        }
      }
      // this.selectOptions = UsecaseFilterElement[0].element_data.options.filter(ele=>ele.is_removed==false)
    }
  }
  hide(item) {
    console.log(item);
  }

  //attribute adding for fields icon color and strock color
  attributeUpdate(item, value, action) {
    this.exitconfirm = false;
    if (action == 'icon') {
      item.element_data.options[this.activeGreen].icon = value
      this.selectionIconValue = value;
    }
    if (action == 'fill') {
      item.element_data.options[this.activeGreen].fill_color = value;
      this.selectionFillValue = value;
    }
    if (action == 'stroke') {
      item.element_data.options[this.activeGreen].stroke_color = value;
      this.selectionStrokeValue = value;
    }
      if (action == 'shape') {
      item.element_data.options[this.activeGreen].name = value;

    }
  }
  attributeUpdate_Group(item, value, action){
    if(!item.element_data.hasOwnProperty('group_color_details')){
      item.element_data.group_color_details = this.color_details_syntax_1;
    }
    let color_details = item.element_data.group_color_details;
    let level = action;
    color_details[level] = value;
    this.exitconfirm = false;
    console.log("Success")
  }

  checkbox_grouping(item,value,index){
    this.setDefaultfalse();
    let options = item.element_data.options;
    options.forEach(data => {
      data.default = false;
    })
    options[index].default = value;
    if(value == true){
      this.applySwitchcase(index);
    }
    console.log(value);
  }

  setDefaultfalse(){
    this.notStartedDefault = false;
    this.inProgressDefault = false;
    this.completedDefault = false;
    this.errorDefault = false;
  }

  applySwitchcase(index){
    switch (index) {
      case 0:
        this.notStartedDefault = true;
        break;
      case 1:
        this.inProgressDefault = true;
        break;
      case 2:
        this.completedDefault = true;
        break;
      case 3:
        this.errorDefault = true;
        break;
    }
  }


  changeLineWidth(linewidth) {
    this.exitconfirm = false;
    let value = linewidth;
    if (value / 5 < 1) {
      console.log('trigger', value);
      this.showOptions.line_width = value;
    }
    else {
      console.log('trigger', value);
      this.showOptions.line_width = value;
    }
    value = value.toFixed(1);
    this.lineWidthbox = value;
  }
  changeopacitydivider(opacity, i) {
    console.log(i, this.model.attributes)
    this.exitconfirm = false;
    let value = opacity;
    this.selectedField.element_data.opacity = value.toString();
    // this.model.attributes[i].element_data.opacity = value.toString();
    // check which is field occurring
    if (this.model.attributes.length > 0) {
      let find_current_element = this.model.attributes.findIndex((val_left) => val_left.element_uuid == this.selectedField.element_uuid);
      if (find_current_element > -1) {
        this.model.attributes[find_current_element].element_data.opacity = value.toString();
      }
    }
    if (this.extend_model.attributes.length > 0) {
      let find_current_element = this.extend_model.attributes.findIndex((val_left) => val_left.element_uuid == this.selectedField.element_uuid);
      if (find_current_element > -1) {
        this.extend_model.attributes[find_current_element].element_data.opacity = value.toString();
      }
    }
    console.log(this.model.attributes);
    console.log(this.extend_model.attributes);
    let opacityChange: any = Number(opacity);
    opacityChange = opacityChange.toFixed(2);
    this.opacitydividervalue = opacityChange.toString();
  }
  changelinewidthdivider(linewidth, i) {
    console.log(i, this.model.attributes)
    this.exitconfirm = false;
    let value = linewidth;
    this.selectedField.element_data.line_width = value.toString();
    console.log(this.selectedField);
    // check which is field occurring
    if (this.model.attributes.length > 0) {
      let find_current_element = this.model.attributes.findIndex((val_left) => val_left.element_uuid == this.selectedField.element_uuid);
      if (find_current_element > -1) {
        this.model.attributes[find_current_element].element_data.line_width = value.toString();
      }
    }
    if (this.extend_model.attributes.length > 0) {
      let find_current_element = this.extend_model.attributes.findIndex((val_left) => val_left.element_uuid == this.selectedField.element_uuid);
      if (find_current_element > -1) {
        this.extend_model.attributes[find_current_element].element_data.line_width = value.toString();
      }
    }
    console.log(this.model.attributes)
    console.log(this.extend_model.attributes)
    // this.model.attributes[i].element_data.line_width = value.toString();
    console.log(this.selectedField)
    let numberChange: any = Number(linewidth);
    numberChange = numberChange.toFixed(2);
    this.linewidthvaluedivider = numberChange.toString();
  }
  changelinewidthgrouping(linewidth, i) {
    console.log(i, this.model.attributes)
    this.exitconfirm = false;
    let value = linewidth;
    if(this.selectedField.element_data.hasOwnProperty('group_color_details')){
      this.selectedField.element_data.group_color_details.line_width = value.toString();
    }
    else{
      this.selectedField.element_data.group_color_details = this.color_details_linewidth;
      this.selectedField.element_data.group_color_details.line_width = value.toString();
    }
    console.log(this.selectedField);
    // check which is field occurring
    if (this.model.attributes.length > 0) {
      let find_current_element = this.model.attributes.findIndex((val_left) => val_left.element_uuid == this.selectedField.element_uuid);
      if (find_current_element > -1) {
        this.model.attributes[find_current_element].element_data.group_color_details.line_width = value.toString();
      }
    }
    if (this.extend_model.attributes.length > 0) {
      let find_current_element = this.extend_model.attributes.findIndex((val_left) => val_left.element_uuid == this.selectedField.element_uuid);
      if (find_current_element > -1) {
        this.extend_model.attributes[find_current_element].element_data.line_width = value.toString();
      }
    }
    console.log(this.model.attributes)
    console.log(this.extend_model.attributes)
    // this.model.attributes[i].element_data.line_width = value.toString();
    console.log(this.selectedField)
    let numberChange: any = Number(linewidth);
    numberChange = numberChange.toFixed(2);
    this.linewidthvaluegrouping = numberChange.toString();
  }
  stop(event, value) {
    console.log(event.code, value);
    if (event.code == "KeyE") {
      event.preventDefault();
    }
    if (event.code == "ArrowDown" || event.code == "ArrowUp") {
      this.decimal = true;
    }
    else {
      this.decimal = false;
    }
    if (event.code == "Digit0") {
      this.zero = true;
      value = value.toFixed(1);
      this.lineWidthbox = value;
    }
    else {
      this.zero = false;
    }
  }

  stop1(event, value) {
    console.log(event.code, value);
    // if (event.code == "KeyE") {
    //   event.preventDefault();
    // }
    if (value == "0") {
      value = ""
    }
  }

  novalueOut(event, value) {
    console.log(event, value);
    let elementMap = document.getElementById("linemapping");
    if (value == null || value == 0 || value == "0") {
      this.lineWidthValue = 1;
      this.showOptions.line_width = 1;
      (elementMap as HTMLInputElement).value = "1";
    }
  }
  novalueOut1(event, value, i) {
    console.log(event, value);
    let elementMap = document.getElementById("linemappingdivider");
    if (value == null || value == 0 || value == "0") {
      this.linewidthdivider = "1.00";
      this.linewidthvaluedivider = "1.00";
      // (elementMap as HTMLInputElement).value = "1";
      this.selectedField.element_data.line_width = "1.00";
      this.model.attributes[i].element_data.line_width = "1.00";
    }
  }
  novalueOut1Grouping(event, value, i){
    if (value == null || value == 0 || value == "0") {
      // this.linewidthdivider = "1.00";
      this.linewidthvaluegrouping = "1.00";
      if(!this.selectedField.element_data.hasOwnProperty('group_color_details')){
        this.selectedField.element_data.group_color_details = this.color_details_linewidth;
      }
      this.selectedField.element_data.group_color_details.line_width = "1.00";
      this.model.attributes[i].element_data.group_color_details.line_width = "1.00";
    }
  }
  novalueOut2(event, value, i) {
    console.log(event, value);
    let elementMap = document.getElementById("opacitymappingdivider");
    if (value == null || value == 0 || value == "0" || value == undefined) {
      this.opacitydividervalue = "0.10";
      this.opacitydivider = "0.10";
      this.selectedField.element_data.opacity = "0.10";
      this.model.attributes[i].element_data.opacity = "0.10";
      // (elementMap as HTMLInputElement).value = "0.1";
    }
  }
  opacity1(event, value, i) {
    console.log(value)
    this.exitconfirm = false;
    let elementMap = document.getElementById("opacitymappingdivider");
    if (value != null && value != "") {
      if (value > 1) {
        console.log('fivety above');
        this.selectedField.element_data.opacity = "1";
        this.model.attributes[i].element_data.opacity = "1";
        this.opacitydividervalue = "1";
        // (elementMap as HTMLInputElement).value ="1";
        event.preventDefault();
      }
      else if (value <= 1) {
        console.log('fivty below');
        this.selectedField.element_data.opacity = value.toString();
        this.model.attributes[i].element_data.opacity = value.toString();
        this.opacitydividervalue = value.toString();
        // (elementMap as HTMLInputElement).value = value;
      }
    }
  }

  checklineWidthfordivider(event, value, i) {

    console.log(value)
    this.exitconfirm = false;
    let elementMap = document.getElementById("linemappingdivider");
    if (value == 0) {
      this.linewidthvaluedivider = '1';
      // (elementMap as HTMLInputElement).value ='1';
      this.selectedField.element_data.line_width = "1";
      this.model.attributes[i].element_data.line_width = "1";
    }
    else if (value != null && value != "") {
      if (value > 10) {
        console.log('ten above');
        this.selectedField.element_data.line_width = "10";
        this.model.attributes[i].element_data.line_width = "10";
        this.linewidthvaluedivider = 10;
        event.preventDefault();
        // (elementMap as HTMLInputElement).value ="10";
      }
      else if (value <= 10) {
        console.log('ten below');
        this.selectedField.element_data.line_width = value.toString();
        this.model.attributes[i].element_data.line_width = value.toString();
        this.linewidthvaluedivider = value;
        // (elementMap as HTMLInputElement).value = value;
      }
    }
  }

  checklineWidthforgroupingBox(event, value, i) {

    console.log(value)
    this.exitconfirm = false;
    if(!this.selectedField.element_data.hasOwnProperty('group_color_details')){
      this.selectedField.element_data.group_color_details = this.color_details_linewidth;
    }
    if (value == 0) {
      this.linewidthvaluegrouping = '1';
      this.selectedField.element_data.group_color_details.line_width = "1";
      this.model.attributes[i].element_data.group_color_details.line_width = "1";
    }
    else if (value != null && value != "") {
      if (value > 10) {
        console.log('ten above');
        this.selectedField.element_data.line_width = "10";
        this.model.attributes[i].element_data.group_color_details.line_width = "10";
        this.linewidthvaluegrouping = 10;
        event.preventDefault();
      }
      else if (value <= 10) {
        console.log('ten below');
        this.selectedField.element_data.group_color_details.line_width = value.toString();
        this.model.attributes[i].element_data.group_color_details.line_width = value.toString();
        this.linewidthvaluegrouping = value;
      }
    }
  }

  // checklineWidth(event, value) {
  //   console.log(value, event, typeof value);
  //   this.exitconfirm = false;
  //   let elementMap = document.getElementById("linemapping");
  //   var nn=(elementMap as HTMLInputElement).value;
  //   var nnn=Number(nn);

  //   if(nnn!=value)
  //   {
  //     value=nnn;
  //   }
  //   if(this.decimal==true || this.zero==true)
  //   {
  //     value=value.toFixed(1);
  //   }
  //   if (value != null && value != 0) {
  //     if (value > 50) {
  //       console.log('fivety above');
  //       this.lineWidthValue = 50.0;
  //       this.showOptions.line_width = 50.0;
  //       (elementMap as HTMLInputElement).value = "50";
  //     } else if (value <= 50) {
  //       if (value / 5 < 1) {
  //         console.log('fivty below');
  //         this.lineWidthValue = value;
  //         this.showOptions.line_width = value;
  //         (elementMap as HTMLInputElement).value = value;
  //       }
  //       else {
  //         console.log('fivty below');
  //         this.lineWidthValue = value;
  //         (elementMap as HTMLInputElement).value = value;
  //         this.showOptions.line_width = value;
  //       }
  //     } else {
  //       console.log('final list');
  //       this.showOptions.line_width = value;
  //     }
  //   }
  //   else {
  //     (elementMap as HTMLInputElement).value = "";
  //   }
  //   console.log(this.lineWidth);
  //   this.lineWidthbox=(elementMap as HTMLInputElement).value;
  // }

  checklineWidth() {

    let getlineElement = (<HTMLInputElement>document.getElementById("linemapping"));
    console.log(getlineElement.value);
    if (getlineElement.value != "") {
      var value = Number(getlineElement.value);
    }
    else if (getlineElement.value == "") {
      getlineElement.value = "";
    }
    console.log(value);
    if (value != null && getlineElement.value != "" && value != undefined) {
      if (value < 0) {
        console.log('0 below', value);
        this.lineWidthValue = 1;
        getlineElement.value = "1";
        this.showOptions.line_width = 1;
        this.lineWidthbox = 1;

      }
      else if (value > 50) {
        console.log('50 above', value);
        this.lineWidthValue = 50;
        getlineElement.value = "50";
        this.showOptions.line_width = 50;
        this.lineWidthbox = 50;

      }
      else if(Number.isNaN(value))
      {
        getlineElement.value = "";
        this.showOptions.line_width = "";
      }
      else {
        console.log('between', value);
        value = Number(value.toFixed(1));
        this.lineWidthValue = value;
        this.showOptions.line_width = value;
        this.lineWidthbox = value;
      }
    }
  }

  getCurrentDate(option) {
    this.dateopt = option

    if (this.dateopt == "current") {
      return new Date();
    }
    else if (this.dateopt == "none") {
      return;
    }
    else {
      return this.dateopt;
    }
  }

  changedateLocal(item, value) {
    this.exitconfirm = false;
    item.element_data.default_date_time = value;
    this.updatelastmodified(item)
  }

  // function for duplicate name check 
  duplicateNaming(name, item, mode) {
    if (name == "") {
      this.exitconfirm = false;
      var labelText = name;
      this.labelText = name;
      item.element_data.label_text = name;
      item.element_data.element_name_alias = name;
    } else {
      let count = 0;
      var labelText = name;
      var checkArry;
      let clone_model_att = _.cloneDeep(this.model.attributes)
      let clone_extend_model_att = _.cloneDeep(this.extend_model.attributes);
      let data_allow_condition = ["false", false, 0, "0"];
      if (clone_model_att != undefined && clone_model_att != null && clone_model_att.length > 0) {
        clone_model_att = clone_model_att.filter((m_a) => data_allow_condition.includes(m_a.is_removed));
      }
      if (clone_extend_model_att != undefined && clone_extend_model_att != null && clone_extend_model_att.length > 0) {
        clone_extend_model_att = clone_extend_model_att.filter((e_m_a) => data_allow_condition.includes(e_m_a.is_removed));
      }
      if (mode == "copy") {
        checkArry = [...clone_model_att, ...clone_extend_model_att];
      } else {
        checkArry = clone_model_att.filter(ele => ele.element_uuid != item.element_uuid);
      }
      checkArry = checkArry.filter(data => data.element_name != "empty_cell");
      var duplicateName = checkArry.filter(ele => ele.element_data.label_text.toLowerCase().trim() === name.toLowerCase().trim());

      if (duplicateName.length > 0) {
        checkArry.forEach((e) => {
          // let temp_name = e.element_data.label_text.split('(');
          let temp_name = e.element_data.label_text;
          let find_existing_name = checkArry.findIndex((field) => field.element_data.label_text.toLowerCase().trim() == labelText.toLowerCase().trim());
          if (find_existing_name > -1) {
            count = count + 1;
            labelText = name.trim() + " (" + count + ")";
          }
          // if (temp_name.trim() === labelText.trim()) {
          //   count = count + 1;
          //   labelText = name.trim() + " (" + count + ")";
          // }
        });
      }
      else {
        labelText = name;
      }
      this.labelText = labelText;
      item.element_data.label_text = labelText;
      item.element_data.element_name_alias = labelText;
      if (item.element_type == "checkbox") {
        item.element_data.options[0].name = labelText;
      }
    }
  }

  maxValueCheck(e, input, item) {
    this.updatelastmodified(item)
    if (item.element_data.default_value != "") {
      if (Number(item.element_data.default_value) > Number(e.target.value)) {
        item.element_data.maximum_value = ""

      } else {
        console.log(item.element_data.maximum_value)
        item.element_data.maximum_value = e.target.value

      }
    } else if (item.element_data.minimum_value != "") {
      if (Number(item.element_data.minimum_value) > Number(e.target.value)) {
        item.element_data.maximum_value = ""
      } else {
        console.log("vvvv")

        item.element_data.maximum_value = (e.target.value)
        if (item.element_data.maximum_value.includes(".")) {
          item.element_data.maximum_value = (item.element_data.maximum_value)
          console.log(item.element_data.maximum_value)
        }
        else {
          item.element_data.maximum_value = item.element_data.maximum_value + ".0"
        }
        if (item.element_data.maximum_value == Math.round(item.element_data.maximum_value)) {
          item.element_data.maximum_value = Number(item.element_data.maximum_value).toFixed(1)
          item.element_data.maximum_value.toString()
          console.log(item.element_data.maximum_value)
        }
        else if (item.element_data.maximum_value > Number(item.element_data.maximum_value).toFixed(9)) {
          console.log(item.element_data.maximum_value)
          item.element_data.maximum_value = Number(item.element_data.maximum_value).toFixed(9)
          item.element_data.maximum_value.toString()
          console.log(item.element_data.maximum_value)
        }
        else {
          item.element_data.maximum_value = item.element_data.maximum_value
        }
      }
    }
    else {
      item.element_data.maximum_value = e.target.value
    }
    this.exitconfirm = false;
  }

  minValueCheck(e, input, item) {
    this.updatelastmodified(item)
    if (item.element_data.default_value != "") {
      if (Number(item.element_data.default_value) < Number(e.target.value)) {
        item.element_data.minimum_value = ""
      } else {
        item.element_data.minimum_value = e.target.value
        if (item.element_data.minimum_value.includes(".")) {
          item.element_data.minimum_value = (item.element_data.minimum_value)
          console.log(item.element_data.minimum_value)
        }
        else {
          item.element_data.minimum_value = item.element_data.minimum_value + ".0"
        }
        if (item.element_data.minimum_value == Math.round(item.element_data.minimum_value)) {
          item.element_data.minimum_value = Number(item.element_data.minimum_value).toFixed(1)
          item.element_data.minimum_value.toString()
          console.log(item.element_data.minimum_value)
        }
        else if (item.element_data.minimum_value > Number(item.element_data.minimum_value).toFixed(9)) {
          console.log(item.element_data.minimum_value)
          item.element_data.minimum_value = Number(item.element_data.minimum_value).toFixed(9)
          item.element_data.minimum_value.toString()
          console.log(item.element_data.minimum_value)
        }
        else {
          item.element_data.minimum_value = item.element_data.minimum_value
        }

      }
    } else if (item.element_data.maximum_value != "") {
      if (Number(item.element_data.maximum_value) < Number(e.target.value)) {
        item.element_data.minimum_value = ""
      } else {
        item.element_data.minimum_value = e.target.value
        if (item.element_data.minimum_value.includes(".")) {
          item.element_data.minimum_value = (item.element_data.minimum_value)
          console.log(item.element_data.minimum_value)
        }
        else {
          item.element_data.minimum_value = item.element_data.minimum_value + ".0"
        }
        if (item.element_data.minimum_value == Math.round(item.element_data.minimum_value)) {
          item.element_data.minimum_value = Number(item.element_data.minimum_value).toFixed(1)
          item.element_data.minimum_value.toString()
          console.log(item.element_data.minimum_value)
        }
        else if (item.element_data.minimum_value > Number(item.element_data.minimum_value).toFixed(9)) {
          console.log(item.element_data.minimum_value)
          item.element_data.minimum_value = Number(item.element_data.minimum_value).toFixed(9)
          item.element_data.minimum_value.toString()
          console.log(item.element_data.minimum_value)
        }
        else {
          item.element_data.minimum_value = item.element_data.minimum_value
        }

      }
    } else {

      item.element_data.minimum_value = e.target.value
      if (item.element_data.maximum_value.includes(".")) {
        item.element_data.maximum_value = (item.element_data.maximum_value)
        console.log(item.element_data.maximum_value)
      }
      else {
        item.element_data.maximum_value = item.element_data.maximum_value + ".0"
      }
      if (item.element_data.maximum_value == Math.round(item.element_data.maximum_value)) {
        item.element_data.maximum_value = Number(item.element_data.maximum_value).toFixed(1)
        item.element_data.maximum_value.toString()
        console.log(item.element_data.maximum_value)
      }
      else if (item.element_data.maximum_value > Number(item.element_data.maximum_value).toFixed(9)) {
        console.log(item.element_data.maximum_value)
        item.element_data.maximum_value = Number(item.element_data.maximum_value).toFixed(9)
        item.element_data.maximum_value.toString()
        console.log(item.element_data.maximum_value)
      }
      else {
        item.element_data.maximum_value = item.element_data.maximum_value
      }

    }
    this.exitconfirm = false;
  }

  defaultValueChange(e, item) {
    this.exitconfirm = false;

    this.updatelastmodified(item)
    if (item.element_data.maximum_value != "" && item.element_data.maximum_value != null) {
      if (Number(item.element_data.maximum_value) < Number(e.target.value)) {
        item.element_data.default_value = ""
      } else if (item.element_data.minimum_value != "" && item.element_data.minimum_value != null) {
        if (Number(item.element_data.minimum_value) > Number(e.target.value)) {
          item.element_data.default_value = ""
        } else if (item.element_data.minimum_value != "" && item.element_data.minimum_value != null) {
          if (Number(item.element_data.minimum_value) > Number(e.target.value)) {
            item.element_data.default_value = ""
          } else {
            item.element_data.default_value = e.target.value
          }
        } else {
          item.element_data.default_value = e.target.value
        }
      }
    } else {
      item.element_data.default_value = e.target.value;
    }
  }


  ChnageClaculateValue(item, uuid, value) {
    this.exitconfirm = false;
    var CalculatioField = item.element_data.options.filter(ele => ele.element_uuid == uuid);
    if (value == null) {
      CalculatioField[0].calculated_value = ""
    } else {
      CalculatioField[0].calculated_value = value.toString();
    }
  }

  clearDate(item) {
    this.exitconfirm = false;
    console.log(item);
    for (let k = 0; k < this.model.attributes.length; k++) {
      if (this.model.attributes[k].element_uuid == item.element_uuid) {
        this.model.attributes[k].element_data.default_date_time = "none";
        item.element_data.default_date_time = "none";
      }
    }
    this.updatelastmodified(item)

  }

  clearDateIf(item) {
    for (let k = 0; k < this.model.attributes.length; k++) {
      this.exitconfirm = false;
      if (this.model.attributes[k].element_uuid == item.element_uuid) {
        this.model.attributes[k].element_data.if_value = "";
        item.element_data.if_value = "";
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    //removing the removed option from an array.
    event.container.data.forEach(ele => {
      if (ele["is_removed"] == true) {
        let itemIndex = event.container.data.indexOf(ele);
        event.container.data.splice(itemIndex, 1)
      }
    })

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  //for making the display value from the calculetion uuid
  FormfieldValueChange() {
    if (this.is_extend == true) {
      this.extend_FormfieldValueChange();
    }
    else {
      var calculationValueUpdate = this.model.attributes.filter(ele => ele.element_type == "calculation");
      if (calculationValueUpdate.length != 0) {
        var i = 0;
        calculationValueUpdate.forEach(calc => {
          //replacing with text label
          if (calculationValueUpdate[i].element_data['calculation_value'] != "" && calculationValueUpdate[i].element_data['calculation_value'] != undefined) {
            var CalcValue = calc.element_data.calculation_value;
            var matches = [];
            var pattern = /\[(.*?)\]/g;
            var match;

            while ((match = pattern.exec(CalcValue)) != null) {
              matches.push(match[1]);
            }

            calc.element_data.calculation_display_value = calc.element_data.calculation_value;
            matches.forEach(element => {

              //if (element == key) {
              var FieldFind = this.model.attributes.filter(ele => ele.element_uuid == element);
              if (FieldFind.length != 0) {
                calc.element_data.calculation_display_value = calc.element_data.calculation_display_value.replace(element, FieldFind[0].element_data.label_text)
              }
              else {

              }

            })
          }
          i++;
        });
        this.FormulaCalc()
      }
    }
  }

  extend_FormfieldValueChange() {
    var combinedArr = [...this.model.attributes, ...this.extend_model.attributes];
    var calculationValueUpdate = combinedArr.filter(ele => ele.element_type == "calculation");
    if (calculationValueUpdate.length != 0) {
      var i = 0;
      calculationValueUpdate.forEach(calc => {
        //replacing with text label
        if (calculationValueUpdate[i].element_data['calculation_value'] != "" && calculationValueUpdate[i].element_data['calculation_value'] != undefined) {
          var CalcValue = calc.element_data.calculation_value;
          var matches = [];
          var pattern = /\[(.*?)\]/g;
          var match;

          while ((match = pattern.exec(CalcValue)) != null) {
            matches.push(match[1]);
          }

          calc.element_data.calculation_display_value = calc.element_data.calculation_value;
          matches.forEach(element => {

            //if (element == key) {
            var FieldFind = combinedArr.filter(ele => ele.element_uuid == element);
            if (FieldFind.length != 0) {
              calc.element_data.calculation_display_value = calc.element_data.calculation_display_value.replace(element, FieldFind[0].element_data.label_text)
            }
            else {

            }

          })
        }
        i++;
      });
      this.extend_FormulaCalc()
    }

  }

  //calculation
  FormulaCalc() {
    //taking  all the calculation field
    if (this.is_extend == true) {
      this.extend_FormulaCalc();
    }
    else {
      var calculationValueUpdate = this.model.attributes.filter(ele => ele.element_type == "calculation");
      if (calculationValueUpdate.length != 0) {
        // if (FormulaFieldfind[0].element_data.calculation_value == "") { } else {
        var i = 0;
        calculationValueUpdate.forEach(calc => {

          if (calc.element_data.calculation_value != "" && calc.element_data.calculation_value != undefined) {
            if (calc.element_data['calculation_value'].includes("AVG")) {
              //if it is avarage calcuation
              this.AvarageCalculation(calc, calculationValueUpdate[i])
            } else {
              var CalcValue = calc.element_data.calculation_value;
              var matches = [];
              var pattern = /\[(.*?)\]/g;
              var match;
              //taking the current calculation field and  making the uuid array
              while ((match = pattern.exec(CalcValue)) != null) {
                matches.push(match[1]);
              }

              this.DummyField = calc.element_data.calculation_value;
              calc.element_data.calculation = calc.element_data.calculation_value
              matches.forEach(element => {
                //if (element == key) {
                // changing  the default value binding for calculation
                var FieldFind = this.model.attributes.filter(ele => ele.element_uuid == element);
                this.FieldResult = FieldFind[0];

                this.DummyField = this.DummyField.replace(element, FieldFind[0].element_data.label_text)
                // if (FieldFind[0].element_type == "single_choice" || FieldFind[0].element_type == "dropdown") {
                //   var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
                //   if (CalculatioField1.length > 0) {
                //     if (CalculatioField1[0].calculated_value != "") {
                //       if (calc.element_data.calculation.includes('[' + element + ']')) {
                //         calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", CalculatioField1[0].calculated_value)
                //       } else {
                //         calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", CalculatioField1[0].calculated_value)
                //       }
                //       this.DummyField = calc.element_data.calculation
                //     }
                //     else {
                //       calc.element_data.calculation = this.DummyField
                //     }

                //   } else {
                //     calc.element_data.calculation = this.DummyField
                //   }
                // } else if (FieldFind[0].element_type == "multiple_choice" || FieldFind[0].element_type == "checkbox") {
                //   var calculatedalltotal = 0;
                //   var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
                //   if (CalculatioField1.length > 0) {
                //     CalculatioField1.forEach(ele => {
                //       if (ele.calculated_value != "") {
                //         calculatedalltotal = calculatedalltotal + Number(ele.calculated_value)
                //       }
                //     });
                //     if (calculatedalltotal != 0) {
                //       if (calc.element_data.calculation.includes('[' + element + ']')) {
                //         calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", calculatedalltotal)
                //       } else {
                //         calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", calculatedalltotal)
                //       }
                //       this.DummyField = calc.element_data.calculation
                //     }
                //     else {
                //       calc.element_data.calculation = this.DummyField
                //     }
                //   } 
                //   else if(CalculatioField1.length == 0 && FieldFind[0].element_type == "checkbox")
                // 	{
                // 		calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                // 	}
                //   else {
                //     calc.element_data.calculation = this.DummyField
                //   }
                // }
                if (FieldFind[0].element_type == "single_choice" || FieldFind[0].element_type == "dropdown") {
                  var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
                  if (CalculatioField1.length > 0) {
                    if (CalculatioField1[0].calculated_value != "") {
                      if (calc.element_data.calculation.includes('[' + element + ']')) {
                        calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", CalculatioField1[0].calculated_value)
                      }
                      else {
                        calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                      }
                      this.DummyField = calc.element_data.calculation
                    } else {
                      //calc.element_data.calculation = this.DummyField
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                    }

                  } else {
                    //calc.element_data.calculation = this.DummyField
                    calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
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
                    console.log(calculatedalltotal);
                    if (calculatedalltotal != 0) {
                      if (calc.element_data.calculation.includes('[' + element + ']')) {
                        calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", calculatedalltotal)
                      }
                      else {
                        calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                      }
                      this.DummyField = calc.element_data.calculation
                    }
                    else if (calculatedalltotal == 0 && FieldFind[0].element_type == "checkbox") {
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 1)
                    }

                    else {
                      //calc.element_data.calculation = this.DummyField
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                    }
                  }
                  else if (CalculatioField1.length == 0) {
                    calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                  }
                  // else {
                  // 	//calc.element_data.calculation = this.DummyField
                  // 	calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", 0)
                  // }
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
                //}
              })
              if (calc.element_data.calculation.includes('[')) {
                calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation;
              }
              else {
                //if the calculation containing roundad value
                if (calc.element_data.calculation.includes('.rounded()')) {
                  calc.element_data.calculation = calc.element_data.calculation.split(".rounded()").join("")
                  calculationValueUpdate[i].element_data.calculation = eval(
                    calc.element_data.calculation
                  );
                  calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation != "" && calculationValueUpdate[i].element_data.calculation > 1 ? Math.round(calculationValueUpdate[i].element_data.calculation) : 1
                  calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
                }
                else if (calc.element_data.calculation.includes('√')) {
                  // sample √12+4
                  let covert_calculation_value = calc.element_data.calculation;
                  let splited_values: any = covert_calculation_value.split(/[*/+-]+/g);
                  // splited the maths operators
                  let final_calculation = 0;
                  for (let change_maths = 0; change_maths < splited_values.length; change_maths++) {
                    let get_caluclation = splited_values[change_maths];
                    if (get_caluclation.includes('√')) {
                      let get_first_char = get_caluclation.substring(0, 1);
                      let get_remaining_char: any = get_caluclation.substring(1);
                      get_remaining_char = Number(get_remaining_char);
                      let final_math_calculation = Math.sqrt(get_remaining_char);
                      final_calculation = final_calculation + final_math_calculation;
                    }
                    else {
                      let basic_calculation = splited_values[change_maths];
                      basic_calculation = Number(basic_calculation);
                      final_calculation = final_calculation + basic_calculation;
                    }
                  }
                  calculationValueUpdate[i].element_data.calculation = final_calculation;
                  calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
                }
                else {
                  calculationValueUpdate[i].element_data.calculation = eval(
                    calc.element_data.calculation
                  );

                  calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
                  let confirmedValue = calc.element_data.calculation;
                  console.log(Math.abs(confirmedValue));
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
      this.settings1 = false;
      this.settings2 = false;
    }
  }

  extend_FormulaCalc() {
    var combinedArr = [...this.model.attributes, ...this.extend_model.attributes];
    //taking  all the calculation field

    var calculationValueUpdate = combinedArr.filter(ele => ele.element_type == "calculation");
    if (calculationValueUpdate.length != 0) {
      // if (FormulaFieldfind[0].element_data.calculation_value == "") { } else {
      var i = 0;
      calculationValueUpdate.forEach(calc => {

        if (calc.element_data.calculation_value != "" && calc.element_data.calculation_value != undefined) {
          if (calc.element_data['calculation_value'].includes("AVG")) {
            //if it is avarage calcuation
            this.AvarageCalculation(calc, calculationValueUpdate[i])
          } else {
            var CalcValue = calc.element_data.calculation_value;
            var matches = [];
            var pattern = /\[(.*?)\]/g;
            var match;
            //taking the current calculation field and  making the uuid array
            while ((match = pattern.exec(CalcValue)) != null) {
              matches.push(match[1]);
            }

            this.DummyField = calc.element_data.calculation_value;
            calc.element_data.calculation = calc.element_data.calculation_value
            matches.forEach(element => {

              //if (element == key) {
              // changing  the default value binding for calculation
              var FieldFind = combinedArr.filter(ele => ele.element_uuid == element);
              this.FieldResult = FieldFind[0];

              this.DummyField = this.DummyField.replace(element, FieldFind[0].element_data.label_text)
              // if (FieldFind[0].element_type == "single_choice" || FieldFind[0].element_type == "dropdown") {
              //   var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
              //   if (CalculatioField1.length > 0) {
              //     if (CalculatioField1[0].calculated_value != "") {
              //       if (calc.element_data.calculation.includes('[' + element + ']')) {
              //         calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", CalculatioField1[0].calculated_value)
              //       } else {
              //         calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", CalculatioField1[0].calculated_value)
              //       }
              //       this.DummyField = calc.element_data.calculation
              //     }
              //     else {
              //       calc.element_data.calculation = this.DummyField
              //     }

              //   } else {
              //     calc.element_data.calculation = this.DummyField
              //   }
              // } else if (FieldFind[0].element_type == "multiple_choice" || FieldFind[0].element_type == "checkbox") {
              //   var calculatedalltotal = 0;
              //   var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
              //   if (CalculatioField1.length > 0) {
              //     CalculatioField1.forEach(ele => {
              //       if (ele.calculated_value != "") {
              //         calculatedalltotal = calculatedalltotal + Number(ele.calculated_value)
              //       }
              //     });
              //     if (calculatedalltotal != 0) {
              //       if (calc.element_data.calculation.includes('[' + element + ']')) {
              //         calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", calculatedalltotal)
              //       } else {
              //         calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", calculatedalltotal)
              //       }
              //       this.DummyField = calc.element_data.calculation
              //     }
              //     else {
              //       calc.element_data.calculation = this.DummyField
              //     }
              //   } 
              //   else if(CalculatioField1.length == 0 && FieldFind[0].element_type == "checkbox")
              // 	{
              // 		calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
              // 	}
              //   else {
              //     calc.element_data.calculation = this.DummyField
              //   }
              // }
              if (FieldFind[0].element_type == "single_choice" || FieldFind[0].element_type == "dropdown") {
                var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
                if (CalculatioField1.length > 0) {
                  if (CalculatioField1[0].calculated_value != "") {
                    if (calc.element_data.calculation.includes('[' + element + ']')) {
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", CalculatioField1[0].calculated_value)
                    }
                    else {
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                    }
                    this.DummyField = calc.element_data.calculation
                  } else {
                    //calc.element_data.calculation = this.DummyField
                    calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                  }

                } else {
                  //calc.element_data.calculation = this.DummyField
                  calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
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
                  console.log(calculatedalltotal);
                  if (calculatedalltotal != 0) {
                    if (calc.element_data.calculation.includes('[' + element + ']')) {
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", calculatedalltotal)
                    }
                    else {
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                    }
                    this.DummyField = calc.element_data.calculation
                  }
                  else if (calculatedalltotal == 0 && FieldFind[0].element_type == "checkbox") {
                    calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 1)
                  }

                  else {
                    //calc.element_data.calculation = this.DummyField
                    calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                  }
                }
                else if (CalculatioField1.length == 0) {
                  calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                }
                // else {
                // 	//calc.element_data.calculation = this.DummyField
                // 	calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", 0)
                // }
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
              //}
            })
            if (calc.element_data.calculation.includes('[')) {
              calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation;
            } else {
              //if the calculation containing roundad value
              if (calc.element_data.calculation.includes('.rounded()')) {
                calc.element_data.calculation = calc.element_data.calculation.split(".rounded()").join("")
                calculationValueUpdate[i].element_data.calculation = eval(
                  calc.element_data.calculation
                );
                calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation != "" && calculationValueUpdate[i].element_data.calculation > 1 ? Math.round(calculationValueUpdate[i].element_data.calculation) : 1
                calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
              } else {
                calculationValueUpdate[i].element_data.calculation = eval(
                  calc.element_data.calculation
                );

                calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
                let confirmedValue = calc.element_data.calculation;
                console.log(Math.abs(confirmedValue));
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
    let dummy_model = [];
    let attribute_model = [];
    for (let i = 0; i < this.extend_model.attributes.length; i++) {
      let filter_element = combinedArr.filter(data => data.element_uuid == this.extend_model.attributes[i].element_uuid);
      if (filter_element != null) {
        dummy_model.push(filter_element[0]);
      }
    }
    this.extend_model.attributes = _.cloneDeep(dummy_model);

    for (let i = 0; i < this.model.attributes.length; i++) {
      let filter_element = combinedArr.filter(data => data.element_uuid == this.model.attributes[i].element_uuid);
      if (filter_element != null) {
        attribute_model.push(filter_element[0]);
      }
    }
    this.model.attributes = _.cloneDeep(attribute_model);

    this.settings1 = false;
    this.settings2 = false;
  }

  AvarageCalculation(calc, calculationValueUpdate) {
    var combinedArr = [];
    if (this.is_extend == true) {
      combinedArr = [...this.model.attributes, ...this.extend_model.attributes];
    }
    else {
      combinedArr = this.model.attributes;
    }
    if (calculationValueUpdate.element_data['calculation_value'] != "" && calculationValueUpdate.element_data['calculation_value'] != undefined) {
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
        var FieldFind = combinedArr.filter(ele => ele.element_uuid == element);
        //checking each element and adding the value and taking the count
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
          if (FieldFind[0].element_data.calculation != "" && FieldFind[0].element_data.calculation != undefined) {
            if (FieldFind[0].element_data.calculation.includes('[')) {
              //calc.element_data.calculation = this.DummyField
            } else {
              value = value + Number(FieldFind[0].element_data.calculation)
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
        if (value != 0 && count != 0)
          calc.element_data.calculation = value / count;
      })
      if (calc.element_data.calculation == 0) {
        calc.element_data.calculation = ""
      }
      if (calc.element_data.calculation != "") {
        calculationValueUpdate.element_data.calculation = calc.element_data.calculation
        calculationValueUpdate.element_data.calculation = calculationValueUpdate.element_data.calculation.toFixed(Number(calculationValueUpdate.element_data.default_value));
        let confirmedValue = calc.element_data.calculation;
      } else {
        calculationValueUpdate.element_data.calculation = calc.element_data.calculation
      }
    }
    if (this.is_extend == true) {
      let dummy_model = [];
      let attribute_model = [];
      for (let i = 0; i < this.extend_model.attributes.length; i++) {
        let filter_element = combinedArr.filter(data => data.element_uuid == this.extend_model.attributes[i].element_uuid);
        if (filter_element != null) {
          dummy_model.push(filter_element[0]);
        }
      }
      this.extend_model.attributes = _.cloneDeep(dummy_model);

      for (let i = 0; i < this.model.attributes.length; i++) {
        let filter_element = combinedArr.filter(data => data.element_uuid == this.model.attributes[i].element_uuid);
        if (filter_element != null) {
          attribute_model.push(filter_element[0]);
        }
      }
      this.model.attributes = _.cloneDeep(attribute_model);
    }
  }

  getdropdownvalue(dropdown) {
    if (dropdown == '') {
      console.log(dropdown)
      return false;
    } else {
      return true;
    }
  }

  changeDropdownStyle(options) {
    let optionsSelected: Boolean = false
    for (let i = 0; i < options.length; i++) {
      optionsSelected = options[i].default === true || options[i].default === "true" || options[i].default === "1" ? true : optionsSelected
    }
    if (optionsSelected === true) {
      return "dropdown-text"
    }
    return "dropdown-textcolor"
  }

  validateOptionText(stringToCheck, uuid) {
    let isAccessed = this.isCompleted.filter(ele => ele.element_uuid == uuid);
    if (stringToCheck.toLowerCase().includes("option") && isAccessed.length == 0) {
      return ""
    }
    return stringToCheck
  }

  //default value & minimum value
  defaultValue() {
    // console.log(event.target.value)

    //  = document.getElementById("inputBox");
    this.inputBox = document.getElementById("inputBox");

    this.inputBox.onkeypress = function (e) {
      e = e || window.event;
      var charCode = (typeof e.which == "number") ? e.which : e.keyCode;

      // Allow non-printable keys
      if (!charCode || charCode == 8 /* Backspace */) {
        return;
      }

      var typedChar = String.fromCharCode(charCode);

      // Allow numeric characters
      if (/\d/.test(typedChar)) {
        return;
      }

      // Allow the minus sign (-) if the user enters it first
      if (typedChar == "-" && this.value == "") {
        return;
      }

      // In all other cases, suppress the event
      return false;
    };
  }
  //default value & minimum value
  minimumvalue() {
    // console.log(event.target.value)

    //  = document.getElementById("inputBox");
    this.inputBox1 = document.getElementById("inputBox1");

    this.inputBox1.onkeypress = function (e) {
      e = e || window.event;
      var charCode = (typeof e.which == "number") ? e.which : e.keyCode;

      // Allow non-printable keys
      if (!charCode || charCode == 8 /* Backspace */) {
        return;
      }

      var typedChar = String.fromCharCode(charCode);

      // Allow numeric characters
      if (/\d/.test(typedChar)) {
        return;
      }

      // Allow the minus sign (-) if the user enters it first
      if (typedChar == "-" && this.value == "") {
        return;
      }

      // In all other cases, suppress the event
      return false;
    };
  }


  exit_publish() {
    if (this.isReadonly != true || this.isReadonly == null) {
      if (this.userrole != 'view') {
        let clone_send_values = _.cloneDeep(this.model.attributes);
        this.sendElement = clone_send_values.map((val, index) => {
          // val.element_data.element_order = index;
          val.element_order = index;
          return val;
        });
        let createdDate = new Date().toISOString();
        if (Array.isArray(this.sendElement)) {
          if (this.sendElement.length > 0) {
            this.sendElement = this.dataService.changingformelementpublish(this.sendElement, 'formbuilder');
          }
        }
        let Updatemodel: any = {
          user_id: this.userid.user_id,
          form_id: this.routes.snapshot.queryParamMap.get("Form_id"),
          form_data: this.sendElement,
          form_element_count: this.model.attributes.length,
          is_extend: this.is_extend,
          ext_form_data: this.extend_model.attributes,
          ext_form_element_count: this.extend_model.attributes.length,
        };
        console.log(Updatemodel);
        this.FDService.update_form_data(Updatemodel).subscribe((data) => {
          console.log(data);
          this.itemValue = [];
          // this.updatedvalue = JSON.parse(data["response_body"].form_data);
          // for (var i = 0; i < this.updatedvalue.length; i++) {
          //   var labelName = this.updatedvalue[i].element_data.label_text;

          //   this.itemValue.push(labelName);
          //   console.log(this.itemValue)
          // }
          // this.overlay = true;

        });
      }
      else if (this.userrole == 'view') {
        this.userRoleGlobal.permissionCheck();
      }
    }
    else {
      this.userRoleGlobal.permissionCheck();
    }
    this.exitconfirm = true;
  }

  changingformelementpublish() {
    for (let fi = 0; fi < this.sendElement.length; fi++) {
      //divider does not have values so skip
      if (this.sendElement[fi].element_type == "single_line_text" || this.sendElement[fi].element_type == "text_area" || this.sendElement[fi].element_type == "number") {
        if (this.sendElement[fi].element_data.default_value != undefined && this.sendElement[fi].element_data.default_value != "") {
          this.sendElement[fi].element_data.default_value = this.dataService.changeFormat(this.sendElement[fi].element_data.default_value);
        }
        if (this.sendElement[fi].element_data.element_name_alias != undefined && this.sendElement[fi].element_data.element_name_alias != "") {
          this.sendElement[fi].element_data.element_name_alias = this.dataService.changeFormat(this.sendElement[fi].element_data.element_name_alias);
        }
        if (this.sendElement[fi].element_data.label_text != undefined && this.sendElement[fi].element_data.label_text != "") {
          this.sendElement[fi].element_data.label_text = this.dataService.changeFormat(this.sendElement[fi].element_data.label_text);
        }
        if (this.sendElement[fi].element_data.placeholder_text != undefined && this.sendElement[fi].element_data.placeholder_text != "") {
          this.sendElement[fi].element_data.placeholder_text = this.dataService.changeFormat(this.sendElement[fi].element_data.placeholder_text);
        }
        if (this.sendElement[fi].element_data.use_conditions == true) {
          if (this.sendElement[fi].element_data.if_value != undefined && this.sendElement[fi].element_data.if_value != "") {
            this.sendElement[fi].element_data.if_value = this.dataService.changeFormat(this.sendElement[fi].element_data.if_value);
          }
        }
      }
      else if (this.sendElement[fi].element_type == "text_label") {
        if (this.sendElement[fi].element_data.element_name_alias != undefined && this.sendElement[fi].element_data.element_name_alias != "") {
          this.sendElement[fi].element_data.element_name_alias = this.dataService.changeFormat(this.sendElement[fi].element_data.element_name_alias);
        }
        if (this.sendElement[fi].element_data.label_text != undefined && this.sendElement[fi].element_data.label_text != "") {
          this.sendElement[fi].element_data.label_text = this.dataService.changeFormat(this.sendElement[fi].element_data.label_text);
        }
      }
      else if (this.sendElement[fi].element_type == "dropdown" || this.sendElement[fi].element_type == "checkbox" || this.sendElement[fi].element_type == "single_choice" || this.sendElement[fi].element_type == "multiple_choice") {
        if (this.sendElement[fi].element_data.element_name_alias != undefined && this.sendElement[fi].element_data.element_name_alias != "") {
          this.sendElement[fi].element_data.element_name_alias = this.dataService.changeFormat(this.sendElement[fi].element_data.element_name_alias);
        }
        if (this.sendElement[fi].element_data.label_text != undefined && this.sendElement[fi].element_data.label_text != "") {
          this.sendElement[fi].element_data.label_text = this.dataService.changeFormat(this.sendElement[fi].element_data.label_text);
        }
        let get_options = this.sendElement[fi].element_data.options;
        if (get_options.length > 0) {
          for (let ov = 0; ov < get_options.length; ov++) {
            if (this.sendElement[fi].element_data.options[ov].name != undefined && this.sendElement[fi].element_data.options[ov].name != "") {
              this.sendElement[fi].element_data.options[ov].name = this.dataService.changeFormat(this.sendElement[fi].element_data.options[ov].name);
            }
          }
        }
        if (this.sendElement[fi].element_data.use_conditions == true) {
          if (this.sendElement[fi].element_data.if_value != undefined && this.sendElement[fi].element_data.if_value != "") {
            this.sendElement[fi].element_data.if_value = this.dataService.changeFormat(this.sendElement[fi].element_data.if_value);
          }
        }
      }
      else if (this.sendElement[fi].element_type == "date") {
        if (this.sendElement[fi].element_data.element_name_alias != undefined && this.sendElement[fi].element_data.element_name_alias != "") {
          this.sendElement[fi].element_data.element_name_alias = this.dataService.changeFormat(this.sendElement[fi].element_data.element_name_alias);
        }
        if (this.sendElement[fi].element_data.label_text != undefined && this.sendElement[fi].element_data.label_text != "") {
          this.sendElement[fi].element_data.label_text = this.dataService.changeFormat(this.sendElement[fi].element_data.label_text);
        }
        if (this.sendElement[fi].element_data.use_conditions == true) {
          if (this.sendElement[fi].element_data.if_value != undefined && this.sendElement[fi].element_data.if_value != "") {
            this.sendElement[fi].element_data.if_value = this.dataService.changeFormat(this.sendElement[fi].element_data.if_value);
          }
        }
      }
      else if (this.sendElement[fi].element_type == "calculation") {
        if (this.sendElement[fi].element_data.element_name_alias != undefined && this.sendElement[fi].element_data.element_name_alias != "") {
          this.sendElement[fi].element_data.element_name_alias = this.dataService.changeFormat(this.sendElement[fi].element_data.element_name_alias);
        }
        if (this.sendElement[fi].element_data.label_text != undefined && this.sendElement[fi].element_data.label_text != "") {
          this.sendElement[fi].element_data.label_text = this.dataService.changeFormat(this.sendElement[fi].element_data.label_text);
        }
        if (this.sendElement[fi].element_data.calculation != undefined && this.sendElement[fi].element_data.calculation != "") {
          this.sendElement[fi].element_data.calculation = this.dataService.changeFormat(this.sendElement[fi].element_data.calculation);
        }
        if (this.sendElement[fi].element_data.calculation_display_value != undefined && this.sendElement[fi].element_data.calculation_display_value != "") {
          this.sendElement[fi].element_data.calculation_display_value = this.dataService.changeFormat(this.sendElement[fi].element_data.calculation_display_value);
        }
        if (this.sendElement[fi].element_data.default_value != undefined && this.sendElement[fi].element_data.default_value != "") {
          this.sendElement[fi].element_data.default_value = this.dataService.changeFormat(this.sendElement[fi].element_data.default_value);
        }
        if (this.sendElement[fi].element_data.use_conditions == true) {
          if (this.sendElement[fi].element_data.if_value != undefined && this.sendElement[fi].element_data.if_value != "") {
            this.sendElement[fi].element_data.if_value = this.dataService.changeFormat(this.sendElement[fi].element_data.if_value);
          }
        }
      }
      else if (this.sendElement[fi].element_type == "address") {
        if (this.sendElement[fi].element_data.element_name_alias != undefined && this.sendElement[fi].element_data.element_name_alias != "") {
          this.sendElement[fi].element_data.element_name_alias = this.dataService.changeFormat(this.sendElement[fi].element_data.element_name_alias);
        }
        if (this.sendElement[fi].element_data.label_text != undefined && this.sendElement[fi].element_data.label_text != "") {
          this.sendElement[fi].element_data.label_text = this.dataService.changeFormat(this.sendElement[fi].element_data.label_text);
        }
      }
    }
    return this.sendElement;
  }

  checking(tem) {
    console.log(tem);
  }
  //welddata
  addbutton() {
    this.show = !this.show;
  }
  // To delete the row of the table in weld wmata form
  deleterow(index) {
    var htmlElement = document.getElementById("myList") as HTMLTableElement;
    let tt = htmlElement.rows
    var table1 = document.querySelector('table').rows;
    let findIndex;
    for (let a = 0; a < tt.length; a++) {
      let getId = tt[a].getAttribute("id");
      let reqkey = this.idkey + index;
      if (getId == reqkey) {
        findIndex = a;
        tt[findIndex].remove();
        break;
      }
    }
    var table2 = document.querySelector('tbody.body');
    console.log(index);
    console.log(this.right)
    let copyFormLeft = _.cloneDeep(this.formContentleft);
    if (this.formContentleft.length > index) {
      this.formContentleft = [];
      copyFormLeft.splice(index, 1);
      this.formContentleft = copyFormLeft;
    }
    if (this.formContentright.length > index) {
      this.formContentright.splice(index, 1)
    }
  }
  // To add new row in tha table in weld wmata form
  add() {
    console.log("success");
    this.formShow = true;
    console.log(this.weld_FormStructure);
    this.setDefault();
  }
  // To split the user enetered table values of the row into two columns in weld wmata form
  splitarray(values) {
    let dataleft = {
      Weld: values.weldId,
      Repair: values.repairType,
      Entire: values.areaEntire,
    }
    let dataright = {
      Specific: values.areaSpecific,
      Interpretation: values.interpretation,
      Remarks: values.remarks,
    }
    this.formContentleft.push(dataleft);
    this.formContentright.push(dataright);

  }
  // To update the form values of weld wmata form.
  onSubmit(formdata) {
    this.formShow = false;
    console.log(formdata.value);
    const formValues = formdata.value;
    let cloneFormValue = _.cloneDeep(formValues);
    let convertUUID = this.custom_form_make_uuid(cloneFormValue);
    let convert_formStructure = this.defaultAPI_structure_maintain(formValues);
    let formValuesArray = [];
    formValuesArray.push(convertUUID)
    let finalArray = this.convertUUIDtoNormal(formValuesArray);
    this.splitarray(formValues);
  }
  defaultAPI_structure_maintain(formValues) {
    let defaultstructure = new weld_form_main();
    defaultstructure["weld_Id"] = formValues.weldId.toString()
    defaultstructure["area_Entire"] = formValues.areaEntire.toString()
    defaultstructure["interpretation"] = formValues.interpretation.toString()
    defaultstructure["repair"] = formValues.repairType.toString()
    defaultstructure["area_Specific"] = formValues.areaSpecific.toString()
    defaultstructure["remarks"] = formValues.remarks.toString()
    defaultstructure["element_uuid"] = this.dataService.generateUUID();
    return defaultstructure;
  }
  // To convert the values(which is in UUID) form API to normal values
  convertUUIDtoNormal(formValues) {
    let finalArray = [];
    let sampleObject = {
      weld_Id: "", area_Entire: "", interpretation: "", repair: "", area_Specific: "", remarks: "",
    }
    for (let i in formValues) {
      sampleObject.weld_Id = "";
      sampleObject.area_Entire = "";
      sampleObject.interpretation = "";
      sampleObject.repair = "";
      sampleObject.area_Specific = "";
      sampleObject.remarks = "";
      for (let key in formValues[i]) {
        for (let j in this.fieldsWeld) {
          if (this.fieldsWeld[j].element_uuid == key) {
            const name = this.fieldsWeld[j].table_name;
            switch (name) {
              case 'Weld ID':
                sampleObject.weld_Id = formValues[i][key];
                break;
              case 'Repair Type':
                sampleObject.repair = formValues[i][key];
                break;
              case 'Specific':
                sampleObject.area_Specific = formValues[i][key];
                break;
              case 'Remarks':
                sampleObject.remarks = formValues[i][key];
                break;
              case 'Entire':
                sampleObject.area_Entire = formValues[i][key];
                const value = formValues[i][key];
                if (value === true) {
                  sampleObject.area_Entire = "true";
                }
                else {
                  sampleObject.area_Entire = "";
                }
                break;
              case 'Interpretation':
                let getOptions = this.fieldsWeld[j].options;
                let index = this.fieldsWeld.findIndex((id) => id.element_uuid == formValues[i][key]);
                if (index > -1) {
                  sampleObject.interpretation = getOptions[index].name;
                }
                else {
                  sampleObject.interpretation = formValues[i][key];
                }
                break;
            }
          }
        }
      }
      let clone_sample_object = _.cloneDeep(sampleObject);
      finalArray.push(clone_sample_object);
    }
    return finalArray;
  }
  // To convert the normal values to UUID values(Before sending to server)
  custom_form_make_uuid(formValue) {
    const formFields = _.cloneDeep(this.fieldsWeld);

    for (let data in formValue) {
      switch (data) {
        case 'weldId':
          const index1 = formFields.findIndex((id) => id.table_name == "Weld ID");
          formValue[formFields[index1].element_uuid] = formValue[data];
          delete formValue[data];
          break;
        case 'repairType':
          const index2 = formFields.findIndex((id) => id.table_name == "Repair Type");
          formValue[formFields[index2].element_uuid] = formValue[data];
          delete formValue[data];
          break;
        case 'remarks':
          const index3 = formFields.findIndex((id) => id.table_name == "Remarks");
          formValue[formFields[index3].element_uuid] = formValue[data];
          delete formValue[data];
          break;
        case 'areaSpecific':
          const index4 = formFields.findIndex((id) => id.table_name == "Specific");
          formValue[formFields[index4].element_uuid] = formValue[data];
          delete formValue[data];
          break;
        case 'interpretation':
          const index5 = formFields.findIndex((id) => id.table_name == "Interpretation");
          formValue[formFields[index5].element_uuid] = formValue[data];
          // let options = formFields[index5].options;
          // let optionIndex = options.findIndex((id)=>id.name == formValue[data]);
          // if(optionIndex > -1){
          //   formValue[formFields[index5].element_uuid] = options[optionIndex].element_uuid;
          // }
          delete formValue[data];
          break;
        case 'areaEntire':
          const index6 = formFields.findIndex((id) => id.table_name == "Entire");
          let checkBoxBoolean = false;
          if (formValue[data] == true) {
            checkBoxBoolean = true;
          }
          formValue[formFields[index6].element_uuid] = checkBoxBoolean;
          delete formValue[data];
      }
    }
    return formValue;
  }
  // To set the variables to null in weld wmata form.
  setDefault() {
    let formsetnull = {
      weldId: "",
      areaEntire: "",
      interpretation: "",
      remarks: "",
      repairType: "",
      areaSpecific: "",
    }
    this.weld_FormStructure.setValue(formsetnull);
    this.weld_form_table = []
  }


  // alignmenprocess() {
  //   if (this.is_extend == true) {
  //     let check_condition = ["false", false, 0, "0"];
  //     let column_one = _.cloneDeep(this.model.attributes);
  //     let column_two = _.cloneDeep(this.extend_model.attributes);
  //     var annontationidDate = new Date().getTime();
  //     this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  //     console.log(this.model.attributes);
  //     console.log(this.extend_model.attributes);
  //     column_one = column_one.filter((data) => check_condition.includes(data.is_removed));
  //     column_two = column_two.filter((data) => check_condition.includes(data.is_removed));

  //     let elements_height = _.cloneDeep(this.element_details);

  //     if (column_one.length == column_two.length) {
  //       for (let i = 0; i < column_one.length; i++) {

  //         let temp_extend_holder = column_two.filter(ele => ele["element_data"].reference_id == column_one[i].element_uuid);
  //         let index = column_two.indexOf(temp_extend_holder[0]);
  //         console.log(index);
  //         let ele_one = this.element_details.filter(data => data.element_name == column_one[i].element_type);
  //         let ele_two = elements_height.filter(data => data.element_name == column_two[index].element_type);

  //         if (column_one[i].element_type == "multiple_choice" || column_one[i].element_type == "single_choice") {
  //           let option_list = column_one[i].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
  //           let option_list_length = option_list.length;
  //           let Option_to_add = 28 * option_list_length;
  //           if (ele_one[0].element_name == "multiple_choice" || ele_one[0].element_name == "single_choice") {
  //             ele_one[0].height = 40;
  //             ele_one[0].height += Option_to_add;
  //           }
  //         }
  //         if (column_two[index].element_type == "multiple_choice" || column_two[index].element_type == "single_choice") {
  //           let option_list = column_two[index].element_data.options.filter(ele => check_condition.includes(ele.is_removed));
  //           let option_list_length = option_list.length;
  //           let Option_to_add = 28 * option_list_length;
  //           if (ele_two[0].element_name == "multiple_choice" || ele_two[0].element_name == "single_choice") {
  //             ele_two[0].height = 40;
  //             ele_two[0].height += Option_to_add;
  //           }
  //         }

  //         if (ele_one[0].height >= ele_two[0].height) {
  //           column_one[i].height = ele_one[0].height;
  //           column_two[index].height = ele_one[0].height;
  //         } else {
  //           column_one[i].height = ele_two[0].height;
  //           column_two[index].height = ele_two[0].height;
  //         }
  //       }

  //       this.model.attributes = column_one;
  //       this.extend_model.attributes = column_two;
  //       console.log(JSON.stringify(column_one));
  //       console.log(JSON.stringify(column_two));
  //     }
  //     else {
  //       if (column_one.length != column_two.length) {
  //         if (column_one.length > column_two.length) {
  //           let clone_model = {
  //             element_type: "empty_cell",
  //             element_name: "empty_cell",
  //             element_uuid: '',
  //             element_id: 14,
  //             is_hidden: 0,
  //             is_removed: 0,
  //             width: 0,
  //             height: 0,
  //             version_number: 0,
  //             element_order: 0,
  //             element_data: {
  //               reference_id: column_one[column_one.length - 1].element_uuid
  //             }
  //           }
  //           clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
  //           this.extend_model.attributes.splice(column_one.length, 0, clone_model);
  //         } else {
  //           let clone_model = {
  //             element_type: "empty_cell",
  //             element_name: "empty_cell",
  //             element_uuid: '',
  //             element_id: 14,
  //             is_hidden: 0,
  //             width: 0,
  //             height: 0,
  //             is_removed: 0,
  //             version_number: 0,
  //             element_order: 0,
  //             element_data: {
  //               reference_id: column_two[column_two.length - 1].element_uuid
  //             }
  //           }
  //           clone_model.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
  //           this.model.attributes.splice(column_two.length, 0, clone_model);
  //         }

  //       }

  //     }
  //   }
  // }

  custom_form_click() {
    console.log('custom form click');
    this.userRoleGlobal.permissionCheck();
  }

}
