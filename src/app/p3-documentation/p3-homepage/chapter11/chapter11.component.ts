import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImgDialogComponent } from '../../img-dialog/img-dialog.component';

@Component({
  selector: 'app-chapter11',
  templateUrl: './chapter11.component.html',
  styleUrls: ['./chapter11.component.css']
})
export class Chapter11Component implements OnInit {

  lastModifiedDate: string="";

  constructor(public dialogBox:MatDialog) { }

  ngOnInit(): void {
    this.lastModifiedDate = document.lastModified;
  }
  openImage(title,e){
    console.log(title);
    console.log(e);
    const myDialog = new MatDialogConfig();
    let dialogref=this.dialogBox.open(ImgDialogComponent,{
      panelClass: "class",
      data:{
        title:title,
        e:e
      }
    })
  }
}
