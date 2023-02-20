import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { FormlistService } from "../../services/formlist.service";
import { NgForm } from "@angular/forms";
import { v1 as uuidv1 } from "uuid";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-createforms",
  templateUrl: "./createforms.component.html",
  styleUrls: ["./createforms.component.css"],
})
export class CreateformsComponent implements OnInit {
  projectid: string;
  date: any;
  disableds: boolean = false;
  fileName: any;
  list = [];
  formname: any;
  single : boolean = true;
  extend: boolean=false;
  constructor(
    private dialog: MatDialogRef<CreateformsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormlistService,
    public dialogbox: MatDialogRef<CreateformsComponent>,
    public dialog1: MatDialog,
    private dataService: DataService
  ) {
    this.projectid = this.data.projectid;
  }
  ngOnInit(): void {
    this.service.getformlist().subscribe((data) => {
      this.list = data["response_body"]["form_listing"];
      console.log(this.list);
    });
  }

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      console.log(changeUpperCaseProjectName);
      this.service.formData.form_name = changeUpperCaseProjectName;
    }
  }

  onSubmit(form: NgForm) {
    console.log('form-click',form);
    form.value.form_name = form.value.form_name.trim();
    let count = 1;
    var name = "";
    let accessSeperate;
    let removebracket = this.list.forEach((element => {
      let removefirst = element.form_name.split("(");
      element.form_name = removefirst[0];
      console.log(element.form_name);
      return element;
    }));
    console.log(this.list);
    this.list.forEach((e) => {
      console.log(e.form_name, form.value.form_name);
      if (e.form_name.toLowerCase().trim() === form.value.form_name.toLowerCase().trim()) {
        console.log(form.value.form_name);
        name = form.value.form_name + " (" + count + ")";
        console.log(count);
        count++;
        accessSeperate = true;
      }
    });
    if (accessSeperate != true) {
      let firstLetter = form.value.form_name[0].toUpperCase();
      let otherletters = form.value.form_name.slice(1);
      let changeUpperCaseProjectName = firstLetter + otherletters;
      name = changeUpperCaseProjectName;
    }
    if (count > 1) {
      let firstLetter = name[0].toUpperCase();
      let otherletters = name.slice(1);
      let changeUpperCaseProjectName = firstLetter + otherletters;
      name = changeUpperCaseProjectName;
    }
    console.log(name);
    name = this.dataService.changeFormat(name);
    console.log(name);
    this.date = new Date().getTime();
    this.service
      .createform(uuidv1().toUpperCase(), this.date, name,this.extend)
      .subscribe((res) => {
        var status = res["response_code"];
        var data = res["response_body"];
        if (status == 200) {
          console.log(res);
          this.service.formData.form_name = undefined;
          this.dialogbox.close(data);
          this.service.filter("Register click");
          this.disableds = true;
        }
      });
    this.disableds = true;
  }

  onclose() {
    this.dialogbox.close();
  }

  renameFiles(arr) {
    var count = {};
    arr.forEach((x, i) => {
      if (arr.indexOf(x) !== i) {
        var c = x in count ? (count[x] = count[x] + 1) : (count[x] = 1);
        console.log(c);
        var j = c + 1;
        console.log(j);
        var k = x + "(" + j + ")";
        console.log(k);
        while (arr.indexOf(k) !== -1) k = x + "(" + ++j + ")";  
        arr[i] = k;
      }
    });
    console.log(arr);
    return arr;
  }
  radiofunction1()
  {
    this.single=true;
    this.extend=false;
  }
  radiofunction2()
  {
    this.single=false;
    this.extend=true;
  }
}
