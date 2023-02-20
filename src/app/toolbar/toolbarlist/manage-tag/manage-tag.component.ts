import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToolbarlistService } from "../../services/toolbarlist.service";
import * as _ from "lodash";
import { DataService } from "src/app/data.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
@Component({
  selector: "app-manage-tag",
  templateUrl: "./manage-tag.component.html",
  styleUrls: ["./manage-tag.component.css"],
})
export class ManageTagComponent implements OnInit {
  projectId: string;
  toolbarId: string;
  toolbarTagNames: any = "";
  toolbarTagList: string[];
  loader: boolean = false;
  userrole:string;
  projectid: string;

  constructor(
    private dialogclose: MatDialogRef<ManageTagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toolbarService: ToolbarlistService,public userRoleGlobal:GlobalUserRoleService,
    private dataService: DataService,
    private encrptdecrpt:EncryptDecryptService
  ) {

    var receiveData = this.data;
    this.projectId = receiveData.projectId;
    this.toolbarId = receiveData.toolbarId;
    this.toolbarTagList = receiveData.toolbarTagList;
    console.log(this.toolbarTagList);
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    console.log(this.userrole)

  
  }

  ngOnInit(): void { }
  btnDisabled = false;
  input() {
    this.btnDisabled = false;
  }
  addTags(tagValue, loader) {

    if (this.loader == false) {
      this.loader = loader;
      var tagses = tagValue.trim();
      // tagses = this.dataService.changeFormat(tagses);
      console.log(tagses);
      var filterTagsArray = [];
      this.loader = true;
      let tagArrayComma = tagses.split(",");
      var tagArray = [];
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
      // let uniquesCase = _.uniqWith(tagArrayUnique, (a,b) => a.toLowerCase() === b.toLowerCase())
      uniquesCase.forEach((element) => {
        tagArray.push(element);
      });
      console.log(tagArray);
      for (var i = 0; i < tagArray.length; i++) {
        if (this.toolbarTagList != undefined) {
          var a = 0;
          for (var j = 0; j < this.toolbarTagList.length; j++) {
            if (
              tagArray[i].trim().toLowerCase() ==
              this.toolbarTagList[j]["toolbar_tag_name"].trim().toLowerCase()
            ) {
              // alert('duplicate' + tagArray[i]);
              a--;
            } else if (tagArray[i].trim() == "") {
              a--;
            } else {
              a++;
              console.log(a);
            }
          }
          if (a == this.toolbarTagList.length) {
            filterTagsArray.push(tagArray[i]);
          }
        } else {
          for (var i = 0; i < tagArray.length; i++) {
            filterTagsArray.push(tagArray[i]);
          }
        }
        console.log(filterTagsArray);
        console.log(tagses);
        console.log(this.toolbarTagList);
        filterTagsArray = filterTagsArray.filter((element) => {
          return element.trim() != "";
        });
        console.log(filterTagsArray);
      }
      var convertStringTags = "";
      for (var l = 0; l < filterTagsArray.length; l++) {
        filterTagsArray[l] = filterTagsArray[l].trim();
        let firsttypeLetter = filterTagsArray[l][0].toUpperCase();
        let othertypeletters = filterTagsArray[l].slice(1);
        let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
        console.log(changeUpperCaseProjectName);
        filterTagsArray[l] = changeUpperCaseProjectName;
        convertStringTags = convertStringTags + filterTagsArray[l].trim();
        if (filterTagsArray.length - 1 != l) {
          convertStringTags = convertStringTags + ",";
        }
        console.log(convertStringTags);
      }
      if (filterTagsArray.length > 0) {
        convertStringTags = this.dataService.changeFormat(convertStringTags);
        this.toolbarService
          .addTagname(this.projectId, this.toolbarId, convertStringTags)
          .subscribe((res) => {
            console.log(res);
            this.loader = false;
            this.toolbarTagNames = "";
            this.toolbarService.filter("Register Click");
            let getresponse_special_character = res["response_body"]["toolbar_tags"];
            if (res["response_body"]["toolbar_tags"].length > 0) {
              let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character, 'toolbartags');
              console.log(change_character_list);
              res["response_body"]["toolbar_tags"] = change_character_list;
            }
            this.toolbarTagList = res["response_body"]["toolbar_tags"];
          });
      } else {
        this.loader = false;
        this.toolbarTagNames = "";
      }
    }
  }

  removeTag(toolbartagId) {
    // this.toolbarTagList = this.toolbarTagList.filter((item) => {
    //   return item["toolbar_tag_id"] !== toolbartagId;
    // });
    for (let i = 0; i < this.toolbarTagList.length; i++) {
      if (this.toolbarTagList[i]["toolbar_tag_id"] == toolbartagId) {
        this.toolbarTagList.splice(i, 1);
      }
    }

    this.toolbarService
      .removeClickTag(this.toolbarId, toolbartagId)
      .subscribe((res) => {
        console.log(res);
        this.toolbarService.filter("Register Click");
      });
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.toolbarTagNames = changeUpperCaseProjectName;
    }
  }


  saveButtonTrigger(project_tag_name, loader) {
    if (project_tag_name.trim() != "") {
      this.addTags(project_tag_name, loader);
    }
    this.dialogclose.close();
  }

  closeBox() {
    this.dialogclose.close();
  }
}
