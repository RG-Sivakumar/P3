import {
  Component,
  OnInit,
  HostListener,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { ToolbarlistService } from "../services/toolbarlist.service";
import { MatTableDataSource } from "@angular/material/table";
import { HeadertitleService } from "src/app/headertitle.service";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { ToolbarFeatureComponent } from "./toolbar-feature/toolbar-feature.component";
import { EventGlobalService } from "src/app/event-global.service";
import { MoreOptionComponent } from "./more-option/more-option.component";
import { DataService } from "src/app/data.service";
import { Router } from "@angular/router";
import { CopyformsComponent } from "./copyforms/copyforms.component";
import { ValueService } from "src/app/value.service";
import { first } from "rxjs/operators";
import {
  MatListModule,
  MatSelectionList,
  MatSelectionListChange,
} from "@angular/material/list";
import { SelectionModel } from "@angular/cdk/collections";
import { AlertPermissionComponent } from "src/app/projects/alert-permission/alert-permission.component";
import * as _ from 'lodash';
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-toolbarlist",
  templateUrl: "./toolbarlist.component.html",
  styleUrls: ["./toolbarlist.component.css"],
})
export class ToolbarlistComponent implements OnInit {
  projectId: string;
  show = false;
  dataSource: MatTableDataSource<any>;
  message: string;
  getAllTags: any[];
  getAlltaglist: any[];
  startingToolbarList: any[];
  slider: boolean = false;
  sortMessage: string;
  remember = false;
  toolbar_id1: string;
  projectid: string;
  toolbarid: string;
  changesome1: any;
  title: string;
  displayedColumns: any[] = ["Name"];
  disableButton: any;
  admin: any;
  edit: any;
  view: any;
  showHiddenToolbarlist:any[] = [];
  sorter = this.MySort('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  sorterdesc = this.MySortdesc('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  userrole:string="";

  constructor(
    public service: ToolbarlistService,
    private headertitleservice: HeadertitleService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private eventsService: EventGlobalService,
    private receiveData: DataService,
    public service3: ValueService,
    public route: Router,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.admin = this.encrptdecrpt.getItem("Admin");
    this.edit = this.encrptdecrpt.getItem("Edit");
    this.view = this.encrptdecrpt.getItem("View");
    this.disableButton = this.encrptdecrpt.getItem("disableButton");
    //   this.receiveData.getValue().subscribe(data => {
    //     var title = data;
    //
    //
    // });

    this.service3.currentMessage.subscribe((message) => {
      this.show = message;
    });
    this.service.listen().subscribe((m: any) => {
      this.formlisting();
      this.getProjectToolbarTaglist();
      this.show = false;
    });
  }
  @ViewChild(MatSelectionList) shoes: MatSelectionList;
  ngOnInit(): void {
    this.headertitleservice.mainTitle("");
    this.headertitleservice.setTitle(this.encrptdecrpt.getItem("projectName"));
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    this.formlisting();
    // this.getProjectToolbarTaglist();
    this.searchFunction();
    this.searchOut();
  }

  toolbar(project_id, toolbarName, toolbar_id) {
    this.route.navigate(["/toolbar/toolbardesign"], {
      queryParams: {
        project_id: project_id,
        toolbarName: toolbarName,
        toolbarId: toolbar_id,
        pageFrom: "toolbarlist"
      },
    });
  }

  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
  }
  searchFunction() {

    this.eventsService.on("on", (a) => {

      this.message = a;
      this.applyFilter(this.message);
    });
  }

