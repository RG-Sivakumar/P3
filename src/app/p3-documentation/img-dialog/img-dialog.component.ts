import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-img-dialog',
  templateUrl: './img-dialog.component.html',
  styleUrls: ['./img-dialog.component.css']
})
export class ImgDialogComponent implements OnInit {
title:string;
widthValue:string="660px";
  constructor(public dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) {
  console.log(this.data.title);
  if(this.data.widthValue!=undefined){
    this.widthValue = this.data.widthValue;
  }
  }

  ngOnInit(): void {
  }
close(){
  this.dialog.closeAll();
}
}
