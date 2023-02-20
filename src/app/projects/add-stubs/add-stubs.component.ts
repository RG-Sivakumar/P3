import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { ProjectlistService } from 'src/app/project-dashboard/my-project/services/projectlist.service';
import { AddcontentService } from '../services/addcontent.service';
import { UploadcompleteComponent } from '../uploadcomplete/uploadcomplete.component';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry, NgxFileDropComponent } from 'ngx-file-drop';

@Component({
  selector: 'app-add-stubs',
  templateUrl: './add-stubs.component.html',
  styleUrls: ['./add-stubs.component.css']
})
export class AddStubsComponent implements OnInit {
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
  selecterUser: any;
  userMessage: string = "";
  value:boolean=false;
  successFiles:any[] = [];
  failedFiles:any[] = [];
  logedin=this.encrptdecrpt.getItem("loggedIn") || "{}";
  user: number;
  public files_npm: NgxFileDropEntry[] = [];

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private dialogbox: MatDialogRef<AddStubsComponent>,
    private addcontentservice: AddcontentService, public service: ProjectlistService,
    private encrptdecrpt:EncryptDecryptService) {
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");

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
  @ViewChild('myInput') myInputVariable: ElementRef;
  ngOnInit(): void {
    // this.message = ""
    // 
    this.service.GetUser(this.projectId).subscribe((data) => {

      this.userlist = data["response_body"]["userslist"]
    })

  }
  userSelection(value) {
    this.selecterUser = value;
  }
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
  finalArray: any = [];
  files: any = [];
  files_to_upload = [];
  file_type = [];
  invalid_files = [];

  indexses: any = [];
  uploadFile(event) {
    this.buttonValidate = false;
    let count = 0;
    for (let index = 0; index < event.length; index++) {
      this.filetype = event[index].name.split(".").pop();
      if (this.filetype != "jpg" && this.filetype != "JPG") {
        this.invalid_files.push(event[index].name)
        // alert("The " + event[index].name + " File is not valid");
        count = count + 1;
      } else {
        if (this.finalArray.length > 0) {
          this.finalArray = this.finalArray.filter((data) => {
            return data.progress == 0;
          }); 
        }
        let tempName = event[index].name;
        // The JPGCheck is used to check whether the stub name contains jpg or not
        let JPGCheck = false;
        if (tempName.includes('.jpg.jpg') || tempName.includes('.JPG.jpg')) {
          JPGCheck = true;
        } 
        let removeJPG = tempName.split(".jpg");
        let removeJPGCaps = removeJPG[0].split(".JPG");
        var name;
        // if(JPGCheck == true){
        //    name =removeJPGCaps[0] + ".jpg";
        // }
        // else{
        //    name =removeJPGCaps[0];
        // }
        name =removeJPGCaps[0] + ".jpg";
        this.finalArray.push({ 'id': index + 1, 'filename': name, 'file': event[index], 'progress': 0, 'progressEnable': false, 'message': false, 'dbmessage': false, 'tick': false });
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
  }
  deleteAttachment(index) {
    
    if(this.finalArray.length==1){
      
      this.buttonValidate=true
    }else{
      this.buttonValidate=false
    }
    this.finalArray.splice(index, 1);
    this.Count = this.finalArray.length;
  }

  reset() {
    console.log(this.myInputVariable);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }


  uploadStubs() {
    console.log(this.finalArray.length)
    if (this.selecterUser == "" || this.selecterUser == undefined) {
      this.userMessage = "Please select one user."
     
    } else {
      this.userMessage = "";
      if (this.Count > 0) {
        clearInterval(this.interval);
        this.finalArray[this.iu].progressEnable = true;
        this.finalArray[this.iu].progress = 0;
        // this.filetype = this.finalArray[this.iu].filename.split(".").pop();
        if (this.filetype != "jpg" && this.filetype != "JPG") {
          this.finalArray[this.iu].progressEnable = false
          this.finalArray[this.iu].message = true
          this.message = "Error! File is not valid";
          this.iu = this.iu + 1;
          this.Count = this.Count - 1;
          this.uploadStubs()
        } else {
          this.interval = setInterval(() => {
            if (this.finalArray[this.iu].progress >= 100) {
              clearInterval(this.interval);
              this.width = 0;
            } else {
              this.finalArray[this.iu].progress++;
            }
          }, 15);
          var user;
          user = this.selecterUser;
          if(this.selecterUser=="0"){
            user=this.logedin.user_id;
            this.user=1
          }
          else{
            this.user=0
          }
          this.addcontentservice.uploadStubs(user, this.projectId, this.finalArray[this.iu].file, this.filetype, this.finalArray[this.iu].filename,this.user).subscribe((res) => {
            console.log(res,user, this.projectId, this.finalArray[this.iu].file, this.filetype, this.finalArray[this.iu].filename,this.user);
            if (res.response_code == 200) {
              this.finalArray[this.iu].progress = 100;
              this.finalArray[this.iu].tick = true;
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
        }
      } else {
        const dialogOpen = new MatDialogConfig();
        dialogOpen.disableClose=true;
        this.dialog.open(UploadcompleteComponent,{
          width:"420px",
          data:{success:this.successFiles,failure:this.failedFiles}
        });
        clearInterval(this.interval);
        this.dialogbox.close();
      }
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

}