  applyFilter = (filtervalue) => {

    var a = filtervalue;
    if (this.getAlltaglist != undefined) {
      var tagfilter = this.getAlltaglist.filter((data) =>
        data.toolbar_tag_name.toLowerCase().includes(a.toLowerCase())
      );
      var uniqueProjectFilter = this.startingToolbarList.filter(function (
        projectlistId
      ) {
        return tagfilter.some(function (tagfilterId) {
          return projectlistId.toolbar_id === tagfilterId.toolbar_id;
        });
      });
    } else {
      var uniqueProjectFilter = [];
    }
    if (this.startingToolbarList != undefined) {
      var projectfilter = this.startingToolbarList.filter(
        (data) =>
          data.toolbar_name.toLowerCase().includes(a.toLowerCase()) ||
          data.created_date.toLowerCase().includes(a.toLowerCase()) ||
          data.last_updated_date.toLowerCase().includes(a.toLowerCase())
      );
    } else {
      var projectfilter = [];
    }
    if (a.length > 0) {
      let arrResult = [...uniqueProjectFilter, ...projectfilter];
      let allDatas = new Set(arrResult);
      let removeDuplicates = [...allDatas];
      this.dataSource = new MatTableDataSource(removeDuplicates);
    } else {
      this.dataSource = new MatTableDataSource(this.startingToolbarList);
    }
  };

