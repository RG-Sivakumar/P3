import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialog,
} from "@angular/material/dialog";
import { CreateToobarComponent } from "../create-toobar/create-toobar.component";
import { ManageTagComponent } from "../manage-tag/manage-tag.component";
import { ToolbarlistService } from "../../services/toolbarlist.service";
import { MoreInformationComponent } from "../more-information/more-information.component";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { AlertPermissionComponent } from "src/app/projects/alert-permission/alert-permission.component";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-more-option",
  templateUrl: "./more-option.component.html",
  styleUrls: ["./more-option.component.css"],
})
export class MoreOptionComponent implements OnInit {
  projectId: string;
  toolbarName: string;
  createdDate: string;
  modifiedDate: string;
  toolbarId: string;
  toolbarTagList: string[];
  toolbar_id1: string;
  s: boolean;
  data1: any;
  checkinTemp: any;
  is_hidden: boolean = false;
  toolbarlist: any[] = [];
  admin: any;
  edit1: any;
  view: any;
  userrole:string;
  storageProjectId:string;
  constructor(
    private dialogRef: MatDialogRef<MoreOptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public toolbarService: ToolbarlistService,
    public router: Router,
    private datePipe: DatePipe,public userRoleGlobal:GlobalUserRoleService,
    private dataService:DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.admin = this.encrptdecrpt.getItem("Admin");
    this.edit1 = this.encrptdecrpt.getItem("Edit");
    this.view = this.encrptdecrpt.getItem("View");
    this.toolbar_id1 = this.data.toolbar_id1;
    var receiveData = this.data;
    this.is_hidden = receiveData.is_hidden;
    console.log(this.is_hidden);
    this.toolbarId = receiveData.toolbarId;
    this.getToolbarTagList(this.toolbarId);
    this.projectId = receiveData.projectId;
    this.toolbarName = receiveData.toolbarName;
    this.createdDate = receiveData.createdDate;
    this.modifiedDate = receiveData.modifiedDate;
    this.toolbarlist = receiveData.toolbarlist;
    console.log(this.data);
    this.toolbarService.listen().subscribe((m) => {
      this.getToolbarTagList(this.toolbarId);
    });
    if (this.encrptdecrpt.getItem("userrole") != null) {
      if(this.encrptdecrpt.getItem("userrole").includes("||"))
      {
          
        let storageRoleData = this.encrptdecrpt.getItem('userrole').split("||")
        if(this.projectId == storageRoleData[0]) {
          this.userrole = storageRoleData[1]
        } else { 
          // Seems user with back button has come into a different project when compared to the one set on the local storage
          // this.userrole = this.userRoleGlobal.getProjectUserRole(this.projectId)
          this.userRoleGlobal.getProjectUserRolewait(this.projectId).then((get_res)=>{
            this.userrole = get_res;
          });
  
        }
      }
      else { 
        // Seems user with back button has come into a different project when compared to the one set on the local storage
        // this.userrole = this.userRoleGlobal.getProjectUserRole(this.projectId)
        this.userRoleGlobal.getProjectUserRolewait(this.projectId).then((get_res)=>{
          this.userrole = get_res;
        });
      }
    }
    else {
      // this.userrole = this.userRoleGlobal.getProjectUserRole(this.projectId)
      this.userRoleGlobal.getProjectUserRolewait(this.projectId).then((get_res)=>{
        this.userrole = get_res;
      });
    }
  
    console.log(this.userrole)

  }

  ngOnInit(): void { }

  getToolbarTagList(toolbarId) {
    this.toolbarService.toolbarTag(toolbarId).subscribe((res) => {
      let getresponse_special_character = res["response_body"]["toolbar_tags"];
      if (res["response_body"]["toolbar_tags"].length > 0) {
        let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character, 'toolbartags');
        console.log(change_character_list);
        res["response_body"]["toolbar_tags"] = change_character_list;
      }
      this.toolbarTagList = res["response_body"]["toolbar_tags"];
    });
  }

  gotoRenameBox() {
    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialogRef.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(CreateToobarComponent, {
        width: "380px",
        data: {
          renameaccess: true,
          toolbarId: this.toolbarId,
          toolbarName: this.toolbarName,
        },
      });
      this.dialogRef.close();
    }
  }

  goToManageTags() {
    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialogRef.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(ManageTagComponent, {
        width: "380px",
        data: {
          projectId: this.projectId,
          toolbarId: this.toolbarId,
          toolbarTagList: this.toolbarTagList,
        },
      });
      this.dialogRef.close();
    }
  }

  goToMoreInformation() {
    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialogRef.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(MoreInformationComponent, {
        width: "380px",
        data: {
          toolbarId: this.toolbarId,
          toolbarName: this.toolbarName,
          createdDate: this.createdDate,
          modifiedDate: this.modifiedDate,
          toolbarTagList: this.toolbarTagList,
          toolbarlist: this.toolbarlist,
        },
      });
      this.dialogRef.close();
    }
  }

  closeBox() {
    this.dialogRef.close();
  }
  hide() {
    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialogRef.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      this.toolbarService.hide(this.toolbarId).subscribe((res) => {
        this.dialog.closeAll();

        this.toolbarService.filter("Register click");
      });
    }
  }

  gotoToolbarDesign() {
    if (this.admin == 0 && this.edit1 == 0 && this.view == 1) {
      this.dialogRef.close();
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      this.router.navigate(["/toolbar/toolbardesign"], {
        queryParams: {
          project_id: this.projectId,
          toolbarName: this.toolbarName,
          toolbarId: this.toolbarId,
        },
      });
      this.dialogRef.close();
    }
  }
}
