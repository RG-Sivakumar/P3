import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import moment from "moment";
import { ToolbarlistService } from "../../services/toolbarlist.service";


@Component({
  selector: "app-more-information",
  templateUrl: "./more-information.component.html",
  styleUrls: ["./more-information.component.css"],
})
export class MoreInformationComponent implements OnInit {
  toolbarId: string;
  toolbarName: string;
  createdDate: any;
  modifiedDate: any;
  toolbarTagList: string[];
  annotationCount: number;
  toolbarlist: any[] = [];
  hidetoolbarlistOrigin:any[] = [];

  constructor(
    private dialogRef: MatDialogRef<MoreInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toolbarService: ToolbarlistService
  ) {
    var receiveData = this.data;
    this.toolbarId = receiveData.toolbarId;
    // this.moreInformationDetails(this.toolbarId);
    this.toolbarName = receiveData.toolbarName;
    // this.createdDate = receiveData.createdDate;
    // this.modifiedDate = receiveData.modifiedDate;
    this.toolbarlist = receiveData.toolbarlist;
    var toolbartags = receiveData.toolbarTagList;
    console.log(this.toolbarlist);

    let findIndex = this.toolbarlist.findIndex((sData)=>sData.toolbar_id==this.toolbarId);
    if(findIndex!=-1){
      let gettoolbarData = this.toolbarlist[findIndex].toolbar_data;
      this.createdDate = moment.utc(this.toolbarlist[findIndex].created_date).toDate();
      this.modifiedDate = moment.utc(this.toolbarlist[findIndex].last_updated_date).toDate();
      let convertJSON = JSON.parse(gettoolbarData);
      if (convertJSON != null) {
        if (convertJSON.length > 0) {
          let tempannotationCount = 0;
          for (let k = 0; k < convertJSON.length; k++) {
            if (convertJSON[k].is_removed != "1" && convertJSON[k].is_removed != 1 && convertJSON[k].is_removed != true && convertJSON[k].is_removed != "true") {
              tempannotationCount = tempannotationCount + 1;
            }
          }
          this.annotationCount = tempannotationCount;
        }
        else {
          this.annotationCount = 0;
        }
      }
      else {
        this.annotationCount = 0;
      }
    }
    // for (let i = 0; i < this.toolbarlist.length; i++) {
    //   if (this.toolbarId == this.toolbarlist[i].toolbar_id) {
        

    //   }
    // }
    if (toolbartags != undefined) {
      var emptyFilter = toolbartags.filter((data) => {
        return data["toolbar_tag_name"] != "";
      });
      this.toolbarTagList = emptyFilter;
    }
  }

  ngOnInit(): void {

  }

  // moreInformationDetails(toolbarId) {
  //   this.toolbarService.getMoreInformation(toolbarId).subscribe((res) => {
  //     console.log(res);
  //     this.annotationCount = res["response_body"].annotationCount;
  //   });
  // }

  closeBox() {
    this.dialogRef.close();
  }
}
