import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { ImgDialogComponent } from '../../img-dialog/img-dialog.component';

@Component({
  selector: 'app-chapter5',
  templateUrl: './chapter5.component.html',
  styleUrls: ['./chapter5.component.css']
})
export class Chapter5Component implements OnInit {

  lastModifiedDate: string = "";
  currentSection = 'section-1';

  constructor(private router:Router,private dataService:DataService,private dialogBox:MatDialog) { 
    this.lastModifiedDate = document.lastModified;
  }

  ngOnInit(): void {
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
      data:{
        title:title,
        e:e
      }
    })
  }



  // onSectionChange(sectionId: string) {
  //   this.currentSection = sectionId;
  //   console.log(sectionId);
  // }

}
