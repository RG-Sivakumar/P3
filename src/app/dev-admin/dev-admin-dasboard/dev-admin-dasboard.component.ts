import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { DevadminService } from '../devadmin.service';


@Component({
  selector: 'app-dev-admin-dasboard',
  templateUrl: './dev-admin-dasboard.component.html',
  styleUrls: ['./dev-admin-dasboard.component.css']
})
export class DevAdminDasboardComponent implements OnInit {
 isprepare : boolean = true;
 isconvert :boolean = false;
 isstatus :boolean = false;
 apiData:any[] = [];
  constructor(
    private router : Router,
    private service   :  DevadminService,
    private encrptdecrpt:EncryptDecryptService
  ) {
   
   }

  ngOnInit(): void {

   

  }

  logout(){
    this.router.navigateByUrl('devadmin/login');
    // localStorage.removeItem("project_uuid");
    this.encrptdecrpt.removeItem("project_uuid");//security
  }

  prepare(){
    this.isprepare = true;
 this.isconvert = false;
 this.isstatus = false;
  }

  convert(){
    this.isprepare = false;
 this.isconvert = true;
 this.isstatus = false;
  }


  status(){
    this.isprepare = false;
 this.isconvert = false;
 this.isstatus = true;
  }

}
