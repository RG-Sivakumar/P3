import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { RefCountSubscription } from "rxjs/internal/operators/groupBy";
import { DataService } from "src/app/data.service";
import { EventGlobalService } from "src/app/event-global.service";
import { SortFunctionRoutingModule } from "../sort-function-routing.module";

@Component({
  selector: "app-start-sort",
  templateUrl: "./start-sort.component.html",
  styleUrls: ["./start-sort.component.css"],
})
export class StartSortComponent implements OnInit,OnDestroy {
  asC: boolean = true;
  desC: boolean = true;
  dateCrOtoR: boolean = true;
  dateCrRtoO: boolean = true;
  dateMdOtoR: boolean = true;
  dateMdRtoO: boolean = true;
  sortMessage: string;
  message: string;
  callBack: any;
  subscriptionSort:Subscription;

  constructor(
    private dialogbox: MatDialog,
    private dialog: MatDialogRef<StartSortComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sendData: DataService,
    private eventsService: EventGlobalService
  ) {
    var receiveData = this.data;
    this.callBack = receiveData.callBack;
  }

  ngOnInit(): void {
    this.subscriptionSort =this.sendData.currentMessage.subscribe((message) => {
      this.sortMessage = message;
      console.log(this.sortMessage);
      if (this.sortMessage == "ascending") {
        this.asC = false;
      } else if (this.sortMessage == "descending") {
        this.desC = false;
      } else if (this.sortMessage == "datecreatedOldToRecent") {
        this.dateCrOtoR = false;
      } else if (this.sortMessage == "datecreatedRecentToOld") {
        this.dateCrRtoO = false;
      } else if (this.sortMessage == "lastupdatedOldToRecent") {
        this.dateMdOtoR = false;
      } else if (this.sortMessage == "lastupdatedRecentToOld") {
        this.dateMdRtoO = false;
      }
    });
    this.eventsService.on("sortChange", (a) => {
      this.message = a;

      if (this.message == "ascending") {
        this.asC = false;
      } else if (this.message == "descending") {
        this.desC = false;
      } else if (this.message == "datecreatedOldToRecent") {
        this.dateCrOtoR = false;
      } else if (this.message == "datecreatedRecentToOld") {
        this.dateCrRtoO = false;
      } else if (this.message == "lastupdatedOldToRecent") {
        this.dateMdOtoR = false;
      } else if (this.message == "lastupdatedRecentToOld") {
        this.dateMdRtoO = false;
      }
    });
  }

  ascendingSort() {
    this.sendData.changeMessage("ascending");
    this.eventsService.broadcast("sortChange", "ascending");
    this.closeBox();
  }
  descendingSort() {
    this.desC = true;
    this.sendData.changeMessage("descending");
    this.eventsService.broadcast("sortChange", "descending");
    this.closeBox();
  }
  dateCreatedOldToRecent() {
    this.dateCrOtoR = true;
    this.sendData.changeMessage("datecreatedOldToRecent");
    this.eventsService.broadcast("sortChange", "datecreatedOldToRecent");
    this.closeBox();
  }
  dateCreatedRecentToOld() {
    this.closeBox();
    this.sendData.changeMessage("datecreatedRecentToOld");
    this.eventsService.broadcast("sortChange", "datecreatedRecentToOld");
    this.closeBox();
  }
  lastUpdatedOldToRecent() {
    this.dateMdOtoR = true;
    this.sendData.changeMessage("lastupdatedOldToRecent");
    this.eventsService.broadcast("sortChange", "lastupdatedOldToRecent");
    this.closeBox();
  }

  lastUpdatedRecentToOld() {
    this.dateMdRtoO = true;
    this.sendData.changeMessage("lastupdatedRecentToOld");
    this.eventsService.broadcast("sortChange", "lastupdatedRecentToOld");
    this.closeBox();
  }
  closeBox() {
    this.callBack();
    this.dialog.close();
  }

  ngOnDestroy():void{
    if(this.subscriptionSort!=undefined){
      this.subscriptionSort.unsubscribe();
    }
  }
}
