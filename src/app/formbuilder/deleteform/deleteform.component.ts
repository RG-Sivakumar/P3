import { Component, OnInit, Inject } from '@angular/core';
import { value, elementData } from '../Model/controlmodel';
import swal from 'sweetalert2';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-deleteform',
  templateUrl: './deleteform.component.html',
  styleUrls: ['./deleteform.component.css']
})
export class DeleteformComponent implements OnInit {
  data1: any;
  item: boolean;

  constructor(private dialog: MatDialogRef<DeleteformComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }
  modelFields: Array<elementData> = [];
  model: any = {
    name: 'Form ',
    description: 'Form Element',
    theme: {
      bgColor: "ffffff",
      textColor: "555555",
      bannerImage: "",
      border: "#000000"
    },
    attributes: this.modelFields
  };
  // removeField(splice){
  // this.data.data1.splice(splice,-1)
  //   this.dialog.close()
  // }

  removeField() {
    this.item = true;
    this.dialog.close({ data: this.item })
  }

  onClose() {
    this.item = false;
    this.dialog.close({ data: this.item })

  }
}
