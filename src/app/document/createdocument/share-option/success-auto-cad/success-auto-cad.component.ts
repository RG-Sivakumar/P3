import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-auto-cad',
  templateUrl: './success-auto-cad.component.html',
  styleUrls: ['./success-auto-cad.component.css']
})
export class SuccessAutoCADComponent implements OnInit {

  fileURL:string="";
  successMessage:boolean=true;
  copybuttonValue="Copy";

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private dialogBox:MatDialogRef<SuccessAutoCADComponent>) {
    console.log(data.autoCadData,'value');
    // this.fileURL = autocadRecive.
    let responseDetails = data.autoCadData;
    if(responseDetails.response_code==200){
      this.fileURL = responseDetails.response_body;
    }
    else{
      this.successMessage = false;
    }
   }

  ngOnInit(): void {
  }

  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.copybuttonValue = "Copied";
  }

  closeBox(){
    this.dialogBox.close();
  }

}
