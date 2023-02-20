import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
} from "@angular/material/dialog";
import { FormlistService } from "../../services/formlist.service";
import { RenameComponent } from "../../rename/rename.component";
import { ManageformComponent } from "../../manageform/manageform.component";
import { MoreinformationComponent } from "../../moreinformation/moreinformation.component";
import { Router } from "@angular/router";
import { EditPermissionPopupComponent } from "src/app/project-dashboard/edit-permission-popup/edit-permission-popup.component";
import { AlertPermissionComponent } from "src/app/projects/alert-permission/alert-permission.component";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-menucomponent",
  templateUrl: "./menucomponent.component.html",
  styleUrls: ["./menucomponent.component.css"],
})
export class MenucomponentComponent implements OnInit {
  formname: string;
  date1: string;
  date2: string;
  formid: string;
  taglist: string[];
  projectid: string;
  hidden: boolean;
  list: any;
  formfield: number;
  admin: any;
  edit1: any;
  view: any;
  userrole:string;
  storageProjectId:string;
  constructor(
    private dialog2: MatDialogRef<MenucomponentComponent>,
    private dialog: MatDialogRef<MenucomponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService,
    public dialogbox: MatDialogRef<MenucomponentComponent>,
    public dialog1: MatDialog,
    public router: Router,
    public userRoleGlobal:GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.admin = this.encrptdecrpt.getItem("Admin");
    this.edit1 = this.encrptdecrpt.getItem("Edit");
    this.view = this.encrptdecrpt.getItem("View");
    this.formfield = this.data.formfield;
    this.formname = this.data.formname;
    this.date1 = this.data.date1;
    this.date2 = this.data.date2;
    this.formid = this.data.formid;
    this.projectid = this.data.projectid;
    this.hidden = this.data.hidden;
    this.list = this.data.listData;

    // this.service.getformlist().subscribe((data) => {
    //   this.list = data["response_body"]["form_listing"];
    // });

    if (this.encrptdecrpt.getItem("userrole") != null) {
      if(this.encrptdecrpt.getItem("userrole").includes("||"))
      {
          
        let storageRoleData = this.encrptdecrpt.getItem('userrole').split("||")
        if(this.projectid == storageRoleData[0]) {
          this.userrole = storageRoleData[1]
        } else { 
          // Seems user with back button has come into a different project when compared to the one set on the local storage
          // this.userrole = this.userRoleGlobal.getProjectUserRole(this.projectid)
          this.userRoleGlobal.getProjectUserRolewait(this.projectid).then((get_res)=>{
            this.userrole = get_res;
          });
  
        }
      }
      else { 
        // Seems user with back button has come into a different project when compared to the one set on the local storage
        // this.userrole = this.userRoleGlobal.getProjectUserRole(this.projectid)
        this.userRoleGlobal.getProjectUserRolewait(this.projectid).then((get_res)=>{
          this.userrole = get_res;
        });

      }
    }
    else {
      // this.userrole = this.userRoleGlobal.getProjectUserRole(this.projectid)
      this.userRoleGlobal.getProjectUserRolewait(this.projectid).then((get_res)=>{
        this.userrole = get_res;
      });
    }
  
    console.log(this.userrole)


    this.service.gettag(this.formid).subscribe((data) => {
      this.taglist = data["response_body"]["form_tags"];
    });
  }


  Rename() {

    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialog.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog1.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      this.dialog.close();
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      dialgoConfig.width = "100%";

      let dialogRef = this.dialog1.open(RenameComponent, {
        panelClass: "my-class",
        width: "380px",
        data: {
          formid: this.formid,
          formname: this.formname,
          list: this.list
        },
      });
    }
  }
  Tag() {
    
      this.dialog.close();
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      dialgoConfig.width = "100%";

      let dialogRef = this.dialog1.open(ManageformComponent, {
        width: "380px",
        panelClass: "my-class",
        data: {
          formid: this.formid,
          formname: this.formname,
          projectid: this.projectid,
        },
      });
    
  }
  MoreInformation() {
    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialog.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog1.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      this.dialog.close();
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      dialgoConfig.width = "100%";
      let dialogRef = this.dialog1.open(MoreinformationComponent, {
        width: "380px",
        panelClass: "my-class",
        data: {
          formid: this.formid,
          formName: this.formname,
          createdDate: this.date1,
          modifiedDate: this.date2,
          formfield: this.formfield,
          taglist: this.taglist,
          formlist: this.list,
        },
      });
    }
  }
  hide() {
    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialog.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog1.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      this.service.hide(this.formid, true).subscribe((data) => {
        this.dialogbox.close();
        this.service.filter("Register click");
      });
    }
  }
  unhide() {
    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialog.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog1.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      this.service.hide(this.formid, false).subscribe((data) => {
        this.dialogbox.close();
        this.service.filter("Register click");
      });
    }
  }
  edit() {
    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialog.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog1.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      this.router.navigate(["formbuilder/formEdit"], {
        queryParams: { Form_id: this.formid, Form_name: this.formname },
      });
      this.dialog.close();
    }
  }

  onclose() {
    this.dialogbox.close();
  }
  ngOnInit(): void { }
}
