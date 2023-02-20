import { Component, OnInit } from "@angular/core";
import { ProjectlistService } from "../my-project/services/projectlist.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MenuComponent } from "../menu/menu.component";
import { CreateProjectComponent } from "../create-project/create-project.component";
import { EventGlobalService } from "src/app/event-global.service";
import { DataService } from "src/app/data.service";
import { DatePipe } from "@angular/common";
import { HeadertitleService } from "src/app/headertitle.service";
import { Router } from "@angular/router";
import * as _ from 'lodash';


@Component({
  selector: "app-hidden-project",
  templateUrl: "./hidden-project.component.html",
  styleUrls: ["./hidden-project.component.css"],
})
export class HiddenProjectComponent implements OnInit {
  displayedColumns: string[];
  listData: MatTableDataSource<any>;
  change: boolean = false;
  change1: boolean = false;
  project: string;
  date1: string;
  date2: string;
  status: any;
  taglist: string[];
  projectid: string;
  sortMessage: string;
  message: string;
  projectlist: any[];
  startProjectlist: any[];
  getAllTags: any[];
  getAlltaglist: any[];
  showLoader: boolean = true;
  ShowHideProjectList: any[] = [];

  constructor(
    private router: Router,
    public service: ProjectlistService,
    public dialog: MatDialog,
    private receiveData: DataService,
    private eventsService: EventGlobalService,
    private datePipe: DatePipe,
    private headerService: HeadertitleService
  ) {
    this.service.listen().subscribe((m: any) => {
      this.gethiddenprojectlists();
    });
    this.service.loaderActivated.subscribe((status: boolean) => {
      this.showLoader = status;
    });
  }
  onMenu(
    project_name,
    last_updated_date,
    created_date,
    project_id,
    project_status
  ) {
    this.projectid = project_id;
    this.status = project_status;
    this.project = project_name;
    this.date1 = last_updated_date;
    this.date2 = created_date;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";

    let dialogRef = this.dialog.open(MenuComponent, {
      width: "400px",

      panelClass: "my-class",
      data: {
        project: this.project,
        date1: this.date1,
        date2: this.date2,
        projectid: this.projectid,
        status: this.status,
      },
    });
  }

  ngOnInit(): void {
    this.headerService.setTitle("Hidden Projects");
    // setTimeout(()=>{
    this.gethiddenprojectlists();
    this.filtermethod();
    this.searchOut();
    // },2000);
  }
  
