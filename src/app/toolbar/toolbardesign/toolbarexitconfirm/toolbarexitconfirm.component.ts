import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExitconfirmComponent } from 'src/app/formbuilder/exitconfirm/exitconfirm.component';

@Component({
  selector: 'app-toolbarexitconfirm',
  templateUrl: './toolbarexitconfirm.component.html',
  styleUrls: ['./toolbarexitconfirm.component.css']
})
export class ToolbarexitconfirmComponent implements OnInit {

  supportpageaccess: boolean = false;

  constructor(public router: Router, public dialog: MatDialogRef<ExitconfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.supportpageaccess = data.supportPageData;
  }

  ngOnInit(): void {
  }
  confirm() {
    if (this.supportpageaccess == true) {
      let pageSupportData = { accessvalid: true ,publish:true};
      this.dialog.close(pageSupportData);
    }
    else {
      let exitpage = {publish:true};
      this.dialog.close(exitpage);
    }


  }
  onClose() {
    this.dialog.close();
  }

  cancel(){
    let exitpage = {accessvalid: true,publish:false};
    this.dialog.close(exitpage);
  }
}
