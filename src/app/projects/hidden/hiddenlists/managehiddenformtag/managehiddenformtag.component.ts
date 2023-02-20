import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormlistService } from 'src/app/formbuilder/services/formlist.service';

@Component({
  selector: 'app-managehiddenformtag',
  templateUrl: './managehiddenformtag.component.html',
  styleUrls: ['./managehiddenformtag.component.css']
})
export class ManagehiddenformtagComponent implements OnInit {
  tagdefault:string;
  taglist:string[];
  formid:string;
  projectid:string;
  loader:boolean=false;
    constructor(public dialogbox: MatDialogRef<ManagehiddenformtagComponent>,  @Inject(MAT_DIALOG_DATA) public data: any,public service:FormlistService) { 
      this.formid = this.data.formid
      
      this.projectid=this.data.projectid
     
      this.service.gettag(this.formid).subscribe(data => {
        
        this.taglist=(data["response_body"]["form_tags"])
        
      });
    }
    ngOnInit(): void {
    }
    Addtag(form_tag_name){
      this.loader=true;
      this.service.AddTag(this.formid,form_tag_name,this.projectid).subscribe(data => {
        this.loader=false;
        
        this.taglist=(data["response_body"]["form_tags"]);
      });  
    }
    RemoveTag(form_tag_id){
      this.service.RemoveTag(this.formid,form_tag_id).subscribe(data => {
        this.taglist=this.taglist.filter(item => item["form_tag_id"] !==form_tag_id);
      this.service.filter('Register click');
      
       
      });  
    }
    closeBox(){
      this.dialogbox.close();
    }
   
  
  }
  
