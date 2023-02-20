import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { GlobalUserRoleService } from 'src/app/global-user-role.service';
import { EditPermissionPopupComponent } from '../edit-permission-popup/edit-permission-popup.component';
import { ManageUserComponent } from '../manage-user/manage-user.component';

@Component({
  selector: 'app-manage-user-init',
  templateUrl: './manage-user-init.component.html',
  styleUrls: ['./manage-user-init.component.css']
})
export class ManageUserInitComponent implements OnInit {
  project = this.encrptdecrpt.getItem("projectName");
  projectid = this.encrptdecrpt.getItem("projectIdlocal");
  date2 = this.encrptdecrpt.getItem("project_cdate");
  date1 = this.encrptdecrpt.getItem("project_mdate");
  status = this.encrptdecrpt.getItem("project_status");
  userrole: any = "";
  constructor(
    private router: Router,
    public dialog1: MatDialog,
    public userRoleGlobal: GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    this.project = this.encrptdecrpt.getItem("projectName");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(projectid);
  }

  ngOnInit(): void {
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
      if (this.userrole == "admin") {
        var pstatus = Number(this.status)
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
            status: pstatus,
          },
        }).afterClosed().subscribe((data) => {
          this.router.navigate(["projectsection/mainproject"], {
            queryParams: { project_id: this.projectid, project_name: this.project },
          });
        });
      }
      else {
        const dialgoConfig = new MatDialogConfig();
        dialgoConfig.disableClose = true;
        dialgoConfig.autoFocus = true;
        dialgoConfig.width = "100%";
        let dialogRef = this.dialog1.open(EditPermissionPopupComponent, {
        }).afterClosed().subscribe((data) => {
          this.router.navigate(["projectsection/mainproject"], {
            queryParams: { project_id: this.projectid, project_name: this.project },
          });
        });
  
      }
    })
    
  }

}
