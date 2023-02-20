import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exitconfirm',
  templateUrl: './exitconfirm.component.html',
  styleUrls: ['./exitconfirm.component.css']
})
export class ExitconfirmComponent implements OnInit {

  supportpageaccess:boolean=false;

  constructor(public router: Router, public dialog: MatDialogRef<ExitconfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.supportpageaccess=data.supportPageData;
  }

  ngOnInit(): void {
  }
  confirm() {
    if(this.supportpageaccess==true){
      let pageSupportData = {accessvalid:true ,publish:true};
      this.dialog.close(pageSupportData);
    }
    else{
      let exitpage = {publish:true};
      this.dialog.close(exitpage);
    }
  }
  onClose() {
    this.dialog.close();
  }

  cancel(){
    let exitpage = {accessvalid:true,publish:false};
    this.dialog.close(exitpage);
  }
}
