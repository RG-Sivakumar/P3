import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-externaluserpopup',
  templateUrl: './externaluserpopup.component.html',
  styleUrls: ['./externaluserpopup.component.css']
})
export class ExternaluserpopupComponent implements OnInit {
  forgotpassword: boolean=false;

  constructor(private dialogRef: MatDialogRef<ExternaluserpopupComponent>) { }

  ngOnInit(): void {
    
  }
  confirm(){
    this.forgotpassword = true;
    this.dialogRef.close({ data: this.forgotpassword });
  }
  cancel(){
    this.forgotpassword = false;
    this.dialogRef.close();
  }

}
