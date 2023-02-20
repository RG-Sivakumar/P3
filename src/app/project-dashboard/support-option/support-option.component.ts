import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";
import { json } from "d3";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { FormdataService } from "src/app/formbuilder/services/formdata.service";
import { HeadertitleService } from "src/app/headertitle.service";
import { LoginService } from "src/app/projectmanagement/services/login.service";
import { ToolbardesignComponent } from "src/app/toolbar/toolbardesign/toolbardesign.component";

@Component({
  selector: "app-support-option",
  templateUrl: "./support-option.component.html",
  styleUrls: ["./support-option.component.css"],
})
export class SupportOptionComponent implements OnInit {
  @ViewChild(ToolbardesignComponent) private _child: ToolbardesignComponent
  supportOption: boolean = true;
  userGuide: boolean = false;
  tutorialTips: boolean = false;
  faq: boolean = false;
  submitRequest: boolean = false;
  heading: string;
  hidearrow: boolean = false;
  hidearrow1: boolean;
  model:any;
  constructor(
    public router: Router,
    private headerService: HeadertitleService,
    private loginService: LoginService,
    private formdataservice: FormdataService,
    public _dataService:DataserviceService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.heading = "Support Options";
    this.hidearrow1 = this.encrptdecrpt.getItem("supportBack");
    router.events.forEach((event) => {
      if (event instanceof RouterEvent) {
        if (event["url"] === "/projectdashboard/support") {
          this.headerService.setTitle("Support");
          this.userGuide = false;
          this.supportOption = true;
          this.tutorialTips = false;
          this.faq = false;
          this.submitRequest = false;
          this.heading = "Support Options";
          this.hidearrow = false;
        } else if (event["url"] === "/projectdashboard/support/user-support") {
          this.userGuide = true;
          this.supportOption = false;
          this.tutorialTips = false;
          this.faq = false;
        } else if (event["url"] === "/projectdashboard/support/tutorialTips") {
          this.submitRequest = false;
          this.userGuide = false;
          this.supportOption = false;
          this.tutorialTips = true;
          this.faq = false;
          this.submitRequest = false;
        } else if (event["url"] === "/projectdashboard/support/Faq") {
          this.userGuide = false;
          this.supportOption = false;
          this.tutorialTips = false;
          this.faq = true;
          this.submitRequest = false;
        } else if (event["url"] === "/projectdashboard/support/submitRequest") {
          this.userGuide = false;
          this.supportOption = false;
          this.tutorialTips = false;
          this.faq = false;
          this.submitRequest = true;
        }
        else if (event["url"].includes("/toolbar/toolbardesign")) {
          // localStorage.setItem('supportBack', JSON.stringify(true));
          this.encrptdecrpt.setItem("supportBack",true);//security
          // localStorage.setItem('builder', 'toolbar');
          this.encrptdecrpt.setItem("builder",'toolbar');//security
          this.hidearrow1 = this.encrptdecrpt.getItem("supportBack");
        } else if (event["url"].includes("/formbuilder/formEdit")) {
          // localStorage.setItem('supportBack', JSON.stringify(true));
          this.encrptdecrpt.setItem("supportBack",true);//security
          // localStorage.setItem('builder', 'form');
          this.encrptdecrpt.setItem("builder",'form');//security
          this.hidearrow1 = this.encrptdecrpt.getItem("supportBack");
        } else {
          // localStorage.setItem('supportBack', JSON.stringify(false));
          this.encrptdecrpt.setItem("supportBack",false);//security
        }
      }
    });
  }

  ngOnInit(): void {
  
   
  }
  clickarrow() {
    console.log("change")
    this.hidearrow1 = this.encrptdecrpt.getItem("supportBack");
    this.userGuide = false;
    this.supportOption = true;
    this.tutorialTips = false;
    this.faq = false;
    this.submitRequest = false;
    this.heading = "Support Options";
    this.hidearrow = false;

  }
  clickarrow1() {
    if (this.encrptdecrpt.getItem('builder') == "toolbar") {
      // localStorage.setItem('supportBackTool', JSON.stringify(false));
      this.encrptdecrpt.setItem("supportBackTool",false);//security
      this.hidearrow1 = this.encrptdecrpt.getItem("supportBack");
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(["/toolbar/toolbardesign"], {
          queryParams: {
            project_id: this.encrptdecrpt.getItem("prject_id"),
            toolbarName: this.encrptdecrpt.getItem("builderName"),
            toolbarId: this.encrptdecrpt.getItem("builderId"),
            pageFrom: this.encrptdecrpt.getItem("pageForm")
          }
        });
      });
    } else {
      this._dataService.newformmodel.emit(true)  
      // localStorage.setItem('supportBackTool', JSON.stringify(false));
      this.encrptdecrpt.setItem("supportBackTool",false);//security
      this.hidearrow1 = this.encrptdecrpt.getItem("supportBack");
      this.model = this.formdataservice.get();
      console.log(this.model)
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(["/formbuilder/formEdit"], {
          queryParams: {
            Form_id: this.encrptdecrpt.getItem("builderId"),
            Form_name: this.encrptdecrpt.getItem("builderName"),
            pageFrom: this.encrptdecrpt.getItem("pageForm")
          }
          
        });
      });
    }
  }
  userGuideGo() {
    // this.router.navigateByUrl("projectdashboard/support/userGuide");
    this.userGuide = false;
    this.supportOption = false;
    this.tutorialTips = false;
    this.faq = false;
    this.submitRequest = false;
    this.heading = "User Guide";
    this.hidearrow = false;
    //this.router.navigate(['/projectdashboard/support']).then(result => { window.open("p3/userguidehome", '_blank'); });;
    // this.router.navigate(['projectdashboard/myproject']).then(result => { window.open("p3/userguidehome", '_blank'); });
  }

  supportRequestGo() {
    // this.router.navigateByUrl("projectdashboard/support/submitRequest");
    this.hidearrow1 = false
    this.userGuide = false;
    this.supportOption = false;
    this.tutorialTips = false;
    this.faq = false;
    this.submitRequest = true;
    this.heading = "Submit A Support Request";
    this.hidearrow = true;
  }

  faqGo() {
    // this.router.navigateByUrl("projectdashboard/support/Faq");
    this.userGuide = false;
    this.supportOption = false;
    this.tutorialTips = false;
    this.faq = true;
    this.submitRequest = false;
    this.heading = "Frequently Asked Questions";
    this.hidearrow = true;
  }

  tutorialGo() {
    // this.router.navigateByUrl("projectdashboard/support/tutorialTips");
    this.userGuide = false;
    this.supportOption = false;
    this.tutorialTips = true;
    this.faq = false;
    this.submitRequest = false;
    this.heading = "Tutorial and Tips & Tricks";
    this.hidearrow = true;
  }
}
