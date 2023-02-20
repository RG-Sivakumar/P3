import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToolbarlistService } from "src/app/toolbar/services/toolbarlist.service";

@Component({
  selector: "app-managehiddentoolbartag",
  templateUrl: "./managehiddentoolbartag.component.html",
  styleUrls: ["./managehiddentoolbartag.component.css"],
})
export class ManagehiddentoolbartagComponent implements OnInit {
  projectId: string;
  toolbarId: string;
  toolbarTagNames: any;
  toolbarTagList: string[];
  loader: boolean = false;

  constructor(
    private dialogclose: MatDialogRef<ManagehiddentoolbartagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toolbarService: ToolbarlistService
  ) {
    var receiveData = this.data;
    this.projectId = receiveData.projectId;
    this.toolbarId = receiveData.toolbarId;
    this.toolbarTagList = receiveData.toolbarTagList;
  }

  ngOnInit(): void {}

  addTags(tag_name) {
    this.loader = true;

    this.toolbarService
      .addTagname(this.projectId, this.toolbarId, tag_name)
      .subscribe((res) => {
        this.loader = false;
        this.toolbarTagNames = "";

        this.toolbarTagList = res["response_body"]["toolbar_tags"];
      });
  }

  removeTag(toolbartagId) {
    this.toolbarTagList = this.toolbarTagList.filter((item) => {
      return item["toolbar_tag_id"] !== toolbartagId;
    });

    this.toolbarService
      .removeClickTag(this.toolbarId, toolbartagId)
      .subscribe((res) => {});
  }

  closeBox() {
    this.dialogclose.close();
  }
}
