import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedService } from "src/app/shared/shared.service";

@Component({
  selector: "app-optiondelete",
  templateUrl: "./optiondelete.component.html",
  styleUrls: ["./optiondelete.component.css"],
})
export class OptiondeleteComponent implements OnInit {
  item: boolean;
  constructor(
    private dialog: MatDialogRef<OptiondeleteComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void { }

  removeField() {
    this.item = true;
    this.dialog.close({ data: this.item })
  }

  onClose() {
    this.dialog.close();
  }
}
