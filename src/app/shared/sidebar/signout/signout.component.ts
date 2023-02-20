import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AsyncLocalStorage } from 'async_hooks';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {
  rememberMe = this.encrptdecrpt.getItem("rememberMe");
  
  constructor(private sendData: DataService, @Inject(MAT_DIALOG_DATA) public data: any, 
  public dialog: MatDialog, public router: Router,private encrptdecrpt:EncryptDecryptService) { }

  ngOnInit(): void {
  }
  signout() {
    this.dialog.closeAll();
    // localStorage.removeItem("userdetail")
    // localStorage.removeItem("userrole")
    // this.sendData.changeMessage("ascending");
    // if (this.data.rememberMe == "true") {
    //   var emailId = this.encrptdecrpt.getItem("email_id")
    // }
    // // localStorage.clear();
    // if (this.data.rememberMe == "true") {
    //   // localStorage.setItem("email_id", emailId)
    //   this.encrptdecrpt.setItem("email_id",emailId);//security
    //   // localStorage.setItem("rememberMe",JSON.stringify(this.data.rememberMe))
    //   this.encrptdecrpt.setItem("rememberMe",this.data.rememberMe);//security
    // }

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
  onClose() {
    this.dialog.closeAll();
    this.router.navigateByUrl("projectdashboard/myproject");
  }
}


