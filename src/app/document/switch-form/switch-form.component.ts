import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormlistService } from "src/app/formbuilder/services/formlist.service";
import { CreateDocumentService } from "../services/create-document.service";
import { FormmappingService } from "../services/formmapping.service";
import { DataserviceService } from "../services/dataservice.service";
import { CreateformsComponent } from "src/app/formbuilder/addforms/createforms/createforms.component";
import * as _ from 'lodash';
import { MatSnackBar } from "@angular/material/snack-bar";
import { DataService } from "src/app/data.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-switch-form",
  templateUrl: "./switch-form.component.html",
  styleUrls: ["./switch-form.component.css"],
})
export class SwitchFormComponent implements OnInit {
  projectId: string;
  formList: any;
  show: boolean = false;
  formId: string;
  callback_formData: any;
  getIndex: number = 0;
  deleteForm: boolean = false;
  formData: any[] = [];
  annotationId: any;
  annoformdata: any[] = [];
  annoformList: any[] = [];
  annotationFormid: any;
  switchForm: boolean = true;
  clickedformid: any;
  folderId: string;
  formCount: any = 0;
  multipleSelectOn: boolean = false;
  multiselectionList: any[] = [];
  selectForm: string = "";
  activeLayerId: any;
  currentFormId: any = "";
  modelFieldsForm:any;
  detach$: any;
  userrole : any;
  isAnnotationDefaultForm:boolean;
  isReadonly: any;

  constructor(
    private dialogClose: MatDialogRef<SwitchFormComponent>,
    private documentService: CreateDocumentService,
    private route: ActivatedRoute,
    public dataservce122:DataService,
    private dataService: DataserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogbox: MatDialogRef<CreateformsComponent>,
    public dialog1: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    public userRoleGlobal: GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.isReadonly = this.encrptdecrpt.getItem("viewonlys");
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    this.userRoleGlobal.findUserProjectRole(this.projectId).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    this.callback_formData = this.data.callback_formData;
    this.formData = this.data.formdata;
    this.formList = this.data.formList;
    this.activeLayerId = this.data.activeLayerId;
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.multiselectionList = this.data.multiselectionList;
    this.annotationId = this.data.annotationId;
    this.currentFormId = this.data.currentFormId;
    for (let k = 0; k < this.formData.length; k++) {
      for (let l = 0; l < this.formData[k].annotations.length; l++) {
        if (this.annotationId == this.formData[k].annotations[l].annotation_id) {
          if (this.formData[k].annotations[l].annotation_forms.length > 0) {
            this.annoformList = this.formData[k].annotations[l].annotation_forms;
          }
          else {
            this.annoformList = [];
          }
        }
      }
    }
    this.selectForm = this.currentFormId
    this.getFormList();
  }

  ngOnInit(): void {
  }
  

  getFormList() {
    
    this.formList.forEach((m) => {
      m.canClose = false;
      m.canDetach = false;
    });
    // ascending order for forms
    if(this.formList != null && this.formList != undefined && this.formList.length>0){
      this.formList = this.formList.sort((a, b) =>(a.form_name.toLowerCase() > b.form_name.toLowerCase()) ? 1 : -1);
    }
    let condition_allow = ['false',false,'0',0];
    if (this.multipleSelectOn == false) {
      let get_forms = this.annoformList;
      if(get_forms.length>0){
        // let sortedForms = get_forms.sort((a, b) => (a.last_updated_date != undefined ? a.last_updated_date : a.created_date).localeCompare(b.last_updated_date != undefined ? b.last_updated_date : b.created_date));
        let sortedForms = get_forms;
        let curnt_slcted_form_index  = this.select_primary_form(sortedForms); // primary form selection function
        // this.currentFormId = sortedForms[curnt_slcted_form_index].form_id;
        for (let p = 0; p < this.formList.length; p++) {
          
          let exist_check = get_forms.findIndex((forms)=>forms.form_id==this.formList[p].form_id && condition_allow.includes(forms.is_removed));
          if(exist_check != -1){
            this.formList[p].canDetach = true;
          }
        }
      }
      else{
        let formslist_local = this.formList;
        formslist_local = formslist_local.sort((a, b) => b.form_name.localeCompare(a.form_name));
        let sortedForms = formslist_local;
        let curnt_slcted_form_index  = this.select_primary_form(sortedForms); // primary form selection function
        // this.currentFormId = sortedForms[curnt_slcted_form_index].form_id;
      }

      // this.annoformList.forEach((element) => {
      //   this.annotationFormid = element.form_id;
      //   this.formList.forEach((m) => {
      //     if (element.form_id == m.form_id && (element.is_removed=="0" || element.is_removed==0)) {
      //       m.detach = true;
      //     }
      //   });
      // });
    }
    else if (this.multipleSelectOn == true) {

      let get_curent_data = this.multiselectionList[this.multiselectionList.length - 1];
      let get_forms = get_curent_data.annotation_forms;
      if(get_forms.length>0){
        let sortedForms = get_forms.sort((a, b) => (a.last_updated_date != undefined ? a.last_updated_date : a.created_date).localeCompare(b.last_updated_date != undefined ? b.last_updated_date : b.created_date));
        let curnt_slcted_form_index  = this.select_primary_form(sortedForms); // primary form selection function
        // this.currentFormId = sortedForms[curnt_slcted_form_index].form_id;
        for (let p = 0; p < this.formList.length; p++) {
          let exist_check = get_forms.findIndex((forms)=>forms.form_id==this.formList[p].form_id && condition_allow.includes(forms.is_removed));
          if(exist_check != -1){
            this.formList[p].canDetach = true;
          }
        }
      }
      else{
        let formslist_local = this.formList;
        formslist_local = formslist_local.sort((a, b) => b.form_name.localeCompare(a.form_name));
        let sortedForms = formslist_local;
        let curnt_slcted_form_index  = this.select_primary_form(sortedForms); // primary form selection function
        // this.currentFormId = sortedForms[curnt_slcted_form_index].form_id;
      }
    }
    console.log(this.formList);
    console.log(this.annoformList);
    // });
  }


