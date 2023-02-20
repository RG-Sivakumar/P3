import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProjectlistService } from "../my-project/services/projectlist.service";
import { NgForm } from "@angular/forms";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-rename-project",
  templateUrl: "./rename-project.component.html",
  styleUrls: ["./rename-project.component.css"],
})
export class RenameProjectComponent implements OnInit {
  projectid: any;
  project: string;
  namedefault: string;
  formname: string;
  keepTextName: string = "";
  ShowHideProjectList: any[] = [];
  tempprojectname : any ;

  constructor(
    public dialogbox: MatDialogRef<RenameProjectComponent>,
    public dialog: MatDialogRef<RenameProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: ProjectlistService,
    private dataService: DataService
  ) {
    this.tempprojectname = this.data.project;
    this.projectid = this.data.projectid;
    this.project = this.data.project;
    let tempkeepTextName = this.data.project;
    this.ShowHideProjectList = this.data.ShowHideProjectList;
    console.log(this.ShowHideProjectList);
    if (tempkeepTextName != undefined) {
      var rest = tempkeepTextName.substring(0, tempkeepTextName.lastIndexOf("("));
      var last = tempkeepTextName.substring(tempkeepTextName.lastIndexOf("(") + 1, tempkeepTextName.length);
      console.log(rest + "," + rest.length + "," + last);
      if (rest.length == 0) {
        this.keepTextName = this.data.project.trim();
      }
      else {
        this.keepTextName = rest.trim();
      }
    }
    console.log(this.keepTextName);
  }
  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.project = changeUpperCaseProjectName;
    }
  }
  reset() {
    this.service.formData = {
      user_id: 0,
      start_index: 0,
      count: 0,
      project_name: "",
      project_id: "",
      folder_id: "",
      project_tag_name: "",
      project_tag_id: 0,
      search_keyword: "",
      current_user_id: 0,
      is_owner_flag: false,
      first_name: "",
      last_name: "",
      email_id: "",
      status: "",
      view_permission_flag: true,
      edit_permission_flag: true,
      admin_permission_flag: true,
      created_date: "",
      last_updated_date: "",
      sync_version_uuid: "",
      updated_by_userid: "",
    };
  }
  onclose() {
    this.dialogbox.close();
  }
  onSubmit(form: NgForm) {
    console.log(form);
    let projectName = form.value.project_name;
    let firstLetter = projectName[0].toUpperCase();
    let otherletters = projectName.slice(1);
    let changeUpperCaseProjectName = firstLetter + otherletters;
    let tempcheckName = changeUpperCaseProjectName.trim();
    var duplicateCheckname = changeUpperCaseProjectName.trim();
    // duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
    if(this.tempprojectname==projectName)
    {
      duplicateCheckname=projectName;
    }
   else{
    if (this.keepTextName.toLowerCase() != tempcheckName.toLowerCase()) {
      this.service.loaderActivated.emit(true);
      console.log(changeUpperCaseProjectName);
      let count = 1;
      while (this.ShowHideProjectList.find((data) => data.project_name.toLowerCase() === duplicateCheckname.toLowerCase())) {
        duplicateCheckname = tempcheckName + " (" + count + ")";
        count++;
        console.log(duplicateCheckname, changeUpperCaseProjectName, count);
      }
      duplicateCheckname = this.dataService.changeFormat(duplicateCheckname);
      this.service.Rename(this.projectid, form.value, duplicateCheckname).subscribe((data) => {
        this.service.filter("Register click");
      });
    }
   }
    this.dialogbox.close();
  }
  ngOnInit(): void {
    this.reset();
  }
  myFunction(event)
  {
    this.dataService.specialCharacterPasteRestrict(event);
  }
}
