import { Component, OnInit, Inject } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ProjectlistService } from "../my-project/services/projectlist.service";
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from "@angular/forms";
import { ValueService } from "src/app/value.service";
import { MatIconRegistry } from "@angular/material/icon";
import { SuccessMessageComponent } from "./success-message/success-message.component";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EditPermissionPopupComponent } from "../edit-permission-popup/edit-permission-popup.component";
import { login } from "src/app/projectmanagement/models/login-model";
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-manage-user",
  templateUrl: "./manage-user.component.html",
  styleUrls: ["./manage-user.component.css"],
})
export class ManageUserComponent implements OnInit {
  displayedColumns: string[] = ["Emp", "Name", "plus"];
  searchdefault: string = "";
  projectid: string;
  listData: any;
  taglist: string[];
  project: string;
  date1: string;
  date2: string;
  status: any;
  show = false;
  show1 = false;
  loader: boolean = false;
  novalue: boolean = true;
  displayedColumns1: string[] = [
    "user",
    "View",
    "Edit",
    "Admin",
    "delete",
  ];
  listData1: any;
  ss: string[];
  userrole: string = "";
  su:login;

  constructor(matIconRegistry: MatIconRegistry,
    public dialogbox: MatDialogRef<ManageUserComponent>,
    public dialog: MatDialogRef<ManageUserComponent>,
    private dialogOpen: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: ProjectlistService,
    private service1: ValueService,
    private userRoleGlobal: GlobalUserRoleService,
    private dataService:DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {

    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    this.projectid = this.data.projectid;
    this.status = this.data.status;
    this.project = this.data.project;
    this.date1 = this.data.date1;
    this.date2 = this.data.date2;
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    console.log(this.userrole)
    this.show1 = true;
    this.service.getTag(this.projectid).subscribe((data) => {
      this.show1 = false;
      var response_message = data["response_message"];

      this.taglist = data["response_body"]["Project_tags"];
    });
    this.service.listen().subscribe((m: any) => {
      this.table1();
      this.service.GetUser(this.projectid).subscribe((data) => {
        this.listData1 = new MatTableDataSource(

          data["response_body"]["userslist"]
        );
        console.log(this.listData1);
      });
    });
  }

  search(search_keyword) {
    this.show = true;
    this.service.searchUser(search_keyword.value).subscribe((data) => {
      console.log(data);
      let getresponse_special_character = data["response_body"]["Users"];
      if(data["response_body"]["Users"].length>0){
        let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character,'userlist');
        console.log(change_character_list);
        data["response_body"]["Users"] = change_character_list;
      }
      var response_code = data["response_code"];
      this.show = true;
      if (response_code == "200") {
        this.show = false;
        this.listData = new MatTableDataSource(data["response_body"]["Users"]);
      }
      if (response_code == "201") {
        this.show = false;
      }
    });
  }
  Adduser(userid) {
    this.service
      .AddUser(this.projectid, this.status, userid)
      .subscribe((data) => {
        this.table1();
      });
  }
  permission(event, userid, view, edit, admin) {
    // console.log(event);
    // if (view == true) {
    //   view = false;

    // } else {
    //   view = true;
    // }
    view = event.target.checked;
    console.log("edit=" + edit + "admin=" + admin + "view=" + view);
    this.service
      .AddPermission(this.projectid, userid, view, edit, admin)
      .subscribe((data) => {
        this.table1();
      });
  }
  permission1(event, userid, view, edit, admin) {
    // if (edit == true) {
    //   edit = false;

    // } else {
    //   edit = true;
    // }
    edit = event.target.checked;
    console.log("edit=" + edit + "admin=" + admin + "view=" + view);
    this.service
      .AddPermission(this.projectid, userid, view, edit, admin)
      .subscribe((data) => {
        this.table1();
      });
  }
  permission2(event, element, userid, permission) {
    console.log('permission');
    if (permission == 'view') {
      element.view_permission_flag = event;
    } else if (permission == 'edit') {

      element.edit_permission_flag = event;
    } else {

      element.admin_permission_flag = event;
    }
    // admin = event.target.checked;
    // console.log("edit=" + edit + "admin=" + admin + "view=" + view);
    this.service
      .AddPermission(this.projectid, userid, element.view_permission_flag, element.edit_permission_flag, element.admin_permission_flag)
      .subscribe((data) => {
        console.log(data);
        // this.table1();
        console.log(element.admin_permission_flag, element.edit_permission_flag)

        if (data["response_code"] != 200) {

          const dialgoConfig = new MatDialogConfig();
          dialgoConfig.disableClose = true;
          dialgoConfig.autoFocus = true;
          dialgoConfig.width = "100%";
          let dialogRef = this.dialogOpen.open(EditPermissionPopupComponent, {
          });
        }
      });
  }
  RemoveUser(userid) {
    
    this.service.RemoveUser(this.projectid, userid).subscribe((data) => {
      this.table1();
    });
  }
  onSubmit(form: NgForm) {
    if (this.userrole != "view") {
      this.loader = true;
      form.value.first_name = this.dataService.changeFormat(form.value.first_name);
      form.value.last_name = this.dataService.changeFormat(form.value.last_name);
      form.value.email_id = this.dataService.changeFormat(form.value.email_id);
      this.service.AddExternalUser(form.value, this.projectid).subscribe((res) => {
        console.log(res);
        this.loader = false;
        const matDialog = new MatDialogConfig();
        matDialog.disableClose = true;
        matDialog.autoFocus = true;
        let dialogRef = this.dialogOpen.open(SuccessMessageComponent, {
          width: "380px",
          data: { response_code: res["response_code"] },
        });
        dialogRef.afterClosed().subscribe((res) => {
          if (res != undefined) {
            if (res.data == true) {
              this.service.formData.first_name = "";
              this.service.formData.last_name = "";
              this.service.formData.email_id = "";
            }
          }
        });
      },
        (error) => {
          // error response so we can send to 500 error code message
          this.loader = false;
          const matDialog = new MatDialogConfig();
          matDialog.disableClose = true;
          matDialog.autoFocus = true;
          let dialogRef = this.dialogOpen.open(SuccessMessageComponent, {
            width: "380px",
            data: { response_code: 500 },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res != undefined) {
              if (res.data == true) {
                this.service.formData.first_name = "";
                this.service.formData.last_name = "";
                this.service.formData.email_id = "";
              }
            }
          });
        }
      );
    }
    else if (this.userrole == 'view') {
      this.userRoleGlobal.permissionCheck();
    }
  }

  ngOnInit() {
    this.table1();
    this.reset();
  }

  onclose() {
    this.dialogbox.close();

    this.service.filter('Register click')


  }

  table1() {
    this.service.GetUser(this.projectid).subscribe((data) => {
      console.log(data);
      let getresponse_special_character = data["response_body"]["userslist"];
      if(data["response_body"]["userslist"].length>0){
        let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character,'userlist');
        console.log(change_character_list);
        data["response_body"]["userslist"] = change_character_list;
      }
      this.listData1 = new MatTableDataSource(data["response_body"]["userslist"]);
      
    });
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.service.formData.first_name = changeUpperCaseProjectName;
    }
  }

  capitalWord(value) {
    this.service.formData.first_name = this.service1.firstLetterCapital(value);
  }

  capitalWord1(value) {
    this.service.formData.last_name = this.service1.firstLetterCapital(value);
  }
  

  addExternalUser() {

  }

  reset() {
    this.service.formData = {
      user_id: 0,
      start_index: 0,
      count: 0,
      project_name: "",
      project_id: "",
      folder_id: "",
      project_tag_name: "",
      project_tag_id: 0,
      search_keyword: "",
      current_user_id: 0,
      is_owner_flag: false,
      first_name: "",
      last_name: "",
      email_id: "",
      status: "",
      view_permission_flag: true,
      edit_permission_flag: true,
      admin_permission_flag: true,
      created_date: "",
      last_updated_date: "",
      sync_version_uuid: "",
      updated_by_userid: ""
    };
  }
}
