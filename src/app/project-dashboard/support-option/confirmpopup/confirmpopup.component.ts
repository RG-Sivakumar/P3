import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmpopup',
  templateUrl: './confirmpopup.component.html',
  styleUrls: ['./confirmpopup.component.css']
})
export class ConfirmpopupComponent implements OnInit {

  constructor(public dialog:MatDialog) { }
  onClose(){
    this.dialog.closeAll();
  }
  ngOnInit(): void {
  }

}
