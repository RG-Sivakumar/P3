import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import _ from "lodash";

@Component({
  selector: "app-delete-toolbar",
  templateUrl: "./delete-toolbar.component.html",
  styleUrls: ["./delete-toolbar.component.css"],
})
export class DeleteToolbarComponent implements OnInit {
  show: boolean = false;
  item: boolean;
  toolbarDelete:boolean=false;
  formDelete:boolean=false;
  formIndexValue:any="";
  settingAPIvalue:any="";
  callbackfun:any;

  constructor(
    private dialog: MatDialogRef<DeleteToolbarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.toolbarDelete = this.data.toolbarDelete;
    this.formDelete = this.data.formDelete;
    this.formIndexValue = this.data.indexValue;
    this.settingAPIvalue = this.data.settingAPIValue; 
    this.callbackfun = this.data.callbackFun;
    console.log(this.data);
  }

  ngOnInit(): void {}

  removeField() {
    //console.log(this.item);
    this.item = true;
    this.dialog.close({ data: this.item });
  }

  removeDefaultForm(){
    var settingAPIvalueCopy = _.cloneDeep(this.settingAPIvalue);
    this.callbackfun(this.formIndexValue,this.settingAPIvalue);
    settingAPIvalueCopy.element_data.forms_list_data.splice(this.formIndexValue, 1);
    var getformName = settingAPIvalueCopy.element_data.forms_list_data;
    this.dialog.close({ data: false,formData: getformName });
  }

  closeBox() {
    this.item = false;
    this.dialog.close({ data: this.item });
  }
}
