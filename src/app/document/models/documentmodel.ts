export class scale_locator {
    constructor(public page_id: string, public scaleValue: number) {

    }
}

export class current_toolbar {
    constructor(public project_id: string) {

    }
}

export class switch_toolbar {
    constructor(public toolbar_id: string, public toolbar_name: string) {

    }
}

export class switch_form {
    constructor(public form_id: string, public form_name: string) {
    }
}

export interface document_input {
    pngFormat: boolean;
    pageNumber: number;
    document_details: Object[];
    imgUrl: string;
    pageName: string;
    currentPageId: string;
}


export class search_input {
    // page_id: string = "0";
    // all_data: boolean = false;
    // user_id: number = null;
    // is_tag: boolean = false;
    // is_stub: boolean = false;
    // is_photo: boolean = false;
    // is_form: boolean = false;
    // search_key: string = "";
    constructor(public page_id: string,public all_data: boolean,public user_id: number,public is_tag: boolean,
        public is_stub: boolean,public is_photo: boolean,public is_form: boolean,public search_key: string){

    }
}

export interface annotation_key_part {
    annotation_id: string;
    layer_id: string;
    annotation_data:string;
    initial_position_x: string | number,
    initial_position_y: string | number,
    initial_rotation: string | number,
    initial_width: string | number,
    initial_height: string | number,
    annotation_label: string,
    toolbar_element_id: string | number,
    stroke_color: string,
    fill_color: string,
    line_width: string,
    opacity: string,
    text_font_size:string
}

export class annotation_keys{
    // constructor(public annotation_id:string,public initial_position_x:string|number,
    //     public initial_position_y:string|number, public initial_rotation:string|number,public initial_width:string|number,
    //     public initial_height:string|number,public annotation_label:string,public toolbar_element_id:string|number,
    //     public stroke_color:string,public fill_color:string,public line_width:string,public opacity:string){

    // }
    constructor(public annotation_object:annotation_key_part){
        
    }
}

export class layerdata_sharing{
    // layerData:
    name:string = "";
    age:number = 18;

    constructor(){
        
    }


    update_student(name:string,age:number){
        this.name = name;
        this.age = age;
    }
    get_student_details(){
        return {st_name:this.name,st_age:this.age}
    }
}
