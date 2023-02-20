import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { DataserviceService } from "../../services/dataservice.service";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { DocumenttagService } from "../../services/documenttag.service";
import { DocumentshareddataService } from "../../services/documentshareddata.service";
import { DatePipe } from "@angular/common";
import { DataService } from "src/app/data.service";
import { Observable, Subscription } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { DataimageService } from "src/app/dataimage.service";
import { CreateDocumentService } from "../../services/create-document.service";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { cloneDeep } from "lodash";
import { PDFDocumentProxy } from "ng2-pdf-viewer";

@Component({
  selector: "app-documentswitchpage",
  templateUrl: "./documentswitchpage.component.html",
  styleUrls: ["./documentswitchpage.component.css"],
})
export class DocumentswitchpageComponent implements OnInit, OnDestroy {
  datas: any[];
  datass: any[];
  getAlltaglist: any;
  listPage: Array<String> = [];
  isAscendic = true;
  AcendingButton = true;
  DecendingButton = false;
  searchWordswitchPage: any = "";
  searchData: any;
  changePageSort$: Subscription;
  pngFormat: boolean = false;
  imgUrl: any = "";
  PDFDocURL: any = "";
  firstkey: any;
  readonly APIBaseUrl = environment.APIBaseUrl + "get_web_singed_file?file=";
  secondkey: string;
  projectId:string="";
  folderId:string="";
  show:boolean=true;
  totalPages:number = 0;
  pageNumber_pdf:number = 1;
  pdfLoadingComplete:boolean = false;
  pdfDisplayHide:boolean = false;
  loading:boolean=true

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: DocumenttagService,
    public dataService: DataserviceService,
    public dataService1: DocumentshareddataService,
    private dialo: MatDialogRef<DocumentswitchpageComponent>,
    private datePipe: DatePipe,
    private dialogBox: MatDialog,
    private sendData: DataService, public imgdataService: DataimageService,
    private documentService: CreateDocumentService,
    private route:ActivatedRoute,
    private http: HttpClient
  ) {
    console.log('opened');
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    this.folderId = this.route.snapshot.queryParamMap.get("folderId");
    this.firstkey = "&key1=" + this.imgdataService.securityKey1() + "&key2=" + this.imgdataService.securityKey2();
    this.datas = this.data.page_Data;
    this.searchData = this.data.page_Data;
    this.pngFormat = this.data.popupdata.pngFormat;
    this.imgUrl = this.data.popupdata.imgUrl;
    console.log(this.data);
    this.datass = cloneDeep(this.datas);
  }

  ngOnInit(): void {
    if(this.imgUrl != undefined && this.imgUrl != ""){
      this.getPDFFetch().then(blobValue => {
          let filepath : any = blobValue;
          var file = new Blob([filepath]);
          let fileURL = URL.createObjectURL(file);
          this.PDFDocURL = fileURL;
          this.show = false;
      })
    }
    this.getlayerdatafromAPI();
  }
  onload(){
    this.loading=false
  }

  getPDFFetch(){
    return fetch(this.imgUrl).then(response => response.blob())
  }
  
  getPDF(): Observable<Blob>
  {
      const headers = new HttpHeaders({ responseType : 'blob'});
      return this.http.get<Blob>(this.imgUrl, { headers : headers,responseType : 'blob' as 'json'});
  }

  getlayerdatafromAPI() {
    let start = this.documentService.functionstarttime('getcount api');
    this.documentService.getAnnotationsCount(this.projectId, this.folderId).subscribe((data: any) => {
      console.log(data);
      if(data["response_code"]==200){
        this.documentService.functionendtime('getcount api',start);
        let function_start = this.documentService.functionstarttime("function run");
        let annotation_page_data = data.response_body.page_details;
        this.totalPages = annotation_page_data.length;
        this.datas = [];
        if(this.imgUrl == undefined || this.imgUrl == ""){
          this.show=false;
        }
        this.datass.sort((a, b) => a.page_number- b.page_number);
        if(annotation_page_data != undefined){
          for (let k = 0; k < this.datass.length; k++) {
            this.datass[k].page_name = this.sendData.changeSpecialtoKeyFormat(this.datass[k].page_name); // page name special character changes
            this.listPage.push(this.datass[k].page_id);
            let data_page = annotation_page_data.find(({page_id}) =>page_id == this.datass[k].page_id);
            if(data_page != undefined){
              this.datass[k].annotationCount = data_page.annotation_count;  
            }
            // date transform for the created and modified date
            this.datass[k].created_date = this.datePipe.transform(this.datass[k].created_date,"MM/dd/yyyy 'at' hh:mm aa");
            if(this.datass[k].last_updated_date && this.datass[k].last_updated_date != "0000-00-00 00:00:00"){
              this.datass[k].last_updated_date = this.datePipe.transform(this.datass[k].last_updated_date,"MM/dd/yyyy 'at' hh:mm aa");
            }
            else if(this.datass[k].last_updated_date){
              this.datass[k].last_updated_date = this.datePipe.transform(this.datass[k].created_date,"MM/dd/yyyy 'at' hh:mm aa");
            }
          }
        }
        this.searchData = this.datass;
        this.documentService.functionendtime("function run",function_start);
        this.getProjectTaglist();
      }
    });
  }

  openfile(page_number) {
    this.dataService1.switchPagesendPageNumber.emit(page_number);
    this.dialo.close();
  }

  closeBox() {
    this.dialo.close();
  }
  
  //filter
  getProjectTaglist() {
    this.service.getPageAllTag(this.listPage).subscribe((res) => {
      this.getAlltaglist = res["response_body"].layer_page_tags;
    });
  }

  applyFilter = (filtervalue) => {
    this.datass = this.searchData;
    var a = filtervalue;
    if (this.getAlltaglist != undefined) {
      var tagfilter = this.getAlltaglist.filter((data) =>
        data.layer_page_tag_name.toLowerCase().includes(a.toLowerCase())
      );

      var uniquePageFilter = this.datass.filter(function (page_id) {
        return tagfilter.some(function (tagfilterId) {
          return page_id.page_id === tagfilterId.page_id;
        });
      });
    } else {
      var uniquePageFilter = [];
    }
    if (this.datass != undefined) {
      var pagefilter = this.datass.filter(
        (data) =>
          data.page_name.toLowerCase().includes(a.toLowerCase()) ||
          data.created_date.toLowerCase().includes(a.toLowerCase()) ||
          data.last_updated_date.toLowerCase().includes(a.toLowerCase())
      );
    } else {
      var pagefilter = [];
    }
    let arrResult = [...uniquePageFilter, ...pagefilter];
   
    for(let i=0;i<arrResult.length;i++)
    {
      for(let j=i+1;j<arrResult.length;j++)
      {
        if(arrResult[i].page_id==arrResult[j].page_id)
        {
        arrResult.splice(i,1);  
        }
      }
    }
    if (filtervalue.length > 0) {
      this.datass = arrResult;
    }
    else {
      this.datass = this.searchData;
    }
  
  };

  firstLetterCapital(word) {
    if (word) {
      let firsttypeLetter = word[0].toUpperCase();
      let othertypeletters = word.slice(1);
      let changeUpperCaseProjectName = firsttypeLetter + othertypeletters;
      this.searchWordswitchPage = changeUpperCaseProjectName;
    }
  }

  trackbyFunctionswitch(index, item) {
    return item.page_id;
  }

  pageRendered(e: any) {
    if (this.pdfLoadingComplete == false) {
      this.pdfDisplayHide = true;
      console.log('(pages-rendered)', e);
      this.pageNumber_pdf = e.pageNumber + 1;
      let pageNumber = e.pageNumber;
      let canvas_element = e.source.canvas;
      if (canvas_element) {
        const contentDataURL = canvas_element.toDataURL('image/jpeg', 1.0)
        let find_page_index = this.datass.findIndex((pages) => pages.page_number == pageNumber);
        if (find_page_index > -1) {
          this.datass[find_page_index]["imagePath"] = contentDataURL;
        }
      }
      if (this.totalPages == pageNumber) {
        this.pdfLoadingComplete = true;
        let get_rme_node = document.getElementById("pdfViewerHeadSwitch");
        if (get_rme_node != null) {
          get_rme_node.remove();
        }
      }
    }
  }

  ngOnDestroy(): void {
    if(this.changePageSort$!=undefined){
      this.changePageSort$.unsubscribe();
    }
    let get_rme_node = document.getElementById("pdfViewerHeadSwitch");
    if (get_rme_node != null) {
      get_rme_node.remove();
    }
  }
}
