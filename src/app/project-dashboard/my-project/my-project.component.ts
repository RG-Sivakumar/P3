import { Component, OnInit, Output, ViewChild, Input, ElementRef } from "@angular/core";
import { MAT_SELECT_SCROLL_STRATEGY } from "@angular/material/select";
import { MatTableDataSource } from "@angular/material/table";
import { ProjectlistService } from "./services/projectlist.service";
import { MainLoaderComponent } from "src/app/main-loader/main-loader.component"
import {	
  MatDialogConfig,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { CreateProjectComponent } from "../create-project/create-project.component";
import { MenuComponent } from "../menu/menu.component";
import { Router } from "@angular/router";
import { DataService } from "src/app/data.service";
import { EventGlobalService } from "src/app/event-global.service";
import { DatePipe } from "@angular/common";
import { HeadertitleService } from "src/app/headertitle.service";
import { AbsoluteSourceSpan } from "@angular/compiler";
import {
  CdkOverlayOrigin,
  ScrollStrategy,
  ScrollStrategyOptions,
  CdkConnectedOverlay,
} from "@angular/cdk/overlay";
import { Overlay, BlockScrollStrategy } from "@angular/cdk/overlay";
import { AllListService } from "src/app/all-list.service";
import * as _ from 'lodash';
import * as moment from "moment";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { EditPermissionPopupComponent } from "../edit-permission-popup/edit-permission-popup.component";

// export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
//   return () => overlay.scrollStrategies.block();
// }

@Component({
  selector: "app-my-project",
  templateUrl: "./my-project.component.html",
  styleUrls: ["./my-project.component.css"],
})
export class MyProjectComponent implements OnInit {
  change: boolean = false;
  change1: boolean = false;
  panalclass: any;
  project: string;
  date1: string;
  date2: string;
  status: any;
  taglist: any[];
  message: string;
  sortMessage: string;
  projectid: string;
  startProjectlist: any[];
  projectlist: any[];
  getAllTags: any[];
  getAlltaglist: any[];
  projectlist1: string[];
  displayedColumns: string[] = ["Name"];
  showLoader: boolean = true;
  ShowHideProjectList: any[] = [];

  constructor(
    public service: ProjectlistService,
    private dialog: MatDialog,
    private router: Router,
    public receiveData: DataService,
    private eventsService: EventGlobalService,
    private datashareservice: DataService,
    private datePipe: DatePipe,
    private headerService: HeadertitleService,
    private readonly sso: ScrollStrategyOptions,
    public allListService: AllListService,
    private userRoleGlobal:GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.service.listen().subscribe((m: any) => {
      this.getprojectlists();
    });
    this.service.loaderActivated.subscribe((status: boolean) => {
      this.showLoader = status;
    })
    
  }
  @Input() listData: any;

  ngOnInit(): void {
    this.getprojectlists();
    this.headerService.setTitle("My Projects");
    let expandNodeListRemover = this.encrptdecrpt.getItem('expandNode');
      if(expandNodeListRemover!=null){
        // localStorage.removeItem('expandNode');
        this.encrptdecrpt.removeItem("expandNode");//security
      }
    this.filtermethod();
    this.searchOut();
    // this.forloopproject();
    
  }

  async forloopproject(){
    let projectids = ['9-A0F32101-4765-11EC-94EF-D1D66F2D1AC4-1637126235920','9-99B66AF1-5354-11EC-9BFF-1B07311D9275-1638438336287','9-89B97B70-98FF-417F-8279-C5063BF61887-1637405349523'];
    console.log('loop started');
    for(let k=0;k<projectids.length;k++){
      await this.service.getprojectuserpermission(projectids[k]).toPromise()
      .then(
        res=>{
          console.log(res);
        },
        err=>{
          console.log(err);
        }
      )
    }
    console.log('loop completed');
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
          (data.last_updated_date != undefined
            ? data.last_updated_date.toLowerCase().includes(a.toLowerCase())
            : data.created_date.toLowerCase().includes(a.toLowerCase))
      );
    } else {
      var projectfilter = [];
    }
    if (a.length > 0) {

      let arrResult = [...projectfilter, ...uniqueProjectFilter];
      var finalResult = [];
      finalResult = arrResult.filter(function (item, pos) {
        return arrResult.indexOf(item) == pos;
      })

      this.listData = new MatTableDataSource(finalResult);
    } else if (a.length == 0) {
      this.listData = new MatTableDataSource(this.projectlist);
    }
  };

  getProjectTaglist() {
    this.service.getProjectAllTag().subscribe((res) => {
      this.getAllTags = res["response_body"]["project_tags"];
      this.getAlltaglist = res["response_body"]["project_tags"];
      if (res["response_body"].hasOwnProperty("projects")) {
        this.getProjectTaglist();
      }
    });
  }
  
  onAdd() {
    var userMail = this.encrptdecrpt.getItem("email_id");
    var spliting = userMail.split('@')
    var wje_mail = spliting[1]
    var final_split = wje_mail.split('.')
    const userCheck = final_split[0];
    if (userCheck == 'wje'  || userCheck=='p3qa' || userCheck=='p3dev' || userCheck=='64htm') {
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      dialgoConfig.width = "80%";

      let dialogRef = this.dialog.open(CreateProjectComponent, {
        panelClass: "my-class",
      });
    }
    else{
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      dialgoConfig.width = "100%";
      let dialogRef = this.dialog.open(EditPermissionPopupComponent, {
        data : {
          location : "AddProject"
        }
      });
  
    }
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

  getprojectlists() {
    this.service.getprojectlist().subscribe((data) => {
      this.showLoader = false;
      let dateChecking1 = new Date().toISOString();
      let dateChecking2 = new Date().toISOString();
      this.hideProjects(data);
      if (
        undefined !== data["response_body"]["projects"] &&
        data["response_body"]["projects"].length >= 1
      ) {
        let getresponse_special_character = data["response_body"]["projects"];
        if (data["response_body"]["projects"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'projectlist');
          console.log(change_character_list);
          data["response_body"]["projects"] = change_character_list;
        }
        this.listData = new MatTableDataSource(data["response_body"]["projects"]);
        this.change = true;
        this.change1 = false;
      } else {
        this.showLoader = false;
        this.change1 = true;
        this.change = false;
        this.listData = data["response_body"]["Favoriteprojects"];
      }
      if (
        undefined !== data["response_body"]["projects"] &&
        data["response_body"]["projects"].length
      ) {
        if (data !== null) {
          if (data["response_body"]["projects"].length == 0) {
            this.change1 = true;
            this.change = false;
          } else {
            this.listData = new MatTableDataSource(
              data["response_body"]["projects"]
            );
            this.allListService.saveList(this.listData);
            this.change = true;
            this.change1 = false;
            var startingData = data["response_body"]["projects"];
            var dateFilter1 = startingData.filter((dateonly) => {
              if (dateonly.created_date != "0000-00-00 00:00:00") {
                return (dateonly.created_date = this.datePipe.transform(
                  dateonly.created_date,
                  "MM/dd/yyyy HH:mm:ss"
                ));
              }
            });
           
            this.startProjectlist = dateFilter1.filter((dateonly1) => {
              if (dateonly1.last_updated_date != "0000-00-00 00:00:00") {
                return dateonly1.last_updated_date != undefined
                  ? (dateonly1.last_updated_date = this.datePipe.transform(
                    dateonly1.last_updated_date,
                    "MM/dd/yyyy HH:mm:ss"
                  ))
                  : (dateonly1.last_updated_date = this.datePipe.transform(
                    dateonly1.created_date,
                    "MM/dd/yyyy HH:mm:ss"
                  ));
              }
            });
            this.startProjectlist= data["response_body"]["projects"];
            this.listData = new MatTableDataSource(this.startProjectlist);
            this.projectlist = this.startProjectlist;
          }
          this.receiveData.currentMessage.subscribe((message) => {
            this.sortMessage = message;
            if (this.sortMessage == "ascending") {
              this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1)
             // this.projectlist.sort(this.sorter);
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
          // this.listData = new MatTableDataSource(this.startProjectlist);
          this.eventsService.on("sortChange", (a) => {
            this.message = a;
            if (this.message == "ascending") {
              this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? 1 : -1)
              this.listData = new MatTableDataSource(this.projectlist);
            } else if (this.message == "descending") {
              this.projectlist.sort((a, b) =>(a.project_name.toLowerCase() > b.project_name.toLowerCase()) ? -1 : 1)
              this.listData = new MatTableDataSource(this.projectlist);
            } else if (this.message == "datecreatedOldToRecent") {
              this.projectlist.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
              this.listData = new MatTableDataSource(this.projectlist);
            } else if (this.message == "datecreatedRecentToOld") {
              this.projectlist.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
              this.listData = new MatTableDataSource(this.projectlist);
            } else if (this.message == "lastupdatedOldToRecent") {
              this.projectlist.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
              this.listData = new MatTableDataSource(this.projectlist);
            } else if (this.message == "lastupdatedRecentToOld") {
              this.projectlist.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
              this.listData = new MatTableDataSource(this.projectlist);
            }
          });
          this.project = data["response_body"]["projects"];
        }
      }
    });
  }

  hideProjects(data1) {
    this.service.hiddenproject().subscribe((data) => {
      this.showLoader = false;
      this.getProjectTaglist();
      console.log(data);
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
        this.ShowHideProjectList = [...activeProject, ...hideProject];
      }
      else if (data["response_body"]["Favoriteprojects"] != undefined && data["response_body"]["Favoriteprojects"].length > 0) {
        let getresponse_special_character1 = data["response_body"]["Favoriteprojects"];
        if (data["response_body"]["Favoriteprojects"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character1, 'projectlist');
          console.log(change_character_list);
          data["response_body"]["Favoriteprojects"] = change_character_list;
        }
        this.ShowHideProjectList = _.cloneDeep(data["response_body"]["Favoriteprojects"]);
      }
      else if (data1["response_body"]["projects"] && data1["response_body"]["projects"].length > 0) {
        let getresponse_special_character = data1["response_body"]["projects"];
        if (data1["response_body"]["projects"].length > 0) {
          let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character, 'projectlist');
          console.log(change_character_list);
          data1["response_body"]["projects"] = change_character_list;
        }
        this.ShowHideProjectList = _.cloneDeep(data1["response_body"]["projects"]);
      }
    });
  }

  gotoprojectdetails(projectId, projectName, ud, cd, status, admin, edit, view) {
    
    this.userRoleGlobal.findUserRole(this.ShowHideProjectList,projectId);
    this.headerService.setTitle(projectName);
    let roleDetails = {project_id:projectId,userRole:this.userRoleGlobal.userRol};
    // localStorage.setItem("userPermission", JSON.stringify(roleDetails));
    this.encrptdecrpt.setItem("userPermission",roleDetails);//security
    // localStorage.setItem("project_name", projectName);
    this.encrptdecrpt.setItem("project_name",projectName);//security
    // localStorage.setItem("prject_id", projectId);
    this.encrptdecrpt.setItem("prject_id",projectId);//security
    // localStorage.setItem("project_cdate", cd);
    this.encrptdecrpt.setItem("project_cdate",cd);//security
    // localStorage.setItem("project_mdate", ud);
    this.encrptdecrpt.setItem("project_mdate",ud);//security
    // localStorage.setItem("project_status", status);
    this.encrptdecrpt.setItem("project_status",status);//security
    this.router.navigate(["projectsection/mainproject"], {
      queryParams: { project_id: projectId, project_name: projectName },
    });
  }
  scrollStrategy: ScrollStrategy;

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
    dialgoConfig.disableClose = false;
    dialgoConfig.autoFocus = false;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(MenuComponent, {
      width: "400px",
      autoFocus: false,
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

  onVeryLongPress(event,
    project_name,
    last_updated_date,
    created_date,
    project_id,
    project_status) {
    this.projectid = project_id;
    this.status = project_status;
    this.project = project_name;
    this.date1 = last_updated_date;
    this.date2 = created_date;
    const dialgoConfig = new MatDialogConfig();
    dialgoConfig.disableClose = false;
    dialgoConfig.autoFocus = false;
    dialgoConfig.width = "100%";
    let dialogRef = this.dialog.open(MenuComponent, {
      width: "400px",
      autoFocus: false,
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



  getIndex(index) {
    console.log(index);
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
