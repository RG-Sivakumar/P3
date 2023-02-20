import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-no-parent',
  templateUrl: './no-parent.component.html',
  styleUrls: ['./no-parent.component.css']
})
export class NoParentComponent implements OnInit {

  noparentIs: boolean = false;
  documentIs: boolean = false;
  message: any;

  constructor(private dialog: MatDialogRef<NoParentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.documentIs = this.data.documentvalid;
    this.message = this.data.message;
  }


  ngOnInit(): void {
  }

  closeBox() {
    this.dialog.close();
  }

}
