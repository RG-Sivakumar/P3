import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { NgForm } from "@angular/forms";
import { v1 as uuidv1 } from "uuid";
import { ToolbarlistService } from "../../services/toolbarlist.service";
import { ValueService } from "src/app/value.service";
import { ToolbardesignComponent } from "../../toolbardesign/toolbardesign.component";
import { Router } from "@angular/router";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-copyforms",
  templateUrl: "./copyforms.component.html",
  styleUrls: ["./copyforms.component.css"],
})
export class CopyformsComponent implements OnInit {
  projectid: string;
  toolbarid: string;
  date: any;
  toolbarname: string;
  list = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogbox: MatDialogRef<CopyformsComponent>,
    public dialog1: MatDialog,
    public service: ToolbarlistService,
    public sendData: ValueService,
    public router: Router,
    private dataService: DataService
  ) {
    this.toolbarid = this.data.toolbarid;
    this.projectid = this.data.projectid;
  }

  ngOnInit(): void {
    this.service.gettoolbarlist(this.projectid).subscribe((data) => {
      this.list = data["response_body"]["toolbar_listing"];
      console.log(this.list);
    });
  }
  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.service.formData.toolbar_name = changeUpperCaseProjectName;
    }
  }
  btnDisabled = false;
  onSubmit(new_toolbar_name) {
    this.date = new Date().getTime();
    // let toolbarName = new_toolbar_name.value;
    // let firstLetter = toolbarName[0].toUpperCase();
    // let otherletters = toolbarName.slice(1);
    // let changeUpperCaseProjectName = firstLetter+otherletters;
    let count = 1;
    var name = new_toolbar_name;
    let accessSeperate;
    let removebracket = this.list.forEach((element => {
      let removefirst = element.toolbar_name.split("(");
      element.toolbar_name = removefirst[0];
      console.log(element.toolbar_name);
      return element;
    }));
    console.log(this.list);
    this.list.forEach((e) => {
      if (e.toolbar_name.toLowerCase() === new_toolbar_name.value.toLowerCase()) {
        console.log(new_toolbar_name.value);
        name = new_toolbar_name.value + "(" + count + ")";
        console.log(count);
        count++;
        accessSeperate = true;
      }
    });
    if (accessSeperate != true) {
      let firstLetter = new_toolbar_name.value[0].toUpperCase();
      let otherletters = new_toolbar_name.value.slice(1);
      let changeUpperCaseProjectName = firstLetter + otherletters;
      name = changeUpperCaseProjectName;
    }
    if (count > 1) {
      ;
      let firstLetter = name[0].toUpperCase();
      let otherletters = name.slice(1);
      let changeUpperCaseProjectName = firstLetter + otherletters;
      name = changeUpperCaseProjectName;
    }
    name = this.dataService.changeFormat(name)
    this.btnDisabled = true;
    this.service
      .duplicat(
        name,
        this.projectid,
        this.toolbarid,
        uuidv1().toUpperCase(),
        this.date
      )
      .subscribe((res) => {
        var status = res["response_code"];

        if (status == 200) {
          this.service.formData.toolbar_name = "";
          this.router.navigate(["/toolbar/toolbarlist"]);
          this.service.filter("Register click");
          this.dialogbox.close();
        }
      });
  }
  onClose() {
    this.router.navigate(["/toolbar/toolbarlist"]);
    this.dialogbox.close();
  }
}
