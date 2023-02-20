import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CreateDocumentService } from "src/app/document/services/create-document.service";
import { DataserviceService } from "src/app/document/services/dataservice.service";
import { login } from "src/app/projectmanagement/models/login-model";
import { v1 as uuidv1 } from "uuid";
import * as _ from 'lodash';
import { MatSnackBar } from "@angular/material/snack-bar";
import { createDocumentVar } from "../../createdocumentvariables";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
@Component({
  selector: "app-link-to-url",
  templateUrl: "./link-to-url.component.html",
  styleUrls: ["./link-to-url.component.css"],
})
export class LinkToUrlComponent implements OnInit {
  projectFolderList: any[];
  projectId: string;
  documentDetails: any[];
  linkname:any[];
  activatedAnnotationId: string;
  layerDatas: any[];
  su: login;
  count:any=0;
  documentId: string;
  annotationid: any;
  multipleSelectOn: boolean = false;
  multiselectionList: any;
  linkCount: number = 0;
  urlNotMatch: boolean = true;
  getId: any;
  activeLayerIdDraw: any;
  show: boolean = false;
  createDocumentStore:createDocumentVar;
  constructor(
    private dialog: MatDialogRef<LinkToUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: CreateDocumentService,
    private route: ActivatedRoute,
    private dataShareService: DataserviceService,
    private _snackBar: MatSnackBar,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.projectFolderList = this.data.projectFolderList;
    this.projectId = this.data.projectId;
    this.documentDetails = this.data.documentDetails;
    this.layerDatas = this.data.layerDatas;
    this.annotationid = this.data.activatedAnnotationId;
    this.multipleSelectOn = this.data.multipleSelectOn;
    this.multiselectionList = this.data.multiselectionList;
    this.getId = this.data.getId;
    this.activeLayerIdDraw = this.data.activeLayerIdDraw;
    this.createDocumentStore = this.documentService.createDocumentStore_values;
    console.log(this.createDocumentStore);
  }
  urls: any = "http://";

  ngOnInit(): void {
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.documentId = this.route.snapshot.queryParamMap.get("folderId");
  }

  close() {
    this.dialog.close();
  }

  testUrl(urls) {
    console.log(urls);
    window.open(urls);
  }

  addLink(urls) {
    this.linkname=this.data.linksarray;
    if(urls.includes("http://") || urls.includes("https://")){}
    else{
      urls="http://"+urls
    }
    this.show = true;
    if(this.linkname!=undefined){
    var dummycount=this.linkname.filter(ele=>ele.annotation_id==="");
    }
    let count;
    if(dummycount!=null && dummycount.length!=0){
        count=dummycount.length;
    }
    var name="URL";
    var name1="URL";
    var temp;
    var urlslowercase=urls.toLowerCase();
    if(this.linkname!=undefined){
    var FieldFind = this.linkname.filter(ele => ele.link_path === urlslowercase);
    }
    console.log(FieldFind);
      if(this.count!=0)
      {
        return 0;
      }
      if(count==0 || count==undefined)
      {
        temp=name1.slice(0.3);
      }
      else
      {
         temp=name1+ " (" + count + ")";
      }
      name=temp;

      if (this.multipleSelectOn == false) {
        var uuiddate = new Date().getTime();
        var uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + uuiddate;
        var date = new Date().toISOString();
        var createJSON = {
          annotation_id: "",
          annotation_link_id: uuid,
          document_id: "",
          last_updated_date: date,
          link_type: name,
          created_by_user_id: this.su.user_id,
          is_removed: false,
          link_path: urls,
          created_date: date,
          version_number: 0,
        };  
        var layers = [];
        for (var i = 0; i < this.layerDatas.length; i++) {
          var currentAnnotationData = this.layerDatas[i].annotations.filter((ele => ele.annotation_id == this.getId))
          if(currentAnnotationData.length>0){
            currentAnnotationData[0].annotation_links.push(createJSON);
            this.linkCount = currentAnnotationData[0].annotation_links.length;
          }
          layers.push(this.layerDatas[i]);
        }
        this.documentService.createDocumentStore_values.undovaluesstore = this.createDocumentStore.undovaluesstore;
        // this.dataShareService.sendLinkedPageData(undoArray);
        let pass_data = {layer_data:this.layerDatas,ids:-1};
        this.dataShareService.mediaTagsUpdate.emit(pass_data);
        let cloneTagsLayer = _.cloneDeep(this.layerDatas);
        this.documentService.annotationUpdateForm1(cloneTagsLayer, this.getId, this.activeLayerIdDraw,'link').subscribe((response) => {
          if (response["response_code"] == 200) {
            this.show = false;
            this.dialog.close(this.linkCount);
          }
          else {
            this.errorMessage();
          }
        });
        this.dialog.close(this.linkCount);
      }
      else if (this.multipleSelectOn == true) {
        let templinkCount = 0;
        for (var k = 0; k < this.multiselectionList.length; k++) {
          let url_name = "URL";
          let check_duplicate = this.multiselectionList[k].annotation_links;
          if(check_duplicate.length > 0){
            let filter_links = this.multiselectionList[k].annotation_links.filter((doc_value)=>{
              return doc_value.document_id == '';
            })
            if(filter_links.length > 0){
              let find_exist_value = filter_links.filter((link_name)=>{
                return link_name.link_path == urlslowercase;
              });
              if(find_exist_value.length > 0){
                url_name = url_name + ` (${find_exist_value.length})`;
              }
            }
          }
          var uuiddate = new Date().getTime();
          var uuid = this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + uuiddate;
          var date = new Date().toISOString();
          // annotation_id: this.multiselectionList[k].annotation_id,
          var createJSON1 = {
            annotation_id: "",
            annotation_link_id: uuid,
            document_id: "",
            last_updated_date: date,
            link_type: url_name,
            created_by_user_id: this.su.user_id,
            is_removed: false,
            link_path: urls,
            created_date: date,
            version_number: 0,
          };
          console.log(createJSON1);
            let findLayerIndex = this.layerDatas.findIndex((LData) => LData.layer_id == this.multiselectionList[k].layer_id);
            if (findLayerIndex != -1) {
              let findAnnotationIndexS = this.layerDatas[findLayerIndex].annotations.findIndex((ADAta) => ADAta.annotation_id == this.multiselectionList[k ].annotation_id);
              if (findAnnotationIndexS != -1) {
                this.layerDatas[findLayerIndex].annotations[findAnnotationIndexS].annotation_links.push(createJSON1);
                templinkCount = templinkCount + this.layerDatas[findLayerIndex].annotations[findAnnotationIndexS].annotation_links.length;
              }
            }
        }
        this.linkCount = templinkCount;
        this.documentService.createDocumentStore_values.undovaluesstore = this.createDocumentStore.undovaluesstore;
        let clonelinksLayer = _.cloneDeep(this.layerDatas);
        this.documentService.annotationMultipleUpdate(clonelinksLayer, this.multiselectionList,'link').subscribe((response) => {
          console.log(response);
          if (response["response_code"] == 200) {
            this.show = false;
            let layerDataTemp = {layervalue:this.layerDatas,multiplelist:this.multiselectionList};
            this.dataShareService.getIdUpdated.emit(layerDataTemp);
            this.dialog.close();
          }
          else {
            this.errorMessage();
          }
        });
      }
  }

  getCorrectorNotURL(urlValue) {
    let res = urlValue.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null) {
      this.urlNotMatch = true;
    }
    else {
      this.urlNotMatch = false;
    }
  }

  errorMessage() {
    this.show = false;
    this._snackBar.open('Sync is an error', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }
}
