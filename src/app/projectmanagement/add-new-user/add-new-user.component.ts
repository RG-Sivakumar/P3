import { Component, OnInit } from "@angular/core";
import { ExternaluserService } from "../services/externaluser.service";
import { ActivatedRoute, Params, Router} from "@angular/router";
import { replaceAll } from "chartist";
import { environment } from "src/environments/environment.prod";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-add-new-user",
  templateUrl: "./add-new-user.component.html",
  styleUrls: ["./add-new-user.component.css"],
})
export class AddNewUserComponent implements OnInit {
  foo: any;
  fruit: any;
  fulllname: any;
  formError: boolean;
  formErrorMessage: string;
  constructor(
    public service: ExternaluserService,
    private route: ActivatedRoute,public router:Router,
    private encrptdecrpt:EncryptDecryptService
  ) { }
  key: any;
  newPassword: any;
  newPassword1: any;
  emailId: any;
  first_name: any;
  last_name: any;
  hide = false;
  error = false;
  loader:boolean=true;

  ngOnInit(): void {
    // this.route.params.forEach((params: Params) => {
    //   this.foo = params["foo"];
    //   this.fruit = params["fruit"];
    // });
    // localStorage.removeItem("rememberMe");
    this.encrptdecrpt.removeItem("rememberMe");//security
    // localStorage.removeItem("loggedIn");
    this.encrptdecrpt.removeItem("loggedIn");//security
    this.key = this.route.snapshot.queryParamMap.get("key");
    
    this.key = decodeURI(this.key);
    this.key = this.key.split(" ").join("+");
    console.log(this.key);
    this.emailId = this.route.snapshot.queryParamMap.get("email");
    this.first_name = this.route.snapshot.queryParamMap.get("first_name");
    this.last_name = this.route.snapshot.queryParamMap.get("last_name");
    this.fulllname = this.first_name + " " + this.last_name;
    this.checkUserAlreadycomplete();
  }

  checkUserAlreadycomplete(){
    this.service.isAlreadyUsedOrNot(this.key,this.emailId).subscribe((response)=>{
      console.log(response);
      if(response["response_code"]==200){
        this.loader = false;
      }
      else{
        this.router.navigateByUrl("projectmanagement/login");
      }
    },(error)=>{
        this.router.navigateByUrl("projectmanagement/login");
    });
  }


  invitationAccept() {
    if (this.emailId == "" || this.emailId == null) {
      this.formError = true;
      this.formErrorMessage = "Please enter user name."
    } else if (this.fulllname == "" || this.fulllname == null) {
      this.formError = true;
      this.formErrorMessage = "Please enter your full name."
    } else if (this.newPassword == "" || this.newPassword == null) {
      this.formError = true;
      this.formErrorMessage = "Please enter password."
    } else if (this.newPassword1 == "" || this.newPassword1 == null) {
      this.formError = true;
      this.formErrorMessage = "Please enter confirm password."
    } else if (this.newPassword != this.newPassword1) {
      this.formError = true;
      this.formErrorMessage = "The new password and confirm password do not match."
    } else {
      // localStorage.setItem("APIBaseUrl", environment.APIBaseUrl);
      this.encrptdecrpt.setItem("APIBaseUrl",environment.APIBaseUrl);//security

      this.service
        .acceptInvitation(
          this.key,
          this.emailId,
          this.newPassword,
          this.first_name,
          this.last_name
        )
        .subscribe((res) => {
          console.log(res);
          var status = res["response_code"];
          if (status == 200) {
            this.router.navigateByUrl("/projectmanagement/login");
            this.loader = false;
            this.hide = true;
          } else {
            this.error = true;
            this.loader = false;
            this.hide = false;
          }
        });
    }
  }
  showPassword:boolean;
  fieldTextType: boolean;
  fieldTextType1: boolean;
  passwordshow:boolean;
    passwordonClick() {
    this.fieldTextType = !this.fieldTextType;
    this.showPassword = true;
  }
  passwordoffClick() {
    this.fieldTextType = !this.fieldTextType;
    this.showPassword = false;
  }
  password1() {
    this.fieldTextType1 = !this.fieldTextType1;
    this.passwordshow = true;
  }
  password2Click() {
    this.fieldTextType1 = !this.fieldTextType1;
    this.passwordshow = false;
  }
  
}
