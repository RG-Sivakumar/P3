import { Component, OnInit } from "@angular/core";
import { HeadertitleService } from "src/app/headertitle.service";
import { ToolbarlistService } from "../../services/toolbarlist.service";
import { MatTableDataSource } from "@angular/material/table";
import { DatePipe } from "@angular/common";
import { v1 as uuidv1 } from "uuid";
import { Router } from "@angular/router";
import { login } from "src/app/projectmanagement/models/login-model";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { ToolbarFeatureComponent } from "../toolbar-feature/toolbar-feature.component";
import { EventGlobalService } from "src/app/event-global.service";
import { DataService } from "src/app/data.service";
import { SelectionModel } from '@angular/cdk/collections';
import moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: "app-import-toolbar",
  templateUrl: "./import-toolbar.component.html",
  styleUrls: ["./import-toolbar.component.css"],
})
export class ImportToolbarComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  alltoolbarList: any;
  importFormIds: string[] = [];
  date: any;
  su: login;
  toolbarList: boolean = false;
  slider: boolean = false;
  displayedColumns: any[] = [
    "ProjectName",
    "Name",
    "CreatedDate",
    "LastModifiedDate",
    "checkboxAll",
  ];
  dateFilter2: any;
  sortFormList: any[];
  sortMessage: string;
  listdta:any;
  message: any;
  selection = new SelectionModel<PeriodicElement>(true, []);
  isAllSelectedValue: boolean = false;

  constructor(
    private headerTitleService: HeadertitleService,
    private toolbarService: ToolbarlistService,
    private datePipe: DatePipe,
    private eventsService: EventGlobalService,
    private receiveData: DataService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar:MatSnackBar,
    private encrptdecrpt:EncryptDecryptService
  ) { }

  ngOnInit(): void {
    // this.headerTitleService.setTitle("Import Existing Form");
    this.getAllToolbarList();
    this.filtermethod();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.searchOut()
  }
  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
  }
  getAllToolbarList() {
    this.slider = true;
    this.toolbarService.getAllProjecttoolbarlist().subscribe((res) => {
      console.log(res);
      this.toolbarList = true;
      this.slider = false;
      let getresponse_special_character = res["response_body"]["toolbar_listing"];
      if(res["response_body"]["toolbar_listing"].length>0){
        let change_character_list_toolbar = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character,'toolbarlist');
        let change_character_list_project=  this.receiveData.changeSpecialtokeyformatList(change_character_list_toolbar,'projectlist');
        //projectlist
        console.log(change_character_list_project);
        res["response_body"]["toolbar_listing"] = change_character_list_project;
      }
      var receiveData1 = res["response_body"]["toolbar_listing"];
      this.listdta = res["response_body"]["toolbar_listing"];
      var dateFilter1 = receiveData1.filter((dateOnly1) => {
        if (dateOnly1.created_date != "0000-00-00 00:00:00") {
          return dateOnly1.created_date = moment.utc(dateOnly1.created_date)
        }
      });
      this.dateFilter2 = dateFilter1.filter((dateOnly2) => {
        if (dateOnly2.last_updated_date != "0000-00-00 00:00:00") {
          return dateOnly2.last_updated_date = moment.utc(dateOnly2.last_updated_date)
        }
      });
      this.dataSource = new MatTableDataSource(this.dateFilter2);
      this.listdta=this.dateFilter2;
      this.sortFormList = this.dateFilter2;
      this.alltoolbarList = this.sortFormList;
      this.receiveData.currentMessage.subscribe((message) => {
        this.sortMessage = message;
        if (this.sortMessage == "ascending") {
          this.sortFormList.sort((a, b) =>
            a.toolbar_name.localeCompare(b.toolbar_name)
          );
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.listdta=this.dateFilter2;
          this.alltoolbarList = this.sortFormList;
        } else if (this.sortMessage == "descending") {
          this.sortFormList.sort((a, b) =>
            b.toolbar_name.localeCompare(a.toolbar_name)
          );
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.alltoolbarList = this.sortFormList;
          this.listdta=this.sortFormList;
        } else if (this.sortMessage == "datecreatedOldToRecent") {
          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.alltoolbarList = this.sortFormList;
          this.listdta=this.sortFormList;
        } else if (this.sortMessage == "datecreatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.alltoolbarList = this.sortFormList;
          this.listdta=this.sortFormList;
        } else if (this.sortMessage == "lastupdatedOldToRecent") {
          this.sortFormList.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime());
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.alltoolbarList = this.sortFormList;
          this.listdta=this.sortFormList;
          console.log(this.sortFormList);
        } else if (this.sortMessage == "lastupdatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.alltoolbarList = this.sortFormList;
          this.listdta=this.sortFormList;
        }
      });
      // this.eventsService.on("sortChange", (a) => {
      //   this.message = a;
      //   if (this.message == "ascending") {
      //     this.sortFormList.sort((a, b) =>
      //       a.toolbar_name.localeCompare(b.toolbar_name)
      //     );
      //     this.dataSource = new MatTableDataSource(this.sortFormList);
      //   } else if (this.message == "descending") {
      //     this.sortFormList.sort((a, b) =>
      //       b.toolbar_name.localeCompare(a.toolbar_name)
      //     );
      //     this.dataSource = new MatTableDataSource(this.sortFormList);
      //   } else if (this.message == "datecreatedOldToRecent") {
      //     this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
      //     this.dataSource = new MatTableDataSource(this.sortFormList);
      //     this.sortFormList.filter((data) => console.log(data.created_date));
      //   } else if (this.message == "datecreatedRecentToOld") {
      //     this.sortFormList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
      //     this.dataSource = new MatTableDataSource(this.sortFormList);
      //     this.sortFormList.filter((data) => console.log(data.created_date,data.project_name));
      //   } else if (this.message == "lastupdatedOldToRecent") {
      //     this.sortFormList.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
      //     this.dataSource = new MatTableDataSource(this.sortFormList);
      //     this.sortFormList.filter((data) =>console.log(data.last_updated_date,data.project_name));
      //   } else if (this.message == "lastupdatedRecentToOld") {
      //     this.sortFormList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
      //     this.dataSource = new MatTableDataSource(this.sortFormList);
      //     this.sortFormList.filter((data) =>
      //       console.log(data.last_updated_date)
      //     );
      //   }
      // });
    });
  }
  cancel() {
    this.router.navigateByUrl("/toolbar/toolbarlist")
  }
  filtermethod() {
    this.eventsService.on("on", (a) => {

      this.message = a;
      this.applyFilter(this.message);
    });
  }

  applyFilter = (filtervalue) => {
    var a = filtervalue;
    if (this.dateFilter2 != undefined) {
      var projectfilter = this.dateFilter2.filter((data) => {
        return (
          data.project_name.toLowerCase().includes(a.toLowerCase()) ||
          data.toolbar_name.toLowerCase().includes(a.toLowerCase())
          // || data.created_date.toLowerCase().includes(a.toLowerCase()) ||
          // data.last_updated_date.toLowerCase().includes(a.toLowerCase())
        );
      });
    } else {
      projectfilter = [];
    }
    var arrResult = []
    if (a.length > 0) {
      arrResult = [...projectfilter];
    } else {
      arrResult = this.dateFilter2;
    }
    this.dataSource = new MatTableDataSource(arrResult);
    this.listdta=arrResult;
  };

  toggleVisibilityImport(event: any, form_id) {

    var remember = event.target.checked;
    if (this.importFormIds.length == 0) {
      this.btnDisabled = true
    }
    if (remember == true) {
      this.btnDisabled = false
      this.importFormIds.push(form_id);
      this.isAllSelectedValue = this.isAllSelected();
    } else if (remember == false) {
      this.isAllSelectedValue = false;
      for (var i = 0; i < this.importFormIds.length; i++) {
        if (this.importFormIds[i] == form_id) {
          this.importFormIds.splice(i, 1);
        }
      }
      if (this.importFormIds.length == 0) {
        this.btnDisabled = true
      }
    }
  }
  btnDisabled = true;
  importForms() {
    this.slider = true;
    console.log(this.listdta);
    this.date = new Date().getTime();
    var uuidImportFormIds = [];
    console.log(this.importFormIds.length);
    for (var i = 0; i < this.importFormIds.length; i++) {
      uuidImportFormIds.push(
        this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + this.date
      );
    }
    this.btnDisabled = true;
    this.toolbarService
      .importForms(uuidImportFormIds, this.importFormIds)
      .subscribe((res) => {
        console.log(res);
        this.toolbarService.filter("Register Click");
        this.slider = false;
        this.router.navigate(["/toolbar/toolbarlist"]);
      });
  }

  addToolbarProject() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(ToolbarFeatureComponent, {
      width: "380px",
    });
  }

  getAllProjectImport(event) {
    if (event.target.checked == true) {
      this.btnDisabled = false
    } else {
      this.btnDisabled = true
    }
    let remember = event.target.checked;
    let limitation=this.listdta;
    if(limitation!=undefined && limitation.length>50){
      limitation=limitation.slice(0,50);
      if(remember==true){
      this.errorMessage();
    }
    }
    if (remember == true) {
      this.isAllSelectedValue = true;
      this.importFormIds = [];
      for (let k = 0; k < limitation.length; k++) {
        this.importFormIds.push(limitation[k].toolbar_id);
      }
    } else if (remember == false) {
      this.isAllSelectedValue = false;
      this.importFormIds = [];
    }
  }
  getCheckImportToolbar(toolbarId) {
    return this.importFormIds.includes(toolbarId);
  }


  isAllSelected() {
    const numSelected = this.importFormIds.length;
    const numRows = this.listdta?.length;
    return numSelected === numRows;
  }

  errorMessage() {
    this._snackBar.open('Please select less than 50 toolbars to import', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }

}
