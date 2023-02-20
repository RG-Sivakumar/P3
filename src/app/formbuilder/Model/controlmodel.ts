export class value {
  label?: any = "";
  value?: any = "";
}

export class elements {
  element_id?: any;
  element_name?: any;
  element_data?: elementData;
  element_type?: any;
  element_order?: any;
  is_hidden?: any;
  is_removed?: any;
  version_number?: any;
  _id?: any;
  placeholderNumber?: any;
}
export class elementData {
  icon?: any;
  values?: any;
  //single line text
  if_do?: any;
  if_state?: any;
  if_value?: any;
  label_text?: any;
  label_align?: any;
  if_condition?: any;
  default_value?: any;
  use_conditions?: any;
  placeholder_text?: any;
  element_name?: any;
  element_type?: any;
  element_order?: any;
last_modified_date?: any;
  //number
  maximum_value?: any;
  minimum_value?: any;

  //dropdown
  options?: Array<option>;

  //date picker
  time_format?: any;
  time_category?: any;
  use_time_values?: any;
  default_date_time?: any;

  //address
  street_address1?: any;
  street_address2?: any;

  //Divider
  line_color?: any;
  divider_style?: any;
  divider_height?: any;
  horizontal_space?: any;
  space_above_divider?: any;
  space_below_divider?: any;
}

//option for multi selection / single choice or multiple choise
export class option {
  attributes?: any;
  calculated_value?: any;
  default?: any;
  element_uuid?: any;
  fill_color?: any;
  icon?: any;
  is_blank_field?:any;
  name?: any;
  opacity?: any;
  line_width?: any;
  stroke_color?: any;
  number_of_columns?: any;
  is_removed?: any;
}