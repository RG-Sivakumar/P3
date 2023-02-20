import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AddformsComponent } from "src/app/formbuilder/addforms/addforms.component";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { DuplicateComponent } from "src/app/formbuilder/addforms/duplicate/duplicate.component";
import { MorecomponemtComponent } from "src/app/formbuilder/formlist/morecomponemt/morecomponemt.component";
import { login } from "src/app/projectmanagement/models/login-model";
import { ValueService } from "src/app/value.service";
import { FormlistService } from "src/app/formbuilder/services/formlist.service";
import { Router } from "@angular/router";
import { DataService } from "src/app/data.service";
import { DatePipe } from "@angular/common";
import { EventGlobalService } from "src/app/event-global.service";
import { DatService } from "src/app/dat.service";
import { HeadertitleService } from "src/app/headertitle.service";
import { FormsMorePopupComponent } from "../forms-more-popup/forms-more-popup.component";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-hiddenlists",
  templateUrl: "./hiddenlists.component.html",
  styleUrls: ["./hiddenlists.component.css"],
})
export class HiddenlistsComponent implements OnInit {
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
  formlist: any[];
  showLoader: boolean = true;
  showHiddenFormList:any [] = [];
  removeHidden: any[]=[];
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
    });
    this.service.loaderActivated.subscribe((status: boolean) => {
      this.showLoader = status;
    });
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.formlisting();
    }, 2000)
    this.searchOut();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }
  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
  }
  sorter = this.MySort('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  sorterdesc = this.MySortdesc('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  formlisting() {

    this.set = true;
    this.showLoader = true;
    this.service.getformlist().subscribe((data) => {
      // this.set = false;
      this.showLoader = false;
      this.getFormTaglist();
      let getresponse_special_character = data["response_body"]["form_listing"];
      if(data["response_body"]["form_listing"].length>0){
        let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character,'formlist');
        console.log(change_character_list);
        data["response_body"]["form_listing"] = change_character_list;
      }
      this.formlist = data["response_body"]["form_listing"];
      let removeFormList = data["response_body"]["form_listing"];
      this.removeHidden = removeFormList.filter((ele => ele.is_hidden == true));
      const myArray = data["response_body"]["form_listing"];
 
      if (this.formlist != undefined) {
        this.formlist = this.formlist.filter((data) => {
          if((data["is_hidden"] == true||data["is_hidden"] == '1'||data["is_hidden"] == 'true')){
            return data;
          }
        });
      }
      var dateFilter = this.formlist;
      var dateFilter1 = dateFilter.filter((dateonly) => {
        return (dateonly.created_date = this.datePipe.transform(
          dateonly.created_date,
          "MM/dd/yyyy HH:mm:ss"
        ));
      });
      this.startingformlist = dateFilter1.filter((dateonly1) => {
        return (dateonly1.last_updated_date = this.datePipe.transform(
          dateonly1.last_updated_date,
          "MM/dd/yyyy HH:mm:ss"
        ));
      });
      console.log(this.startingformlist);
      this.formlist = this.startingformlist;
      this.sortFormList = this.startingformlist;
      this.receiveData.currentMessage.subscribe(message => {
        this.sortMessage = message;
      
        if (this.sortMessage == "ascending") {
          this.sortFormList.sort(this.sorter);
          this.formlist = this.sortFormList;
      
        }
        else if (this.sortMessage == "descending") {
          this.sortFormList.sort(this.sorterdesc);
          this.formlist = this.sortFormList;
      
        }
        else if (this.sortMessage == "datecreatedOldToRecent") {
          this.sortFormList.sort((a, b) => a.form_name.localeCompare(b.form_name));
          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
          this.formlist = this.sortFormList;
      
        }
        else if (this.sortMessage == "datecreatedRecentToOld") {
          this.sortFormList.sort((a, b) => a.form_name.localeCompare(b.form_name));
          this.sortFormList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
          this.formlist = this.sortFormList;
      
        }
        else if (this.sortMessage == "lastupdatedOldToRecent") {
          this.sortFormList.sort((a, b) => a.form_name.localeCompare(b.form_name));
          this.sortFormList.sort((a, b) => (a.last_updated_date != undefined ? new Date(a.last_updated_date).getTime() : new Date(a.created_date).getTime()) - (b.last_updated_date != undefined ? new Date(b.last_updated_date).getTime() : new Date(b.created_date).getTime()));
          this.formlist = this.sortFormList;
      
        }
        else if (this.sortMessage == "lastupdatedRecentToOld") {
          this.sortFormList.sort((a, b) => a.form_name.localeCompare(b.form_name));
          this.sortFormList.sort((a, b) => (b.last_updated_date != undefined ? new Date(b.last_updated_date).getTime() : new Date(b.created_date).getTime()) - (a.last_updated_date != undefined ? new Date(a.last_updated_date).getTime() : new Date(a.created_date).getTime()));
          this.formlist = this.sortFormList;
        }
      });
    });
  }

  getFormTaglist() {
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    this.service.getAllFormTag(this.projectid).subscribe((res) => {
      this.filtermethod();
      console.log(res);
      this.getAllTags = res["response_body"].project_form_tags;
      this.getAlltaglist = res["response_body"].project_form_tags;
    });
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
          data.form_name.toLowerCase().includes(a.toLowerCase()) ||
          data.created_date.toLowerCase().includes(a.toLowerCase()) ||
          data.last_updated_date.toLowerCase().includes(a.toLowerCase())
        );
      });
    } else {
      var projectfilter = [];
    }
    if (a.length > 0) {
      var arrResult = [...uniqueProjectFilter, ...projectfilter];
      let allDatas = new Set(arrResult);
      let removeDuplicates = [...allDatas];
      this.formlist =(removeDuplicates);
    } else {
      var arrResult = this.sortFormList;
      this.formlist =(arrResult);
    }
  };


  onMenu(
    formname,
    last_updated_date,
    created_date,
    form_id,
    project_id,
    is_hidden
  ) {
    this.formname = formname;
    this.hidden = is_hidden;
    (this.date1 = last_updated_date), (this.date2 = created_date);
    this.formid = form_id;
    this.projectid = project_id;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(MorecomponemtComponent, {
      width: "400px",

      panelClass: "my-class",
      data: {
        formname: this.formname,
        date1: this.date1,
        date2: this.date2,
        formid: this.formid,
        projectid: this.projectid,
        hidden: this.hidden,
        listData: this.listData,
      },
    });
  }

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
    this.service.getAllProjectForms().subscribe((res) => {
      var getAllForms = res["response_body"]["form_listing"];
      this.allProjectForms = new MatTableDataSource<any>(getAllForms);
      this.importButon = true;
      this.retrieveImport = true;

      this.displayedColumns1 = [
        "ProjectName",
        "formName",
        "Created",
        "LastModified",
        "checkLabel",
      ];
    });
  };

  formbuilder(form_id, form_name) {
    this.router.navigate(["/formbuilder/form"], {
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
  formfield: any;

  onContextMenu(
    event,
    formname,
    created_date,
    last_updated_date,
    form_id,
    project_id,
    is_hidden,
    form_element_count
  ) {
    event.preventDefault();
    this.formfield = form_element_count;
    this.formname = formname;
    this.hidden = is_hidden;
    (this.date1 = created_date), (this.date2 = last_updated_date);
    this.formid = form_id;
    this.projectid = project_id;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(FormsMorePopupComponent, {
      width: "400px",

      panelClass: "my-class",
      data: {
        formname: this.formname,
        date1: this.date1,
        date2: this.date2,
        formid: this.formid,
        projectid: this.projectid,
        hidden: this.hidden,
        listData:this.removeHidden,
        formfield: form_id,
      },
    });
  }

  onVeryLongPress(
    event,
    formname,
    created_date,
    last_updated_date,
    form_id,
    project_id,
    is_hidden,
    form_element_count
  ) {
    event.preventDefault();
    this.formfield = form_element_count;
    this.formname = formname;
    this.hidden = is_hidden;
    (this.date1 = created_date), (this.date2 = last_updated_date);
    this.formid = form_id;
    this.projectid = project_id;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(FormsMorePopupComponent, {
      width: "400px",
      panelClass: "my-class",
      data: {
        formname: this.formname,
        date1: this.date1,
        date2: this.date2,
        formid: this.formid,
        projectid: this.projectid,
        hidden: this.hidden,
        listData: this.removeHidden,
        formfield: form_id,
      },
    });
  }
  MySort(alphabet)
{
    return function(a, b) {
        var index_a = alphabet.indexOf(a[0]),
        index_b = alphabet.indexOf(b[0]);

        if (index_a === index_b) {
            if (a.form_name < b.form_name) {
                return -1;
            } else if (a.form_name > b.form_name) {
                return 1;
            }
            return 0;
        } 
        else {
            return index_a - index_b;
        }
    }
}
MySortdesc(alphabet)
{
    return function(a, b) {
        var index_a = alphabet.indexOf(a[0]),
        index_b = alphabet.indexOf(b[0]);

        if (index_a === index_b) {
            if (a.form_name < b.form_name) {
                return 1;
            } else if (a.form_name > b.form_name) {
                return -1;
            }
            return 0;
        } 
        else {
            return index_a - index_b;
        }
    }
}
}
