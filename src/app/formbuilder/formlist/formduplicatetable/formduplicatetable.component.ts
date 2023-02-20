import { Component, OnInit } from "@angular/core";
import { login } from "src/app/projectmanagement/models/login-model";
import { MatTableDataSource } from "@angular/material/table";
import { ValueService } from "src/app/value.service";
import { FormlistService } from "../../services/formlist.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DataService } from "src/app/data.service";
import { DatePipe } from "@angular/common";
import { EventGlobalService } from "src/app/event-global.service";
import { DatService } from "src/app/dat.service";
import { HeadertitleService } from "src/app/headertitle.service";
import { MenucomponentComponent } from "../menucomponent/menucomponent.component";
import { DuplicateComponent } from "../../addforms/duplicate/duplicate.component";
import { AddformsComponent } from "../../addforms/addforms.component";
import { v1 as uuidv1 } from "uuid";
import moment from "moment";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
@Component({
  selector: "app-formduplicatetable",
  templateUrl: "./formduplicatetable.component.html",
  styleUrls: ["./formduplicatetable.component.css"],
})
export class FormduplicatetableComponent implements OnInit {
  listData: any;
  su: login;
  allProjectForms: MatTableDataSource<any>;
  formname: string;
  show = false;
  set = false;
  date1: string;
  date2: string;
  formid: string;
  formid1: string;
  projectid: string;
  theCheckbox = false;
  hidden: any;
  list: string[];
  startingformlist: any[];
  sortFormList: any[];
  message: string;
  getAllTags: any[];
  getAlltaglist: any[];
  sortMessage: string;
  remember = false;
  hide = true;
  date: any;
  title: string;
  retrieveImport: boolean = false;
  importFormIds: string[] = [];
  importButon: boolean = false;

