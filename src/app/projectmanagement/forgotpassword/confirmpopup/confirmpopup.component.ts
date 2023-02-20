import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-confirmpopup",
  templateUrl: "./confirmpopup.component.html",
  styleUrls: ["./confirmpopup.component.css"],
})
export class ConfirmpopupComponent implements OnInit {
  message: any;
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.message = this.data.message;
  }
  closePopup() {
    this.dialog.closeAll();
  }
}
