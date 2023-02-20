import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warningrotateresize',
  templateUrl: './warningrotateresize.component.html',
  styleUrls: ['./warningrotateresize.component.css']
})
export class WarningrotateresizeComponent implements OnInit {
  

  constructor(public dialog:MatDialogRef<WarningrotateresizeComponent>,@Inject(MAT_DIALOG_DATA) public data?:any) { 
    
  }

  ngOnInit(): void {
  }

  completeAction(process){
    this.dialog.close(process);
  }
  closeBox(){
  this.dialog.close();
  }
  confirm(){
    this.dialog.close();
  }
}
