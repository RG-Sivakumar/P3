import { Component, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from "@angular/material/dialog";
import { CreateToobarComponent } from "../create-toobar/create-toobar.component";
import { Router } from "@angular/router";
import { CopyformsComponent } from "../copyforms/copyforms.component";
import { ValueService } from "src/app/value.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-toolbar-feature",
  templateUrl: "./toolbar-feature.component.html",
  styleUrls: ["./toolbar-feature.component.css"],
})
export class ToolbarFeatureComponent implements OnInit {

  addNewSubFolder: any;
  projectid: string;
  userrole: any;
  constructor(public userRoleGlobal:GlobalUserRoleService,public sendData: ValueService, 
    private dialogRef: MatDialogRef<ToolbarFeatureComponent>, private dialog: MatDialog, 
    private router: Router,private encrptdecrpt:EncryptDecryptService) {
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
   }


  ngOnInit(): void { }

  addNewToolbar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CreateToobarComponent, {
      width: "380px",
      data: { newToolbarAdd: true }
    });
    this.dialogRef.close();
  }

  importToolbar() {
    this.router.navigate(['/toolbar/import-Toolbar']);
    this.dialogRef.close();
  }
  disble: any = false;

  importForms() {
    // this.disble=true;
    // localStorage.setItem("disableButton", this.disble);
    this.router.navigate(['/toolbar/duplicateform']);
    this.dialogRef.close();
  }
  closeBox() {
    this.dialogRef.close();
  }

}


