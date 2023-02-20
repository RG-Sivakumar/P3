import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { DataserviceService } from 'src/app/document/services/dataservice.service';
import { profile_option } from './profile.model';
import { starttime } from './starttime.model';
import { timber_form_api_structure } from './timber_form_api_struct.model';
import { timber_form_main } from './timber_form_main.model';
import { timber_form_table } from './timber_table_model';

@Component({
  selector: 'app-timberform',
  templateUrl: './timberform.component.html',
  styleUrls: ['./timberform.component.css']
})
export class TimberformComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() name: string; // render section
  @Input() custom_form_timber: any; // custom form element data
  pileSegmentOn: boolean = false; //  pile segment button click handle
  custom_form_timber_fields = [];
  dummy = [1];
  radius: number = 0;
  diameter: number = 0;
  radius_difference: any = 0;
  diameter_difference: any = 0;
  form_bend_total_counts: number = 0;
  // form structrue
  new_pile_segment_form: FormGroup = new FormGroup({
    startelavation: new FormControl(),
    endelavation: new FormControl(),
    profile: new FormControl(),
    drillstarttime: new FormControl(),
    bend1: new FormGroup({
      bend1value: new FormControl(),
      bend1option: new FormControl(),
    }),
    bend2: new FormGroup({
      bend2value: new FormControl(),
      bend2option: new FormControl(),
    }),
    bend3: new FormGroup({
      bend3value: new FormControl(),
      bend3option: new FormControl(),
    }),
    bend4: new FormGroup({
      bend4value: new FormControl(),
      bend4option: new FormControl(),
    }),
    bend5: new FormGroup({
      bend5value: new FormControl(),
      bend5option: new FormControl(),
    }),
    bend6: new FormGroup({
      bend6value: new FormControl(),
      bend6option: new FormControl(),
    }),
    bend7: new FormGroup({
      bend7value: new FormControl(),
      bend7option: new FormControl(),
    }),
    comments: new FormControl(),
  });
  // form structrue

  new_segment$: Subscription = null;
  diameter_change$: Subscription = null;
  timber_form_table: timber_form_main[] = [];
  timber_form_default_values : any[] = [];
  @Output() default_value_Changed: EventEmitter<any> = new EventEmitter();
  editRowIndex:number = -1;
  editElevationUUID:string = "";
  @Input() multipleSelectOn_timber:boolean = false;
  get_fields_profile:any = [];
  get_fields_statTime:any = [];

  constructor(private dataService:DataService,private dataService_doc:DataserviceService) {
    // form values changes action capture subscription
    this.new_segment$ =  this.new_pile_segment_form.valueChanges.subscribe(x => {
      console.log('form value changed', x);
      let get_form_total_count = 0;
      if (x.bend1.bend1value != "") {
        get_form_total_count = get_form_total_count + Number(x.bend1.bend1value);
      }
      if (x.bend2.bend2value != "") {
        get_form_total_count = get_form_total_count + Number(x.bend2.bend2value);
      }
      if (x.bend3.bend3value != "") {
        get_form_total_count = get_form_total_count + Number(x.bend3.bend3value);
      }
      if (x.bend4.bend4value != "") {
        get_form_total_count = get_form_total_count + Number(x.bend4.bend4value);
      }
      if (x.bend5.bend5value != "") {
        get_form_total_count = get_form_total_count + Number(x.bend5.bend5value);
      }
      if (x.bend6.bend6value != "") {
        get_form_total_count = get_form_total_count + Number(x.bend6.bend6value);
      }
      if (x.bend7.bend7value != "") {
        get_form_total_count = get_form_total_count + Number(x.bend7.bend7value);
      }
      this.form_bend_total_counts = get_form_total_count;
      // check diameter difference show in UI view
      if (this.form_bend_total_counts > this.diameter) {
        this.diameter_difference = this.form_bend_total_counts - this.diameter;
        this.diameter_difference = this.diameter_difference.toFixed(2);
      }
      else if (this.form_bend_total_counts < this.diameter) {
        this.diameter_difference = this.diameter - this.form_bend_total_counts;
        this.diameter_difference = this.diameter_difference.toFixed(2);
      }
      // check radius difference show in UI view
      if (this.form_bend_total_counts > this.radius && this.diameter != 0) {
        this.radius_difference = this.form_bend_total_counts - this.radius;
        this.radius_difference = this.radius_difference.toFixed(2);
      }
      else if (this.form_bend_total_counts < this.radius && this.diameter != 0) {
        this.radius_difference = this.radius - this.form_bend_total_counts;
        this.radius_difference = this.radius_difference.toFixed(2);
      }
    })
    // diameter changes capture and reload the table view
    this.diameter_change$ = this.dataService_doc.diameter_changes.subscribe((data_level)=>{
      this.custom_form_timber = data_level;
      if (this.custom_form_timber != undefined) {
        this.timber_form_access();
      }
    })
  }


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    console.log(this.custom_form_timber);
    console.log(this.form_bend_total_counts, this.radius);
    // get timber form data into make a view 
    if (this.custom_form_timber != undefined) {
      this.timber_form_access();
    }
  }

  addnewpilesegment() {
    this.pileSegmentOn = !this.pileSegmentOn;
    // form values reset;
    this.setDefault();
  }



  // done_process(){
  //   this.pileSegmentOn = !this.pileSegmentOn;
  // }

  timber_form_access() {
    // reset the table view initial_time
    this.timber_form_table = [];
    let get_timber_form_field = this.custom_form_timber;
    // diameter and radius value map
    let get_diameter_value_index = get_timber_form_field.findIndex((diametercheck)=>diametercheck.hasOwnProperty("diameter"));
    
    if(get_diameter_value_index > -1){
      var get_diameter_value = get_timber_form_field[get_diameter_value_index].element_data.default_value;
    }
    if (get_diameter_value != undefined && get_diameter_value != null && get_diameter_value != "") {
      get_diameter_value = Number(get_diameter_value);
      this.diameter = get_diameter_value;
      this.radius = (get_diameter_value / 2);
    }
    else {
      this.diameter = 0;
      this.radius = 0;
    }
    // initialy make a table structrue
    let get_custom_type_index = get_timber_form_field.findIndex((form_data_loop) => form_data_loop.element_type == 'uti-entry-field-TIMBER');
    if (get_custom_type_index > -1) {
      let get_custom_field = get_timber_form_field[get_custom_type_index];
      
      if (get_custom_field.element_data.hasOwnProperty('default_values') && get_custom_field.element_data.default_values != undefined &&
      get_custom_field.element_data.default_values != null && get_custom_field.element_data.default_values != "") {
        // default value anyone values does not have a element uuid we add manually
        for(let aj=0;aj<get_custom_field.element_data.default_values.length;aj++){
          if(!get_custom_field.element_data.default_values[aj].hasOwnProperty('element_uuid')){
            get_custom_field.element_data.default_values[aj]["element_uuid"] = this.dataService.generateUUID();
          }
        }
        this.timber_form_default_values = get_custom_field.element_data.default_values;
        let get_default_values = get_custom_field.element_data.default_values;
        for (let table = 0; table < get_default_values.length; table++) {
          this.make_timber_form_table(get_default_values[table]);
        }
      }
      else {
        // default values key is not there will happpen below line
        this.timber_form_table = [];
        this.timber_form_default_values = [];
      }
      // mapping profile option name
      this.profile_option_map();

    }
  }

  onSubmit(timber_form_values?: NgForm) {
     this.pileSegmentOn = !this.pileSegmentOn;
    console.log(timber_form_values.value);
    let form_values = timber_form_values.value;
    // api default values make below function
    let convert_form_stucture = this.default_values_api_struct_maintain(form_values);
    let clone_table_values = _.cloneDeep(convert_form_stucture);
    // table view make below function
    this.make_timber_form_table(clone_table_values);
    // new created elevation push to default values array
    if(this.editRowIndex > -1 && this.editElevationUUID != ""){
      let find_remove_obj_index = this.timber_form_default_values.findIndex((default_In)=>default_In.element_uuid == this.editElevationUUID);
      if(find_remove_obj_index > -1){
        // replace the default values when edit the values
        this.timber_form_default_values.splice(find_remove_obj_index,1,convert_form_stucture);
        // same elevation change profile name
        for(let p=0;p<this.timber_form_default_values.length;p++){
          if(convert_form_stucture["startElevation"] == this.timber_form_default_values[p].startElevation && convert_form_stucture["endElevation"] == this.timber_form_default_values[p].endElevation){
            this.timber_form_default_values[p].profile = convert_form_stucture["profile"];
          }
        }
      }
      else{
        // push the default values when edit happen elevation changes
        this.timber_form_default_values.push(convert_form_stucture);  
        // same elevation change profile name
        for(let p=0;p<this.timber_form_default_values.length;p++){
          if(convert_form_stucture["startElevation"] == this.timber_form_default_values[p].startElevation && convert_form_stucture["endElevation"] == this.timber_form_default_values[p].endElevation){
            this.timber_form_default_values[p].profile = convert_form_stucture["profile"];
          }
        }
      }
    }
    else{
      this.timber_form_default_values.push(convert_form_stucture);
      // same elevation change profile name
      for(let p=0;p<this.timber_form_default_values.length;p++){
        if(convert_form_stucture["startElevation"] == this.timber_form_default_values[p].startElevation && convert_form_stucture["endElevation"] == this.timber_form_default_values[p].endElevation){
          this.timber_form_default_values[p].profile = convert_form_stucture["profile"];
        }
      }
    }
    // emit the data restrict form design component
    if(this.name != "formdesign"){
      const sendupdatevalue = this.timber_form_default_values;
      this.default_value_Changed.emit(sendupdatevalue);  
    }
    // reset the edit index value
    this.editRowIndex = -1;
    // reset the edit elementuuid
    this.editElevationUUID = "";
  }

  setDefault() {
    let pile_segment = {
      startelavation: "",
      endelavation: "",
      profile: "",
      drillstarttime: "",
      bend1: {
        bend1value: "",
        bend1option: "",
      },
      bend2: {
        bend2value: "",
        bend2option: "",
      },
      bend3: {
        bend3value: "",
        bend3option: "",
      },
      bend4: {
        bend4value: "",
        bend4option: "",
      },
      bend5: {
        bend5value: "",
        bend5option: "",
      },
      bend6: {
        bend6value: "",
        bend6option: "",
      },
      bend7: {
        bend7value: "",
        bend7option: "",
      },
      comments: "",
    };

    this.new_pile_segment_form.setValue(pile_segment);
  }

  
  make_timber_form_table(pilesegmentvalue) {
    // make array of object in table view based on the data
    // pilesegment value adding new segment accept and already endered value using for make table view
    let get_addpilesegmentvalue = pilesegmentvalue;
    let form_main_table_instance = new timber_form_main();
    // get form values stored on local varibale
    form_main_table_instance.startElevation_main = get_addpilesegmentvalue.startElevation;
    form_main_table_instance.endElevation_main = get_addpilesegmentvalue.endElevation;
    form_main_table_instance.profile_main = get_addpilesegmentvalue.profile;
    // table view structrue
    let table_value_instance = new timber_form_table();
    table_value_instance.startTime = get_addpilesegmentvalue.startTime;
    table_value_instance.b1sd = get_addpilesegmentvalue.b1sd;
    table_value_instance.b1c = get_addpilesegmentvalue.b1c;
    table_value_instance.b2sd = get_addpilesegmentvalue.b2sd;
    table_value_instance.b2c = get_addpilesegmentvalue.b2c;
    table_value_instance.b3sd = get_addpilesegmentvalue.b3sd;
    table_value_instance.b3c = get_addpilesegmentvalue.b3c;
    table_value_instance.b4sd = get_addpilesegmentvalue.b4sd;
    table_value_instance.b4c = get_addpilesegmentvalue.b4c;
    table_value_instance.b5sd = get_addpilesegmentvalue.b5sd;
    table_value_instance.b5c = get_addpilesegmentvalue.b5c;
    table_value_instance.b6sd = get_addpilesegmentvalue.b6sd;
    table_value_instance.b6c = get_addpilesegmentvalue.b6c;
    table_value_instance.b7sd = get_addpilesegmentvalue.b7sd;
    table_value_instance.b7c = get_addpilesegmentvalue.b7c;
    table_value_instance.comments = get_addpilesegmentvalue.comments;
    // initial payload only does not have a elementuuid so we put manualy 
    if(!get_addpilesegmentvalue.hasOwnProperty('element_uuid')){
      table_value_instance.element_uuid = this.dataService.generateUUID();   
    }
    else{
      // below code include edit and adding pile
      table_value_instance.element_uuid = get_addpilesegmentvalue.element_uuid; 
    }
    // table_value_instance.comments = get_addpilesegmentvalue.comments;
    let send_calulcation = pilesegmentvalue;
    table_value_instance.bendtotal_count = this.calculationrd(send_calulcation);
    let new_pile_segment = table_value_instance;
    form_main_table_instance.timber_form_table = [new_pile_segment];
    // finish the single elevation round
    if (this.timber_form_table.length > 0) {
      let get_start_elevation = get_addpilesegmentvalue.startElevation;
      let get_end_elevation = get_addpilesegmentvalue.endElevation;
      let find_same_elevation = this.timber_form_table.findIndex((single_table_value) => single_table_value.startElevation_main == get_start_elevation && single_table_value.endElevation_main == get_end_elevation);
      if (find_same_elevation > -1) {
        if(this.editRowIndex > -1 && this.editElevationUUID != ""){
          // edit values replace area
          this.timber_form_table[find_same_elevation].timber_form_table.splice(this.editRowIndex,1,table_value_instance);
          // last entered profile name replace the elevation level
          this.timber_form_table[find_same_elevation].profile_main = form_main_table_instance.profile_main;
          // this.timber_form_table[find_same_elevation].timber_form_table.push(table_value_instance)
        }
        else{
          // new elevation values enter means push newly
          this.timber_form_table[find_same_elevation].timber_form_table.push(table_value_instance);
          // last entered profile name replace the elevation level
          this.timber_form_table[find_same_elevation].profile_main = form_main_table_instance.profile_main;
        }
      }
      else {
        // different elevation of edited data below if condition code work
        if(this.editRowIndex > -1 && this.editElevationUUID != ""){
          // need to delete old elvation datas
          for(let dl=0;dl<this.timber_form_table.length;dl++){
            let find_elevation_row_index =  this.timber_form_table[dl].timber_form_table.findIndex((table_row)=>table_row.element_uuid==this.editElevationUUID);
            if(find_elevation_row_index > -1){
              // delete old datas
              this.timber_form_table[dl].timber_form_table.splice(find_elevation_row_index,1);
              let get_count_length = this.timber_form_table[dl].timber_form_table.length;
              if(get_count_length == 0){
                this.timber_form_table.splice(dl,1);
              }
            }
          }
          // edit values push new changes of new elevation
          this.timber_form_table.push(form_main_table_instance);
        }
        else{
          this.timber_form_table.push(form_main_table_instance)
        }
        
      }
    }
    else {
      this.timber_form_table.push(form_main_table_instance)
    }
    console.log(this.timber_form_table);
  }


  getColorstatus(code){
    if(code == ''||code == null || code == undefined){
      return 'bend bend-empty-level';
    }
    else{
      let fontclass = this.name != 'document' ? '' : 'fontsizechangebendrd';
      switch (code) {
        case '1':
          return `bend bend-level-1 ${fontclass}`;
        case '2':
          return `bend bend-level-2 ${fontclass}`;
        case '3':
          return `bend bend-level-3 ${fontclass}`;
        case '4':
          return `bend bend-level-4 ${fontclass}`;
        case '5':
          return `bend bend-level-5 ${fontclass}`;
      }
    }
  }

  calculationrd(formvalues){
    let x = formvalues;
    let get_form_total_count = 0;
      if (x.b1sd != "") {
        get_form_total_count = get_form_total_count + Number(x.b1sd);
      }
      if (x.b2sd != "") {
        get_form_total_count = get_form_total_count + Number(x.b2sd);
      }
      if (x.b3sd != "") {
        get_form_total_count = get_form_total_count + Number(x.b3sd);
      }
      if (x.b4sd != "") {
        get_form_total_count = get_form_total_count + Number(x.b4sd);
      }
      if (x.b5sd != "") {
        get_form_total_count = get_form_total_count + Number(x.b5sd);
      }
      if (x.b6sd != "") {
        get_form_total_count = get_form_total_count + Number(x.b6sd);
      }
      if (x.b7sd != "") {
        get_form_total_count = get_form_total_count + Number(x.b7sd);
      }
      return get_form_total_count;
  }

  default_values_api_struct_maintain(form_entered_values){
    
    let default_structure = new Object();
    form_entered_values.bend1.bend1value = form_entered_values.bend1.bend1value == null ? '' : form_entered_values.bend1.bend1value;
    form_entered_values.bend2.bend2value = form_entered_values.bend2.bend2value == null ? '' : form_entered_values.bend2.bend2value;
    form_entered_values.bend3.bend3value = form_entered_values.bend3.bend3value == null ? '' : form_entered_values.bend3.bend3value;
    form_entered_values.bend4.bend4value = form_entered_values.bend4.bend4value == null ? '' : form_entered_values.bend4.bend4value;
    form_entered_values.bend5.bend5value = form_entered_values.bend5.bend5value == null ? '' : form_entered_values.bend5.bend5value;
    form_entered_values.bend6.bend6value = form_entered_values.bend6.bend6value == null ? '' : form_entered_values.bend6.bend6value;
    form_entered_values.bend7.bend7value = form_entered_values.bend7.bend7value == null ? '' : form_entered_values.bend7.bend7value;
    default_structure["startElevation"] = form_entered_values.startelavation.toString();
    default_structure["endElevation"] = form_entered_values.endelavation.toString();
    default_structure["profile"] = form_entered_values.profile;
    default_structure["startTime"] = form_entered_values.drillstarttime;
    default_structure["b1sd"] = form_entered_values.bend1.bend1value.toString();
    default_structure["b1c"] = form_entered_values.bend1.bend1option;
    default_structure["b2sd"] = form_entered_values.bend2.bend2value.toString();
    default_structure["b2c"] = form_entered_values.bend2.bend2option;
    default_structure["b3sd"] = form_entered_values.bend3.bend3value.toString();
    default_structure["b3c"] = form_entered_values.bend3.bend3option;
    default_structure["b4sd"] = form_entered_values.bend4.bend4value.toString();
    default_structure["b4c"] = form_entered_values.bend4.bend4option;
    default_structure["b5sd"] = form_entered_values.bend5.bend5value.toString();
    default_structure["b5c"] = form_entered_values.bend5.bend5option;
    default_structure["b6sd"] = form_entered_values.bend6.bend6value.toString();
    default_structure["b6c"] = form_entered_values.bend6.bend6option;
    default_structure["b7sd"] = form_entered_values.bend7.bend7value.toString();
    default_structure["b7c"] = form_entered_values.bend7.bend7option;
    default_structure["comments"] = form_entered_values.comments;
    default_structure["diameterMeasure"] = "";
    default_structure["radiusMeasure"] = "";
    // new created segment only access below uuid code.
    // not allow edit and delete 
    if(this.editRowIndex > -1 && this.editElevationUUID != ""){
      default_structure["element_uuid"] = this.editElevationUUID;
    }
    else{
      default_structure["element_uuid"] = this.dataService.generateUUID();
    }
    return default_structure;
  }

  newDrillSection(single_table_value){
    let get_single_table_value = single_table_value;
    console.log(get_single_table_value);
    let default_structure = new Object();
    default_structure["startElevation"] = get_single_table_value.startElevation_main.toString();
    default_structure["endElevation"] = get_single_table_value.endElevation_main.toString();
    default_structure["profile"] = get_single_table_value.profile_main.toString();
    default_structure["startTime"] = "";
    default_structure["b1sd"] = "";
    default_structure["b1c"] = "";
    default_structure["b2sd"] = "";
    default_structure["b2c"] = "";
    default_structure["b3sd"] = "";
    default_structure["b3c"] = "";
    default_structure["b4sd"] = "";
    default_structure["b4c"] = "";
    default_structure["b5sd"] = "";
    default_structure["b5c"] = "";
    default_structure["b6sd"] = "";
    default_structure["b6c"] = "";
    default_structure["b7sd"] = "";
    default_structure["b7c"] = "";
    default_structure["comments"] = "";
    default_structure["diameterMeasure"] = "";
    default_structure["radiusMeasure"] = "";
    default_structure["element_uuid"] = this.dataService.generateUUID();
    let clone_table_values = _.cloneDeep(default_structure);
    // table view make below function
    this.make_timber_form_table(clone_table_values);
    // new created elevation push to default values array
    this.timber_form_default_values.push(default_structure);
    // emit the data restrict form design component
    if(this.name != "formdesign"){
      const sendupdatevalue = this.timber_form_default_values;
      this.default_value_Changed.emit(sendupdatevalue); 
    }
  }

  editElevationRow(timber_form,rowIndex,editrowuuid){
    this.pileSegmentOn = !this.pileSegmentOn;
    this.editRowIndex = rowIndex;
    this.editElevationUUID = editrowuuid;
    // prefill the form field specified row values;
    console.log(timber_form,rowIndex);
    // let scroll_view = document.getElementById("editpart");
    // scroll_view.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
    let find_row = timber_form.timber_form_table[rowIndex];
    console.log(find_row);
    // form values prefill;
    this.setvaluesFormControl(timber_form,find_row);
  }

  setvaluesFormControl(timber_form,find_row){
    let get_row_values = find_row;
    let get_single_table = timber_form;
    let pile_segment = {
      startelavation: get_single_table.startElevation_main,
      endelavation: get_single_table.endElevation_main,
      profile: get_single_table.profile_main,
      drillstarttime: get_row_values.startTime,
      bend1: {
        bend1value: get_row_values.b1sd,
        bend1option: get_row_values.b1c,
      },
      bend2: {
        bend2value: get_row_values.b2sd,
        bend2option: get_row_values.b2c,
      },
      bend3: {
        bend3value: get_row_values.b3sd,
        bend3option: get_row_values.b3c,
      },
      bend4: {
        bend4value: get_row_values.b4sd,
        bend4option: get_row_values.b4c,
      },
      bend5: {
        bend5value: get_row_values.b5sd,
        bend5option: get_row_values.b5c,
      },
      bend6: {
        bend6value: get_row_values.b6sd,
        bend6option: get_row_values.b6c,
      },
      bend7: {
        bend7value: get_row_values.b7sd,
        bend7option: get_row_values.b7c,
      },
      comments: get_row_values.comments,
    };

    this.new_pile_segment_form.setValue(pile_segment);
  }

  delete_elevation_row(deleterowuuid){
    // remove table
    // need to delete elvation datas
    for(let dl=0;dl<this.timber_form_table.length;dl++){
      let find_elevation_row_index =  this.timber_form_table[dl].timber_form_table.findIndex((table_row)=>table_row.element_uuid==deleterowuuid);
      if(find_elevation_row_index > -1){
        // delete old datas
        this.timber_form_table[dl].timber_form_table.splice(find_elevation_row_index,1);
        let get_count_length = this.timber_form_table[dl].timber_form_table.length;
        if(get_count_length == 0){
          this.timber_form_table.splice(dl,1);
        }
      }
    }
    // delete default_values
    let find_remove_obj_index = this.timber_form_default_values.findIndex((default_In) => default_In.element_uuid == deleterowuuid);
    if (find_remove_obj_index > -1) {
      // remove delete data from default values array storage
      this.timber_form_default_values.splice(find_remove_obj_index, 1);
    }
    if(this.name != "formdesign"){
      const sendupdatevalue = this.timber_form_default_values;
      this.default_value_Changed.emit(sendupdatevalue);
    }
  }

  profile_option_map() {
    if (this.custom_form_timber != undefined && this.custom_form_timber != null && this.custom_form_timber.length > 0) {
      let find_field_index = this.custom_form_timber.findIndex((custom_field) => custom_field.element_type == "uti-entry-field-TIMBER");
      if (find_field_index > -1) {
        let get_fields_array = this.custom_form_timber[find_field_index].element_data.fields;
        if (get_fields_array != undefined && get_fields_array != null && get_fields_array.length > 0) {
          // profile name mapping
          let find_profie_field = get_fields_array.findIndex((p_field) => p_field.element_type == "dropdown" && p_field.element_name == "Profile");
          if (find_profie_field > -1) {
            this.get_fields_profile = []; // clear old values 
            let get_options = get_fields_array[find_profie_field].element_data.options;
            for (let opn = 0; opn < get_options.length; opn++) {
              let get_instance = new profile_option(get_options[opn].name);
              this.get_fields_profile.push(get_instance.name);
            }
          }
          // starttime name mapping
          let find_starttime_field = get_fields_array.findIndex((p_field) => p_field.element_type == "dropdown" && p_field.element_name == "Drill Start Time");
          if(find_starttime_field > -1){
            this.get_fields_statTime = []; // clear old values 
            let get_options_st = get_fields_array[find_starttime_field].element_data.options;
            for (let opn_st = 0; opn_st < get_options_st.length; opn_st++) {
              let index_position = (opn_st + 1).toString();
              let get_instance_st = new starttime(index_position,get_options_st[opn_st].name);
              this.get_fields_statTime.push(get_instance_st);
            }
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.new_segment$ != null) {
      this.new_segment$.unsubscribe();
    }
    if(this.diameter_change$ != null){
      this.diameter_change$.unsubscribe();
    }
  }

}
