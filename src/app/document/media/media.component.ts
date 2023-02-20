import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MatDialogConfig,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { StubphotosComponent } from "./stubphotos/stubphotos.component";
import { FormmappingService } from "../services/formmapping.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { v1 as uuidv1 } from "uuid";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
@Component({
  selector: "app-media",
  templateUrl: "./media.component.html",
  styleUrls: ["./media.component.css"],
})
export class MediaComponent implements OnInit {
  filepath: any;
  callBackgetStubData: any;
  annotationData: any;
  mediaId: string;
  su: login;
  url1: any;
  constructor(
    private dialogClose: MatDialogRef<MediaComponent>,
    public dialog: MatDialog,
    private annotationmediaservice: FormmappingService,
    private encrptdecrpt:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.annotationData = this.data.annotationData;
    this.callBackgetStubData = this.data.callback_StubData;
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
  }
  url: string;
  ngOnInit(): void {}
  closeBox() {
    this.dialogClose.close();
  }

  AddStubPhotos() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    this.dialog.open(StubphotosComponent, {
      width: "450px",
      data: { callback_StubData: this.callBackgetStubData },
    });
  }
  myFiles: any[] = [];
  onSelectFile(event, fileinput, files) {
    console.log(files);
    this.filepath = event.target.files[0].name;
    this.mediaId =
      this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + new Date().getTime();

    this.annotationmediaservice
      .annotationMedia(files.item(0), this.annotationData, this.mediaId)
      .subscribe((res) => {
        console.log(res);

        console.log(res.response_body.path);
        this.url = res.response_body.path;
        this.dialogClose.close({
          data: { data1: this.url, data2: this.filepath },
        });
      });
  }
}
