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
import { v1 as uuidv1 } from "uuid";
import { AddcontentService } from "../services/addcontent.service";
import { GlobalConfig } from "ngx-toastr";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { ProjectlistService } from "src/app/project-dashboard/my-project/services/projectlist.service";
import {CopyDocumentAnotherProjectComponent} from "src/app/projects/copy-document-another-project/copy-document-another-project.component";
import { DataService } from "src/app/data.service";
import { FormlistpopupComponent } from "src/app/document/formlistpopup/formlistpopup.component";
import { FormlistService } from "src/app/formbuilder/services/formlist.service";
import { MatSnackBar } from "@angular/material/snack-bar";
@Component({
  selector: "app-document-more",
  templateUrl: "./document-more.component.html",
  styleUrls: ["./document-more.component.css"],
})
export class DocumentMoreComponent implements OnInit {
  folderName: string;
  createdDate: string;
  modifiedDate: string;
  folderId: string;
  parentFolderId: string;
  folderLevel: number;
  foldertaglist: string;
  projectId: string;
  hidden: any;
  show: boolean = false;
  folderflag: number;
  projecDetailstList: any;
  getAlltaglist: any;
  ShowHideProjectList: any[] = [];
  hiddenFlag: any;
  projectid: string;
  userrole: string;
  projectName:string="";

  constructor(
    public service: ProjectlistService,
    private dialogbox: MatDialogRef<DocumentMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private moreoptionservice: MoreoptionService,
    private receiveDataservice: DataService,
    private addcontentservice: AddcontentService,
    public userRoleGlobal:GlobalUserRoleService,
    private encrptdecrpt:EncryptDecryptService,
    public services:FormlistService,public _snackbar:MatSnackBar
  ) {
    this.projectid = this.encrptdecrpt.getItem("projectIdlocal");
    // this.userrole = this.userRoleGlobal.findUserProjectRole(this.projectid);
    this.userRoleGlobal.findUserProjectRole(this.projectid).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
    var receiveData = this.data;
    console.log(receiveData)
    this.folderName = receiveData.folderName;
    this.createdDate = receiveData.createdDate;
    this.modifiedDate = receiveData.modifiedDate;
    this.folderId = receiveData.folderId;
    this.parentFolderId = receiveData.parentFolderId;
    this.folderLevel = receiveData.folderLevel;
    this.projectId = receiveData.projectId;
    this.hidden = receiveData.hidden;
    this.folderflag = receiveData.folderflag;
    this.hiddenFlag = receiveData.is_hidden;
    this.projecDetailstList = receiveData.projecDetailstList;
    this.getAlltaglist = receiveData.getAlltaglist;
    this.ShowHideProjectList = receiveData.ShowHideProjectList;
    this.projectName = receiveData.project_name;
    console.log(this.data);
    // this.getFolderTagList(this.folderId);
  }

  ngOnInit(): void { }

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
        hiddenFlag: this.hiddenFlag
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
      data: { folderId: this.folderId, foldertaglist: this.foldertaglist, getAlltaglist: this.getAlltaglist },
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
        docOnly: false,
        projecDetailstList: this.projecDetailstList,
        getAlltaglist: this.getAlltaglist
      },
    });
    this.dialogbox.close();
  }

  closeBox() {
    this.dialogbox.close();
  }
  selectHide() {
    this.addcontentservice.loaderActivated.emit(true);
    this.moreoptionservice
      .hide(
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

  selectunHide() {
    this.addcontentservice.loaderActivated.emit(true);
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

  copywidthoutAnnotation() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(AddProjectComponent, {
      width: "380px",
      data: {
        withoutAnnotation: true,
        projectId: this.projectId,
        folderId: this.folderId,
        parentFolderId: this.parentFolderId,
        folderLevel: this.folderLevel,
        copyDocument: true,
        projecDetailstList: this.projecDetailstList,
        ShowHideProjectList: this.ShowHideProjectList,
      },
    });
    this.dialogbox.close();
  }

  copytoAnotherProject(){
    this.service.getprojectlist().subscribe((data) => {
    var projectsList = data.response_body.projects;
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    var specialCharsremoved = this.receiveDataservice.changeSpecialtokeyformatList(projectsList, 'projectlist');
    let dialogRef = this.dialog.open(CopyDocumentAnotherProjectComponent, {
      width : "500px",
      height:"500px",
      data: {
        projects : specialCharsremoved
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      var id = res.projectId;
      var type = res.type;
      var oldID = this.folderId;
      if(res){
        this.copywithAnnotation_Project(projectsList,id,type,oldID);
      }
    })
    })
  }
  //MoreInformationComponent

  copywithAnnotation() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(AddProjectComponent, {
      width: "380px",
      data: {
        withAnnotation: true,
        projectId: this.projectId,
        folderId: this.folderId,
        parentFolderId: this.parentFolderId,
        folderLevel: this.folderLevel,
        projecDetailstList: this.projecDetailstList,
        ShowHideProjectList: this.ShowHideProjectList,
        copyDocument: true,
        project_name:this.projectName
      },
    });
    this.dialogbox.close();
  }

  copywithAnnotation_Project(projectsList,id,type,oldFolderID) {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    let index = projectsList.findIndex((i)=>i.project_id == id)
    var ProjectName = projectsList[index].project_name;
    var ProjectID = projectsList[index].project_id
    this.dialog.open(AddProjectComponent, {
      width: "380px",
      data: {
        withAnnotation: true,
        projectId: ProjectID,
        folderId: this.folderId,
        parentFolderId: this.parentFolderId,
        folderLevel: this.folderLevel,
        projecDetailstList: projectsList,
        ShowHideProjectList: this.ShowHideProjectList,
        copyDocument: true,
        project_name:ProjectName,
        copytype:type,
        oldFolerID:oldFolderID
      },
    });
    this.dialogbox.close();
  }
  exportcsvforforms(){
    this.show=true;
    // let doc=this.documentDetails[0]["document_id"]
    this.projectId = this.encrptdecrpt.getItem("projectIdlocal");
    this.services.getformlist().subscribe((data) => {
      console.log(data);
      
      if(data["response_code"]==200 ){
        
        this.show=false;
        let permission=data["response_body"]["user_permission"]
        let listing=data["response_body"]["form_listing"]
        listing=listing.filter(res=>(res.is_hidden!=1))
        if(listing.length!=0){
    this.dialog.open(FormlistpopupComponent,{
      width: '40%',
     data:{
      project_id:this.projectId,
      document_id:this.folderId,
      show_form:false,
      permission:permission,
      listing:listing
      
     }
    
    }
  );
        }
        else{
          this._snackbar.open('No Forms Available', null,
{
  horizontalPosition: 'center',
  verticalPosition: 'top',
});
this.dialog.closeAll()
        }
      }else{
this.show=false

      }
  })
  }
}
