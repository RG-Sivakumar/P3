import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { login } from "./projectmanagement/models/login-model";
import { v1 as uuidv1 } from "uuid";
import { EncryptDecryptService } from "./commonshared/services/encrypt-decrypt.service";

@Injectable({
  providedIn: "root",
})
export class DataService {

  su: login;

  private messageSource = new BehaviorSubject<string>("ascending");
  currentMessage = this.messageSource.asObservable();

  private messageSource1 = new BehaviorSubject<string>("");
  currentMessage1 = this.messageSource1.asObservable();


  constructor(private encrptdecrpt:EncryptDecryptService) { 
    
  }

  setprojectName(value) {
    this.messageSource1.next(value);
  }

  getprojectName() {
    return this.messageSource1.value;
  }

  changeMessage(message: string) {
    if (message == "") {
      message = "ascending"
    }
    this.messageSource.next(message);
  }

  private valueObs: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public setValue(value: string): void {
    this.valueObs.next(value);
  }

  public getValue(): Observable<string> {
    return this.valueObs;
  }

  public changeFormat(name) {
    // var changedName = name.split("'").join("‘");
    // changedName = changedName.split("\"").join("“");
    var changedName = "";
    if(name != undefined){
      var regex = "/\/g";
    changedName = name.replace(regex, "\\");
    changedName = name.split('\\').join("â");
    changedName = changedName.split("'").join("ê");
    changedName = changedName.split('"').join("ô");
    }else{
      changedName = "";
    }
    
    return changedName;
  }

  public changeSpecialtoKeyFormat(name) {
    // var changedName = name.split("'").join("‘");
    // changedName = changedName.split("\"").join("“");
    var changedName = "";
    if(name!=undefined)
    {
      changedName = name.split('â').join("\\");
      changedName = changedName.split("ê").join("'");
      changedName = changedName.split('ô').join('"');
      // changedName = changedName.split("Â").join("\\");
      changedName = changedName.split("Ê").join("'");
      changedName = changedName.split('Ô').join('"');
    }
    else{
      changedName = "";
    }
    return changedName;
  }

  changeSpecialtokeyformatList(getvalue:any,which_list_find:string){
    let change_value = getvalue;
    if(Array.isArray(change_value)){
      if(change_value.length>0){
        for(let k=0;k<change_value.length;k++){
          if(which_list_find=="switchPage"){
            change_value[k].toolbar_name = this.changeSpecialtoKeyFormat(change_value[k].toolbar_name);
          }
          if(which_list_find=='formlist'){
            change_value[k].form_name = this.changeSpecialtoKeyFormat(change_value[k].form_name);
          }
          else if(which_list_find=='toolbarlist'){
            change_value[k].toolbar_name = this.changeSpecialtoKeyFormat(change_value[k].toolbar_name);
          }
          else if(which_list_find=='documentlist'){
            change_value[k].folder_name = this.changeSpecialtoKeyFormat(change_value[k].folder_name);
          }
          else if(which_list_find=='taglist'){
            change_value[k].folder_tag_name = this.changeSpecialtoKeyFormat(change_value[k].folder_tag_name);
          }
          else if(which_list_find=='formtags'){
            change_value[k].form_tag_name = this.changeSpecialtoKeyFormat(change_value[k].form_tag_name);
          }
          else if(which_list_find=='toolbartags'){
            change_value[k].toolbar_tag_name = this.changeSpecialtoKeyFormat(change_value[k].toolbar_tag_name);
          }
          else if(which_list_find=='documentmanagetags'){
            change_value[k].layer_page_tag_name = this.changeSpecialtoKeyFormat(change_value[k].layer_page_tag_name);
          }
          else if(which_list_find=='projecttagname'){
            change_value[k].project_tag_name = this.changeSpecialtoKeyFormat(change_value[k].project_tag_name);
          }
          else if(which_list_find=='projectlist'){
            change_value[k].project_name = this.changeSpecialtoKeyFormat(change_value[k].project_name);
          }
          else if(which_list_find=='toolbarbuilder'){
            change_value[k].element_name = this.changeSpecialtoKeyFormat(change_value[k].element_name);
            change_value[k].element_data.element_name = this.changeSpecialtoKeyFormat(change_value[k].element_data.element_name);
            if(change_value[k].element_data.hasOwnProperty('forms_list_data')){
              let get_attached_forms = change_value[k].element_data.forms_list_data;
              if(get_attached_forms!=undefined && get_attached_forms.length>0){
                for(let formindex=0;formindex<get_attached_forms.length;formindex++){
                  change_value[k].element_data.forms_list_data[formindex].form_name = this.changeSpecialtoKeyFormat(change_value[k].element_data.forms_list_data[formindex].form_name);
                }
              }
            }
            if(change_value[k].element_data.hasOwnProperty('shape')){
              change_value[k].element_data.shape.annotation_label = this.changeSpecialtoKeyFormat(change_value[k].element_data.shape.annotation_label);
              if(change_value[k].element_id==11){
                change_value[k].element_data.shape.annotation_data = this.changeSpecialtoKeyFormat(change_value[k].element_data.shape.annotation_data);
              }
            }
          }
          else if(which_list_find=='userlist'){
            change_value[k].first_name = this.changeSpecialtoKeyFormat(change_value[k].first_name);
            change_value[k].last_name = this.changeSpecialtoKeyFormat(change_value[k].last_name);
            change_value[k].email_id = this.changeSpecialtoKeyFormat(change_value[k].email_id);
          }
          else if(which_list_find=='layerdata'){
            change_value[k].layer_name = this.changeSpecialtoKeyFormat(change_value[k].layer_name);
          }
          
        }
        return change_value;
      }
    }
  }

