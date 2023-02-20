import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { v1 as uuidv1 } from "uuid";
import { login } from 'src/app/projectmanagement/models/login-model';
import { AddcontentService } from 'src/app/projects/services/addcontent.service';
import { FormmappingService } from 'src/app/document/services/formmapping.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectlistService } from '../my-project/services/projectlist.service';
import { DataService } from 'src/app/data.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry, NgxFileDropComponent } from 'ngx-file-drop';

@Component({
  selector: 'app-attachmentfile',
  templateUrl: './attachmentfile.component.html',
  styleUrls: ['./attachmentfile.component.css']
})
export class AttachmentfileComponent implements OnInit {
  fileToUpload: any = [];
  filetype: string;
  file_name: string;
  projectId: any;
  buttonValidate: boolean = true;
  message: any;
  width: any = 0;
  showLoader: any;
  interval: NodeJS.Timeout;
  showSuccess: boolean;
  Count: any;
  iu: number;
  message1: string;
  ClassName: string;
  userlist: any;
  selecterUser: any = 8;
  userMessage: string = "";
  value:boolean=false;
  successFiles:any[] = [];
  failedFiles:any[] = [];
  public files_npm: NgxFileDropEntry[] = [];
  finalArray: any = [];
  files: any = [];
  files_to_upload = [];
  file_type = [];
  invalid_files = [];
  indexses: any = [];

  constructor(private dialog: MatDialog,
    private annotationmediaservice: FormmappingService,
    private route: ActivatedRoute,
    private dialogbox: MatDialogRef<AttachmentfileComponent>,
    private addcontentservice: AddcontentService, public service: ProjectlistService,
    private dataService:DataService,private renderer:Renderer2) {
    this.projectId = "8-5C0D4C60-A1B5-11EB-8A2F-F7C961085C4A-1618908587045";

  }
  doSomethingOnOpen(e){
    if(e==true){
      this.value=true;
    }

    console.log(e)
  }
  doSomethingOnclose(e){
    if(e==false){
      this.value=false;
    }
    
    console.log(e)
  }
  @ViewChild('myInput')
  myInputVariable: ElementRef;

  
  
  ngOnInit(): void {
    // this.message = ""
    // 
    // this.service.GetUser(this.projectId).subscribe((data) => {

    //   this.userlist = data["response_body"]["userslist"]
    // })

  }
  // userSelection(value) {
  //   this.selecterUser = value;
  // }
  closeAlert() {
    var alert = document.getElementById("openModal");
    this.ClassName = ""
    alert.style.display = "none"
  }
  alertBox() {
    var alert = document.getElementById("openModal");
    this.ClassName = "show"
    alert.style.display = "block"
  }
  closeBox() {
    this.dialogbox.close();
  }
  
