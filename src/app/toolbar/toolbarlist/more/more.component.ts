import { Component, OnInit, Inject } from "@angular/core";
import { CreateToobarComponent } from "../create-toobar/create-toobar.component";
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { ManageTagComponent } from "../manage-tag/manage-tag.component";
import { MoreInformationComponent } from "../more-information/more-information.component";
import { ToolbarlistService } from "../../services/toolbarlist.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { MorecomponemtComponent } from "src/app/formbuilder/formlist/morecomponemt/morecomponemt.component";
import { RenametoolbarhiddenComponent } from "src/app/projects/hidden/renametoolbarhidden/renametoolbarhidden.component";
import { ManagehiddentoolbartagComponent } from "src/app/projects/hidden/managehiddentoolbartag/managehiddentoolbartag.component";

@Component({
  selector: "app-more",
  templateUrl: "./more.component.html",
  styleUrls: ["./more.component.css"],
})
export class MoreComponent implements OnInit {
  projectId: string;
  toolbarName: string;
  createdDate: string;
  modifiedDate: string;
  toolbarId: string;
  toolbarTagList: string[];
  toolbar_id1: string;
  s: boolean;
  data1: any;
  checkinTemp: any;
  constructor(
    private dialogRef: MatDialogRef<MoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public toolbarService: ToolbarlistService,
    public router: Router,
    private datePipe: DatePipe
  ) {
    this.toolbar_id1 = this.data.toolbar_id1;
    var receiveData = this.data;

    this.toolbarId = receiveData.toolbarId;
    this.getToolbarTagList(this.toolbarId);
    this.projectId = receiveData.projectId;
    this.toolbarName = receiveData.toolbarName;
    this.createdDate = receiveData.createdDate;
    this.modifiedDate = receiveData.modifiedDate;

    this.toolbarService.listen().subscribe((m) => {
      this.getToolbarTagList(this.toolbarId);
    });
  }

  ngOnInit(): void {}

  getToolbarTagList(toolbarId) {
    this.toolbarService.toolbarTag(toolbarId).subscribe((res) => {
      this.toolbarTagList = res["response_body"]["toolbar_tags"];
    });
  }

  gotoRenameBox() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(RenametoolbarhiddenComponent, {
      width: "380px",
      data: {
        renameaccess: true,
        toolbarId: this.toolbarId,
        toolbarName: this.toolbarName,
      },
    });
    this.dialogRef.close();
  }

  goToManageTags() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(ManagehiddentoolbartagComponent, {
      width: "380px",
      data: {
        projectId: this.projectId,
        toolbarId: this.toolbarId,
        toolbarTagList: this.toolbarTagList,
      },
    });
    this.dialogRef.close();
  }

  goToMoreInformation() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(MoreInformationComponent, {
      width: "380px",
      data: {
        toolbarId: this.toolbarId,
        toolbarName: this.toolbarName,
        createdDate: this.createdDate,
        modifiedDate: this.modifiedDate,
        toolbarTagList: this.toolbarTagList,
      },
    });
    this.dialogRef.close();
  }

  closeBox() {
    this.dialogRef.close();
  }

  gotoToolbarDesign() {
    this.router.navigate(["/toolbar/toolbardesign"], {
      queryParams: {
        project_id: this.projectId,
        toolbarName: this.toolbarName,
        toolbarId: this.toolbarId,
      },
    });
    this.dialogRef.close();
  }

  Unhide() {
    this.toolbarService.unhide(this.toolbarId).subscribe((res) => {
      this.dialog.closeAll();

      this.toolbarService.filter("Register click");
    });
  }
}
