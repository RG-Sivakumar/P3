import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import _ from 'lodash';
import { EncryptDecryptService } from 'src/app/commonshared/services/encrypt-decrypt.service';
import { DataService } from 'src/app/data.service';
import { FormlistService } from 'src/app/formbuilder/services/formlist.service';
import { GlobalUserRoleService } from 'src/app/global-user-role.service';
import { AlertmessageComponent } from '../alertmessage/alertmessage.component';
import { SuccessComponent } from '../success/success.component';

@Component({
  selector: 'app-formlistpopup',
  templateUrl: './formlistpopup.component.html',
  styleUrls: ['./formlistpopup.component.css']
})
export class FormlistpopupComponent implements OnInit {
  projectid;
  userrole:string = "";
  loader=false;
  listData:any;
  startingformlist: any[];
  sortFormList: any[];
  message: string;
  getAllTags: any[];
  getAlltaglist: any[];
  sortMessage: string;
  showHiddenList:any;
 su:any;
  document_id: any;
  show: any;
  permission: any;
  listing: any;
  constructor(public service:FormlistService,private userRoleGlobal:GlobalUserRoleService,public dialog:MatDialog,
    private encrptdecrpt:EncryptDecryptService,private receiveData: DataService,private datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    if(data!=undefined){
      this.projectid=data.project_id
      this.document_id=data.document_id
      this.show=data.show_form
      this.permission=data.permission
      this.listing=data.listing
    }
   }
   errorMessagePopup(platformName) {
    this.loader = false;
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    var dialogrefModel = this.dialog.open(AlertmessageComponent, {
      data: { platform: platformName }
    });
  }
  formlisting() {

      // user permission new api values get process
      let get_user_permission = this.permission;
      if (get_user_permission != undefined && get_user_permission != null &&
        get_user_permission.length > 0) {

        if (get_user_permission[0].admin_permission_flag == true) {
          this.userrole = "admin";
        }
        else if (get_user_permission[0].edit_permission_flag == true) {
          this.userrole = "edit";
        }
        else if (get_user_permission[0].view_permission_flag == true) {
          this.userrole = "view";
        }
        else if (get_user_permission[0].view_permission_flag == false && get_user_permission[0].edit_permission_flag == false
          && get_user_permission[0].admin_permission_flag == false) {
          this.userrole = "view";
        }
        this.encrptdecrpt.setItem("userrole", this.projectid + "||" + this.userrole);//security
      }
      let getresponse_special_character = this.listing;
      if(this.listing.length>0){
        let change_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character,'formlist');
        console.log(change_character_list);
        this.listing = change_character_list;
      }
      this.listData = new MatTableDataSource(
        this.listing
      );
      var dateFilter = this.listing;
      
      
      
      
    
      console.log(this.userrole)

      console.log(dateFilter);
      this.showHiddenList = _.cloneDeep(this.listing);
      if (dateFilter != undefined) {
        dateFilter = dateFilter.filter((data) => {
          return data["is_hidden"] == false;
        });

        ////
        var crateDateFilter = dateFilter.filter((dateOnly1) => {
          // moment.utc(dateOnly1.created_date)
          if (dateOnly1.created_date != "0000-00-00 00:00:00") {
            return (dateOnly1.created_date = this.datePipe.transform(
              dateOnly1.created_date,
              "MM/dd/yyyy HH:mm:ss"
            ));
          }
        });
        this.startingformlist = crateDateFilter.filter((dateOnly2) => {
          if (dateOnly2.last_updated_date != "0000-00-00 00:00:00") {
            return dateOnly2.last_updated_date != undefined
              ? (dateOnly2.last_updated_date = this.datePipe.transform(
                dateOnly2.last_updated_date,
                "MM/dd/yyyy HH:mm:ss"
              ))
              : (dateOnly2.last_updated_date = this.datePipe.transform(
                dateOnly2.created_date,
                "MM/dd/yyyy HH:mm:ss"
              ));
          }
        });
      }
      this.listData = new MatTableDataSource(this.startingformlist);

      this.sortFormList = this.startingformlist;
      this.receiveData.currentMessage.subscribe((message) => {
        this.sortMessage = message;
        if (this.sortMessage == "ascending") {
          this.sortFormList.sort((a, b) =>(a.form_name.toLowerCase() > b.form_name.toLowerCase()) ? 1 : -1)
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "descending") {
          this.sortFormList.sort((a, b) =>(a.form_name.toLowerCase() > b.form_name.toLowerCase()) ? -1 : 1)
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "datecreatedOldToRecent") {
          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "datecreatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "lastupdatedOldToRecent") {
          // this.sortFormList.sort((a, b) =>
          //   (a.last_updated_date != undefined
          //     ? a.last_updated_date
          //     : a.created_date
          //   ).localeCompare(
          //     b.last_updated_date != undefined
          //       ? b.last_updated_date
          //       : b.created_date
          //   )
          // );
          this.sortFormList.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        } else if (this.sortMessage == "lastupdatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime())
          this.listData = new MatTableDataSource(this.sortFormList);
        }
        console.log(this.sortFormList)
        console.log(this.listData)
      });
      
      
      // this.listData = new MatTableDataSource(this.startingformlist);
    
      // this.list=(this.listing)
    
  }
  ngOnInit(): void {
    this.formlisting()
  }
  displayedColumns: any[] = ["Name"];
  formclick(formid){
    this.loader=true
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    console.log(this.su.email_id,this.document_id,formid,this.projectid)
    this.service.csvForm(this.su.email_id,this.document_id,formid,false,'',"export_annotation_form_fields",this.projectid).subscribe(data=>{
      console.log(data)
      if(data['response_code'] == 200) {       
        
        console.log("Success");  
        this.show=true
        this.dialog.closeAll()                    
        var dialogrefModel = this.dialog.open(SuccessComponent,{
         width: '500px',
         data: {
           status:"true",
           title: "export",
         }
        })
      }
      else{
        console.log("Wrong");
        this.loader=false;
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: { 
            status:"pdffalse",
            title: "export"}
        });
        this.dialog.closeAll();
      }
    },
      (error) => {
        console.log(error);
        this.errorMessagePopup('servererror');
      });
    
  }
}

