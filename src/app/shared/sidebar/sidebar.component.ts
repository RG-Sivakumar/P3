import {
  Component,
  AfterViewInit,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { ROUTES, ROUTES1, ROUTES2, ROUTES3, ROUTES5, ROUTES6, ROUTES7 } from "./menu-items";
import { RouteInfo } from "./sidebar.metadata";
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  NavigationEnd,
  RouterEvent,
} from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { CreateProjectComponent } from "src/app/project-dashboard/create-project/create-project.component";
import { NgForm } from "@angular/forms";
import { ValueService } from "src/app/value.service";
import { HeadertitleService } from "src/app/headertitle.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { SearchService } from "src/app/search.service";
import { filter } from "rxjs/operators";
import { DataService } from "src/app/data.service";
import { SignoutComponent } from "./signout/signout.component";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
declare var $: any;

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  public config: PerfectScrollbarConfigInterface = {};
  // rememberMe =  this.encrptdecrpt.getItem("rememberMe");
  rememberMe =  this.encrptdecrpt.getItem("rememberMe");//security;
  showHead: boolean;
  sidebarchnage: boolean = false;
  addSupportKey = false;
  title: string;
  changeArrow: boolean = false;
  supportbgSet: boolean = false;
  loggedin = this.encrptdecrpt.getItem("loggedIn");//security;
  previousRoute: string = "";
  projectDetailsBackupURL: string = "";
  routeprojectName: string = "";
  routeprojectId: string = "";

  sidebarnavItems1: RouteInfo[] = [
    {
      path: "/formbuilder/formSupport",
      title: "Support",
      icon: "assets/images/icons/P3WebIcon_6Question.png",
      class: "",
      label: "",
      labelClass: "",
      extralink: false,
      submenu: [],
      check: true,
      width: "28",
      height: "22",
    },
    {
      path: "",
      title: "Dashboard",
      icon: "assets/images/P3_ArrowLeft.png",
      class: "",
      label: "",
      labelClass: "",
      extralink: false,
      submenu: [],
      check: true,
      width: "15",
      height: "15",
    },];

  constructor(
    public send: ValueService,
    private sendData: DataService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private headertitleservice: HeadertitleService,
    private routingState: SearchService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.rememberMe =  this.encrptdecrpt.getItem("rememberMe");//security;
    this.loggedin = this.encrptdecrpt.getItem("loggedIn");//security;
    if (this.loggedin === null) {
      this.router.navigateByUrl("projectmanagement/login");
    }
    router.events.forEach((event) => {
      if (event instanceof RouterEvent) {
        this.previousRoute = this.routingState.getPreviousUrl();
        if (this.previousRoute == "/projectdashboard/myproject" || this.previousRoute == "/projectdashboard/recentproject"
          || this.previousRoute == "/projectdashboard/favoriteproject" || this.previousRoute == "/projectdashboard/hiddenproject") {
          this.sidebarnavItems1[1].path = this.previousRoute;
          console.log(this.previousRoute);
          console.log(this.sidebarnavItems1[1].path);
          this.routeprojectId = "";
          this.routeprojectName = "";
        }
        // if (event["url"].includes("projectsection/mainproject") && this.routeprojectId == "") {
        //   this.routeprojectId = this.route.snapshot.queryParamMap.get("project_id");
        //   this.routeprojectName = this.route.snapshot.queryParamMap.get("project_name");
        // }
        // else if (event["url"].includes("projectsection/mainproject") && this.routeprojectId != "") {
        //   const queryParams = { project_id: this.routeprojectId, project_name: this.routeprojectName };
        //   this.router.navigate([], {
        //     relativeTo: this.route, queryParams: queryParams,
        //     queryParamsHandling: 'merge', // remove to replace all query params by provided
        //   });
        //   console.log(queryParams);
        // }
      }
    });
    console.log(this.previousRoute);
    if (this.previousRoute == "") {
      this.sidebarnavItems1[1].path = "/projectdashboard/myproject";
    }

    router.events.forEach((event) => {
      if (event instanceof RouterEvent) {
        if (
          event["url"].includes("projectsection/mainproject") ||
          event["url"].includes("formbuilder/formlist") ||
          event["url"].includes("projectsection/Hidden") ||
          event["url"].includes("toolbar/toolbarlist") ||
          event["url"].includes("projectdashboard/manageuser") ||
          event["url"].includes("formbuilder/formSupport")
        ) {
          for (let k = 0; k < ROUTES1.length; k++) {
            ROUTES1[k].labelClass = "";
          }
          this.sidebarnavItems = ROUTES1.filter((sidebarnavItem) => sidebarnavItem);
          this.addSupportKey = true;
        }
        else if (event["url"].includes("toolbar/import-Toolbar") || event["url"].includes("/toolbar/duplicateform")) {
          console.log(ROUTES1);
          for (let k = 0; k < ROUTES1.length; k++) {
            if (ROUTES1[k].path.includes("/toolbar/toolbarlist")) {
              ROUTES1[k].labelClass = "importToolbar";
            }
            else {
              ROUTES1[k].labelClass = "";
            }
          }
          this.sidebarnavItems = ROUTES1.filter((sidebarnavItem) => sidebarnavItem);
        }
        else if (event["url"].includes("formbuilder/duplicate") || event["url"].includes("/formbuilder/import-form")) {
          console.log(ROUTES1);
          for (let k = 0; k < ROUTES1.length; k++) {
            if (ROUTES1[k].path.includes("formbuilder/formlist")) {
              ROUTES1[k].labelClass = "importToolbar";
            }
            else {
              ROUTES1[k].labelClass = "";
            }
          }
          this.sidebarnavItems = ROUTES1.filter((sidebarnavItem) => sidebarnavItem);
        }
        else if (event["url"].includes("formbuilder/formEdit")) {
          this.addSupportKey = false;
          this.sidebarnavItems = ROUTES3.filter((sidebarnavItem) => sidebarnavItem);
        }
        else if (event["url"].includes("document/document")) {
          this.sidebarnavItems = ROUTES2.filter(
            (sidebarnavItem) => sidebarnavItem
          );
        }
        else {
          this.addSupportKey = false;
          this.sidebarnavItems = ROUTES.filter(
            (sidebarnavItem) => sidebarnavItem
          );
        }
      }
    });
  }
  showMenu = "";
  showSubMenu = "";
  public sidebarnavItems: any[];
  // this is for the open close
  addExpandClass(element: any) {

    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = "0";
    } else {
      this.showSubMenu = element;
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  checksum() {
    this.router.events.forEach((event) => {
      //
      if (event instanceof RouterEvent) {
        if (
          event["snapshot"]["_routerState"]["url"].includes(
            "projectsection/mainproject"
          )
        ) {
          this.sidebarnavItems = ROUTES1.filter(
            (sidebarnavItem) => sidebarnavItem
          );
          // this.reloadComponent();
        } else {
          this.sidebarnavItems = ROUTES.filter(
            (sidebarnavItem) => sidebarnavItem
          );
          // this.reloadComponent1();
        }
      }
    });
  }

  // End open close
  ngOnInit() {
    if (this.loggedin === null) {
      this.router.navigateByUrl("projectmanagement/login");
    }
  }
  arrowChange() {
    this.changeArrow = !this.changeArrow;
  }

  openAddproject() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(CreateProjectComponent);
  }
  getvalue(data) {
    this.send.changeMessage(data);
  }
  ready(name) {
    if (name == "/settings/signout") {
      console.log("wordsss")
      const dialgoConfig = new MatDialogConfig();
      dialgoConfig.disableClose = true;
      dialgoConfig.autoFocus = true;
      dialgoConfig.width = "100%";
  
      let dialogRef = this.dialog.open(SignoutComponent, {
        panelClass: "class",
       disableClose:true,
        data:{
          rememberMe:this.rememberMe
        }
      });
  }
  }
  }
