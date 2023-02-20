import {
  Component,
  OnInit,
  Inject,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CreateDocumentService } from "../services/create-document.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DataserviceService } from "../services/dataservice.service";
import { ShapeService } from "../services/shape.service";
import { DocumentshareddataService } from "../services/documentshareddata.service";

@Component({
  selector: "app-set-base-iconsize",
  templateUrl: "./set-base-iconsize.component.html",
  styleUrls: ["./set-base-iconsize.component.css"],
})
export class SetBaseIconsizeComponent implements OnInit {
  folderId: string = "";
  projectId: string = "";
  documentPages: any[];
  allPages: boolean = false;
  object1 = []
  elementHandW: any;
  allowedPages = [];
  allowedPageNumbers = [];
  setbaseicinsize = [];
  currentPageId: any ="";
  currentPageUnSelect = false;
  currentPageNumber: any = 0;
  show: boolean = true;
  getDrawWidthandHeight:any =  { left: 0, top: 0, width: 35, height: 35 };
  annotationstring: any;
  pageidsss: any;
  documentid: string;
  value: string;
  object2 = [];
  pages: boolean
  single_annotation_data: any = null;
  selected_page_ids:any[] = [];
  selected_page_ids_check:string[]=[];
  loader:boolean=false;
  total_annotation_count : any = 0 ;
  constructor(
    private route: ActivatedRoute,
    private documentService: CreateDocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SetBaseIconsizeComponent>,
    private dataService:DocumentshareddataService ,
    private shape_service: ShapeService
  ) {
    this.folderId = this.route.snapshot.queryParamMap.get("folderId");
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    
    if (this.data.annotation_data != undefined) {
      this.single_annotation_data = this.data.annotation_data;
      this.currentPageId = this.single_annotation_data.page_id;
    }

    this.documentService.getform(this.projectId, this.folderId).subscribe((data: any) => {
      console.log(data);
      this.show = false;
      let layerDataTemp = data["response_body"]["layer_datas"];
      let removeDeleteLayer = layerDataTemp.filter((LData) => {
        if (LData.is_removed == false || LData.is_removed == "false") {
          return LData;
        }
      });
      for (let k = 0; k < removeDeleteLayer.length; k++) {
        let removeDeleteAnnotation = removeDeleteLayer[k].layer_data.annotations.filter((AData) => {
          if (AData.is_removed == false || AData.is_removed == "false") {
            return AData;
          }
        })
        removeDeleteLayer[k].layer_data.annotations = removeDeleteAnnotation;
      }

      this.documentService.getDocumentDetails(this.projectId, this.folderId).subscribe((response) => {
        this.documentPages = response["response_body"]["document_list"];
        console.log(this.documentPages)
        this.show = false;
        this.documentid = this.documentPages[0].document_id
        console.log(this.documentPages, this.documentid);
        this.documentPages.forEach((pages) => {
          var count = 0;
          removeDeleteLayer.forEach((list) => {
            list.layer_data.annotations.forEach(element => {
              if (pages.page_id == element.page_id) {
                count = count + 1;
              }
            });
          });
          pages.annotationCount = count;
          this.total_annotation_count += count;          
        });

      });
    })
    console.log(this.single_annotation_data)
    if (this.single_annotation_data != null && this.single_annotation_data != undefined) {
      let clone_object_data = Object.assign({}, this.single_annotation_data);
      if(Number(this.single_annotation_data.initial_width)==0 || Number(this.single_annotation_data.initial_height)==0){
        this.getDrawWidthandHeight = this.shape_service.getCanvaswidthandHeight(clone_object_data);
      }
      else{
        this.getDrawWidthandHeight = this.shape_service.getCanvaswidthandHeight(clone_object_data);
        // this.getDrawWidthandHeight.left = 0;
        // this.getDrawWidthandHeight.top = 0;
        // this.getDrawWidthandHeight.width = Number(this.single_annotation_data.initial_width);
        // this.getDrawWidthandHeight.height = Number(this.single_annotation_data.initial_height);
      }
      
      let default_object = {
          icon_data: {
            "width": this.getDrawWidthandHeight.width, "height": this.getDrawWidthandHeight.height
          }, "page_id": this.currentPageId
        };
      this.selected_page_ids.push(default_object);
      console.log(this.selected_page_ids);
      this.selected_page_ids_check.push(this.currentPageId);
    }
  }


  ngOnInit(): void {

  }
  
  closeBox() {
    if(this.selected_page_ids.length==0){
      this.dialogRef.close();
    }
    else{
      this.loader=true;
      this.documentService.seticonsize(this.documentid, this.selected_page_ids).subscribe(data => {
        console.log(data);
        if (data["response_code"] == 200) {
          this.loader=false;
          
          let width_height = { "width": this.getDrawWidthandHeight.width, "height": this.getDrawWidthandHeight.height };
          this.dataService.set_base_icon_changes.emit(width_height);
          this.dialogRef.close();
        }
        else {
          this.loader=false;
          this.dialogRef.close();
        }
      });
    }

  }

  checkTickorNot1(page_id, event) {
    
    if (event.target.checked == true && this.allPages == false) {
      let select_page_object = 
        {
          icon_data: {
            "width": this.getDrawWidthandHeight.width, "height": this.getDrawWidthandHeight.height
          }, "page_id": page_id
        };
      this.selected_page_ids.push(select_page_object);
      this.selected_page_ids_check.push(page_id);
    }
    else if (event.target.checked == false && this.allPages == false) {
      var index_value = this.selected_page_ids.findIndex((data_pages) => data_pages.page_id === page_id);
      this.selected_page_ids.splice(index_value,1);
      this.selected_page_ids_check.splice(index_value,1);
    }
    if(this.selected_page_ids.length==this.documentPages.length){
      this.allPages=true;
    }
    else{
      this.allPages=false;
    }
  }


  allPagesSelected(event) {
    this.allPages = !this.allPages;
    if(event.target.checked==true){
      for (var i = 0; i < this.documentPages.length; i++) {
        
        if(!this.selected_page_ids_check.includes(this.documentPages[i].page_id)){
          let select_page_object = 
          {
            icon_data: {
              "width": this.getDrawWidthandHeight.width, "height": this.getDrawWidthandHeight.height
            }, "page_id": this.documentPages[i].page_id
          };
          this.selected_page_ids.push(select_page_object);
          this.selected_page_ids_check.push(this.documentPages[i].page_id);
        }
      }
    }
    else{
      this.selected_page_ids = [];
      this.selected_page_ids_check = [];
    }


    // this.object2 = [];
    // console.log(this.allPages)
    // for (var i = 0; i < this.documentPages.length; i++) {
    //   if (event.target.checked == true) {
    //     this.allowedPages.push(this.documentPages[i].page_id);
    //     this.allowedPageNumbers.push(this.documentPages[i].page_number);
    //   }
    //   else {
    //     for (var i = 0; i < this.documentPages.length; i++) {
    //       this.allowedPages = [];
    //       this.allPages = false;
    //     }
    //     this.object1 = []


    //   }
    // }
    // console.log(this.object1)
    // for (var k = 0; k < this.allowedPages.length; k++) {
    //   // this.getCheck(this.allowedPages[k], this.allowedPageNumbers[k]);
    // }
    // this.dataService.setIconBaseSize.emit();
  }
}



