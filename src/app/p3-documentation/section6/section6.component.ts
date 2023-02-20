import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { ImgDialogComponent } from '../img-dialog/img-dialog.component';

@Component({
  selector: 'app-section6',
  templateUrl: './section6.component.html',
  styleUrls: ['./section6.component.css']
})
export class Section6Component implements OnInit {
  lastModifiedDate: string="";

  constructor(private router:Router,private dataService:DataService,public dialogBox:MatDialog) { }

  ngOnInit(): void {
    this.lastModifiedDate = document.lastModified;
  }

  goPickedchapterSidebar(event,chapter,section,target){
    event.preventDefault();
    let routeItem = '/p3/userguide/'+chapter;
    console.log(routeItem);
    this.router.navigate([routeItem],{ queryParams:{id:section,target:target}});
  }

  activeVistionSend(section,id){
    let value = {section:section,id:id} 
    this.dataService.activeVisitionSend.emit(value);
  }
  openImage(title,e){
    console.log(title);
    console.log(e);
    const myDialog = new MatDialogConfig();
    let dialogref=this.dialogBox.open(ImgDialogComponent,{
      panelClass: "class",
      maxWidth:"700px",
      data:{
        title:title,
        e:e,
        widthValue:"700px"
      }
    })
  }

}
