import { Component, OnInit, Inject } from "@angular/core";
import { ToolbarlistService } from "src/app/toolbar/services/toolbarlist.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-renametoolbarhidden",
  templateUrl: "./renametoolbarhidden.component.html",
  styleUrls: ["./renametoolbarhidden.component.css"],
})
export class RenametoolbarhiddenComponent implements OnInit {
  projectId: string;
  toolbarName: string;
  addRename: boolean = false;
  newToolbarAdd: boolean = false;
  toolbarId: string;
  show: boolean = false;
  constructor(
    private toolbarService: ToolbarlistService,
    private dialog: MatDialogRef<RenametoolbarhiddenComponent>,private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    var receiveData = this.data;
    this.toolbarId = receiveData.toolbarId;
    this.toolbarName = receiveData.toolbarName;
    this.addRename = receiveData.renameaccess;
    this.newToolbarAdd = receiveData.newToolbarAdd;
  }

  ngOnInit(): void {
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
  }

  renameAuc(toolbar_name) {
    this.toolbarService
      .renametoolbarName(this.toolbarId, toolbar_name)
      .subscribe((res) => {
        this.toolbarService.filter("Register click");
      });
    this.dialog.close();
  }

  closeBox() {
    this.dialog.close();
  }
}
