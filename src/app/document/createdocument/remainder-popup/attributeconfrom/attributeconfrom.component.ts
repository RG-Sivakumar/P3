import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attributeconfrom',
  templateUrl: './attributeconfrom.component.html',
  styleUrls: ['./attributeconfrom.component.css']
})
export class AttributeconfromComponent implements OnInit {
  supportpageaccess:boolean=false;
  constructor(public router: Router, public dialog: MatDialogRef<AttributeconfromComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  ngOnInit(): void {
  }
  confirm() {
      let exitpage = {publish:true};
      this.dialog.close(exitpage);
  }
  onClose() {
    this.dialog.close();
  }

  cancel(){
    let exitpage = {accessvalid:true,publish:false};
    this.dialog.close(exitpage);
  }

}
