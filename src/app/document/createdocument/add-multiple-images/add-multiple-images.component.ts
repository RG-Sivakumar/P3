import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormmappingService } from '../../services/formmapping.service';
import { v1 as uuidv1 } from "uuid";
import { login } from 'src/app/projectmanagement/models/login-model';
import { AddcontentService } from 'src/app/projects/services/addcontent.service';
import { MediamenuComponent } from '../mediamenu/mediamenu.component';
import { DataService } from 'src/app/data.service';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry, NgxFileDropComponent } from 'ngx-file-drop';

@Component({
  selector: 'app-add-multiple-images',
  templateUrl: './add-multiple-images.component.html',
  styleUrls: ['./add-multiple-images.component.css']
})
export class AddMultipleImagesComponent implements OnInit {
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
  annotation_id: any;
  mediaId: string;
  su: login;
  user_id: any;
  stubId: string;
  mediumStub: string;
  multipleCheck: boolean;
  heading: any;
  FileName: any;
  multipleSelectOn: boolean = false;
  multiselectionList: any[] = [];
  show: boolean = false;
  filetypepicker: any;
  done: boolean=false;
  doneButtonclicked: boolean=false;
  public files_npm: NgxFileDropEntry[] = [];

  constructor(
    private annotationmediaservice: FormmappingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogbox: MatDialogRef<AddMultipleImagesComponent>,
    private addcontentservice: AddcontentService,
    private dataService:DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {

    this.annotation_id = this.data.annotationData;
    this.user_id = this.data.userId;
    this.mediumStub = this.data.stubIdData;
    this.heading = this.data.heading;
    this.FileName = this.data.filename;
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.multiselectionList = this.data.multiselectionList;
    console.log(this.mediumStub);
    if (this.mediumStub == "") {
      this.multipleCheck = true
    } else {
      this.multipleCheck = false
    }
  }
  @ViewChild('myInput') myInputVariable: ElementRef;
  ngOnInit(): void {

  }
  finalArray: any = [];
  responceArray: any = [];
  files: any = [];
  files_to_upload = [];
  file_type = [];
  invalid_files = [];

  indexses: any = [];
  uploadFile(event) {
    this.done=false;
    this.buttonValidate = false;
    let count = 0;
    for (let index = 0; index < event.length; index++) {

      this.mediaId = this.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
      if (this.mediumStub == "") {
        this.stubId = this.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
      } else {
        this.stubId = this.mediumStub
      }
      this.filetype = event[index].name.split(".").pop();
      if (this.filetype == "jpg" || this.filetype == "JPG" || this.filetype == "JPEG" || this.filetype == "jpeg" || this.filetype == "bmp" || this.filetype == "BMP" || this.filetype == "gif" || this.filetype == "GIF" || this.filetype == "png" || this.filetype == "PNG" || this.filetype == "heic" || this.filetype == "HEIC") {
        if (this.mediumStub == "") {
          if (this.finalArray.length > 0 && this.doneButtonclicked==true) {
            this.finalArray = this.finalArray.filter((data) => {
              return data.progress == 0;
            })
          }
        } else {
          this.finalArray = [];
        }
        if (this.mediumStub != "") {
          this.finalArray.push({ 'filetype': this.filetype, 'filename': this.data.media.media_name, 'file': event[index], 'progress': 0, 'progressEnable': false, 'message': false, 'dbmessage': false, 'tick': false, 'media_id': this.mediaId, 'stub_id': this.stubId });
        } else {
          if(this.finalArray.length>0){
            var nameChanged=this.duplicatenamecheck(event[index].name);
            this.finalArray.push({ 'filetype': this.filetype, 'filename': nameChanged, 'file': event[index], 'progress': 0, 'progressEnable': false, 'message': false, 'dbmessage': false, 'tick': false, 'media_id': this.mediaId, 'stub_id': this.stubId });
          }
          else{
            this.finalArray.push({ 'filetype': this.filetype, 'filename': event[index].name, 'file': event[index], 'progress': 0, 'progressEnable': false, 'message': false, 'dbmessage': false, 'tick': false, 'media_id': this.mediaId, 'stub_id': this.stubId });
          }
        }

        const element = event[index];
        this.files.push(element.name)
        this.files_to_upload.push(element);
        this.iu = 0;
      } else {
        this.invalid_files.push(event[index].name)
        // alert("The " + event[index].name + " File is not valid");
        count = count + 1;
      }
    }
    if (count > 0) {
      //this.alertBox();
      alert("One or more of the selected files does not have the proper file extension");
    }
    this.Count = this.finalArray.length;
    // this.reset();
  }
  // duplicateCheck(name, change_annotation_id) {
  //   var count = 0;
  //   var duplicatename = name;
  //   var tempName = name;
  //   for (var i = 0; i < this.layerDatas.length; i++) {
  //     var annotationDAta = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == change_annotation_id));
  //     if (annotationDAta.length > 0 && annotationDAta[0].annotation_media != null && annotationDAta[0].annotation_media.length != 0) {
  //       for (let i = 0; i < annotationDAta[0].annotation_media.length; i++) {
  //         if (annotationDAta[0].annotation_media[i].is_removed != true) {
  //           let letters = annotationDAta[0].annotation_media[i].media_name.split("(", 1);
  //           if (letters[0].trim() === name.trim()) {
  //             count++;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   if (count > 0) {
  //     duplicatename = tempName + " (" + count + ")";
  //   }
  //   return duplicatename;
  // }
  //filename
  duplicatenamecheck(name){
    var count=0;
    var tempName = name;
    var duplicatename = name;
    for(var i=0;i<this.finalArray.length;i++){
      let letters=this.finalArray[i].filename.split("(",1);
      if(letters[0].trim()===name.trim()){
        count++;
      }
    }
    if(count>0){
      duplicatename = tempName + " (" + count + ")";
    }
    return duplicatename;
  }
  deleteAttachment(index) {
    console.log('delete click');
    this.finalArray.splice(index, 1)
    if(this.finalArray.length==0){
      this.buttonValidate=true
    }else{
this.buttonValidate=false
    }
  }

  reset() {
    console.log(this.myInputVariable);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }


  // uploadImage() {
  //   this.annotationmediaservice.annotationMedia(files[i], this.getId, this.mediaId).subscribe((res) => {
  //   })
  // }
  uploadStubs() {
    this.buttonValidate = true;
    var loggedIn = this.encrptdecrpt.getItem("loggedIn");
    this.projectId = this.encrptdecrpt.getItem("prject_id");
    this.selecterUser = loggedIn.user_id;
    this.userMessage = "";
    if (this.Count > 0) {
      clearInterval(this.interval);
      // The below if condition is addded for listing the images ticket number 1364 
      if(this.finalArray[this.iu].progressEnable==true)
      {
        this.iu = this.iu + 1;
        this.Count = this.Count - 1;
        return this.uploadStubs();
      }
      this.finalArray[this.iu].progressEnable = true;
      this.finalArray[this.iu].progress = 0;
      this.filetype = this.finalArray[this.iu].filetype;
      console.log(this.file_type);
      if (this.filetype == "jpg" || this.filetype == "JPG" || this.filetype == "JPEG" || this.filetype == "jpeg" || this.filetype == "bmp" || this.filetype == "BMP" || this.filetype == "gif" || this.filetype == "GIF" || this.filetype == "png" || this.filetype == "PNG" || this.filetype == "heic" || this.filetype == "HEIC") {
        if (this.multipleSelectOn == false) {
          this.interval = setInterval(() => {
            if (this.iu<this.finalArray.length && this.finalArray[this.iu].progress >= 100) {
              clearInterval(this.interval);
            } else if(this.finalArray[this.iu] != undefined && this.finalArray[this.iu].progress < 100) {
              this.finalArray[this.iu].progress++;
            }
          }, 15);
        }
        if (this.mediumStub == "") {
          if (this.multipleSelectOn == false) {
            console.log("test")
            // this.finalArray[this.iu].filename = this.dataService.changeFormat(this.finalArray[this.iu].filename);
            // console.log(this.finalArray[this.iu].file[0],this.finalArray[this.iu].file.name);
            // this.finalArray[this.iu].file.name = this.dataService.changeFormat(this.finalArray[this.iu].file.name);
            this.annotationmediaservice.annotationMedia(this.finalArray[this.iu].file, this.annotation_id, this.finalArray[this.iu].media_id).subscribe((res) => {
              console.log(res);
              if (res.response_code == 200 && this.finalArray[this.iu] != undefined) {
                this.finalArray[this.iu].progress = 100;
                this.finalArray[this.iu].tick = true;
                this.responceArray.push({ 'mediaUrl': res.response_body.path, 'filename': this.finalArray[this.iu].filename, 'mediaId': this.finalArray[this.iu].media_id, 'annotationId': this.annotation_id, 'stubId': this.finalArray[this.iu].stub_id, 'media_type': 'image' });
              }
              else if(this.finalArray[this.iu] != undefined) {
                this.finalArray[this.iu].progress = 10;
                this.finalArray[this.iu].progressEnable = false
                this.finalArray[this.iu].dbmessage = true
                this.message1 = "Error! Upload failed, Try again";
              }
              this.iu = this.iu + 1;
              this.Count = this.Count - 1;
              this.uploadStubs();
            });
          }
          else {
            let count = this.multiselectionList.length;
            let index = 0;
            this.multipleImagesUpload(count, index);
          }
        }
        else {
          this.annotationmediaservice.annotationMedia(this.finalArray[this.iu].file, this.annotation_id, this.finalArray[this.iu].media_id).subscribe((res) => {
            
            console.log(res);
            if (res.response_code == 200) {
              this.done=true;
              this.finalArray[this.iu].progress = 100;
              this.finalArray[this.iu].tick = true;
              this.responceArray.push({ 'mediaUrl': res.response_body.path, 'filename': this.FileName, 'mediaId': this.finalArray[this.iu].media_id, 'annotationId': this.annotation_id, 'stubId': this.finalArray[this.iu].stub_id, 'media_type': 'stub' });
            }
            else {
              this.finalArray[this.iu].progress = 10;
              this.finalArray[this.iu].progressEnable = false;
              this.finalArray[this.iu].dbmessage = true;
              this.message1 = "Error! Upload failed, Try again";
            }
            this.iu = this.iu + 1; 
            this.Count = this.Count - 1;
            this.uploadStubs();
          });
        }
      }
      else {
        this.finalArray[this.iu].progressEnable = false;
        this.finalArray[this.iu].message = true;
        this.message = "Error! File is not valid";
        this.iu = this.iu + 1;
        this.Count = this.Count - 1;
        this.uploadStubs()
      }
    }
    else {
      this.done=true;
      this.show = false;
      clearInterval(this.interval);
    }

  }


  multipleImagesUpload(count, index) {
    if (count > 0) {
      console.log(this.responceArray);
      let mediaidgenerate = this.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
      this.annotationmediaservice.annotationMedia(this.finalArray[this.iu].file, this.multiselectionList[index].annotation_id, mediaidgenerate).subscribe((res) => {
        console.log(res);
        if (res.response_code == 200 && this.finalArray[this.iu]!=undefined) {
          let fint_percentage = 100 / count;
          console.log(fint_percentage);
          console.log(this.finalArray[this.iu].progress, this.iu);
          this.interval = setInterval(() => {
            if (this.finalArray[this.iu] != undefined) {
              if (this.finalArray[this.iu].progress >= fint_percentage) {
                clearInterval(this.interval);
              } else if(this.finalArray[this.iu] != undefined) {
                this.finalArray[this.iu].progress++;
              }
            }
            else {
              clearInterval(this.interval);
            }
          }, 20);
          if (count == 1 && this.finalArray[this.iu] != undefined) {
            do {
              this.finalArray[this.iu].progress++;
              if (this.finalArray[this.iu].progress == 100) {
                this.finalArray[this.iu].tick = true;
              }
            } while (this.finalArray[this.iu].progress <= 100);
          }
          let stubidgenerate = this.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();
          this.responceArray.push({ 'mediaUrl': res.response_body.path, 'filename': this.finalArray[this.iu].filename, 'mediaId': mediaidgenerate, 'annotationId': this.multiselectionList[index].annotation_id, 'stubId': stubidgenerate, 'media_type': 'image' });
        }
        else {
          if (index == 0) {
            this.finalArray[this.iu].progress = 10;
            this.finalArray[this.iu].progressEnable = false;
            this.finalArray[this.iu].dbmessage = true;
            this.message1 = "Error! Upload failed, Try again";
          }
        }
        count = count - 1;
        index = index + 1;
        this.multipleImagesUpload(count, index);
        if (count == 0) {
          this.iu = this.iu + 1;
          this.Count = this.Count - 1;
          this.uploadStubs();
        }
      }, (error) => {
        console.log(error);
      });
    }
  }
  closeBox() {

    // The below boolean is added for ticket number 1364 by Abarajithan
    this.doneButtonclicked=true;
    this.dialogbox.close({ data: this.responceArray });
    this.dialog.closeAll();
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