  sorter = this.MySort('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');
  sorterdesc = this.MySortdesc('!#$_.()*^&%-=+01234567989@abcdefghijklmnopqrstuvwxyz');

  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
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
        data.project_tag_name.toLowerCase().includes(a.toLowerCase())
      );

      var uniqueProjectFilter = this.projectlist.filter(function (
        projectlistId
      ) {
        return tagfilter.some(function (tagfilterId) {
          return projectlistId.project_id === tagfilterId.project_id;
        });
      });
    } else {
      var uniqueProjectFilter = [];
    }
    if (this.projectlist != undefined) {
      var projectfilter = this.projectlist.filter(
        (data) =>
          data.project_name.toLowerCase().includes(a.toLowerCase()) ||
          data.created_date.toLowerCase().includes(a.toLowerCase()) ||
          data.last_updated_date.toLowerCase().includes(a.toLowerCase())
      );
    } else {
      var projectfilter = [];
    }
    let arrResult = [...uniqueProjectFilter, ...projectfilter];
    this.listData = new MatTableDataSource(arrResult);
  };

  gotoprojectdetails(projectId, projectName) {
    this.router.navigate(["projectsection/mainproject"], {
      queryParams: { project_id: projectId, project_name: projectName },
    });
  }

  getProjectTaglist() {
    this.service.getProjectAllTag().subscribe((res) => {
      this.getAllTags = res["response_body"].Project_tags;
      this.getAlltaglist = res["response_body"].Project_tags;
      // if (res["response_body"].hasOwnProperty("Favoriteprojects")) {
      //   this.getProjectTaglist();
      // }
    });
  }

  onAdd() {
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "80%";

    let dialogRef = this.dialog.open(CreateProjectComponent, {
      panelClass: "my-class",
    });
  }
  gethiddenprojectlists() {
    this.service.hiddenproject().subscribe((data) => {
      if (
        undefined !== data["response_body"]["Favoriteprojects"] &&
        data["response_body"]["Favoriteprojects"].length &&
        data["response_body"]["Favoriteprojects"].length >= 1
      ) {
        let getresponse_special_character = data["response_body"]["Favoriteprojects"];
        if (data["response_body"]["Favoriteprojects"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'projectlist');
          console.log(change_character_list);
          data["response_body"]["Favoriteprojects"] = change_character_list;
        }
        console.log(data);
        this.hideProjects(data);
        this.listData = new MatTableDataSource(
          data["response_body"]["Favoriteprojects"]
        );
        if (data["response_body"].hasOwnProperty("Project_tags")) {
          this.gethiddenprojectlists();
        }
        this.displayedColumns = ["Name"];
        this.listData = data["response_body"]["Favoriteprojects"];

        this.change = true;
        this.change1 = false;
      } else {
        this.showLoader = false;
        this.change1 = true;
        this.change = false;
        this.listData = data["response_body"]["Favoriteprojects"];
      }

      var startingData = data["response_body"]["Favoriteprojects"];
      var dateFilter1 = startingData.filter((dateonly) => {
        return (dateonly.created_date = this.datePipe.transform(
          dateonly.created_date,
          "MM/dd/yyyy HH:mm:ss"
        ));
      });

      this.startProjectlist = dateFilter1.filter((dateonly1) => {
        return dateonly1.last_updated_date != undefined
          ? (dateonly1.last_updated_date = this.datePipe.transform(
            dateonly1.last_updated_date,
            "MM/dd/yyyy HH:mm:ss"
          ))
          : (dateonly1.last_updated_date = this.datePipe.transform(
            dateonly1.created_date,
            "MM/dd/yyyy HH:mm:ss"
          ));
      });
      this.listData = new MatTableDataSource(this.startProjectlist);
      this.projectlist = this.startProjectlist;
      this.receiveData.currentMessage.subscribe((message) => {
        this.sortMessage = message;

        if (this.sortMessage == "ascending") {
          this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1)
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.sortMessage == "descending") {
          this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? -1 : 1)
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.sortMessage == "datecreatedOldToRecent") {
          this.projectlist.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.sortMessage == "datecreatedRecentToOld") {
          this.projectlist.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.sortMessage == "lastupdatedOldToRecent") {
          this.projectlist.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.sortMessage == "lastupdatedRecentToOld") {

          this.projectlist.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.projectlist);
        }
      });
      this.eventsService.on("sortChange", (a) => {
        this.message = a;

        if (this.message == "ascending") {
          this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1)
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.message == "descending") {
          this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? -1 : 1)
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.sortMessage == "datecreatedOldToRecent") {
          this.projectlist.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.sortMessage == "datecreatedRecentToOld") {
          this.projectlist.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.sortMessage == "lastupdatedOldToRecent") {
          this.projectlist.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.projectlist);
        } else if (this.sortMessage == "lastupdatedRecentToOld") {

          this.projectlist.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.projectlist);
        }
      });
    });
  }

  hideProjects(data1) {
    this.service.getprojectlist().subscribe((data) => {
      this.showLoader = false;
      this.getProjectTaglist();
      if (data["response_body"]["projects"] != undefined && data["response_body"]["projects"].length > 0 &&
        data1["response_body"]["Favoriteprojects"] && data1["response_body"]["Favoriteprojects"].length > 0) {
          let getresponse_special_character = data1["response_body"]["Favoriteprojects"];
          if (data1["response_body"]["Favoriteprojects"].length > 0) {
            let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'projectlist');
            console.log(change_character_list);
            data1["response_body"]["Favoriteprojects"] = change_character_list;
          }
          let getresponse_special_character1 = data["response_body"]["projects"];
          if (data["response_body"]["projects"].length > 0) {
            let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character1, 'projectlist');
            console.log(change_character_list);
            data["response_body"]["projects"] = change_character_list;
          }
          let activeProject = _.cloneDeep(data1["response_body"]["Favoriteprojects"]);
        let hideProject = _.cloneDeep(data["response_body"]["projects"]);
        this.ShowHideProjectList = [...activeProject, ...hideProject];
      }
      else if (data["response_body"]["projects"] != undefined && data["response_body"]["projects"].length > 0) {
        let getresponse_special_character1 = data["response_body"]["projects"];
          if (data["response_body"]["projects"].length > 0) {
            let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character1, 'projectlist');
            console.log(change_character_list);
            data["response_body"]["projects"] = change_character_list;
          }
        this.ShowHideProjectList = _.cloneDeep(data["response_body"]["projects"]);
      }
      else if (data1["response_body"]["Favoriteprojects"] && data1["response_body"]["Favoriteprojects"].length > 0) {
        let getresponse_special_character = data1["response_body"]["Favoriteprojects"];
          if (data1["response_body"]["Favoriteprojects"].length > 0) {
            let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'projectlist');
            console.log(change_character_list);
            data1["response_body"]["Favoriteprojects"] = change_character_list;
          }
        this.ShowHideProjectList = _.cloneDeep(data1["response_body"]["Favoriteprojects"]);
      }
    });
  }

  onContextMenu(
    event,
    project_name,
    last_updated_date,
    created_date,
    project_id,
    project_status
  ) {
    event.preventDefault();
    this.projectid = project_id;
    this.status = project_status;
    this.project = project_name;
    this.date1 = last_updated_date;
    this.date2 = created_date;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(MenuComponent, {
      width: "400px",

      panelClass: "my-class",
      data: {
        project: this.project,
        date1: this.date1,
        date2: this.date2,
        projectid: this.projectid,
        status: this.status,
        ShowHideProjectList: this.ShowHideProjectList
      },
    });
  }

  onVeryLongPress(
    event,
    project_name,
    last_updated_date,
    created_date,
    project_id,
    project_status
  ) {
    event.preventDefault();
    this.projectid = project_id;
    this.status = project_status;
    this.project = project_name;
    this.date1 = last_updated_date;
    this.date2 = created_date;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = true;
    dialgoConfig.autoFocus = true;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(MenuComponent, {
      width: "400px",

      panelClass: "my-class",
      data: {
        project: this.project,
        date1: this.date1,
        date2: this.date2,
        projectid: this.projectid,
        status: this.status,
        ShowHideProjectList: this.ShowHideProjectList
      },
    });
  }
  MySort(alphabet)
{
    return function(a, b) {
        var index_a = alphabet.indexOf(a[0]),
        index_b = alphabet.indexOf(b[0]);

        if (index_a === index_b) {
            if (a.project_name < b.project_name) {
                return -1;
            } else if (a.project_name > b.project_name) {
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
            if (a.project_name < b.project_name) {
                return 1;
            } else if (a.project_name > b.project_name) {
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
