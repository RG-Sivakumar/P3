
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MoreoptionService } from "../services/moreoption.service";
import * as moment from "moment";

@Component({
  selector: "app-more-information",
  templateUrl: "./more-information.component.html",
  styleUrls: ["./more-information.component.css"],
})
export class MoreInformationComponent implements OnInit {
  folderId: string;
  foldertaglist: string[];
  folderName: string;
  createdDate: any;
  modifiedDate: any;
  folderInformation: string;
  subFolderCount: number = 0;
  documentCount: number = 0;
  annotationCount: number = 0;
  imageCount: number = 0;
  linksCount: number = 0;
  docOnly: boolean = true;
  getAlltaglist: any;

  constructor(
    private dialogclose: MatDialogRef<MoreInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private moreoptionservice: MoreoptionService
  ) {
    var receiveData = this.data;
    this.folderId = receiveData.folderId;
    this.getAlltaglist = receiveData.getAlltaglist;
    this.getFoldermetrices(this.folderId);
    if (this.getAlltaglist != undefined && this.getAlltaglist.length > 0) {
      console.log(this.getAlltaglist);
      let filterTags = this.getAlltaglist.filter((data) => {
        return data.folder_id == this.folderId
      });
      this.foldertaglist = filterTags.length > 0 ? filterTags : [];
    }
    else {
      this.foldertaglist = [];
    }
    this.folderName = receiveData.folderName;
    
    // this.createdDate = receiveData.createdDate;
    // this.modifiedDate = receiveData.modifiedDate;

    this.docOnly = receiveData.docOnly;
  }

  ngOnInit(): void { }

  getFoldermetrices(folderId) {
    this.moreoptionservice.getFolderMetricesDetails(folderId).subscribe((res) => {
      console.log(res);
      this.folderInformation = res["response_body"];
      this.documentCount = res["response_body"].document_count;
      this.annotationCount = res["response_body"].annotation_count;
      this.linksCount = res["response_body"].linkCount;
      this.imageCount = res["response_body"].mediaCount;
      this.subFolderCount = res["response_body"].sub_folder_count;
      let createdconvertDate = moment.utc(res["response_body"]["folder_info"].created_date).toDate();
      let updatedconvertDate = moment.utc(res["response_body"]["folder_info"].last_updated_date).toDate(); 
      this.createdDate = createdconvertDate;
      this.modifiedDate = updatedconvertDate;
    });
  }

  closeBox() {
    this.dialogclose.close();
  }
}