  getProjectToolbarTaglist() {
    this.service.getProjectAllTag(this.projectId).subscribe((res) => {
      if(res["response_code"]==200){
        let getresponse_special_character = res["response_body"].project_toolbar_tags;
      if (res["response_body"].project_toolbar_tags.length > 0) {
        let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'toolbartags');
        console.log(change_character_list);
        res["response_body"].project_toolbar_tags = change_character_list;
      }
      this.getAllTags = res["response_body"].project_toolbar_tags;
      this.getAlltaglist = res["response_body"].project_toolbar_tags;
      }
    });
  }

  formlisting() {
    this.slider = true;
    this.service.gettoolbarlist(this.projectId).subscribe(
      (data) => {
        this.getProjectToolbarTaglist();
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
          this.encrptdecrpt.setItem("userrole", this.projectId + "||" + this.userrole);//security
        }
        let getresponse_special_character = data["response_body"]["toolbar_listing"];
        if (data["response_body"]["toolbar_listing"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'toolbarlist');
          console.log(change_character_list);
          data["response_body"]["toolbar_listing"] = change_character_list;
        }
        var data1 = data["response_body"]["toolbar_listing"];
        console.log(data1);
        this.slider = false;
        var receiveData = data["response_body"]["toolbar_listing"];
        this.showHiddenToolbarlist = _.cloneDeep(data["response_body"]["toolbar_listing"]);
        if (receiveData != undefined) {
          receiveData = receiveData.filter((data) => {
            return data["is_hidden"] == false;
          });
          var dateFilter1 = receiveData.filter((dateOnly1) => {
            if (dateOnly1.created_date != "0000-00-00 00:00:00") {
              return (dateOnly1.created_date = this.datePipe.transform(
                dateOnly1.created_date,
                "MM/dd/yyyy HH:mm:ss"
              ));
            }
          });
          var dateFilter2 = dateFilter1.filter((dateOnly2) => {
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
          this.dataSource = dateFilter2;
          this.startingToolbarList = dateFilter2;
          this.receiveData.currentMessage.subscribe((message) => {
            this.sortMessage = message;
            if (this.sortMessage == "ascending") {
              this.startingToolbarList.sort((a, b) =>(a.toolbar_name.toLowerCase() > b.toolbar_name.toLowerCase()) ? 1 : -1)
              this.dataSource = new MatTableDataSource(
                this.startingToolbarList
              );
            } else if (this.sortMessage == "descending") {
              this.startingToolbarList.sort((a, b) =>(a.toolbar_name.toLowerCase() > b.toolbar_name.toLowerCase()) ? -1 : 1)
              this.dataSource = new MatTableDataSource(
                this.startingToolbarList
              );
            } else if (this.sortMessage == "datecreatedOldToRecent") {
              this.startingToolbarList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
              this.dataSource = new MatTableDataSource(
                this.startingToolbarList
              );
            } else if (this.sortMessage == "datecreatedRecentToOld") {
              this.startingToolbarList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
              this.dataSource = new MatTableDataSource(
                this.startingToolbarList
              );
            } else if (this.sortMessage == "lastupdatedOldToRecent") {
              this.startingToolbarList.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
              this.dataSource = new MatTableDataSource(
                this.startingToolbarList
              );
            } else if (this.sortMessage == "lastupdatedRecentToOld") {
              this.startingToolbarList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
              this.dataSource = new MatTableDataSource(
                this.startingToolbarList
              );
            }
          });
        } 
        // else {
        //   window.alert("API Data undefined");
        // }
        this.eventsService.on("sortChange", (a) => {
          this.message = a;
          if (this.message == "ascending") {
            this.startingToolbarList.sort((a, b) =>(a.toolbar_name.toLowerCase() > b.toolbar_name.toLowerCase()) ? 1 : -1)
            this.dataSource = new MatTableDataSource(this.startingToolbarList);
          } else if (this.message == "descending") {
            this.startingToolbarList.sort((a, b) =>(a.toolbar_name.toLowerCase() > b.toolbar_name.toLowerCase()) ? -1 : 1)
            this.dataSource = new MatTableDataSource(this.startingToolbarList);
          } else if (this.message == "datecreatedOldToRecent") {
            this.startingToolbarList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
            this.dataSource = new MatTableDataSource(this.startingToolbarList);
          } else if (this.message == "datecreatedRecentToOld") {
            this.startingToolbarList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
            this.dataSource = new MatTableDataSource(this.startingToolbarList);
          } else if (this.message == "lastupdatedOldToRecent") {
            this.startingToolbarList.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
            this.dataSource = new MatTableDataSource(this.startingToolbarList);
          } else if (this.message == "lastupdatedRecentToOld") {
            this.startingToolbarList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
            this.dataSource = new MatTableDataSource(this.startingToolbarList);
            console.log(this.startingToolbarList);
          }
        });
      },
      (error: any) => { }
    );
  }

  addToolbarProject() {
    if (this.admin == 0 && this.edit == 0 && this.view == 1) {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = true;
      dialogconfig.autoFocus = true;
      this.dialog.open(AlertPermissionComponent, {
        width: "420px",
      });
    }
    else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      this.dialog.open(ToolbarFeatureComponent, {
        width: "380px",
      });
    }
  }

  formMoreOption(toolbar_id, project_id) {
    this.projectid = project_id;
    this.toolbar_id1 = toolbar_id;

    const dialogConfig = new MatDialogConfig();

    const dialogRef = this.dialog.open(MoreOptionComponent, {
      disableClose: false,
      data: {
        toolbar_id1: this.toolbar_id1,
        projectid: this.projectid,
      },
    });
  }

  toggleVisibility(e, toolbar_id, project_id) {
    this.toolbarid = toolbar_id;
    this.projectid = project_id;
    this.remember = e.target.checked;

    if (this.remember == true) {
    }
  }

  duplicate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CopyformsComponent, {
      width: "400px",
      data: {
        toolbarid: this.toolbarid,
        projectid: this.projectid,
      },
    });
  }

  onContextMenu(event, toolbarId, toolbarName, createdDate, modifiedDate, is_hidden) {
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(MoreOptionComponent, {
      width: "380px",
      data: {
        toolbarId: toolbarId,
        toolbarName: toolbarName,
        createdDate: createdDate,
        modifiedDate: modifiedDate,
        projectId: this.projectId,
        is_hidden: is_hidden,
        toolbarlist: this.showHiddenToolbarlist,
      },
    });
  }

  onVeryLongPress(event, toolbarId, toolbarName, createdDate, modifiedDate, is_hidden) {
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(MoreOptionComponent, {
      width: "380px",
      data: {
        toolbarId: toolbarId,
        toolbarName: toolbarName,
        createdDate: createdDate,
        modifiedDate: modifiedDate,
        projectId: this.projectId,
        is_hidden: is_hidden,
        toolbarlist: this.startingToolbarList,
      },
    });
  }
  MySort(alphabet)
{
    return function(a, b) {
        var index_a = alphabet.indexOf(a[0]),
        index_b = alphabet.indexOf(b[0]);

        if (index_a === index_b) {
            if (a.toolbar_name < b.toolbar_name) {
                return -1;
            } else if (a.toolbar_name > b.toolbar_name) {
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
            if (a.toolbar_name < b.toolbar_name) {
                return 1;
            } else if (a.toolbar_name > b.toolbar_name) {
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
