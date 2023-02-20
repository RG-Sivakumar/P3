import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { v1 as uuidv1 } from "uuid";

@Component({
  selector: 'app-uploadcomplete',
  templateUrl: './uploadcomplete.component.html',
  styleUrls: ['./uploadcomplete.component.css']
})
export class UploadcompleteComponent implements OnInit {

  successFiles:any = [];
  failedFiles:any = [];
  rows:any = [];
  headerList:any = "S.No,Filename,Status";
  mergeList:any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogbox:MatDialogRef<UploadcompleteComponent>) { 
    this.successFiles = data.success;
    this.failedFiles = data.failure;
    this.mergeList = [...this.successFiles,...this.failedFiles];
    console.log(data);
  }



  ngOnInit(): void {
  }

  ConvertToCSV() {
    let array = this.mergeList;
    let str = "";
    let row = this.headerList;
    str += row + '\n';
    if (!array || !array.length) {
      return;
    }
    for (let i = 0; i < array.length; i++) {
      let line = '' + '';
      var cnt =1;
      let status = array[i].tick == false ? "Photos without Stubs" : "Photos Reconciled";
      array[i].progress = status;
      line += '"' + (i+1) + '",'+'"' + array[i].filename + '",'+'"' + array[i].progress + '",';
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }

  closeBox(){
    this.dialogbox.close();
  }

  downloadCSV(){
    let csvData = this.ConvertToCSV();
      let replaceData = csvData.replace(/’/g, "'").replace(/“/g, "''");
      console.log(replaceData);
      let blob = new Blob(['\ufeff' + replaceData], { type: 'text/csv;charset=utf-8;' });
      let dwldLink = document.createElement("a");
      let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", url);
      dwldLink.setAttribute("download", 'stub-reconcili-status-'+uuidv1()+".csv");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
  }
}
