import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  title:any;
  showMessage:any;
  constructor(public dialog:MatDialog,private dialogbox: MatDialog,
    public dialogRef: MatDialogRef<SuccessComponent>,@Inject(MAT_DIALOG_DATA) public data?:any) {
    console.log(data);
    if(data.title=="import"){
      this.title="Success";
      this.showMessage="Your form is imported Successfully.";
    }
    if(data.title=="export")
    {
      if(data.status=="true")
      {
        this.title="Success";
        this.showMessage="Your request is now being processed. You will receive an email when your download is ready.";
      }
      else if(data.status == "pdffalse"){
        this.title="Error";
        this.showMessage="Export document failed. Please try after sometime.";
      }
      else
      {
        this.title="Error";
        this.showMessage="CSV generation failed. Please try after sometime.";
      }
    }
    if(data.title=="media")
    {
      if(data.status=="true")
      {
        this.title="Success";
        this.showMessage="Your request is now being processed. You will receive an email when your download is ready.";
      }
      else
      {
        this.title="Error";
        this.showMessage="Media files extraction failed. Please try after sometime.";
      }
    }
    if(data.title=="copydocument")
    {
      if(data.status=="true")
      {
        this.title="Success";
        this.showMessage="Your request is now being processed. You will receive an email when your document is ready.";
      }
      else
      {
        this.title="Error";
        this.showMessage="Your request is failed. Please try after sometime.";
      }
    }
   }

  ngOnInit(): void {
  }
  onClose(){
    this.dialogRef.close();
    // this.dialogbox.closeAll()
  }
  confirm(){
    this.dialogRef.close();
  }

}
