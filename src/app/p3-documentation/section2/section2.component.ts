import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from 'src/app/data.service';
import { ImgDialogComponent } from '../img-dialog/img-dialog.component';

@Component({
  selector: 'app-section2',
  templateUrl: './section2.component.html',
  styleUrls: ['./section2.component.css']
})
export class Section2Component implements OnInit {
  lastModifiedDate: string = "";
  constructor(private dataService: DataService, public dialog: MatDialog, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.lastModifiedDate = document.lastModified;
    let updateDate = document.lastModified;
    updateDate = new Date(updateDate).toISOString()
    let convertDate = this.datePipe.transform(updateDate, "MM/dd/yyyy HH:mm:ss");
    this.lastModifiedDate = convertDate;
  }


  activeVistionSend(section, id) {
    let value = { section: section, id: id };
    this.dataService.activeVisitionSend.emit(value);
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
