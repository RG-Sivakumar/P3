import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import _ from 'lodash';
import { v1 as uuidv1 } from "uuid";
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { CreateDocumentService } from 'src/app/document/services/create-document.service';
import { login } from 'src/app/projectmanagement/models/login-model';
import { AddFileComponent } from 'src/app/projects/add-file/add-file.component';
import { SelectfolderComponent } from 'src/app/projects/selectfolder/selectfolder.component';
import { AddcontentService } from 'src/app/projects/services/addcontent.service';
import { ProjectfolderService } from 'src/app/projects/services/projectfolder.service';
import { FileSystemFileEntry, FileSystemDirectoryEntry, NgxFileDropComponent } from 'ngx-file-drop';
import { ImportautocardService } from '../importautocard.service';
import { SuccessComponent } from 'src/app/document/success/success.component';
@Component({
  selector: 'app-import-autocad',
  templateUrl: './import-autocad.component.html',
  styleUrls: ['./import-autocad.component.css']
})
export class ImportAutocadComponent implements OnInit {
 filename;
  public files_npm: NgxFileDropEntry[] = [];
  files;
  loader=false;
  document_id: any;
  project_id: any;
  layer_id: any;
  page_id: any;
  buttonValidate=true;
  autoCAD:boolean;
constructor(
    private addcontentservice: AddcontentService,
    private dialog: MatDialog,
    private documentService: CreateDocumentService,
    private dialogbox: MatDialogRef<ImportAutocadComponent>,
    private service: ImportautocardService,
    private _snackBar: MatSnackBar,
    private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data,public services:ProjectfolderService
  ) {
    console.log(this.autoCAD)
    this.document_id=data.document_id;
    this.project_id=data.project_id;
    this.layer_id=data.layer_id;
    this.page_id=data.page_id;
    this.autoCAD=data.autoCAD;
    
  }
  list = [];
  ngOnInit(): void {
  
  }
 
  closeBox() {
    this.dialogbox.close(false);
   
   
  }

  public dropped(files: NgxFileDropEntry[]) {
    
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
this.filename=droppedFile.relativePath

const v=file
this.files=v
console.log(this.files,file,v)
if(this.filename==undefined||this.filename==""){
  this.buttonValidate=true;
}else{
  this.buttonValidate=false;
}
});
} else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  deleteAttachment(){
    this.filename=undefined
    if(this.filename==undefined||this.filename==""){
      this.buttonValidate=true;
    }else{
      this.buttonValidate=false;
    }
   
    
  }
  uploadfile(){
    if(this.autoCAD==true){
    console.log(this.files)
    this.service.incertDoc(this.files,this.document_id,this.layer_id,this.project_id,this.page_id).subscribe((res) => {
      console.log(res["response_body"])
      if(res["response_code"]==200){
        this.dialogbox.close(true)
        var is_selected=true
        
        this.services.autocademit.emit({"response":res["response_body"].preview_json,"selected":is_selected,process_id:res["response_body"].process_id
      })
      }
  })
}else{
  this.loader=true
  this.service.importdoccsv(this.files,this.project_id).subscribe((res) => {
    console.log(res["response_body"])
    if(res["response_code"]==200){
      this.loader=false
      this.dialog.closeAll()
      var dialogrefModel = this.dialog.open(SuccessComponent,{
        width: '500px',
        data: { 
          status:"true",
          title: "import"}
      });
     
    }else{
      this.loader=false
    }
  })
}
  }
}


