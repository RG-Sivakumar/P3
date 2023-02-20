import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImgDialogComponent } from '../../img-dialog/img-dialog.component';

@Component({
  selector: 'app-chapter8',
  templateUrl: './chapter8.component.html',
  styleUrls: ['./chapter8.component.css']
})
export class Chapter8Component implements OnInit {
  lastModifiedDate: string="";

  constructor(private router:Router,public dialogBox:MatDialog) { }

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
        e:e,
        widthValue:"700px"
      }
    })
  }
  goPickedchapterSidebar(event,chapter,section,target){
    event.preventDefault();
    let routeItem = '/p3/userguide/'+chapter;
    console.log(routeItem);
    this.router.navigate([routeItem],{ queryParams:{id:section,target:target}});
  }
}
