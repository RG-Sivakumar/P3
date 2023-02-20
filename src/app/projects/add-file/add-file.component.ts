import { Component, OnInit, Inject, ViewChild, ElementRef } from "@angular/core";
import { AddcontentService } from "../services/addcontent.service";
import {
  MatDialogConfig,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { SelectfolderComponent } from "../selectfolder/selectfolder.component";
import { v1 as uuidv1 } from "uuid";
import { login } from "src/app/projectmanagement/models/login-model";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { ProjectfolderService } from "../services/projectfolder.service";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _ from 'lodash';
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry, NgxFileDropComponent } from 'ngx-file-drop';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

class getFiles{
  constructor(file:File){}
}

@Component({
  selector: "app-add-file",
  templateUrl: "./add-file.component.html",
  styleUrls: ["./add-file.component.css"],
})
export class AddFileComponent implements OnInit {
  fileToUpload: File = null;
  noofpage: File = null;
  totalPages: number;
  projectId: string;
  callback: any;
  readerresult1: any;
  readerresult: any;
  sendFileType: string;
  selectfolder = [];
  uuidValue: string;
  show = false;
  buttonValidate: boolean = true;
  errorMessage: any;
  su: login;
  projecDetailstList: any;
  documentId: string;
  layerName: string = "default";
  layerType = "blank";
  page_id: string[] = [];
  finalArray: any = [];
  filename: string;
  file: string;
  progress: number;
  progressEnable: boolean;
  message: boolean;
  tick: boolean;
  fileSelected: boolean = false;
  selectedFile: ImageSnippet;
  pdfSource: any = "";
  selectedFiles:any[] = [];
  markUIvalues:any[]=[];
  getFiles:FileList;
  public loadedPdf: PDFDocumentProxy;
  pdfPageNumber:number = 1;
  fileTypeAccurate:any;
  public files_npm: NgxFileDropEntry[] = [];
  

  constructor(
    private addcontentservice: AddcontentService,
    private dialog: MatDialog,
    private documentService: CreateDocumentService,
    private dialogbox: MatDialogRef<AddFileComponent>,
    private service: ProjectfolderService,
    private _snackBar: MatSnackBar,
    private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    var receiveData = this.data;
    this.projectId = receiveData.projectId;
    this.callback = receiveData.callback;
    this.selectfolder = receiveData.receivefolder;
    this.projecDetailstList = receiveData.projecDetailstList;
  }
  list = [];
  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";

