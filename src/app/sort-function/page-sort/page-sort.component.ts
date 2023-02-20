import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { truncate } from 'lodash';
import { DataService } from 'src/app/data.service';
import { EventGlobalService } from 'src/app/event-global.service';

@Component({
  selector: 'app-page-sort',
  templateUrl: './page-sort.component.html',
  styleUrls: ['./page-sort.component.css']
})
export class PageSortComponent implements OnInit {

  ascendingPage: boolean = true;
  descendingPage: boolean = true;
  ascendingPageNumber: boolean = true;
  descendingPageNumber: boolean = true;
  sortPageValue:string="";

  constructor(private dialogRef:MatDialogRef<PageSortComponent>,private sendData:DataService,private eventsService:EventGlobalService,
    @Inject(MAT_DIALOG_DATA) public data:any) { 
      this.sortPageValue = this.data.sortPageValue;
      console.log(this.sortPageValue);
      if(this.sortPageValue==""){
        console.log('empty');
        this.sortPageValue="ascendingPage";
      }
      this.activeMethod(this.sortPageValue);
  }

  ngOnInit(): void {
  }

  ascendingSort() {
    this.activeMethod('ascendingPage');
    this.sendData.changePageSort.emit("ascendingPage");
    this.closeBox();
  }
  descendingSort() {
    this.activeMethod('descendingPage');
    this.sendData.changePageSort.emit("descendingPage");
    this.closeBox();
  }
  dateCreatedOldToRecent() {
    this.activeMethod('ascendingPageNumber');
    this.sendData.changePageSort.emit("ascendingPageNumber");
    // this.eventsService.broadcast("sortChange", "datecreatedOldToRecent");
    this.closeBox();
  }
  dateCreatedRecentToOld() {
    this.activeMethod('descendingPageNumber');
    this.sendData.changePageSort.emit("descendingPageNumber");
    // this.eventsService.broadcast("sortChange", "datecreatedRecentToOld");
    this.closeBox();
  }

  activeMethod(value){
    if (value == "ascendingPage") {
      this.ascendingPage = false;
      this.descendingPage = true;
      this.ascendingPageNumber = true;
      this.descendingPageNumber = true;
    } else if (value == "descendingPage") {
      this.descendingPage = false;
      this.ascendingPage = true;
      this.ascendingPageNumber = true;
      this.descendingPageNumber = true;
    } else if (value == "ascendingPageNumber") {
      this.ascendingPage = true;
      this.descendingPage = true;
      this.ascendingPageNumber = false;
      this.descendingPageNumber = true;
    } else if (value == "descendingPageNumber") {
      this.descendingPageNumber = false;
      this.ascendingPage = true;
      this.descendingPage = true;
      this.ascendingPageNumber = true;
    } 
  }

  closeBox(){
    this.dialogRef.close();
  }

}
