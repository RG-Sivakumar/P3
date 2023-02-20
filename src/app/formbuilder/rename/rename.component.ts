import { Component, OnInit, Inject } from "@angular/core";
import { FormlistService } from "../services/formlist.service";
import { NgForm } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-rename",
  templateUrl: "./rename.component.html",
  styleUrls: ["./rename.component.css"],
})
export class RenameComponent implements OnInit {
  formid: string;
  formname: string;
  change: boolean;
  formdefault: string = "";
  list: any;
  keepTextName: string = "";
  ShowHideProjectList: any[] = [];
  keepfullText: string = "";

  constructor(
    public dialogbox: MatDialogRef<RenameComponent>,
    public dialog: MatDialogRef<RenameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService,
    private dataService: DataService
  ) {

    this.formid = this.data.formid;
    this.formdefault = this.data.formname;
    this.list = this.data.list;
    let tempkeepTextName = this.data.formname;
    this.keepfullText = this.data.formname;
    this.ShowHideProjectList = this.data.list;
    if (tempkeepTextName != undefined) {
      var rest = tempkeepTextName.substring(0, tempkeepTextName.lastIndexOf("("));
      var last = tempkeepTextName.substring(tempkeepTextName.lastIndexOf("(") + 1, tempkeepTextName.length);
      console.log(rest + "," + rest.length + "," + last);
      if (rest.length == 0) {
        this.keepTextName = this.data.formname.trim();
      }
      else {
        this.keepTextName = rest.trim();
      }
    }
    console.log(this.keepTextName);
    console.log(this.list);
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.formdefault = changeUpperCaseProjectName;
    }
  }

  rename(form_name) {

    form_name = form_name.trim();
    let firstLetter = form_name[0].toUpperCase();
    let otherletters = form_name.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    let tempcheckName = changeUpperCaseProjectName.trim();
    var duplicateCheckname = changeUpperCaseProjectName.trim();
    duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
    console.log(this.keepTextName.toLowerCase(), tempcheckName.toLowerCase());
    if (this.keepTextName.toLowerCase() != tempcheckName.toLowerCase() && this.keepfullText.toLowerCase().trim() != tempcheckName.toLowerCase()) {
      console.log(changeUpperCaseProjectName);
      let count = 1;
      while (this.ShowHideProjectList.find((data) => data.form_name.toLowerCase() === duplicateCheckname.toLowerCase())) {
        duplicateCheckname = tempcheckName + " (" + count + ")";
        count++;
        console.log(duplicateCheckname, changeUpperCaseProjectName, count);
      }
      duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
      this.service.Rename(this.formid, duplicateCheckname).subscribe((data) => {
        this.service.filter("Register click");
      });
    }
    else if (this.keepTextName != tempcheckName && this.keepfullText != tempcheckName) {
      this.service.Rename(this.formid, duplicateCheckname).subscribe((data) => {
        this.service.filter("Register click");
      });
    }
    this.dialogbox.close();
  }
  onclose() {
    this.dialogbox.close();
  }

  ngOnInit(): void {

  }

  renameFiles(arr) {
    arr.forEach((element) => {
      console.log(element);
    });
  }
}
