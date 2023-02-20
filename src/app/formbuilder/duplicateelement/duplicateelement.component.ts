import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { DataService } from "src/app/data.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { v1 as uuidv1 } from "uuid";

@Component({
  selector: "app-duplicateelement",
  templateUrl: "./duplicateelement.component.html",
  styleUrls: ["./duplicateelement.component.css"],
})
export class DuplicateelementComponent implements OnInit {
  data2: any;
  copytext: any;
  su: login;
  constructor(
    private dialog: MatDialogRef<DuplicateelementComponent>,
    private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService
  ) { }
  onClose() {
    this.dialog.close();
  }

  ngOnInit(): void { }
  simpleClone(obj: any) {
    return Object.assign({}, obj);
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.copytext = changeUpperCaseProjectName;
    }
  }

  confirm() {
    let _item = this.simpleClone(this.data);
    _item.toggle = false;
    // this.data.data.push(_item);
    let firstLetter = this.copytext[0].toUpperCase();
    let otherletters = this.copytext.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    _item.element_data.label_text = changeUpperCaseProjectName;
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var annontationidDate = new Date().getTime();
    _item.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;
    if (_item.element_data.hasOwnProperty('options')) {
      if (_item.element_data.options != "") {
        _item.element_data.options.forEach(element => {
          element.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
        });
      }
    }

    this.dialog.close({ data: _item });
  }
}
