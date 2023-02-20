import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { FormlistService } from "../services/formlist.service";
import * as moment from "moment";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-moreinformation",
  templateUrl: "./moreinformation.component.html",
  styleUrls: ["./moreinformation.component.css"],
})
export class MoreinformationComponent implements OnInit {
  formid: string;
  formName: string;
  createdDate: any;
  modifiedDate: any;
  taglist: string[];
  formfield: number;
  formlist: any[] = [];
  formCount: any = 0;
  ext_form: any;
  sided_value: number;
  constructor(
    private dialog: MatDialogRef<MoreinformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService,
    public dialogbox: MatDialogRef<MoreinformationComponent>,
    public dialog1: MatDialog,
    private dataService:DataService,
  ) {
    var taglist = this.data.taglist;

    if (taglist != undefined) {
      var tagsplit = taglist.filter((data) => {
        return data["form_tag_name"] != "";
      });
      let getresponse_special_character = tagsplit;
      if (tagsplit.length > 0) {
        let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character, 'formtags');
        console.log(change_character_list);
        tagsplit = change_character_list;
      }
    }
    
    this.taglist = tagsplit;
    
    this.formid = this.data.formid;
    this.formfield = this.data.formfield;
    this.formName = this.data.formName;
    this.createdDate = this.data.createdDate;
    this.modifiedDate = this.data.modifiedDate;
    this.formlist = this.data.formlist;
    console.log(this.formlist);
    // for (let i = 0; i < this.formlist.length; i++) {
    //   if (this.formid == this.formlist[i].form_id) {
    //     let getformData = this.formlist[i].form_data;
    //     let convertJSON = JSON.parse(getformData);
    //     console.log(convertJSON);
    //     if (convertJSON != null) {
    //       if (convertJSON.length > 0) {
    //         let tempformCount = 0;
    //         for (let k = 0; k < convertJSON.length; k++) {
    //           console.log(convertJSON[k]);
    //           if (convertJSON[k].is_removed != "1" && convertJSON[k].is_removed != 1 && convertJSON[k].is_removed != true && convertJSON[k].is_removed != "true") {
    //             tempformCount = tempformCount + 1;
    //           }
    //         }
    //         this.formCount = tempformCount;
    //       }
    //       else {
    //         this.formCount = 0;
    //       }
    //     }
    //     else {
    //       this.formCount = 0;
    //     }
    //   }
    
    console.log(this.formlist);
    let formdetail=this.formlist.filter(m=>m.form_id==this.formid)
    console.log(formdetail)
    if( formdetail[0].form_data!=null || formdetail[0].form_data!=undefined){
    let getformData = formdetail[0].form_data;
     let convertJSON = JSON.parse(getformData);
     console.log( convertJSON)
     let form_data= convertJSON.filter(v=>v.element_type!="empty_cell" && v.is_removed != "1" && v.is_removed != 1 && v.is_removed != true && v.is_removed != "true")
     console.log(form_data)
     if(form_data.length!=0){
this.ext_form=form_data.length
     }
     else{
      this.ext_form=0
     }
    }
    if( formdetail[0].ext_form_data!=null ||formdetail[0].ext_form_data!=undefined){
     let ext_json = formdetail[0].ext_form_data;
     let convert_ext_JSON = JSON.parse(ext_json);
     convert_ext_JSON=convert_ext_JSON.filter(v=>v.element_type!="empty_cell" && v.is_removed != "1" && v.is_removed != 1 && v.is_removed != true && v.is_removed != "true")
     console.log(convert_ext_JSON)
     if(convert_ext_JSON.length!=0){
      this.formCount=convert_ext_JSON.length+this.ext_form
           }
        else{
          this.formCount=0+this.ext_form
        }  
    }
    else{
      this.formCount=0+this.ext_form
     }
    
    // if (this.formfield == null) {
    //   this.formfield = 0;
    // }
  }
  

  ngOnInit(): void { }

  onclose() {
    this.dialog.close();
  }
}
