import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormnameService } from "src/app/formname.service";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { Router, RouterEvent } from "@angular/router";
import * as _ from 'lodash';
import { MatSnackBar } from "@angular/material/snack-bar";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-tagmedia",
  templateUrl: "./tagmedia.component.html",
  styleUrls: ["./tagmedia.component.css"],
})
export class TagmediaComponent implements OnInit {
  stubdata: string;
  stubid: any;
  tags: any[];
  tagdefault: string = "";
  layerDatas: any;
  loader: boolean = false;
  getId: string;
  remove: boolean = false;
  mediacount: any;
  activeLayerIdDraw: any;
  constructor(
    private dialo: MatDialogRef<TagmediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public messageService: FormnameService,
    private documentService: CreateDocumentService,
    private dataService: DataserviceService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public userRoleGlobal: GlobalUserRoleService,
    private dataServiceText:DataService
  ) {
    this.mediacount = this.data.mediiacount;
    this.layerDatas = this.data.layerDatas;
    this.activeLayerIdDraw = this.data.activeLayerIdDraw
    console.log(this.remove)
    this.stubdata = data.stubData;
    this.getId = this.data.getId;
    this.stubid = this.data.stubId;
    if (this.layerDatas != undefined) {
      console.log(this.layerDatas);
      for (var i = 0; i < this.layerDatas.length; i++) {
        var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
        if(currentAnnotationData.length>0){
        let StubData = currentAnnotationData[0].annotation_media.filter(item => item.stub_id == this.stubid);
        if (StubData.length > 0) {
          var gettags = StubData[0].media_tags;
          if (gettags != undefined) {
            if (gettags.trim() != "") {
              this.tags = gettags.split(",");
            } else {
              this.tags = [];
            }
          }
          break;
        }
      }
      }
    } else {
      this.tags = [];
    }
  }
  ngOnInit(): void { }

  matching(form_tag_name, loader){
    
    for(let i=0; i <= this.tags.length ; i++){
    if(this.tagdefault==this.tags[i]){
      this.tagdefault="";
      console.log("empty");
    }else{
      this.Addingtag(form_tag_name, loader);
      console.log("loading");
    }
  }
  }
  
  match(form_tag_name, loader){
    
    for(let i=0; i <= this.tags.length ; i++){
    if(this.tagdefault==this.tags[i]){
      this.tagdefault="";
      console.log("empty");
      this.dialo.close();
    }else{
      this.Addtag(form_tag_name, loader);
      console.log("loading");
    }
  }
  }

