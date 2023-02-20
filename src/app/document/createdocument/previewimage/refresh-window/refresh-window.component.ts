import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-refresh-window',
  templateUrl: './refresh-window.component.html',
  styleUrls: ['./refresh-window.component.css']
})
export class RefreshWindowComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private dialogbox: MatDialogRef<RefreshWindowComponent>) { }

  ngOnInit(): void {
  }

  delete() {
    this.dialogbox.close();
  }

}
