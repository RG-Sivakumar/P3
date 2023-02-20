import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImgDialogComponent } from '../../img-dialog/img-dialog.component';


@Component({
  selector: 'app-chapter9',
  templateUrl: './chapter9.component.html',
  styleUrls: ['./chapter9.component.css']
})
export class Chapter9Component implements OnInit {
  lastModifiedDate: string="";

  constructor(private router:Router,public dialog:MatDialog) { }

  ngOnInit(): void {
    this.lastModifiedDate = document.lastModified;
  }

  goPickedchapterSidebar(event,chapter,section,target){
    event.preventDefault();
    let routeItem = '/p3/userguide/'+chapter;
    console.log(routeItem);
    this.router.navigate([routeItem],{ queryParams:{id:section,target:target}});
  }

  openImage(title,e){
    console.log(title);
    console.log(e);
    const myDialog = new MatDialogConfig();
    let dialogref=this.dialog.open(ImgDialogComponent,{
      panelClass: "class",
      maxWidth:"700px",
      data:{
        title:title,
        e:e
      }
    });
  }

  openImage1(title,e){
    console.log(title);
    console.log(e);
    const myDialog = new MatDialogConfig();
    let dialogref=this.dialog.open(ImgDialogComponent,{
      panelClass: "class",
      data:{
        title:title,
        e:e,
        widthValue:"700px"
      }
    })
  }
}