    this.service
      .getProjectfolder(this.su.user_id, this.projectId)
      .subscribe((res) => {
        console.log(res["response_body"]["project_master"]);
        this.list = res["response_body"]["project_master"];
      });
  }
  handleFileInput(imageInput: FileList) {
    console.log(imageInput);
    this.page_id = [];
    this.buttonValidate = false;
    this.fileToUpload = imageInput.item(0);
    this.noofpage = imageInput.item(0);
    // const reader = new FileReader();
    if (true) {
      let $img: any = document.querySelector('#file');
      if (typeof (FileReader) !== 'undefined') {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.pdfSource = e.target.result;
        };
        reader.readAsArrayBuffer($img.files[0]);
      }
      // const fileInfo = this.noofpage;

      // var filetype = fileInfo.name.split(".").pop();
      // if (filetype == "pdf") {
      //   reader.readAsBinaryString(this.noofpage);
      //   reader.onloadend = () => {
      //     this.readerresult1 = reader.result;
      //     if (this.readerresult1 != undefined) {
      //       this.readerresult = this.readerresult1.match(
      //         /\/Type[\s]*\/Page[^s]/g
      //       ).length;
      //     }
      //     this.totalPages = this.readerresult;

      //     this.sendFileType = "pdf";
      //     for (var i = 0; i < this.totalPages; i++) {
      //       var date = new Date().getTime();
      //       this.page_id.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + date);
      //     }
      //   };
    }
    else {
      this.page_id = [];
      this.totalPages = 1;
      this.sendFileType = "image";
      for (var i = 0; i < this.totalPages; i++) {
        var date = new Date().getTime();
        this.page_id.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + date);
      }
    }
  }

  callBackFn(event: PDFDocumentProxy) {
    this.loadedPdf = event;
    let sendFileType = "pdf";
    let pageId = [];
    let totalPages = event.numPages;
    for (var i = 0; i < totalPages; i++) {
      var date = new Date().getTime();
      pageId.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + date);
    }
    let selectedFile = {
      'id': this.fileIndex + 1, 'filename': this.getFiles[this.fileIndex].name, 'filetype': sendFileType, 'progress': 0,
      'progressEnable': false, 'message': false, 'dbmessage': false, 'tick': false,
      'totalpages': totalPages, 'project_id': this.projectId, 'page_id': pageId, 'file': this.getFiles[this.fileIndex]
    };
    if(this.selectedFiles.length>0){
      let clone_selectedFile = _.cloneDeep(selectedFile);
      let check_file_name = this.selectedFiles.filter((name_check)=>name_check.filename.toLowerCase() === clone_selectedFile.filename.toLowerCase());
      if(check_file_name.length>0){
        clone_selectedFile.filename = clone_selectedFile.filename + ' (' +(check_file_name.length) + ')';
        this.markUIvalues.push(clone_selectedFile);
      }
      else{
        this.markUIvalues.push(selectedFile);  
      }
    }
    else{
      this.markUIvalues.push(selectedFile);
    }
    this.selectedFiles.push(selectedFile);
    console.log(this.selectedFiles);
    this.loadedPdf.destroy();
    this.fileIndex = this.fileIndex + 1;
    this.fileCount = this.fileCount - 1;
    this.dummyFunction();
  }



  uploadFile(files: FileList) {
    console.log(files);
    this.page_id = [];
    this.fileToUpload = files.item(0);
    this.noofpage = files.item(0);
    const reader = new FileReader();
    const fileInfo = this.noofpage;
    var filetype = fileInfo.name.split(".").pop();
    if (filetype == "pdf") {
      let $img: any = document.querySelector('#file');
      if (typeof (FileReader) !== 'undefined') {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.pdfSource = e.target.result;
        };
        reader.readAsArrayBuffer(files[0]);
      }
    } else {
      this.page_id = [];
      this.totalPages = 1;
      this.buttonValidate = false;
      this.sendFileType = "image";
      for (var i = 0; i < this.totalPages; i++) {
        var date = new Date().getTime();
        this.page_id.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + date);
      }
    }
    this.fileSelected = true;
    this.filename = fileInfo.name
    // this.file = filetype
    // this.progress = 0
    // this.progressEnable = false
    // this.message = false
    // this.message = false
    // this.tick = false
    // this.finalArray.push({ 'id': 1, 'filename': fileInfo.name, 'file': filetype, 'progress': 0, 'progressEnable': false, 'message': false, 'dbmessage': false, 'tick': false });
  }

  fileCount:number = 0;
  fileIndex:number = 0;
  @ViewChild('fileInput', {static: false}) InputVar: ElementRef;
  totalfilecount:number=0;
  invalidfile:boolean=false;


  htmlCallBack(files: any){
    this.getFiles = files;
    this.fileCount = this.getFiles.length;
    this.totalfilecount = this.getFiles.length;
    this.dummyFunction();
  }

  errorMessage1() {
    this._snackBar.open('Selected file format is not supported', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }
  errorMessage2() {
    this._snackBar.open('Some of the selected file format is not supported', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }

  dummyFunction() {
    // this._snackBar.dismiss();
    console.log(this.getFiles,this.fileCount,this.fileIndex);
    if (this.fileCount > 0) {
      console.log(this.getFiles[this.fileIndex]);
      // var filetype = this.getFiles[this.fileIndex].name.split(".").pop();
      var filetype = this.getFiles[this.fileIndex].type.split("/").pop();
      filetype = filetype.toLowerCase();
      this.fileTypeAccurate = filetype;
      if(this.fileTypeAccurate!="tiff" && this.fileTypeAccurate!="video/mp4"){
        if (filetype == "pdf") {
          let $img: any = document.querySelector('#file');
          if (typeof (FileReader) !== 'undefined') {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.pdfSource = e.target.result;
            };
            reader.readAsArrayBuffer(this.getFiles[this.fileIndex]);
          }
        } else {
          let sendFileType = "image";
          let pageId = [];
          let totalPages = 1;
          pageId.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime());
          let selectedFile = {
            'id': this.fileIndex + 1, 'filename': this.getFiles[this.fileIndex].name, 'filetype': sendFileType, 'progress': 0,
            'progressEnable': false, 'message': false, 'dbmessage': false, 'tick': false,
            'totalpages': totalPages, 'project_id': this.projectId, 'page_id': pageId, 'file': this.getFiles[this.fileIndex]
          };
          if(this.selectedFiles.length>0){
            let clone_selectedFile = _.cloneDeep(selectedFile);
            let check_file_name = this.selectedFiles.filter((name_check)=>name_check.filename.toLowerCase() === clone_selectedFile.filename.toLowerCase());
            if(check_file_name.length>0){
              clone_selectedFile.filename = clone_selectedFile.filename + ' (' +(check_file_name.length) + ')';
              this.markUIvalues.push(clone_selectedFile);
            }
            else{
              this.markUIvalues.push(selectedFile);  
            }
          }
          else{
            this.markUIvalues.push(selectedFile);
          }
          this.selectedFiles.push(selectedFile);
          console.log(this.selectedFiles);
          
          
          this.fileIndex = this.fileIndex + 1;
          this.fileCount = this.fileCount - 1;
          this.dummyFunction();
        }
      }
      else{
        this.invalidfile=true;
        this.fileIndex = this.fileIndex + 1;
        this.fileCount = this.fileCount - 1;
        this.dummyFunction();
      }
    }
    else{
      if(this.invalidfile==true){
        if(this.totalfilecount==1){
          this.errorMessage1();
        }
        else if(this.totalfilecount>1){
          this.errorMessage2();
        }
      }
      // this.InputVar.nativeElement.value=""; // drag drop npm impelemnt
      this.buttonValidate=false;
      this.fileIndex = 0;
      this.invalidfile=false;
    }
  }

  btnDisabled = false;
  goToSelectFolder() {
    if (this.totalPages != undefined) {
      console.log(this.page_id);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      // dialogConfig.width = "100%";
      console.log(this.projectId + "----" + this.totalPages + "----" + this.sendFileType + "----" + this.page_id)
      this.dialog.open(SelectfolderComponent, {
        data: {
          file: this.fileToUpload,
          projectId: this.projectId,
          noofPage: this.totalPages,
          sendFileType: this.sendFileType,
          pageId: this.page_id,
          callback: this.callback,
          projecDetailstList: this.projecDetailstList
        },
      });
      this.dialogbox.close();
    }
    else {
      window.alert("There is a issue in file upload. Please try again.");
    }
  }

  goToSelectFolder1() {
    if (this.selectedFiles.length != 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      this.dialog.open(SelectfolderComponent, {
        data: {
          fileDatas:this.selectedFiles,
          projecDetailstList: this.projecDetailstList,
          changeNameUI:this.markUIvalues
        },
      });
      this.dialogbox.close();
    }
    else {
      window.alert("There is a issue in file upload. Please try again.");
    }
  }

  createLayer(documentId) {
    var uuidDate = new Date().getTime();
    var date = new Date().toISOString();
    this.documentService
      .defaultcreateLayer(
        this.layerName,
        this.layerType,
        uuidDate,
        date,
        uuidv1().toUpperCase(),
        this.projectId,
        documentId,
        this.page_id
      )
      .subscribe((response) => {
        this.documentService.filter("Refresh Start");
        this.addcontentservice.filter("Register Click");
      });
  }

  closeBox() {
    this.dialogbox.close();
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files_npm = files;
    let index = 0;
    let get_selected_files = [];
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          index = index + 1;
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          get_selected_files.push(file);
          if(index == files.length){
            console.log('trigger file');
            this.htmlCallBack(get_selected_files);
          }
          


          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
}
