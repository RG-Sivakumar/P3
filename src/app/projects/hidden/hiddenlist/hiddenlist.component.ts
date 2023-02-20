import { Component, OnInit } from "@angular/core";
import { MoreComponent } from "src/app/toolbar/toolbarlist/more/more.component";

import { MatTableDataSource } from "@angular/material/table";
import { ToolbarlistService } from "src/app/toolbar/services/toolbarlist.service";
import { HeadertitleService } from "src/app/headertitle.service";
import { DatePipe } from "@angular/common";
import { EventGlobalService } from "src/app/event-global.service";
import { DataService } from "src/app/data.service";
import { ValueService } from "src/app/value.service";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MoreOptionComponent } from "src/app/toolbar/toolbarlist/more-option/more-option.component";
import { ToolbarhiddenComponent } from "../toolbarhidden/toolbarhidden.component";
import { AddcontentService } from "../../services/addcontent.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-hiddenlist",
  templateUrl: "./hiddenlist.component.html",
  styleUrls: ["./hiddenlist.component.css"],
})
export class HiddenlistComponent implements OnInit {
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
  tool: any[];
  change: boolean = false;
  showLoader: boolean = true;

  displayedColumns: any[] = [
    "Name",
    "CreatedDate",
    "LastModifiedDate",
    "dot",
    "checkLabel",
  ];

  hidetoolbarlistOrigin:any[] = [];
  sorter = this.MySort('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  sorterdesc = this.MySortdesc('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');

  constructor(
    public service: ToolbarlistService,
    private headertitleservice: HeadertitleService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private eventsService: EventGlobalService,
    private receiveData: DataService,
    public service3: ValueService,
    public route: Router,
    private addcontentService: AddcontentService,
    private toolbarService: ToolbarlistService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.service3.currentMessage.subscribe((message) => {
      this.show = message;
    });
    this.service.listen().subscribe((m: any) => {
      this.toolbarlisting();
      // this.getProjectToolbarTaglist();
    });
    // this.addcontentService.loaderActivated.subscribe((status:boolean)=>{
    //   this.showLoader=status
    // });
    this.toolbarService.loaderActivated.subscribe((status: boolean) => {
      this.showLoader = status;
    });
  }

  ngOnInit(): void {
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    this.toolbarlisting();
  }

  onContextMenu(event, toolbarId, toolbarName, createdDate, modifiedDate, is_hidden) {
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(ToolbarhiddenComponent, {
      width: "380px",
      data: {
        toolbarId: toolbarId,
        toolbarName: toolbarName,
        createdDate: createdDate,
        modifiedDate: modifiedDate,
        projectId: this.projectId,
        is_hidden: true,
        tool_list: this.tool,
        hidetoolbarlistOrigin:this.hidetoolbarlistOrigin
      },
    });
  }

  onVeryLongPress(event, toolbarId, toolbarName, createdDate, modifiedDate, is_hidden) {
    console.log(event, toolbarId, toolbarName, createdDate, modifiedDate, is_hidden)
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(ToolbarhiddenComponent, {
      width: "380px",
      data: {
        toolbarId: toolbarId,
        toolbarName: toolbarName,
        createdDate: createdDate,
        modifiedDate: modifiedDate,
        projectId: this.projectId,
        is_hidden: true,
        tool_list: this.tool
      },
    });
  }

  toolbar() {
    this.route.navigate(["toolbar/toolbardesign"]);
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
    let arrResult = [...uniqueProjectFilter, ...projectfilter];
    if (a.length > 0) {
      this.tool = arrResult;
    } else {
      this.tool = this.startingToolbarList;
    }
  };

  getProjectToolbarTaglist() {
    this.service.getProjectAllTag(this.projectId).subscribe((res) => {
      this.searchFunction();
      this.getAllTags = res["response_body"].project_toolbar_tags;
      this.getAlltaglist = res["response_body"].project_toolbar_tags;
    });
  }



  toolbarlisting() {
    this.change = true;
    this.showLoader = true;
    this.service.gettoolbarlist(this.projectId).subscribe((data) => {
      console.log(data);
      this.showLoader = false;
      this.change = false;
      let getresponse_special_character = data["response_body"]["toolbar_listing"];
      if(data["response_body"]["toolbar_listing"].length>0){
        let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character,'toolbarlist');
        console.log(change_character_list);
        data["response_body"]["toolbar_listing"] = change_character_list;
      }
      this.tool = data["response_body"]["toolbar_listing"];
      let removetoolbar = data["response_body"]["toolbar_listing"];
      let removehidden = removetoolbar.filter((ele => ele.is_hidden == true));
      const myArray = removehidden;
      const myClonedArray = [];
      myArray.forEach(val => myClonedArray.push(Object.assign({}, val)));
      this.hidetoolbarlistOrigin = myClonedArray;
      this.tool = this.tool.filter((ele => ele.is_hidden == true))
      var dateFilter = this.tool;
      var dateFilter1 = dateFilter.filter((dateonly) => {
        return (dateonly.created_date = this.datePipe.transform(
          dateonly.created_date,
          "MM/dd/yyyy HH:mm:ss"
        ));
      });
      var dateFilter2 = dateFilter1.filter((dateonly1) => {
        return (dateonly1.last_updated_date = this.datePipe.transform(
          dateonly1.last_updated_date,
          "MM/dd/yyyy HH:mm:ss"
        ));
      });
      console.log(dateFilter2);
      this.tool = dateFilter2;
      this.startingToolbarList = dateFilter2;

      this.receiveData.currentMessage.subscribe(message => {
        this.sortMessage = message;
      
        if (this.sortMessage == "ascending") {
          this.startingToolbarList.sort(this.sorter);
          this.tool = this.startingToolbarList;
      
        }
        else if (this.sortMessage == "descending") {
          this.startingToolbarList.sort(this.sorterdesc);
          this.tool = this.startingToolbarList;
      
        }
        else if (this.sortMessage == "datecreatedOldToRecent") {
          this.startingToolbarList.sort((a, b) => a.toolbar_name.localeCompare(b.toolbar_name));
          this.startingToolbarList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
          this.tool = this.startingToolbarList;
      
        }
        else if (this.sortMessage == "datecreatedRecentToOld") {
          this.startingToolbarList.sort((a, b) => a.toolbar_name.localeCompare(b.toolbar_name));
          this.startingToolbarList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
          this.tool = this.startingToolbarList;
      
        }
        else if (this.sortMessage == "lastupdatedOldToRecent") {
          this.startingToolbarList.sort((a, b) => a.toolbar_name.localeCompare(b.toolbar_name));
          this.startingToolbarList.sort((a, b) => (a.last_updated_date != undefined ? new Date(a.last_updated_date).getTime() : new Date(a.created_date).getTime()) - (b.last_updated_date != undefined ? new Date(b.last_updated_date).getTime() : new Date(b.created_date).getTime()));
          this.tool = this.startingToolbarList;
      
        }
        else if (this.sortMessage == "lastupdatedRecentToOld") {
          this.startingToolbarList.sort((a, b) => a.toolbar_name.localeCompare(b.toolbar_name));
          this.startingToolbarList.sort((a, b) => (b.last_updated_date != undefined ? new Date(b.last_updated_date).getTime() : new Date(b.created_date).getTime()) - (a.last_updated_date != undefined ? new Date(a.last_updated_date).getTime() : new Date(a.created_date).getTime()));
          this.tool = this.startingToolbarList;
        }
      });
      this.getProjectToolbarTaglist();
    });
  }


  toolbarMoreOption(toolbarId, toolbarName, createdDate, modifiedDate) {
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
