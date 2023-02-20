import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { DataService } from "src/app/data.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { v1 as uuidv1 } from "uuid";
@Component({
  selector: "app-duplicate-toolbar",
  templateUrl: "./duplicate-toolbar.component.html",
  styleUrls: ["./duplicate-toolbar.component.css"],
})
export class DuplicateToolbarComponent implements OnInit {
  show: boolean = false;
  getRename: string = "";
  copytext: any;
  constructor(
    private dialogRef: MatDialogRef<DuplicateToolbarComponent>,private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService
  ) { }

  ngOnInit(): void {

  }

  closeBox() {
    this.dialogRef.close();
  }
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
  su: login;
  confirm() {

    let setofItem = [];
    setofItem = this.data.data1;
    let _item = this.data.data; //this.simpleClone(this.data);
    var name = this.copytext;
    _item.element_data.element_name = this.copytext;
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    var annontationidDate = new Date().getTime();
    _item.element_uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + annontationidDate;

    this.dialogRef.close({ data: _item });
  }
}
