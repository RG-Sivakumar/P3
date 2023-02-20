import { Component, ElementRef, OnInit, Inject, EventEmitter } from "@angular/core";
import { FormdataService } from "../services/formdata.service";
import { MatDialogRef,MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedService } from "src/app/shared/shared.service";
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import { DatePipe } from "@angular/common";
import { FormControl, NG_VALIDATORS } from "@angular/forms";
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core'
import * as _ from 'lodash';
import { FormGroup } from '@angular/forms';
import { weld_form_main } from '../../commonshared/components/weldform/weldform_main.model'


import {
	DateAdapter,
	MAT_DATE_LOCALE,
	NativeDateAdapter,
} from "@angular/material/core";
import { data } from "jquery";
import { MatDatepicker } from "@angular/material/datepicker";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { timeHours } from "d3";
import { DataService } from "src/app/data.service";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
const moment = _rollupMoment || _moment;
export class CustomDateAdapter extends NativeDateAdapter {
	format(date: Date, displayFormat: Object): string {
		var formatString = "YYYY-MM-DD";
		return moment(date).format(formatString);
	}
}
@Component({
	selector: "app-formdesign",
	templateUrl: "./formdesign.component.html",
	styleUrls: ["./formdesign.component.css"],
	providers: [
		DatePipe,
		{ provide: MAT_DATE_LOCALE, useValue: "en-GB" },
		{
			provide: DateAdapter,
			useClass: CustomDateAdapter,
		},
		{ provide: NG_VALIDATORS, useExisting: FormdesignComponent, multi: true },
	],
})
export class FormdesignComponent implements OnInit {
	/*ngAfterContentChecked() : void {
		this.attributess.detectChanges();
	}
	*/
	use_conditionDate: string;
	success: boolean;
	hide1: boolean = true
	hide3: boolean = true;
	models: any;
	Results: any
	datas: any;
	condition_field_name: any;
	current_if_value: string;
	current_if_state: string;
	current_if_do: string;
	editIndex: any;
	numField: any;
	DummyField: any;
	FieldResult: any;
	defaultArrray: any;
	activeIndex: any;
	showHtmlFields: boolean;
	finalArray: any = []
	finalArray1: any = []
	finalArray2: any = []
	outputArray: any = []
	unratedQuantity: number = null;
	csValue: number = 0;
	conditionSelected: string;
	csSelected: string;
	fieldQuantity: number;
	countedCheck: boolean;
	itemIndexNumber: number=-1;
	totalElementQuantity: number = 0;
	userrole:any;
	projectid: string;
	savebuttoncheck: boolean=false;
	inputBox: any;
	extend: any;
	dummy: any;
	editButton: boolean=false;
	extend_model: any;
	visible : any = "hidden";
	elements_combined :any ;
	custome_form_object = { "location": "", "decibels": "", "previouscondition": "", "flagforrReview": "", "Condition": "", "Comment": "" };
	element_details : any =[
		{element_name:"single_line_text", width : 223, height : 66},
		{element_name : "text_area",
		 width : 223,
		 height : 90
	   },
	   {element_name : "number",
		 width : 223,
		 height : 66
	   },
	   { element_name :"text_label", 
		 width : 223,
		height : 28
	   },
	   {element_name : "empty_cell",
		 width : 0,
		 height : 0
	   },
		{element_name : "Divider",
		 width : 223,
		 height : 30
	   }
	   , {
		 element_name : "checkbox",
		 element_alias_name : 'option 1',
		 width : 223,
		 height : 20
	   }
	   , {
		 element_name : "dropdown",
		 width : 223,
		 height : 86
	   }
	   , {
		 element_name : "single_choice",
		 width : 223,
		 height : 112
	   }
	   , {
		 element_name : "multiple_choice",
		 width : 223,
		 height : 112
	   }
	  ,{
	   element_name : "date",
	   width : 223,
	   height : 66
	 }, {
	   element_name : "calculation",
	   width : 223,
	   height : 66
	 },
		{
		 element_name : "address",
		 width : 223,
		 height : 210
	   }
	 ];
	combinedArray: any[];
	timber_form_data = [];
	wmataweld: boolean = false;
	clone_model = {
        element_type: "empty_cell",
        element_name: "empty_cell",
        element_uuid: '',
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
	//welddata
	left: boolean = false;
	right: boolean = false;
	formContentleft: any[] = [];
	formContentright: any[] = [];
	// show: boolean = false;
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
	useCaseEmptycellIds: any[] = []
	formFields_weld: any[] = ["checkbox", "single_choice", "date", "multiple_choice", "dropdown"];
	constructor(
		private formdataservice: FormdataService,
		private dialog: MatDialogRef<FormdesignComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private cd: ChangeDetectorRef,
		private sharedService: SharedService,
		public userRoleGlobal: GlobalUserRoleService,
		public dataService:DataService,
		private dataService_doc:DataserviceService,
		private encrptdecrpt:EncryptDecryptService
	) {
		this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
		// this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
		this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole) => {
			this.userrole = res_userrole;
		})
		this.extend = data.is_extend;
		this.model = data.model;
		this.extend_model = data.extend_model;
		console.log(this.finalArray1);
	}

	model;
	attributess: any;

	ngOnInit() {
		this.getdata();
		this.FormulaCalc();
		if(this.extend==true)
		{
			this.alignmenprocess();
			this.checkAlign_usecase();
		}
	}
	getdata() {
		this.model = this.formdataservice.get();
		this.defaultArrray = _.cloneDeep(this.model.attributes);
		this.attributess = _.cloneDeep(this.model.attributes);
		this.dummy= _.cloneDeep(this.extend_model.attributes);
		this.elements_combined = [...this.attributess,...this.dummy];
		this.combinedArray=[...this.attributess,...this.dummy];
		console.log(this.defaultArrray);
		if(this.extend==true){
			if (this.elements_combined.length > 0) {
				for (let v = 0; v < this.elements_combined.length; v++) {
					if (this.elements_combined[v].element_type == "date") {
						this.elements_combined[v].element_data.default_date_time = this.assignDates(this.elements_combined[v].element_data.default_date_time)
	
						// if(this.attributess[v].element_data.default_date_time==undefined){
						// 	console.log("how")
						// 	this.attributess[v].element_data.default_date_time= new Date();
						// 	console.log(this.attributess[v].element_data.default_date_time)
						// }
					}
					if (this.elements_combined[v].element_data.label_text == "Total Element Quantity") {
						this.totalElementQuantity = Number(this.elements_combined[v].element_data.default_value);
						// this.htmlcalculation();
					}
					if (this.elements_combined[v].element_type == "uti-entry-field" ||
					 this.elements_combined[v].element_type == "uti-entry-field-WMATA_WELD") {
						for (let k = 0; k < this.elements_combined[v].element_data.fields.length; k++) {
							if (this.elements_combined[v].element_data.fields[k].element_type == "single_choice") {
								for (let j = 0; j < this.elements_combined[v].element_data.fields[k].element_data.options.length; j++) {
									this.outputArray.push({ 'id': this.elements_combined[v].element_data.fields[k].element_data.options[j].element_uuid, 'key': this.elements_combined[v].element_data.fields[k].element_data.options[j].name, 'value': 0 })
								}
							}
						}
						if(this.elements_combined[v].element_type == "uti-entry-field-WMATA_WELD")
						{
							this.wmataweld = true;
							const fields = this.elements_combined[v].element_data.fields;
							this.fieldsWeld = fields; 
						}
					}
				}
			}
		}
		else{
			if (this.attributess.length > 0) {
				for (let v = 0; v < this.attributess.length; v++) {
					if (this.attributess[v].element_type == "date") {
						this.attributess[v].element_data.default_date_time = this.assignDates(this.attributess[v].element_data.default_date_time)
	
						// if(this.attributess[v].element_data.default_date_time==undefined){
						// 	console.log("how")
						// 	this.attributess[v].element_data.default_date_time= new Date();
						// 	console.log(this.attributess[v].element_data.default_date_time)
						// }
					}
					if (this.attributess[v].element_data.label_text == "Total Element Quantity") {
						this.totalElementQuantity = Number(this.attributess[v].element_data.default_value);
						// this.htmlcalculation();
					}
					if (this.attributess[v].element_type == "uti-entry-field") {
						for (let k = 0; k < this.attributess[v].element_data.fields.length; k++) {
							if (this.attributess[v].element_data.fields[k].element_type == "single_choice") {
								for (let j = 0; j < this.attributess[v].element_data.fields[k].element_data.options.length; j++) {
	
									this.outputArray.push({ 'id': this.attributess[v].element_data.fields[k].element_data.options[j].element_uuid, 'key': this.attributess[v].element_data.fields[k].element_data.options[j].name, 'value': 0 })
								}
							}
						}
					}
					else if(this.attributess[v].element_type == "uti-entry-field-TIMBER"){
						this.timber_form_data = this.attributess;
					}
				}
			}
		}
		
		console.log(this.attributess);
		if(this.extend==false)
		{
            this.process_use_conditions();
		}
		else
		{
			this.Extend_process_use_conditions()
		}
		
	}

	//Starting the use condition
	 process_use_conditions() {
		this.datas = this.attributess;
		console.log(this.datas)
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

				if (this.current_if_state == 'is equal to') {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox') {
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

						if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown') {
							let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default == true))
							if (multyOpt.length > 0) {
								if (multyOpt.length > 0 && multyOpt[0].default == true) {
									this.datas[i].is_hidden = "1";
								} else {
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
				}
				else if (this.current_if_state == 'is not equal to')//  Not equal to 
				{
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox') {
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
				else if (this.current_if_state == 'is filled') 
				 {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown') {
						//if (this.current_if_value == UCitem[0].element_data.default_value) {
						let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default==true))
						if(multyOpt.length > 0) {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						}//  if option is filled 
						else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					} else {
						if (UCitem[0].element_data.default_value != '') // other fields check if filled
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
				}// if filled over 
				else if (this.current_if_state == 'is empty') 
				 {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown') {
						//if (this.current_if_value == UCitem[0].element_data.default_value) {
						let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default==true))
						if(multyOpt.length == 0) {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						}//  if option is filled 
						else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					} else {
						if (UCitem[0].element_data.default_value == '') // other fields check if filled
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
				}// if empty over 

				//Commenting old logic for is filled and empty
				// else if (this.current_if_state == 'is filled') //  Is filled  
				// {
				// 	//checing the processing fields contains single choice, mutichoice check box ,drop down
				// 	if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown' || this.datas[i].element_type == 'checkbox') {
				// 		//taking the current option attached with the field
				// 		let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
				// 		let defaultOptions = this.defaultArrray[i].element_data.options.filter((ele => ele.default == true))
				// 		//taking the defult value index
				// 		this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)
				// 		let redioIndex = this.datas[i].element_data.options.findIndex((ele => ele.element_uuid == this.current_if_value))
				// 		if (UCitem[0].element_type == 'multiple_choice') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			UCitem12[0].default = false;
				// 			this.datas[i].element_data.default_value = ""
				// 			if (OptionSelected.length > 0) {
				// 				this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 				UCitem12[0].default = true;
				// 			}
				// 		} else {
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			} else {
				// 				// UCitem12[0].default = false;
				// 				// this.datas[i].element_data.default_value = null
				// 				if ((UCitem[0].element_data.default_value != null) && (UCitem[0].element_data.default_value != "")) {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// 	else {
				// 		//checking the use condition field  contains single choice, mutichoice check box ,drop down
				// 		if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (OptionSelected.length > 0) {
				// 				this.datas[i].element_data.default_value = this.current_if_value;
				// 			}
				// 		}
				// 		else {
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			} else {
				// 				if (UCitem[0].element_data.default_value != null && UCitem[0].element_data.default_value != "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			}
				// 		}

				// 	}
				// }
				// else if (this.current_if_state == 'is empty') // Is empty
				// {
				// 	//checing the processing fields contains single choice, mutichoice check box ,drop down
				// 	if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown') {
				// 		let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
				// 		this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)

				// 		if (UCitem[0].element_type == 'multiple_choice') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			if (OptionSelected.length == 0) {
				// 				UCitem12[0].default = true;
				// 			}
				// 		} else {
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city == "" || UCitem[0].element_data.street_address1 == "" || UCitem[0].element_data.state == "" || UCitem[0].element_data.zip == "" || UCitem[0].element_data.street_address2 == "") {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			} else {
				// 				if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// 	else {
				// 		//checing the use condition  fields contains single choice, mutichoice check box ,drop down
				// 		if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (OptionSelected.length == 0) {
				// 				this.datas[i].element_data.default_value = this.current_if_value;
				// 			}
				// 		}
				// 		else {
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city == "" && UCitem[0].element_data.street_address1 == "" && UCitem[0].element_data.state == "" && UCitem[0].element_data.zip == "" && UCitem[0].element_data.street_address2 == "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			} else {
				// 				if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			}
				// 		}
				// 	}
				// } 
				else { }
				//this.model.attributes = localdata;
			}
		} // for close 
				var localdata = [];
				localdata = this.datas;
				this.datas = [];
				this.datas = localdata;
		this.process_use_conditions1();
	}
	//duplicate odf the use condition function
	process_use_conditions1() {
		this.datas = this.defaultArrray;
		console.log(JSON.stringify(this.datas));
		for (let i = 0; i < this.datas.length; i++) {
			this.editIndex = i;
			if(this.datas[i].is_removed!=true && this.datas[i].element_data.use_conditions == true){
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
				let UCitem = this.defaultArrray.filter((ele => ele.element_uuid == this.condition_field_name))
				if(UCitem.length>0){
				if (this.current_if_state == 'is equal to') {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "single_choice" || UCitem[0].element_type == "dropdown") {
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
						else if(UCitem[0].element_type == "single_choice" || UCitem[0].element_type=="dropdown" || UCitem[0].element_type=="checkbox"){
							if (this.current_if_do == "hide") {
								if (this.current_if_value == "") {
									this.datas[i].is_hidden = "1";
								}
								else {
									this.datas[i].is_hidden = 0;
								}
							}
							else if (this.current_if_do == "show") {
								if (this.current_if_value == "") {
									this.datas[i].is_hidden = 0;
								}
								else {
									this.datas[i].is_hidden = "1";
								}
							}
						}
					}
					else if (UCitem[0].element_type == "date") {
						if (this.current_if_do == "hide") {
							if (this.current_if_value == "") {
								if (UCitem[0].element_data.default_date_time == "" || UCitem[0].element_data.default_date_time=="none" || UCitem[0].element_data.default_date_time==false) {
									this.datas[i].is_hidden = "1";
								}
								else {
									this.datas[i].is_hidden = 0;
								}
							}
						}
						else if(this.current_if_do == "show"){
							if(this.current_if_value == ""){
								if (UCitem[0].element_data.default_date_time = "" || UCitem[0].element_data.default_date_time=="none" || UCitem[0].element_data.default_date_time==false) {
									this.datas[i].is_hidden = "0";
								}
								else{
									this.datas[i].is_hidden = "1";
								}
							}
						}
					} 
					else {
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
				else if (this.current_if_state == 'is not equal to')//  Not equal to 
				{
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "single_choice" || UCitem[0].element_type == "dropdown") {
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
				else if (this.current_if_state == 'is filled') 
				 {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "single_choice" || UCitem[0].element_type == "dropdown") {
						//if (this.current_if_value == UCitem[0].element_data.default_value) {
						let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default==true))
						if(multyOpt.length > 0) {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						}//  if option is filled 
						else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
					else if(UCitem[0].element_type == "date"){
                        if (UCitem[0].element_data.default_date_time != '' && UCitem[0].element_data.default_date_time!="none") 
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
					else {
						if (UCitem[0].element_data.default_value != '') // other fields check if filled
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
				}// if filled over 
				else if (this.current_if_state == 'is empty') 
				 {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "single_choice" || UCitem[0].element_type == "dropdown") {
						//if (this.current_if_value == UCitem[0].element_data.default_value) {
						let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default==true))
						if(multyOpt.length == 0) {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						}//  if option is filled 
						else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					} 
					else if(UCitem[0].element_type == "date"){
                        if (UCitem[0].element_data.default_date_time == '' || UCitem[0].element_data.default_date_time=="none") 
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
					else {
						if (UCitem[0].element_data.default_value == '') // other fields check if filled
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
				}
				// if filled over 
				// else if (this.current_if_state == 'is filled') //  Is filled  
				// {
				// 	if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown' || this.datas[i].element_type == 'checkbox') {
				// 		let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
				// 		let defaultOptions = this.defaultArrray[i].element_data.options.filter((ele => ele.default == true))
				// 		this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)
				// 		let redioIndex = this.datas[i].element_data.options.findIndex((ele => ele.element_uuid == this.current_if_value))
				// 		if (UCitem[0].element_type == 'multiple_choice') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			UCitem12[0].default = false;
				// 			this.datas[i].element_data.default_value = ""
				// 			if (OptionSelected.length > 0) {
				// 				this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 				UCitem12[0].default = true;
				// 			}
				// 		} else {
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			} else {

				// 				// UCitem12[0].default = false;
				// 				// this.datas[i].element_data.default_value = null
				// 				if ((UCitem[0].element_data.default_value != null) && (UCitem[0].element_data.default_value != "")) {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					if(UCitem12.length>0) {
				// 						this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 						UCitem12[0].default = true;
				// 					}
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// 	else {
				// 		if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (OptionSelected.length > 0) {
				// 				this.datas[i].element_data.default_value = this.current_if_value;
				// 			}
				// 		}
				// 		else {
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			} else {
				// 				if (UCitem[0].element_data.default_value != null && UCitem[0].element_data.default_value != "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			}
				// 		}

				// 	}
				// }
				// else if (this.current_if_state == 'is empty') // Is empty
				// {
				// 	if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown') {
				// 		let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
				// 		this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)
				// 		if (UCitem[0].element_type == 'multiple_choice') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			if (OptionSelected.length == 0) {
				// 				if(UCitem12.length>0) {
				// 					UCitem12[0].default = true;
				// 				}
				// 			}
				// 		} else {
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city == "" || UCitem[0].element_data.street_address1 == "" || UCitem[0].element_data.state == "" || UCitem[0].element_data.zip == "" || UCitem[0].element_data.street_address2 == "") {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					if(UCitem12.length>0) {
				// 					UCitem12[0].default = true;
				// 					}
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			} else {
				// 				if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					if(UCitem12.length>0) {
				// 						UCitem12[0].default = true;
				// 					}
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// 	else {
				// 		if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (OptionSelected.length == 0) {
				// 				this.datas[i].element_data.default_value = this.current_if_value;
				// 			}
				// 		}
				// 		else {
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city == "" && UCitem[0].element_data.street_address1 == "" && UCitem[0].element_data.state == "" && UCitem[0].element_data.zip == "" && UCitem[0].element_data.street_address2 == "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			} else {
				// 				if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			}
				// 		}
				// 	}
				// } 
				else { }
			}
			}
		}
			var localdata = [];
			localdata = this.datas;
			this.datas = [];
			localdata = localdata.filter((ele => ele.is_hidden != "1"))
			this.datas = localdata;
		    this.attributess = localdata;
	}
    Extend_process_use_conditions() {
		this.datas = [...this.attributess,...this.dummy];
		console.log(this.datas)
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
				let UCitem = this.elements_combined.filter((ele => ele.element_uuid == this.condition_field_name))
				if (UCitem.length > 0) {
					if (UCitem[0].element_data.default_value == null) {
						UCitem[0].element_data.default_value = ""
					}
				} else {
					this.condition_field_name = ""
				}

				if (this.current_if_state == 'is equal to' && UCitem.length > 0) {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox') {
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

						if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox'  || UCitem[0].element_type == 'dropdown') 
						{
							let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default == true))
							if (multyOpt.length > 0) {
								if (multyOpt.length > 0 && multyOpt[0].default == true) {
									this.datas[i].is_hidden = "1";
								} else {
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
			}
				else if (this.current_if_state == 'is not equal to' && UCitem.length > 0)//  Not equal to 
				{
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox') {
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
				else if (this.current_if_state == 'is filled' && UCitem.length > 0) 
				 {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown') {
						//if (this.current_if_value == UCitem[0].element_data.default_value) {
						let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default==true))
						if(multyOpt.length > 0) {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						}//  if option is filled 
						else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					} else {
						if (UCitem[0].element_data.default_value != '') // other fields check if filled
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
				}// if filled over 
				else if (this.current_if_state == 'is empty' && UCitem.length > 0) 
				 {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == 'dropdown') {
						//if (this.current_if_value == UCitem[0].element_data.default_value) {
						let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default==true))
						if(multyOpt.length == 0) {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						}//  if option is filled 
						else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					} else {
						if (UCitem[0].element_data.default_value == '') // other fields check if filled
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
				}// if empty over 

				//Commenting old logic for is filled and empty
				// else if (this.current_if_state == 'is filled') //  Is filled  
				// {
				// 	//checing the processing fields contains single choice, mutichoice check box ,drop down
				// 	if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown' || this.datas[i].element_type == 'checkbox') {
				// 		//taking the current option attached with the field
				// 		let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
				// 		let defaultOptions = this.defaultArrray[i].element_data.options.filter((ele => ele.default == true))
				// 		//taking the defult value index
				// 		this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)
				// 		let redioIndex = this.datas[i].element_data.options.findIndex((ele => ele.element_uuid == this.current_if_value))
				// 		if (UCitem[0].element_type == 'multiple_choice') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			UCitem12[0].default = false;
				// 			this.datas[i].element_data.default_value = ""
				// 			if (OptionSelected.length > 0) {
				// 				this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 				UCitem12[0].default = true;
				// 			}
				// 		} else {
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			} else {
				// 				// UCitem12[0].default = false;
				// 				// this.datas[i].element_data.default_value = null
				// 				if ((UCitem[0].element_data.default_value != null) && (UCitem[0].element_data.default_value != "")) {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// 	else {
				// 		//checking the use condition field  contains single choice, mutichoice check box ,drop down
				// 		if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (OptionSelected.length > 0) {
				// 				this.datas[i].element_data.default_value = this.current_if_value;
				// 			}
				// 		}
				// 		else {
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			} else {
				// 				if (UCitem[0].element_data.default_value != null && UCitem[0].element_data.default_value != "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			}
				// 		}

				// 	}
				// }
				// else if (this.current_if_state == 'is empty') // Is empty
				// {
				// 	//checing the processing fields contains single choice, mutichoice check box ,drop down
				// 	if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown') {
				// 		let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
				// 		this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)

				// 		if (UCitem[0].element_type == 'multiple_choice') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			if (OptionSelected.length == 0) {
				// 				UCitem12[0].default = true;
				// 			}
				// 		} else {
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city == "" || UCitem[0].element_data.street_address1 == "" || UCitem[0].element_data.state == "" || UCitem[0].element_data.zip == "" || UCitem[0].element_data.street_address2 == "") {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			} else {
				// 				if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// 	else {
				// 		//checing the use condition  fields contains single choice, mutichoice check box ,drop down
				// 		if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (OptionSelected.length == 0) {
				// 				this.datas[i].element_data.default_value = this.current_if_value;
				// 			}
				// 		}
				// 		else {
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city == "" && UCitem[0].element_data.street_address1 == "" && UCitem[0].element_data.state == "" && UCitem[0].element_data.zip == "" && UCitem[0].element_data.street_address2 == "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			} else {
				// 				if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			}
				// 		}
				// 	}
				// } 
				else { }
				//this.model.attributes = localdata;
			}
		} // for close 
		this.Extend_process_use_conditions1();
	}
	Extend_process_use_conditions1() {
		this.datas=this.combinedArray;
		console.log(this.datas)
		for (let i = 0; i < this.datas.length; i++) {
			this.editIndex = i;
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
				let UCitem = this.combinedArray.filter((ele => ele.element_uuid == this.condition_field_name))
				if(UCitem.length>0){
				if (this.current_if_state == 'is equal to') {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "single_choice" || UCitem[0].element_type == "dropdown") {
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
				else if (this.current_if_state == 'is not equal to')//  Not equal to 
				{
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "single_choice" || UCitem[0].element_type == "dropdown") {
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
				else if (this.current_if_state == 'is filled') 
				 {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "single_choice" || UCitem[0].element_type == "dropdown") {
						//if (this.current_if_value == UCitem[0].element_data.default_value) {
						let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default==true))
						if(multyOpt.length > 0) {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						}//  if option is filled 
						else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					} else {
						if (UCitem[0].element_data.default_value != '') // other fields check if filled
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
				}// if filled over 
				else if (this.current_if_state == 'is empty') 
				 {
					if (UCitem[0].element_type == "multiple_choice" || UCitem[0].element_type == 'checkbox' || UCitem[0].element_type == "single_choice" || UCitem[0].element_type == "dropdown") {
						//if (this.current_if_value == UCitem[0].element_data.default_value) {
						let multyOpt = UCitem[0].element_data.options.filter((ele => ele.default==true))
						if(multyOpt.length == 0) {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						}//  if option is filled 
						else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					} else {
						if (UCitem[0].element_data.default_value == '') // other fields check if filled
						{
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "1" :"0";
						} else {
							this.datas[i].is_hidden = this.current_if_do == "hide" ? "0" :"1";
						}
					}
				}
				// if filled over 
				// else if (this.current_if_state == 'is filled') //  Is filled  
				// {
				// 	if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown' || this.datas[i].element_type == 'checkbox') {
				// 		let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
				// 		let defaultOptions = this.defaultArrray[i].element_data.options.filter((ele => ele.default == true))
				// 		this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)
				// 		let redioIndex = this.datas[i].element_data.options.findIndex((ele => ele.element_uuid == this.current_if_value))
				// 		if (UCitem[0].element_type == 'multiple_choice') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			UCitem12[0].default = false;
				// 			this.datas[i].element_data.default_value = ""
				// 			if (OptionSelected.length > 0) {
				// 				this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 				UCitem12[0].default = true;
				// 			}
				// 		} else {
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 					UCitem12[0].default = true;
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			} else {

				// 				// UCitem12[0].default = false;
				// 				// this.datas[i].element_data.default_value = null
				// 				if ((UCitem[0].element_data.default_value != null) && (UCitem[0].element_data.default_value != "")) {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					if(UCitem12.length>0) {
				// 						this.datas[i].element_data.default_value = UCitem12[0].element_uuid;
				// 						UCitem12[0].default = true;
				// 					}
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// 	else {
				// 		if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (OptionSelected.length > 0) {
				// 				this.datas[i].element_data.default_value = this.current_if_value;
				// 			}
				// 		}
				// 		else {
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city != "" || UCitem[0].element_data.street_address1 != "" || UCitem[0].element_data.state != "" || UCitem[0].element_data.zip != "" || UCitem[0].element_data.street_address2 != "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			} else {
				// 				if (UCitem[0].element_data.default_value != null && UCitem[0].element_data.default_value != "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			}
				// 		}

				// 	}
				// }
				// else if (this.current_if_state == 'is empty') // Is empty
				// {
				// 	if (this.datas[i].element_type == 'single_choice' || this.datas[i].element_type == 'multiple_choice' || this.datas[i].element_type == 'dropdown') {
				// 		let UCitem12 = this.datas[i].element_data.options.filter((ele => ele.element_uuid == this.current_if_value))
				// 		this.activeIndex = this.defaultArrray[i].element_data.options.findIndex(data => data.default == true)
				// 		if (UCitem[0].element_type == 'multiple_choice') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			if (OptionSelected.length == 0) {
				// 				if(UCitem12.length>0) {
				// 					UCitem12[0].default = true;
				// 				}
				// 			}
				// 		} else {
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city == "" || UCitem[0].element_data.street_address1 == "" || UCitem[0].element_data.state == "" || UCitem[0].element_data.zip == "" || UCitem[0].element_data.street_address2 == "") {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					if(UCitem12.length>0) {
				// 					UCitem12[0].default = true;
				// 					}
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			} else {
				// 				if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
				// 					this.datas[i].element_data.options.forEach(element => {
				// 						element.default = false;
				// 					});
				// 					if(UCitem12.length>0) {
				// 						UCitem12[0].default = true;
				// 					}
				// 				} else {
				// 					if (this.activeIndex != -1) {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 						this.datas[i].element_data.options[this.activeIndex].default = true
				// 					} else {
				// 						this.datas[i].element_data.options.forEach(element => {
				// 							element.default = false;
				// 						});
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// 	else {
				// 		if (UCitem[0].element_type == 'single_choice' || UCitem[0].element_type == 'multiple_choice' || UCitem[0].element_type == 'dropdown' || UCitem[0].element_type == 'checkbox') {
				// 			let OptionSelected = UCitem[0].element_data.options.filter((ele => ele.default == true))
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (OptionSelected.length == 0) {
				// 				this.datas[i].element_data.default_value = this.current_if_value;
				// 			}
				// 		}
				// 		else {
				// 			this.datas[i].element_data.default_value = this.defaultArrray[i].element_data.default_value;
				// 			if (UCitem[0].element_type == 'address') {
				// 				if (UCitem[0].element_data.city == "" && UCitem[0].element_data.street_address1 == "" && UCitem[0].element_data.state == "" && UCitem[0].element_data.zip == "" && UCitem[0].element_data.street_address2 == "") {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			} else {
				// 				if ((UCitem[0].element_data.default_value == null) || (UCitem[0].element_data.default_value == "")) {
				// 					this.datas[i].element_data.default_value = this.current_if_value;
				// 				}
				// 			}
				// 		}
				// 	}
				// } 
				else { }
			}
			}
		} 
		    console.log(this.elements_combined);
			var emptycell=this.elements_combined.filter(data=>data.is_hidden=="1");
			if(emptycell.length>0)
			{
              for(var i=0;i<emptycell.length;i++)
			  {
				  var referenceidss=emptycell[i].element_data.reference_id;
				  var findingelementid=this.elements_combined.filter(data=>data.element_uuid==referenceidss);
				  if(findingelementid[0].element_type=="empty_cell")
				  {
					  findingelementid[0].is_hidden="1";
				  }
			  }
			}

			var localdata = [];
			localdata = this.datas;
			this.datas = [];
			localdata = localdata.filter((ele => ele.is_hidden != "1"))
			this.datas = localdata;
			// let dummy_model = [];
			// let attribute_model = [];
			// for(let i = 0; i < this.dummy.length ; i++){
			// 	let filter_element = this.datas.filter(data=> data.element_uuid == this.dummy[i].element_uuid);
			// 	dummy_model.push(filter_element[0]);
			// }
			// this.dummy = _.cloneDeep(dummy_model);

			// for(let i = 0; i < this.attributess.length ; i++){
			// 	let filter_element = this.datas.filter(data=> data.element_uuid == this.attributess[i].element_uuid);
			// 	if(filter_element != null){
			// 		attribute_model.push(filter_element[0]);
			// 	}
			// }
			// this.attributess = _.cloneDeep(attribute_model);
			// this.attributess = localdata;
	}
	alignmenprocess() {
		if (this.wmataweld == true) {
			let clone_empty_cell = _.cloneDeep(this.clone_model);
			clone_empty_cell.element_uuid = this.dataService.generateUUID();
			this.dummy.splice(this.dummy.length, 0, clone_empty_cell);
		}
		let check_condition = ["false", false, 0, "0"];
		let column_one = _.cloneDeep(this.attributess);
		let column_two = _.cloneDeep(this.dummy);
		column_one = column_one.filter((data) => data.is_removed == 0 || data.is_removed == "0");
		column_two = column_two.filter((data) => data.is_removed == 0 || data.is_removed == "0");
		//aaaaaaaaaa
		for (let i = 0; i < column_one.length; i++) {
			let temp_extend_holder = column_two.filter(ele => ele["element_data"].reference_id == column_one[i].element_uuid);
			let index = column_two.indexOf(temp_extend_holder[0]);
			if (index == -1) {
				index = i;
			}
			if (column_one[i].element_type == 'uti-entry-field-WMATA_WELD') {
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
		this.attributess = column_one;
		this.dummy = column_two;
	}
	checkAlign_usecase() {
		let weldformindex = this.attributess.findIndex((id) => id.element_type == "uti-entry-field-WMATA_WELD");
		if (weldformindex == -1) {
			return
		}
		let check_condition = ["false", false, 0, "0"];
		let column_one = _.cloneDeep(this.attributess);
		let column_two = _.cloneDeep(this.dummy);
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
		this.attributess = cloneLeft1;
		this.dummy = cloneRightt1;
	}
	

	checkMinMax(event, item, index) {
		let maximumValue = item.element_data.maximum_value;
		if (
			item.element_data.default_value > maximumValue &&
			![8, 46].includes(event.keyCode) && maximumValue != ""
		) {
			event.preventDefault();
			item.element_data.default_value = maximumValue;
		}
		else if (item.element_data.default_value > maximumValue && maximumValue != "") {
			item.element_data.default_value = maximumValue;
		}
		else {
			item.element_data.default_value = event.target.value;
		}
		this.updateAttributes(item, '', '')
	}
	hide: boolean = true;
	checkMin(event, item, index) {
		console.log(this.datas)
		item.element_data.default_value = event.target.value
		this.updateAttributes(item, '', '')
		console.log(item.element_data.if_state)
		console.log(item);
		let minimumValue = item.element_data.minimum_value;
		if (event.target.value < minimumValue) {
			item.element_data.default_value = "";
		} else {
			var ded = event.target.value
			item.element_data.default_value = event.target.value.toString();
		}
	}

	firstLetterCapital(word, item) {
		console.log(word)
		
		if (word) {
			let firsttypeLetter = word[0].toUpperCase();
			let othertypeletters = word.slice(1);
			let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
			// console.log(changeUpperCaseProjectName);
			console.log(item);
			console.log(item.element_data.label_text)
			this.updateAttributes(item, '', '');
		}else{
			this.updateAttributes(item, '', '');
		}
		if(this.extend==true)
		{
			this.checkAlign_usecase();
		}
	}
	

	updateAttributes(item, item_value, addressCheck,single_choice?:any) {
		if(this.extend==true)
		{
			this.Extend_updateAttributes(item, item_value, addressCheck,single_choice);
		}
		else
		{
			console.log(item_value)
		
		item.element_data.last_modified_date = new Date().toISOString();
		if (item.element_data.label_text == "Total Element Quantity") {
			this.totalElementQuantity = Number(item.element_data.default_value);
			this.htmlcalculation();
		}
		if (item.element_type == 'single_choice' || item.element_type == 'dropdown') {
			item.element_data.options.forEach(element => {
				element.default = false
			});
			let UCitemDefault = item.element_data.options.filter((ele => ele.element_uuid == item_value))
			if(item.element_type == 'single_choice'){
				let check_or_not = single_choice.target.checked;
				if(UCitemDefault.length>0) {
					if(check_or_not == true){
						UCitemDefault[0].default = true;
						item.element_data.default_value = item_value
					}
					else{
						item.element_data.default_value = "";
					}
				}
			}
			else {
				if (UCitemDefault.length > 0) {
					UCitemDefault[0].default = true;
					item.element_data.default_value = item_value
				}
				else{
					item.element_data.default_value = "";
				}
			}
			//this.FormulaCalc(item.element_data.label_text);
		}
		if (item.element_type == 'number') {
			let UCitem12 = this.defaultArrray.filter((ele => ele.element_uuid == item.element_uuid))
			UCitem12[0].element_data.default_value = item.element_data.default_value;
			//this.FormulaCalc(item.element_data.label_text);
			if(this.timber_form_data != undefined && this.timber_form_data != null && this.timber_form_data.length > 0){
				let find_index_timber_form = this.timber_form_data.findIndex((number_field)=>number_field.element_uuid==item.element_uuid);
				if(find_index_timber_form > -1){
					this.timber_form_data[find_index_timber_form].element_data.default_value = item.element_data.default_value;
					this.dataService_doc.diameter_changes.emit(this.timber_form_data);
				}
			}
		}
		if (item.element_type == 'multiple_choice' || item.element_type == 'checkbox') {
			let UCitemDefault = item.element_data.options.filter((ele => ele.element_uuid == item_value))
			if (UCitemDefault[0].default == true) {
				UCitemDefault[0].default = false;
			} else {
				UCitemDefault[0].default = true;
			}
		}

		if (item.element_type == 'date') {
			let temp_value = item_value;
			if(temp_value != undefined && temp_value != "none" && temp_value != "")
			item.element_data.default_date_time = new Date(item_value).toISOString();
		   }else{
			item.element_data.default_date_time = "none"
		   }

		if (item_value != "") {
			let UCitem = this.defaultArrray.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			let UCitem123 = this.attributess.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			UCitem[0].element_data.default_value = item_value;
			if (item.element_type == 'address') {
				if (addressCheck == "street") {
					UCitem123[0].element_data.street_address1 = item_value
				} else if (addressCheck == "city") {
					UCitem123[0].element_data.city = item_value
				} else if (addressCheck == "state") {
					UCitem123[0].element_data.state = item_value
				} else if (addressCheck == "zip") {
					UCitem123[0].element_data.zip = item_value
				} else {
					UCitem123[0].element_data.street_address2 = item_value
				}
				// 	if (UCitem[0].element_type == 'date') {
			// 		UCitem[0].element_data.default_date_time = new Date(item_value).toISOString();
			// 		console.log(UCitem[0].element_data.default_value)
			// 		UCitem123[0].element_data.default_date_time = new Date(item_value).toISOString();
			// 	}
			// 	if (UCitem[0].element_data.default_value == "") {
			// 		UCitem[0].element_data.default_date_time = new Date().toISOString()
			// 	}
			// 	console.log("NEW FUNCTION CALLEDD" + UCitem[0].element_data.default_value)
			} 
				}
		else {
			let UCitem123 = this.defaultArrray.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			let UCitem = this.defaultArrray.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			UCitem[0].element_data.default_value = item.element_data.default_value;
			console.log("NEW FUNCTION CALLEDD" + UCitem[0].element_data.default_value)
			if (item.element_type == 'address') {
				if (addressCheck == "street") {
					UCitem123[0].element_data.street_address1 = item_value
				} else if (addressCheck == "city") {
					UCitem123[0].element_data.city = item_value
				} else if (addressCheck == "state") {
					UCitem123[0].element_data.state = item_value
				} else if (addressCheck == "zip") {
					UCitem123[0].element_data.zip = item_value
				} else {
					UCitem123[0].element_data.street_address2 = item_value
				}
			}
		}

			



		this.process_use_conditions();
	this.FormulaCalc();
		
	}
	}
	Extend_updateAttributes(item, item_value, addressCheck,single_choice?:any) {
		const formfieldType = item.element_type;
		console.log(item_value)
		
		item.element_data.last_modified_date = new Date().toISOString();
		if (item.element_data.label_text == "Total Element Quantity") {
			this.totalElementQuantity = Number(item.element_data.default_value);
			this.htmlcalculation();
		}

		if (item.element_type == 'single_choice' || item.element_type == 'dropdown') {
			item.element_data.options.forEach(element => {
				element.default = false
			});
			let UCitemDefault = item.element_data.options.filter((ele => ele.element_uuid == item_value))
			if(item.element_type == 'single_choice'){
				let check_or_not = single_choice.target.checked;
				if(UCitemDefault.length>0) {
					if(check_or_not == true){
						UCitemDefault[0].default = true;
						item.element_data.default_value = item_value;
					}
					else{
						item.element_data.default_value = "";
					}
				}
			}
			else{
				if (UCitemDefault.length > 0) {
					UCitemDefault[0].default = true;
					item.element_data.default_value = item_value;
				}
				else{
					item.element_data.default_value = "";
				}
			}	
		}
		this.elements_combined=[...this.attributess,...this.dummy];
		if (item.element_type == 'number') {
			let UCitem12 = this.elements_combined.filter((ele => ele.element_uuid == item.element_uuid))
			UCitem12[0].element_data.default_value = item.element_data.default_value;
			//this.FormulaCalc(item.element_data.label_text);
		}
		if (item.element_type == 'multiple_choice' || item.element_type == 'checkbox') {
			let UCitemDefault = item.element_data.options.filter((ele => ele.element_uuid == item_value))
			if (UCitemDefault[0].default == true) {
				UCitemDefault[0].default = false;
			} else {
				UCitemDefault[0].default = true;
			}
		}
		if (item.element_type == 'date') {
			let temp_value = item_value;
			if(temp_value != undefined && temp_value != "none" && temp_value != "")
			item.element_data.default_date_time = new Date(item_value).toISOString();
		   }else{
			item.element_data.default_date_time = "none"
		   }

        if (item_value != "") {
			let UCitem = this.elements_combined.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			let UCitem123 = this.elements_combined.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			UCitem[0].element_data.default_value = item_value;
			if (item.element_type == 'address') {
				if (addressCheck == "street") {
					UCitem123[0].element_data.street_address1 = item_value
				} else if (addressCheck == "city") {
					UCitem123[0].element_data.city = item_value
				} else if (addressCheck == "state") {
					UCitem123[0].element_data.state = item_value
				} else if (addressCheck == "zip") {
					UCitem123[0].element_data.zip = item_value
				} else {
					UCitem123[0].element_data.street_address2 = item_value
				}
			} else {
			// 	if (UCitem[0].element_type == 'date') {
			// 		UCitem[0].element_data.default_date_time = new Date(item_value).toISOString();
			// 		console.log(UCitem[0].element_data.default_value)
			// 		UCitem123[0].element_data.default_date_time = new Date(item_value).toISOString();
			// 	}
			// 	if (UCitem[0].element_data.default_value == "") {
			// 		UCitem[0].element_data.default_date_time = new Date().toISOString()
			// 	}
			// 	console.log("NEW FUNCTION CALLEDD" + UCitem[0].element_data.default_value)
			}
			
		}
		else {
			let UCitem123 = this.elements_combined.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			let UCitem = this.elements_combined.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			UCitem[0].element_data.default_value = item.element_data.default_value;
			console.log("NEW FUNCTION CALLEDD" + UCitem[0].element_data.default_value)
			if (item.element_type == 'address') {
				if (addressCheck == "street") {
					UCitem123[0].element_data.street_address1 = item_value
				} else if (addressCheck == "city") {
					UCitem123[0].element_data.city = item_value
				} else if (addressCheck == "state") {
					UCitem123[0].element_data.state = item_value
				} else if (addressCheck == "zip") {
					UCitem123[0].element_data.zip = item_value
				} else {
					UCitem123[0].element_data.street_address2 = item_value
				}
			}
		}
		this.Extend_process_use_conditions();
		this.Extend_FormulaCalc(formfieldType);
	}

	async FormulaCalc() {
		    // var FormulaFieldfind = this.defaultArrray.filter(ele => "calculation_value" in ele.element_data);
		// var calculationValueUpdate = this.attributess.filter(ele => "calculation_value" in ele.element_data);
		if(this.extend==true)
		{
			this.Extend_FormulaCalc();
		}
		else
		{
		var FormulaFieldfind = this.defaultArrray.filter(ele => ele.element_type == "calculation");
		var calculationValueUpdate = this.attributess.filter(ele => ele.element_type == "calculation");
		if (FormulaFieldfind.length != 0) {
			// if (FormulaFieldfind[0].element_data.calculation_value == "") { } else {
			var i = 0;
			FormulaFieldfind.forEach(async calc => {
				if (FormulaFieldfind[i].element_data['calculation_value'] != "" && FormulaFieldfind[i].element_data['calculation_value'] != undefined) {
					if (FormulaFieldfind[i].element_data['calculation_value'].includes("AVG")) {
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
						await matches.forEach(async element => {
							//if (element == key) {
							var FieldFind = this.attributess.filter(ele => ele.element_uuid == element);
							this.FieldResult = FieldFind[0];
							this.DummyField = this.DummyField.replace(element, FieldFind[0].element_data.label_text)
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
									}else {
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
										else{
											calculatedalltotal = calculatedalltotal + 1;
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
									else  if (calculatedalltotal == 0 && FieldFind[0].element_type == "checkbox") {
										calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", 1)
									}
									else {
										//calc.element_data.calculation = this.DummyField
										calc.element_data.calculation = calc.element_data.calculation.replace("["+element+"]", 0)
									}
								}
								else if(CalculatioField1.length == 0 )
								{
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
									if(FieldFind[0].element_data.calculation_value != ""){
										const calValue = FieldFind[0].element_data.calculation_value;
                                       let formulaCacultionField = await this.formulaValueCal(calValue);
									}
									if (FieldFind[0].element_data.calculation.includes('[')) {
										calc.element_data.calculation = this.DummyField
									} else if (calc.element_data.calculation.includes('[' + element + ']')) {
										calc.element_data.calculation = calc.element_data.calculation.replace("[" + element + "]", FieldFind[0].element_data.calculation)
									} else {
										calc.element_data.calculation = calc.element_data.calculation_value.replace("[" + element + "]", FieldFind[0].element_data.calculation)
									}
								}
								if (this.FieldResult.element_data.calculation == "" || this.FieldResult.element_data.calculation == undefined) {
									// calc.element_data.calculation = this.DummyField
									calc.element_data.calculation = calc.element_data.calculation.replace("["+element+"]", "()")
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

							if (calc.element_data.calculation.includes('.rounded()')) {
								calc.element_data.calculation = calc.element_data.calculation.split(".rounded()").join("")
								calculationValueUpdate[i].element_data.calculation = eval(
									calc.element_data.calculation
								);
								calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation != "" && calculationValueUpdate[i].element_data.calculation > 1 ? Math.round(calculationValueUpdate[i].element_data.calculation) : 1
								calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
							} 
							//square root function implemented start
							else if (calc.element_data.calculation.includes('√')) {
								let get_fianl_value = this.dataService.squareRootCalculation(calc.element_data.calculation);
								if (get_fianl_value != '√' && get_fianl_value != '') {
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
									if(validcalculation==true){
										get_fianl_value = eval(get_fianl_value);	
										calculationValueUpdate[i].element_data.calculation = get_fianl_value;
										calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
									}
									// if(get_fianl_value instanceof EvalError || get_fianl_value instanceof SyntaxError){
									// 	console.log('evaltype error throw',get_fianl_value);
									// 	calculationValueUpdate[i].element_data.calculation = get_fianl_value;
									// }
									// else{
									// 	get_fianl_value = eval(get_fianl_value);	
									// 	calculationValueUpdate[i].element_data.calculation = get_fianl_value;
									// 	calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
									// }
								}
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
									if(validcalculation==true){
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
								let check_seperators = ["(",")","+","-","*","/"];
								let get_calculation = calc.element_data.calculation
								let get_fist_value = calc.element_data.calculation[0];
								let get_second_value = calc.element_data.calculation[1];
								let get_last_value = calc.element_data.calculation[calc.element_data.calculation.length-1];
								let leftBracketCount = 0
								let rightBracketCount = 0
								for(let k of calc.element_data.calculation){
								   if(k == "("){
									leftBracketCount++;
								   }
								   if(k == ")"){
									rightBracketCount++
								   }
								}
								if(leftBracketCount != rightBracketCount){
									calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation;
								}
								// The below lines are commented for the calculation of numbers with multiple brackets in formula field.
								// if(check_seperators.includes(get_fist_value) && check_seperators.includes(get_second_value)){
								// 	calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation
								// }
								// else if(check_seperators.includes(get_last_value)){
								// 	calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation
								// }
								// else if((get_calculation.includes("(") && !get_calculation.includes(")"))||
								// (get_calculation.includes(")") && !get_calculation.includes("(")) ){
								// 	calculationValueUpdate[i].element_data.calculation = calc.element_data.calculation
								// }
								else{
									const calValue = eval(calc.element_data.calculation);
									let value = calValue;
									const NaNCheck = isNaN(calValue);
									if(NaNCheck == true || value == "Infinity"){
                                       value = 0;
									}
									calculationValueUpdate[i].element_data.calculation = value;
									calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.default_value == "" ? calculationValueUpdate[i].element_data.calculation.toFixed(Number(1)) : calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
									let confirmedValue = calc.element_data.calculation;
									console.log(Math.abs(confirmedValue));
									let decimalCheck = Math.abs(confirmedValue);
								}
								console.log(typeof calculationValueUpdate[i].element_data.calculation);
								
							}
						}
						//this.FormulaCalc1();
					}
				}
				i++;
			});
			//}

		}
		}
	}

	async formulaValueCal(calValue){
		console.log(calValue);
		let calc_value = calValue.split(/[[\]]{1,2}/); // 2+4*[sdfsdfsd]-[12312312]
		console.log(calc_value)
		var matches1 = [];
		var pattern = /\[(.*?)\]/g;
		var match;
		var formulaResult = 0
		while ((match = pattern.exec(calValue)) != null) {
			matches1.push(match[1]);
		}
		console.log(matches1)
		matches1.forEach((element => {
			console.log(element)
			let FieldFind = this.defaultArrray.filter(ele => ele.element_uuid == element);
			if (FieldFind[0].element_type == "multiple_choice" || FieldFind[0].element_type == "checkbox") {
				let calculatedalltotal = 0;
				var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
				if (CalculatioField1.length > 0) {
					CalculatioField1.forEach(ele => {
						if (ele.calculated_value != "") {
							formulaResult = calculatedalltotal + Number(ele.calculated_value)
						}
						else{
							formulaResult = calculatedalltotal + 1;
						}
					});
					console.log(formulaResult);
				}
				else if(CalculatioField1.length == 0 )
				{
					formulaResult = formulaResult + calculatedalltotal; 
				}
				
			}
			else if (FieldFind[0].element_type == "single_choice" || FieldFind[0].element_type == "dropdown") {
				let calculatedalltotal = 0;
				var CalculatioField1 = FieldFind[0].element_data.options.filter(ele => ele.default == true);
				if (CalculatioField1.length > 0) {
					if (CalculatioField1[0].calculated_value != "") {
						formulaResult = calculatedalltotal + Number(CalculatioField1[0].calculated_value)
					}else {
						formulaResult = calculatedalltotal + 1;
					  }
					
				} else {
					formulaResult = formulaResult + calculatedalltotal; 
				}
			}
			else {
				let calculatedalltotal = 0;
				if (FieldFind[0].element_data.default_value != "" && FieldFind[0].element_data.default_value != null) {
					formulaResult = FieldFind[0].element_data.default_value
				}
				if (this.FieldResult.element_data.default_value == "" || this.FieldResult.element_data.default_value == undefined) {
					formulaResult = calculatedalltotal
				} 
			}
		}))
		return formulaResult;
	}

	Extend_FormulaCalc(type?) {
		// var FormulaFieldfind = this.defaultArrray.filter(ele => "calculation_value" in ele.element_data);
		// var calculationValueUpdate = this.attributess.filter(ele => "calculation_value" in ele.element_data);
		var FormulaFieldfind = this.elements_combined.filter(ele => ele.element_type == "calculation");
		var calculationValueUpdate = this.elements_combined.filter(ele => ele.element_type == "calculation");
		if (FormulaFieldfind.length != 0) {
			// if (FormulaFieldfind[0].element_data.calculation_value == "") { } else {
			var i = 0;
			FormulaFieldfind.forEach(calc => {
				if (FormulaFieldfind[i].element_data['calculation_value'] != "" && FormulaFieldfind[i].element_data['calculation_value'] != undefined) {
					if (FormulaFieldfind[i].element_data['calculation_value'].includes("AVG")) {
						this.Extend_AvarageCalculation(calc, FormulaFieldfind[i], calculationValueUpdate[i])
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
							var FieldFind = this.elements_combined.filter(ele => ele.element_uuid == element);
							this.FieldResult = FieldFind[0];
							this.DummyField = this.DummyField.replace(element, FieldFind[0].element_data.label_text)
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

							if (calc.element_data.calculation.includes('.rounded()')) {
								calc.element_data.calculation = calc.element_data.calculation.split(".rounded()").join("")
								calculationValueUpdate[i].element_data.calculation = eval(
									calc.element_data.calculation
								);
								calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation != "" && calculationValueUpdate[i].element_data.calculation > 1 ? Math.round(calculationValueUpdate[i].element_data.calculation) : 1
								calculationValueUpdate[i].element_data.calculation = calculationValueUpdate[i].element_data.calculation.toFixed(Number(calculationValueUpdate[i].element_data.default_value));
							} else {
								const calValue = eval(calc.element_data.calculation);
								let value = calValue;
								const NaNCheck = isNaN(calValue);
								if (NaNCheck == true || value == "Infinity") {
									value = 0;
								}
								calculationValueUpdate[i].element_data.calculation = value;
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
		for (let i = 0; i < this.dummy.length; i++) {
			let filter_element = this.elements_combined.filter(data => data.element_uuid == this.dummy[i].element_uuid);
			if (filter_element != null) {
				dummy_model.push(filter_element[0]);
			}
		}
		this.dummy = _.cloneDeep(dummy_model);

		for (let i = 0; i < this.attributess.length; i++) {
			let filter_element = this.elements_combined.filter(data => data.element_uuid == this.attributess[i].element_uuid);
			if (filter_element != null) {
				attribute_model.push(filter_element[0]);
			}
		}
		this.attributess = _.cloneDeep(attribute_model);
		console.log(this.attributess);
        if(this.formFields_weld.includes(type)){
			this.checkAlign_usecase();
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
				var FieldFind = this.attributess.filter(ele => ele.element_uuid == element);
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
				var FieldFind = this.elements_combined.filter(ele => ele.element_uuid == element);
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
	}

	closeBox() {
		this.dialog.close();
		this.sharedService.filter("Refresh Click");
	}

	defaultValueChange(e, item) {
		if (item.element_data.maximum_value != "" && item.element_data.maximum_value != null) {
			if (Number(item.element_data.maximum_value) < Number(e.target.value)) {
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
		this.updateAttributes(item, '', '')
	}
	//html add button click
	htmlAddClick() {
		this.showHtmlFields = true;
		this.obj.not = false
		this.conditionSelected = ""
		this.csSelected = ""
		this.fieldQuantity =null
		this.countedCheck = false;
		this.itemIndexNumber = 0;
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
	//html edit button click
	EditHtml(item) {
		this.conditionSelected = item.condition_code
		this.csSelected = item.cs
		this.fieldQuantity = Number(item.quantity)
		this.countedCheck = item.not;
		this.itemIndexNumber = item.item_id
		this.showHtmlFields = true;
	}
	EditHtml1(item,field,edit_index) {
		this.savebuttoncheck=true;
		this.itemIndexNumber = edit_index;
		let find_final_array_obj = Object.assign({},this.finalArray1[edit_index]);
		this.custome_form_object = find_final_array_obj;
		// this.showHtmlFields = true;
		this.editButton=true;
	  }
	
	//html field delete button click
	DeleteHtml(item) {
		var abc = this.finalArray.filter((ele => ele.item_id != item.item_id))
		this.finalArray = abc;
		this.htmlcalculation()
	}
	DeleteHtml1(item,elementdata,delete_index) {
		if(this.finalArray1.length> 0){
		  this.finalArray1.splice(delete_index,1);
		}
		// var abc = this.finalArray2.filter((ele => ele.item_id != item.item_id))
		// this.finalArray2 = abc;
	  }
	//html done button clicked
	htmlDoneClick(index) {
		if (index != 0) {
			var editArray = this.finalArray.filter((ele => ele.item_id == index))
			editArray[0].condition_code = this.obj.condition_code
			editArray[0].cs = this.obj.cs
			editArray[0].quantity = this.obj.quantity
			editArray[0].not = this.obj.not
			this.htmlcalculation()
		} else {
			let id_value = this.finalArray != undefined ? this.finalArray.length + 1 : 1
			this.obj.item_id = id_value
			this.showHtmlFields = false;
			this.finalArray.push(this.obj)
			this.finalArray = _.cloneDeep(this.finalArray)
			this.htmlcalculation()
		}
	}
	htmlDoneClick1(index){
		this.savebuttoncheck=false;
		this.showHtmlFields = false;
		this.editButton=false;
		let clone_entered_values = _.cloneDeep(this.custome_form_object);
		if (this.itemIndexNumber != -1) {
		  this.finalArray1[this.itemIndexNumber] = clone_entered_values;
		}
		else {
		  this.finalArray1.push(clone_entered_values);
		}
		console.log(this.finalArray1);
	}
	cleardata(){
		this.object.Location="";
		this.object.Decibels="";
		this.object.PC="";
		this.object.Flag="";
		this.object.Condition="";
		this.object.Comment="";
	}
	obj = {
		"id": "",
		"condition_code": "",
		"cs": "",
		"quantity": "",
		"not": false,
		"item_id": 0
	}

	object={
		"Location":"",
		"Decibels":"",
		"PC":"",
		"Flag":"",
		"Condition":"",
		"Comment":"",
		"item_id": 0
	}
	objcopy={
		"Location":"",
		"Decibels":"",
		"PC":"",
		"Flag":"",
		"Condition":"",
		"Comment":"",
	}

	//html field on change creating the local json
	htmlFieldValue(id, item, value) {
		if (item == "condition_code") {
			this.obj.condition_code = value
		} else if (item == "cs") {
			this.obj.cs = value
			this.obj.id = id;
		} else if (item == "quantity") {
			this.obj.quantity = value
		} else {
			this.obj.not = value
		}
	}

	updateAttributesform(item,value,fields){
		this.savebuttoncheck=true;
	    if(item=="Location"){
           this.custome_form_object.location=value;
		}
		if(item=="Decibels"){
			this.custome_form_object.decibels=value;
		}
		if(item=="PC"){
			this.custome_form_object.previouscondition=value;
		}
		if(item=="Flag"){
			this.custome_form_object.flagforrReview=value;
		}
		if(item=="Condition"){
			let get_field_option = fields.element_data.options;
      let find_name_index = get_field_option.findIndex((uuid) => uuid.element_uuid == value);
      if (find_name_index > -1) {
        this.custome_form_object.Condition = get_field_option[find_name_index].name;
      }
      else {
        this.custome_form_object.Condition = "";
      }
		}
		if(item=="Comment"){
			this.custome_form_object.Comment=value;
		}

	 }

	assignDates(option) {
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
	date(e, item) {
		if(this.extend==true)
		{
			this.Extend_date(e,item);
		}
		else{
			console.log(e, item)
		if (item.element_data.default_date_time == "" || item.element_data.default_date_time == undefined) {
			console.log("val")
			let UCitem = this.defaultArrray.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			item.element_data.default_date_time = new Date();
			console.log(item.element_data.default_date_time)
		}
		}
	}

	Extend_date(e, item) {
		console.log(e, item)
		if (item.element_data.default_date_time == "" || item.element_data.default_date_time == undefined) {
			console.log("val")
			let UCitem = this.elements_combined.filter((ele => ele.element_data.label_text == item.element_data.label_text))
			item.element_data.default_date_time = new Date();
			console.log(item.element_data.default_date_time)
		}
	}

	clearDate(item,item_value,) {
		console.log(item);
		for (let k = 0; k < this.attributess.length; k++) {
			if (this.attributess[k].element_uuid == item.element_uuid) {
				this.attributess[k].element_data.default_date_time = "";
				item.element_data.default_date_time = "";
				item.element_data.default_value="";
				console.log(this.attributess[k]);
			}
		}
		this.updateAttributes(item,"",'')
	}

	///html calculation result finding
	htmlcalculation() {

		this.unratedQuantity = 0;
		this.csValue = 0;
		for (var i = 0; i < this.outputArray.length; i++) {
			this.outputArray[i].value = 0
		}
		let chechAarray = this.finalArray.filter((ele => ele.not == false || ele.cs == "CS1"))
		var fieldSum = 0;
		var cs1Sum = 0;
		chechAarray.forEach(element => {
			if (element.cs != "CS1" && element.cs.trim() != "") {
				var cc = this.outputArray.filter((ele => ele.id == element.id))
				if(element.quantity != undefined){
					cc[0].value = Number(cc[0].value) + Number(element.quantity)
				}
			}
			if (element.cs != "CS1" && element.cs != "INAC" && element.cs.trim() != "") {
				if(element.quantity != undefined){
					fieldSum = fieldSum + Number(element.quantity)
				}
			}
			if (element.not == false && element.cs == "CS1" && element.cs.trim() != "") {
				if(element.quantity != undefined){
					cs1Sum = cs1Sum + Number(element.quantity)
				}
			}
			this.unratedQuantity = this.totalElementQuantity - cs1Sum - fieldSum
			this.csValue = cs1Sum + this.unratedQuantity
			var cc1 = this.outputArray.filter((ele => ele.key == "CS1"))
			cc1[0].value = this.csValue
		});
		if(chechAarray.length==0){
			this.unratedQuantity = this.totalElementQuantity
		  }
		
		  this.obj.id = "";
		  this.obj.condition_code = "";
		  this.obj.cs = "";
		  this.obj.quantity = "";
		  this.obj.not = false;
		  this.obj.item_id = 0
	}
	toggleDatePicker(picker) {
		picker.open();
	}
	   //default value & minimum value
	   numbers(id){
		// console.log(event.target.value)
		let end : any =  document.getElementById(id);
		var len = end.value.length;
		  if (end.setSelectionRange) {
		    end.focus();
		    end.setSelectionRange(len, len);
			end.select();
		  }
				
		 this.inputBox = document.getElementById(id);
	
		 this.inputBox.onkeypress = function(e) {    e = e || window.event;
			var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
		
			// Allow non-printable keys
			if (!charCode || charCode == 8 /* Backspace */ ) {
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
		if(isNaN(+pastedText)){
		  return false
		}else{
		  return pastedText
		}
	  }

	   ext_numbers(id){
		// console.log(event.target.value)
		let end : any =  document.getElementById(id + 'ext');
		var len = end.value.length;
		  if (end.setSelectionRange) {
		    end.focus();
		    end.setSelectionRange(len, len);
			end.select();
		  }
				
		 this.inputBox = document.getElementById(id + 'ext');
	
		 this.inputBox.onkeypress = function(e) {    e = e || window.event;
			var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
		
			// Allow non-printable keys
			if (!charCode || charCode == 8 /* Backspace */ ) {
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



	getcalculationvalue(element_data){
		if(element_data.calculation==""){
			return ""
		}
		return this.dataService.getcalculationvalue(element_data);
	}
  // To delete the row of the table in weld wmata form
  deleterow(index){
    var htmlElement = document.getElementById("myList") as HTMLTableElement;
    let tt = htmlElement.rows
    var table1 = document.querySelector('table').rows;
    let findIndex;
    for(let a = 0; a < tt.length; a++){
      let getId = tt[a].getAttribute("id");
      let reqkey = this.idkey+index;
      if(getId == reqkey){
        findIndex = a;
        tt[findIndex].remove();
        break;
      }
    }
    var table2 = document.querySelector('tbody.body');
   let copyFormLeft = _.cloneDeep(this.formContentleft);
   if(this.formContentleft.length > index){
    this.formContentleft = [];
    copyFormLeft.splice(index,1);
    this.formContentleft = copyFormLeft;
   }
   if(this.formContentright.length > index){
    this.formContentright.splice(index,1)
   }
  }
  // To add new row in tha table in weld wmata form
  add(){
    console.log("success");
    this.formShow = true;
    console.log(this.weld_FormStructure);
    this.setDefault();
  }
  // To split the user enetered table values of the row into two columns in weld wmata form
  splitarray(values){
    let dataleft = {
      Weld: values.weldId,
      Repair: values.repairType,
      Entire : values.areaEntire,
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
  onSubmit(formdata){
    this.formShow = false;
	const result = this.checkemptyornot(formdata.value);
    if(result === true){
      return;
    }
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
  convertUUIDtoNormal(formValues){
      let finalArray = [];
      let sampleObject = {
        weld_Id :"",area_Entire :"",interpretation :"",repair : "",area_Specific : "",remarks : "",
      }
      for(let i in formValues){
        sampleObject.weld_Id ="";
        sampleObject.area_Entire ="";
        sampleObject.interpretation ="";
        sampleObject.repair ="";
        sampleObject.area_Specific ="";
        sampleObject.remarks ="";
        for(let key in formValues[i]){
          for(let j in this.fieldsWeld){
            if(this.fieldsWeld[j].element_uuid == key){
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
                  let index = this.fieldsWeld.findIndex((id)=>id.element_uuid == formValues[i][key]);
                  if(index > -1){
                    sampleObject.interpretation = getOptions[index].name;
                  }
                  else{
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
  custom_form_make_uuid(formValue){
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
        //   let options = formFields[index5].options;
        //   let optionIndex = options.findIndex((id)=>id.name == formValue[data]);
        //   if(optionIndex > -1){
        //     formValue[formFields[index5].element_uuid] = options[optionIndex].element_uuid;
        //   }
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



	// common function implemented by dataservice file so below code is commented 


	// squareRootCalculation(givenString) {
	// 	let givenCaluValue = givenString;
	// 	if (givenString == "√") {
	// 		return givenString;
	// 	}
	// 	let isFirstValue = false;
	// 	if (givenCaluValue[0] == "√") {
	// 		isFirstValue = true;
	// 	}
	// 	givenCaluValue = givenCaluValue.trim();
	// 	if (givenCaluValue.includes("(") && givenCaluValue.includes(")")){
	// 	    let def_value = Number("-999.8888");
	// 	    givenCaluValue = this.bracketFunctionCalculation(givenCaluValue,def_value,true);
	// 	}
	// 	if (givenCaluValue == "") {
	// 		return givenString
	// 	}
	// 	if (givenCaluValue.includes("^")){
	// 	    givenCaluValue = this.powerOfCalculation(givenCaluValue);
	// 	}
	// 	while (givenCaluValue.includes("√")) {
	// 		let splitMainValue = givenCaluValue.split("√");
	// 		splitMainValue = splitMainValue.filter((empty_bin)=>empty_bin!="");
	// 		// √3+7+√9
	// 		var splitedStringValue = "";
	// 		if (splitMainValue.length > 1) {
	// 			splitedStringValue = String(splitMainValue[1]);
	// 			if (isFirstValue) {
	// 				splitedStringValue = String(splitMainValue[0]);
	// 				isFirstValue = false;
	// 			}
	// 		}
	// 		else if (splitMainValue.length == 1) {
	// 			splitedStringValue = String(splitMainValue[0]);
	// 			isFirstValue = false;
	// 		} else {
	// 			break;
	// 		}
	// 		if (splitedStringValue != "") {
	// 			var isNegativeValue = false;
	// 			// if let doubleValue = Double(splitedStringValue), doubleValue < 0 {
	// 			let doubleValue = Number(splitedStringValue);
	// 			if  (doubleValue < 0) {
	// 			    isNegativeValue = true;
	// 				splitedStringValue = splitedStringValue.substring(1);
	// 			}
	// 			// if let firstChar = splitedStringValue.first, let str_firstChar = String(firstChar) as? String, let isNumberOnly = P3Utils().checkNumberOnlyForSquareRoot(givenValue: str_firstChar) as? Bool , isNumberOnly == true {
	// 			let firstChar = splitedStringValue[0];
	// 			let checkNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	// 			let checksymbol = ['+', '-', '*', '/'];
	// 			if (checkNumbers.includes(firstChar)) {
	// 				var modifiedCaluValue = "";
	// 				var isLoopCompleted = false;
	// 				var squareRootValueAdded = false;
	// 				for (let gIndex = 0; gIndex < splitedStringValue.length; gIndex++) {
	// 					if (!checkNumbers.includes(splitedStringValue[gIndex])) {
	// 						isLoopCompleted = true;
	// 						let doubleValue = Number(modifiedCaluValue);
	// 						if (isNegativeValue) {
	// 							modifiedCaluValue = "-" + modifiedCaluValue;
	// 						}
	// 						modifiedCaluValue = "√" + modifiedCaluValue;
	// 						var squareRootValue = modifiedCaluValue;
	// 						if (!checksymbol.includes(doubleValue.toString())) {
	// 							squareRootValueAdded = true;
	// 							let sqear = Math.sqrt(doubleValue);
	// 							squareRootValue = String(sqear);
	// 							if (isNegativeValue) {
	// 								squareRootValue = "-" + squareRootValue
	// 							}
	// 						}
	// 						//replace the value
	// 						givenCaluValue = givenCaluValue.replace(modifiedCaluValue,squareRootValue);
	// 						console.log(givenCaluValue);
	// 						modifiedCaluValue = "";
	// 					}
	// 					else {
	// 						modifiedCaluValue = modifiedCaluValue == "" ? String(splitedStringValue[gIndex]) : modifiedCaluValue + String(splitedStringValue[gIndex]);
	// 					}
	// 				}
	// 				if (!isLoopCompleted && modifiedCaluValue != "") {
	// 					let doubleValue = Number(modifiedCaluValue);
	// 					if (isNegativeValue) {
	// 						modifiedCaluValue = "-" + modifiedCaluValue
	// 					}
	// 					modifiedCaluValue = "√" + modifiedCaluValue;
	// 					var squareRootValue = modifiedCaluValue;
	// 					// if doubleValue != nil {
	// 					if (!checksymbol.includes(doubleValue.toString())) {
	// 						squareRootValueAdded = true;
	// 						let sqear = Math.sqrt(doubleValue);
	// 						squareRootValue = String(sqear);
	// 						if (isNegativeValue) {
	// 							squareRootValue = "-" + squareRootValue
	// 						}
	// 					}
	// 					//replace the value
	// 					givenCaluValue = givenCaluValue.replace(modifiedCaluValue,squareRootValue);
	// 					console.log(givenCaluValue);
	// 				}
	// 				if (!squareRootValueAdded) {
	// 					break;
	// 				}
	// 			}
	// 			else {
	// 				break;
	// 			}
	// 		}
	// 		else {
	// 			break;
	// 		}
	// 	}
	// 	return givenCaluValue;
	// }

	// bracketFunctionCalculation(calculationstring : string, def_value:number,isForSqeareRoot:boolean){
    //     var calculationValue = calculationstring;
    //     // if calculationValue.includes(".rounded()"){
    //     //     calculationValue = calculationValue.replacingOccurrences(of: ".rounded()", with: ".round")
    //     // }
    //     var cals_value = calculationValue;
    //     // let Start_count = calculationValue.filter{ $0 == "("}.count;doubt
    //     // let Close_count = calculationValue.filter{ $0 == ")"}.count;doubt
	// 	// "need to add!"
	// 	let Start_count = 1;
    //     let Close_count = 2;
    //     if (Start_count == Close_count) {
    //         while (cals_value.includes("(") && cals_value.includes(")")){
    //             var isNeedMultipleSymbolFirst : boolean = false;
    //             var isNeedMultipleSymbolLast : boolean = false;
    //             if (cals_value.includes("()")){
    //                 return "";
    //             }
    //             let close_brac_index = cals_value.indexOf(")");
    //             let close_bracket_split = cals_value.split(")",1);
    //             if (close_bracket_split.length > 0){
    //                 let b4_close_brac_value = String(close_bracket_split[0])
    //                 if (close_bracket_split.length > 1) {
    //                     let lastValue = String(close_bracket_split[1])
    //                     // let lastchar = lastValue.first!;
	// 					let lastchar = "need to add";
	// 					// doubt
    //                     let symbols = ["+","-","*","/",")"]
    //                     if (!symbols.includes(String(lastchar)) && !isForSqeareRoot) {
    //                         isNeedMultipleSymbolLast = true;
    //                     }
    //                 }
    //                 let reverse_b4_value = String(b4_close_brac_value.split("").reverse().join(""));
    //                 var start_brac_index = reverse_b4_value.indexOf("(");
    //                 start_brac_index = close_brac_index! - start_brac_index!
    //                 let start_bracket_split = reverse_b4_value.split("(",1);
    //                 if (start_bracket_split.length > 0) {
    //                     let req_reverse_str = String(start_bracket_split[0])
    //                     if (start_bracket_split.length > 1) {
    //                         let reverse_lastValue = String(start_bracket_split[1])
    //                         let lastValue1 = String(reverse_lastValue.split("").reverse().join(""));
    //                         // let lastchar1 = lastValue1.last!
	// 						let lastchar1 = "need to add!"
    //                         let symbols1 = ["+","-","*","/"]
    //                         if !symbols1.includes(String(lastchar1)) && !isForSqeareRoot!{
    //                             isNeedMultipleSymbolFirst = true
    //                         }
    //                     }
    //                     var require_str = String(req_reverse_str.split("").reverse().join(""));
    //                     if (require_str.includes("√")){
    //                         require_str = this.squareRootCalculation(require_str)
    //                     }
    //                     // if (require_str.includes("^")){
    //                     //     require_str = powerOfCalculation(require_str);
    //                     // }
	// 					let req_calculation_value = 6;
    //                     // let req_calculation_value = self.separateCalc(str_value: require_str, defvalue:def_value);
    //                     if (req_calculation_value != def_value) {
    //                         if(isNeedMultipleSymbolFirst || isNeedMultipleSymbolLast){
    //                             if (isNeedMultipleSymbolFirst && isNeedMultipleSymbolLast){
    //                                 let is_multiple_symbol = "*\(req_calculation_value)*"
    //                                 let first_value = cals_value.substring(toIndex: start_brac_index!-1)
    //                                 let last_value = cals_value.substring(fromIndex: close_brac_index!+1)
    //                                 cals_value = first_value + is_multiple_symbol + last_value;
    //                             }else if(isNeedMultipleSymbolFirst) {
    //                                 let is_multiple_symbol = "*\(req_calculation_value)"
    //                                 let first_value = cals_value.substring(toIndex: start_brac_index!-1)
    //                                 let last_value = cals_value.substring(fromIndex: close_brac_index!+1)
    //                                 cals_value = first_value + is_multiple_symbol + last_value
    //                             }else if (isNeedMultipleSymbolLast) {
    //                                 let is_multiple_symbol = "\(req_calculation_value)*"
    //                                 let first_value = cals_value.substring(toIndex: start_brac_index!-1)
    //                                 let last_value = cals_value.substring(fromIndex: close_brac_index!+1)
    //                                 cals_value = first_value + is_multiple_symbol + last_value
    //                             }
    //                         }else{
    //                             let is_multiple_symbol = "\(req_calculation_value)"
    //                             let first_value = cals_value.substring(toIndex: start_brac_index!-1)
    //                             let last_value = cals_value.substring(fromIndex: close_brac_index!+1)
    //                             cals_value = first_value + is_multiple_symbol + last_value
    //                            // cals_value =  cals_value.replacingOccurrences(of: "(\(require_str))", with: "\(req_calculation_value)")
    //                         }
    //                      }else{
    //                         return "";
    //                     }
    //                 }
    //             }
    //         } // while loop end
    //         return cals_value;
    //     }
    //     else{
    //         return "";
    //     }
    // }

	// bracketFunctionCalculation(calculationstring : string, def_value:number,isForSqeareRoot:boolean){
	// 	let calculatioValue = calculationstring;
	// 	let opencircle = 0;
	// 	let closecircle = 0;
	// 	for(let char=0;char<calculationstring.length;char++){
	// 		if(calculationstring[char]=="("){
	// 			opencircle = opencircle + 1;
	// 		}
	// 		else if(calculationstring[char]==")"){
	// 			closecircle = closecircle + 1;
	// 		}
	// 	}	
	// 	let Start_count = opencircle;
    // 	let Close_count = closecircle;
	// 	if(Start_count == Close_count){
	// 		if(calculatioValue.includes("()")){
	// 			return "";
	// 		}
	// 		let get_inside_squre_bracket_values = calculatioValue.match(/\(([^()]*)\)/g).map(function($0) { return $0.substring(1,$0.length-1) });
	// 		if(get_inside_squre_bracket_values.length>0){
	// 			let checksymbol = ["+","-","*","/"];
	// 			for(let v=0;v<get_inside_squre_bracket_values.length;v++){
	// 				let first_char = get_inside_squre_bracket_values[v][0];
	// 				let last_char = get_inside_squre_bracket_values[v][get_inside_squre_bracket_values[v].length-1];
	// 				if(checksymbol.includes(first_char) || checksymbol.includes(last_char)){
	// 					return calculatioValue;
	// 				}
	// 				let modification_value = `(${get_inside_squre_bracket_values[v]})`;
	// 				let cals_value = eval(get_inside_squre_bracket_values[v]);
	// 				if(isNaN(cals_value)){
	// 					return "";
	// 				}
	// 				else{
	// 					calculatioValue = calculatioValue.replace(modification_value,cals_value);
	// 				}
	// 			}
	// 			return calculatioValue;
	// 		}
	// 		else{
	// 			return calculatioValue;
	// 		}
	// 	}
	// 	else{
	// 		return "";
	// 	}
	// }

	// getcalculationvalue(value) {
	// 	let check_seperators = ["(", ")", "+", "-", "*", "/"];
	// 	let get_calculation = value
	// 	let get_fist_value = value[0];
	// 	let get_second_value = value[1];
	// 	let get_last_value = value[value.length - 1];
	// 	if (check_seperators.includes(get_fist_value) && check_seperators.includes(get_second_value)) {
	// 		return value;
	// 	}
	// 	else if (check_seperators.includes(get_last_value)) {
	// 		return value;
	// 	}
	// 	else if ((get_calculation.includes("(") && !get_calculation.includes(")"))){
	// 		return value;
	// 	}
	// 	else {
	// 		let get_dot_value = get_calculation.includes(".");
	// 		// convert last 10 decimal
	// 		if(get_dot_value){
	// 			let get_value = Number(get_calculation).toFixed(10);
	// 			let convertNumber = Number(get_value);
	// 			return convertNumber;
	// 		}
	// 		else{
	// 			return value;
	// 		}
	// 		return ;
	// 	}
	// }

	// powerOfCalculation(givenString:string){
    //     var givenCaluValue = givenString;
    //     if (givenString == "^"){
    //         return givenString;
    //     }
    //     givenCaluValue = givenCaluValue.trim();
    //     if (givenCaluValue.includes("(") && givenCaluValue.includes(")")){
    //         let def_value = Number("-999.8888");
    //         givenCaluValue = this.bracketFunctionCalculation(givenCaluValue,def_value!,true);
    //     }
    //     if (givenCaluValue == ""){
    //         return givenString;
    //     }
    //     while (givenCaluValue.includes("^")){
    //         let splitMainValue = givenCaluValue.split("^");
    //         var splitedStringValue = ""
    //         var powerValue : number;
    //         if (splitMainValue.length > 0) {
    //             splitedStringValue = String(splitMainValue[0])
    //             if (splitMainValue.length > 1) {
    //                 let after_string = String(splitMainValue[1])
    //                 var modifiedpowerValue = "";
    //                 var isCalculated = false;
    //                 let validCharacters = ["1","2","3","4","5","6","7","8","9","0"];
	// 				let firstChar = after_string[0];
	// 				let str_firstChar = String(firstChar);
    //                 if ( typeof str_firstChar == 'string' && validCharacters.includes(str_firstChar)) {
    //                     for (let singleChar of after_string) {
    //                         if (validCharacters.includes(String(singleChar))){
    //                             modifiedpowerValue = modifiedpowerValue == "" ? String(singleChar) : modifiedpowerValue + String(singleChar);
    //                         }else{
    //                             let intValue = Number(modifiedpowerValue);
    //                             if (intValue != null) {
    //                                 isCalculated = true;
    //                                 powerValue = intValue;
    //                                 modifiedpowerValue = "";
    //                                 break;
    //                             }
    //                         }
    //                     }
    //                     if (!isCalculated) {
    //                         let intValue = Number(modifiedpowerValue);
    //                         if (intValue != null) {
    //                             isCalculated = true;
    //                             powerValue = intValue;
    //                             modifiedpowerValue = "";
    //                         }
    //                     }
    //                 }
    //             }
    //         }else{
    //             break;
    //         }
    //         if (splitedStringValue != "") {
	// 			let firstChar = splitedStringValue[splitedStringValue.length-1];
	// 			let str_firstChar = String(firstChar);
	// 			let validCharacters = ["1","2","3","4","5","6","7","8","9","0"];
	// 			let isNumberOnly = validCharacters.includes(str_firstChar); 
    //             if (typeof str_firstChar == 'string' &&  isNumberOnly == true) {
    //                 splitedStringValue =  String(splitedStringValue.split("").reverse().join(""));
    //                 var modifiedCaluValue = "";
    //                 var isLoopCompleted = false;
    //                 var powerValueisAdded = false;
    //                 for (let item of splitedStringValue){
    //                     let invalidCharacters = ["+","*","-","/","√"]
    //                     if (invalidCharacters.includes(String(item))) {
    //                         isLoopCompleted = true;
    //                         modifiedCaluValue = String(modifiedCaluValue.split("").reverse().join(""));
    //                         let doubleValue = Number(modifiedCaluValue);
    //                         if (powerValue == null) {
    //                             powerValue = 1;
    //                             modifiedCaluValue = modifiedCaluValue + "^";
    //                         }else{
	// 						// "\(powerValue!)"
    //                         modifiedCaluValue = modifiedCaluValue + "^" + powerValue.toString();
    //                         }
    //                         var powerOfValue = modifiedCaluValue
    //                         if (doubleValue != null) {
    //                             powerValueisAdded = true;
	// 							// pow(Decimal(doubleValue!), powerValue)
    //                             let powerOf = Math.pow(doubleValue!,powerValue);
    //                             console.log(powerOf);
	// 							// "\(powerOf)"
    //                             powerOfValue = powerOf.toString();
    //                         }
    //                         givenCaluValue = givenCaluValue.replace(modifiedCaluValue,powerOfValue);
    //                         console.log(givenCaluValue);
    //                     }else{
    //                         modifiedCaluValue = modifiedCaluValue == "" ? String(item) : modifiedCaluValue + String(item);
    //                     }
    //                 }
    //                 if (!isLoopCompleted && modifiedCaluValue != "") {
    //                     modifiedCaluValue = String(modifiedCaluValue.split("").reverse().join(""));
    //                     let doubleValue = Number(modifiedCaluValue);
    //                     if (powerValue == null) {
    //                         powerValue = 1;
    //                         modifiedCaluValue = modifiedCaluValue + "^";
    //                     }else{
	// 						// "\(powerValue!)"
    //                         modifiedCaluValue = modifiedCaluValue + "^" + powerValue.toString();
    //                     }
    //                     var powerOfValue = modifiedCaluValue;
    //                     if (doubleValue != null) {
    //                         powerValueisAdded = true;
	// 						// pow(Decimal(doubleValue!), powerValue)
    //                         let powerOf = Math.pow(doubleValue!,powerValue);
    //                         console.log(powerOf);
	// 						// "\(powerOf)"
    //                         powerOfValue = powerOf.toString();
    //                     }
    //                     givenCaluValue = givenCaluValue.replace(modifiedCaluValue,powerOfValue);
    //                     console.log(givenCaluValue);
    //                 }
    //                 if (!powerValueisAdded) {
    //                     break;
    //                 }
    //             }else{
    //                 break;
    //             }
    //         }else{
    //             break;
    //         }
    //     }
    //     return givenCaluValue;
    // }
	   
	
   
}
