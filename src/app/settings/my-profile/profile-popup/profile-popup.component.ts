import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.css']
})
export class ProfilePopupComponent implements OnInit {

  constructor(public dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data?:any) {
    
   }

  ngOnInit(): void {
  }
  onClose(){
    this.dialog.closeAll()
  }
}
