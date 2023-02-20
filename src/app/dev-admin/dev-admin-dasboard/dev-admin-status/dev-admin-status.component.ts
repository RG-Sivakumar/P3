import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DevadminService } from '../../devadmin.service';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-dev-admin-status',
  templateUrl: './dev-admin-status.component.html',
  styleUrls: ['./dev-admin-status.component.css']
})
export class DevAdminStatusComponent implements OnInit {
  panelOpenState = false;

  isdocument : boolean = false;
  istoolbar: boolean = false;
  isform : boolean = false;
  

  displayedColumns : string[] = ['document_name','document_uuid','document_status'];

  displayedColumn2 : string[] = ['form_name','form_uuid','form_status'];

  displayedColumn3 : string[] = ['toolbar_name','toolbar_uuid', 'toolbar_status'];



  document : MatTableDataSource<any>;
  toolbar : MatTableDataSource<any>;
  forms : MatTableDataSource<any>;

  constructor(
    public service : DevadminService
  ) {
     
   }

  ngOnInit(): void {
  }

  
  onSubmit(form: NgForm) {  
    
    this.service.status(form.value).subscribe((res) =>{
      console.log(res);
     
      this.document =  new MatTableDataSource(res["response_body"]["document"]);

      this.forms =  new MatTableDataSource(res["response_body"]["forms"]);

      this.toolbar = new MatTableDataSource(res["response_body"]["toolbar"]);
      
       if(this.document != null){
         this.isdocument = true;
       }

       if(this.isform != null){
        this.isform = true;
      }

      if(this.istoolbar != null){
        this.istoolbar = true;
      }



    })

  }
}
