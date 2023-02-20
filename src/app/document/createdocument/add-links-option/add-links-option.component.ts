import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import {
  MatDialogRef,
  MatDialogConfig,
  MatDialog,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { LinksToDocumentComponent } from "./links-to-document/links-to-document.component";
import { CreateDocumentService } from "../../services/create-document.service";
import { LinkToUrlComponent } from "./link-to-url/link-to-url.component";
import { FormmappingService } from "../../services/formmapping.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-add-links-option",
  templateUrl: "./add-links-option.component.html",
  styleUrls: ["./add-links-option.component.css"],
})
export class AddLinksOptionComponent implements OnInit, OnDestroy {
  projectFolderList: any[];
  projectId: string;
  documentDetails: any[] = [];
  activatedAnnotationId: string;
  layerDatas: any[];
  multipleSelectOn: boolean;
  multiselectionList: any;
  getPages$;
  annotationsList: any[] = [];

  annotationList$: Subscription;

  constructor(
    private dialogRef: MatDialogRef<AddLinksOptionComponent>,
    private dialogBox: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: CreateDocumentService,
    private annotation: FormmappingService,
  ) {
    this.projectFolderList = this.data.projectFolderList;
    this.projectId = this.data.projectId;
    this.activatedAnnotationId = this.data.activatedAnnotationId;
    this.layerDatas = this.data.layerDatas;
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.multiselectionList = this.data.multiselectionList;
    this.annotationList$ = this.annotation.get_all_annotation().subscribe((data) => {
      var annotationlist = data.response_body.project_annotation_list;
      annotationlist.forEach((element) => {
        console.log(JSON.parse(element.layer_data));
        let annotations = JSON.parse(element.layer_data);
        this.annotationsList = [
          ...this.annotationsList,
          ...annotations.annotations,
        ];
      });
      console.log(this.annotationsList);
      this.test1();
      // this.getLayerId();
    });

  }

  ngOnInit(): void {
  }

  test1() {
    var documentsOnly = this.projectFolderList.filter((data) => {
      return data.is_folder_flag == 0;
    });
    for (var i = 0; i < documentsOnly.length; i++) {
      var count = i;
      this.getPages$ = this.documentService
        .getDocumentDetails(this.projectId, documentsOnly[i].folder_id)
        .subscribe((response) => {
          var dummy = response["response_body"]["document_list"];
          for (var j = 0; j < dummy.length; j++) {
            this.documentDetails.push(dummy[j]);
            console.log(this.documentDetails.length);
          }
        });
    }
  }

  openLinkToDocument() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogBox.open(LinksToDocumentComponent, {
      data: {
        projectFolderList: this.projectFolderList,
        projectId: this.projectId,
        documentDetails: this.documentDetails,
        activatedAnnotationId: this.activatedAnnotationId,
        layerDatas: this.layerDatas,
        linkDocument: true,
        multipleSelectOn: this.multipleSelectOn,
        multiselectionList: this.multiselectionList,
        annotationsList: this.annotationsList
      },
    });
    this.dialogRef.close();
  }

  closeBox() {
    this.dialogRef.close();
  }

  openLinktoUrl() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogBox.open(LinkToUrlComponent, {
      width: "400px",
      data: {
        projectFolderList: this.projectFolderList,
        projectId: this.projectId,
        documentDetails: this.documentDetails,
        activatedAnnotationId: this.activatedAnnotationId,
        layerDatas: this.layerDatas,
        multipleSelectOn: this.multipleSelectOn,
        multiselectionList: this.multiselectionList,
      },
    });
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.getPages$.unsubscribe();
    if (this.annotationList$ != undefined) {
      this.annotationList$.unsubscribe();
    }
  }
}
