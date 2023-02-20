import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DataService } from "src/app/data.service";
import { ValueService } from "src/app/value.service";
import { CreateDocumentService } from "../../services/create-document.service";
import { DataserviceService } from "../../services/dataservice.service";
@Component({
  selector: "app-documentrename",
  templateUrl: "./documentrename.component.html",
  styleUrls: ["./documentrename.component.css"],
})
export class DocumentrenameComponent implements OnInit {
  DocumentId: any;
  pageId: any;
  pageName: any = "";
  rename_page: any;
  getRenamepage:any;
  renameflag: boolean=false;
  a: number=1;
  show:boolean = false;
  constructor(
    private dialo: MatDialogRef<DocumentrenameComponent>,
    public service: CreateDocumentService,
    private dataService:DataserviceService,
    private valueService:ValueService,
    private receiveData:DataService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.DocumentId = this.data.docid;
    this.pageId = this.data.pageid;
    this.pageName = this.data.pagename;
    if(this.pageName != undefined && this.pageName != null && this.pageName != ""){
      this.pageName = this.receiveData.changeSpecialtoKeyFormat(this.pageName);
    }
  
    console.log(this.service.formData.rename_page);
  }

  ngOnInit(): void {}

  closeBox() {
    this.dialo.close();
  }

  rename(rename_page) {
    if(rename_page!=undefined && rename_page!=null){
      let name_remove_whitespace = rename_page.trim();
      if(name_remove_whitespace !=""){
        this.show = true;
        rename_page = name_remove_whitespace;
        rename_page = this.receiveData.changeFormat(rename_page);
        this.service.Rename(this.DocumentId, this.pageId, rename_page).subscribe((data) => {
            if(data["response_code"]==200){
              console.log(data);
              // this.dataService.pageName.emit(rename_page); // need to test more
              let sendPageData = { page_id: this.pageId, page_name: rename_page, document_id: this.DocumentId };
              this.dataService.documentlistReceive.emit(sendPageData);
              this.dialo.close();
            }
            else{
              this.errorMessage();
              this.dialo.close();
            }
        });
      }
      else{
        // empty text nothing to return 
        return;
      }
    }
    else{
      //  null of undefined text nothing to return
      return;
    }
  }

  firstLetterCapital(word){
    this.pageName = this.valueService.firstLetterCapital(word);
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
