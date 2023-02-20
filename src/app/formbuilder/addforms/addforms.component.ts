import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CreateformsComponent } from './createforms/createforms.component';
import { FormlistService } from '../services/formlist.service';
import { ValueService } from 'src/app/value.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatService } from 'src/app/dat.service';
import { Router } from '@angular/router';
import { GlobalUserRoleService } from 'src/app/global-user-role.service';

@Component({
  selector: 'app-addforms',
  templateUrl: './addforms.component.html',
  styleUrls: ['./addforms.component.css']
})
export class AddformsComponent implements OnInit {
  projectid: string;
  show: boolean;
  listData: any;
  hide: boolean;
  callback: any;
  userrole: string;
  constructor(private dialog: MatDialogRef<CreateformsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService, public dialogbox: MatDialogRef<CreateformsComponent>, public dialog1: MatDialog,
    public sendData: ValueService, public service3: DatService, private router: Router,public userRoleGlobal:GlobalUserRoleService) {
    this.projectid = this.data.projectId
  
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
  }

  displayedColumns: string[] = ["Name", "Created", "LastModified", "dot", "dot1"]
  Createforms() {
    this.dialog.close();
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = '100%';
    let dialogRef = this.dialog1.open(CreateformsComponent, {
      panelClass: 'my-class',
      data: {
        projectid: this.projectid
      }
    });
  }
  click() {

    this.show = false
    this.service.filter('Register click');
  }
  applyFilter() {
    this.dialogbox.close();
    this.router.navigate(["/formbuilder/duplicate"])

  }
  import() {
    this.router.navigate(['formbuilder/import-form'], { queryParams: { projectId: this.projectid } });
    this.dialogbox.close();
  }
  ngOnInit(): void {
  }
  onclose() {
    this.dialog.close();
  }
}
