import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { DevadminService } from '../../devadmin.service';
import { DevAdminPrepareComponent } from '../dev-admin-prepare/dev-admin-prepare.component';

@Component({
  selector: 'app-dev-admin-convert',
  templateUrl: './dev-admin-convert.component.html',
  styleUrls: ['./dev-admin-convert.component.css']
})
export default class DevAdminConvertComponent implements OnInit {

  project_uuid:any = this.encrptdecrpt.getItem("project_uuid"); 
  selectedLevel : any;
  conip : any = [];
  apiData:any[] = [];

  constructor(private service : DevadminService,private encrptdecrpt:EncryptDecryptService) { 
      this.service.getValue.subscribe((data)=>{
       console.log(data);
        this.conip = data;
        console.log(this.conip+"jjjjjjjjjj");
      })
    
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

  conversion(){
    console.log("conversion");
    console.log(this.project_uuid)
    this.service.convert(this.project_uuid,this.selectedLevel).subscribe((res) =>{
      console.log(res);
      
    })
  
  }



}
