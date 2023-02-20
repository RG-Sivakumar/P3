import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { debug } from 'console';
import { EncryptDecryptService } from './commonshared/services/encrypt-decrypt.service';
import { EditPermissionPopupComponent } from './project-dashboard/edit-permission-popup/edit-permission-popup.component';
import { ProjectlistService } from "./project-dashboard/my-project/services/projectlist.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalUserRoleService {

  public userRol: string = "admin";
  userrole: string = "";
  disableMode:boolean=false;

  constructor(private dialogBox: MatDialog,private service: ProjectlistService,
    private encrptdecrpt:EncryptDecryptService) {
   }


  findUserRole(projectList, projectId) {
    let currentProject = projectList.filter((ele => ele.project_id == projectId));
    if(currentProject.length>0){
      if (currentProject[0].admin_permission_flag == true) {
        this.userRol = "admin";
      }
      else if (currentProject[0].edit_permission_flag == true) {
        this.userRol = "edit";
      }
      else if (currentProject[0].view_permission_flag == true) {
        this.userRol = "view";
      }
      else if(currentProject[0].view_permission_flag == false && currentProject[0].edit_permission_flag == false
        && currentProject[0].admin_permission_flag == false){
          this.userRol = "view";
      }
      this.encrptdecrpt.setItem("userrole",projectId + "||" + this.userRol);//security
    }
    // localStorage.setItem("userrole", projectId + "||" + this.userRol);
    
  }

  permissionCheck() {
    this.dialogBox.closeAll();
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialogBox.open(EditPermissionPopupComponent, {
    });
  }

  getProjectUserRole(projectId) {
    this.service.getprojectuserpermission(projectId).subscribe((res) => {
      var view_flag = res["response_body"]["view_permission_flag"]
      var edit_flag = res["response_body"]["edit_permission_flag"]
      var admin_flag = res["response_body"]["admin_permission_flag"]
      if (admin_flag == true) {
        this.userRol = "admin";
      }
      else if (edit_flag == true) {
        this.userRol = "edit";
      }
      else if (view_flag == true) {
        this.userRol = "view";
      }
      else if (view_flag == false && edit_flag == false && admin_flag == false) {
        this.userRol = "view";
      }

      // localStorage.setItem("userrole", projectId + "||" + this.userRol);
      this.encrptdecrpt.setItem("userrole",projectId + "||" + this.userRol);//security
      console.log("saved role")
    });
    //return ""
    return this.userRol;
  }

  async getProjectUserRolewait(projectId) {
    let result_promise = await this.service.getprojectuserpermission(projectId).toPromise();
    if(result_promise != undefined && result_promise != null && result_promise["response_code"]==200){
      var view_flag = result_promise["response_body"]["view_permission_flag"]
      var edit_flag = result_promise["response_body"]["edit_permission_flag"]
      var admin_flag = result_promise["response_body"]["admin_permission_flag"]
      if (admin_flag == true) {
        this.userRol = "admin";
      }
      else if (edit_flag == true) {
        this.userRol = "edit";
      }
      else if (view_flag == true) {
        this.userRol = "view";
      }
      else if (view_flag == false && edit_flag == false && admin_flag == false) {
        this.userRol = "view";
      }
      this.encrptdecrpt.setItem("userrole",projectId + "||" + this.userRol);//security
      console.log("saved role");
      return this.userRol;
    }
    else{
      return this.userRol;
    }
  }

  
  async findUserProjectRole(projectid) {
    //User level management 
    if (this.encrptdecrpt.getItem("userrole") != null) {
      if (this.encrptdecrpt.getItem("userrole").includes("||")) {

        let storageRoleData = this.encrptdecrpt.getItem('userrole').split("||")
        if (projectid == storageRoleData[0]) {
          this.userRol = storageRoleData[1];
          return this.userRol;
        } else {
          // Seems user with back button has come into a different project when compared to the one set on the local storage
          // this.userRol = this.getProjectUserRole(projectid)
          let result_promise = await this.service.getprojectuserpermission(projectid).toPromise();
          if(result_promise != undefined && result_promise != null && result_promise["response_code"]==200){
            var view_flag = result_promise["response_body"]["view_permission_flag"]
            var edit_flag = result_promise["response_body"]["edit_permission_flag"]
            var admin_flag = result_promise["response_body"]["admin_permission_flag"]
            if (admin_flag == true) {
              this.userRol = "admin";
            }
            else if (edit_flag == true) {
              this.userRol = "edit";
            }
            else if (view_flag == true) {
              this.userRol = "view";
            }
            else if (view_flag == false && edit_flag == false && admin_flag == false) {
              this.userRol = "view";
            }
            this.encrptdecrpt.setItem("userrole",projectid + "||" + this.userRol);//security
            console.log("saved role");
            return this.userRol;
          }
          else{
            return this.userRol;
          }
        }
      }
      else {
        // Seems user with back button has come into a different project when compared to the one set on the local storage
        // this.userRol = this.getProjectUserRole(projectid)
        let result_promise = await this.service.getprojectuserpermission(projectid).toPromise();
        if (result_promise != undefined && result_promise != null && result_promise["response_code"]==200) {
          var view_flag = result_promise["response_body"]["view_permission_flag"]
          var edit_flag = result_promise["response_body"]["edit_permission_flag"]
          var admin_flag = result_promise["response_body"]["admin_permission_flag"]
          if (admin_flag == true) {
            this.userRol = "admin";
          }
          else if (edit_flag == true) {
            this.userRol = "edit";
          }
          else if (view_flag == true) {
            this.userRol = "view";
          }
          else if (view_flag == false && edit_flag == false && admin_flag == false) {
            this.userRol = "view";
          }
          this.encrptdecrpt.setItem("userrole", projectid + "||" + this.userRol);//security
          console.log("saved role");
          return this.userRol;
        }
        else {
          return this.userRol;
        }
      }
    }
    else {
      // this.userRol = this.getProjectUserRole(projectid)
      let result_promise = await this.service.getprojectuserpermission(projectid).toPromise();
      if (result_promise != undefined && result_promise != null && result_promise["response_code"]==200) {
        var view_flag = result_promise["response_body"]["view_permission_flag"]
        var edit_flag = result_promise["response_body"]["edit_permission_flag"]
        var admin_flag = result_promise["response_body"]["admin_permission_flag"]
        if (admin_flag == true) {
          this.userRol = "admin";
        }
        else if (edit_flag == true) {
          this.userRol = "edit";
        }
        else if (view_flag == true) {
          this.userRol = "view";
        }
        else if (view_flag == false && edit_flag == false && admin_flag == false) {
          this.userRol = "view";
        }
        this.encrptdecrpt.setItem("userrole", projectid + "||" + this.userRol);//security
        console.log("saved role");
        return this.userRol;
      }
      else {
        return this.userRol;
      }
    }
    // return this.userRol;
  }

}
