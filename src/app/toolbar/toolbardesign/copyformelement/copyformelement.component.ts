import {
  Component,
  OnInit,
  Input,
  Inject,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormsModule } from '@angular/forms';
import { FormdataService } from "src/app/formbuilder/services/formdata.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormlistService } from "src/app/formbuilder/services/formlist.service";
import { ValueService } from "src/app/value.service";
import { SharedService } from "src/app/shared/shared.service";
import { HeadertitleService } from "src/app/headertitle.service";
import { elementData, option } from "src/app/formbuilder/Model/controlmodel";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import { ToolbardesignComponent } from "../toolbardesign.component";
import { FormnameService } from "src/app/formname.service";
import { stringify, StringifyOptions } from "querystring";
import { FormService } from "src/app/form.service";
import { json } from "d3";
import { ToolbarlistService } from "../../services/toolbarlist.service";
import { ToolbardesignService } from "../../services/toolbardesign.service";
import { toJSDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar";
import { DataService } from "src/app/data.service";
import _, { entries } from "lodash";
import { DatePipe } from "@angular/common";
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  NativeDateAdapter,
} from "@angular/material/core";
import { NG_VALIDATORS } from "@angular/forms";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { weld_form_main } from "../../../commonshared/components/weldform/weldform_main.model";

const moment = _rollupMoment || _moment;
export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    var formatString = "YYYY-MM-DD";
    return moment(date).format(formatString);
  }
}
@Component({
  selector: "app-copyformelement",
  templateUrl: "./copyformelement.component.html",
  styleUrls: ["./copyformelement.component.css"],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
    },
    { provide: NG_VALIDATORS, useExisting: CopyformelementComponent, multi: true },
  ],
})
export class CopyformelementComponent implements OnInit {
  overlay = false;
  align = "start";
  itemValue: any[] = [];
  value: any[];
  formlist: string;
  formNameList = [];
  updatedvalue: any[] = [];
  checkedvalue: boolean = false;
  selectedValue: string = "Top";
  subText = "";
  mainText = "";
  operand1: number;
  operand2: number;
  operator = "";
  calculationString = "";
  answered = false;
  operatorSet = false;
  settingPage: boolean = false;
  false: any;
  useCondition: boolean;
  closeBox1 = false;
  itemValuesModelAtr: any;
  iconsPart: any[] = [];
  is_removed: boolean;
  remember: boolean;
  fillColorPart: any[] = [];
  strokeColorPart: any[] = [];
  opacity: any[] = [];
  lineWidth: any[] = [];
  addPositiveValues: boolean = false;
  activeGreen: any;
  finalArray: any = []
  finalArray1: any = []
  outputArray: any = []
  usecaseCopyArray: any = []
  custome_form_object = { "location": "", "decibels": "", "previouscondition": "", "flagforrReview": "", "Condition": "", "Comment": "" };
  columnsAdd: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  iconShape: string[] = [
    "Circle",
    "Octagon",
    "Square",
    "Triangle",
    "Star",
    "Diamond",
    "Flag",
    "Camera",
    "Arrow",
    "Callout",
    "Text",
  ];
  radioValue: number = 0;
  checkboxValue: number = 0;
  calculationAddFieldValue: any[] = [];
  change: any[];
  fill: string[];
  font: Array<string[]>;
  newreceive: Array<string[]>;
  @Output() childMessage = new EventEmitter<string>();
  @Input("useCondition") useCondition1: boolean;
  useConditionIntialCheck: boolean = false;
  show: boolean = false;
  previousFormNames: any;
  Form_id: any;
  form_name: any;
  removed: boolean;
  toolbarData: any;
  toolbarId: string;
  userid = this.encrptdecrpt.getItem("loggedIn") || "{}";
  subscription: Subscription;
  formData: any;
  elementId: any;
  showHtmlFields: boolean = false;
  unratedQuantity: number;
  csValue: number;
  currentArrayForm: any = [];
  currentArrayForm1: any = [];
  editFlag: any = true;
  elementFields: any;
  conditionSelected: any;
  csSelected: any;
  fieldQuantity: number;
  countedCheck: any;
  itemIndexNumber: any;
  payloadDate: string;
  displayDate: any;
  exite: any;
  finalArray2: any = [];
  totalElementQuantity: number = 0;
  DummyField: any;
  FieldResult: any;
  datas: any;
  editIndex: number;
  condition_field_name: any;
  current_if_value: any;
  current_if_do: any;
  current_if_state: any;
  activeIndex: any;
  defaultArray: any;
  @ViewChild('dropdownselect') dropdowncolors: ElementRef;
  formsList: any = [];
  button: boolean;
  inputBox: any;
  extend: any = 0;
  dummy: boolean = true;
  extend1: any;
  changestatus: boolean = false;
  element_details: any = [
    { element_name: "single_line_text", width: 261, height: 66 },
    {
      element_name: "text_area",
      width: 261,
      height: 113
    },
    {
      element_name: "number",
      width: 261,
      height: 66
    },
    {
      element_name: "text_label",
      width: 261,
      height: 37
    },
    {
      element_name: "empty_cell",
      width: 261,
      height: 0
    },
    {
      element_name: "Divider",
      width: 261,
      height: 30
    }
    , {
      element_name: "checkbox",
      element_alias_name: 'option 1',
      width: 261,
      height: 43
    }
    , {
      element_name: "dropdown",
      width: 261,
      height: 87
    }
    , {
      element_name: "single_choice",
      width: 261,
      height: 174
    }
    , {
      element_name: "multiple_choice",
      width: 261,
      height: 174
    }
    , {
      element_name: "date",
      width: 261,
      height: 91
    }, {
      element_name: "calculation",
      width: 261,
      height: 87
    },
    {
      element_name: "address",
      width: 261,
      height: 250
    }
  ];
  savebuttoncheck: boolean = false;
  timber_form_datas: any = [];
  backupFormData: any[] = [];
  backupExtendFormData: any[] = [];
  setformasdefault: boolean = false;
  data_allow_conditionT: any[] = ["true", true, 1, "1"];

  formContentleft :any[]=[];
  formContentright :any[]=[];
  output :boolean = false;
  // form structure
  weld_FormStructure: FormGroup = new FormGroup({
    weldId: new FormControl(),
    areaEntire: new FormControl(),
    interpretation: new FormControl(),
    repairType: new FormControl(),
    areaSpecific: new FormControl(),
    remarks: new FormControl()
  })
  weld_form_table : weld_form_main[] = []
  formShow: boolean = false;
  fieldsWeld: any;
  finalArrayWeld: any[]=[];
  clone_model_useconditions = {
    element_type: "empty_cell_useCase",
    element_name: "empty_cell_useCase",
    element_uuid: '',
    clone_uuid: '',
    element_id: 14,
    is_hidden: 0,
    is_removed: 0,
    width: 0,
    height: 40,
    version_number: 0,
    element_order: 0,
    element_data: {
      reference_id: ""
    }
  }
  useCaseEmptycellIds: any[] = []
	formFields_weld: any[] = ["checkbox", "single_choice", "date", "multiple_choice", "dropdown"];

  constructor(
    public FDService: FormdataService,
    public route: Router,
    private routes: ActivatedRoute,
    public service: FormlistService,
    public service1: FormService,
    public service4: ValueService,
    private sharedService: SharedService,
    private headerService: HeadertitleService,
    private dialog: MatDialogRef<CopyformelementComponent>,
    public messageService: FormnameService,
    private toolbarService: ToolbardesignService,
    private dataService: DataService,
    private datePipe: DatePipe,
    private dataService_doc: DataserviceService,
    private encrptdecrpt: EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.service1.sendformid(this.Form_id);
    console.log(this.userid);
    this.exite = this.data.exit;
    this.Form_id = this.data.Form_id;
    this.formlist = this.data.form;
    this.toolbarData = this.data.toolbarData;
    this.formData = _.cloneDeep(this.data.formData)
    if (this.formData != undefined) {
      this.setformasdefault = this.formData.is_default_flag;
    }
    this.toolbarId = this.data.toolbarId;
    this.elementId = this.data.elementId;
    this.editFlag = this.data.editFlag;
    this.formsList = this.data.formsList;
    // this.extend=this.data.Extend;
    this.extend = this.formData.is_extend;
    if (this.formData.is_extend == "0" || this.formData.is_extend == "false") {
      this.extend = 0;
    }
    console.log(this.data.formData);
    console.log(this.data.toolbarData);
    this.subscription = this.sharedService.getMessage().subscribe((message) => {
      switch (message) {
        case "Publish":
          this.publish();
          break;
        case "Build":
          this.build();

          break;
        case "Preview":
          break;
        default:
          break;
      }
    });
  }
  icon_object = {
    baseurl: "./assets/images/ProjectsScreen/",
    geticon: function (index) {
      //functions
      return this.baseurl + this.icons[index - 1];
    },
    icons: [
      "P3_FormBuilder-SingleLineTextIcon.png",
      "P3_FormBuilder-TextAreaIcon.png",
      "P3_FormBuilder-TextLabelIcon.png",
      "P3_FormBuilder-NumberIcon.png",
      "P3_FormBuilder-DropdownIcon.png",
      "P3_FormBuilder-MultipleChoiceIcon.png",
      "P3_FormBuilder-SingleChoiceIcon.png",
      "P3_FormBuilder-DatePickerIcon.png",
      "P3_FormBuilder-CalculationIcon.png",
      "P3_FormBuilder-AddressIcon.png",
      "P3_FormBuilder-DividerIcon.png",
    ],
  };

  onValChange(val: string) {
    this.selectedValue = val;
  }

