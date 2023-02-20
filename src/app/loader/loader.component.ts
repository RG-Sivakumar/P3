import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  sourceAnnotationView = {heading:'Information',info:'Details not available for the annotation. Please recheck the URL and try again.',buttontext:'Close'};
  annotationView:boolean=true;

  constructor(private dialogRef:MatDialogRef<LoaderComponent>) { }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
