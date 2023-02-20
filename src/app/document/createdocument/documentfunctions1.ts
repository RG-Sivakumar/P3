import { MatDialogConfig } from "@angular/material/dialog";
import { annotation_key_part } from "../models/documentmodel";

export function linewidthchanges(data){
    let annotation_value = data;
    if(annotation_value.toolbar_element_id<12){
      if(Number(annotation_value.initial_width)>100 || Number(annotation_value.initial_height)>100){
        annotation_value.line_width = annotation_value.linewidth;
      }
    }
    return annotation_value;
}

export function get_current_annotation(layerData_f1, annotation_data_f1) {
  let get_layer_data = layerData_f1;
  let get_annotation_data = annotation_data_f1;
  // find layer Index
  let find_layer = get_layer_data.findIndex((layer) => layer.layer_id == get_annotation_data.layer_id);
  if (find_layer > -1) {
    // find annotation Index
    let annot_index = get_layer_data[find_layer].annotations.findIndex((annot) => annot.annotation_id == get_annotation_data.annotation_id);
    if (annot_index > -1) {
      return get_layer_data[find_layer].annotations[annot_index];
    }
    else{
      return null;
    }
  }
}

export function get_cur_anot_base_Id(layerData_f1, annotation_data_f1) {
  let get_layer_data = layerData_f1;
  let get_annotation_data = annotation_data_f1;
  // find layer Index
  for(let l=0;l<get_layer_data.length;l++){
    let annot_index = get_layer_data[l].annotations.findIndex((annot) => annot.annotation_id == get_annotation_data.annotation_id);
    if (annot_index > -1) {
      return get_layer_data[l].annotations[annot_index];
    }
  }
  return null;
}

export function get_user_role(user_permission){
  // user permission new api values get process
  let get_user_permission = user_permission;
  let userrole = "";
  if (get_user_permission != undefined && get_user_permission != null &&
    get_user_permission.length > 0) {
    if (get_user_permission[0].admin_permission_flag == true) {
      userrole = "admin";
    }
    else if (get_user_permission[0].edit_permission_flag == true) {
      userrole = "edit";
    }
    else if (get_user_permission[0].view_permission_flag == true) {
      userrole = "view";
    }
    else if (get_user_permission[0].view_permission_flag == false && get_user_permission[0].edit_permission_flag == false
      && get_user_permission[0].admin_permission_flag == false) {
        userrole = "view";
    }
    return userrole;
  }
}

export function get_annot_draw_model(annotation_property){
  const annotation_keys : annotation_key_part = {
    annotation_id: annotation_property.annotation_id,
    annotation_data:annotation_property.annotation_data,
    layer_id:annotation_property.layer_id,
    initial_position_x:annotation_property.initial_position_x,
    initial_position_y: annotation_property.initial_position_y,
    initial_rotation: annotation_property.initial_rotation,
    initial_width: annotation_property.initial_width,
    initial_height: annotation_property.initial_height,
    annotation_label: annotation_property.annotation_label,
    toolbar_element_id: annotation_property.toolbar_element_id,
    stroke_color: annotation_property.stroke_color,
    fill_color: annotation_property.fill_color,
    line_width: annotation_property.line_width,
    opacity: annotation_property.opacity,
    text_font_size:annotation_property.text_font_size
  } 
    return annotation_keys;
}

