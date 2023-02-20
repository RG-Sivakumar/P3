import { Component, OnInit, Inject } from "@angular/core";
import { DocumenttagService } from "../../services/documenttag.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as _ from "lodash";
import { ShapeService } from "../../services/shape.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
@Component({
  selector: "app-document-managetag",
  templateUrl: "./document-managetag.component.html",
  styleUrls: ["./document-managetag.component.css"],
})
export class DocumentManagetagComponent implements OnInit {
  pageTaglist: any;
  Page_Id: any;
  tagdefault: any = "";
  loader: boolean = false;
  taglist: string[];
  documentTagList: any;
  projectid: string;
  userrole: string;
  constructor(
    public service: DocumenttagService,
    public dialogbox: MatDialogRef<DocumentManagetagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private shapeservice:ShapeService,public userRoleGlobal: GlobalUserRoleService,
    private _snackBar:MatSnackBar,
    private dataService:DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    console.log(data);
    this.projectid=this.encrptdecrpt.getItem("projectIdlocal")
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    this.Page_Id = this.data.pageid;
    this.service.getPageTag(this.Page_Id).subscribe((data) => {
      console.log(data);
      if (data.response_code == 200) {
        let gettags = data["response_body"]["layer_page_tags"];
        if (gettags.length > 0) {
          data["response_body"]["layer_page_tags"] = this.dataService.changeSpecialtokeyformatList(gettags, 'documentmanagetags');
        }
        this.documentTagList = data["response_body"]["layer_page_tags"];
      }
      
    });
  }
  btnDisabled=false;
  input()
  {
    this.btnDisabled=false;
  }
  ngOnInit(): void {}

  AddTag(layer_page_tag_name,keyvalue) {
    this.btnDisabled=true;
    this.loader = true;
    var tagses = layer_page_tag_name.trim();
    if(tagses==undefined || tagses==""){
      this.dialogbox.close()
    }
    console.log(tagses);
    var filterTagsArray = [];
    let tagArrayComma = tagses.split(",");
    var tagArray = [];
    console.log(tagArrayComma);
    let tagArrayUnique: string = tagArrayComma.filter((value, index) => {
      return tagArrayComma.indexOf(value) === index;
    });
    let uniquesCase = _.uniqWith(
      tagArrayUnique,
      (a, b) => a.toLowerCase() === b.toLowerCase()
    );
    uniquesCase.forEach((element) => {
      tagArray.push(element);
    });
    console.log(tagArray);
    for (var i = 0; i < tagArray.length; i++) {
      if (this.documentTagList != undefined) {
        var a = 0;
        for (var j = 0; j < this.documentTagList.length; j++) {
          if (
            tagArray[i].toLowerCase() == this.documentTagList[j]["layer_page_tag_name"].toLowerCase()) {
            a = -3;
          } else if (tagArray[i] == " " || tagArray[i] == "") {
            a = -3;
          } else {
            a++;
            console.log(a);
          }
        }
        if (a == this.documentTagList.length) {
          filterTagsArray.push(tagArray[i]);
        }
      } else {
        for (var i = 0; i < tagArray.length; i++) {
          filterTagsArray.push(tagArray[i]);
        }
      }
      filterTagsArray = filterTagsArray.filter((element) => {
        return element.trim() != "";
      });
    }
    var convertStringTags = "";
    for (var l = 0; l < filterTagsArray.length; l++) {
      filterTagsArray[l] = filterTagsArray[l].trim();
      let firsttypeLetter = filterTagsArray[l][0].toUpperCase();
      let othertypeletters = filterTagsArray[l].slice(1);
      let changeUpperCaseProjectName = firsttypeLetter+othertypeletters;
      console.log(changeUpperCaseProjectName);
      filterTagsArray[l] = changeUpperCaseProjectName;
      convertStringTags = convertStringTags + filterTagsArray[l];
      if (filterTagsArray.length - 1 != l) {
        convertStringTags = convertStringTags + ",";
      }
      console.log(convertStringTags);
    }
    if (filterTagsArray.length > 0) {
      convertStringTags = this.dataService.changeFormat(convertStringTags);
      this.service.AddPageTag(this.Page_Id, convertStringTags).subscribe((res) => {
        if(res["response_code"]=="200"){
          this.service.filter("Register Click");
          console.log(res);
          this.tagdefault = "";
          this.loader = false;
          let gettags = res["response_body"]["annotation_tags"];
          if(gettags.length>0){
            res["response_body"]["annotation_tags"] = this.dataService.changeSpecialtokeyformatList(gettags,'documentmanagetags');
          }
          this.documentTagList = res["response_body"]["annotation_tags"];
          if(keyvalue=='savekey'){
            this.dialogbox.close();
          }
        }
        else{
          this.loader=false;
          this._snackBar.open('Sync is an error', null,
            {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
        }
        });
    } else {
      this.loader = false;
    }
  }

  close() {
    this.dialogbox.close();
  }
  deletetag(layer_page_tag_id) {
    this.loader=true;
    this.documentTagList = this.documentTagList.filter((item) => {
      return item["layer_page_tag_id"] !== layer_page_tag_id;
    });
    this.service.RemovePageTag(this.Page_Id, layer_page_tag_id).subscribe((res) => {
        console.log(res);
        if(res["response_code"]==200){
          this.loader=false;
        }
        else{
          this.loader=false;
          this._snackBar.open('Sync is an error', null,
            {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
        }
      });
  }

  firstLetterCapital(word){
    if(word){
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter+othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.tagdefault = changeUpperCaseProjectName;
    }
  }
}
