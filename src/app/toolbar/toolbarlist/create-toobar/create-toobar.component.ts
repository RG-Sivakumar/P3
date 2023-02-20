import { Component, OnInit, Inject } from "@angular/core";
import { ToolbarlistService } from "../../services/toolbarlist.service";
import { v1 as uuidv1 } from "uuid";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-create-toobar",
  templateUrl: "./create-toobar.component.html",
  styleUrls: ["./create-toobar.component.css"],
})
export class CreateToobarComponent implements OnInit {
  projectId: string;
  toolbarName: string;
  addRename: boolean = false;
  newToolbarAdd: boolean = false;
  toolbarId: string;
  show: boolean = false;
  list: any = [];
  getRename: string = '';
  constructor(
    private toolbarService: ToolbarlistService,
    private dialog: MatDialogRef<CreateToobarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    var receiveData = this.data;
    this.toolbarId = receiveData.toolbarId;
    this.toolbarName = receiveData.toolbarName;
    this.addRename = receiveData.renameaccess;
    this.newToolbarAdd = receiveData.newToolbarAdd;
  }

  ngOnInit(): void {
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    this.toolbarService.gettoolbarlist(this.projectId).subscribe((data) => {
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
      this.toolbarName = changeUpperCaseProjectName;
    }
  }

  firstLetterCapitalRename(word) {
    console.log(word)
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      console.log(this.toolbarName);
      this.getRename = changeUpperCaseProjectName;
      this.toolbarName = changeUpperCaseProjectName;
    }
  }


  AddNewToolbarAuc(toolbarName) {
    this.show=true;
    let count = 1;
    var name = toolbarName;
    name = this.dataService.changeFormat(name);
    this.list.forEach((e) => {
      if (e.toolbar_name.trim() === name.trim()) {
        name = toolbarName.trim() + " (" + count + ")";
        count++;
      } else {
        name = name.trim();
      }
    });
    this.list.forEach((e) => {
      if (e.toolbar_name.trim() === name.trim()) {
        name = toolbarName.trim() + " (" + count + ")";
        count++;
      } else {
        name = name.trim();
      }
    });
    var date = new Date().getTime();
    this.toolbarService
      .createToolbar(this.projectId, name, uuidv1().toUpperCase(), date)
      .subscribe((res) => {
        this.show=false;
        console.log(res);
        let data = res['response_body'];
        this.dialog.close(data);
        this.toolbarService.filter("Register Click");
      });
  }

  renameAuc(renametoolbar) {

    let count = 1;
    var name = renametoolbar;
    let accessSeperate;
    console.log(this.list);
    var checkArry = this.list.filter(ele => ele.toolbar_id != this.toolbarId);
    checkArry.forEach((e) => {
      if (e.toolbar_name.trim() === name.trim()) {
        name = renametoolbar.trim() + " (" + count + ")";
        count++;
        accessSeperate = true;
      } else {
        name = name.trim();
      }
    });
    checkArry.forEach((e) => {
      if (e.toolbar_name.trim() === name.trim()) {
        name = renametoolbar.trim() + " (" + count + ")";
        count++;
        accessSeperate = true;
      } else {
        name = name.trim();
      }
    });
    name = this.dataService.changeFormat(name);
    this.toolbarService
      .renametoolbarName(this.toolbarId, name)
      .subscribe((res) => {
        this.toolbarService.filter("Register click");
      });
    //}
    this.dialog.close();
  }
  closeBox() {
    this.dialog.close();
  }
}
