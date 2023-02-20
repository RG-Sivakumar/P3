import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MenucomponentComponent } from 'src/app/formbuilder/formlist/menucomponent/menucomponent.component';
import { FormlistService } from 'src/app/formbuilder/services/formlist.service';
import { Router } from '@angular/router';
import { ManageformComponent } from 'src/app/formbuilder/manageform/manageform.component';
import { MoreinformationComponent } from 'src/app/formbuilder/moreinformation/moreinformation.component';
import { RenameComponent } from 'src/app/formbuilder/rename/rename.component';
import { GlobalUserRoleService } from 'src/app/global-user-role.service';

@Component({
  selector: 'app-forms-more-popup',
  templateUrl: './forms-more-popup.component.html',
  styleUrls: ['./forms-more-popup.component.css']
})
export class FormsMorePopupComponent implements OnInit {

  formname: string;
  date1: string;
  date2: string;
  formid: string;
  taglist: string[];
  projectid: string;
  hidden: boolean;
  list: any;
  formfield: number;
  userrole: any;
  constructor(
    private dialog: MatDialogRef<MenucomponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService,
    public dialogbox: MatDialogRef<MenucomponentComponent>,
    public dialog1: MatDialog,
    public router: Router,
    public userRoleGlobal:GlobalUserRoleService
  ) {
    this.formfield = this.data.formfield;
    this.formname = this.data.formname;
    this.date1 = this.data.date1;
    this.date2 = this.data.date2;
    this.formid = this.data.formid;
    this.projectid = this.data.projectid;
    this.hidden = this.data.hidden;
    this.list = this.data.listData;
    console.log(this.list);
    // this.service.getformlist().subscribe((data) => {
    //   this.list = data["response_body"]["form_listing"];
    // });
    this.service.gettag(this.formid).subscribe((data) => {
      this.taglist = data["response_body"]["form_tags"];
    });
    // this.userrole = this.userRoleGlobal.findUserProjectRole( this.projectid);
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
    this.dialog.close();
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog1.open(MoreinformationComponent, {
      // width: "380px",
      // panelClass: "my-class",
      // data: {
      //   formid: this.formid,
      //   formName: this.formname,
      //   createdDate: this.date1,
      //   modifiedDate: this.date2,
      //   formfield: this.formfield,
      //   taglist: this.taglist,
      // },
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
  hide() {
    this.service.hide(this.formid, true).subscribe((data) => {
      this.dialogbox.close();

      this.service.filter("Register click");
    });
  }
  unhide() {
    this.service.loaderActivated.emit(true);
    this.service.unhide(this.formid).subscribe((data) => {
      this.dialogbox.close();
      this.service.filter("Register click");
    });
  }
  edit() {
    this.router.navigate(["formbuilder/formEdit"], {
      queryParams: { Form_id: this.formid, Form_name: this.formname },
    });
    this.dialog.close();
  }

  onclose() {
    this.dialogbox.close();
  }

  ngOnInit(): void {
  }

}
