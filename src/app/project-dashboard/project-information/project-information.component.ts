import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProjectlistService } from "../my-project/services/projectlist.service";
import * as moment from "moment";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-project-information",
  templateUrl: "./project-information.component.html",
  styleUrls: ["./project-information.component.css"],
})
export class ProjectInformationComponent implements OnInit {
  projectid: string;
  projectdetail: string[];
  date1: any;
  date2: any;
  projectname: string;
  tag: string[];
  folderCount: number;
  documentCount: number;
  annotationCount: number;
  toolbarCount: number;
  formCount: number;
  constructor(
    public dialogbox: MatDialogRef<ProjectInformationComponent>,
    public dialog: MatDialogRef<ProjectInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: ProjectlistService,
    public dataService:DataService
  ) {
    this.projectid = this.data.projectid;
    this.service.projectinfo(this.projectid).subscribe((data) => {
      console.log(data);
      this.projectname = data["response_body"]["project_info"].project_name;
      this.projectname = this.dataService.changeSpecialtoKeyFormat(this.projectname);
      let createdconvertDate = moment.utc(data["response_body"]["project_info"].created_date).toDate();
      let updatedconvertDate = moment.utc(data["response_body"]["project_info"].last_updated_date).toDate();
      this.date1 = createdconvertDate;
      this.date2 = updatedconvertDate;
      console.log(createdconvertDate,updatedconvertDate);
      var projectTags = data["response_body"]["tag_info"].project_tag_name;
      if (projectTags != null && projectTags != undefined) {
        projectTags = this.dataService.changeSpecialtoKeyFormat(projectTags);
        var commaFilter = projectTags.split(",");
        var tagsplit = commaFilter.filter((data) => {
          return data != "";
        });
        this.tag = tagsplit;
      }
      this.folderCount = data["response_body"].folderCount;
      console.log(this.folderCount);
      this.documentCount = data["response_body"].documentCount;
      this.annotationCount = data["response_body"].annotationCount;
      this.toolbarCount = data["response_body"].tolbarCount;
      this.formCount = data["response_body"].formCount;
    });
  }

  ngOnInit(): void {}
  onClose() {
    this.dialogbox.close();
  }
}
