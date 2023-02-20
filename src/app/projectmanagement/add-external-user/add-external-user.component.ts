import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ExternaluserService } from "../services/externaluser.service";
import { NgForm } from "@angular/forms";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-add-external-user",
  templateUrl: "./add-external-user.component.html",
  styleUrls: ["./add-external-user.component.css"],
})
export class AddExternalUserComponent implements OnInit {
  constructor(public router: Router, public service: ExternaluserService,
    private encrptdecrpt:EncryptDecryptService) {}

  ngOnInit(): void {
    // localStorage.removeItem("rememberMe");
    this.encrptdecrpt.removeItem("rememberMe");//security
    // localStorage.removeItem("loggedIn");
    this.encrptdecrpt.removeItem("loggedIn");//security
  }
  onSubmit(form: NgForm) {
    this.service.Useradd(form.value).subscribe((res) => {
      var status = res["response_code"];
      if (status == 200) {
        this.router.navigateByUrl("/projectmanagement/NewUser");
      }
    });
  }
}
