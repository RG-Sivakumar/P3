import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-permission-popup',
  templateUrl: './edit-permission-popup.component.html',
  styleUrls: ['./edit-permission-popup.component.css']
})
export class EditPermissionPopupComponent implements OnInit {
  location: string = "alert";
  title: string;
  content: string;

  constructor(public dialog:MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { 
    if(this.data != null){
      this.location = this.data.location;
    }
    if(this.location == "alert"){
      this.title = "Alert";
      this.content = "You don't have permission for this operation";
    }
    else if(this.location == "AddProject"){
      this.title = "Error";
      this.content = "External users are restricted from creating new projects.";
    }
  }

  ngOnInit(): void {
  }
  onclose(){
this.dialog.closeAll();
  }
}
