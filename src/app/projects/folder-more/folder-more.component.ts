import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialog,
} from "@angular/material/dialog";
import { AddProjectComponent } from "../add-project/add-project.component";
import { ManagetagsComponent } from "../managetags/managetags.component";
import { MoreoptionService } from "../services/moreoption.service";
import { MoreInformationComponent } from "../more-information/more-information.component";
import { AddcontentService } from "../services/addcontent.service";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { v1 as uuidv1 } from "uuid";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { AlertmessageComponent } from "src/app/document/alertmessage/alertmessage.component";
import { SuccessComponent } from "src/app/document/success/success.component";

@Component({
  selector: "app-folder-more",
  templateUrl: "./folder-more.component.html",
  styleUrls: ["./folder-more.component.css"],
})
export class FolderMoreComponent implements OnInit {
  folderName: string;
  createdDate: string;
  modifiedDate: string;
  folderId: string;
  parentFolderId: string;
  folderLevel: number;
  foldertaglist: string;
  hidden: any = 0;
  show: boolean = false;
  folderflag: number;
  projecDetailstList: any;
  getAlltaglist: any;
  hideOption: boolean = false;
  ShowHideProjectList: any[] = [];
  projectid: string;
  userrole: any;
  is_link:boolean=false;
  export_type:string="";
  su:login;


  constructor(
    private dialogbox: MatDialogRef<FolderMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,public userRoleGlobal:GlobalUserRoleService,
    private moreoptionservice: MoreoptionService,
    private addcontentService: AddcontentService,
    private encrptdecrpt:EncryptDecryptService,
    public documentService: CreateDocumentService,
  ) {
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    var receiveData = this.data;
    this.folderName = receiveData.folderName;
    this.createdDate = receiveData.createdDate;
    this.modifiedDate = receiveData.modifiedDate;
    this.folderId = receiveData.folderId;
    this.parentFolderId = receiveData.parentFolderId;
    this.folderLevel = receiveData.folderLevel;
    this.ShowHideProjectList = receiveData.ShowHideProjectList;
    if (this.folderLevel == 0) {
      this.hideOption = true;
    }
    this.hidden = receiveData.hidden;
    this.folderflag = receiveData.folderflag;
    this.projecDetailstList = receiveData.projecDetailstList;
    this.getAlltaglist = receiveData.getAlltaglist;
    console.log(this.data);
    
    //   this.moreoptionservice.listen().subscribe((m:any) =>{
    //     this.getFolderTagList(this.folderId);
    //  });
    // this.getFolderTagList(this.folderId);
  }

  ngOnInit(): void { 
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  getFolderTagList(folderid) {
    this.show = true;
    this.moreoptionservice.getFolderTag(folderid).subscribe((res) => {
      this.show = false;
      this.foldertaglist = res["response_body"]["folder_tags"];
    });
  }

  gotoRenameBox() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(AddProjectComponent, {
      width: "380px",
      data: {
        renameaccess: true,
        folderName: this.folderName,
        folderId: this.folderId,
        parentFolderId: this.parentFolderId,
        folderLevel: this.folderLevel,
        folderflag: this.folderflag,
        projecDetailstList: this.projecDetailstList,
        ShowHideProjectList: this.ShowHideProjectList,
        hiddenFlag: this.hidden
      },
    });
    this.dialogbox.close();
  }

  goToManageTags() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(ManagetagsComponent, {
      width: "380px",
      data: { folderId: this.folderId, foldertaglist: this.foldertaglist, getAlltaglist: this.getAlltaglist }
    });
    this.dialogbox.close();
  }

  goToMoreInformation() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(MoreInformationComponent, {
      width: "380px",
      data: {
        folderId: this.folderId,
        foldertaglist: this.foldertaglist,
        folderName: this.folderName,
        createdDate: this.createdDate,
        modifiedDate: this.modifiedDate,
        docOnly: true,
        folderLevel: this.folderLevel,
        folderflag: this.folderflag,
        getAlltaglist: this.getAlltaglist
      },
    });
    this.dialogbox.close();
  }

  closeBox() {
    this.dialogbox.close();
  }
  selectHide() {
    this.addcontentService.loaderActivated.emit(true);
    this.moreoptionservice
      .hide(
        this.folderId,
        this.folderName,
        this.parentFolderId,
        this.folderLevel
      )
      .subscribe((res) => {
        console.log(res);
        this.moreoptionservice.filter("Register Click");
      });
    this.dialogbox.close();
  }

  selectUnHide() {
    this.addcontentService.loaderActivated.emit(true);
    this.moreoptionservice
      .unHide(
        this.folderId,
        this.folderName,
        this.parentFolderId,
        this.folderLevel
      )
      .subscribe((res) => {
        this.moreoptionservice.filter("Register Click");
      });
    this.dialogbox.close();
  }

  is_link_toggle(check_value) {
    if (check_value.checked == true) {
      this.is_link = true;
    }
    else if (check_value.checked == false) {
      this.is_link = false;
    }
  }

  // exportnew method copy below 
  pdfexport(export_type,links) {
    this.show = true;
    this.export_type=export_type;
    // this.documentidss = this.folderId;
    let folder_id = this.folderId;
    var pageId="";
    // export document method no need page id
    let get_is_link = this.is_link;
    // if(export_type == "export_blank_folder_document_as_pdf"){
    //   get_is_link = false;
    // }
    // else if("export_folder_document_as_pdf"){
    //   get_is_link = true;
    // }
    get_is_link = links;    
    this.documentService.getpdfexport(this.su.email_id,this.projectid,folder_id,pageId,this.export_type,get_is_link).subscribe((response) => {
      console.log(response);
      if (response['response_code'] == 200) {       
         console.log("Success");                      
         this.show=false;
         var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: {
            status:"true",
            title: "export",
        }
        });
        this.dialogbox.close();
      }
      else{
        console.log("Wrong");
        this.show=false;
        var dialogrefModel = this.dialog.open(SuccessComponent,{
          width: '500px',
          data: { 
            status:"pdffalse",
            title: "export"}
        });
        this.dialogbox.close();
      }
    },
      (error) => {
        console.log(error);
        this.errorMessagePopup('servererror');
      });
  }


  errorMessagePopup(platformName) {
    this.show = false;
    this.dialogbox.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    var dialogrefModel = this.dialog.open(AlertmessageComponent, {
      data: { platform: platformName }
    });
  }

  
}
