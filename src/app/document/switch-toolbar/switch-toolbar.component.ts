import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToolbarlistService } from "src/app/toolbar/services/toolbarlist.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToolbardesignComponent } from "src/app/toolbar/toolbardesign/toolbardesign.component";
import { ToolbarFeatureComponent } from "src/app/toolbar/toolbarlist/toolbar-feature/toolbar-feature.component";
import { CreateToobarComponent } from "src/app/toolbar/toolbarlist/create-toobar/create-toobar.component";
import { GlobalUserRoleService } from "src/app/global-user-role.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
import { DataService } from "src/app/data.service";
import _ from "lodash";

@Component({
  selector: "app-switch-toolbar",
  templateUrl: "./switch-toolbar.component.html",
  styleUrls: ["./switch-toolbar.component.css"],
})
export class SwitchToolbarComponent implements OnInit {
  projectId: string;
  toolbarList: string[];
  show: boolean = false;
  toolbarId: string;
  callback1: any;
  getIndex: number = 0;
  toolbarListData:any;
  isReadonly: any;
  copytoolbarListData: any;

  constructor(
    private dialogClose: MatDialogRef<SwitchToolbarComponent>,
    private toolbarlistService: ToolbarlistService,
    private route: ActivatedRoute,
    private router:Router,
    public userRoleGlobal: GlobalUserRoleService,
    private dialog:MatDialog,
    private encrptdecrpt:EncryptDecryptService,
    private receiveData: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isReadonly = this.encrptdecrpt.getItem("viewonlys");
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    // this.callback1 = this.data.callBack1;
    this.toolbarListData = this.data.toolbarListData;
    this.copytoolbarListData =_.cloneDeep(this.toolbarListData);
    if(this.copytoolbarListData.length>0){
      let change_character_list = this.receiveData.changeSpecialtokeyformatList(this.copytoolbarListData,'switchPage');
      this.copytoolbarListData=change_character_list;
    }
    this.toolbarListData=this.copytoolbarListData;
    this.toolbarListData=this.toolbarListData.sort((a, b) =>a.toolbar_name.localeCompare(b.toolbar_name));
    this.toolbarId = this.data.selectedToolBar;
  }

  ngOnInit(): void {
    this.getToolbarListSelected();
  }

  getToolbarListSelected() {
    let findIndex = this.toolbarListData.findIndex((toolbar_data) => toolbar_data.toolbar_id == this.toolbarId);
    if (findIndex > -1) {
      this.getIndex = findIndex;
    }
    else {
      this.getIndex = 0;
    }
  }

  closeBox() {
    this.dialogClose.close();
  }

  toggleVisibility(event, value, index) {
    this.getIndex = index;
    this.toolbarId = value.toolbar_id;
    // this.callback1(this.toolbarId);
    this.encrptdecrpt.setItem("toolbarId",this.toolbarId);//security
    let deactivateFilterToolbar = { allChecked: true, pointsChecked: false, freehandChecked: false, vertexChecked: false, rectangleChecked: false };
    // localStorage.setItem("toolbarFilterItem", JSON.stringify(deactivateFilterToolbar));
    this.encrptdecrpt.setItem("toolbarFilterItem",deactivateFilterToolbar);//security
    this.dialogClose.close(this.toolbarId);
  }

  goToolbarSection(project_id, toolbarName, toolbar_id) {
    console.log(project_id, toolbarName, toolbar_id);
      this.router.navigate(["/toolbar/toolbardesign"], {
        queryParams: {
          project_id: project_id,
          toolbarName: toolbarName,
          toolbarId: toolbar_id,
          pageFrom:"document",
        },
      });
      this.dialogClose.close();
    }

    createNewToolbar(){
      const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(CreateToobarComponent, {
      width: "380px",
      data: { newToolbarAdd: true }
    });
    this.dialogClose.close();
    dialogRef.afterClosed().subscribe((response) => {
      // let previewBack = { state: false, id: this.annotationId, location: 'form_builder' };
      // localStorage.setItem("preSelectAnnotationId", JSON.stringify(previewBack));
      if(response!=undefined){
        this.router.navigate(["/toolbar/toolbardesign"], {
          queryParams: {
            project_id: response.project_id,
            toolbarName: response.toolbar_name,
            toolbarId: response.toolbar_id,
            pageFrom: "document",
          },
        });
      }
    })
    }
}
