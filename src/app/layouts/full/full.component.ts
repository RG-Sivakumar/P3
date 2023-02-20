import { Component, OnInit, HostListener, Inject, ChangeDetectorRef } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";


declare var $: any;

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  sideBarHide: boolean = false;
  removePage = false;

  constructor(public router: Router, private cdRef: ChangeDetectorRef,) {
    router.events.forEach((event) => {
      if (event instanceof RouterEvent) {
        if (
          event["url"].includes("toolbar/toolbardesign") ||
          event["url"].includes("formbuilder/formEdit") ||
          event["url"].includes("document/document")
        ) {
          this.sideBarHide = true;
        } else {
          this.sideBarHide = false;
        }
      }
      //
    });
  }

  tabStatus = "justified";

  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;

  options = {
    theme: "light", // two possible values: light, dark
    dir: "ltr", // two possible values: ltr, rtl
    layout: "vertical", // fixed value. shouldn't be changed.
    sidebartype: "full", // four possible values: full, iconbar, overlay, mini-sidebar
    sidebarpos: "fixed", // two possible values: fixed, absolute
    headerpos: "fixed", // two possible values: fixed, absolute
    boxed: "full", // two possible values: full, boxed
    navbarbg: "skin6", // six possible values: skin(1/2/3/4/5/6)
    sidebarbg: "skin5", // six possible values: skin(1/2/3/4/5/6)
    logobg: "skin6", // six possible values: skin(1/2/3/4/5/6)
  };

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    if (this.router.url === "/") {
      this.router.navigate(["/dashboard/classic"]);
    }
    this.defaultSidebar = this.options.sidebartype;
    this.handleSidebar();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case "full":
      case "iconbar":
        if (this.innerWidth < 767) {
          this.options.sidebartype = "mini-sidebar";
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      case "overlay":
        if (this.innerWidth < 767) {
          this.options.sidebartype = "mini-sidebar";
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  toggleSidebarType() {
    switch (this.options.sidebartype) {
      case "full":
      case "iconbar":
        this.options.sidebartype = "mini-sidebar";
        break;

      case "overlay":
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case "mini-sidebar":
        if (this.defaultSidebar === "mini-sidebar") {
          this.options.sidebartype = "full";
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }
}
