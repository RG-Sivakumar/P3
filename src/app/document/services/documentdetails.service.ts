import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { document_input, layerdata_sharing } from '../models/documentmodel';

@Injectable({
  providedIn: 'root'
})
export class DocumentdetailsService {

  get_document_details_array : Object[] = [];
  realWidth:number=0;
  realHeight:number=0;

  global_layer_data: any[] = [];
  global_page_data: any[] = [];

  private documents_data = new BehaviorSubject(null);
  current_documents_data = this.documents_data.asObservable();
  
  constructor(private dataService4: DataService) {
    let get_class = new layerdata_sharing();
    get_class.update_student('ganga',10);
  }

  update_current_documents_data(message: document_input) {
    this.documents_data.next(message)
  }

  set_current_document_value(response){
    console.log('service',response)
    this.get_document_details_array = response;
  }

  get_current_document_value(){
    return this.get_document_details_array;
  }

  get_current_page_detail(index:number){
    if(this.get_document_details_array != null && this.get_document_details_array !=undefined && this.get_document_details_array.length>0){
      // let find_index = this.get_document_details_array.findIndex((d_data)=>d_data.)
    }
  }


  convert_special_char_annot(annotationData_unique) {
    let get_db_data = cloneDeep(annotationData_unique);
    get_db_data.annotation_name = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_name);
    get_db_data.annotation_label = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_label);
    get_db_data.annotation_tags = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_tags);
    get_db_data.annotation_data = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_data);
    console.log(typeof get_db_data.original_property, get_db_data.original_property);
    if (get_db_data.original_property != "") {
      get_db_data.original_property = typeof get_db_data.original_property == 'string' ? JSON.parse(get_db_data.original_property) : get_db_data.original_property;
    }
    if(get_db_data.original_property!=null){
    if ((typeof get_db_data.original_property) == 'object') {
      if (get_db_data.original_property.hasOwnProperty('annotation_data')) {
        get_db_data.original_property.annotation_data = this.dataService4.changeSpecialtoKeyFormat(get_db_data.original_property.annotation_data);
      }
    }
  }
    if (get_db_data.annotation_forms.length > 0) {
      for (let fi = 0; fi < get_db_data.annotation_forms.length; fi++) {
        get_db_data.annotation_forms[fi].form_name = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_forms[fi].form_name);
        let get_cur_formdata = get_db_data.annotation_forms[fi].form_data;
        get_cur_formdata = this.convertJSON(get_cur_formdata);
        if (get_cur_formdata.length > 0) {
          get_db_data.annotation_forms[fi].form_data = this.dataService4.formfieldviewcharacter(get_cur_formdata, 'annotationgetformview');
        }
        else {
          get_db_data.annotation_forms[fi].form_data = get_cur_formdata;
        }
        if (get_db_data.annotation_forms[fi].is_extend == true) {
          if (get_db_data.annotation_forms[fi].hasOwnProperty('ext_form_data')) {
            let get_cur_ext_formdata = get_db_data.annotation_forms[fi].ext_form_data;
            get_cur_ext_formdata = this.convertJSON(get_cur_ext_formdata);
            if (get_cur_ext_formdata.length > 0) {
              get_db_data.annotation_forms[fi].ext_form_data = this.dataService4.formfieldviewcharacter(get_cur_ext_formdata, 'annotationgetformview');
            }
            else {
              get_db_data.annotation_forms[fi].ext_form_data = get_cur_ext_formdata;
            }
          }
        }
        else{
          if('ext_form_data' in get_db_data.annotation_forms[fi]){
            let get_cur_ext_formdata = get_db_data.annotation_forms[fi].ext_form_data;
            get_db_data.annotation_forms[fi].ext_form_data = this.convertJSON(get_cur_ext_formdata);
          }
        }
      }
    }
    if (get_db_data.annotation_links.length > 0) {
      if (Array.isArray(get_db_data.annotation_links)) {
        for (let li = 0; li < get_db_data.annotation_links.length; li++) {
          get_db_data.annotation_links[li].link_type = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_links[li].link_type);
          get_db_data.annotation_links[li].link_path = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_links[li].link_path);
          if (get_db_data.annotation_links[li].hasOwnProperty('location')) {
            if (get_db_data.annotation_links[li].location != undefined) {
              get_db_data.annotation_links[li].location = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_links[li].location);
            }
          }
        }
      }
    }
    if (get_db_data.annotation_media.length > 0) {
      if (Array.isArray(get_db_data.annotation_media)) {
        for (let li = 0; li < get_db_data.annotation_media.length; li++) {
          get_db_data.annotation_media[li].media_name = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_media[li].media_name);
          get_db_data.annotation_media[li].media_comment = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_media[li].media_comment);
          if (get_db_data.annotation_media[li].hasOwnProperty("media_tags")) {
            get_db_data.annotation_media[li].media_tags = this.dataService4.changeSpecialtoKeyFormat(get_db_data.annotation_media[li].media_tags);
          }
        }
      }
    }
    return get_db_data;
  }

  convertJSON(recive_convert_value: any) {
    if (recive_convert_value && recive_convert_value != "") {
      return recive_convert_value = Array.isArray(recive_convert_value) ? recive_convert_value : JSON.parse(recive_convert_value);
    }
    else if (recive_convert_value == null || recive_convert_value == undefined || recive_convert_value == "") {
      return [];
    }
  }



  



}
