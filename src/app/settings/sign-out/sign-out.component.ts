import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HeadertitleService } from "src/app/headertitle.service";
import { DataService } from "src/app/data.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-sign-out",
  templateUrl: "./sign-out.component.html",
  styleUrls: ["./sign-out.component.css"],
})
export class SignOutComponent implements OnInit {
  rememberMe = this.encrptdecrpt.getItem("rememberMe");
  constructor(
    public router: Router,
    private headerService: HeadertitleService,
    private sendData: DataService,
    private encrptdecrpt:EncryptDecryptService
  ) { 

  }
  ngOnInit(): void {
    this.headerService.setTitle("Sign Out");
  }
  logout() {
    this.sendData.changeMessage("ascending");
    if (this.rememberMe == false) {
      // localStorage.removeItem("email_id");
      this.encrptdecrpt.removeItem("email_id");//security
    }
    // localStorage.removeItem("password");
    this.encrptdecrpt.removeItem("password");//security
    // localStorage.removeItem("user_token");
    this.encrptdecrpt.removeItem("user_token");//security
    // localStorage.removeItem("rememberMe");
    this.encrptdecrpt.removeItem("rememberMe");//security
    // localStorage.removeItem("loggedIn");
    this.encrptdecrpt.removeItem("loggedIn");//security
    // localStorage.removeItem("scale");
    this.encrptdecrpt.removeItem("scale");//security
    // localStorage.removeItem("viewonlys");
    this.encrptdecrpt.removeItem("viewonlys");//security
    // localStorage.removeItem("setBaseiconSize");
    this.encrptdecrpt.removeItem("setBaseiconSize");//security
    // localStorage.removeItem("projectName");
    this.encrptdecrpt.removeItem("projectName");//security
    // localStorage.removeItem("toolbarFilterItem");
    this.encrptdecrpt.removeItem("toolbarFilterItem");//security
    // localStorage.removeItem("projectIdlocal");
    this.encrptdecrpt.removeItem("projectIdlocal");//security
    // localStorage.removeItem("returnUrl");
    this.encrptdecrpt.removeItem("returnUrl");//security
    // localStorage.removeItem("toolbarlastchange");
    this.encrptdecrpt.removeItem("toolbarlastchange");//security
    // localStorage.removeItem("document_last_page_view");
    this.encrptdecrpt.removeItem("document_last_page_view");//security
    this.encrptdecrpt.removeItem("remainderStop");//security
    this.router.navigateByUrl("/projectmanagement/login");

  }
}
