import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';

@Component({
  selector: 'app-remainder-popup',
  templateUrl: './remainder-popup.component.html',
  styleUrls: ['./remainder-popup.component.css']
})
export class RemainderPopupComponent implements OnInit {

  title:any;
  showMessage:any;

  constructor(public dialog:MatDialog,
    public dialogRef: MatDialogRef<RemainderPopupComponent>,private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data?:any) { 
      this.title = "Important Information";
      this.showMessage = "Please note that the current release of Web Client requires you to hit a Submit button when filling out annotation form data, and an Apply button when making annotation property changes.   If you fail to do this, the edits will not be saved.";
    }

  ngOnInit(): void {
  }

   onClose(){
    this.dialogRef.close();
  }
  confirm(){
    this.dialogRef.close();
  }

  remainderCheck(event){
    if(event.target.checked==true){
      this.encrptdecrpt.setItem("remainderStop",true);
    }
    else if(event.target.checked==false){
      this.encrptdecrpt.setItem("remainderStop",false);
    }
  }

}
