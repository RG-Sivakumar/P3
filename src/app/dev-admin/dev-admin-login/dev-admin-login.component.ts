import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-dev-admin-login',
  templateUrl: './dev-admin-login.component.html',
  styleUrls: ['./dev-admin-login.component.css']
})
export class DevAdminLoginComponent implements OnInit {

  passwordvalue  : any = "";
  mailidvalue : any = "";
  err_message : any = '';
  islogin = false;
  returnUrl : any;
  constructor(
    private route : ActivatedRoute,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    
    
    console.log(this.returnUrl);
  }
  onSubmit(form :NgForm){
  if(this.passwordvalue == 'admin' && this.mailidvalue == 'admin'){
    this.err_message = 'done you continue the process';
    console.log(this.mailidvalue + "  " + this.passwordvalue);
    
    this.passwordvalue = '';
    this.mailidvalue = '';
    this.islogin = true;
    this.router.navigateByUrl('devadmin/menu');
    
}else{
 this.err_message = 'Incorrect Email Id and Password';
 this.passwordvalue = ''; 
 this.mailidvalue = '';
 this.islogin = false;
}
}
}

