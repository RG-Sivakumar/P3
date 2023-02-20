import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
} from "@angular/material/dialog";
import { FormlistService } from "../../services/formlist.service";
import { MenucomponentComponent } from "../menucomponent/menucomponent.component";
import { Router } from "@angular/router";

import { MoreinformationComponent } from "../../moreinformation/moreinformation.component";

import { ManageformComponent } from "../../manageform/manageform.component";
import { RenameComponent } from "../../rename/rename.component";
import { RmcomponentComponent } from "src/app/projects/hidden/rmcomponent/rmcomponent.component";
import { ManagehiddenformtagComponent } from "src/app/projects/hidden/hiddenlists/managehiddenformtag/managehiddenformtag.component";
import { GlobalUserRoleService } from "src/app/global-user-role.service";

@Component({
  selector: "app-morecomponemt",
  templateUrl: "./morecomponemt.component.html",
  styleUrls: ["./morecomponemt.component.css"],
})
export class MorecomponemtComponent implements OnInit {
  formname: string;
  date1: string;
  date2: string;
  formid: string;
  taglist: string[];
  projectid: string;
  hidden: boolean;
  list: any;
  userrole: any;

  constructor(
    private dialog: MatDialogRef<MorecomponemtComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService,
    public dialogbox: MatDialogRef<MenucomponentComponent>,
    public dialog1: MatDialog,
    public router: Router,public userRoleGlobal:GlobalUserRoleService
  ) {
    this.formname = this.data.formname;
    this.date1 = this.data.date1;
    this.date2 = this.data.date2;
    this.formid = this.data.formid;
    this.projectid = this.data.projectid;
    this.hidden = this.data.hidden;

    this.service.getformlist().subscribe((data) => {
      this.list = data["response_body"]["form_listing"];
    });
    this.service.gettag(this.formid).subscribe((data) => {
      this.taglist = data["response_body"]["form_tags"];
    });
   
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
  }

  Rename() {
    this.dialog.close();
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";

    let dialogRef = this.dialog1.open(RmcomponentComponent, {
      panelClass: "my-class",
      data: {
        formid: this.formid,
        formname: this.formname,
      },
    });
  }
  Tag() {
    this.dialog.close();
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";

    let dialogRef = this.dialog1.open(ManagehiddenformtagComponent, {
      panelClass: "my-class",
      data: {
        formid: this.formid,
        formname: this.formname,
        projectid: this.projectid,
      },
    });
  }
  MoreInformation() {
    this.dialog.close();
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";

    let dialogRef = this.dialog1.open(MoreinformationComponent, {
      panelClass: "my-class",
      data: {
        formid: this.formid,
        formName: this.formname,
        modifiedData: this.date1,
        createdData: this.date2,
      },
    });
  }

  unhide() {
    this.service.hide(this.formid, false).subscribe((data) => {
      this.dialogbox.close();
      this.service.filter("Register click");
    });
  }
  edit() {
    this.router.navigateByUrl("/formbuilder/formEdit");
  }

  onclose() {
    this.dialogbox.close();
  }
  ngOnInit(): void {}
}