  uploadFile(event) {
    this.buttonValidate = false;
    let count = 0;
    for (let index = 0; index < event.length; index++) {
      this.filetype = event[index].name.split(".").pop();
      console.log(event[index].size);
      var totalSizeMB = event[index].size / Math.pow(1024,2);
      console.log(totalSizeMB);
      if (this.filetype == "pdf" || this.filetype == "PDF" || totalSizeMB>100) {
        this.invalid_files.push(event[index].name)
        // alert("The " + event[index].name + " File is not valid");
        count = count + 1;
      } 
      else {
        if (this.finalArray.length > 0) {
          this.finalArray = this.finalArray.filter((data) => {
            return data.progress == 0;
          }); 
        }
        this.finalArray.push({ 'id': index + 1, 'filename': event[index].name, 'file': event[index], 'progress': 0, 'progressEnable': false, 'message': false, 'dbmessage': false, 'tick': false,path:"" });
        let sortArray = this.finalArray; 
        this.finalArray = sortArray.sort((a, b) => a.filename.localeCompare(b.filename));
        const element = event[index];
        this.files.push(element.name);
        this.files_to_upload.push(element);
        this.iu = 0;
      }
    }
    if (count > 0) {
      //this.alertBox();
      alert("One or more of the selected files does not have the proper file extension of .jpg");
    }
    this.Count = this.finalArray.length;
    // this.reset();
    this.resetFileInput();
  }
  deleteAttachment(index) {
    this.finalArray.splice(index, 1);
    this.Count = this.finalArray.length;
  }

  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }


  uploadStubs() {
    
    this.userMessage = "";
    if (this.Count > 0) {
      clearInterval(this.interval);
      this.finalArray[this.iu].progressEnable = true;
      this.finalArray[this.iu].progress = 0;
      this.filetype = this.finalArray[this.iu].filename.split(".").pop();
      this.interval = setInterval(() => {
        if (this.finalArray[this.iu].progress >= 100) {
          clearInterval(this.interval);
          this.width = 0;
        } else {
          this.finalArray[this.iu].progress++;
        }
      }, 15);
      this.addcontentservice.uploadAttachment(this.finalArray[this.iu].file, this.filetype, this.finalArray[this.iu].filename).subscribe((res) => {
      // this.annotationmediaservice.annotationMedia(this.finalArray[this.iu].file, '8-B8853059-88D9-43D7-A171-C9328EF78EEB-1618908719629', uuidv1()).subscribe((res) => {
        console.log(res);
        if (res.response_code == 200) {
          this.finalArray[this.iu].progress = 100;
          this.finalArray[this.iu].tick = true;
          this.finalArray[this.iu].path = res["response_body"]["path"];
          this.successFiles.push(this.finalArray[this.iu]);
          this.iu = this.iu + 1;
          this.Count = this.Count - 1;
          this.uploadStubs()
        }
        else {
          this.failedFiles.push(this.finalArray[this.iu]);
          this.finalArray[this.iu].progress = 10;
          this.finalArray[this.iu].progressEnable = false
          this.finalArray[this.iu].dbmessage = true
          this.message1 = "No stub photo located for this name / user.";
          this.iu = this.iu + 1;
          this.Count = this.Count - 1;
          this.uploadStubs()
        }
      })

    } else {
      let uploadDatas = this.successFiles;
      clearInterval(this.interval);
      this.dialogbox.close(uploadDatas);
    }
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
            this.uploadFile(get_selected_files);
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

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }

  // @ViewChild('fileSelector', { static: true })
  // public fileSelector: ElementRef;

  // public openFileSelector = (event?: MouseEvent): void => {
  //   if (this.fileSelector && this.fileSelector.nativeElement) {
  //     (this.fileSelector.nativeElement as HTMLInputElement).click();
  //   }
  // };

  @ViewChild('fileSelector', { static: true })
  public fileSelector: ElementRef;

  private helperFormEl: HTMLFormElement | null = null;
  private fileInputPlaceholderEl: HTMLDivElement | null = null;


  private getHelperFormElement(): HTMLFormElement {
    if (!this.helperFormEl) {
      this.helperFormEl = this.renderer.createElement('form') as HTMLFormElement;
    }

    return this.helperFormEl;
  }

  private getFileInputPlaceholderElement(): HTMLDivElement {
    if (!this.fileInputPlaceholderEl) {
      this.fileInputPlaceholderEl = this.renderer.createElement('div') as HTMLDivElement;
    }

    return this.fileInputPlaceholderEl;
  }

  private resetFileInput(): void {
    if (this.fileSelector && this.fileSelector.nativeElement) {
      const fileInputEl = this.fileSelector.nativeElement as HTMLInputElement;
      const fileInputContainerEl = fileInputEl.parentElement;
      const helperFormEl = this.getHelperFormElement();
      const fileInputPlaceholderEl = this.getFileInputPlaceholderElement();

      // Just a quick check so we do not mess up the DOM (will never happen though).
      if (fileInputContainerEl !== helperFormEl) {
        // Insert the form input placeholder in the DOM before the form input element.
        this.renderer.insertBefore(fileInputContainerEl, fileInputPlaceholderEl, fileInputEl);
        // Add the form input as child of the temporary form element, removing the form input from the DOM.
        this.renderer.appendChild(helperFormEl, fileInputEl);
        // Reset the form, thus clearing the input element of any files.
        helperFormEl.reset();
        // Add the file input back to the DOM in place of the file input placeholder element.
        this.renderer.insertBefore(fileInputContainerEl, fileInputEl, fileInputPlaceholderEl);
        // Remove the input placeholder from the DOM
        this.renderer.removeChild(fileInputContainerEl, fileInputPlaceholderEl);
      }
    }
  }


}

