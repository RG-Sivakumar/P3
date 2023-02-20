import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataService } from "src/app/data.service";

import { DataserviceService } from "src/app/document/services/dataservice.service";

@Component({
  selector: "app-renamemedia",
  templateUrl: "./renamemedia.component.html",
  styleUrls: ["./renamemedia.component.css"],
})
export class RenamemediaComponent implements OnInit {
  filename: string = "";
  pageName: string;
  stubid: string;
  placeholderValue: string = "";
  stubData:any = "";
  layerdatas: any;
  getId: any;
  constructor(
    private dialo: MatDialogRef<RenamemediaComponent>,
    public dataService: DataserviceService,
    private dataServiceText:DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    let getData1 = data.stubData;
    this.layerdatas= data.LayerDatas;
    this.getId=data.getId;
    this.placeholderValue = getData1.media_name;
    // this.filename = data.media_filename;
    this.stubData = data.stubData;
    console.log(this.stubData);
  }

  ngOnInit(): void { }
  closeBox() {
    this.dialo.close();
  }
  rename(filename) {
    // var temp=filename;
    filename=this.duplicateCheckRename(filename);
    // var ext = filename.substr(filename.lastIndexOf('.') + 1);
    // var tempFileName = filename.split('.');
    // var tempFileName1 = tempFileName[0];
    // if (ext != filename && ext == "jpg") {
    //   filename = filename.trim();
    // } else if(tempFileName1!=""){
    //   filename = tempFileName1.trim() 
    // }
    // else
    // {
    //   filename=temp;
    // }

    let renameData: any = { filename: filename, stubId: this.stubData.stub_id, annotation_id:this.stubData.annotation_id };
    this.dataService.sendMessageMedia(renameData);
    this.dialo.close();
  }

  firstLetterCapital(word) {
    console.log(word);
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.filename = changeUpperCaseProjectName;
    }
    console.log(this.filename);
  }
  
  duplicateCheckRename(word){
    for(let i=0;i<this.layerdatas.length;i++){
      for(let j=0;j<this.layerdatas[i].annotations.length;j++){
        if(this.layerdatas[i].annotations[j].annotation_id==this.getId){
          var currentAnnotationMediaData=this.layerdatas[i].annotations[j].annotation_media;
          for(let a=0;a<currentAnnotationMediaData.length;a++){
            var duplicateName = currentAnnotationMediaData.filter(ele => ele.media_name.split("(")[0].trim() === word.trim());
          }
          if(duplicateName.length>0){
            var labelText=word + " (" + duplicateName.length  + ")";
            return labelText;
          }
          else{
            labelText = word;
            return labelText;
          }
        }
      }
    }
  }
}
