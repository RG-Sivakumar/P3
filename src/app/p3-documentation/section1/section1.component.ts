import { AfterViewInit, Component, Injectable, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImgDialogComponent } from '../img-dialog/img-dialog.component';
import * as moment from "moment";
import { DatePipe } from "@angular/common";


@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html',
  styleUrls: ['./section1.component.css']
})

@Injectable()
export class Section1Component implements OnInit, AfterViewInit {

  lastModifiedDate: any = "";
  currentMenuId = "item-1-1";

  constructor(private router: Router, public dialog: MatDialog, private datePipe: DatePipe) { }

  ngOnInit(): void {
    let updateDate = document.lastModified;
    updateDate = new Date(updateDate).toISOString();
    let convertDate = this.datePipe.transform(updateDate, "MM/dd/yyyy HH:mm:ss");
    this.lastModifiedDate = convertDate;
  }

  ngAfterViewInit(): void {

  }

  openImage(title, e) {
    console.log(title);
    console.log(e);
    const myDialog = new MatDialogConfig();
    let dialogref = this.dialog.open(ImgDialogComponent, {
      panelClass: "class",
      maxWidth: "700px",
      data: {
        title: title,
        e: e
      }
    });
  }

  goPickedchapterSidebar(event, chapter, section, target) {
    event.preventDefault();
    let routeItem = '/p3/userguide/' + chapter;
    console.log(routeItem);
    this.router.navigate([routeItem], { queryParams: { id: section, target: target } });
  }
  openImage1(title, e) {
    console.log(title);
    console.log(e);
    const myDialog = new MatDialogConfig();
    let dialogref = this.dialog.open(ImgDialogComponent, {
      panelClass: "class",
      data: {
        title: title,
        e: e,
        widthValue: ""
      }
    })
  }


}
