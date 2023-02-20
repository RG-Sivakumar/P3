import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { FormlistService } from "../../services/formlist.service";
import { CreateformsComponent } from "../createforms/createforms.component";
import { NgForm } from "@angular/forms";
import { v1 as uuidv1 } from "uuid";
import { ValueService } from "src/app/value.service";
import { Router } from "@angular/router";
import { DataService } from "src/app/data.service";
@Component({
  selector: "app-duplicate",
  templateUrl: "./duplicate.component.html",
  styleUrls: ["./duplicate.component.css"],
})
export class DuplicateComponent implements OnInit {
  projectid: string;
  show: boolean;
  formid1: string;
  date: any;
  list = [];
  constructor(
    private dialog: MatDialogRef<DuplicateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService,
    public dialogbox: MatDialogRef<CreateformsComponent>,
    public dialog1: MatDialog,
    public sendData: ValueService,
    public router: Router,
    private dataService: DataService
  ) {
    this.projectid = this.data.projectid;
    this.formid1 = this.data.formid1;
    this.show = this.data.show;
    this.service.getformlist().subscribe((data) => {
      this.list = data["response_body"]["form_listing"];
      console.log(this.list);
    });
  }
  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.service.formData.new_form_name = changeUpperCaseProjectName;
    }
  }
  btnDisabled = false;
  onSubmit(form: NgForm) {

    let count = 1;
    var name = form.value.new_form_name;
    let removebracket = this.list.forEach((element => {
      let removefirst = element.form_name.split("(");
      element.form_name = removefirst[0];
      console.log(element.form_name);
      return element;
    }));
    let accessSeperate;
    console.log(this.list);
    var duplicateName = this.list.filter(ele => ele.form_name.trim() === form.value.new_form_name.trim());
    if (duplicateName.length > 0) {
      this.list.forEach((e) => {

        if (e.form_name.trim() == form.value.new_form_name.trim()) {
          name = form.value.new_form_name.trim() + " (" + count + ")";
          count = count + 1;
          // _item.element_data.label_text = labelText;
        }
        count = count;
      });
    }

    this.btnDisabled = true;
    name = this.dataService.changeFormat(name);
    this.date = new Date().getTime();
    this.service
      .Duplicateform(uuidv1().toUpperCase(), this.date, name, this.formid1)
      .subscribe((res) => {
        var status = res["response_code"];

        if (status == 200) {
          this.service.formData.new_form_name = "";
          this.router.navigate(["/formbuilder/formlist"]);
          this.service.filter("Register click");
          this.dialogbox.close();
        }
      });
  }


  duplicateNaming(name, item, mode) {

    let count = 1;
    var labelText = name;
    var checkArry;
    if (mode == "copy") {
      checkArry = this.list;
    } else {
      checkArry = this.list.filter(ele => ele.element_uuid != item.element_uuid);
    }
    var duplicateName = checkArry.filter(ele => ele.element_data.label_text.trim() === name.trim());
    if (duplicateName.length > 0) {
      checkArry.forEach((e) => {

        if (e.element_data.label_text.trim() === labelText.trim()) {
          labelText = name.trim() + " (" + count + ")";
          count = count + 1;
          // _item.element_data.label_text = labelText;
        }
        count = count;
      });
    }
    else {
      labelText = name;
    }
    item.element_data.label_text = labelText;
    item.element_data.element_name_alias = labelText;
  }



  onClose() {
    this.router.navigate(["/formbuilder/formlist"]);
    this.dialogbox.close();
  }


  ngOnInit(): void { }
}