  closeBox() {
    this.formList.forEach((m) => {
      m.canClose = false;
    });
    this.formList.forEach((m) => {
      m.canDetach = false;
    });
    this.dialogClose.close();
  }
  formDelete(formid) {
    this.deleteForm = true;
    console.log(formid);
    this.switchForm = false;
    this.clickedformid = formid;
    console.log(this.clickedformid)
  }
  toggleVisibility(value, index){
    console.log('toggle call form switch')
    value.canClose=true;
    let form_values = _.cloneDeep(value);
    this.getIndex = index;
    this.formId = value.form_id;
    this.dialogClose.close();
    this.callback_formData(form_values);
  }

  detach() {
    // var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
    // var currentLink = currentAnnotationData[0].annotation_links.filter((ele => ele.annotation_link_id == this.annotationLink.annotation_link_id))
    this.show = true;
    if (this.multipleSelectOn == false) {
      let layers = [];
      if (this.formData != undefined) {
        for (var i = 0; i < this.formData.length; i++) {
          // for (var j = 0; j < this.formData[0].annotations.length; j++) {
          var currentAnnotationData = this.formData[i].annotations.filter((ele => ele.annotation_id == this.annotationId))
          if(currentAnnotationData.length>0){
            var detachingForm = currentAnnotationData[0].annotation_forms.findIndex((ele => ele.form_id == this.clickedformid))
            // currentAnnotationData[0].annotation_forms.splice(detachingForm, 1);
            currentAnnotationData[0].annotation_forms[detachingForm].is_removed = true
            this.formCount = currentAnnotationData[0].annotation_forms.length
            this.formList.forEach(element => {
              if (this.clickedformid == element.form_id) {
                element.canClose = false;
              }
              this.detach$=this.dataservce122.detachchange.subscribe(data=>{
                this.modelFieldsForm.splice(0,1);
                console.log(data)
             
              })
            });
          }
          layers.push(this.formData[i]);
        }
        this.formData = layers;
        console.log(this.formData);
        let generateCloneLayer = _.cloneDeep(this.formData);
        this.documentService.annotationUpdateForm1(generateCloneLayer, this.annotationId, this.activeLayerId,'form').subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
            this.show = false;
            this.dialogClose.close({
              data: { formCount: this.formCount, layerData: this.formData }
            });
          }
          else {
            this.errorMessage();
          }

        });
        // this.documentService.annotationUpdateForm(this.formData).subscribe((response) => {
        //   console.log(response);
        // });
      }
    }
    else if (this.multipleSelectOn == true) {
      let layers = [];
      if (this.formData != undefined) {
        let multipleFormCount = 0;
        for (var i = 0; i < this.formData.length; i++) {
          for (var j = 0; j < this.formData[i].annotations.length; j++) {
            for (let m = 0; m < this.multiselectionList.length; m++) {
              if (this.multiselectionList[m].annotation_id == this.formData[i].annotations[j].annotation_id) {
                for (var k = 0; k < this.formData[i].annotations[j].annotation_forms.length; k++) {
                  if (this.formData[i].annotations[j].annotation_forms[k].form_id == this.clickedformid
                  ) {
                    let inFormId = this.formData[i].annotations[j].annotation_forms[k].form_id;
                    console.log(inFormId);
                     this.formData[i].annotations[j].annotation_forms[k].is_removed = true;
                    // mediadata.splice(k, 1);
                    // mediadata.is_removed = true;
                    // if(this.formData[i].annotations[j].annotation_forms.length > 0){
                    //   multipleFormCount = multipleFormCount+this.formData[i].annotations[j].annotation_forms.length
                    // }
                    // else{
                    //   multipleFormCount = multipleFormCount+ 0;
                    // }
                    // this.formCount = this.formData[i].annotations[j].annotation_forms.length > 0 ? this.formData[i].annotations[j].annotation_forms.length : 0;  
                    this.formList.forEach(element => {
                      if (inFormId == element.form_id) {
                        element.canClose = false;
                      }
                    });
                  }
                }
              }
            }
          }
          layers.push(this.formData[i]);
        }
        for (let multiple = 0; multiple < this.multiselectionList.length; multiple++) {
          if (this.multiselectionList[multiple].annotation_forms.length > 0) {
            for (let c = 0; c < this.multiselectionList[multiple].annotation_forms.length; c++) {
              if (this.multiselectionList[multiple].annotation_forms[c].form_id == this.clickedformid) {
                // this.multiselectionList[multiple].annotation_forms.splice(c, 1);
                this.multiselectionList[multiple].annotation_forms[c].is_removed = true;
              }
            }
          }
        }
        for (let l = 0; l < this.multiselectionList.length; l++) {
          if (this.multiselectionList[l].annotation_forms.length > 0) {
            if (this.multiselectionList[l].annotation_forms.length > 0) {
              multipleFormCount = multipleFormCount + this.multiselectionList[l].annotation_forms.length;
            }
            else {
              multipleFormCount = multipleFormCount + 0;
            }
          }
          console.log(multipleFormCount, this.multiselectionList);
        }
        this.formCount = multipleFormCount;
        this.dataService.removeForm.emit(this.multiselectionList);
        this.formCount = multipleFormCount;
        this.formData = layers;
        console.log(this.formData);
        let generateCloneLayer = _.cloneDeep(this.formData);
        let multiple_annotation_forms = _.cloneDeep(this.multiselectionList);
        this.documentService.annotationMultipleUpdate(generateCloneLayer, multiple_annotation_forms,'form').subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
            this.show = false;
            this.dialogClose.close({
              data: { formCount: this.formCount, layerData: this.formData }
            });
          }
          else {
            this.errorMessage();
          }
        });
        // this.documentService.annotationUpdateForm(this.formData).subscribe((response) => {
        //   console.log(response);
        // });
      }
    }
    // this.dialogClose.close({
    //   data: { formCount: this.formCount, layerData: this.formData }
    // });
  }

  errorMessage() {
    this.show = false;
    this._snackBar.open('Sync is an error', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }

  getAnnotationForm() {
    this.folderId = this.route.snapshot.queryParamMap.get("folderId");
    this.documentService
      .getAnnotationFormlist(this.projectId, this.folderId, 1)
      .subscribe((response) => {
        console.log(response);
        // let layer_data = JSON.parse(
        //   response["response_body"]["layer_datas"][0].layer_data
        // );
        // this.formData = layer_data;
      });
  }

  goFormSection(hidden, project_id, formName, form_id) {
    this.dataService.multiSelectFooter.emit(false);
    if (hidden == true) {

    } else {
      let previewBack = { state: false, id: this.annotationId, location: 'form_builder' };
      // localStorage.setItem("preSelectAnnotationId", JSON.stringify(previewBack));
      this.encrptdecrpt.setItem("preSelectAnnotationId",previewBack);//security
      this.router.navigate(["formbuilder/formEdit"], {
        queryParams: { Form_id: form_id, Form_name: formName, pageFrom: "document" },
      });
      this.dialogClose.close();
    }
  }
  // https://stackoverflow.com/questions/47875475/angular-4-do-not-reload-component-on-revisit
  createNewForm() {
    this.dialogClose.close();
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = '100%';
    let dialogRef = this.dialog1.open(CreateformsComponent, {
      panelClass: 'my-class',
      data: {
        projectid: this.projectId
      }
    });
    dialogRef.afterClosed().subscribe((response) => {
      let previewBack = { state: false, id: this.annotationId, location: 'form_builder' };
      // localStorage.setItem("preSelectAnnotationId", JSON.stringify(previewBack));
      this.encrptdecrpt.setItem("preSelectAnnotationId",previewBack);//security
      this.router.navigate(["formbuilder/formEdit"], {
        queryParams: { Form_id: response.form_id, Form_name: response.form_name, pageFrom: "document" },
      });
    })
  }

  select_primary_form(sortedForms){
    // which is the form should be display primary form
    if(sortedForms.length > 0){
      let data_allow_conditionT: any[] = ["true", true, 1, "1"];
      let find_set_default_value = sortedForms.findIndex((d_value)=> data_allow_conditionT.includes(d_value.is_default_flag));
      if(find_set_default_value > -1 && this.currentFormId == sortedForms[find_set_default_value].form_id){
        return find_set_default_value;
        // this.currentFormId = sortedForms[find_set_default_value].form_id;
        // this.currentFormName = sortedForms[find_set_default_value].form_name;    
      }
      else{
        let index_last_form = sortedForms.length - 1;
        return index_last_form;
        // this.currentFormId = sortedForms[sortedForms.length - 1].form_id;
        // this.currentFormName = sortedForms[sortedForms.length - 1].form_name;
      }
    }
  }

}
