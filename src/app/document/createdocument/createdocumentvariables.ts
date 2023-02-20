import { FormControl, ValidatorFn, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { switch_form, switch_toolbar } from "../models/documentmodel";

export class createDocumentVar {
    enableresizeButtons: boolean = false;
    enablerepointButtons: boolean = false;
    enablerotateButtons: boolean = false;
    repointAccessValid: boolean = false;
    selectedAnnotations: string[] = [];
    hideLayerviewAccess: boolean = false;
    multipleDragSelectCanvas: CanvasRenderingContext2D = null;
    multipleMoveCanvas: CanvasRenderingContext2D = null;
    singlemoveElement: CanvasRenderingContext2D = null;
    movelabelElement: any = null;
    single_select_annotation: string[] = [];
    multiselection_$: Subscription = null;
    disable_fill_color: boolean = false;
    remainder_popup: boolean = false;
    browserRefresh: boolean = false;
    browser_refresh_subscription$: Subscription;
    rotate_previous_value_backup: any = [];
    data_allow_condition: any[] = ["false", false, 0, "0"];
    data_allow_conditionT: any[] = ["true", true, 1, "1"];
    backup_annot_Store: any[] = [];
    zoomlevel: number = 1;
    undovaluesstore: any[] = [];
    redovaluesstore: any[] = [];
    forms_changes_status: boolean = false;
    view_annotation_array: any[] = [];
    document_width: number = 0;
    document_height: number = 0;
    preview_image_data: any = null;
    custom_form_datas:any = null;
    custom_form_diameter:any = 0;
    copy_move_btw_doc:boolean = false;
    current_copy_annot_data:any="";
    backupFormData:any[] = [];
    backupExtendFormData:any[] = [];
    isSingleClick: boolean = true;
    mouse_wheel_stop:any = null;
    disable_drag_scroll:boolean = false;
}

export class createDocumentVar_1 {
    resize_per_input:any = null;
    rotate_deg_input:number = null;
    resizeprntagecontrol = new FormControl(null, [Validators.max(100)]);
    pdf_or_image_load_complete:boolean = false;
    annotation_draw_complete:boolean = false;
    switch_toolbar_list:switch_toolbar[] = [];
    switch_form_list:switch_form[] = [];
    slideDrag:boolean = true;
    zooming_button_disable:boolean = false;
    typeofzoom:string="Zooming In..."
}


