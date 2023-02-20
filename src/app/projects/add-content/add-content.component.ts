import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AddProjectComponent } from "../add-project/add-project.component";
import { AddFileComponent } from "../add-file/add-file.component";
import { FieldsheetComponent } from "../fieldsheet/fieldsheet.component";
import { NoParentComponent } from "../no-parent/no-parent.component";
import { GoogleDriveComponent } from "../google-drive/google-drive.component";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-add-content",
  templateUrl: "./add-content.component.html",
  styleUrls: ["./add-content.component.css"],
})
export class AddContentComponent implements OnInit {
  projectId: string;
  selectfolders = [];
  callback: any;
  projecDetailstList: any;
  ShowHideProjectList: any[] = [];
  show = false;
  projectid: string;
  userrole: string;

  constructor(
    private dialogbox: MatDialog,
    private dialog: MatDialogRef<AddContentComponent>,public userRoleGlobal:GlobalUserRoleService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private encrptdecrpt:EncryptDecryptService
  ) {
    var receiveData = this.data;
    this.projectId = receiveData.projectId;
    this.selectfolders = receiveData.foldersIn;
    this.callback = receiveData.callback;
    this.projecDetailstList = receiveData.projecDetailstList;
    this.ShowHideProjectList = receiveData.ShowHideProjectList;
    console.log(this.selectfolders);
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
  }

  ngOnInit(): void { }

  addNewFolder() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = false;
    dialogconfig.disableClose = true;
    this.dialogbox.open(AddProjectComponent, {
      width: "380px",
      data: {
        addNewFolderAccess: true,
        projectId: this.projectId,
        callback: this.callback,
        projecDetailstList: this.projecDetailstList,
        ShowHideProjectList: this.ShowHideProjectList,
      },
    });
    this.dialog.close();
  }

  addNewSubFolder() {
    this.show = true;
    console.log(this.selectfolders.length);
    console.log(
      this.selectfolders.some((data) => {
        return data["is_folder_flag"] == 1;
      })
    );
    this.show = false;
    if (
      this.selectfolders.length == 0 ||
      !this.selectfolders.some((data) => {
        return data["is_folder_flag"] == 1;
      })
    ) {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.autoFocus = true;
      dialogconfig.disableClose = true;
      this.dialogbox.open(NoParentComponent, {
        width: "380px",
      });
      this.dialog.close();
    } else {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.autoFocus = true;
      dialogconfig.disableClose = true;
      this.dialogbox.open(AddProjectComponent, {
        width: "380px",
        data: {
          addNewSubFolderAccess: true,
          receivefolder: this.selectfolders,
          projectId: this.projectId,
          callback: this.callback,
          projecDetailstList: this.projecDetailstList,
          ShowHideProjectList: this.ShowHideProjectList,
        },
      });
    }
    this.dialog.close();
  }

  fileUpload() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialogbox.open(AddFileComponent, {
      data: {
        projectId: this.projectId,
        receivefolder: this.selectfolders,
        callback: this.callback,
        projecDetailstList: this.projecDetailstList,
        ShowHideProjectList: this.ShowHideProjectList,
      },
    });
    this.dialog.close();
  }

  fileUPloadGoogle() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialogbox.open(GoogleDriveComponent, {
      width: "380px",
      data: {
        projectId: this.projectId,
        receivefolder: this.selectfolders,
        callback: this.callback,
      },
    });
    this.dialog.close();
  }

  goToFieldsheet() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialogbox.open(FieldsheetComponent, {
      width: "420px",
      data: {
        projectId: this.projectId,
        receivefolder: this.selectfolders,
        callback: this.callback,
        projecDetailstList: this.projecDetailstList,
        ShowHideProjectList: this.ShowHideProjectList,
      },
    });
    this.dialog.close();
  }

  closeBox() {
    this.dialog.close();
  }
}
