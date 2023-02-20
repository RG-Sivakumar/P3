import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-text-annotation',
  templateUrl: './text-annotation.component.html',
  styleUrls: ['./text-annotation.component.css']
})
export class TextAnnotationComponent implements OnInit {

  textName:string="";
  element_width_height:any;


  constructor(private dialogRef:MatDialogRef<TextAnnotationComponent>) { }

  ngOnInit(): void {
  }

  textNameAction(textname){
    
    textname = textname.trim();
    var createvalue = {textname:textname,access:true,widthHeight:this.element_width_height};
    this.dialogRef.close(createvalue);
  }

  checkstringValueValid(){
    let createElement_text = document.getElementById('dummytext');
    createElement_text.innerHTML = this.textName.trim();
    this.element_width_height = createElement_text.getBoundingClientRect();
    console.log(this.element_width_height);
  }


  closeBox(){
    var createvalue = {textname:"",access:false};
    this.dialogRef.close(createvalue);
  }

}
