import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alertmessage',
  templateUrl: './alertmessage.component.html',
  styleUrls: ['./alertmessage.component.css']
})
export class AlertmessageComponent implements OnInit {
  plateFormWhich:boolean=true;
  showMessage="No annotation found for this document";

  constructor(public dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data?:any) { 
    console.log(data,data.platform);
    if(data.platform=='media'){
      this.showMessage = "No media found for this document."
    }
    else if(data.platform=='annotation'){
      this.showMessage = "No annotation found for this document."
    }
    else if(data.platform=='servererror'){
      this.showMessage = "Internal server error.";
    }
    else if(data.platform=='document'){
      this.showMessage = "No document found for this project."
    }
    else if(data.platform=='exportpdf'){
      this.showMessage = "This feature is not available in web right now."
    }
    else if(data.platform='ipaddownload'){
      this.showMessage = "This feature is not available for external users."
    }
  }

  ngOnInit(): void {
  }
  onClose(){
  this.dialog.closeAll();
  }
  confirm(){
    this.dialog.closeAll();
  }
}