  specialCharacterPasteRestrict(event){
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    let check=pastedText.indexOf('â');
    if(pastedText=="â" || check!=-1){
      event.preventDefault();
    }
  }

  formfieldviewcharacter(getvalue:any,which_list_find:string){
    let change_value = getvalue;
    if(Array.isArray(change_value)){
      if(change_value.length>0){
        for(let fi=0;fi<change_value.length;fi++){
          //divider does not have values so skip
          if(change_value[fi].element_type=="single_line_text" || change_value[fi].element_type=="text_area" || change_value[fi].element_type=="number"){
            if(change_value[fi].element_data.default_value!=undefined && change_value[fi].element_data.default_value!=""){
              change_value[fi].element_data.default_value = this.changeSpecialtoKeyFormat(change_value[fi].element_data.default_value);
            }
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeSpecialtoKeyFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeSpecialtoKeyFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.placeholder_text!=undefined && change_value[fi].element_data.placeholder_text!=""){
              change_value[fi].element_data.placeholder_text = this.changeSpecialtoKeyFormat(change_value[fi].element_data.placeholder_text);
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeSpecialtoKeyFormat(change_value[fi].element_data.if_value);
              }
            }
          }
          else if(change_value[fi].element_type=="text_label"){
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeSpecialtoKeyFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeSpecialtoKeyFormat(change_value[fi].element_data.label_text);
            }
          }
          else if (change_value[fi].element_type == "dropdown" || change_value[fi].element_type=="checkbox" || change_value[fi].element_type == "single_choice" || change_value[fi].element_type == "multiple_choice") {
            if (change_value[fi].element_data.element_name_alias != undefined && change_value[fi].element_data.element_name_alias != "") {
              change_value[fi].element_data.element_name_alias = this.changeSpecialtoKeyFormat(change_value[fi].element_data.element_name_alias);
            }
            if (change_value[fi].element_data.label_text != undefined && change_value[fi].element_data.label_text != "") {
              change_value[fi].element_data.label_text = this.changeSpecialtoKeyFormat(change_value[fi].element_data.label_text);
            }
            let get_options = change_value[fi].element_data.options;
            if (get_options.length > 0) {
              for (let ov = 0; ov < get_options.length; ov++) {
                if (change_value[fi].element_data.options[ov].name != undefined && change_value[fi].element_data.options[ov].name != "") {
                  change_value[fi].element_data.options[ov].name = this.changeSpecialtoKeyFormat(change_value[fi].element_data.options[ov].name);
                }
              }
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeSpecialtoKeyFormat(change_value[fi].element_data.if_value);
              }
            }
          }
          else if(change_value[fi].element_type=="date"){
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeSpecialtoKeyFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeSpecialtoKeyFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeSpecialtoKeyFormat(change_value[fi].element_data.if_value);
              }
            }
          }
          else if(change_value[fi].element_type=="calculation"){
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeSpecialtoKeyFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeSpecialtoKeyFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.calculation!=undefined && change_value[fi].element_data.calculation!=""){
              change_value[fi].element_data.calculation = this.changeSpecialtoKeyFormat(change_value[fi].element_data.calculation);
            }
            if(change_value[fi].element_data.calculation_display_value!=undefined && change_value[fi].element_data.calculation_display_value!=""){
              change_value[fi].element_data.calculation_display_value = this.changeSpecialtoKeyFormat(change_value[fi].element_data.calculation_display_value);
            }
            if(change_value[fi].element_data.default_value!=undefined && change_value[fi].element_data.default_value!=""){
              change_value[fi].element_data.default_value = this.changeSpecialtoKeyFormat(change_value[fi].element_data.default_value);
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeSpecialtoKeyFormat(change_value[fi].element_data.if_value);
              }
            }
          }
          else if(change_value[fi].element_type=="address"){
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeSpecialtoKeyFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeSpecialtoKeyFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.city!=undefined && change_value[fi].element_data.city!=""){
              change_value[fi].element_data.city = this.changeSpecialtoKeyFormat(change_value[fi].element_data.city);
            }
            if(change_value[fi].element_data.state!=undefined && change_value[fi].element_data.state!=""){
              change_value[fi].element_data.state = this.changeSpecialtoKeyFormat(change_value[fi].element_data.state);
            }
            if(change_value[fi].element_data.street_address1!=undefined && change_value[fi].element_data.street_address1!=""){
              change_value[fi].element_data.street_address1 = this.changeSpecialtoKeyFormat(change_value[fi].element_data.street_address1);
            }
            if(change_value[fi].element_data.street_address2!=undefined && change_value[fi].element_data.street_address2!=""){
              change_value[fi].element_data.street_address2 = this.changeSpecialtoKeyFormat(change_value[fi].element_data.street_address2);
            }
            if(change_value[fi].element_data.zip!=undefined && change_value[fi].element_data.zip!=""){
              change_value[fi].element_data.zip = this.changeSpecialtoKeyFormat(change_value[fi].element_data.zip);
            }
          }
          else if(change_value[fi].element_type=="uti-entry-field-TIMBER"){
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeSpecialtoKeyFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeSpecialtoKeyFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.placeholder_text!=undefined && change_value[fi].element_data.placeholder_text!=""){
              change_value[fi].element_data.placeholder_text = this.changeSpecialtoKeyFormat(change_value[fi].element_data.placeholder_text);
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeSpecialtoKeyFormat(change_value[fi].element_data.if_value);
              }
            }
            if(change_value[fi].element_data.hasOwnProperty("default_values")){
              if(change_value[fi].element_data.default_values != undefined && change_value[fi].element_data.default_values != '' && change_value[fi].element_data.default_values != null){
                let get_default_values = change_value[fi].element_data.default_values;
                for(let cfv=0;cfv<get_default_values.length;cfv++){
                  let get_default_object = get_default_values[cfv];
                  get_default_object.comments = this.changeSpecialtoKeyFormat(get_default_object.comments);
                  // replace special character to default view key changes
                  get_default_values[cfv] = get_default_object;
                }
                // replace special characters to the default values change
                change_value[fi].element_data.default_values = get_default_values; 
              }
            }
          }
        }
        return change_value;
      }
    }
    
  }

  changingformelementpublish(getvalueformdata:any,which_list_find:string){
    let change_value = getvalueformdata;
    if(Array.isArray(change_value)){
      if(change_value.length>0){
        for(let fi=0;fi<change_value.length;fi++){
          //divider does not have values so skip
          if(change_value[fi].element_type=="single_line_text" || change_value[fi].element_type=="text_area" || change_value[fi].element_type=="number"){
            if(change_value[fi].element_data.default_value!=undefined && change_value[fi].element_data.default_value!=""){
              change_value[fi].element_data.default_value = this.changeFormat(change_value[fi].element_data.default_value);
            }
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.placeholder_text!=undefined && change_value[fi].element_data.placeholder_text!=""){
              change_value[fi].element_data.placeholder_text = this.changeFormat(change_value[fi].element_data.placeholder_text);
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeFormat(change_value[fi].element_data.if_value);
              }
            }
          }
          else if(change_value[fi].element_type=="text_label"){
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeFormat(change_value[fi].element_data.label_text);
            }
          }
          else if (change_value[fi].element_type == "dropdown" || change_value[fi].element_type=="checkbox" || change_value[fi].element_type == "single_choice" || change_value[fi].element_type == "multiple_choice") {
            if (change_value[fi].element_data.element_name_alias != undefined && change_value[fi].element_data.element_name_alias != "") {
              change_value[fi].element_data.element_name_alias = this.changeFormat(change_value[fi].element_data.element_name_alias);
            }
            if (change_value[fi].element_data.label_text != undefined && change_value[fi].element_data.label_text != "") {
              change_value[fi].element_data.label_text = this.changeFormat(change_value[fi].element_data.label_text);
            }
            let get_options = change_value[fi].element_data.options;
            if (get_options.length > 0) {
              for (let ov = 0; ov < get_options.length; ov++) {
                if (change_value[fi].element_data.options[ov].name != undefined && change_value[fi].element_data.options[ov].name != "") {
                  change_value[fi].element_data.options[ov].name = this.changeFormat(change_value[fi].element_data.options[ov].name);
                }
              }
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeFormat(change_value[fi].element_data.if_value);
              }
            }
          }
          else if(change_value[fi].element_type=="date"){
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeFormat(change_value[fi].element_data.if_value);
              }
            }
          }
          else if(change_value[fi].element_type=="calculation"){
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.calculation!=undefined && change_value[fi].element_data.calculation!=""){
              change_value[fi].element_data.calculation = this.changeFormat(change_value[fi].element_data.calculation);
            }
            if(change_value[fi].element_data.calculation_display_value!=undefined && change_value[fi].element_data.calculation_display_value!=""){
              change_value[fi].element_data.calculation_display_value = this.changeFormat(change_value[fi].element_data.calculation_display_value);
            }
            if(change_value[fi].element_data.default_value!=undefined && change_value[fi].element_data.default_value!=""){
              change_value[fi].element_data.default_value = this.changeFormat(change_value[fi].element_data.default_value);
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeFormat(change_value[fi].element_data.if_value);
              }
            }
          }
          else if(change_value[fi].element_type=="address"){
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.city!=undefined && change_value[fi].element_data.city!=""){
              change_value[fi].element_data.city = this.changeFormat(change_value[fi].element_data.city);
            }
            if(change_value[fi].element_data.state!=undefined && change_value[fi].element_data.state!=""){
              change_value[fi].element_data.state = this.changeFormat(change_value[fi].element_data.state);
            }
            if(change_value[fi].element_data.street_address1!=undefined && change_value[fi].element_data.street_address1!=""){
              change_value[fi].element_data.street_address1 = this.changeFormat(change_value[fi].element_data.street_address1);
            }
            if(change_value[fi].element_data.street_address2!=undefined && change_value[fi].element_data.street_address2!=""){
              change_value[fi].element_data.street_address2 = this.changeFormat(change_value[fi].element_data.street_address2);
            }
            if(change_value[fi].element_data.zip!=undefined && change_value[fi].element_data.zip!=""){
              change_value[fi].element_data.zip = this.changeFormat(change_value[fi].element_data.zip);
            }
          }
          else if(change_value[fi].element_type=="uti-entry-field-WMATA"){
            if(change_value[fi].element_data.hasOwnProperty("default_values")){
              if(change_value[fi].element_data.default_values != undefined && change_value[fi].element_data.default_values != ''){
                let get_default_values = change_value[fi].element_data.default_values;
                for(let cfv=0;cfv<get_default_values.length;cfv++){
                  let get_default_object = get_default_values[cfv];
                  for (let property in get_default_object) {
                    console.log(`${property}: ${get_default_object[property]}`);
                    get_default_object[property] = this.changeFormat(get_default_object[property]);
                  }
                  // replace the special character changes of loop
                  get_default_values[cfv] = get_default_object;
                }
                // replace the default values change to special characters
                change_value[fi].element_data.default_values = get_default_values; 
              }
            }
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.placeholder_text!=undefined && change_value[fi].element_data.placeholder_text!=""){
              change_value[fi].element_data.placeholder_text = this.changeFormat(change_value[fi].element_data.placeholder_text);
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeFormat(change_value[fi].element_data.if_value);
              }
            }
          }
          else if(change_value[fi].element_type=="uti-entry-field-TIMBER"){
            if(change_value[fi].element_data.hasOwnProperty("default_values")){
              if(change_value[fi].element_data.default_values != undefined && change_value[fi].element_data.default_values != ''){
                let get_default_values = change_value[fi].element_data.default_values;
                for(let cfv=0;cfv<get_default_values.length;cfv++){
                  let get_default_object = get_default_values[cfv];
                  get_default_object.comments = this.changeFormat(get_default_object.comments);
                  // replace the special character changes
                  get_default_values[cfv] = get_default_object;
                }
                // replace the default values change to special characters
                change_value[fi].element_data.default_values = get_default_values; 
              }
            }
            if(change_value[fi].element_data.element_name_alias!=undefined && change_value[fi].element_data.element_name_alias!=""){
              change_value[fi].element_data.element_name_alias = this.changeFormat(change_value[fi].element_data.element_name_alias);
            }
            if(change_value[fi].element_data.label_text!=undefined && change_value[fi].element_data.label_text!=""){
              change_value[fi].element_data.label_text = this.changeFormat(change_value[fi].element_data.label_text);
            }
            if(change_value[fi].element_data.placeholder_text!=undefined && change_value[fi].element_data.placeholder_text!=""){
              change_value[fi].element_data.placeholder_text = this.changeFormat(change_value[fi].element_data.placeholder_text);
            }
            if(change_value[fi].element_data.use_conditions==true){
              if(change_value[fi].element_data.if_value!=undefined && change_value[fi].element_data.if_value!=""){
                change_value[fi].element_data.if_value = this.changeFormat(change_value[fi].element_data.if_value);
              }
            }
          }
        }
        return change_value;
      }
    }

    
  }

  restrictionofSpecialcharacter(word){
    if(word!=undefined){
      let special_values = ["â","ê","ô"];
      word = word.trim();
      if(word.length>0 && (word.includes("â") || word.includes("ê") || word.includes("ô"))){
        return true;
      }
      else{
        return false;
      }
    }
  }

  generateUUID() {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    let uuidGenerator = this.su.user_id + '-' + uuidv1().toUpperCase() + '-' + new Date().getTime();
    return uuidGenerator;
  }

  changePageSort = new EventEmitter<any>();

  filterOptions = new EventEmitter<any>();

  checkPageLoading = new EventEmitter<any>();

  hideButtonAnotherOne = new EventEmitter<any>();

  activeVisitionSend = new EventEmitter<any>();

  sidebarToggleOption = new EventEmitter<any>();

  annotationselected= new EventEmitter<any>();

  currentpageidsearch = new EventEmitter<any>();

  detachchange= new EventEmitter<any>();

  // calulation for square root and power function

  squareRootCalculation(givenString) {
		let givenCaluValue = givenString;
		if (givenString == "√") {
			return givenString;
		}
		if (givenCaluValue[givenCaluValue.length-1] == "√") {
			return givenString;
		}
    let isFirstValue = false;
		if (givenCaluValue[0] == "√") {
			isFirstValue = true;
		}
		givenCaluValue = givenCaluValue.trim();
		if (givenCaluValue.includes("(") && givenCaluValue.includes(")")){
		    let def_value = Number("-999.8888");
		    givenCaluValue = this.bracketFunctionCalculationIpad(givenCaluValue,def_value,true);
		}
		if (givenCaluValue == "") {
			return givenString
		}
		if (givenCaluValue.includes("^")){
		    givenCaluValue = this.powerOfCalculation(givenCaluValue);
		}
		while (givenCaluValue.includes("√")) {
			let splitMainValue = givenCaluValue.split("√");
			splitMainValue = splitMainValue.filter((empty_bin)=>empty_bin!="");
			// √3+7+√9
			var splitedStringValue = "";
			if (splitMainValue.length > 1) {
				splitedStringValue = String(splitMainValue[1]);
				if (isFirstValue) {
					splitedStringValue = String(splitMainValue[0]);
					isFirstValue = false;
				}
			}
			else if (splitMainValue.length == 1) {
				splitedStringValue = String(splitMainValue[0]);
				isFirstValue = false;
			} else {
				break;
			}
			if (splitedStringValue != "") {
				var isNegativeValue = false;
				// if let doubleValue = Double(splitedStringValue), doubleValue < 0 {
				let doubleValue = Number(splitedStringValue);
				if  (doubleValue < 0) {
				    isNegativeValue = true;
					splitedStringValue = splitedStringValue.substring(1);
				}
				// if let firstChar = splitedStringValue.first, let str_firstChar = String(firstChar) as? String, let isNumberOnly = P3Utils().checkNumberOnlyForSquareRoot(givenValue: str_firstChar) as? Bool , isNumberOnly == true {
				let firstChar = splitedStringValue[0];
				let checkNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
				let checksymbol = ['+', '-', '*', '/'];
				if (checkNumbers.includes(firstChar)) {
					var modifiedCaluValue = "";
					var isLoopCompleted = false;
					var squareRootValueAdded = false;
					for (let gIndex = 0; gIndex < splitedStringValue.length; gIndex++) {
						if (!checkNumbers.includes(splitedStringValue[gIndex])) {
							isLoopCompleted = true;
							let doubleValue = Number(modifiedCaluValue);
							if (isNegativeValue) {
								modifiedCaluValue = "-" + modifiedCaluValue;
							}
							modifiedCaluValue = "√" + modifiedCaluValue;
							var squareRootValue = modifiedCaluValue;
							if (!checksymbol.includes(doubleValue.toString())) {
								squareRootValueAdded = true;
								let sqear = Math.sqrt(doubleValue);
								squareRootValue = String(sqear);
								if (isNegativeValue) {
									squareRootValue = "-" + squareRootValue
								}
							}
							//replace the value
							givenCaluValue = givenCaluValue.replace(modifiedCaluValue,squareRootValue);
							console.log(givenCaluValue);
							modifiedCaluValue = "";
						}
						else {
							modifiedCaluValue = modifiedCaluValue == "" ? String(splitedStringValue[gIndex]) : modifiedCaluValue + String(splitedStringValue[gIndex]);
						}
					}
					if (!isLoopCompleted && modifiedCaluValue != "") {
						let doubleValue = Number(modifiedCaluValue);
						if (isNegativeValue) {
							modifiedCaluValue = "-" + modifiedCaluValue
						}
						modifiedCaluValue = "√" + modifiedCaluValue;
						var squareRootValue = modifiedCaluValue;
						// if doubleValue != nil {
						if (doubleValue != null && !isNaN(doubleValue) && !checksymbol.includes(doubleValue.toString())) {
							squareRootValueAdded = true;
							let sqear = Math.sqrt(doubleValue);
							squareRootValue = String(sqear);
							if (isNegativeValue) {
								squareRootValue = "-" + squareRootValue
							}
						}
						//replace the value
						givenCaluValue = givenCaluValue.replace(modifiedCaluValue,squareRootValue);
						console.log(givenCaluValue);
					}
					if (!squareRootValueAdded) {
						break;
					}
				}
				else {
					break;
				}
			}
			else {
				break;
			}
		}
		return givenCaluValue;
	}

  bracketFunctionCalculation(calculationstring : string, def_value:number,isForSqeareRoot:boolean){
		let calculatioValue = calculationstring;
		let opencircle = 0;
		let closecircle = 0;
		for(let char=0;char<calculationstring.length;char++){
			if(calculationstring[char]=="("){
				opencircle = opencircle + 1;
			}
			else if(calculationstring[char]==")"){
				closecircle = closecircle + 1;
			}
		}	
		let Start_count = opencircle;
    	let Close_count = closecircle;
		if(Start_count == Close_count){
			if(calculatioValue.includes("()")){
				return "";
			}
			let get_inside_squre_bracket_values = calculatioValue.match(/\(([^()]*)\)/g).map(function($0) { return $0.substring(1,$0.length-1) });
			if(get_inside_squre_bracket_values.length>0){
				let checksymbol = ["+","-","*","/"];
				for(let v=0;v<get_inside_squre_bracket_values.length;v++){
					let first_char = get_inside_squre_bracket_values[v][0];
					let last_char = get_inside_squre_bracket_values[v][get_inside_squre_bracket_values[v].length-1];
					if(checksymbol.includes(first_char) || checksymbol.includes(last_char)){
						return calculatioValue;
					}
					let modification_value = `(${get_inside_squre_bracket_values[v]})`;
          if(modification_value.includes("√")){
            modification_value = this.squareRootCalculation(modification_value);
          }else if(modification_value.includes("^")){
            modification_value = this.powerOfCalculation(modification_value);
          }
					let cals_value = eval(get_inside_squre_bracket_values[v]);
					if(cals_value instanceof EvalError){
            return "";
          }
					else{
						calculatioValue = calculatioValue.replace(modification_value,cals_value);
					}
				}
				return calculatioValue;
			}
			else{
				return calculatioValue;
			}
		}
		else{
			return "";
		}
	}

	getcalculationvalue(elemendata_value) {
    let defaultDigit = elemendata_value.default_value != "" ? elemendata_value.default_value : "1"
    let value = Number(elemendata_value.calculation);
    let unwanted_characters = ["(",")","√","^"];
    if (value != undefined && !isNaN(value)) {
      let convert_decimal = elemendata_value.calculation != "" ? value.toFixed(Number(defaultDigit)) : elemendata_value.calculation;
      convert_decimal = Number(convert_decimal);
      return convert_decimal = convert_decimal;
    } 
    else if(unwanted_characters.includes(elemendata_value.calculation) || isNaN(value)){
      return elemendata_value.calculation;
    }
    else  if(elemendata_value.calculation!=undefined && elemendata_value.calculation!="" && elemendata_value.calculation!=null){
        let check_dot_count = (elemendata_value.calculation.match(/\./g) || []).length;
       console.log(check_dot_count);
      let calculation_character_in = ["+","-","*","/","√","^"];
      let calculation_happen = calculation_character_in.findIndex((symbol)=> elemendata_value.calculation_value.includes(symbol));
      if(check_dot_count>1 && calculation_happen > -1){
        let get_first_dot_index = elemendata_value.calculation.indexOf(".");
        let get_last_of_index = get_first_dot_index + Number(defaultDigit);
        let temp_calculation = elemendata_value.calculation;
        // let get_su_string = temp_calculation.substring(0,(get_last_of_index+1));
        let convert_float_type = parseFloat(temp_calculation);
        let get_su_string : any = convert_float_type.toPrecision(get_last_of_index+1);
        get_su_string = Number(get_su_string).toPrecision(get_last_of_index);

        console.log('wanted',typeof get_su_string);
        console.log("Number",Number("4.58257569495584"));
        return get_su_string;
      }
      else{
        if(check_dot_count>1){
          return elemendata_value.calculation;
        }
        else{
          let convert_decimal = elemendata_value.calculation != "" ? elemendata_value.calculation.toFixed(Number(defaultDigit)) : elemendata_value.calculation;
        convert_decimal = Number(convert_decimal);
        return convert_decimal = convert_decimal;
        }
      }
      }
    
    // old else part it is working but now changed fraction of decimal
    // else { 
    //   return elemendata_value.calculation;
    // }

		// let check_seperators = ["(", ")", "+", "-", "*", "/"];
		// let get_calculation = value
		// let get_fist_value = value[0];
		// let get_second_value = value[1];
		// let get_last_value = value[value.length - 1];
		// if (check_seperators.includes(get_fist_value) && check_seperators.includes(get_second_value)) {
		// 	return value;
		// }
		// else if (check_seperators.includes(get_last_value)) {
		// 	return value;
		// }
		// else if ((get_calculation.includes("(") && !get_calculation.includes(")"))){
		// 	return value;
		// }
		// else {
		// 	let get_dot_value = get_calculation.includes(".");
		// 	// convert last 10 decimal
		// 	if(get_dot_value){
		// 		let get_value = Number(get_calculation).toFixed(10);
		// 		let convertNumber = Number(get_value);
		// 		return convertNumber;
		// 	}
		// 	else{
		// 		return value;
		// 	}
		// 	return ;
		// }
	}

  powerOfCalculation(givenString: string) {
    var givenCaluValue = givenString;
    if (givenString == "^") {
      return givenString;
    }
    givenCaluValue = givenCaluValue.trim();
    if (givenCaluValue.includes("(") && givenCaluValue.includes(")")) {
      let def_value = Number("-999.8888");
      givenCaluValue = this.bracketFunctionCalculationIpad(givenCaluValue, def_value!, true);
    }
    if (givenCaluValue == "") {
      return givenString;
    }
    while (givenCaluValue.includes("^")) {
      let splitMainValue = givenCaluValue.split("^");
      splitMainValue = splitMainValue.filter((empty_bin)=>empty_bin!="");
      var splitedStringValue = ""
      var powerValue: number = null;
      if (splitMainValue.length > 0) {
        splitedStringValue = String(splitMainValue[0])
        if (splitMainValue.length > 1) {
          let after_string = String(splitMainValue[1])
          var modifiedpowerValue = "";
          var isCalculated = false;
          let validCharacters = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
          let firstChar = after_string[0];
          let str_firstChar = String(firstChar);
          if (typeof str_firstChar == 'string' && validCharacters.includes(str_firstChar)) {
            for (let singleChar of after_string) {
              if (validCharacters.includes(String(singleChar))) {
                modifiedpowerValue = modifiedpowerValue == "" ? String(singleChar) : modifiedpowerValue + String(singleChar);
              } else {
                let intValue = Number(modifiedpowerValue);
                if (intValue != null) {
                  isCalculated = true;
                  powerValue = intValue;
                  modifiedpowerValue = "";
                  break;
                }
              }
            }
            if (!isCalculated) {
              let intValue = Number(modifiedpowerValue);
              if (intValue != null) {
                isCalculated = true;
                powerValue = intValue;
                modifiedpowerValue = "";
              }
            }
          }
        }
      } else {
        break;
      }
      if (splitedStringValue != "") {
        let firstChar = splitedStringValue[splitedStringValue.length - 1];
        let str_firstChar = String(firstChar);
        let validCharacters = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        let isNumberOnly = validCharacters.includes(str_firstChar);
        if (typeof str_firstChar == 'string' && isNumberOnly == true) {
          splitedStringValue = String(splitedStringValue.split("").reverse().join(""));
          var modifiedCaluValue = "";
          var isLoopCompleted = false;
          var powerValueisAdded = false;
          for (let item of splitedStringValue) {
            let invalidCharacters = ["+", "*", "-", "/", "√"]
            if (invalidCharacters.includes(String(item))) {
              isLoopCompleted = true;
              modifiedCaluValue = String(modifiedCaluValue.split("").reverse().join(""));
              let doubleValue = Number(modifiedCaluValue);
              if (powerValue == null) {
                powerValue = 1;
                modifiedCaluValue = modifiedCaluValue + "^";
              } else {
                // "\(powerValue!)"
                modifiedCaluValue = modifiedCaluValue + "^" + powerValue.toString();
              }
              var powerOfValue = modifiedCaluValue
              if (doubleValue != null) {
                powerValueisAdded = true;
                // pow(Decimal(doubleValue!), powerValue)
                let powerOf = Math.pow(doubleValue!, powerValue);
                console.log(powerOf);
                // "\(powerOf)"
                powerOfValue = powerOf.toString();
              }
              givenCaluValue = givenCaluValue.replace(modifiedCaluValue, powerOfValue);
              console.log(givenCaluValue);
            } else {
              modifiedCaluValue = modifiedCaluValue == "" ? String(item) : modifiedCaluValue + String(item);
            }
          }
          if (!isLoopCompleted && modifiedCaluValue != "") {
            modifiedCaluValue = String(modifiedCaluValue.split("").reverse().join(""));
            let doubleValue = Number(modifiedCaluValue);
            if (powerValue == null) {
              powerValue = 1;
              modifiedCaluValue = modifiedCaluValue + "^";
            } else {
              // "\(powerValue!)"
              modifiedCaluValue = modifiedCaluValue + "^" + powerValue.toString();
            }
            var powerOfValue = modifiedCaluValue;
            if (doubleValue != null) {
              powerValueisAdded = true;
              // pow(Decimal(doubleValue!), powerValue)
              let powerOf = Math.pow(doubleValue!, powerValue);
              console.log(powerOf);
              // "\(powerOf)"
              powerOfValue = powerOf.toString();
            }
            givenCaluValue = givenCaluValue.replace(modifiedCaluValue, powerOfValue);
            console.log(givenCaluValue);
          }
          if (!powerValueisAdded) {
            break;
          }
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return givenCaluValue;
  }

  bracketFunctionCalculationIpad(calculationstring: string, def_value: number, isForSqeareRoot: boolean) {
    var calculationValue = calculationstring;
    // if calculationValue.includes(".rounded()"){
    //     calculationValue = calculationValue.replacingOccurrences(of: ".rounded()", with: ".round")
    // }
    var cals_value = calculationValue;
    let opencircle = 0;
		let closecircle = 0;
		for(let char=0;char<calculationstring.length;char++){
			if(calculationstring[char]=="("){
				opencircle = opencircle + 1;
			}
			else if(calculationstring[char]==")"){
				closecircle = closecircle + 1;
			}
		}	
    let Start_count = opencircle;
    let Close_count = closecircle;
    if (Start_count == Close_count) {
      while (cals_value.includes("(") && cals_value.includes(")")) {
        var isNeedMultipleSymbolFirst: boolean = false;
        var isNeedMultipleSymbolLast: boolean = false;
        if (cals_value.includes("()")) {
          return "";
        }
        let close_brac_index = cals_value.indexOf(")");
        let close_bracket_split = cals_value.split(")", 1);
        if (close_bracket_split.length > 0) {
          let b4_close_brac_value = String(close_bracket_split[0]);
          if (close_bracket_split.length > 1) {
            let lastValue = String(close_bracket_split[1]);
            let lastchar = lastValue[0]!;
            // let lastchar = "need to add";
            // doubt
            let symbols = ["+", "-", "*", "/", ")"]
            if (!symbols.includes(String(lastchar)) && !isForSqeareRoot) {
              isNeedMultipleSymbolLast = true;
            }
          }
          let reverse_b4_value = String(b4_close_brac_value.split("").reverse().join(""));
          var start_brac_index = reverse_b4_value.indexOf("(");
          start_brac_index = close_brac_index! - start_brac_index!
          let start_bracket_split = reverse_b4_value.split("(", 1);
          if (start_bracket_split.length > 0) {
            let req_reverse_str = String(start_bracket_split[0])
            if (start_bracket_split.length > 1) {
              let reverse_lastValue = String(start_bracket_split[1])
              let lastValue1 = String(reverse_lastValue.split("").reverse().join(""));
              let lastchar1 = lastValue1[lastValue1.length-1];
              let symbols1 = ["+", "-", "*", "/"];
              if (!symbols1.includes(String(lastchar1)) && !isForSqeareRoot!){
                isNeedMultipleSymbolFirst = true;
              }
            }
            var require_str = String(req_reverse_str.split("").reverse().join(""));
            if (require_str.includes("√")) {
              require_str = this.squareRootCalculation(require_str);
            }
            if (require_str.includes("^")){
                require_str = this.powerOfCalculation(require_str);
            }
            // let req_calculation_value = 6;
            let req_calculation_value = this.separateCalc(require_str,def_value);
            if (req_calculation_value != def_value) {
              if (isNeedMultipleSymbolFirst || isNeedMultipleSymbolLast) {
                if (isNeedMultipleSymbolFirst && isNeedMultipleSymbolLast) {
                  // "*\(req_calculation_value)*"
                  // let stringdfsdf = "ga(nes)h";
                  let is_multiple_symbol = req_calculation_value.toString();
                  let first_value = cals_value.substring(0,start_brac_index! - 1);
                  let last_value = cals_value.substring(close_brac_index! + 1,cals_value.length);
                  cals_value = first_value + is_multiple_symbol + last_value;
                  // cals_value = cals_value.substring(close_brac_index! + 1,start_brac_index! - 1);
                } else if (isNeedMultipleSymbolFirst) {
                  // "*\(req_calculation_value)"
                  let is_multiple_symbol = req_calculation_value.toString();
                  let first_value = cals_value.substring(0,start_brac_index! - 1);
                  let last_value = cals_value.substring(close_brac_index! + 1,cals_value.length);
                  cals_value = first_value + is_multiple_symbol + last_value;
                } else if (isNeedMultipleSymbolLast) {
                  let is_multiple_symbol = req_calculation_value.toString();
                  let first_value = cals_value.substring(0,start_brac_index! - 1);
                  let last_value = cals_value.substring(close_brac_index! + 1,cals_value.length);
                  cals_value = first_value + is_multiple_symbol + last_value;
                }
              } else {
                let is_multiple_symbol = req_calculation_value.toString();
                let first_value = cals_value.substring(0,start_brac_index! - 1);
                let last_value = cals_value.substring(close_brac_index! + 1,cals_value.length);
                cals_value = first_value + is_multiple_symbol + last_value;
                // cals_value =  cals_value.replacingOccurrences(of: "(\(require_str))", with: "\(req_calculation_value)");
                cals_value =  cals_value.replace(require_str.toString(),req_calculation_value.toString());
              }
            } else {
              return "";
            }
          }
        }
      } // while loop end
      return cals_value;
    }
    else {
      return "";
    }
  }

  separateCalc(str_value: string, defvalue: number) {
    var result = defvalue;
    var str: any = str_value;
    var isRound = false;
    if (str.includes(".round")) {
      str = str.replace(".round", "1");
      isRound = true;
    }
    // let calculationNumber = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+","-","*","/","."];
    if (str instanceof EvalError) {
      return result;
    }
    else {
      return result = eval(str);
    }
    //     if(calculationNumber.includes(str)){
    //         do {
    //             try TryCatch.try({
    //                 let exp = NSExpression(format: str)
    // //                    result =  Double(truncating: exp.expressionValue(with: nil, context: nil) as! NSNumber)
    //                 result = exp.toFloatingPoint().expressionValue(with: nil, context: nil) as! Double
    //                 if isRound{
    //                     result = result.rounded() != 0 ? result.rounded() : 1
    //                 }
    //             })
    //        } catch {
    //             print("Into the catch.....")
    //         }
    //     }
    //     return result
  }

  
  
  
} 
