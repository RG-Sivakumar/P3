import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { Observable, Observer } from 'rxjs';

import { DataimageService } from 'src/app/dataimage.service';
import { environment } from "src/environments/environment.prod";


@Component({
  selector: 'app-previewimagedownloadpopup',
  templateUrl: './previewimagedownloadpopup.component.html',
  styleUrls: ['./previewimagedownloadpopup.component.css']
})
export class PreviewimagedownloadpopupComponent implements OnInit {
  imgurl: any
  imagedata: any;
  readonly APIBaseUrl = environment.APIBaseUrl;

  print: boolean = false;
  imageset: any;
  sKey1: string;
  baseUrl: string;
  sKey2: string;
  base64Image: string;
  constructor(private dialogClose: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public imgdataService: DataimageService, public http: HttpClient) {
    this.imgurl = this.data.img_url
    this.imageset = this.data.imageset
    this.baseUrl = environment.APIBaseUrl + "get_web_singed_file?file=";
    this.sKey1 = "&key1=" + this.imgdataService.securityKey1();
    this.sKey2 = "&key2=" + this.imgdataService.securityKey2();
    this.imagedata = this.APIBaseUrl + "get_web_singed_file?file=" + this.imgurl + "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
    console.log(this.imagedata);
  }

  ngOnInit(): void {
    // this.getBase64ImageFromURL(this.imagedata).subscribe(base64data => {    
    //   console.log(base64data);
    //   // this is the image as dataUrl
    //   this.base64Image = 'data:image/jpg;base64,' + base64data;
    // });
    //  this.http.get(this.imagedata, { responseType: "blob" }).subscribe(val => {
    //  console.log(val);
    //    const url = this.imagedata.createObjectURL(val);
    // this.download(this.imagedata, 'image.png');
    //    URL.revokeObjectURL(this.imagedata);
    // });
  }
  // download(){
  //   window.location =this.imagedata;

  // }
  //  download(url: string, fileName: string) {
  //  const a: any = document.createElement('a');
  // a.href = this.imagedata;
  //  a.download = 'hello';
  // document.body.appendChild(a);
  //  a.style = 'display: none';
  //  a.click();
  //  };

  // getBase64ImageFromURL(url: string) {
  //   return Observable.create((observer: Observer<string>) => {
  //     // create an image object
  //     let img = new Image();
  //     img.crossOrigin = 'Anonymous';
  //     img.src =this.imagedata;
  //     if (!img.complete) {
  //         // This will call another method that will create image from url
  //         img.onload = () => {
  //         observer.next(this.getBase64Image(img));
  //         observer.complete();
  //       };
  //       img.onerror = (err) => {
  //          observer.error(err);
  //       };
  //     } else {
  //         observer.next(this.getBase64Image(img));
  //         observer.complete();
  //     }
  //   });

  // }

  

  handleErrors(response) {
    console.log(response);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

  toDataURL(url) {
    // this.dialogClose.closeAll()
    return fetch(url)
    .then((response) => {
      return response.blob();
    }).then(blob => {
      return URL.createObjectURL(blob);
    });
  }
  
  async download() {
    const a = document.createElement("a");
    a.href = await this.toDataURL(this.imagedata);
    a.download = this.data.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  Print() {
    window.print()
  }
  closeBox() {
    this.dialogClose.closeAll()
  }
}

