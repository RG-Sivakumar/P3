import { Component, OnInit, ViewChild } from '@angular/core';
import { MoreOptionComponent } from '../../more-option/more-option.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CopyformsComponent } from '../../copyforms/copyforms.component';
import { ToolbarFeatureComponent } from '../toolbar-feature.component';
import { MatTableDataSource } from '@angular/material/table';
import { ToolbarlistService } from 'src/app/toolbar/services/toolbarlist.service';
import { HeadertitleService } from 'src/app/headertitle.service';
import { DatePipe } from '@angular/common';
import { EventGlobalService } from 'src/app/event-global.service';
import { DataService } from 'src/app/data.service';
import { ValueService } from 'src/app/value.service';
import { Router } from '@angular/router';
import { MatSelectionList } from '@angular/material/list';
import moment from 'moment';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';

@Component({
  selector: 'app-duplicateform',
  templateUrl: './duplicateform.component.html',
  styleUrls: ['./duplicateform.component.css']
})
export class DuplicateformComponent implements OnInit {
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
  displayedColumns: any[] = [
    "Name",
    "CreatedDate",
    "LastModifiedDate",
    "checkLabel",
  ];

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

  ngOnInit(): void {
    this.headertitleservice.mainTitle("Toolbar Builder");
    this.headertitleservice.setTitle(this.encrptdecrpt.getItem("projectName"));
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    this.formlisting();
    this.searchOut();
  }
  
  cancel(){
  this.route.navigateByUrl("/toolbar/toolbarlist")  
  }

  toolbar(project_id, toolbarName, toolbar_id) {

    this.route.navigate(["/toolbar/toolbardesign"], {
      queryParams: {
        project_id: project_id,
        toolbarName: toolbarName,
        toolbarId: toolbar_id,
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
          data.toolbar_name.toLowerCase().includes(a.toLowerCase())
        // || data.created_date.toLowerCase().includes(a.toLowerCase()) ||
        // data.last_updated_date.toLowerCase().includes(a.toLowerCase())
      );
    } else {
      var projectfilter = [];
    }
    let arrResult = [...uniqueProjectFilter, ...projectfilter];
    if (a.length > 0) {
      this.dataSource = new MatTableDataSource(arrResult);
    } else {
      this.dataSource = new MatTableDataSource(this.startingToolbarList);
    }
  };

  getProjectToolbarTaglist() {
    this.service.getProjectAllTag(this.projectId).subscribe((res) => {
      this.getAllTags = res["response_body"].project_toolbar_tags;
      this.getAlltaglist = res["response_body"].project_toolbar_tags;
      this.searchFunction();
    });
  }

  formlisting() {
    this.slider = true;
    this.service.gettoolbarlist(this.projectId).subscribe(
      (data) => {
        this.getProjectToolbarTaglist();
        let getresponse_special_character = data["response_body"]["toolbar_listing"];
        if (data["response_body"]["toolbar_listing"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'toolbarlist');
          console.log(change_character_list);
          data["response_body"]["toolbar_listing"] = change_character_list;
        }
        var data1 = data["response_body"]["toolbar_listing"];

        this.slider = false;

        var receiveData = data["response_body"]["toolbar_listing"];


        if (receiveData != undefined) {
          receiveData = receiveData.filter((data) => {
            return data["is_hidden"] == false;
          });
          var dateFilter1 = receiveData.filter((dateOnly1) => {
            return dateOnly1.created_date = moment.utc(dateOnly1.created_date)
          });
          var dateFilter2 = dateFilter1.filter((dateOnly2) => {
            return dateOnly2.last_updated_date = moment.utc(dateOnly2.created_date)
          });
          this.dataSource = dateFilter2;
          this.startingToolbarList = dateFilter2;
          this.receiveData.currentMessage.subscribe((message) => {
            this.sortMessage = message;

            if (this.sortMessage == "ascending") {
              this.startingToolbarList.sort((a, b) =>
                a.toolbar_name.localeCompare(b.toolbar_name)
              );
              this.dataSource = new MatTableDataSource(
                this.startingToolbarList
              );
            } else if (this.sortMessage == "descending") {
              this.startingToolbarList.sort((a, b) =>
                b.toolbar_name.localeCompare(a.toolbar_name)
              );
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
        } else {
          window.alert("API Data undefined");
        }
        this.eventsService.on("sortChange", (a) => {
          this.message = a;

          if (this.message == "ascending") {
            this.startingToolbarList.sort((a, b) =>
              a.toolbar_name.localeCompare(b.toolbar_name)
            );
            this.dataSource = new MatTableDataSource(this.startingToolbarList);
          } else if (this.message == "descending") {
            this.startingToolbarList.sort((a, b) =>
              b.toolbar_name.localeCompare(a.toolbar_name)
            );
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
          }
        });
      },
      (error: any) => {

      }
    );
  }

  addToolbarProject() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(ToolbarFeatureComponent, {
      width: "380px",
    });
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

}
