import { FnParam } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { DevadminService } from '../../devadmin.service';


@Component({
  selector: 'app-dev-admin-prepare',
  templateUrl: './dev-admin-prepare.component.html',
  styleUrls: ['./dev-admin-prepare.component.css']
})
export class DevAdminPrepareComponent implements OnInit {

 prepare : any;
 datas : any;
 selectedLevel : any;
  ipaddres : any = [];
  errmsg : any;
  iserr : boolean = false;
  @Input() ipdata: any[];
  apiData:any[] = [];

  constructor(public service : DevadminService,private encrptdecrpt:EncryptDecryptService) {
    
   }

   

  ngOnInit(): void {
    this.service.server().subscribe((res) =>{
      console.log(res);
      
        this.apiData = res["response_body"];
        console.log(this.apiData);
      // var ipad = new ipselection();
      // ipad.ipaddress = res;
      // console.log(ipad.ipaddress)
    })
  }

  
  selectedValue(event){
    console.log(this.selectedLevel,event);
  }


  onSubmit(form: NgForm) {  
    console.log(form.value);
    this.datas = form.value;
 if(this.selectedLevel != null){


  this.service.prepared(
   this.datas , this.selectedLevel
  ).subscribe((res) =>{
    console.log(res);

    if(form.value.project_uuid != null){
      // localStorage.setItem("project_uuid", form.value.project_uuid);
      this.encrptdecrpt.setItem("project_uuid",form.value.project_uuid);//security
      }else{
        // localStorage.removeItem("project_uuid");
        this.encrptdecrpt.removeItem("project_uuid");//security
      }

     this.prepare = res["response_body"]["documents"];
    console.log(this.prepare);

    var status = res["response_code"];
    if(status == 200){
      this.resetForm();
      console.log("done"); 
     }
      else if(status==201){
        console.log("get a 201 code");  
      }else{
        console.log("others");
      }
  })

 }else{
   this.iserr=true;
   this.errmsg = "server selection error";
 }
}


resetForm(form?: NgForm) {
  //optional
  if (form != null) form.resetForm();
 

  this.service.formData = {
    owner_name:"",
     assignment_name:"",
      project_name:"",
       project_uuid: ""
  }
}
}