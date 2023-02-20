import { Component, OnInit } from "@angular/core";
import { ProjectlistService } from "../my-project/services/projectlist.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { MenuComponent } from "../menu/menu.component";
import { CreateProjectComponent } from "../create-project/create-project.component";
import { Router } from "@angular/router";
import { DataService } from "src/app/data.service";
import { EventGlobalService } from "src/app/event-global.service";
import { DatePipe } from "@angular/common";
import { HeadertitleService } from "src/app/headertitle.service";
import * as _ from 'lodash';

@Component({
  selector: "app-recent-project",
  templateUrl: "./recent-project.component.html",
  styleUrls: ["./recent-project.component.css"],
})
export class RecentProjectComponent implements OnInit {
  change: boolean = false;
  change1: boolean = false;
  listData: MatTableDataSource<any>;
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
  displayedColumns: string[] = ["Name"];
  showLoader: boolean = true;
  ShowHideProjectList: any[] = [];

  constructor(
    public service: ProjectlistService,
    private dialog: MatDialog,
    private router: Router,
    private receiveData: DataService,
    private eventsService: EventGlobalService,
    private datePipe: DatePipe,
    private headerService: HeadertitleService
  ) {
    this.service.listen().subscribe((m: any) => {
      console.log(m);
      this.Recentproject();
    });
    this.service.loaderActivated.subscribe((status: boolean) => {
      this.showLoader = status;
    });
    this.sortingFunction();
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
    this.Recentproject();
    this.headerService.setTitle("Recent Projects");
    this.filtermethod();
    this.searchOut();
  }

  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
  }

  filtermethod() {
    this.eventsService.on("on", (a) => {
      this.message = a;
      console.log(this.message);
      this.applyFilter(this.message);
    });
  }
  applyFilter = (filtervalue) => {
    var a = filtervalue;
    console.log(a.length);
    if (this.getAlltaglist != undefined) {
      var tagfilter = this.getAlltaglist.filter((data) =>
        data.project_tag_name.toLowerCase().includes(a.toLowerCase())
      );
      console.log(tagfilter);
      var uniqueProjectFilter = this.projectlist.filter(function (
        projectlistId
      ) {
        return tagfilter.some(function (tagfilterId) {
          return projectlistId.project_id === tagfilterId.project_id;
        });
      });
      console.log(uniqueProjectFilter);
    } else {
      var uniqueProjectFilter = [];
    }
    if (this.projectlist != undefined) {
      var projectfilter = this.projectlist.filter(
        (data) =>
          data.project_name.toLowerCase().includes(a.toLowerCase()) ||
          data.created_date.toLowerCase().includes(a.toLowerCase()) ||
          (data.last_updated_date != undefined
            ? data.last_updated_date.toLowerCase().includes(a.toLowerCase())
            : data.created_date.toLowerCase().includes(a.toLowerCase))
      );
    } else {
      var projectfilter = [];
    }
    let arrResult = [...uniqueProjectFilter, ...projectfilter];
    console.log(arrResult);
    if (a.length > 0) {
      this.listData = new MatTableDataSource(arrResult);
    } else {
      this.listData = new MatTableDataSource(this.projectlist);
    }
  };

  getProjectTaglist() {
    this.service.getProjectAllTag().subscribe((res) => {
      this.getAllTags = res["response_body"].Project_tags;
      this.getAlltaglist = res["response_body"].Project_tags;
      // if (res["response_body"].hasOwnProperty("Recentlyaccess")) {
      //   this.getProjectTaglist();
      // }
      console.log(this.getAllTags);
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
  Recentproject() {
    this.showLoader=true;
    this.service.recentproject().subscribe((res) => {
     
      if (
        undefined !== res["response_body"]["Recentlyaccess"] &&
        res["response_body"]["Recentlyaccess"].length &&
        res["response_body"]["Recentlyaccess"].length >= 1
      ) {
        let getresponse_special_character = res["response_body"]["Recentlyaccess"];
        if (res["response_body"]["Recentlyaccess"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'projectlist');
          console.log(change_character_list);
          res["response_body"]["Recentlyaccess"] = change_character_list;
        }
        this.getProjects();
        this.listData = res["response_body"]["Recentlyaccess"];
        console.log(res["response_body"]["Recentlyaccess"])
        this.displayedColumns = ["Name"];
        this.listData = res["response_body"]["Recentlyaccess"];
        this.change = true;
        this.change1 = false;
      } else {
        this.showLoader = false;
        this.change1 = true;
        this.change = false;
        this.listData = res["response_body"]["Recentlyaccess"];
      }
      if (res["response_body"].hasOwnProperty("Project_tags")) {
        this.Recentproject();
      }
      this.projectlist = res["response_body"]["Recentlyaccess"];
      
      this.projectlist.sort((a, b) =>
      (a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1
      );
    });
  }


  sortRecentProject() {
    var startingData = this.projectlist;
    if (startingData != undefined && dateFilter1 == undefined) {
      var dateFilter1 = startingData.filter((dateonly) => {
        return (dateonly.created_date = this.datePipe.transform(
          dateonly.created_date,
          "MM/dd/yyyy HH:mm:ss"
        ));
      });
      console.log(dateFilter1);
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
        console.log(this.sortMessage);
        if (this.sortMessage == "ascending") {
          this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1)
          this.listData = new MatTableDataSource(this.projectlist);
          console.log(this.projectlist);
        } else if (this.sortMessage == "descending") {
          this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? -1 : 1)
          this.listData = new MatTableDataSource(this.projectlist);
          console.log(this.projectlist);
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
    }
    this.eventsService.on("sortChange", (a) => {
      this.message = a;
      console.log(this.message);
      if (this.message == "ascending") {
        this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1)
        this.listData = new MatTableDataSource(this.projectlist);
        console.log(this.projectlist);
      } else if (this.message == "descending") {
        this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? -1 : 1)
        this.listData = new MatTableDataSource(this.projectlist);
        console.log(this.projectlist);
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
  }



  getProjects() {
    this.showLoader=true;
    this.service.getprojectlist().subscribe((data) => {
      console.log(data);
      this.hideProjects(data);
    });
  }

  sortingFunction() {
    var startingData = this.projectlist;
    if (startingData != undefined && dateFilter1 == undefined) {
      var dateFilter1 = startingData.filter((dateonly) => {
        return (dateonly.created_date = this.datePipe.transform(
          dateonly.created_date,
          "MM/dd/yyyy"
        ));
      });
      console.log(dateFilter1);
      this.startProjectlist = dateFilter1.filter((dateonly1) => {
        return dateonly1.last_updated_date != undefined
          ? (dateonly1.last_updated_date = this.datePipe.transform(
            dateonly1.last_updated_date,
            "MM/dd/yyyy"
          ))
          : (dateonly1.last_updated_date = this.datePipe.transform(
            dateonly1.created_date,
            "MM/dd/yyyy"
          ));
      });
      this.listData = new MatTableDataSource(this.startProjectlist);

      this.projectlist = this.startProjectlist;
      this.receiveData.currentMessage.subscribe((message) => {

        this.sortMessage = message;
        console.log(this.sortMessage);
        if (this.sortMessage == "ascending") {
          this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1)
          this.listData = new MatTableDataSource(this.projectlist);
          console.log(this.projectlist);
        } else if (this.sortMessage == "descending") {
          this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? -1 : 1)
          this.listData = new MatTableDataSource(this.projectlist);
          console.log(this.projectlist);
        } else if (this.sortMessage == "datecreatedOldToRecent") {
          this.projectlist.sort((a, b) =>
            a.created_date.localeCompare(b.created_date)
          );
          this.listData = new MatTableDataSource(this.projectlist);
          console.log(this.projectlist);
        } else if (this.sortMessage == "datecreatedRecentToOld") {
          this.projectlist.sort((a, b) =>
            b.created_date.localeCompare(a.created_date)
          );
          this.listData = new MatTableDataSource(this.projectlist);
          console.log(this.projectlist);
        } else if (this.sortMessage == "lastupdatedOldToRecent") {
          this.projectlist.sort((a, b) =>
            (a.last_updated_date != undefined
              ? a.last_updated_date
              : a.created_date
            ).localeCompare(
              b.last_updated_date != undefined
                ? b.last_updated_date
                : b.created_date
            )
          );
          this.listData = new MatTableDataSource(this.projectlist);
          console.log(this.projectlist);
        } else if (this.sortMessage == "lastupdatedRecentToOld") {
          this.projectlist.sort((a, b) =>
            (b.last_updated_date != undefined
              ? b.last_updated_date
              : b.created_date
            ).localeCompare(
              a.last_updated_date != undefined
                ? a.last_updated_date
                : a.created_date
            )
          );
          this.listData = new MatTableDataSource(this.projectlist);
          console.log(this.projectlist);
        }
      });
    }
    this.eventsService.on("sortChange", (a) => {
      this.message = a;
      console.log(this.message);
      if (this.message == "ascending") {
        this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1)
        this.listData = new MatTableDataSource(this.projectlist);
        console.log(this.projectlist);
      } else if (this.message == "descending") {
        this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? -1 : 1)
        this.listData = new MatTableDataSource(this.projectlist);
        console.log(this.projectlist);
      } else if (this.message == "datecreatedOldToRecent") {
        this.projectlist.sort((a, b) =>
          a.project_name.localeCompare(b.project_name)
        );
        this.projectlist.sort((a, b) =>
          a.created_date.localeCompare(b.created_date)
        );
        this.listData = new MatTableDataSource(this.projectlist);
        console.log(this.projectlist);
        this.projectlist.filter((data) => console.log(data.created_date));
      } else if (this.message == "datecreatedRecentToOld") {
        this.projectlist.sort((a, b) =>
          b.project_name.localeCompare(a.project_name)
        );
        this.projectlist.sort((a, b) =>
          b.created_date.localeCompare(a.created_date)
        );
        this.listData = new MatTableDataSource(this.projectlist);
        console.log(this.projectlist);
        this.projectlist.filter((data) => console.log(data.created_date));
      } else if (this.message == "lastupdatedOldToRecent") {
        this.projectlist.sort((a, b) =>
          a.project_name.localeCompare(b.project_name)
        );
        this.projectlist.sort((a, b) =>
          (a.last_updated_date != undefined
            ? a.last_updated_date
            : a.created_date
          ).localeCompare(
            b.last_updated_date != undefined
              ? b.last_updated_date
              : b.created_date
          )
        );
        this.listData = new MatTableDataSource(this.projectlist);
        console.log(this.projectlist);
        this.projectlist.filter((data) =>
          console.log(data.last_updated_date)
        );
      } else if (this.message == "lastupdatedRecentToOld") {
        this.projectlist.sort((a, b) =>
          b.project_name.localeCompare(a.project_name)
        );
        this.projectlist.sort((a, b) =>
          (b.last_updated_date != undefined
            ? b.last_updated_date
            : b.created_date
          ).localeCompare(
            a.last_updated_date != undefined
              ? a.last_updated_date
              : a.created_date
          )
        );
        this.listData = new MatTableDataSource(this.projectlist);
        console.log(this.projectlist);
        this.projectlist.filter((data) =>
          console.log(data.last_updated_date)
        );
      }
    });
  }

  gotoprojectdetails(projectId, projectName) {
    console.log(projectId);
    this.router.navigate(["projectsection/mainproject"], {
      queryParams: { project_id: projectId, project_name: projectName },
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


  hideProjects(data1) {
   
    this.service.hiddenproject().subscribe((data) => {
      this.getProjectTaglist();
      if (data["response_body"]["Favoriteprojects"] != undefined && data["response_body"]["Favoriteprojects"].length > 0 &&
        data1["response_body"]["projects"] && data1["response_body"]["projects"].length > 0) {
        let getresponse_special_character = data1["response_body"]["projects"];
        if (data1["response_body"]["projects"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'projectlist');
          console.log(change_character_list);
          data1["response_body"]["projects"] = change_character_list;
        }
        let getresponse_special_character1 = data["response_body"]["Favoriteprojects"];
        if (data["response_body"]["Favoriteprojects"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character1, 'projectlist');
          console.log(change_character_list);
          data["response_body"]["Favoriteprojects"] = change_character_list;
        }
        let activeProject = _.cloneDeep(data1["response_body"]["projects"]);
        let hideProject = _.cloneDeep(data["response_body"]["Favoriteprojects"]);
        console.log(activeProject, hideProject);
        this.ShowHideProjectList = [...activeProject, ...hideProject];
        console.log(this.ShowHideProjectList);
      }
      else if (data["response_body"]["Favoriteprojects"] != undefined && data["response_body"]["Favoriteprojects"].length > 0) {
        let getresponse_special_character1 = data["response_body"]["Favoriteprojects"];
        if (data["response_body"]["Favoriteprojects"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character1, 'projectlist');
          console.log(change_character_list);
          data["response_body"]["Favoriteprojects"] = change_character_list;
        }
        this.ShowHideProjectList = _.cloneDeep(data["response_body"]["Favoriteprojects"]);
        console.log(this.ShowHideProjectList);
      }
      else if (data1["response_body"]["projects"] && data1["response_body"]["projects"].length > 0) {
        let getresponse_special_character = data1["response_body"]["projects"];
        if (data1["response_body"]["projects"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'projectlist');
          console.log(change_character_list);
          data1["response_body"]["projects"] = change_character_list;
        }
        this.ShowHideProjectList = _.cloneDeep(data1["response_body"]["projects"]);
        console.log(this.ShowHideProjectList);
      }
      this.showLoader=false;
    });
  }
}
