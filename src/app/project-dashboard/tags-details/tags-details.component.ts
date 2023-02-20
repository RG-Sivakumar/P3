import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from "@angular/forms";
import { ProjectlistService } from "../my-project/services/projectlist.service";
import { id } from "@swimlane/ngx-datatable";
import * as _ from "lodash";
import { DataService } from "src/app/data.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
@Component({
  selector: "app-tags-details",
  templateUrl: "./tags-details.component.html",
  styleUrls: ["./tags-details.component.css"],
})
export class TagsDetailsComponent implements OnInit {
  projectid: any;
  tagdefault: any = "";
  taglist: string[];
  tags: string;
  loader: boolean = false;
  trimpattern: string;
  duplicatechecklist: any;
  constructor(
    public dialogbox: MatDialogRef<TagsDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: ProjectlistService,
    private dataService: DataService,
    public userRoleGlobal:GlobalUserRoleService,
  ) {
    this.trimpattern = "\\b(\\w+)(\\s+\\1\\b)*";
    this.projectid = this.data.projectid;

    this.service.getTag(this.projectid).subscribe((data) => {
      console.log(data);
      let getresponse_special_character = data["response_body"]["project_tags"];
      if(data["response_body"]["project_tags"].length>0){
        let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character,'projecttagname');
        console.log(change_character_list);
        data["response_body"]["project_tags"] = change_character_list;
      }
      this.taglist = data["response_body"]["project_tags"];
      this.duplicatechecklist = data["response_body"]["project_tags"];
    });
  }
  ngOnInit() { }

  AddTag(project_tag_name, loader) {
    ;
    if (project_tag_name.value.trim() != "") {
      var rt = this.duplicatechecklist;
      let uniqueq = [];
      var tagses = project_tag_name.value.trim();
      // tagses = this.dataService.changeFormat(tagses);
      console.log(tagses);
      var filterTagsArray = [];
      this.loader = loader;
      let tagArrayComma = tagses.split(",");
      var tagArray = [];
      console.log(tagArrayComma);
      if (rt != undefined) {
        var c = 0;
        rt.forEach((e) => {
          var name = e.project_tag_name.toLowerCase()
          tagArrayComma.forEach((el, index) => {
            var wee = el.trim().toLowerCase()
            if (e.project_tag_name.toLowerCase() == el.trim().toLowerCase()) {
              var ty = index;
              tagArrayComma.splice(index, 1);
            }
          })
          //uniquesCase.push(e.project_tag_name);
        })
      }
      console.log(tagArrayComma)
      var tagArrayUnique = tagArrayComma.filter((value, index) => {
        return tagArrayComma.indexOf(value) === index;
      });
      var we;
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
              this.taglist[j]["project_tag_name"].trim().toLowerCase()
            ) {
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
        this.service.AddTag(this.projectid, convertStringTags)
          .subscribe((res) => {
            console.log(res);
            this.loader = false;
            let getresponse_special_character = res["response_body"]["project_tags"];
            if (res["response_body"]["project_tags"].length > 0) {
              let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character, 'projecttagname');
              console.log(change_character_list);
              res["response_body"]["project_tags"] = change_character_list;
            }
            this.taglist = res["response_body"]["project_tags"];
            this.service.filter("Register click");
          });
        this.tagdefault = "";
      }
      else {
        this.loader = false;
        this.tagdefault = "";
      }
    }
  }


  closeBox() {
    this.dialogbox.close();
  }


  deleteTags(project_tag_id) {
    for (let i = 0; i < this.taglist.length; i++) {
      if (this.taglist[i]["project_tag_id"] == project_tag_id) {
        this.taglist.splice(i, 1);
        this.duplicatechecklist = this.taglist;
      }
    }
    // this.taglist = this.taglist.filter(
    //   (item) => item["project_tag_id"] !== project_tag_id
    // );
    this.service.RemoveTag(this.projectid, project_tag_id).subscribe((res) => {
      this.service.filter("Register click");
    });
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.tagdefault = changeUpperCaseProjectName;

    }
  }

  changeEnter(value) {
    var sde = {};
    var er = value.split(",");
    var sub_array = [];
    var super_array = [];
    for (var i = 0; i < er.length; i++) {
      var sde1 = {
        "project_tag_name": er[i]
      }
      // sde["project_tag_name"] = er[i];
      sub_array.push(sde1);
    }
    this.taglist = sub_array
  }

  saveButtonTrigger(project_tag_name, loader) {
    if (project_tag_name.value.trim() != "") {
      this.AddTag(project_tag_name, loader);
    }
    this.dialogbox.close();
  }

}
