import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormlistService } from "src/app/formbuilder/services/formlist.service";

@Component({
  selector: "app-rmcomponent",
  templateUrl: "./rmcomponent.component.html",
  styleUrls: ["./rmcomponent.component.css"],
})
export class RmcomponentComponent implements OnInit {
  formid: string;
  formname: string;
  change: boolean;
  formdefault: string;
  constructor(
    public dialogbox: MatDialogRef<RmcomponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService
  ) {
    this.formid = this.data.formid;
    this.formname = this.data.formname;
  }
  ngOnInit(): void {}
  rename(form_name) {
    this.service.Rename(this.formid, form_name).subscribe((data) => {
      this.dialogbox.close();

      this.service.filter("Register click");
    });
  }
  onclose() {
    this.dialogbox.close();
  }
}
