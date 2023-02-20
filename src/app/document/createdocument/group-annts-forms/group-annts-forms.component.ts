import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-group-annts-forms',
  templateUrl: './group-annts-forms.component.html',
  styleUrls: ['./group-annts-forms.component.css']
})
export class GroupAnntsFormsComponent implements OnInit {
  formlist: any;

  constructor(private dialogRef: MatDialogRef<GroupAnntsFormsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, ) {
     this.formlist = this.data.FormList;
    }

  ngOnInit(): void {
    console.log(this.formlist);
  }

  closeBox(){
    this.dialogRef.close();
  }

  selectForm(index,id){
    this.dialogRef.close(id);
  }

}
