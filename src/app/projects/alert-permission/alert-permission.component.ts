import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-permission',
  templateUrl: './alert-permission.component.html',
  styleUrls: ['./alert-permission.component.css']
})
export class AlertPermissionComponent implements OnInit {


  constructor(public router: Router,public dialog:MatDialogRef<AlertPermissionComponent>,) { }


  ngOnInit(): void {
  }
  confirm()
  {
    this.dialog.close();
  }
  onClose()
  {
  this.dialog.close();
  }
}
