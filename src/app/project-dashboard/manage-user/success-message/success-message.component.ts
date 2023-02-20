import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.css']
})
export class SuccessMessageComponent implements OnInit {

  get_response:number=200;
  title:string="Invitation";
  message:string="The user has been sent an invitation to join the project and will appear in the list of users once accepted.";

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private dialogRef:MatDialogRef<SuccessMessageComponent>) {
    this.get_response = Number(this.data.response_code);
    if(this.get_response == 200){
      this.title = "Invitation";
      this.message = "The user has been sent an invitation to join the project and will appear in the list of users once accepted.";
    }
    else if(this.get_response == 203){
      this.title = "Error!";
      this.message = "WJE users cannot be added as external users.";
    }
    else if(this.get_response == 500){
      this.title = "Error!";
      this.message = "Internal Server Error.";
    }
    else{
      this.title = "Error!";
      this.message = "The user you have entered is an existing user. Please search and select them from the options above.";
    }
   }

  ngOnInit(): void {

  }

  closeDialog(){
    this.dialogRef.close({data:false});
  }

  closeDialogOK(){
    this.dialogRef.close({data:true});
  }
}