  Addtag(form_tag_name, loader) {
    this.remove = false;
    var tagses = form_tag_name.value.trim();
    console.log(tagses);
    var filterTagsArray = [];
    let tagArrayComma = tagses.split(",");
    var tagArray = [];
    this.loader = loader;
    console.log(tagArrayComma);
    var tagArrayUnique = tagArrayComma.filter((value, index) => {
      return tagArrayComma.indexOf(value) === index;
    });
    let uniquesCase = [];
    tagArrayUnique.forEach((e) => {
      if (
        uniquesCase.findIndex((r) => {
          return r.trim().toLowerCase() === e.trim().toLowerCase();
        }) === -1
      )
        uniquesCase.push(e);
    });
    console.log(uniquesCase);
    uniquesCase.forEach((element) => {
      tagArray.push(element);
    });
    console.log(tagArray);
    for (var i = 0; i < tagArray.length; i++) {
      if (this.tags != undefined) {
        var a = 0;
        for (var j = 0; j < this.tags.length; j++) {
          if (
            tagArray[i].trim().toLowerCase() ==
            this.tags[j].trim().toLowerCase()
          ) {
            a--;
          } else if (tagArray[i].trim() == "") {
            a--;
          } else {
            a++;
            console.log(a);
          }
        }
        if (a == this.tags.length) {
          filterTagsArray.push(tagArray[i]);
        }
      } else {
        for (var i = 0; i < tagArray.length; i++) {
          filterTagsArray.push(tagArray[i]);
        }
      }
      console.log(filterTagsArray);
      console.log(tagses);
      console.log(this.tags);
      filterTagsArray = filterTagsArray.filter((element) => {
        return element.trim() != "";
      });
      console.log(filterTagsArray);
    }
    var convertStringTags = "";
    for (var l = 0; l < filterTagsArray.length; l++) {
      let firsttypeLetter = filterTagsArray[l][0].toUpperCase();
      let othertypeletters = filterTagsArray[l].slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      filterTagsArray[l] = changeUpperCaseProjectName;
      convertStringTags = convertStringTags + filterTagsArray[l].trim();
      if (filterTagsArray.length - 1 != l) {
        convertStringTags = convertStringTags + ",";
      }
      console.log(convertStringTags);
    }

    if (filterTagsArray.length > 0) {
      let layers = [];
      // this.loader = false;
      var currentSplitedTags = "";

      if (this.layerDatas != undefined) {
        for (var i = 0; i < this.layerDatas.length; i++) {
          var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
          if (currentAnnotationData.length > 0) {
            this.dataService.sendMediaTagsMessage(currentAnnotationData[0]);
            let StubData = currentAnnotationData[0].annotation_media.filter(item => item.stub_id == this.stubid);
            if (StubData.length > 0) {
              StubData[0].is_changed = true;
              StubData[0].last_updated_date = new Date().toISOString();
              if (StubData[0].media_tags == "") {
                StubData[0].media_tags = convertStringTags
              } else {
                StubData[0].media_tags = StubData[0].media_tags + "," + convertStringTags
              }
              this.tagdefault = "";
              currentSplitedTags = StubData[0].media_tags;
            }
          }
        }
        this.tags = currentSplitedTags.split(",");
        let pass_data = {layer_data:this.layerDatas,ids:-1};
        this.dataService.mediaTagsUpdate.emit(pass_data);
        this.router.events.forEach((event) => {
          if (event instanceof RouterEvent) {
            if (event["url"].includes("document/previewImage")) {
              this.dataService.searchLayerDatas.emit(this.layerDatas);
            }
          }
        });
        let generateCloneLayer = _.cloneDeep(this.layerDatas);
        this.documentService.annotationUpdateForm1(generateCloneLayer, this.getId, this.activeLayerIdDraw,'media').subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
            this.dialo.close();
            this.loader = false;
            
          }
          else {
            this.errorMessage();
          }
        });
        // this.documentService
        //   .annotationUpdateAUC(layers)
        //   .subscribe((response) => {
        //     console.log(layers);
        //     console.log(response);
        //     console.log(response["response_code"]);
        //     // if (response["response_code"] == 200) {
        //     //   this.dataService.mediaTagsUpdate.emit(this.layerDatas);
        //     // }
        //   });
      }
    }
    else{
      this.loader=false;
    }
  }
  Addingtag(form_tag_name, loader) {
    this.remove = false;
    var tagses = form_tag_name.value.trim();
    console.log(tagses);
    var filterTagsArray = [];
    let tagArrayComma = tagses.split(",");
    var tagArray = [];
    this.loader = loader;
    console.log(tagArrayComma);
    var tagArrayUnique = tagArrayComma.filter((value, index) => {
      return tagArrayComma.indexOf(value) === index;
    });
    let uniquesCase = [];
    tagArrayUnique.forEach((e) => {
      if (
        uniquesCase.findIndex((r) => {
          return r.trim().toLowerCase() === e.trim().toLowerCase();
        }) === -1
      )
        uniquesCase.push(e);
    });
    console.log(uniquesCase);
    uniquesCase.forEach((element) => {
      tagArray.push(element);
    });
    console.log(tagArray);
    for (var i = 0; i < tagArray.length; i++) {
      if (this.tags != undefined) {
        var a = 0;
        for (var j = 0; j < this.tags.length; j++) {
          if (
            tagArray[i].trim().toLowerCase() ==
            this.tags[j].trim().toLowerCase()
          ) {
            a--;
          } else if (tagArray[i].trim() == "") {
            a--;
          } else {
            a++;
            console.log(a);
          }
        }
        if (a == this.tags.length) {
          filterTagsArray.push(tagArray[i]);
        }
      } else {
        for (var i = 0; i < tagArray.length; i++) {
          filterTagsArray.push(tagArray[i]);
        }
      }
      console.log(filterTagsArray);
      console.log(tagses);
      console.log(this.tags);
      filterTagsArray = filterTagsArray.filter((element) => {
        return element.trim() != "";
      });
      console.log(filterTagsArray);
    }
    var convertStringTags = "";
    for (var l = 0; l < filterTagsArray.length; l++) {
      let firsttypeLetter = filterTagsArray[l][0].toUpperCase();
      let othertypeletters = filterTagsArray[l].slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      filterTagsArray[l] = changeUpperCaseProjectName;
      convertStringTags = convertStringTags + filterTagsArray[l].trim();
      if (filterTagsArray.length - 1 != l) {
        convertStringTags = convertStringTags + ",";
      }
      console.log(convertStringTags);
    }

    if (filterTagsArray.length > 0) {
      let layers = [];
      // this.loader = false;
      var currentSplitedTags = "";

      if (this.layerDatas != undefined) {
        for (var i = 0; i < this.layerDatas.length; i++) {
          var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
          if (currentAnnotationData.length > 0) {
            this.dataService.sendMediaTagsMessage(currentAnnotationData[0]);
            let StubData = currentAnnotationData[0].annotation_media.filter(item => item.stub_id == this.stubid);
            if (StubData.length > 0) {
              if (StubData[0].media_tags == "") {
                StubData[0].media_tags = convertStringTags
              } else {
                StubData[0].media_tags = StubData[0].media_tags + "," + convertStringTags
              }
              this.tagdefault = "";
              currentSplitedTags = StubData[0].media_tags;
            }
          }
        }
        this.tags = currentSplitedTags.split(",");
        let pass_data = {layer_data:this.layerDatas,ids:-1};
        this.dataService.mediaTagsUpdate.emit(pass_data);
        this.router.events.forEach((event) => {
          if (event instanceof RouterEvent) {
            if (event["url"].includes("document/previewImage")) {
              this.dataService.searchLayerDatas.emit(this.layerDatas);
            }
          }
        });
        let generateCloneLayer = _.cloneDeep(this.layerDatas);
        this.documentService.annotationUpdateForm1(generateCloneLayer, this.getId, this.activeLayerIdDraw,"media").subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
           
            this.loader = false;
            
          }
          else {
            this.errorMessage();
          }
        });
        // this.documentService
        //   .annotationUpdateAUC(layers)
        //   .subscribe((response) => {
        //     console.log(layers);
        //     console.log(response);
        //     console.log(response["response_code"]);
        //     // if (response["response_code"] == 200) {
        //     //   this.dataService.mediaTagsUpdate.emit(this.layerDatas);
        //     // }
        //   });
      }
    }
    else{
      this.loader=false;
    }
  }

  errorMessage() {
    this.loader = false;
    this._snackBar.open('Sync is an error', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }

  deleteTag(indexValue) {
    this.loader = true;
    for (var i = 0; i < this.tags.length; i++) {
      if (i == indexValue) {
        var a = this.tags.splice(i, 1);
        var removeTagString = this.tags.toString();
      }
      if (removeTagString == '') {
        this.remove = true;
        console.log(this.remove)
      }
      else {
        this.remove = false;
        console.log(this.remove)
      }
    }
    if (this.layerDatas != undefined) {
      let layers = [];
      var currentSplitedTags1 = "";
      for (var i = 0; i < this.layerDatas.length; i++) {
        let findAnnotationIndex = this.layerDatas[i].annotations.findIndex((Adata) => Adata.annotation_id == this.getId);
        if (findAnnotationIndex!= -1) {
          this.dataService.sendMediaTagsMessage(this.layerDatas[i].annotations[findAnnotationIndex]);
          let findStubIndex = this.layerDatas[i].annotations[findAnnotationIndex].annotation_media.findIndex((SData) => SData.stub_id == this.stubid);
          if (findStubIndex != -1) {
            this.layerDatas[i].annotations[findAnnotationIndex].annotation_media[findStubIndex].media_tags = removeTagString;
            currentSplitedTags1 = this.layerDatas[i].annotations[findAnnotationIndex]
              .annotation_media[findStubIndex].media_tags;
            console.log(currentSplitedTags1);
            break;
          }
        }
        layers.push(this.layerDatas[i]);
      }
      // this.layerDatas = layers;
      this.tags = currentSplitedTags1.split(",");
      let pass_data = {layer_data:this.layerDatas,ids:-1};
      this.dataService.mediaTagsUpdate.emit(pass_data);
      this.router.events.forEach((event) => {
        if (event instanceof RouterEvent) {
          if (event["url"].includes("document/previewImage")) {
            this.dataService.searchLayerDatas.emit(this.layerDatas);
          }
        }
      });
      
        let generateCloneLayer = _.cloneDeep(this.layerDatas);
        this.documentService.annotationUpdateForm1(generateCloneLayer, this.getId, this.activeLayerIdDraw,'media').subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
            this.loader = false;
          }
          else {
            this.errorMessage();
          }
        });
        // this.documentService.annotationUpdateAUC(layers).subscribe((response) => {
        //   console.log(response);
        //   console.log(layers);
        //   console.log(response["response_code"]);
        //   // this.tags = currentSplitedTags1.split(",");
        //   // if (response["response_code"] == 200) {
        //   //   this.dataService.mediaTagsUpdate.emit(this.layerDatas);
        //   // }
        // });
    }
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      this.tagdefault = changeUpperCaseProjectName;
    }
  }

  close() {
    this.dialo.close();
  }
}
