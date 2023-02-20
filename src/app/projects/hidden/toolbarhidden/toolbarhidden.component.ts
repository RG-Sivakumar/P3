import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MoreOptionComponent } from 'src/app/toolbar/toolbarlist/more-option/more-option.component';
import { ToolbarlistService } from 'src/app/toolbar/services/toolbarlist.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CreateToobarComponent } from 'src/app/toolbar/toolbarlist/create-toobar/create-toobar.component';
import { ManageTagComponent } from 'src/app/toolbar/toolbarlist/manage-tag/manage-tag.component';
import { AddContentComponent } from '../../add-content/add-content.component';
import { AddcontentService } from '../../services/addcontent.service';
import { MoreInformationComponent } from 'src/app/toolbar/toolbarlist/more-information/more-information.component';
import { GlobalUserRoleService } from 'src/app/global-user-role.service';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-toolbarhidden',
  templateUrl: './toolbarhidden.component.html',
  styleUrls: ['./toolbarhidden.component.css']
})
export class ToolbarhiddenComponent implements OnInit {

  projectId: string;
  toolbarName: string;
  createdDate: string;
  modifiedDate: string;
  toolbarId: string;
  toolbarTagList: string[];
  toolbar_id1: string;
  s: boolean;
  data1: any;
  checkinTemp: any;
  is_hidden: boolean = false;
  toolbarlist: any;
  userrole: string;
  hidetoolbarlistOrigin:any[] = [];
  show:boolean=false;
  
  constructor(
    private dialogRef: MatDialogRef<MoreOptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public toolbarService: ToolbarlistService,
    public router: Router,
    private datePipe: DatePipe,
    private addContentService: AddcontentService,public  userRoleGlobal:GlobalUserRoleService,
    private dataService:DataService
  ) {
    this.toolbar_id1 = this.data.toolbar_id1;
    var receiveData = this.data;
    this.is_hidden = receiveData.is_hidden;
    console.log(this.is_hidden);
    this.toolbarId = receiveData.toolbarId;
    this.getToolbarTagList(this.toolbarId);
    this.projectId = receiveData.projectId;
    this.toolbarName = receiveData.toolbarName;
    this.createdDate = receiveData.createdDate;
    this.modifiedDate = receiveData.modifiedDate;
    this.toolbarlist = receiveData.tool_list;
    this.hidetoolbarlistOrigin = receiveData.hidetoolbarlistOrigin;
    console.log(this.hidetoolbarlistOrigin);
    this.toolbarService.listen().subscribe((m) => {
      this.getToolbarTagList(this.toolbarId);
    });
    // this.userrole = this.userRoleGlobal.findUserProjectRole(  this.projectId);
    this.userRoleGlobal.findUserProjectRole(this.projectId).then((res_userrole)=>{
      this.userrole = res_userrole;
    })
  }

  ngOnInit(): void { }

  getToolbarTagList(toolbarId) {
    this.show=true;
    this.toolbarService.toolbarTag(toolbarId).subscribe((res) => {
      this.show=false;
      let getresponse_special_character = res["response_body"]["toolbar_tags"];
      if (res["response_body"]["toolbar_tags"].length > 0) {
        let change_character_list = this.dataService.changeSpecialtokeyformatList(getresponse_special_character, 'toolbartags');
        console.log(change_character_list);
        res["response_body"]["toolbar_tags"] = change_character_list;
      }
      this.toolbarTagList = res["response_body"]["toolbar_tags"];
    });
  }

  gotoRenameBox() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(CreateToobarComponent, {
      width: "380px",
      data: {
        renameaccess: true,
        toolbarId: this.toolbarId,
        toolbarName: this.toolbarName,
      },
    });
    this.dialogRef.close();
  }

  goToManageTags() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(ManageTagComponent, {
      width: "380px",
      data: {
        projectId: this.projectId,
        toolbarId: this.toolbarId,
        toolbarTagList: this.toolbarTagList,
      },
    });
    this.dialogRef.close();
  }

  goToMoreInformation() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    this.dialog.open(MoreInformationComponent, {
      width: "380px",
      data: {
        toolbarId: this.toolbarId,
        toolbarName: this.toolbarName,
        createdDate: this.createdDate,
        modifiedDate: this.modifiedDate,
        toolbarTagList: this.toolbarTagList,
        toolbarlist: this.hidetoolbarlistOrigin,
      },
    });
    this.dialogRef.close();
  }

  closeBox() {
    this.dialogRef.close();
  }
  unhide() {
    this.toolbarService.loaderActivated.emit(true);
    this.toolbarService.unhide(this.toolbarId).subscribe((res) => {
      this.dialog.closeAll();
      this.toolbarService.filter("Register click");
    });
  }

  gotoToolbarDesign() {
    this.router.navigate(["/toolbar/toolbardesign"], {
      queryParams: {
        project_id: this.projectId,
        toolbarName: this.toolbarName,
        toolbarId: this.toolbarId,
      },
    });
    this.dialogRef.close();
  }

}
