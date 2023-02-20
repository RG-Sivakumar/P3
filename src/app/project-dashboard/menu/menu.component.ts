import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
} from "@angular/material/dialog";
import { ProjectlistService } from "../my-project/services/projectlist.service";
import { RenameProjectComponent } from "../rename-project/rename-project.component";
import { ProjectInformationComponent } from "../project-information/project-information.component";
import { TagsDetailsComponent } from "../tags-details/tags-details.component";
import { ManageUserComponent } from "../manage-user/manage-user.component";
import { project } from "../models/project-model";
import { EditPermissionPopupComponent } from "../edit-permission-popup/edit-permission-popup.component";
import { DataimageService } from "src/app/dataimage.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  project: string[];
  date1: string;
  date2: string;
  test: boolean = false;
  projectid: string;
  fav: boolean = true;
  status: any;
  show: boolean = false;
  taglist: string[];
  ShowHideProjectList: any[] = [];
  userrole:any="";

  constructor(
    private dialog: MatDialogRef<MenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: ProjectlistService,
    public dialogbox: MatDialogRef<MenuComponent>,
    public dialog1: MatDialog,
    public userRoleGlobal:GlobalUserRoleService,
  ) {
    // this.show = true;
    this.project = this.data.project;
    this.test = this.data.test;
    this.date1 = this.data.date1;
    this.date2 = this.data.date2;
    this.projectid = this.data.projectid;
    this.status = this.data.status;
    this.ShowHideProjectList = this.data.ShowHideProjectList;
    this.userRoleGlobal.findUserRole(this.ShowHideProjectList,this.projectid);
    console.log(this.userRoleGlobal.userRol);
    let roleDetails = {project_id:this.projectid,userRole:this.userRoleGlobal.userRol};
    localStorage.setItem("userPermission", JSON.stringify(roleDetails));
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    // this.service.getTag(this.projectid).subscribe((data) => {
    //   this.show = false;
    //   this.taglist = data["response_body"]["project_tags"];
    // });
  }

  permissionCheck() {
    this.dialogbox.close();
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog1.open(EditPermissionPopupComponent, {
    });
  }

  Addfavourite() {
      this.service.loaderActivated.emit(true);
      if (this.status == "3") {
        this.service.RemoveFavorite(this.projectid).subscribe((data) => {
          this.fav = true;
          this.show = false;
          this.service.filter("Register click");
        });
        this.dialogbox.close();
      } else {
        {
          this.service.AddFavorite(this.projectid).subscribe((data) => {
            console.log(data);
            this.fav = true;
            this.show = false;
            this.service.filter("Register click");
          });
        }
        this.dialogbox.close();
      }
  }

  hide() {
      this.service.loaderActivated.emit(true);
      if (this.status == "2") {
        this.service.RemoveHide(this.projectid).subscribe((data) => {
          this.fav = true;

          this.service.filter("Register click");
        });
      } else {
        {
          this.service.AddHide(this.projectid).subscribe((data) => {
            this.fav = true;
            this.service.filter("Register click");
          });
        }
      }
      this.dialogbox.close();
  }

  // Rename() {
  //   console.log(this.ShowHideProjectList);
  //   var currentProject = this.ShowHideProjectList.filter((ele => ele.project_id == this.projectid))
  //   if (currentProject[0].edit_permission_flag == false) {
  //     this.permissionCheck();
  //   } else {
  //     this.dialog.close();
  //     const dialgoConfig = new MatDialogConfig();
  //     dialgoConfig.disableClose = true;
  //     dialgoConfig.autoFocus = true;
  //     dialgoConfig.width = "100%";

  //     let dialogRef = this.dialog1.open(RenameProjectComponent, {
  //       panelClass: "my-class",
  //       data: {
  //         project: this.project,
  //         projectid: this.projectid,
  //         status: this.status,
  //         ShowHideProjectList: this.ShowHideProjectList,
  //       },
  //     });
  //   }
  // }

  RenameProject() {
      this.dialog.close();
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      dialgoConfig.width = "100%";
      let dialogRef = this.dialog1.open(RenameProjectComponent, {
        panelClass: "my-class",
        data: {
          project: this.project,
          projectid: this.projectid,
          status: this.status,
          ShowHideProjectList: this.ShowHideProjectList,
        },
      });
  }

  projectinformation() {
      this.dialog.close();
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      dialgoConfig.width = "100%";
      let dialogRef = this.dialog1.open(ProjectInformationComponent, {
        width: "400px",
        panelClass: "my-class",
        data: {
          project: this.project,
          date1: this.date1,
          date2: this.date2,
          projectid: this.projectid,
          status: this.status,
        },
      });
  }

  Tags() {
      this.dialog.close();
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      let dialogRef = this.dialog1.open(TagsDetailsComponent, {
        width: "400px",
        data: {
          project: this.project,
          projectid: this.projectid,
        },
      });
  }

  manageuser() {
    if(this.userrole=='admin'){
      this.dialog.close();
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;

      let dialogRef = this.dialog1.open(ManageUserComponent, {
        panelClass: "my-class",
        width: "950px",
        data: {
          project: this.project,
          date1: this.date1,
          date2: this.date2,
          projectid: this.projectid,
          status: this.status,
        },
      });
    }
    else{
      this.userRoleGlobal.permissionCheck();
    }
  }
  onclose() {
    this.dialogbox.close();
  }
  ngOnInit(): void { }
}
