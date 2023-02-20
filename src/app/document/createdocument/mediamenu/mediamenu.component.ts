import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MatDialogConfig,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { RenamemediaComponent } from "./renamemedia/renamemedia.component";
import { TagmediaComponent } from "./tagmedia/tagmedia.component";
import { DeletemediaComponent } from "./deletemedia/deletemedia.component";
import { ImagetostubComponent } from "./imagetostub/imagetostub.component";
import { DocumenttagService } from "../../services/documenttag.service";
import { project } from "src/app/project-dashboard/models/project-model";
import { v1 as uuidv1 } from "uuid";
import { Router } from "@angular/router";
import { AddasnewdocumentComponent } from "../previewimage/addasnewdocument/addasnewdocument.component";
import { AddMultipleImagesComponent } from "../add-multiple-images/add-multiple-images.component";
import { login } from "src/app/projectmanagement/models/login-model";
import { FormnameService } from "src/app/formname.service";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-mediamenu",
  templateUrl: "./mediamenu.component.html",
  styleUrls: ["./mediamenu.component.css"],
})
export class MediamenuComponent implements OnInit {
  callBackgetMediaData: any;
  stubid: any;
  mediaUrl: any;
  filename: any;
  mediaData: any;
  projectid: any;
  page_id: any;
  folderid: number;
  shows: boolean = false;
  deletes:boolean;
  folderlevel: number;
  layerDatas: any;
  getId: string;
  multipleSelectOn: boolean = false;
  multiselectionList: any[];
  projectFolderList: any[];
  su: login;
  activeLayerIdDraw: any;

  constructor(
    private dialogbox: MatDialogRef<MediamenuComponent>,
    private dialog: MatDialog,
    private dialog1: MatDialogRef<ImagetostubComponent>,
    private newdocservice: DocumenttagService,
    private router: Router,
    public messageService: FormnameService,
    private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.stubid = data.stubIdData;
    this.mediaUrl = data.media_url;
    this.filename = data.media_filename;
    this.mediaData = data.mediaData;
    console.log(this.mediaData);
    this.folderid = data.pfolderid;
    this.folderlevel = Number(data.folderlevel);
    this.layerDatas = this.data.layerDatas;
    this.getId = this.data.getId;
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.multiselectionList = this.data.multiselectionList;
    this.projectFolderList = this.data.projectFolderList;
    this.activeLayerIdDraw = this.data.activeLayerIdDraw

    for (let index = 0; index < data.layer_data.length; index++) {
      this.projectid = data.layer_data[index].project_id;
      for (let k = 0; k < data.layer_data[index].annotations.length; k++) {
        this.page_id = data.layer_data[index].annotations[k].page_id;
      }
    }
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }

  ngOnInit(): void { }
  closeBox() {
    this.dialogbox.close();
  }
  rename() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(RenamemediaComponent, {
      width: "380px",
      data: { stubData: this.mediaData,
        LayerDatas: this.data.layerDatas,
        getId: this.data.getId
      },
    });

    this.dialogbox.close();
  }
  tag() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;

    this.dialog.open(TagmediaComponent, {
      width: "380px",
      data: {
        mediacount: this.data.mediacount,
        stubId: this.stubid, stubData: this.mediaData, layerDatas: this.layerDatas,
        getId: this.getId,
        activeLayerIdDraw: this.activeLayerIdDraw
      },
    });
    this.dialogbox.close();
  }
  delete() {
    this.deletes=true;
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(DeletemediaComponent, {
      width: "380px",
      data: {
        deletes:this.deletes,
        layerDatas: this.layerDatas,
        multipleSelectOn: this.multipleSelectOn,
        multiselectionList: this.multiselectionList,
        message: "Are you sure?",
        activeLayerIdDraw: this.activeLayerIdDraw,
        stubData:this.mediaData,
      },
    });

    this.dialogbox.close();
  }
  delete1() {
    this.deletes=true;
    console.log(this.deletes)
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(DeletemediaComponent, {
      width: "380px",
      data: {
        deletes:this.deletes,
        layerDatas: this.layerDatas,
        multipleSelectOn: this.multipleSelectOn,
        multiselectionList: this.multiselectionList,
        message: "Are you sure?",
        activeLayerIdDraw: this.activeLayerIdDraw,
        stubData:this.mediaData,
      },
    });

    this.dialogbox.close();
  }
  imageStubs() {
    // const dialogconfig = new MatDialogConfig();
    // dialogconfig.autoFocus = true;
    // dialogconfig.disableClose = true;
    // let dialogref = this.dialog.open(ImagetostubComponent, {
    //   width: "380px",
    //   data: { stubIdData: this.stubid },
    // });


    // dialogref.afterClosed().subscribe((data) => {

    // });
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(AddMultipleImagesComponent, {
      data: {
        annotationData: this.getId,
        userId: this.su.user_id,
        stubIdData: this.stubid,
        multipleSelectOn : this.multipleSelectOn,
        media:this.mediaData,
        heading: "Add image to stub",
        filename: this.filename
      }
    }).beforeClosed().subscribe((res) => {
      if (res['data'].length > 0) {
        let stubimageData: any = {
          filepath: res['data'][0].filename,
          url: res['data'][0].mediaUrl,
          stubIdData: this.stubid,
        };
        this.messageService.sendMessage(stubimageData);
        // for (var k = 0; k < res['data'].length; k++) {
        //   let imageData = {
        //     stub_id: res['data'][k].stubId,
        //     media_url: res['data'][k].mediaUrl,
        //     is_removed: false,
        //     media_name: res['data'][k].filename,
        //     media_type: "image",
        //     from_medium: "stub",
        //     created_date: new Date().toISOString(),
        //     annotation_id: res['data'][k].annotationId,
        //     media_comment: "",
        //     version_number: 0,
        //     last_updated_date: new Date().toISOString(),
        //     created_by_user_id: this.su.user_id,
        //     annotation_media_id: res['data'][k].mediaId,
        //     media_tags: "",
        //   };
        //   //this.sampleFormObject.push(imageData);
        //   annotationMediaImages.push(imageData);
        // }
        //this.mediaCount = this.sampleFormObject.length

      }
    })
  }
  AddasDoc() {
    this.shows = true;
    this.newdocservice
      .addasNewDoc(
        this.projectid,
        this.page_id,
        this.mediaUrl,
        uuidv1().toUpperCase(),
        this.filename,
        this.folderid,
        this.folderlevel
      )
      .subscribe((res) => {
        console.log(res);
        if (res.response_code == 200) {
          this.newdocservice.filter("Register Click");
          this.dialog.closeAll();
          this.shows = false;
        }
      });
  }

  addasDocName(media_url) {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    let dialogref = this.dialog.open(AddasnewdocumentComponent, {
      width: "380px",
      data: {
        projectFolderList: this.projectFolderList,
        media_url: this.mediaUrl
      },
    });
    this.dialogbox.close();
  }
}
