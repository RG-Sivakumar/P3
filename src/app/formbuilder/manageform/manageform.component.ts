import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormlistService } from "../services/formlist.service";
import * as _ from "lodash";
import { DataService } from "src/app/data.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-manageform",
  templateUrl: "./manageform.component.html",
  styleUrls: ["./manageform.component.css"],
})
export class ManageformComponent implements OnInit {
  tagdefault: string = "";
  taglist: string[];
  formid: string;
  projectid: string;
  loader: boolean = false;
  userrole:string = ""
  constructor(
    public dialogbox: MatDialogRef<ManageformComponent>,
    public dialog: MatDialogRef<ManageformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService,
    private dataService: DataService,
    public userRoleGlobal:GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.formid = this.data.formid;

    this.projectid = this.data.projectid;

    this.service.gettag(this.formid).subscribe((data) => {
      let getresponse_special_character = data["response_body"]["form_tags"];
      if(data["response_body"]["form_tags"].length>0){
        let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character,'formtags');
        console.log(change_character_list);
        data["response_body"]["form_tags"] = change_character_list;
      }
      this.taglist = data["response_body"]["form_tags"];
    });

    //get User level management
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })


  }
  addtagForm(form_tag_name, loader) {
    if (this.loader == false) {
      this.loader = loader;
      // var tagses = form_tag_name.value.replace(/,\s*$/, "");
      var tagses = form_tag_name.value.trim();
      tagses = this.dataService.changeFormat(tagses);
      console.log(tagses);
      var filterTagsArray = [];
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
      uniquesCase.forEach((element) => {
        tagArray.push(element);
      });
      console.log(tagArray);
      for (var i = 0; i < tagArray.length; i++) {
        if (this.taglist != undefined) {
          var a = 0;
          for (var j = 0; j < this.taglist.length; j++) {
            if (
              tagArray[i].trim().toLowerCase() ==
              this.taglist[j]["form_tag_name"].trim().toLowerCase()
            ) {
              // alert("duplicate" + tagArray[i]);
              a--;
            } else if (tagArray[i].trim() == "") {
              a--;
            } else {
              a++;
              console.log(a);
            }
          }
          if (a == this.taglist.length) {
            filterTagsArray.push(tagArray[i]);
          }
        } else {
          for (var i = 0; i < tagArray.length; i++) {
            filterTagsArray.push(tagArray[i]);
          }
        }
        console.log(filterTagsArray);
        console.log(tagses);
        console.log(this.taglist);
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
        this.service
          .AddTag(this.formid, convertStringTags, this.projectid)
          .subscribe((res) => {
            console.log(res);
            this.loader = false;
            let getresponse_special_character = res["response_body"]["form_tags"];
            if (res["response_body"]["form_tags"].length > 0) {
              let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character, 'formtags');
              console.log(change_character_list);
              res["response_body"]["form_tags"] = change_character_list;
            }
            this.taglist = res["response_body"]["form_tags"];
          });
        this.tagdefault = "";
      } else {
        this.loader = false;
        this.tagdefault = "";
      }
      // this.service
      //   .AddTag(this.formid, tagses, this.projectid)
      //   .subscribe((data) => {
      //     this.loader = false;

      //     var taglists = data["response_body"]["form_tags"];
      //     this.taglist = _.uniqWith(
      //       taglists,
      //       (a, b) =>
      //         a.form_tag_name.toLowerCase() === b.form_tag_name.toLowerCase()
      //     );
      //   });
    }
  }



  RemoveTag(form_tag_id) {
    for (let i = 0; i < this.taglist.length; i++) {
      if (this.taglist[i]["form_tag_id"] == form_tag_id) {
        this.taglist.splice(i, 1);
      }
    }
    this.service.RemoveTag(this.formid, form_tag_id).subscribe((data) => {
      // this.taglist = this.taglist.filter(
      //   (item) => item["form_tag_id"] !== form_tag_id
      // );
      this.service.filter("Register click");
    });
  }
  closeBox() {
    this.dialogbox.close();
  }
  ngOnInit(): void { }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.tagdefault = changeUpperCaseProjectName;
    }
  }

  saveButtonTrigger(project_tag_name, loader) {
    if (project_tag_name.value.trim() != "") {
      this.addtagForm(project_tag_name, loader);
    }
    this.dialogbox.close();
  }
}
