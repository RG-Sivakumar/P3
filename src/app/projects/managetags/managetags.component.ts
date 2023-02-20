import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { tr } from "date-fns/locale";
import { MoreoptionService } from "../services/moreoption.service";
import * as _ from "lodash";
import { DataService } from "src/app/data.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
@Component({
  selector: "app-managetags",
  templateUrl: "./managetags.component.html",
  styleUrls: ["./managetags.component.css"],
})
export class ManagetagsComponent implements OnInit {
  getName: string = "";
  getRename: any = "";
  folderId: string;
  foldertaglist: string[];
  loader: boolean = false;
  getAlltaglist: any;
  localvalue = this.encrptdecrpt.getItem("loggedIn");
  userId: any;
  projectid: string;
  userrole: string;


  constructor(
    private dialogclose: MatDialogRef<ManagetagsComponent>,public userRoleGlobal:GlobalUserRoleService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private moreoptionservice: MoreoptionService,
    private dataService: DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    var receiveData = this.data;
    this.folderId = receiveData.folderId;
    this.getAlltaglist = receiveData.getAlltaglist;
    if (this.getAlltaglist != undefined && this.getAlltaglist.length > 0) {
      console.log(this.getAlltaglist);
      let filterTags = this.getAlltaglist.filter((data) => {
        return data.folder_id == this.folderId
      });
      this.foldertaglist = filterTags.length > 0 ? filterTags : [];
    }
    else {
      this.foldertaglist = [];
    }
  }

  ngOnInit(): void {
    this.userId = this.localvalue.user_id
    // this.moreoptionservice
    //   .getFolderTag(this.folderId)
    //   .subscribe((res) => {
    //     this.foldertaglist = res["response_body"]["folder_tags"];
    //   })
  }
  btnDisabled = false;

  AddTag(tagValue, loader) {
    if (this.loader == false) {
      this.loader = loader;
      // var tagses = form_tag_name.value.replace(/,\s*$/, "");
      var tagses = tagValue.trim();
      // tagses = this.dataService.changeFormat(tagses)
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
        tagArray.push(element.trim());
      });
      console.log(tagArray);
      for (var i = 0; i < tagArray.length; i++) {
        if (this.foldertaglist != undefined) {
          var a = 0;
          for (var j = 0; j < this.foldertaglist.length; j++) {
            if (
              tagArray[i].toLowerCase() == this.foldertaglist[j]["folder_tag_name"].toLowerCase()
            ) {
              // alert("duplicate" + tagArray[i]);
              a = -3;
            } else if (tagArray[i] == " " || tagArray[i] == "") {
              a = -3;
            } else {
              a++;
              console.log(a);
            }
          }
          if (a == this.foldertaglist.length) {
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
        let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
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
        this.moreoptionservice
          .addTagname(this.folderId, convertStringTags)
          .subscribe((res) => {
            this.getRename = "";
            this.loader = false;
            let getresponse_special_character = res["response_body"]["folder_tags"];
            if (res["response_body"]["folder_tags"].length > 0) {
              let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character, 'taglist');
              console.log(change_character_list);
              res["response_body"]["folder_tags"] = change_character_list;
            }
            this.foldertaglist = res["response_body"]["folder_tags"];
            this.moreoptionservice.filter("Register Click");
          });
      } else {
        this.loader = false;
        this.getRename = "";
      }
    }
  }

  removeTag(foldertagid) {
    for (let i = 0; i < this.foldertaglist.length; i++) {
      if (this.foldertaglist[i]["folder_tag_id"] == foldertagid) {
        this.foldertaglist.splice(i, 1);
      }
    }

    // this.foldertaglist = this.foldertaglist.filter((item) => {
    //   return item["folder_tag_id"] !== foldertagid;
    // });

    this.moreoptionservice
      .removeClickTag(this.folderId, foldertagid)
      .subscribe((res) => {
        console.log(res);
        this.moreoptionservice.filter("registerclick");
      });
    // this.getFolderTagList(this.folderId);
  }

  // getFolderTagList(folderid){
  //   this.moreoptionservice.getFolderTag(folderid).subscribe(res=>{
  //
  //     this.foldertaglist=res['response_body']['folder_tags'];
  //
  //     this.moreoptionservice.filter('Register Click');
  //   });
  // }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.getRename = changeUpperCaseProjectName;
    }
  }

  saveButtonTrigger(project_tag_name, loader) {
    if (project_tag_name.trim() != "") {
      this.AddTag(project_tag_name, loader);
    }
    this.dialogclose.close();
  }

  closeBox() {
    this.dialogclose.close();
  }
}
