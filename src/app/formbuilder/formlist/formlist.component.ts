import { Component, OnInit, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ValueService } from "src/app/value.service";
import { FormlistService } from "../services/formlist.service";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { MenucomponentComponent } from "./menucomponent/menucomponent.component";
import { AddformsComponent } from "../addforms/addforms.component";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { EventGlobalService } from "src/app/event-global.service";
import { DataService } from "src/app/data.service";

import { DuplicateComponent } from "../addforms/duplicate/duplicate.component";
import { v1 as uuidv1 } from "uuid";
import { DatService } from "src/app/dat.service";
import { HeadertitleService } from "src/app/headertitle.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { ResizeEvent } from "angular-resizable-element";
import { AlertPermissionComponent } from "src/app/projects/alert-permission/alert-permission.component";
import * as _ from 'lodash';
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";


@Component({
  selector: "app-formlist",
  templateUrl: "./formlist.component.html",
  styleUrls: ["./formlist.component.css"],
})
export class FormlistComponent implements OnInit {
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
  formfield: number;
  projectName: string;
  admin: any;
  edit: any;
  view: any;
  showHiddenList: any[] = [];user
  userrole:string = "";
  

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
    private userRoleGlobal:GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.admin = this.encrptdecrpt.getItem("Admin");
    this.edit = this.encrptdecrpt.getItem("Edit");
    this.view = this.encrptdecrpt.getItem("View");
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

    //get User level management
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })

  }
  ngOnInit(): void {
    this.headerService.mainTitle("");
    this.headerService.setTitle(this.encrptdecrpt.getItem("projectName"));
    this.formlisting();
    // this.getFormTaglist();
    this.filtermethod();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.searchOut();
  }

  displayedColumns: any[] = ["Name"];
  sorter = this.MySort('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  sorterdesc = this.MySortdesc('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  formlisting() {
    this.set = true;
    this.service.getformlist().subscribe((data) => {
      console.log(data);
      this.getFormTaglist();
      this.set = false;
      // user permission new api values get process
      let get_user_permission = data["response_body"]["user_permission"];
      if (get_user_permission != undefined && get_user_permission != null &&
        get_user_permission.length > 0) {

        if (get_user_permission[0].admin_permission_flag == true) {
          this.userrole = "admin";
        }
        else if (get_user_permission[0].edit_permission_flag == true) {
          this.userrole = "edit";
        }
        else if (get_user_permission[0].view_permission_flag == true) {
          this.userrole = "view";
        }
        else if (get_user_permission[0].view_permission_flag == false && get_user_permission[0].edit_permission_flag == false
          && get_user_permission[0].admin_permission_flag == false) {
          this.userrole = "view";
        }
        this.encrptdecrpt.setItem("userrole", this.projectid + "||" + this.userrole);//security
      }
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
      
      
      
      
    
      console.log(this.userrole)

      console.log(dateFilter);
      this.showHiddenList = _.cloneDeep(data["response_body"]["form_listing"]);
      if (dateFilter != undefined) {
        dateFilter = dateFilter.filter((data) => {
          return data["is_hidden"] == false;
        });

        ////
        var crateDateFilter = dateFilter.filter((dateOnly1) => {
          // moment.utc(dateOnly1.created_date)
          if (dateOnly1.created_date != "0000-00-00 00:00:00") {
            return (dateOnly1.created_date = this.datePipe.transform(
              dateOnly1.created_date,
              "MM/dd/yyyy HH:mm:ss"
            ));
          }
        });
        this.startingformlist = crateDateFilter.filter((dateOnly2) => {
          if (dateOnly2.last_updated_date != "0000-00-00 00:00:00") {
            return dateOnly2.last_updated_date != undefined
              ? (dateOnly2.last_updated_date = this.datePipe.transform(
                dateOnly2.last_updated_date,
                "MM/dd/yyyy HH:mm:ss"
              ))
              : (dateOnly2.last_updated_date = this.datePipe.transform(
                dateOnly2.created_date,
                "MM/dd/yyyy HH:mm:ss"
              ));
          }
        });
      }
      this.listData = new MatTableDataSource(this.startingformlist);

      this.sortFormList = this.startingformlist;
      this.receiveData.currentMessage.subscribe((message) => {
        this.sortMessage = message;
        if (this.sortMessage == "ascending") {
          this.sortFormList.sort((a, b) =>(a.form_name.toLowerCase() > b.form_name.toLowerCase()) ? 1 : -1)
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "descending") {
          this.sortFormList.sort((a, b) =>(a.form_name.toLowerCase() > b.form_name.toLowerCase()) ? -1 : 1)
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "datecreatedOldToRecent") {
          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "datecreatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "lastupdatedOldToRecent") {
          // this.sortFormList.sort((a, b) =>
          //   (a.last_updated_date != undefined
          //     ? a.last_updated_date
          //     : a.created_date
          //   ).localeCompare(
          //     b.last_updated_date != undefined
          //       ? b.last_updated_date
          //       : b.created_date
          //   )
          // );
          this.sortFormList.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "lastupdatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        }
        console.log(this.sortFormList)
      });
       
      // this.listData = new MatTableDataSource(this.startingformlist);
      this.eventsService.on("sortChange", (a) => {
        this.message = a;

        if (this.message == "ascending") {
          this.sortFormList.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1)
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.message == "descending") {
          this.sortFormList.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? -1 : 1)
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.message == "datecreatedOldToRecent") {

          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
          var c = 'trt';
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
  }

  filtermethod() {
    console.log("event")
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
      this.listData = new MatTableDataSource(removeDuplicates);
    } else {
      var arrResult = this.sortFormList;
      this.listData = new MatTableDataSource(arrResult);
    }
  };

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
    let dialogRef = this.dialog.open(MenucomponentComponent, {
      width: "400px",

      panelClass: "my-class",
      data: {
        formname: this.formname,
        date1: this.date1,
        date2: this.date2,
        formid: this.formid,
        projectid: this.projectid,
        hidden: this.hidden,
        listData: this.showHiddenList,
        formfield: this.formfield,
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
    let dialogRef = this.dialog.open(MenucomponentComponent, {
      width: "400px",

      panelClass: "my-class",
      data: {
        formname: this.formname,
        date1: this.date1,
        date2: this.date2,
        formid: this.formid,
        projectid: this.projectid,
        hidden: this.hidden,
        listData: this.showHiddenList,
        formfield: this.formfield,
      },
    });
  }

  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
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
    if (this.admin == 0 && this.edit == 0 && this.view == 1) {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      dialgoConfig.width = "100%";
      let dialogRef = this.dialog.open(AddformsComponent, {
        width: "400px",
        panelClass: "my-class",
        data: { projectId: this.projectid },
      });
    }
  }
  displayedColumns1: any[];

  formbuilder(form_id, form_name) {
    var array=this.sortFormList.filter((data)=>data.form_name==form_name)
    console.log(array);
    var index=array[0].is_extend;
    console.log(index);
    this.router.navigate(["formbuilder/formEdit"], {
      queryParams: { Form_id: form_id, Form_name: form_name, pageFrom: "formlist",Extend:index},
    });
  }

  public style: object = {};

  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 50;
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
        event.rectangle.height < MIN_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  }

  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: "fixed",
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
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