  constructor(
    private sendmessage: ValueService,
    public service: FormlistService,
    public dialog: MatDialog,
    public router: Router,
    private receiveData: DataService,
    private datePipe: DatePipe,
    private eventsService: EventGlobalService,
    public service3: ValueService,
    public service4: DatService,
    private headerService: HeadertitleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.service3.currentMessage.subscribe((message) => {
      this.show = message;
    });
    this.service4.currentMessage.subscribe((message) => {
      this.hide = message;
    });
    this.service.listen().subscribe((m: any) => {
      this.formlisting();
      this.receiveData;
      this.show = false;
    });
  }
  ngOnInit(): void {
    this.headerService.setTitle(this.encrptdecrpt.getItem("projectName"));
    this.formlisting();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.searchOut();

  }
  displayedColumns: any[] = ["Form Name", "Created", "LastModified", "dot1"];
  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
  }
  formlisting() {
    this.set = true;
    this.service.getformlist().subscribe((data) => {
      this.set = false;
      this.getFormTaglist();
      let getresponse_special_character = data["response_body"]["form_listing"];
      if(data["response_body"]["form_listing"].length>0){
        let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character,'formlist');
        console.log(change_character_list);
        data["response_body"]["form_listing"] = change_character_list;
      }
      this.listData = new MatTableDataSource(
        data["response_body"]["form_listing"]
      );
      var dateFilter = data["response_body"]["form_listing"];
      if (dateFilter != undefined) {
        dateFilter = dateFilter.filter((data) => {
          return data["is_hidden"] == false;
        });
        /////////
        // var crateDateFilter = dateFilter.filter((createDate) => {
        //   return (createDate.created_date);
        // });
        // this.startingformlist = crateDateFilter.filter((modifiedDate) => {
        //   return (modifiedDate.last_updated_date);
        // });
        /////////
        var crateDateFilter = dateFilter.filter((dateOnly1) => {
          if (dateOnly1.created_date != "0000-00-00 00:00:00") {
            return dateOnly1.created_date = moment.utc(dateOnly1.created_date)
          }
        });
        this.startingformlist = crateDateFilter.filter((dateOnly2) => {
          if (dateOnly2.last_updated_date != "0000-00-00 00:00:00") {
            return dateOnly2.last_updated_date != undefined
              ? dateOnly2.last_updated_date = moment.utc(dateOnly2.created_date)
              : dateOnly2.last_updated_date = moment.utc(dateOnly2.created_date)
          }
        });
      }
      this.listData = new MatTableDataSource(this.startingformlist);
      this.sortFormList = this.startingformlist;
      this.receiveData.currentMessage.subscribe((message) => {
        this.sortMessage = message;
        if (this.sortMessage == "ascending") {
          this.sortFormList.sort((a, b) =>
            a.form_name.localeCompare(b.form_name)
          );
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "descending") {
          this.sortFormList.sort((a, b) =>
            b.form_name.localeCompare(a.form_name)
          );
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "datecreatedOldToRecent") {
          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "datecreatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "lastupdatedOldToRecent") {
          this.sortFormList.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "lastupdatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        }
      });
      this.listData = new MatTableDataSource(this.startingformlist);
      this.eventsService.on("sortChange", (a) => {
        this.message = a;
        if (this.message == "ascending") {
          this.sortFormList.sort((a, b) =>
            a.form_name.localeCompare(b.form_name)
          );
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.message == "descending") {
          this.sortFormList.sort((a, b) =>
            b.form_name.localeCompare(a.form_name)
          );
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.message == "datecreatedOldToRecent") {

          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.message == "datecreatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.message == "lastupdatedOldToRecent") {
          this.sortFormList.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.message == "lastupdatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        }
      });
      // this.list=(data["response_body"]["form_listing"])
    });
  }

  getFormTaglist() {
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    this.service.getAllFormTag(this.projectid).subscribe((res) => {
      this.getAllTags = res["response_body"].project_form_tags;
      this.getAlltaglist = res["response_body"].project_form_tags;
    });
    this.filtermethod();
  }

  filtermethod() {
    this.eventsService.on("on", (a) => {
      this.message = a;
      this.applyFilter(this.message);
    });
  }

  applyFilter = (filtervalue) => {
    var a = filtervalue;
    if (this.getAlltaglist != undefined) {
      var tagfilter = this.getAlltaglist.filter((data) =>
        data.form_tag_name.toLowerCase().includes(a.toLowerCase())
      );
      var uniqueProjectFilter = this.startingformlist.filter(function (
        projectlistId
      ) {
        return tagfilter.some(function (tagfilterId) {
          return projectlistId.form_id === tagfilterId.form_id;
        });
      });
    } else {
      var uniqueProjectFilter = [];
    }
    if (this.startingformlist != undefined) {
      var projectfilter = this.startingformlist.filter((data) => {
        return (
          data.form_name.toLowerCase().includes(a.toLowerCase())
          // || data.created_date.toLowerCase().includes(a.toLowerCase()) ||
          // data.last_updated_date.toLowerCase().includes(a.toLowerCase())
        );
      });
    } else {
      var projectfilter = [];
    }
    if (a.length > 0) {
      var arrResult = [...uniqueProjectFilter, ...projectfilter];
    } else {
      var arrResult = this.startingformlist;
    }
    this.listData = new MatTableDataSource(arrResult);
  };

  toggleVisibility(e, form_id) {
    this.remember = e.target.checked;
    if (this.remember == true) {
      this.formid1 = form_id;
    }
  }
  duplicateforms() {
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(DuplicateComponent, {
      panelClass: "my-class",
      data: {
        projectid: this.projectid,
        formid1: this.formid1,
      },
    });
  }

  Addform() {
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(AddformsComponent, {
      width: "400px",
      panelClass: "my-class",
      data: {
        projectid: this.projectid,
        formid: this.formid,
        show: this.show,
        hide: this.hide,
        callback: this.triggerFunction,
      },
    });
  }
  displayedColumns1: any[];

  triggerFunction = (newFolderDat) => {
    this.set = true;
    this.service.getAllProjectForms().subscribe((res) => {
      this.set = false;
      var getAllForms = res["response_body"]["form_listing"];
      if (getAllForms != undefined) {
        var crateDateFilter = getAllForms.filter((createDate) => {
          return (createDate.created_date = this.datePipe.transform(
            createDate.created_date,
            "MM/dd/yyyy"
          ));
        });
        this.startingformlist = crateDateFilter.filter((modifiedDate) => {
          return (modifiedDate.last_updated_date = this.datePipe.transform(
            modifiedDate.last_updated_date,
            "MM/dd/yyyy"
          ));
        });
      }
      this.allProjectForms = new MatTableDataSource<any>(this.startingformlist);
      this.importButon = true;
      this.retrieveImport = true;
    });
  };

  formbuilder(form_id, form_name) {
    this.router.navigate(["formbuilder/formEdit"], {
      queryParams: { Form_id: form_id, Form_name: form_name },
    });
  }

  toggleVisibilityImport(event: any, form_id) {
    var remember = event.target.checked;
    if (remember == true) {
      this.importFormIds.push(form_id);
    } else if (remember == false) {
      for (var i = 0; i < this.importFormIds.length; i++) {
        if (this.importFormIds[i] == form_id) {
          this.importFormIds.splice(i, 1);
        }
      }
    }
  }

  importForms() {
    this.hide = false;
    this.set = true;
    this.date = new Date().getTime();
    var uuidImportFormIds = [];
    for (var i = 0; i < this.importFormIds.length; i++) {
      uuidImportFormIds.push(
        this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + this.date
      );
    }
    this.service
      .importForms(uuidImportFormIds, this.importFormIds)
      .subscribe((res) => {
        this.set = false;
        this.service.filter("Register Click");
        var status = res["response_code"];
        if (status == 200) {
        }
        this.importButon = false;
        this.retrieveImport = false;
      });
  }
  cancel(){
    this.router.navigateByUrl("/formbuilder/formlist");
    }
}
