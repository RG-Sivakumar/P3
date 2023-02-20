import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from "@angular/material/dialog";

@Component({
  selector: 'app-copy-document-another-project',
  templateUrl: './copy-document-another-project.component.html',
  styleUrls: ['./copy-document-another-project.component.css']
})
export class CopyDocumentAnotherProjectComponent implements OnInit {
  projectsList: any;
  selectedProjects: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogbox: MatDialogRef<CopyDocumentAnotherProjectComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.data.projects);
    this.projectsList = this.data.projects;
    this.projectsList = this.projectsList.filter((item)=>item.admin_permission_flag == 1 || item.edit_permission_flag == 1);
  }

  closeBox() {
    this.dialogbox.close();
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.selectedProjects = changeUpperCaseProjectName;
    }
  }

  openProject(project,index){
    console.log(index)
    this.dialogbox.close({ projectId: project.project_id, type:"project" })
  }

}
