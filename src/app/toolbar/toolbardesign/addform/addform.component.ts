import { Component, OnInit, Inject } from "@angular/core";
import { FormlistService } from "src/app/formbuilder/services/formlist.service";
import {
  MatDialogConfig,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { CopyformelementComponent } from "../copyformelement/copyformelement.component";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-addform",
  templateUrl: "./addform.component.html",
  styleUrls: ["./addform.component.css"],
})
export class AddformComponent implements OnInit {
  formlist: any[];
  form: any;
  formNameList = [];
  Form_id: string;
  remember: boolean = false;
  toolbarData: any;
  toolbarId: string;
  previousFormNames: any;
  formData: any;
  elementId: any;
  exit: void;
  constructor(
    public service: FormlistService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService
  ) {

    var receiveData = this.data;
    this.exit=this.data.exitconfirm
    console.log(this.data.exitconfirm)
    this.toolbarData = receiveData.toolbarData;
    this.toolbarId = receiveData.toolbarId;
    this.elementId = receiveData.elementId;
    this.previousFormNames = receiveData.previousFormNames;
  }
  formlisting() {
    this.service.getformlist().subscribe((data) => {
      console.log(data);
      let getresponse_special_character = data["response_body"]["form_listing"];
      
      if(data["response_body"]["form_listing"].length>0){
        let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character,'formlist');
        console.log(change_character_list);
        data["response_body"]["form_listing"] = change_character_list;
      }
      this.formlist = data["response_body"]["form_listing"];

      this.formlist = this.formlist.filter((data) => {
        return data["is_hidden"] == false;
      });
      this.formlist=this.formlist.sort((a, b) =>
            a.form_name.localeCompare(b.form_name)
          );
    });
  }

  copyelement(form_id, form_name) {
    var tr = this.toolbarData;
    var irii = this.toolbarId;
    for (var i = 0; i < this.formlist.length; i++) {
      if (form_id == this.formlist[i].form_id) {
        this.formData = this.formlist[i];
      }
    }
    this.remember = true;
    form_name = this.dataService.changeFormat(form_name)
    this.form = form_name;
    this.dialog.closeAll();
    this.Form_id = form_id;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(CopyformelementComponent, {
      disableClose: true,
      width: "600px",
      panelClass: "my-class",
      data: {
        Form_id: this.Form_id,
        form: this.form,
        form_name: form_name,
        remember: this.remember,
        toolbarData: this.toolbarData,
        toolbarId: this.toolbarId,
        elementId: this.elementId,
        previousFormNames: this.previousFormNames,
        formData: this.formData,
        Extend:this.formData.is_extend,
        exit:this.exit,
      },
    });
  }

  ngOnInit(): void {

    this.formlisting();
  }
  closeBox() {
    this.dialog.closeAll();
  }
  toogle() { }
}