  ngOnInit(): void {
    if (this.editFlag == true) {
      if (this.formData.form_data != "") {
        this.formData.form_data = (typeof this.formData.form_data) == 'string' ? JSON.parse(this.formData.form_data) : this.formData.form_data;
      }
      if (this.formData.ext_form_data != "") {
        this.formData.ext_form_data = (typeof this.formData.ext_form_data) == 'string' ? JSON.parse(this.formData.ext_form_data) : this.formData.ext_form_data;
      }
      this.defaultArray = _.cloneDeep(this.formData.form_data);
      this.usecaseCopyArray = _.cloneDeep(this.formData.form_data);
      this.backupFormData = _.cloneDeep(this.formData.form_data);
      this.backupExtendFormData = _.cloneDeep(this.formData.ext_form_data);
      this.change = this.formData.form_data;
      this.extend_model.attributes = this.formData.ext_form_data;
      let filtered_form = this.formsList.filter(ele => ele.form_id == this.formData.form_id);
      let newFormDataFelds: any = [];
      let extend_newFormDataFelds: any = [];
      // change json format form values
      if (filtered_form.length > 0) {
        let single_form_data = filtered_form[0].form_data;
        newFormDataFelds = this.jsonFormater(single_form_data);
        newFormDataFelds = this.merge_form_process(this.change,newFormDataFelds,'leftside');
        var weldFormPresent = false;
        let weldindex = newFormDataFelds.findIndex((id) => id.element_type == "uti-entry-field-WMATA_WELD");
          if(weldindex != -1){
             var weldForm = newFormDataFelds[weldindex];
             this.fieldsWeld = weldForm.element_data.fields;
             weldFormPresent = true;
          }
        this.formData.form_data = newFormDataFelds;
        this.formData.form_data = this.changespecial_character(this.formData.form_data);
        this.defaultArray = _.cloneDeep(this.formData.form_data);
        this.usecaseCopyArray = _.cloneDeep(this.formData.form_data);
        this.change = this.formData.form_data;
        if (filtered_form[0].is_extend == 1) {
          let multicolumn_form_data = filtered_form[0].ext_form_data;
          extend_newFormDataFelds = this.jsonFormater(multicolumn_form_data);
          let get_ext_form_data = this.formData.ext_form_data;
          extend_newFormDataFelds = this.merge_form_process(get_ext_form_data, extend_newFormDataFelds, 'rightside');
          this.formData.ext_form_data = extend_newFormDataFelds;
          if(weldFormPresent == true){
            extend_newFormDataFelds.push(weldForm)
          }
          this.formData.ext_form_data = this.changespecial_character(this.formData.ext_form_data);
          let merge_two_side_form_value = [...this.formData.form_data, ...this.formData.ext_form_data];
          this.defaultArray = _.cloneDeep(merge_two_side_form_value);
          this.usecaseCopyArray = _.cloneDeep(merge_two_side_form_value);
          this.extend_model.attributes = this.formData.ext_form_data;
        }
      }
      // common function added
      // if(filtered_form.length > 0){
      //   if (Array.isArray(filtered_form[0].form_data) == false) {
      //     newFormDataFelds = JSON.parse(filtered_form[0].form_data)
      //   } 
      //   else {
      //     newFormDataFelds = filtered_form[0].form_data
      //   }
      // }


      // common function added
      // this.change.forEach(element => {
      //   var FieldFind = newFormDataFelds.filter(ele => ele['element_uuid'] == element['element_uuid']);
      //   //Fieldfind ==> overall form fields from form builder
      //   //element ==> edited form fields for the annotation 
      //   if (FieldFind.length > 0) {
      //     if (FieldFind[0].element_type == 'single_choice' || FieldFind[0].element_type == 'dropdown') {
      //       FieldFind[0].element_data.options.forEach(element1 => {
      //         element1.default = false
      //       });
      //       let defaultOptionValue = element.element_data.options.filter((ele => ele.default == true))
      //       if (defaultOptionValue.length > 0) {
      //         var currentOption = FieldFind[0].element_data.options.filter((ele => ele.element_uuid == defaultOptionValue[0].element_uuid))
      //         currentOption[0].default = true;
      //       }
      //     } else if (FieldFind[0].element_type == 'multiple_choice' || FieldFind[0].element_type == 'checkbox') {

      //       FieldFind[0].element_data.options.forEach(element1 => {
      //         element1.default = false
      //       });
      //       let UCitemDefault = element.element_data.options.filter((ele => ele.default == true))
      //       UCitemDefault.forEach(element2 => {
      //         var currentOption = FieldFind[0].element_data.options.filter((ele => ele.element_uuid == element2.element_uuid))
      //         currentOption[0].default = true;
      //       });
      //     } else if (FieldFind[0].element_type == 'date') {
      //       if (element.element_data.default_date_time != "" && element.element_data.default_date_time != "none" && element.element_data.default_date_time != "current") {
      //         FieldFind[0].element_data.default_value = new Date(element.element_data.default_date_time).toISOString();
      //         FieldFind[0].element_data.default_date_time = new Date(element.element_data.default_date_time).toISOString();
      //       } 
      //       else if (FieldFind[0].element_data.default_date_time != "") {
      //         if (FieldFind[0].element_data.default_date_time == "none" || FieldFind[0].element_data.default_date_time == "current") {
      //           //FieldFind[0].element_data.default_value = this.assignDates(FieldFind[0].element_data.default_date_time)
      //         }
      //           else {
      //             FieldFind[0].element_data.default_date_time = new Date(FieldFind[0].element_data.default_date_time).toISOString();
      //           }
      //       }
      //     }
      //     else if (FieldFind[0].element_type == 'uti-entry-field') {
      //       FieldFind[0].element_data.default_values = element.element_data['default_values']
      //     }
      //     else if (FieldFind[0].element_type == 'uti-entry-field-WMATA' || FieldFind[0].element_type == 'uti-entry-field-TIMBER') {
      //       FieldFind[0].element_data.default_values = element.element_data['default_values']
      //     }
      //     else if (FieldFind[0].element_type == 'address') {

      //       FieldFind[0].element_data.street_address1 = element.element_data.street_address1
      //       FieldFind[0].element_data.city = element.element_data["city"]
      //       FieldFind[0].element_data.state = element.element_data["state"]
      //       FieldFind[0].element_data.zip = element.element_data["zip"]
      //       FieldFind[0].element_data.street_address2 = element.element_data.street_address2
      //     } else {
      //       FieldFind[0].element_data.default_value = element.element_data.default_value
      //     }
      //   }
      // })



      // convert special character form data
      // common function added
      // let final_form_datas = this.formData.form_data;
      // if(final_form_datas != null && final_form_datas!=undefined && final_form_datas.length>0){
      //   let get_response_form_data = final_form_datas;
      //   let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data,'formbuilderfieldsview');
      //   this.formData.form_data = get_change_char_sptoquotes;
      // }
      // common function added
      // this.defaultArray = _.cloneDeep(this.formData.form_data);
      // this.usecaseCopyArray = _.cloneDeep(this.formData.form_data);
      // this.change = this.formData.form_data;
      // common function added
      // if(this.formData.is_extend){
      //   if(this.formData.ext_form_data){
      //     let final_ext_form_datas = this.formData.ext_form_data;
      //     if(final_ext_form_datas != null && final_ext_form_datas != undefined){
      //       if(Array.isArray(final_ext_form_datas)){
      //         let get_response_form_data = final_ext_form_datas;
      //         let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data,'formbuilderfieldsview');
      //         this.formData.ext_form_data = get_change_char_sptoquotes;
      //       }else{
      //         final_ext_form_datas . JSON.parse(final_ext_form_datas);
      //         let get_response_form_data = final_ext_form_datas;
      //         let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data,'formbuilderfieldsview');
      //         this.formData.ext_form_data = get_change_char_sptoquotes;
      //       }
      //     }

      //   }
      // }
      if (this.change.length > 0) {
        for (let v = 0; v < this.change.length; v++) {
          if (this.change[v].element_type == "uti-entry-field") {
            for (let k = 0; k < this.change[v].element_data.fields.length; k++) {
              if (this.change[v].element_data.fields[k].element_type == "single_choice") {
                for (let j = 0; j < this.change[v].element_data.fields[k].element_data.options.length; j++) {
                  this.outputArray.push({ 'id': this.change[v].element_data.fields[k].element_data.options[j].element_uuid, 'key': this.change[v].element_data.fields[k].element_data.options[j].name, 'value': 0 })
                }
              }
            }
            this.elementFields = this.change[v].element_data.fields
            if (this.change[v].element_data.hasOwnProperty('default_values')) {
              var tt = ""
              this.finalArray = this.change[v].element_data.default_values
              this.displayArryChange(this.change[v].element_data.fields, this.change[v].element_data.default_values)
            }
          }
          if (this.change[v].element_type == "uti-entry-field-WMATA") {
            // make default values array of json

            if (this.change[v].element_data.hasOwnProperty('default_values') && this.change[v].element_data.default_values != undefined && this.change[v].element_data.default_values != "") {
              let get_default_value = this.change[v].element_data.default_values;
              let get_element_fields = this.change[v].element_data['fields']
              this.UTIEntry_field_Wmata(get_element_fields, get_default_value);
            }
            else {
              // if default values is empty purpose
              this.finalArray2 = [];
            }

          }
          else if(this.change[v].element_type == "uti-entry-field-WMATA_WELD"){
            if (this.change[v].element_data.hasOwnProperty('default_values') && this.change[v].element_data.default_values != undefined && this.change[v].element_data.default_values != "") {
              let get_default_value = this.change[v].element_data.default_values;
              const fields = this.change[v].element_data.fields;
              this.fieldsWeld = fields; 
              let weldArray = this.convertUUIDtoNormal(get_default_value);
              this.splitarray(weldArray);
            }
            //  weldform = true;
            //  const copyweldform =_.cloneDeep(this.modelFieldsForm[v]);
            //  this.copyweldForm = copyweldform;
            //  const fields = this.modelFieldsForm[v].element_data.fields;
            //  this.fieldsWeld = fields; 
          }
          else if(this.change[v].element_type == "uti-entry-field-TIMBER"){
            console.log(this.usecaseCopyArray);
            this.timber_form_datas = _.cloneDeep(this.usecaseCopyArray);
          }

          if (this.change[v].element_data.label_text == "Total Element Quantity") {
            this.totalElementQuantity = Number(this.change[v].element_data.default_value);
            this.htmlcalculation();
          }
          if (this.change[v].element_type == "date") {
            if (this.change[v].element_data.default_date_time != "" && this.change[v].element_data.default_date_time != "none" && this.change[v].element_data.default_date_time != "current") {
              this.change[v].element_data.default_date_time = new Date(this.change[v].element_data.default_date_time).toISOString();
            }
          }
        }
      }
      // common function added
      // if(this.formData.is_extend==1)
      // {
      //   if(this.formData.ext_form_data != null){
      //     if(typeof this.formData.ext_form_data==='string')
      //     {
      //       this.extend_model.attributes=JSON.parse(this.formData.ext_form_data);
      //     }
      //     else
      //     {
      //       this.extend_model.attributes=this.formData.ext_form_data;
      //     }
      //   }

      // }
      this.process_use_conditions();
      this.FormulaCalc();
      if (this.formData.is_extend == 1) {
        this.alignmenprocess();
        this.checkAlign_usecase();
      }
    } else {
      this.form_name = this.routes.snapshot.queryParamMap.get("Form_name");
      //this.headerService.setTitle(this.form_name);
      //get_form elelmrnt structure
      this.FDService.get_form_elements_structure().subscribe((data) => {
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

      this.service.get_form_data(this.Form_id).subscribe((data) => {
        if (
          data.response_body.form_listing[0].form_data != null &&
          data.response_body.form_listing[0].form_data != "null"
        ) {

          if (data.response_body.form_listing[0].form_data != null) {
            let final_form_datas = this.formData.form_data;
            if (Array.isArray(final_form_datas)) {
              if (final_form_datas != undefined && final_form_datas.length > 0) {
                let get_response_form_data = final_form_datas;
                let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data, 'formbuilderfieldsview');
                data.response_body.form_listing[0].form_data = get_change_char_sptoquotes;
              }
            } else {
              final_form_datas = JSON.parse(final_form_datas);
              if (final_form_datas != undefined && final_form_datas.length > 0) {
                let get_response_form_data = final_form_datas;
                let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data, 'formbuilderfieldsview');
                data.response_body.form_listing[0].form_data = get_change_char_sptoquotes;
              }
            }

          }

          if (data.response_body.form_listing[0].is_extend) {
            if (data.response_body.form_listing[0].ext_form_data) {
              let final_ext_form_datas = data.response_body.form_listing[0].ext_form_data;
              if (final_ext_form_datas != null) {
                if (Array.isArray(final_ext_form_datas)) {
                  let get_response_form_data = final_ext_form_datas;
                  let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data, 'formbuilderfieldsview');
                  data.response_body.form_listing[0].ext_form_data = get_change_char_sptoquotes;
                } else {
                  final_ext_form_datas = JSON.parse(final_ext_form_datas);
                  let get_response_form_data = final_ext_form_datas;
                  let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data, 'formbuilderfieldsview');
                  data.response_body.form_listing[0].ext_form_data = get_change_char_sptoquotes;
                }
              }
            }
          } 
          this.model.attributes = data.response_body.form_listing[0].form_data;
          var weldFormPresent = false;
          let weldindex = this.model.attributes.findIndex((id) => id.element_type == "uti-entry-field-WMATA_WELD");
          if(weldindex != -1){
             var weldForm = this.model.attributes[weldindex];
             this.fieldsWeld = weldForm.element_data.fields;
             weldFormPresent = true;
          }
          var currentArrayForm = data.response_body.form_listing[0];
          if (data.response_body.form_listing[0].is_extend == 1) {
            if (data.response_body.form_listing[0].ext_form_data != null) {
              if (Array.isArray(data.response_body.form_listing[0].ext_form_data)) {
                this.extend_model.attributes = data.response_body.form_listing[0].ext_form_data;
              } else {
                this.extend_model.attributes = JSON.parse(data.response_body.form_listing[0].ext_form_data);
              }
              var merge_forms=[...this.model.attributes ,...this.extend_model.attributes];
              this.usecaseCopyArray= _.cloneDeep(merge_forms);
              if(weldFormPresent == true){
                this.extend_model.attributes.push(weldForm);
              }
            }
          }
          else {
            this.usecaseCopyArray = _.cloneDeep(this.model.attributes);
          }
          this.change = this.model.attributes;
          this.defaultArray = _.cloneDeep(this.formData.form_data);
          currentArrayForm.form_data = this.change;
          this.currentArrayForm1.push(currentArrayForm);
          if (this.change.length > 0) {
            for (let v = 0; v < this.change.length; v++) {
              if (this.change[v].element_data.label_text == "Total Element Quantity") {
                this.totalElementQuantity = Number(this.change[v].element_data.default_value);
                this.htmlcalculation();
              }
              if (this.change[v].element_type == "uti-entry-field") {
                for (let k = 0; k < this.change[v].element_data.fields.length; k++) {
                  if (this.change[v].element_data.fields[k].element_type == "single_choice") {
                    for (let j = 0; j < this.change[v].element_data.fields[k].element_data.options.length; j++) {

                      this.outputArray.push({ 'id': this.change[v].element_data.fields[k].element_data.options[j].element_uuid, 'key': this.change[v].element_data.fields[k].element_data.options[j].name, 'value': 0 })
                    }
                  }
                }
                this.elementFields = this.change[v].element_data.fields
              }
              else if (this.change[v].element_type == "uti-entry-field-TIMBER") {
                console.log(this.usecaseCopyArray);
                this.timber_form_datas = _.cloneDeep(this.usecaseCopyArray);
              }
            }
          }
        }
        if (data.response_body.form_listing[0].ext_form_data != null && data.response_body.form_listing[0].ext_form_data != "null" && this.extend) {
          if (Array.isArray(data.response_body.form_listing[0].ext_form_data)) {
            this.extend_model.attributes = data.response_body.form_listing[0].ext_form_data;
          } else {
            this.extend_model.attributes = JSON.parse(data.response_body.form_listing[0].ext_form_data);
          }
          this.process_use_conditions();
          this.FormulaCalc();
          this.alignmenprocess();
          this.checkAlign_usecase();
          var status = data["response_code"];
          this.datas = [...this.change, ...this.extend_model.attributes]

          for (var i = 0; i < this.datas.length; i++) {
            if (this.datas[i].element_type == "number") {
              this.calculationAddFieldValue.push(
                this.datas[i].element_type
              );
            }
          }
          for (var i = 0; i < this.datas.length; i++) {
            this.itemValue.push(this.datas[i].element_data.label_text);
          }
        }
        else {
          var status = data["response_code"];

          for (var i = 0; i < this.model.attributes.length; i++) {
            if (this.model.attributes[i].element_type == "number") {
              this.calculationAddFieldValue.push(
                this.model.attributes[i].element_type
              );
            }
          }
          for (var i = 0; i < this.model.attributes.length; i++) {
            this.itemValue.push(this.model.attributes[i].element_data.label_text);
          }

        }
        // this.process_use_conditions();
        // this.FormulaCalc();
      });
    }
  }
  
  //Jose added
  assignDates(option) {
    console.log(option);
    if (option == "current") {
      return new Date();
    }
    else if (option == "none") {
      return;
    }
    else {

      if (option != undefined && option.includes("-")) {
        let final = option.split("T")
        let yourDate: Date = new Date(final[0] + " 12:00:00.000Z");
        // yourDate.setDate(yourDate.getDate() + 1);
        // let datevalue = this.datePipe.transform(final[0], 'yyyy-MM-dd').toString()
        // console.log("changeValueToLocalTime", datevalue)
        return yourDate;
      }
      return option;
    }
  }

  //options for dropdown singlechoice
  Options: option = {
    name: "",
  };

  toggle = false;
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
    attributes: this.modelFields,
  };
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  build() {
    document.querySelector("#FAQ");
  }
  // form element publish section
  added: number = 0;
  publish() {
    if (this.editFlag == true) {

      this.exite = false;
      console.log(this.exite)
      var arrayForms = [];
      if(this.finalArrayWeld.length > 0){
        let weldIndex = this.change.findIndex((id) => id.element_type == "uti-entry-field-WMATA_WELD");
        if(weldIndex != -1){
          var weldForm = this.change[weldIndex];;
          if(weldForm.element_data.hasOwnProperty('default_values')){
            weldForm.element_data.default_values = _.cloneDeep(this.finalArrayWeld);
            this.finalArrayWeld = []
          }
        }
        let weldIndex1 = this.extend_model.attributes.findIndex((id) => id.element_type == "uti-entry-field-WMATA_WELD");
        if(weldIndex1 != -1){
          this.extend_model.attributes.splice(weldIndex1,1)
        }       
      }
      this.formData.form_data = this.change;
      if (this.extend == 1) {
        this.formData.ext_form_data = this.extend_model.attributes;
      }
      arrayForms.push(this.formData);
      getUpdatedToolbarData = this.toolbarData.element_data

      //REplace the updated form with form list data of hte toolbar icon 
      let formIndex = getUpdatedToolbarData.forms_list_data.findIndex(item => item.form_id == this.data.Form_id);
      if (formIndex > -1) {
        getUpdatedToolbarData.forms_list_data[formIndex] = this.formData;

      }
      else {
        getUpdatedToolbarData.forms_list_data = arrayForms;
      }

      console.log(arrayForms);
      // check set as default from selected or not
      if (getUpdatedToolbarData.hasOwnProperty('forms_list_data')) {
        if (getUpdatedToolbarData.forms_list_data != undefined && getUpdatedToolbarData.forms_list_data.length > 0) {
          for (let jk = 0; jk < getUpdatedToolbarData.forms_list_data.length; jk++) {
            if (this.setformasdefault == true && getUpdatedToolbarData.forms_list_data[jk].form_id == this.formData.form_id) {
              getUpdatedToolbarData.forms_list_data[jk].is_default_flag = true;
            }

          }
          var checktick = getUpdatedToolbarData.forms_list_data.filter(res => res.is_default_flag == true)
          if (checktick.length > 1) {
            for (let j = 0; j < getUpdatedToolbarData.forms_list_data.length; j++) {
              if (this.setformasdefault == true && getUpdatedToolbarData.forms_list_data[j].form_id == this.formData.form_id) {
                getUpdatedToolbarData.forms_list_data[j].is_default_flag = true;
              } else {
                getUpdatedToolbarData.forms_list_data[j].is_default_flag = false;
              }
            }
          }
        }
      }
      var pushItem = [];
      pushItem.push(getUpdatedToolbarData);
      console.log(pushItem)
      let UpdateToolbarModelNew: any = {
        user_id: this.userid.user_id,
        toolbar_id: this.toolbarId,
        toolbar_data: pushItem,
        toolbar_element_count: 1,
      };
      this.dialog.close(false);
      this.messageService.sendForm(getUpdatedToolbarData);
    } else {
      if(this.extend==1)
      {
        if(this.finalArrayWeld.length > 0){
          let weldIndex = this.change.findIndex((id) => id.element_type == "uti-entry-field-WMATA_WELD");
          if(weldIndex != -1){
            var weldForm = this.change[weldIndex];;
            if(weldForm.element_data.hasOwnProperty('default_values')){
              weldForm.element_data.default_values = _.cloneDeep(this.finalArrayWeld);
              this.finalArrayWeld = []
            }
          }
          let weldIndex1 = this.extend_model.attributes.findIndex((id) => id.element_type == "uti-entry-field-WMATA_WELD");
          if(weldIndex1 != -1){
            this.extend_model.attributes.splice(weldIndex1,1)
          }       
        }
        let Updatemodel: any = {
          user_id: this.userid.user_id,
          form_id: this.Form_id,
          form_data: this.model.attributes,
          Ext_form_data: this.extend_model.attributes,
          form_element_count: this.model.attributes.length,
        };
        console.log(Updatemodel);
      }
      else {
        let Updatemodel: any = {
          user_id: this.userid.user_id,
          form_id: this.Form_id,
          form_data: this.model.attributes,
          form_element_count: this.model.attributes.length,
        };
        console.log(Updatemodel);
      }

      // localStorage.setItem("formid", this.Form_id);
      this.encrptdecrpt.setItem("formid", this.Form_id);//security

      let UCitem = this.toolbarData.filter((ele => ele.element_uuid == this.elementId))
      var getUpdatedToolbarData = UCitem[0].element_data;
      let arrayForms = [];
      if (getUpdatedToolbarData.hasOwnProperty('forms_list_data')) {
        if (getUpdatedToolbarData.forms_list_data != undefined && getUpdatedToolbarData.forms_list_data.length > 0) {
          var selectedFormId = this.formData.form_id;
          var alreadyInRemoveId = getUpdatedToolbarData.forms_list_data.filter(
            (data) => {
              return data.form_id != selectedFormId;
            }
          );

          arrayForms = alreadyInRemoveId;
        }
      }

      var yu = this.toolbarData
      console.log(this.formData.form_data);
      let form_data =
        this.formData.form_data != undefined && this.formData.form_data != ""
          ? JSON.parse(this.formData.form_data)
          : {};
      if (this.extend == 1) {
        this.formData.ext_form_data != undefined && this.formData.ext_form_data != ""
          ? JSON.parse(this.formData.ext_form_data)
          : {};
      }
      this.formData.form_data = this.change;
      this.formData.ext_form_data = this.extend_model.attributes;
      arrayForms.push(this.formData);
      getUpdatedToolbarData.forms_list_data = arrayForms;
      console.log(arrayForms);
      // check set as default from selected or not
      if (getUpdatedToolbarData.hasOwnProperty('forms_list_data')) {
        if (getUpdatedToolbarData.forms_list_data != undefined && getUpdatedToolbarData.forms_list_data.length > 0) {
          for (let jk = 0; jk < getUpdatedToolbarData.forms_list_data.length; jk++) {
            if (this.setformasdefault == true && getUpdatedToolbarData.forms_list_data[jk].form_id == this.formData.form_id) {
              getUpdatedToolbarData.forms_list_data[jk].is_default_flag = true;
            }

          }
          var checktick = getUpdatedToolbarData.forms_list_data.filter(res => res.is_default_flag == true)
          if (checktick.length > 1) {
            for (let j = 0; j < getUpdatedToolbarData.forms_list_data.length; j++) {
              if (this.setformasdefault == true && getUpdatedToolbarData.forms_list_data[j].form_id == this.formData.form_id) {
                getUpdatedToolbarData.forms_list_data[j].is_default_flag = true;
              } else {
                getUpdatedToolbarData.forms_list_data[j].is_default_flag = false;
              }
            }
          }
        }
      }

      var pushItem = [];
      pushItem.push(getUpdatedToolbarData);
      let UpdateToolbarModelNew: any = {
        user_id: this.userid.user_id,
        toolbar_id: this.toolbarId,
        toolbar_data: pushItem,
        toolbar_element_count: 1,
      };
      console.log(JSON.stringify(UpdateToolbarModelNew));
      // this.toolbarService
      //   .update_toolbar_data(UpdateToolbarModelNew)
      //   .subscribe((res) => {
      //     console.log(res);
      //     this.messageService.getaddFormRefresh.emit("AddForm");
      //   });
      this.dialog.close(false);
      this.messageService.sendForm(getUpdatedToolbarData);
    }
  }
  //public overlay close
  closeBoxOverlay() {
    this.overlay = false;
  }
  // drop point
  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      if (event.dropEffect === "copy")
        event.data.element_name =
          event.data.element_type + "-" + new Date().getTime();
      let index = event.index;

      if (typeof index === "undefined") {
        index = list.length;
      }
      list.splice(index, 0, event.data);
    }
  }
  simpleClone(obj: any) {
    return Object.assign({}, obj);
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    if (effect === "move") {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }
  onDragCanceled(event: DragEvent) { }

  onDragover(event: DragEvent) { }

  onDragStart(event: DragEvent) { }

  onDragEnd(event: DragEvent, labelText, elementType) {
    this.itemValue.push(labelText);

    if (elementType == "number") {
      this.calculationAddFieldValue.push(elementType);
    }
  }

  onDraggableCopied(event: DragEvent) { }

  onDraggableLinked(event: DragEvent) { }
  //form element click
  formelementClick(item, labelText, elementType) {
    if (elementType == "number") {
      this.calculationAddFieldValue.push(elementType);
    }
    this.itemValue.push(labelText);
    let _item = this.simpleClone(item);
    let item1 = { ..._item };
    let item2 = JSON.stringify(item1);
    let item3 = JSON.parse(item2);
    this.model.attributes.splice(this.model.attributes.length, 0, item3);
    // this.model.attributes.push(item)
  }
  //display section
  showProperties(item) {
    this.itemValuesModelAtr = item;
    this.useConditionIntialCheck = false;
    this.addPositiveValues = false;
    this.activeGreen = -1;
    this.iconsPart = [];
    this.fillColorPart = [];
    this.strokeColorPart = [];
    this.opacity = [];
    this.lineWidth = [];

    // toggleVisibility(e, toolbar_id,project_id){
    //   this.toolbarid = toolbar_id;
    //   this.projectid=project_id;
    //   this.remember = e.target.checked;
    //
    //   if (this.remember == true) {
    //
    //   }
    // }

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

      // if(this.itemValuesModelAtr.element_type=='dropdown'||'single_choice'||'multiple_choice'){
      //   this.addPositiveValues=true;
      // }
    }
    this.closeBox1 = true;
    this.toggle = false;
    this.model.attributes.forEach((it) => {
      it != item ? (it.toggle = false) : (it.toggle = !item.toggle);
    });
  }

  dateOnly(value) {
    this.addPositiveValues = false;
  }

  showOptions: any = "";

  addOption(optionValue) {
    this.activeGreen = optionValue;
    this.addPositiveValues = true;
    for (
      var i = 0;
      i < this.itemValuesModelAtr.element_data.options.length;
      i++
    ) {
      if (optionValue == i) {
        this.showOptions = this.itemValuesModelAtr.element_data.options[i];
      }
    }
  }

  //add valuse for dropdoem etc
  addValue(options) {
    var lengthFind = options.length + 1;
    this.Options = {
      icon: "icon" + lengthFind,
      name: "option" + lengthFind,
      calculated_value: 0,
      default: false,
    };
    options.push(this.Options);
  }

  //copy field ffrom setttings
  copyField(item) {
    let _item = this.simpleClone(item);
    _item.toggle = false;
    this.modelFields.push(_item);
  }
  //remove popup
  // change(value){
  //   this.model.attributes.splice(value, 1)
  // }
  dirtyClone(item) {
    let item1 = JSON.stringify(item);
    let item2 = JSON.parse(item1);
    return item2;
  }

  //for calculator
  insertChar(key: string) {
    this.mainText += key;
  }

  allClear() {
    this.mainText = "";
    this.subText = "";
    this.operatorSet = false;
  }

  //   getAnswer() {
  //     this.calculationString = this.mainText;
  //     this.operand2 = parseFloat(this.mainText.split(this.operator)[1]);
  //     if (this.operator === "/") {
  //       this.subText = this.mainText;
  //       this.mainText = (this.operand1 / this.operand2).toString();
  //       this.subText = this.calculationString;

  //     } else if (this.operator === "*") {
  //       this.subText = this.mainText;
  //       this.mainText = (this.operand1 * this.operand2).toString();
  //       this.subText = this.calculationString;

  //     this.answered = true;
  //   }
  // }

  // closeBox() {
  //   this.settingPage = true;
  // }
  showsettingPage() {
    this.settingPage = false;
  }
  s(i) { }

  togglevar(useCondition: boolean) {
    this.useCondition1 = !useCondition;
  }

  togglevisibility(event: any, index, value) {
    this.radioValue = index;
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
  closeBox() {
    // if (this.toolbarData.element_data != undefined) {
    //   var getUpdatedToolbarData = this.toolbarData.element_data
    //   // var arrayForms = []
    //   // this.change = this.defaultArray
    //   // this.formData.form_data = this.change;
    //   // arrayForms.push(this.formData);
    //   // getUpdatedToolbarData.forms_list_data = arrayForms;
    //   this.change = this.defaultArray
    //   this.formData.form_data = this.change;

    //   let formIndex = getUpdatedToolbarData.forms_list_data.findIndex(item => item.form_id == this.data.Form_id);
    //     if (formIndex != -1) {
    //       getUpdatedToolbarData.forms_list_data[formIndex] = this.formData;
    //     }
    //     else {
    //       getUpdatedToolbarData.forms_list_data = this.formData;
    //     }

    //   this.messageService.sendForm(getUpdatedToolbarData);
    //   this.dialog.close(true);
    // } else {
    this.dialog.close(true);
  }




  formatChange(item, name) {

    item.element_data.default_value = name;
    // var sh = cp

  }
  formatChange1(item, name) {

    //item.element_data.default_value = this.dataService.changeFormat(name);
    var yy = this.currentArrayForm1
    // var sh = cp
  }
  htmlAddClick() {
    this.showHtmlFields = true;
    this.itemIndexNumber = -1;
    this.fieldQuantity = null
    this.conditionSelected = ""
    this.csSelected = ""
    this.countedCheck = false;
    this.obj = {}
  }
  obj = {}
  obj1 = {
    "id": "",
    "condition_code": "",
    "cs": "",
    "quantity": 0,
    "not": false,
    "item_id": 0
  }
  htmlFieldValue(id, item, value, checked) {
    if (item == "condition_code") {
      this.obj[id] = value
    } else if (item == "cs") {
      this.obj[id] = value
    } else if (item == "quantity") {
      this.obj[id] = Number(value)
    } else {
      if (checked == false) {
        if (this.obj.hasOwnProperty(id)) {
          delete this.obj[id];
        }
      } else {
        this.obj[id] = value
      }

    }
  }
  htmlDoneClick(item2, item1, index) {
    this.savebuttoncheck = false;
    if (index != -1) {
      this.showHtmlFields = false;
      item1.default_values = this.finalArray
      this.useConditionChange(item2, item2.element_uuid, this.finalArray, '')
      this.finalArray1 = [];
      var item = item1.fields
      this.displayArryChange(item, this.finalArray)
    } else {
      this.showHtmlFields = false;
      this.finalArray.push(this.obj)
      this.finalArray = _.cloneDeep(this.finalArray)
      item1.default_values = this.finalArray
      this.useConditionChange(item2, item2.element_uuid, this.finalArray, '')
      this.finalArray1 = [];
      var item = item1.fields
      this.displayArryChange(item, this.finalArray)
    }
  }
  htmlAddClick1() {
    this.showHtmlFields = true;
    //reset the cusotme object
    this.custome_form_object.location = "";
    this.custome_form_object.decibels = "";
    this.custome_form_object.previouscondition = "";
    this.custome_form_object.flagforrReview = "";
    this.custome_form_object.Condition = "";
    this.custome_form_object.Comment = "";
    this.itemIndexNumber = -1;
  }

  updateAttributesform(item, value, fields) {
    this.savebuttoncheck = true;
    if (item == "Location") {
      this.custome_form_object.location = value;
    }
    else if (item == "Decibels") {
      this.custome_form_object.decibels = value;
    }
    else if (item == "PC") {
      if (value == true) {
        this.custome_form_object.previouscondition = 'Yes';
      }
      else {
        this.custome_form_object.previouscondition = 'No';
      }
    }
    else if (item == "Flag") {
      if (value == true) {
        this.custome_form_object.flagforrReview = 'Yes';
      }
      else {
        this.custome_form_object.flagforrReview = 'No';
      }
    }
    else if (item == "Condition") {
      // this.custome_form_object.Condition = value;
      let get_field_option = fields.element_data.options;
      let find_name_index = get_field_option.findIndex((uuid) => uuid.element_uuid == value);
      if (find_name_index > -1) {
        this.custome_form_object.Condition = get_field_option[find_name_index].name;
      }
      else {
        this.custome_form_object.Condition = "";
      }
    }
    else if (item == "Comment") {
      this.custome_form_object.Comment = value;
    }
  }
  object = {
    "Location": "",
    "Decibels": "",
    "PC": "",
    "Flag": "",
    "Condition": "",
    "Comment": "",
    "item_id": 0
  }

  EditHtml1(item, field, edit_index) {
    this.savebuttoncheck = true;
    this.itemIndexNumber = edit_index;
    let find_final_array_obj = Object.assign({}, this.finalArray2[edit_index]);
    this.custome_form_object = find_final_array_obj;
    this.showHtmlFields = true;
  }

  DeleteHtml1(item, elementdata, delete_index) {
    if (this.finalArray2.length > 0) {
      this.finalArray2.splice(delete_index, 1);
      if (elementdata.hasOwnProperty('default_values') && elementdata.default_values != "" && elementdata.default_values != undefined) {
        elementdata.default_values.splice(delete_index, 1);
      }
      if (!elementdata.hasOwnProperty('default_values')) {
        elementdata["default_values"] = "";
      }
    }
  }

  htmlDoneClick1(item, elementdata) {
    this.showHtmlFields = false;
    let clone_entered_values = _.cloneDeep(this.custome_form_object);
    let convert_uuid_store = _.cloneDeep(this.custome_form_object);
    if (this.itemIndexNumber != -1) {
      // change special characters start
      clone_entered_values.location = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.location);
      clone_entered_values.decibels = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.decibels);
      clone_entered_values.previouscondition = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.previouscondition);
      clone_entered_values.flagforrReview = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.flagforrReview);
      clone_entered_values.Condition = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.Condition);
      clone_entered_values.Comment = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.Comment);
      // change special characters end
      this.finalArray2[this.itemIndexNumber] = clone_entered_values;
    }
    else {
      // change special characters start
      clone_entered_values.location = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.location);
      clone_entered_values.decibels = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.decibels);
      clone_entered_values.previouscondition = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.previouscondition);
      clone_entered_values.flagforrReview = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.flagforrReview);
      clone_entered_values.Condition = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.Condition);
      clone_entered_values.Comment = this.dataService.changeSpecialtoKeyFormat(clone_entered_values.Comment);
      // change special characters end
      this.finalArray2.push(clone_entered_values);
    }
    // update the local layer data values

    let clone_element_data = _.cloneDeep(elementdata);
    // make json for store layer form datas
    let convert_uuids = this.custom_form_make_uuid(convert_uuid_store, item);
    let send_new_values: any = "";
    if (this.itemIndexNumber != -1) {
      if (clone_element_data.hasOwnProperty('default_values')) {
        clone_element_data.default_values[this.itemIndexNumber] = convert_uuids;
        send_new_values = clone_element_data.default_values;
      }
    }
    else {
      if (clone_element_data.hasOwnProperty('default_values')) {
        if (clone_element_data.default_values == "" || clone_element_data.default_values == undefined) {
          clone_element_data.default_values = [convert_uuids];
          send_new_values = clone_element_data.default_values;
        }
        else if (clone_element_data.default_values.length > 0) {
          clone_element_data.default_values.push(convert_uuids);
          send_new_values = clone_element_data.default_values;
        }
      }
      else if (!clone_element_data.hasOwnProperty('default_values')) {
        clone_element_data["default_values"] = [convert_uuids];
        send_new_values = clone_element_data["default_values"];
      }
    }
    this.useConditionChange(item, item.element_uuid, send_new_values, null)
    console.log(this.finalArray2);

  }

  custom_form_make_uuid(final_enter_values, item) {
    let get_UI_values = final_enter_values;
    for (let single_value in get_UI_values) {

      switch (single_value) {
        case 'location':
          get_UI_values[item.element_data.fields[0].element_uuid] = get_UI_values[single_value];
          delete get_UI_values[single_value];
          break;
        case 'decibels':
          get_UI_values[item.element_data.fields[1].element_uuid] = get_UI_values[single_value];
          delete get_UI_values[single_value];
          break;
        case 'previouscondition':
          get_UI_values[item.element_data.fields[2].element_uuid] = get_UI_values[single_value];

          delete get_UI_values[single_value];
          break;
        case 'flagforrReview':
          get_UI_values[item.element_data.fields[3].element_uuid] = get_UI_values[single_value];
          delete get_UI_values[single_value];
          break;
        case 'Condition':
          get_UI_values[item.element_data.fields[4].element_uuid] = get_UI_values[single_value];
          let get_options = item.element_data.fields[4].element_data.options;
          let find_uuid_basename = get_options.findIndex((name1) => name1.name == get_UI_values[single_value]);
          if (find_uuid_basename > -1) {
            get_UI_values[item.element_data.fields[4].element_uuid] = get_options[find_uuid_basename].element_uuid;
          }
          delete get_UI_values[single_value];
          break;
        case 'Comment':
          get_UI_values[item.element_data.fields[5].element_uuid] = get_UI_values[single_value];
          delete get_UI_values[single_value];
          break;
      }
      console.log(get_UI_values);
    }
    console.log(get_UI_values);
    return get_UI_values
  }

  displayArryChange(item, finalArray) {
    finalArray.forEach(element => {
      for (var key in element) {
        for (var j = 0; j < item.length; j++) {
          if (item[j].element_uuid == key) {
            if (item[j].element_type == "number") {
              this.obj1.quantity = element[key]
            } else {
              item[j].element_data.options.forEach(element1 => {
                if (element1.element_uuid == element[key]) {
                  if (item[j].element_type == "dropdown") {
                    this.obj1.condition_code = element1.name
                  }
                  if (item[j].element_type == "single_choice") {
                    this.obj1.cs = element1.name
                  }
                  if (item[j].element_type == "multiple_choice") {
                    this.obj1.not = true
                  }
                }
              });
            }
          }
        }
      }
      this.obj1.item_id = this.obj1.item_id + 1
      this.finalArray1.push(this.obj1);
      this.finalArray1 = _.cloneDeep(this.finalArray1)
      this.obj1.id = "";
      this.obj1.condition_code = "";
      this.obj1.cs = "";
      this.obj1.quantity = 0;
      this.obj1.not = false;
      this.obj1.item_id = 0
    });
    this.htmlcalculation()
  }

  htmlcalculation() {
    this.unratedQuantity = 0;
    this.csValue = 0;
    for (var i = 0; i < this.outputArray.length; i++) {
      this.outputArray[i].value = 0
    }
    let chechAarray = this.finalArray1.filter((ele => ele.not == false))
    var fieldSum = 0;
    var cs1Sum = 0;
    chechAarray.forEach(element => {
      // if (element.cs.trim() != "CS1") {
      //   this.unratedQuantity = this.unratedQuantity + Number(element.quantity)
      //   this.csValue = this.csValue + Number(element.quantity)
      //   var cc = this.outputArray.filter((ele => ele.key == element.cs))
      //   cc[0].value = Number(cc[0].value) + Number(element.quantity)
      //   var cc1 = this.outputArray.filter((ele => ele.key.trim() == "CS1"))
      //   cc1[0].value = -this.csValue
      // } else {
      //   this.unratedQuantity = this.unratedQuantity + Number(element.quantity)
      // }
      if (element.cs.trim() != "CS1" && element.cs.trim() != "") {
        var cc = this.outputArray.filter((ele => ele.not == false || ele.cs == "CS1"))
        if (element.quantity != undefined) {
          cc[0].value = Number(cc[0].value) + Number(element.quantity)
        }
      }
      if (element.cs.trim() != "CS1" && element.cs.trim() != "INAC" && element.cs.trim() != "") {
        if (element.quantity != undefined) {
          fieldSum = fieldSum + Number(element.quantity)
        }
      }
      if (element.not == false && element.cs.trim() == "CS1" && element.cs.trim() != "") {
        if (element.quantity != undefined) {
          cs1Sum = cs1Sum + Number(element.quantity)
        }
      }
      this.unratedQuantity = this.totalElementQuantity - cs1Sum - fieldSum
      this.csValue = cs1Sum + this.unratedQuantity
      var cc1 = this.outputArray.filter((ele => ele.key.trim() == "CS1"))
      cc1[0].value = this.csValue
    });
    if (chechAarray.length == 0) {
      chechAarray = [{ cs: "CS1", value: this.totalElementQuantity }]
      this.unratedQuantity = this.totalElementQuantity
    }
  }

  changedateLocal(item, value) {
    item.element_data.default_date_time = value;
  }
  clearDate(item) {

    let merge_cell;
    if (this.extend == true) {
      merge_cell = [...this.change, ...this.extend_model.attributes];
    } else {
      merge_cell = this.change;
    }
    for (let k = 0; k < merge_cell.length; k++) {
      if (merge_cell[k]['element_uuid'] == item.element_uuid) {
        merge_cell[k].element_data.default_date_time = "none";
        item.element_data.default_date_time = "none";
        this.useConditionChange(item, item.element_uuid, item.element_data.default_date_time, null)
      }
    }

    let dummy_model = [];
    let attribute_model = [];

    if (this.extend == true) {
      for (let i = 0; i < this.extend_model.attributes.length; i++) {
        let filter_element = this.usecaseCopyArray.filter(data => data.element_uuid == this.extend_model.attributes[i].element_uuid);
        if (filter_element != null && filter_element.length > 0) {
          dummy_model.push(filter_element[0]);
        }
      }
      this.extend_model.attributes = _.cloneDeep(dummy_model);
      for (let i = 0; i < this.change.length; i++) {
        let filter_element = this.usecaseCopyArray.filter(data => data.element_uuid == this.change[i].element_uuid);
        if (filter_element != null && filter_element.length > 0) {
          attribute_model.push(filter_element[0]);
        }
      }
      this.change = _.cloneDeep(attribute_model);
    }
    else {
      this.change = merge_cell;
    }

  }
  updateAttributes(item, item_value, single_choice) {
    this.changestatus = true;
    if (item.element_type == 'single_choice' || item.element_type == 'dropdown') {
      item.element_data.options.forEach(element => {
        element.default = false
      });

      let UCitemDefault = item.element_data.options.filter((ele => ele.element_uuid == item_value))
      if (item.element_type == 'single_choice') {
        let check_or_not = single_choice.target.checked;
        if (UCitemDefault.length > 0) {
          if (check_or_not == true) {
            UCitemDefault[0].default = true;
            item.element_data.default_value = item_value
          }
          else {
            item.element_data.default_value = "";
          }
        }
      }
      else {
        if (UCitemDefault.length > 0) {
          UCitemDefault[0].default = true;
          item.element_data.default_value = item_value;
        }
        else {
          item.element_data.default_value = "";
        }
      }


    }
    // if (item.element_type == 'dropdown' ) {
    //   var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == item_value))
    //   UCItem[0].element_data.options.forEach(element => {
    //     element.default = false
    //   });
    //   let UCitemDefault = UCItem[0].element_data.options.filter((ele => ele.element_uuid == item_value))
    //   if(UCitemDefault.length>0){
    //     UCitemDefault[0].default = true;
    //   }
    //   else if(UCitemDefault.length>0){
    //     UCitemDefault[0].default = false;  
    //   }
    //   item.element_data.default_value = item_value
    // } 
    else if (item.element_type == 'multiple_choice' || item.element_type == 'checkbox') {
      let UCitemDefault = item.element_data.options.filter((ele => ele.element_uuid == item_value))
      if (UCitemDefault.length > 0 && UCitemDefault[0].default == true) {
        UCitemDefault[0].default = false;
      } else if (UCitemDefault.length > 0) {
        UCitemDefault[0].default = true;
      }
    }
    this.useConditionChange(item, item.element_uuid, item_value, '')
  }
  useConditionChange(item, uuid, value, addressCheck) {

    this.changestatus = true;
    if (item.element_data.label_text == "Total Element Quantity") {
      this.totalElementQuantity = Number(item.element_data.default_value);
      this.htmlcalculation();
    }
    var UCItem_in_check = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid));
    if (UCItem_in_check.length > 0) {
      if (item.element_type == "uti-entry-field") {
        var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid))
        UCItem[0].element_data["default_values"] = value
      }
      else if (item.element_type == "uti-entry-field-WMATA") {
        var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid))
        UCItem[0].element_data["default_values"] = value
      }
      else if (item.element_type == "uti-entry-field-TIMBER") {
        var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid))
        UCItem[0].element_data["default_values"] = value
      }
      else if (item.element_type == "uti-entry-field-WMATA_WELD") {
        var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid))
        if(UCItem[0].element_data["default_values"].length > 0 && addressCheck != "delete"){
          UCItem[0].element_data["default_values"].push(value[0]);
        }
        else{
          UCItem[0].element_data["default_values"] = value;
        }
        this.finalArrayWeld = UCItem[0].element_data["default_values"];
      }
      else if (item.element_type == 'single_choice') {
        let defaultoptionCheck = item.element_data.options.filter(ele => ele.default == true)
        var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid))
        UCItem[0].element_data.options.forEach(element => {
          element.default = false;
        });
        let UCitemDefault = UCItem[0].element_data.options.filter((ele => ele.element_uuid == value))
        if(defaultoptionCheck.length > 0){
          if(UCitemDefault[0].element_uuid == defaultoptionCheck[0].element_uuid){
            UCitemDefault[0].default = true;
          }
        }
        // if (UCitemDefault[0].default == true) {
        //   UCitemDefault[0].default = false;
        // } else {
        //   UCitemDefault[0].default = true;
        // }
        UCItem[0].element_data.last_modified_date = new Date().toISOString();
      }
      else if (item.element_type == 'dropdown') {
        var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid))
        UCItem[0].element_data.options.forEach(element => {
          element.default = false
        });
        let UCitemDefault = UCItem[0].element_data.options.filter((ele => ele.element_uuid == value))
        if (UCitemDefault.length > 0) {
          UCitemDefault[0].default = true;
        }
        else if (UCitemDefault.length > 0) {
          UCitemDefault[0].default = false;
        }

        UCItem[0].element_data.default_value = value.element_uuid
        UCItem[0].element_data.last_modified_date = new Date().toISOString();
        //this.FormulaCalc(item.element_data.label_text);
      }
      else if (item.element_type == 'number') {
        if (item.element_data.default_value == null) {
          item.element_data.default_value = ""
        }
        item.element_data.default_value = item.element_data.default_value.toString()
        let UCitem12 = this.usecaseCopyArray.filter((ele => ele.element_uuid == item.element_uuid))
        UCitem12[0].element_data.default_value = item.element_data.default_value.toString();
        UCitem12[0].element_data.last_modified_date = new Date().toISOString();
        if (this.timber_form_datas != undefined && this.timber_form_datas != null && this.timber_form_datas.length > 0) {
          let find_index_timber_form = this.timber_form_datas.findIndex((number_field) => number_field.element_uuid == item.element_uuid);
          if (find_index_timber_form > -1) {
            this.timber_form_datas[find_index_timber_form].element_data.default_value = item.element_data.default_value;
            this.dataService_doc.diameter_changes.emit(this.timber_form_datas);
          }
        }
        //this.FormulaCalc(item.element_data.label_text);
      }
      else if (item.element_type == 'date') {

        if (item.element_data.default_value == "none") {
          item.element_data.default_value = ""
        }
        //item.element_data.default_value = item.element_data.default_date_time.toString()
        let UCitem12 = this.usecaseCopyArray.filter((ele => ele.element_uuid == item.element_uuid))
        item.element_data.default_date_time = value;
        UCitem12[0].element_data.default_date_time = item.element_data.default_date_time;
        UCitem12[0].element_data.last_modified_date = new Date().toISOString();
        console.log('testing');
        //this.FormulaCalc(item.element_data.label_text);
      }
      else if (item.element_type == 'multiple_choice' || item.element_type == 'checkbox') {
        var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid))
        let UCitemDefault = UCItem[0].element_data.options.filter((ele => ele.element_uuid == value))
        if (UCitemDefault[0].default == true) {
          UCitemDefault[0].default = false;
        } else {
          UCitemDefault[0].default = true;
        }
        UCItem[0].element_data.last_modified_date = new Date().toISOString();
      }
      else if (item.element_type == 'address') {
        var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid))
        if (addressCheck == "street") {
          UCItem[0].element_data.street_address1 = value
        } else if (addressCheck == "city") {
          UCItem[0].element_data.city = value
        } else if (addressCheck == "state") {
          UCItem[0].element_data.state = value
        } else if (addressCheck == "zip") {
          UCItem[0].element_data.zip = value
        } else {
          UCItem[0].element_data.street_address2 = value
        }
        UCItem[0].element_data.last_modified_date = new Date().toISOString();
      }
      else {

        var UCItem = this.usecaseCopyArray.filter((ele => ele.element_uuid == uuid))
        UCItem[0].element_data.default_value = value;
        UCItem[0].element_data.last_modified_date = new Date().toISOString();
      }
    }

    this.process_use_conditions();
    this.FormulaCalc();
    this.checkAlign_usecase();
  }

  DeleteHtml(item, index) {
    this.finalArray.splice(index, 1);
    this.finalArray1 = [];
    this.displayArryChange(this.elementFields, this.finalArray)
  }
  EditHtml(item, index) {
    this.itemIndexNumber = index
    this.obj = this.finalArray[index]
    this.conditionSelected = item.condition_code
    this.csSelected = item.cs
    this.fieldQuantity = Number(item.quantity)
    this.countedCheck = item.not;
    this.showHtmlFields = true;
  }

  numberToString(item, value) {
    item.element_data.default_value = value.toString();
    this.updateAttributes(item, value, '')
  }

  getCurrentDate(option) {
    console.log(option);
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


  FormulaCalc() {
    if (this.formData.is_extend == 1) {
      this.Extend_FormulaCalc();
    }
    var FormulaFieldfind = this.change.filter(ele => ele.element_type == "calculation");
    var calculationValueUpdate = this.change.filter(ele => ele.element_type == "calculation");
    if (FormulaFieldfind.length != 0) {
      //if (FormulaFieldfind[0].element_data['calculation_value'] == "") { } else {
      var i = 0;
      FormulaFieldfind.forEach(calc => {
        if (FormulaFieldfind[i].element_data['calculation_value'] != "") {
          if (FormulaFieldfind[i].element_data['default_value'] == "") {
            FormulaFieldfind[i].element_data['default_value'] = "1"
          }
          if (FormulaFieldfind[i].element_data['calculation_value'].includes("AVG")) {
            this.AvarageCalculation(calc, FormulaFieldfind[i], calculationValueUpdate[i])
          } else {
            var CalcValue = calc.element_data['calculation_value'];
            var matches = [];
            var pattern = /\[(.*?)\]/g;
            var match;
            while ((match = pattern.exec(CalcValue)) != null) {
              matches.push(match[1]);
            }
            this.DummyField = calc.element_data['calculation_value'];
            // calc.element_data['calculation_value'] = calc.element_data['calculation_value']
            calc.element_data['calculation'] = calc.element_data['calculation_value']

            matches.forEach(element => {

              var FieldFind = this.change.filter(ele => ele['element_uuid'] == element);
              if (FieldFind.length == 0) {
                FieldFind = this.extend_model.attributes.filter(ele => ele['element_uuid'] == element);
              }
              this.FieldResult = FieldFind[0];
              this.DummyField = this.DummyField.replace(element, FieldFind[0].element_data.label_text)
              if (FieldFind[0].element_type == "single_choice" || FieldFind[0].element_type == "dropdown") {
                var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);

                if (CalculatioField1.length > 0) {
                  if (CalculatioField1[0].calculated_value != "") {
                    if (calc.element_data['calculation'].includes('[' + element + ']')) {
                      calc.element_data['calculation'] = calc.element_data['calculation'].replace("[" + element + "]", CalculatioField1[0].calculated_value)
                    } else {
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                    }
                    this.DummyField = calc.element_data['calculation'];
                  } else {
                    //calc.element_data.calculation = this.DummyField
                    calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                  }

                } else {
                  // calc.element_data['calculation'] = this.DummyField
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
                  if (calculatedalltotal != 0) {
                    if (calc.element_data['calculation'].includes('[' + element + ']')) {
                      calc.element_data['calculation'] = calc.element_data['calculation'].replace("[" + element + "]", calculatedalltotal)
                    } else {
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                    }
                    this.DummyField = calc.element_data['calculation'];
                  }
                  else if (calculatedalltotal == 0 && FieldFind[0].element_type == "checkbox") {
                    calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 1)
                  }
                }
                else if (CalculatioField1.length == 0) {
                  calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                }
                else {
                  calc.element_data['calculation'] = this.DummyField
                }

                console.log(calc.element_data['calculation'])
              }
              //////////////////
              else if (FieldFind[0].element_type == "calculation") {
                if (FieldFind[0].element_data['calculation'] != "" && FieldFind[0].element_data['calculation'] != undefined) {
                  if (FieldFind[0].element_data['calculation'].includes('[')) {
                    calc.element_data['calculation'] = this.DummyField
                  } else if (calc.element_data['calculation'].includes('[' + element + ']')) {
                    calc.element_data['calculation'] = calc.element_data['calculation'].replace("[" + element + "]", FieldFind[0].element_data['calculation'])
                  } else {
                    calc.element_data['calculation'] = calc.element_data["calculation_value"].replace("[" + element + "]", FieldFind[0].element_data['calculation'])
                  }
                }
                if (this.FieldResult.element_data.calculation == "" || this.FieldResult.element_data.calculation == undefined) {
                  calc.element_data['calculation'] = this.DummyField
                } else {
                  this.DummyField = calc.element_data['calculation']
                }
              }
              ///////////////////
              else {
                if (FieldFind[0].element_data.default_value != "" && FieldFind[0].element_data.default_value != null) {
                  if (calc.element_data['calculation'].includes('[' + element + ']')) {
                    calc.element_data['calculation'] = calc.element_data['calculation'].replace("[" + element + "]", FieldFind[0].element_data.default_value)
                  } else {
                    calc.element_data['calculation'] = calc.element_data['calculation_value'].replace("[" + element + "]", FieldFind[0].element_data.default_value)
                  }
                }
                if (this.FieldResult.element_data.default_value == "" || this.FieldResult.element_data.default_value == undefined) {
                  calc.element_data['calculation'] = this.DummyField
                } else {
                  this.DummyField = calc.element_data['calculation']
                }
              }
            })
            if (calc.element_data['calculation'].includes('[')) {
              calculationValueUpdate[i].element_data['calculation'] = calc.element_data['calculation'];
            } else {

              if (calc.element_data['calculation'].includes('.rounded()')) {
                calc.element_data['calculation'] = calc.element_data['calculation'].split(".rounded()").join("")
                calculationValueUpdate[i].element_data['calculation'] = eval(
                  calc.element_data['calculation']
                );
                calculationValueUpdate[i].element_data['calculation'] = calculationValueUpdate[i].element_data['calculation'] != "" && calculationValueUpdate[i].element_data['calculation'] > 1 ? Math.round(calculationValueUpdate[i].element_data['calculation']) : 1
                calculationValueUpdate[i].element_data['calculation'] = calculationValueUpdate[i].element_data['calculation'].toFixed(Number(calculationValueUpdate[i].element_data.default_value));
              }
              //square root function implemented start
              else if (calc.element_data.calculation.includes('√')) {
                let get_fianl_value = this.dataService.squareRootCalculation(calc.element_data.calculation);
                if (get_fianl_value != '√' && get_fianl_value != '') {
                  // get_fianl_value = eval(get_fianl_value);
                  let validcalculation = false;
                  try {
                    eval(get_fianl_value);
                    validcalculation = true;
                  } catch (e) {
                    if (e instanceof SyntaxError) {
                      // alert(e.message);
                      validcalculation = false;
                      calculationValueUpdate[i].element_data.calculation = get_fianl_value;
                    }
                  }
                  if (validcalculation == true) {
                    get_fianl_value = eval(get_fianl_value);
                    calculationValueUpdate[i].element_data.calculation = get_fianl_value;
                    calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
                  }
                }
                // calculationValueUpdate[i].element_data.calculation = get_fianl_value;
                // calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
              }
              //square root function implemented end
              //power function implemented start
              else if (calc.element_data.calculation.includes('^')) {
                let get_fianl_value = this.dataService.powerOfCalculation(calc.element_data.calculation);
                if (get_fianl_value != '^' && get_fianl_value != '') {
                  // get_fianl_value = eval(get_fianl_value);
                  let validcalculation = false;
                  try {
                    eval(get_fianl_value);
                    validcalculation = true;
                  } catch (e) {
                    if (e instanceof SyntaxError) {
                      // alert(e.message);
                      validcalculation = false;
                      calculationValueUpdate[i].element_data.calculation = get_fianl_value;
                    }
                  }
                  if (validcalculation == true) {
                    get_fianl_value = eval(get_fianl_value);
                    calculationValueUpdate[i].element_data.calculation = get_fianl_value;
                    calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
                  }
                }
                // calculationValueUpdate[i].element_data.calculation = get_fianl_value;
                // calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
              }
              //power function implemented end
              else {
                let check_seperators = ["(", ")", "+", "-", "*", "/"];
                let get_calculation = calc.element_data.calculation
                let get_fist_value = calc.element_data.calculation[0];
                let get_second_value = calc.element_data.calculation[1];
                let get_last_value = calc.element_data.calculation[calc.element_data.calculation.length - 1];
                if (check_seperators.includes(get_fist_value) && check_seperators.includes(get_second_value)) {
                  calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation
                }
                else if (check_seperators.includes(get_last_value)) {
                  calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation
                }
                else if ((get_calculation.includes("(") && !get_calculation.includes(")")) ||
                  (get_calculation.includes(")") && !get_calculation.includes("("))) {
                  calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation
                }
                else {
                  calculationValueUpdate[i].element_data.calculation = eval(calc.element_data.calculation);
                  calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.default_value == "" ? calculationValueUpdate[i].element_data.calculation.toFixed(Number(1)) : calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
                  let confirmedValue = calc.element_data.calculation;
                  console.log(Math.abs(confirmedValue));
                  let decimalCheck = Math.abs(confirmedValue);
                }
                console.log(typeof calculationValueUpdate[i].element_data.calculation);

              }
              // else {
              //   calculationValueUpdate[i].element_data['calculation'] = eval(
              //     calc.element_data['calculation']
              //   );
              //   calculationValueUpdate[i].element_data['calculation'] = calculationValueUpdate[i].element_data['calculation'].toFixed(calculationValueUpdate[i].element_data.default_value);
              //   let confirmedValue = calc.element_data['calculation'];
              //   console.log(Math.abs(confirmedValue));
              //   let decimalCheck = Math.abs(confirmedValue);
              // }
            }
          }
          console.log(calc.element_data['calculation'])
          i++;
        }
      })
      //}

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
                defaultvalues[j][key] = this.dataService.changeSpecialtoKeyFormat(defaultvalues[j][key]);
                sample_object.location = defaultvalues[j][key];
                break;
              case 1:
                defaultvalues[j][key] = this.dataService.changeSpecialtoKeyFormat(defaultvalues[j][key]);
                sample_object.decibels = defaultvalues[j][key];
                break;
              case 2:
                defaultvalues[j][key] = this.dataService.changeSpecialtoKeyFormat(defaultvalues[j][key]);
                sample_object.previouscondition = defaultvalues[j][key];
                break;
              case 3:
                defaultvalues[j][key] = this.dataService.changeSpecialtoKeyFormat(defaultvalues[j][key]);
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
                defaultvalues[j][key] = this.dataService.changeSpecialtoKeyFormat(defaultvalues[j][key]);
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
  }
  Extend_FormulaCalc() {
    this.datas = [...this.change, ...this.extend_model.attributes]
    var FormulaFieldfind = this.datas.filter(ele => ele.element_type == "calculation");
    var calculationValueUpdate = this.datas.filter(ele => ele.element_type == "calculation");
    if (FormulaFieldfind.length != 0) {
      //if (FormulaFieldfind[0].element_data['calculation_value'] == "") { } else {
      var i = 0;
      FormulaFieldfind.forEach(calc => {
        if (FormulaFieldfind[i].element_data['calculation_value'] != "") {
          if (FormulaFieldfind[i].element_data['default_value'] == "") {
            FormulaFieldfind[i].element_data['default_value'] = "1"
          }
          if (FormulaFieldfind[i].element_data['calculation_value'].includes("AVG")) {
            this.AvarageCalculation(calc, FormulaFieldfind[i], calculationValueUpdate[i])
          } else {
            var CalcValue = calc.element_data['calculation_value'];
            var matches = [];
            var pattern = /\[(.*?)\]/g;
            var match;
            while ((match = pattern.exec(CalcValue)) != null) {
              matches.push(match[1]);
            }
            this.DummyField = calc.element_data['calculation_value'];
            // calc.element_data['calculation_value'] = calc.element_data['calculation_value']
            calc.element_data['calculation'] = calc.element_data['calculation_value']

            matches.forEach(element => {

              var FieldFind = this.datas.filter(ele => ele['element_uuid'] == element);
              this.FieldResult = FieldFind[0];
              this.DummyField = this.DummyField.replace(element, FieldFind[0].element_data.label_text)
              if (FieldFind[0].element_type == "single_choice" || FieldFind[0].element_type == "dropdown") {
                var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);

                if (CalculatioField1.length > 0) {
                  if (CalculatioField1[0].calculated_value != "") {
                    if (calc.element_data['calculation'].includes('[' + element + ']')) {
                      calc.element_data['calculation'] = calc.element_data['calculation'].replace("[" + element + "]", CalculatioField1[0].calculated_value)
                    } else {
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                    }
                    this.DummyField = calc.element_data['calculation'];
                  } else {
                    //calc.element_data.calculation = this.DummyField
                    calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                  }

                } else {
                  // calc.element_data['calculation'] = this.DummyField
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
                  if (calculatedalltotal != 0) {
                    if (calc.element_data['calculation'].includes('[' + element + ']')) {
                      calc.element_data['calculation'] = calc.element_data['calculation'].replace("[" + element + "]", calculatedalltotal)
                    } else {
                      calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                    }
                    this.DummyField = calc.element_data['calculation'];
                  }
                  else if (calculatedalltotal == 0 && FieldFind[0].element_type == "checkbox") {
                    calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 1)
                  }
                }
                else if (CalculatioField1.length == 0) {
                  calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 0)
                }
                else {
                  calc.element_data['calculation'] = this.DummyField
                }

                console.log(calc.element_data['calculation'])
              }
              //////////////////
              else if (FieldFind[0].element_type == "calculation") {
                if (FieldFind[0].element_data['calculation'] != "" && FieldFind[0].element_data['calculation'] != undefined) {
                  if (FieldFind[0].element_data['calculation'].includes('[')) {
                    calc.element_data['calculation'] = this.DummyField
                  } else if (calc.element_data['calculation'].includes('[' + element + ']')) {
                    calc.element_data['calculation'] = calc.element_data['calculation'].replace("[" + element + "]", FieldFind[0].element_data['calculation'])
                  } else {
                    calc.element_data['calculation'] = calc.element_data["calculation_value"].replace("[" + element + "]", FieldFind[0].element_data['calculation'])
                  }
                }
                if (this.FieldResult.element_data.calculation == "" || this.FieldResult.element_data.calculation == undefined) {
                  calc.element_data['calculation'] = this.DummyField;
                } else {
                  this.DummyField = calc.element_data['calculation']
                }
              }
              ///////////////////
              else {
                if (FieldFind[0].element_data.default_value != "" && FieldFind[0].element_data.default_value != null) {
                  if (calc.element_data['calculation'].includes('[' + element + ']')) {
                    calc.element_data['calculation'] = calc.element_data['calculation'].replace("[" + element + "]", FieldFind[0].element_data.default_value)
                  } else {
                    calc.element_data['calculation'] = calc.element_data['calculation_value'].replace("[" + element + "]", FieldFind[0].element_data.default_value)
                  }
                }
                if (this.FieldResult.element_data.default_value == "" || this.FieldResult.element_data.default_value == undefined) {
                  calc.element_data['calculation'] = this.DummyField
                } else {
                  this.DummyField = calc.element_data['calculation']
                }
              }
            })
            if (calc.element_data['calculation'].includes('[')) {
              calculationValueUpdate[i].element_data['calculation'] = calc.element_data['calculation'];
            } else {

              if (calc.element_data['calculation'].includes('.rounded()')) {
                calc.element_data['calculation'] = calc.element_data['calculation'].split(".rounded()").join("")
                calculationValueUpdate[i].element_data['calculation'] = eval(
                  calc.element_data['calculation']
                );
                calculationValueUpdate[i].element_data['calculation'] = calculationValueUpdate[i].element_data['calculation'] != "" && calculationValueUpdate[i].element_data['calculation'] > 1 ? Math.round(calculationValueUpdate[i].element_data['calculation']) : 1
                calculationValueUpdate[i].element_data['calculation'] = calculationValueUpdate[i].element_data['calculation'].toFixed(Number(calculationValueUpdate[i].element_data.default_value));
              } else {
                calculationValueUpdate[i].element_data['calculation'] = eval(
                  calc.element_data['calculation']
                );
                calculationValueUpdate[i].element_data['calculation'] = calculationValueUpdate[i].element_data['calculation'].toFixed(calculationValueUpdate[i].element_data.default_value);
                let confirmedValue = calc.element_data['calculation'];
                console.log(Math.abs(confirmedValue));
                let decimalCheck = Math.abs(confirmedValue);
              }
            }
          }
          console.log(calc.element_data['calculation'])
          i++;
        }
      })
      //}

    }
  }
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
        var FieldFind = this.change.filter(ele => ele["element_uuid"] == element);

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
          if (FieldFind[0].element_data["calculation"] != "" && FieldFind[0].element_data["calculation"] != undefined) {
            if (FieldFind[0].element_data["calculation"].includes('[')) {
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
    console.log(this.change);
  }
  Extend_AvarageCalculation(calc, FormulaFieldfind, calculationValueUpdate) {
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
        var FieldFind = this.datas.filter(ele => ele["element_uuid"] == element);

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
          if (FieldFind[0].element_data["calculation"] != "" && FieldFind[0].element_data["calculation"] != undefined) {
            if (FieldFind[0].element_data["calculation"].includes('[')) {
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
    console.log(this.datas);
  }

  process_use_conditions() {
    if (this.formData.is_extend == 1) {
      this.Extend_process_use_conditions();
    }
    else {
      this.datas = this.change;
      for (let i = 0; i < this.datas.length; i++) {
        this.editIndex = i;
        // if(this.datas[i].element_data.default_date_time=="current"){
        //   this.datas[i].element_data.default_date_time=new Date();
        // }
        // else{

        // }
        if (this.datas[i].element_data.use_conditions == true) {
          this.condition_field_name = this.datas[i].element_data.if_condition;
          this.current_if_value = this.datas[i].element_data.if_value;
          this.current_if_do = this.datas[i].element_data.if_do;
          this.current_if_state = this.datas[i].element_data.if_state;
        } else {
          this.condition_field_name = ""
          this.current_if_value = ""
          this.current_if_do = ""
          this.current_if_state = ""
        }
        if (this.condition_field_name != "") {
          let UCitem = this.usecaseCopyArray.filter((ele => ele['element_uuid'] == this.condition_field_name))
          if (UCitem.length > 0) {
            if (UCitem[0].element_data.default_value == null) {
              UCitem[0].element_data.default_value = ""
            }
          } else {
            this.condition_field_name = ""
          }
          if (this.current_if_state == 'is equal to') {
            if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'single_choice') {
              //if (this.current_if_value == UCitem[0].element_data.default_value) {
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
          } else if (this.current_if_state == 'is not equal to')//  Not equal to 
          {
            if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'single_choice') {
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
          //  Is filled  or empty
          else if (this.current_if_state == 'is filled') {
            if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown') {
              //if (this.current_if_value == UCitem[0].element_data.default_value) {
              let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default == true))
              if (multyOpt.length > 0) {
                this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" : "0";
              }//  if option is filled 
              else {
                this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" : "1";
              }
            } else {
              if (UCitem[0].element_data.default_value != '') // other fields check if filled
              {
                this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" : "0";
              } else {
                this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" : "1";
              }
            }
          }// if filled over 
          else if (this.current_if_state == 'is empty') {
            if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown') {
              //if (this.current_if_value == UCitem[0].element_data.default_value) {
              let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default == true))
              if (multyOpt.length == 0) {
                this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" : "0";
              }//  if option is filled 
              else {
                this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" : "1";
              }
            } else {
              if (UCitem[0].element_data.default_value == '') // other fields check if filled
              {
                this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" : "0";
              } else {
                this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" : "1";
              }
            }
          }// if empty over 
          // else if (this.current_if_state == 'is filled') //  Is filled  
          // {

          //   if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown' || this.datas[i].element_type == 'checkbox') {
          //     let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
          //     let defaultOptions = this.usecaseCopyArray[i].element_data.options.filter((ele => ele.default == true))
          //     this.activeIndex = this.usecaseCopyArray[i].element_data.options.findIndex(data => data.default == true)
          //     let redioIndex = this.datas[i].element_data.options.findIndex((ele => ele.element_uuid == this.current_if_value))
          //     if (UCitem[0].element_type == 'multiple_choice') {
          //       let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
          //       UCitem12[0].default = false;
          //       this.datas[i].element_data.default_value = null
          //       if (OptionSelected.length > 0) {
          //         this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
          //         UCitem12[0].default = true;
          //       }
          //     } else {
          //       if (UCitem[0].element_type == 'address') {
          //         if (UCitem[0].element_data['city'] != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data['state'] != "" || UCitem[0].element_data['zip'] != "" || UCitem[0].element_data.street_address2 != "") {
          //           this.datas[i].element_data.options.forEach(element => {
          //             element.default = false;
          //           });
          //           this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
          //           UCitem12[0].default = true;
          //         } else {
          //           if (this.activeIndex != -1) {
          //             this.datas[i].element_data.options.forEach(element => {
          //               element.default = false;
          //             });
          //             this.datas[i].element_data.options[this.activeIndex].default = true
          //           } else {
          //             this.datas[i].element_data.options.forEach(element => {
          //               element.default = false;
          //             });
          //           }
          //         }
          //       } else {
          //         // UCitem12[0].default = false;
          //         // this.datas[i].element_data.default_value = null
          //         if ((UCitem[0].element_data.default_value != null) && (UCitem[0].element_data.default_value != "")) {
          //           this.datas[i].element_data.options.forEach(element => {
          //             element.default = false;
          //           });
          //           this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
          //           UCitem12[0].default = true;
          //         } else {
          //           if (this.activeIndex != -1) {
          //             this.datas[i].element_data.options.forEach(element => {
          //               element.default = false;
          //             });
          //             this.datas[i].element_data.options[this.activeIndex].default = true
          //           } else {
          //             this.datas[i].element_data.options.forEach(element => {
          //               element.default = false;
          //             });
          //           }
          //         }
          //       }
          //     }
          //   }
          //   else {
          //     if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
          //       let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
          //       this.datas[i].element_data.default_value = this.usecaseCopyArray[i].element_data.default_value;
          //       if (OptionSelected.length > 0) {
          //         this.datas[i].element_data.default_value = this.current_if_value;
          //       }
          //     }
          //     else {

          //       this.datas[i].element_data.default_value = this.usecaseCopyArray[i].element_data.default_value;
          //       if (UCitem[0].element_type == 'address') {
          //         if (UCitem[0].element_data['city'] != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data['state'] != "" || UCitem[0].element_data['zip'] != "" || UCitem[0].element_data.street_address2 != "") {
          //           this.datas[i].element_data.default_value = this.current_if_value;
          //         }
          //       } else {
          //         if (UCitem[0].element_data.default_value != null && UCitem[0].element_data.default_value != "") {
          //           this.datas[i].element_data.default_value = this.current_if_value;
          //         }
          //       }
          //     }
          //   }
          // } else if (this.current_if_state == 'is empty') // Is empty
          // {
          //   if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown') {
          //     let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
          //     this.activeIndex = this.usecaseCopyArray[i].element_data.options.findIndex(data => data.default == true)
          //     if (UCitem[0].element_type == 'multiple_choice') {
          //       let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
          //       if (OptionSelected.length == 0) {
          //         UCitem12[0].default = true;
          //       }
          //     } else {
          //       if (UCitem[0].element_type == 'address') {
          //         if (UCitem[0].element_data.city == "" || UCitem[0].element_data.street_address1 == "" || UCitem[0].element_data.state == "" || UCitem[0].element_data.zip == "" || UCitem[0].element_data.street_address2 == "") {
          //           this.datas[i].element_data.options.forEach(element => {
          //             element.default = false;
          //           });
          //           UCitem12[0].default = true;
          //         } else {
          //           if (this.activeIndex != -1) {
          //             this.datas[i].element_data.options.forEach(element => {
          //               element.default = false;
          //             });
          //             this.datas[i].element_data.options[this.activeIndex].default = true
          //           } else {
          //             this.datas[i].element_data.options.forEach(element => {
          //               element.default = false;
          //             });
          //           }
          //         }
          //       } else {
          //         if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
          //           this.datas[i].element_data.options.forEach(element => {
          //             element.default = false;
          //           });
          //           UCitem12[0].default = true;
          //         } else {
          //           if (this.activeIndex != -1) {
          //             this.datas[i].element_data.options.forEach(element => {
          //               element.default = false;
          //             });
          //             this.datas[i].element_data.options[this.activeIndex].default = true
          //           } else {
          //             this.datas[i].element_data.options.forEach(element => {
          //               element.default = false;
          //             });
          //           }
          //         }
          //       }
          //     }
          //   }
          //   else {
          //     if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
          //       let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
          //       this.datas[i].element_data.default_value = this.usecaseCopyArray[i].element_data.default_value;
          //       if (OptionSelected.length == 0) {
          //         this.datas[i].element_data.default_value = this.current_if_value;
          //       }
          //     }
          //     else {
          //       this.datas[i].element_data.default_value = this.usecaseCopyArray[i].element_data.default_value;
          //       if (UCitem[0].element_type == 'address') {
          //         if (UCitem[0].element_data.city == "" && UCitem[0].element_data.street_address1 == "" && UCitem[0].element_data.state == "" && UCitem[0].element_data.zip == "" && UCitem[0].element_data.street_address2 == "") {
          //           this.datas[i].element_data.default_value = this.current_if_value;
          //         }
          //       } else {
          //         if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
          //           this.datas[i].element_data.default_value = this.current_if_value;
          //         }
          //       }
          //     }
          //   }
          // }
        }
      }
      console.log(this.datas);
    }
  }
  Extend_process_use_conditions() {
    if (this.change == undefined) {
      this.change = []
    }
    this.datas = [...this.change, ...this.extend_model.attributes];
    for (let i = 0; i < this.datas.length; i++) {
      this.editIndex = i;
      // if(this.datas[i].element_data.default_date_time=="current"){
      //   this.datas[i].element_data.default_date_time=new Date();
      // }
      // else{

      // }
      if (this.datas[i].element_data.use_conditions == true) {
        this.condition_field_name = this.datas[i].element_data.if_condition;
        this.current_if_value = this.datas[i].element_data.if_value;
        this.current_if_do = this.datas[i].element_data.if_do;
        this.current_if_state = this.datas[i].element_data.if_state;
      } else {
        this.condition_field_name = ""
        this.current_if_value = ""
        this.current_if_do = ""
        this.current_if_state = ""
      }
      if (this.condition_field_name != "") {
        let UCitem = this.datas.filter((ele => ele['element_uuid'] == this.condition_field_name))
        if (UCitem.length > 0) {
          if (UCitem[0].element_data.default_value == null) {
            UCitem[0].element_data.default_value = ""
          }
        } else {
          this.condition_field_name = ""
        }
        if (this.current_if_state == 'is equal to') {
          if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'single_choice') {
            //if (this.current_if_value == UCitem[0].element_data.default_value) {
            let multyOpt = UCitem[0].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
            if (multyOpt.length > 0) {
              if (this.current_if_do == "hide") {
                if (multyOpt.length > 0 && multyOpt[0].default == false) {
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
        } else if (this.current_if_state == 'is not equal to')//  Not equal to 
        {
          if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'single_choice') {
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
        //  Is filled  or empty
        else if (this.current_if_state == 'is filled') {
          if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown') {
            //if (this.current_if_value == UCitem[0].element_data.default_value) {
            let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default == true))
            if (multyOpt.length > 0) {
              this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" : "0";
            }//  if option is filled 
            else {
              this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" : "1";
            }
          } else {
            if (UCitem[0].element_data.default_value != '') // other fields check if filled
            {
              this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" : "0";
            } else {
              this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" : "1";
            }
          }
        }// if filled over 
        else if (this.current_if_state == 'is empty') {
          if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown') {
            //if (this.current_if_value == UCitem[0].element_data.default_value) {
            let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default == true))
            if (multyOpt.length == 0) {
              this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" : "0";
            }//  if option is filled 
            else {
              this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" : "1";
            }
          } else {
            if (UCitem[0].element_data.default_value == '') // other fields check if filled
            {
              this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" : "0";
            } else {
              this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" : "1";
            }
          }
        }// if empty over 
        // else if (this.current_if_state == 'is filled') //  Is filled  
        // {

        //   if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown' || this.datas[i].element_type == 'checkbox') {
        //     let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
        //     let defaultOptions = this.usecaseCopyArray[i].element_data.options.filter((ele => ele.default == true))
        //     this.activeIndex = this.usecaseCopyArray[i].element_data.options.findIndex(data => data.default == true)
        //     let redioIndex = this.datas[i].element_data.options.findIndex((ele => ele.element_uuid == this.current_if_value))
        //     if (UCitem[0].element_type == 'multiple_choice') {
        //       let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
        //       UCitem12[0].default = false;
        //       this.datas[i].element_data.default_value = null
        //       if (OptionSelected.length > 0) {
        //         this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
        //         UCitem12[0].default = true;
        //       }
        //     } else {
        //       if (UCitem[0].element_type == 'address') {
        //         if (UCitem[0].element_data['city'] != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data['state'] != "" || UCitem[0].element_data['zip'] != "" || UCitem[0].element_data.street_address2 != "") {
        //           this.datas[i].element_data.options.forEach(element => {
        //             element.default = false;
        //           });
        //           this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
        //           UCitem12[0].default = true;
        //         } else {
        //           if (this.activeIndex != -1) {
        //             this.datas[i].element_data.options.forEach(element => {
        //               element.default = false;
        //             });
        //             this.datas[i].element_data.options[this.activeIndex].default = true
        //           } else {
        //             this.datas[i].element_data.options.forEach(element => {
        //               element.default = false;
        //             });
        //           }
        //         }
        //       } else {
        //         // UCitem12[0].default = false;
        //         // this.datas[i].element_data.default_value = null
        //         if ((UCitem[0].element_data.default_value != null) && (UCitem[0].element_data.default_value != "")) {
        //           this.datas[i].element_data.options.forEach(element => {
        //             element.default = false;
        //           });
        //           this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
        //           UCitem12[0].default = true;
        //         } else {
        //           if (this.activeIndex != -1) {
        //             this.datas[i].element_data.options.forEach(element => {
        //               element.default = false;
        //             });
        //             this.datas[i].element_data.options[this.activeIndex].default = true
        //           } else {
        //             this.datas[i].element_data.options.forEach(element => {
        //               element.default = false;
        //             });
        //           }
        //         }
        //       }
        //     }
        //   }
        //   else {
        //     if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
        //       let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
        //       this.datas[i].element_data.default_value = this.usecaseCopyArray[i].element_data.default_value;
        //       if (OptionSelected.length > 0) {
        //         this.datas[i].element_data.default_value = this.current_if_value;
        //       }
        //     }
        //     else {

        //       this.datas[i].element_data.default_value = this.usecaseCopyArray[i].element_data.default_value;
        //       if (UCitem[0].element_type == 'address') {
        //         if (UCitem[0].element_data['city'] != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data['state'] != "" || UCitem[0].element_data['zip'] != "" || UCitem[0].element_data.street_address2 != "") {
        //           this.datas[i].element_data.default_value = this.current_if_value;
        //         }
        //       } else {
        //         if (UCitem[0].element_data.default_value != null && UCitem[0].element_data.default_value != "") {
        //           this.datas[i].element_data.default_value = this.current_if_value;
        //         }
        //       }
        //     }
        //   }
        // } else if (this.current_if_state == 'is empty') // Is empty
        // {
        //   if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown') {
        //     let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
        //     this.activeIndex = this.usecaseCopyArray[i].element_data.options.findIndex(data => data.default == true)
        //     if (UCitem[0].element_type == 'multiple_choice') {
        //       let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
        //       if (OptionSelected.length == 0) {
        //         UCitem12[0].default = true;
        //       }
        //     } else {
        //       if (UCitem[0].element_type == 'address') {
        //         if (UCitem[0].element_data.city == "" || UCitem[0].element_data.street_address1 == "" || UCitem[0].element_data.state == "" || UCitem[0].element_data.zip == "" || UCitem[0].element_data.street_address2 == "") {
        //           this.datas[i].element_data.options.forEach(element => {
        //             element.default = false;
        //           });
        //           UCitem12[0].default = true;
        //         } else {
        //           if (this.activeIndex != -1) {
        //             this.datas[i].element_data.options.forEach(element => {
        //               element.default = false;
        //             });
        //             this.datas[i].element_data.options[this.activeIndex].default = true
        //           } else {
        //             this.datas[i].element_data.options.forEach(element => {
        //               element.default = false;
        //             });
        //           }
        //         }
        //       } else {
        //         if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
        //           this.datas[i].element_data.options.forEach(element => {
        //             element.default = false;
        //           });
        //           UCitem12[0].default = true;
        //         } else {
        //           if (this.activeIndex != -1) {
        //             this.datas[i].element_data.options.forEach(element => {
        //               element.default = false;
        //             });
        //             this.datas[i].element_data.options[this.activeIndex].default = true
        //           } else {
        //             this.datas[i].element_data.options.forEach(element => {
        //               element.default = false;
        //             });
        //           }
        //         }
        //       }
        //     }
        //   }
        //   else {
        //     if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
        //       let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
        //       this.datas[i].element_data.default_value = this.usecaseCopyArray[i].element_data.default_value;
        //       if (OptionSelected.length == 0) {
        //         this.datas[i].element_data.default_value = this.current_if_value;
        //       }
        //     }
        //     else {
        //       this.datas[i].element_data.default_value = this.usecaseCopyArray[i].element_data.default_value;
        //       if (UCitem[0].element_type == 'address') {
        //         if (UCitem[0].element_data.city == "" && UCitem[0].element_data.street_address1 == "" && UCitem[0].element_data.state == "" && UCitem[0].element_data.zip == "" && UCitem[0].element_data.street_address2 == "") {
        //           this.datas[i].element_data.default_value = this.current_if_value;
        //         }
        //       } else {
        //         if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
        //           this.datas[i].element_data.default_value = this.current_if_value;
        //         }
        //       }
        //     }
        //   }
        // }
      }
    }
    console.log(this.datas);
    var emptycell = this.datas.filter(data => data.is_hidden == "1");
    if (emptycell.length > 0) {
      for (var i = 0; i < emptycell.length; i++) {
        var referenceidss = emptycell[i].element_data.reference_id;
        var findingelementid = this.datas.filter(data => data.element_uuid == referenceidss);
        if (findingelementid[0].element_type == "empty_cell") {
          findingelementid[0].is_hidden = "1";
        }
      }
    }
    let dummy_model = [];
    let attribute_model = [];
    for (let i = 0; i < this.extend_model.attributes.length; i++) {
      let filter_element = this.datas.filter(data => data.element_uuid == this.extend_model.attributes[i].element_uuid);
      if (filter_element != null) {
        dummy_model.push(filter_element[0]);
      }
    }
    this.extend_model.attributes = _.cloneDeep(dummy_model);

    for (let i = 0; i < this.change.length; i++) {
      let filter_element = this.datas.filter(data => data.element_uuid == this.change[i].element_uuid);
      if (filter_element != null) {
        attribute_model.push(filter_element[0]);
      }
    }
    this.change = _.cloneDeep(attribute_model);
    //this.modelFieldsForm = this.datas
  }

  //adding or updating form
  publish1() {
    if (this.extend != 1) {
      this.change = this.usecaseCopyArray
    }
    this.publish();
  }
  alignmenprocess() {
    let check_condition = ["false", false, 0, "0"];
    let column_one = _.cloneDeep(this.change);
    let column_two = _.cloneDeep(this.extend_model.attributes);

    column_one = column_one.filter((data) => data.is_removed == 0 || data.is_removed == "0");
    column_two = column_two.filter((data) => data.is_removed == 0 || data.is_removed == "0");

    let elements_height = _.cloneDeep(this.element_details);


    for (let i = 0; i < column_one.length; i++) {

      let temp_extend_holder = column_two.filter(ele => ele["element_data"].reference_id == column_one[i].element_uuid);
      let index = column_two.indexOf(temp_extend_holder[0]);
      if(index == -1){
				index  = i ;
			}
			if(column_one[i].element_type == 'uti-entry-field-WMATA_WELD'){
                break;
			}
      let ele_one = this.element_details.filter(data => data.element_name == column_one[i].element_type);
      let ele_two = this.element_details.filter(data => data.element_name == column_two[index].element_type);

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


    this.change = column_one;
    this.extend_model.attributes = column_two;

  }
    checkAlign_usecase() {
      let weldformindex = this.change.findIndex((id) => id.element_type == "uti-entry-field-WMATA_WELD");
      if(weldformindex == -1){
        return
      }
      let check_condition = ["false", false, 0, "0"];
      let column_one = _.cloneDeep(this.change);
      let column_two = _.cloneDeep(this.extend_model.attributes);
      column_one = column_one.filter((data) => data.is_removed == 0 || data.is_removed == "0");
      column_two = column_two.filter((data) => data.is_removed == 0 || data.is_removed == "0");
      let cloneLeftColumn = _.cloneDeep(column_one);
      let cloneRighttColumn = _.cloneDeep(column_two);
      let cloneLeft1 = _.cloneDeep(column_one);
      let cloneRightt1 = _.cloneDeep(column_two);
      // cloneLeftColumn = cloneLeftColumn.filter(id => id.element_type != "empty_cell")
      // cloneRighttColumn = cloneRighttColumn.filter(id => id.element_type != "empty_cell")
      let elements_height = _.cloneDeep(this.element_details);
      cloneRighttColumn = cloneRighttColumn.filter(id => id.element_type != "uti-entry-field-WMATA_WELD");
      let useConditionsCheck = [...cloneLeftColumn, ...cloneRighttColumn];
      cloneRighttColumn.forEach((data, index) => {
        let check = data.element_data.use_conditions;
        let hiddenCheck = Number(data.is_hidden);
        let uuid = cloneRighttColumn[index].element_uuid;
        let id_index = this.useCaseEmptycellIds.indexOf(uuid);
        if(check === true && hiddenCheck == 0){
                  console.log(hiddenCheck);
          let usecaseEmptycell = cloneRighttColumn.filter((id) => id.clone_uuid == uuid);
          if(usecaseEmptycell.length > 0){
                     if(usecaseEmptycell[0].clone_uuid == uuid){
            console.log(cloneRighttColumn)
            let origIndex = cloneRightt1.findIndex((id) => id.clone_uuid == uuid && id.element_type == "empty_cell_useCase")
            if(origIndex != -1){
                          cloneRightt1.splice(origIndex,1);
              let id_index = this.useCaseEmptycellIds.indexOf(uuid);
              if(id_index != -1){
               this.useCaseEmptycellIds.splice(id_index,1)
              }
            }
             }
          }
        }
        else if (check === true && !this.useCaseEmptycellIds.includes(uuid)) {
          const refId = data.element_data.reference_id;
          const indexcolumn = useConditionsCheck.findIndex((id) => id.element_uuid == refId);
          if (indexcolumn != -1) {
            console.log("Aaaaaaa");
            console.log(index);
            let height = useConditionsCheck[indexcolumn].height;
            // let uuid = cloneRighttColumn[index].element_uuid;
            let clonemodel = _.cloneDeep(this.clone_model_useconditions);
            clonemodel.height = height;
            clonemodel.clone_uuid = uuid;
            this.useCaseEmptycellIds.push(uuid);
            clonemodel.element_uuid = this.dataService.generateUUID();
            cloneRightt1.splice(index, 0, clonemodel)
          }
        }
      })
      cloneLeftColumn.forEach((data, index) => {
        let check = data.element_data.use_conditions;
        let hiddenCheck = Number(data.is_hidden);
        let uuid = cloneLeftColumn[index].element_uuid;
        if(check === true && hiddenCheck == 0){
                  console.log(hiddenCheck);
          let usecaseEmptycell = cloneLeftColumn.filter((id) => id.clone_uuid == uuid);
          if(usecaseEmptycell.length > 0){
                     if(usecaseEmptycell[0].clone_uuid == uuid){
            console.log(cloneLeftColumn)
            let origIndex = cloneLeft1.findIndex((id) => id.clone_uuid == uuid && id.element_type == "empty_cell_useCase")
            if(origIndex != -1){
                          cloneLeft1.splice(origIndex,1);
              let id_index = this.useCaseEmptycellIds.indexOf(uuid);
              if(id_index != -1){
               this.useCaseEmptycellIds.splice(id_index,1)
              }
            }
             }
          }
        }
        else if (check === true && !this.useCaseEmptycellIds.includes(uuid)) {
          const refId = data.element_data.reference_id;
          const indexcolumn = useConditionsCheck.findIndex((id) => id.element_uuid == refId);
          if (indexcolumn != -1) {
            console.log("Aaaaaaa");
            console.log(index);
            let height = useConditionsCheck[indexcolumn].height;
            // let id = cloneLeftColumn[indexcolumn].element_uuid;
            let clonemodel = _.cloneDeep(this.clone_model_useconditions)
            clonemodel.height = height;
            clonemodel.clone_uuid = uuid;
            this.useCaseEmptycellIds.push(uuid);
            clonemodel.element_uuid = this.dataService.generateUUID();
            cloneLeft1.splice(index, 0, clonemodel)
          }
  
        }
      })
      this.change = cloneLeft1;
      this.extend_model.attributes = cloneRightt1;
    }
  getdropdownvalue(dropdown){
    if(dropdown==''){
    console.log(dropdown)
    return false;
    }else{
      return true;
    }
  }
  //default value & minimum value
  numbers(id) {

    let end: any = document.getElementById(id);
    var len = end.value.length;
    if (end.setSelectionRange) {
      end.focus();
      end.setSelectionRange(len, len);
      end.select();
    }
    // } else if (end.select) {
    end.select();
    // t.collapse(true);
    // t.moveEnd('character', len);
    // t.moveStart('character', len);
    // t.select();
    //}



    this.inputBox = document.getElementById(id);

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

  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    // let check = Number(pastedText);
    // console.log(check)

    // returns true if NaN, otherwise false
    if (isNaN(+pastedText)) {
      return false
    } else {
      return pastedText
    }
  }

  getcalculationvalue(element_data) {
    return this.dataService.getcalculationvalue(element_data);
  }

  timber_form_changes(default_values) {
    let get_custom_field_Index = this.usecaseCopyArray.findIndex((f_data) => f_data.element_type == "uti-entry-field-TIMBER");
    if (get_custom_field_Index > -1) {
      let send_new_values = default_values;
      this.usecaseCopyArray[get_custom_field_Index].element_data["default_values"] = send_new_values;
      console.log(send_new_values);
    }
  }
  setdefaultform(event) {
    if (event.target.checked == true) {
      this.setformasdefault = true;
    }
    else {
      this.setformasdefault = false;
    }
  }
  jsonFormater(form_fields) {
    let get_form_fields = form_fields;
    let final_form_data = [];
    if (get_form_fields != null) {
      if (Array.isArray(get_form_fields) == false) {
        final_form_data = JSON.parse(get_form_fields)
      }
      else {
        final_form_data = get_form_fields;
      }
    }
    return final_form_data;
  }

  merge_form_process(form_edited, formvalues, whichside: string) {
    let get_changes_form = _.cloneDeep(form_edited);
    let default_form_value = _.cloneDeep(formvalues);
    // value replace recent edit annotation attached forms
    for (let m = 0; m < default_form_value.length; m++) {
      let find_field_index = get_changes_form.findIndex((field) => field.element_uuid == default_form_value[m].element_uuid);
      if (find_field_index > -1) {
        if (default_form_value[m].is_removed == true || default_form_value[m].is_removed == "true") {
          get_changes_form = get_changes_form.filter(ele => ele['element_uuid'] != default_form_value[m]['element_uuid']);
        }
      if(default_form_value[m].is_removed != true && default_form_value[m].is_removed != "true"){
        if (default_form_value[m].element_type == 'single_choice' || default_form_value[m].element_type == 'dropdown') {
          if (default_form_value[m].element_data.options.length > 0) {
            // default_form_value[m].element_data.options.forEach(element1 => {
            //   element1.default = false;
            // });
            let defaultOptionValue = get_changes_form[find_field_index].element_data.options.filter((ele => ele.default == true))
            if (defaultOptionValue.length > 0) {
              var currentOption = default_form_value[m].element_data.options.filter((ele => ele.element_uuid == defaultOptionValue[0].element_uuid))
              if(currentOption.length > 0){
                default_form_value[m].element_data.options.forEach(element1 => {
                  element1.default = false;
                });
              }
              currentOption[0].default = true;
            }
          }
        } else if (default_form_value[m].element_type == 'multiple_choice' || default_form_value[m].element_type == 'checkbox') {
          // default_form_value[m].element_data.options.forEach(element1 => {
          //   element1.default = false;
          // });
          let UCitemDefault = get_changes_form[find_field_index].element_data.options.filter((ele => ele.default == true))
          if(UCitemDefault.length > 0){
            default_form_value[m].element_data.options.forEach(element1 => {
              element1.default = false;
            });
          }
          UCitemDefault.forEach(element2 => {
            var currentOption = default_form_value[m].element_data.options.filter((ele => ele.element_uuid == element2.element_uuid))
            if(currentOption.length > 0){
              currentOption[0].default = true;
            }
           
          });
        } else if (default_form_value[m].element_type == 'date') {
          if (get_changes_form[find_field_index].element_data.default_date_time != "" && get_changes_form[find_field_index].element_data.default_date_time != "none" && get_changes_form[find_field_index].element_data.default_date_time != "current") {
            default_form_value[m].element_data.default_value = new Date(get_changes_form[find_field_index].element_data.default_date_time).toISOString();
            default_form_value[m].element_data.default_date_time = new Date(get_changes_form[find_field_index].element_data.default_date_time).toISOString();
          }
          else if (default_form_value[m].element_data.default_date_time != "") {
            if (default_form_value[m].element_data.default_date_time == "none" || default_form_value[m].element_data.default_date_time == "current") {
              //FieldFind[0].element_data.default_value = this.assignDates(FieldFind[0].element_data.default_date_time)
            }
            else {
              default_form_value[m].element_data.default_date_time = new Date(default_form_value[m].element_data.default_date_time).toISOString();
            }
          }
        }
        else if (default_form_value[m].element_type == 'uti-entry-field') {
          default_form_value[m].element_data.default_values = get_changes_form[find_field_index].element_data['default_values']
        }
        else if (default_form_value[m].element_type == 'uti-entry-field-WMATA' || default_form_value[m].element_type == 'uti-entry-field-TIMBER'
        || default_form_value[m].element_type == 'uti-entry-field-WMATA_WELD') {
          default_form_value[m].element_data.default_values = get_changes_form[find_field_index].element_data['default_values']
        }
        else if (default_form_value[m].element_type == 'address') {

          default_form_value[m].element_data.street_address1 = get_changes_form[find_field_index].element_data.street_address1
          default_form_value[m].element_data.city = get_changes_form[find_field_index].element_data["city"]
          default_form_value[m].element_data.state = get_changes_form[find_field_index].element_data["state"]
          default_form_value[m].element_data.zip = get_changes_form[find_field_index].element_data["zip"]
          default_form_value[m].element_data.street_address2 = get_changes_form[find_field_index].element_data.street_address2
        }
        else {
          if (get_changes_form[find_field_index].element_data.default_value != undefined && get_changes_form[find_field_index].element_data.default_value != null && get_changes_form[find_field_index].element_data.default_value != '') {
            default_form_value[m].element_data.default_value = get_changes_form[find_field_index].element_data.default_value
          }
        }
      }
      }
      // if left and right after dragging multi-column below else condition should work
      else if (find_field_index == -1 && this.extend != 0) {
        let extend_model_value = whichside == 'leftside' ? this.backupExtendFormData : this.backupFormData;
        let find_field_index_extend = extend_model_value.findIndex((field) => field.element_uuid == default_form_value[m].element_uuid);
        if (find_field_index_extend > -1) {
          if (default_form_value[m].element_type == 'single_choice' || default_form_value[m].element_type == 'dropdown') {
            if (default_form_value[m].element_data.options.length > 0) {
              // default_form_value[m].element_data.options.forEach(element1 => {
              //   element1.default = false;
              // });
              let defaultOptionValue = extend_model_value[find_field_index_extend].element_data.options.filter((ele => ele.default == true))
              if (defaultOptionValue.length > 0) {
                var currentOption = default_form_value[m].element_data.options.filter((ele => ele.element_uuid == defaultOptionValue[0].element_uuid))
                if(currentOption.length > 0){
                  default_form_value[m].element_data.options.forEach(element1 => {
                    element1.default = false;
                  });
                }
                currentOption[0].default = true;
              }
            }
          } else if (default_form_value[m].element_type == 'multiple_choice' || default_form_value[m].element_type == 'checkbox') {

            let UCitemDefault = extend_model_value[find_field_index_extend].element_data.options.filter((ele => ele.default == true))
            if(UCitemDefault.length > 0){
              default_form_value[m].element_data.options.forEach(element1 => {
                element1.default = false;
              });
            }
            UCitemDefault.forEach(element2 => {
              var currentOption = default_form_value[m].element_data.options.filter((ele => ele.element_uuid == element2.element_uuid))
              if(currentOption.length > 0){
                currentOption[0].default = true;
              }
            });
          } else if (default_form_value[m].element_type == 'date') {
            if (extend_model_value[find_field_index_extend].element_data.default_date_time != "" && extend_model_value[find_field_index_extend].element_data.default_date_time != "none" && extend_model_value[find_field_index_extend].element_data.default_date_time != "current") {
              default_form_value[m].element_data.default_value = new Date(extend_model_value[find_field_index_extend].element_data.default_date_time).toISOString();
              default_form_value[m].element_data.default_date_time = new Date(extend_model_value[find_field_index_extend].element_data.default_date_time).toISOString();
            }
            else if (default_form_value[m].element_data.default_date_time != "") {
              if (default_form_value[m].element_data.default_date_time == "none" || default_form_value[m].element_data.default_date_time == "current") {
                //FieldFind[0].element_data.default_value = this.assignDates(FieldFind[0].element_data.default_date_time)
              }
              else {
                default_form_value[m].element_data.default_date_time = new Date(default_form_value[m].element_data.default_date_time).toISOString();
              }
            }
          }
          else if (default_form_value[m].element_type == 'uti-entry-field') {
            default_form_value[m].element_data.default_values = extend_model_value[find_field_index_extend].element_data['default_values']
          }
          else if (default_form_value[m].element_type == 'uti-entry-field-WMATA' || default_form_value[m].element_type == 'uti-entry-field-TIMBER'
          || default_form_value[m].element_type == 'uti-entry-field-WMATA_WELD') {
            default_form_value[m].element_data.default_values = get_changes_form[find_field_index].element_data['default_values']
          }
          else if (default_form_value[m].element_type == 'address') {

            default_form_value[m].element_data.street_address1 = extend_model_value[find_field_index_extend].element_data.street_address1
            default_form_value[m].element_data.city = extend_model_value[find_field_index_extend].element_data["city"]
            default_form_value[m].element_data.state = extend_model_value[find_field_index_extend].element_data["state"]
            default_form_value[m].element_data.zip = extend_model_value[find_field_index_extend].element_data["zip"]
            default_form_value[m].element_data.street_address2 = extend_model_value[find_field_index_extend].element_data.street_address2
          } else {
            if (extend_model_value[find_field_index_extend].element_data.default_value != undefined &&
              extend_model_value[find_field_index_extend].element_data.default_value != null &&
              extend_model_value[find_field_index_extend].element_data.default_value != '') {
              default_form_value[m].element_data.default_value = extend_model_value[find_field_index_extend].element_data.default_value
            }
          }
        }
        // if left and right after dragging multi-column below else condition should work
        else if(find_field_index == -1 && this.extend !=0){
          let extend_model_value = whichside=='leftside' ? this.backupExtendFormData : this.backupFormData;
            let find_field_index_extend = extend_model_value.findIndex((field)=>field.element_uuid==default_form_value[m].element_uuid);
            if(find_field_index_extend > -1){
              if (default_form_value[m].element_type == 'single_choice' || default_form_value[m].element_type == 'dropdown') {
                  if(default_form_value[m].element_data.options.length > 0){
                    default_form_value[m].element_data.options.forEach(element1 => {
                      element1.default = false;
                    });
                    let defaultOptionValue = extend_model_value[find_field_index_extend].element_data.options.filter((ele => ele.default == true))
                    if (defaultOptionValue.length > 0) {
                      var currentOption = default_form_value[m].element_data.options.filter((ele => ele.element_uuid == defaultOptionValue[0].element_uuid))
                      currentOption[0].default = true;
                    }
                  }
              } else if (default_form_value[m].element_type == 'multiple_choice' || default_form_value[m].element_type == 'checkbox') {
                default_form_value[m].element_data.options.forEach(element1 => {
                  element1.default = false;
                });
                let UCitemDefault = extend_model_value[find_field_index_extend].element_data.options.filter((ele => ele.default == true))
                UCitemDefault.forEach(element2 => {
                  var currentOption = default_form_value[m].element_data.options.filter((ele => ele.element_uuid == element2.element_uuid))
                  currentOption[0].default = true;
                });
              } else if (default_form_value[m].element_type == 'date') {
                if (extend_model_value[find_field_index_extend].element_data.default_date_time != "" && extend_model_value[find_field_index_extend].element_data.default_date_time != "none" && extend_model_value[find_field_index_extend].element_data.default_date_time != "current") {
                  default_form_value[m].element_data.default_value = new Date(extend_model_value[find_field_index_extend].element_data.default_date_time).toISOString();
                  default_form_value[m].element_data.default_date_time = new Date(extend_model_value[find_field_index_extend].element_data.default_date_time).toISOString();
                } 
                else if (default_form_value[m].element_data.default_date_time != "") {
                  if (default_form_value[m].element_data.default_date_time == "none" || default_form_value[m].element_data.default_date_time == "current") {
                    //FieldFind[0].element_data.default_value = this.assignDates(FieldFind[0].element_data.default_date_time)
                  }
                    else {
                      default_form_value[m].element_data.default_date_time = new Date(default_form_value[m].element_data.default_date_time).toISOString();
                    }
                }
              }
              else if (default_form_value[m].element_type == 'uti-entry-field') {
                default_form_value[m].element_data.default_values = extend_model_value[find_field_index_extend].element_data['default_values']
              }
              else if (default_form_value[m].element_type == 'uti-entry-field-WMATA' || default_form_value[m].element_type == 'uti-entry-field-TIMBER'
              || default_form_value[m].element_type == 'uti-entry-field-WMATA_WELD') {
                default_form_value[m].element_data.default_values = extend_model_value[find_field_index_extend].element_data['default_values']
              }
              else if (default_form_value[m].element_type == 'address') {
    
                default_form_value[m].element_data.street_address1 = extend_model_value[find_field_index_extend].element_data.street_address1
                default_form_value[m].element_data.city = extend_model_value[find_field_index_extend].element_data["city"]
                default_form_value[m].element_data.state = extend_model_value[find_field_index_extend].element_data["state"]
                default_form_value[m].element_data.zip = extend_model_value[find_field_index_extend].element_data["zip"]
                default_form_value[m].element_data.street_address2 = extend_model_value[find_field_index_extend].element_data.street_address2
              } else {
                if(extend_model_value[find_field_index_extend].element_data.default_value != undefined && 
                  extend_model_value[find_field_index_extend].element_data.default_value != null && 
                  extend_model_value[find_field_index_extend].element_data.default_value != ''){
                  default_form_value[m].element_data.default_value = extend_model_value[find_field_index_extend].element_data.default_value
                }
              }
            }
          
        }
      }
    }
    // get_changes_form.forEach(element => {
    //   var FieldFind = default_form_value.filter(ele => ele['element_uuid'] == element['element_uuid']);
    //   //Fieldfind ==> overall form fields from form builder
    //   //element ==> edited form fields for the annotation 
    //   if (FieldFind.length > 0) {
    //     if (FieldFind[0].element_type == 'single_choice' || FieldFind[0].element_type == 'dropdown') {
    //       FieldFind[0].element_data.options.forEach(element1 => {
    //         element1.default = false
    //       });
    //       let defaultOptionValue = element.element_data.options.filter((ele => ele.default == true))
    //       if (defaultOptionValue.length > 0) {
    //         var currentOption = FieldFind[0].element_data.options.filter((ele => ele.element_uuid == defaultOptionValue[0].element_uuid))
    //         currentOption[0].default = true;
    //       }
    //     } else if (FieldFind[0].element_type == 'multiple_choice' || FieldFind[0].element_type == 'checkbox') {

    //       FieldFind[0].element_data.options.forEach(element1 => {
    //         element1.default = false
    //       });
    //       let UCitemDefault = element.element_data.options.filter((ele => ele.default == true))
    //       UCitemDefault.forEach(element2 => {
    //         var currentOption = FieldFind[0].element_data.options.filter((ele => ele.element_uuid == element2.element_uuid))
    //         currentOption[0].default = true;
    //       });
    //     } else if (FieldFind[0].element_type == 'date') {
    //       if (element.element_data.default_date_time != "" && element.element_data.default_date_time != "none" && element.element_data.default_date_time != "current") {
    //         FieldFind[0].element_data.default_value = new Date(element.element_data.default_date_time).toISOString();
    //         FieldFind[0].element_data.default_date_time = new Date(element.element_data.default_date_time).toISOString();
    //       } 
    //       else if (FieldFind[0].element_data.default_date_time != "") {
    //         if (FieldFind[0].element_data.default_date_time == "none" || FieldFind[0].element_data.default_date_time == "current") {
    //           //FieldFind[0].element_data.default_value = this.assignDates(FieldFind[0].element_data.default_date_time)
    //         }
    //           else {
    //             FieldFind[0].element_data.default_date_time = new Date(FieldFind[0].element_data.default_date_time).toISOString();
    //           }
    //       }
    //     }
    //     else if (FieldFind[0].element_type == 'uti-entry-field') {
    //       FieldFind[0].element_data.default_values = element.element_data['default_values']
    //     }
    //     else if (FieldFind[0].element_type == 'uti-entry-field-WMATA' || FieldFind[0].element_type == 'uti-entry-field-TIMBER') {
    //       FieldFind[0].element_data.default_values = element.element_data['default_values']
    //     }
    //     else if (FieldFind[0].element_type == 'address') {

    //       FieldFind[0].element_data.street_address1 = element.element_data.street_address1
    //       FieldFind[0].element_data.city = element.element_data["city"]
    //       FieldFind[0].element_data.state = element.element_data["state"]
    //       FieldFind[0].element_data.zip = element.element_data["zip"]
    //       FieldFind[0].element_data.street_address2 = element.element_data.street_address2
    //     } else {
    //       FieldFind[0].element_data.default_value = element.element_data.default_value
    //     }
    //   }

    // });
    return default_form_value;
  }

  changespecial_character(convert_form_datas) {
    let final_form_datas = convert_form_datas;
    if (final_form_datas != null && final_form_datas != undefined && final_form_datas.length > 0) {
      let get_response_form_data = final_form_datas;
      let get_change_char_sptoquotes = this.dataService.formfieldviewcharacter(get_response_form_data, 'formbuilderfieldsview');
      final_form_datas = get_change_char_sptoquotes;
    }
    return final_form_datas;
  }
    //welddata
    // To delete the row of the table in weld wmata form
  deleterow(index,item){
    this.finalArrayWeld
   console.log(index);
   let copyFormLeft = _.cloneDeep(this.formContentleft);
   if(this.formContentleft.length > index){
    this.formContentleft = [];
    copyFormLeft.splice(index,1);
    this.formContentleft = copyFormLeft;
   }
   if(this.formContentright.length > index){
    this.formContentright.splice(index,1)
   }
   
   var copy = []; 
   if(this.finalArrayWeld.length > 0){
    this.finalArrayWeld.splice(index,1);
    copy = this.finalArrayWeld;
   }
   else if(item.element_data.hasOwnProperty('default_values') && item.element_data.default_values.length > 0){
    let defaultValues = item.element_data.default_values;
    if(defaultValues.length > 0){
      copy = _.cloneDeep(defaultValues);
      copy.splice(index,1);
    }
   }
   this.useConditionChange(item, item.element_uuid,copy, "delete");
  }
  // To add new row in tha table in weld wmata form
  add(){
    console.log("success");
    this.formShow = true;
    console.log(this.weld_FormStructure);
    this.setDefault();
  }
  // To split the user enetered table values of the row into two columns in weld wmata form
  splitarray(value){
    for(let v = 0;v < value.length;v++){
      let dataleft = {
        Weld: value[v].weld_Id,
        Repair: value[v].repair,
        Entire : value[v].area_Entire,
        uuid : value[v].element_uuid,
      }
      let dataright = {
        Specific: value[v].area_Specific,
        Interpretation: value[v].interpretation,
        Remarks: value[v].remarks,
        uuid : value[v].element_uuid,
      }
      this.formContentleft.push(dataleft);
      this.formContentright.push(dataright);
    }
  }
  // To update the form values of weld wmata form.
  onSubmit(formdata,item){
    this.formShow = false;
    const result = this.checkemptyornot(formdata.value);
    if(result === true){
      return;
    }
    this.fieldsWeld = item.element_data.fields;
    console.log(formdata.value);
    const formValues = formdata.value;
    let cloneFormValue = _.cloneDeep(formValues);
    let convertUUID = this.custom_form_make_uuid_weld(cloneFormValue); 
    let convert_formStructure = this.defaultAPI_structure_maintain(formValues);
    // this.formValuesArray.push(convertUUID)
    let formValuesArray = []
    formValuesArray.push(convertUUID)
    console.log(this.formContentleft);
    console.log(this.formContentright);
    this.useConditionChange(item, item.element_uuid, formValuesArray, null);
    // this.finalArrayWeld.push(convertUUID);
    let formvalueobject = [];
    formvalueobject.push(convert_formStructure)
    this.splitarray(formvalueobject);
  }
  // To check whether user entered any values in table
  checkemptyornot(rowvalues){
     const values = _.cloneDeep(rowvalues);
     const valuesAll = Object.keys(values).map(key => values[key] == "" );
     const abc = valuesAll.includes(false)
     if (abc === false){
      return true;
     }
     return false;
  }
  defaultAPI_structure_maintain(formValues){
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
                if(value === true){
                  sampleObject.area_Entire = "true";
                }
                else{
                  sampleObject.area_Entire = "";
                }
                break;
              case 'Interpretation':
                let getOptions = this.fieldsWeld[j].options;
                let index = getOptions.findIndex((id) => id.element_uuid == formValues[i][key]);
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
  custom_form_make_uuid_weld(formValue){
    const formFields = _.cloneDeep(this.fieldsWeld);
    for(let data in formValue){
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
        case  'areaEntire':
          const index6 = formFields.findIndex((id) => id.table_name == "Entire");
          let checkBoxBoolean = false;
          if(formValue[data] == true){
            checkBoxBoolean = true;
          }
          formValue[formFields[index6].element_uuid] = checkBoxBoolean;
          delete formValue[data];
      } 
    }
    return formValue;
  }
  // To set the variables to null in weld wmata form.
  setDefault(){
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
}
