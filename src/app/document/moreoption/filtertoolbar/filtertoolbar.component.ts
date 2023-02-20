import { Component, OnInit } from "@angular/core";
import { ToolbarlistService } from "src/app/toolbar/services/toolbarlist.service";
import { ActivatedRoute } from "@angular/router";
import { ReadonlyService } from "../../services/readonly.service";
import { filterToolbar } from "../../models/toggleChange.model";
import { MatDialogRef } from "@angular/material/dialog";
import { DataserviceService } from "../../services/dataservice.service";
import { Subscription } from "rxjs";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";

@Component({
  selector: "app-filtertoolbar",
  templateUrl: "./filtertoolbar.component.html",
  styleUrls: ["./filtertoolbar.component.css"],
})
export class FiltertoolbarComponent implements OnInit {
  projectId: any;
  toolbarList: string[];
  filterToolbar: any = [];
  allChecked:boolean=false;
  pointsChecked:boolean=false;
  freehandChecked:boolean=false;
  vertexChecked:boolean=false;
  rectangleChecked:boolean=false;
  toolbarFilter={allChecked:false,pointsChecked:false,freehandChecked:false,vertexChecked:false,rectangleChecked:false};
  pageSync$: Subscription;

  constructor(
    private toolbarlistService: ToolbarlistService,
    private route: ActivatedRoute,
    private readonlyservice: ReadonlyService,
    private dialo: MatDialogRef<FiltertoolbarComponent>,
    private dataService:DataserviceService,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.dataService.filtertool.subscribe((data)=>{
      if(data){
        this.allChecked = data;
        this.checkAllFilter();
      }
    });
    this.Toolbar_filter = new filterToolbar();
    this.projectId = this.route.snapshot.queryParamMap.get("project_id");
    let getLocalCheckValues = this.encrptdecrpt.getItem("toolbarFilterItem");
    if (getLocalCheckValues != null) {
      this.toolbarFilter = this.encrptdecrpt.getItem("toolbarFilterItem");
      console.log(this.toolbarFilter);
      this.allChecked = this.toolbarFilter.allChecked;
      this.pointsChecked = this.toolbarFilter.pointsChecked;
      this.freehandChecked = this.toolbarFilter.freehandChecked;
      this.vertexChecked = this.toolbarFilter.vertexChecked;
      this.rectangleChecked = this.toolbarFilter.rectangleChecked;
     
    }
   
   
  }
  lower(value){
    console.log(value);
    console.log(this.pointsChecked);
  }
  size: boolean = false;
  ngOnInit(): void {
    this.getToolbarList();
  }

  ngOnDestroy() : void {
    if (this.pageSync$ != undefined) {
      this.pageSync$.unsubscribe();
    }
  }

  getToolbarList() {
    this.toolbarlistService.gettoolbarlist(this.projectId).subscribe((res) => {
      this.toolbarList = res["response_body"]["toolbar_listing"];
    });
  }

  Toolbar_filter: filterToolbar;

  checkAllFilter(){
    console.log(this.allChecked);
    if(this.allChecked==true){
      this.allChecked = true;
      this.pointsChecked = false;
      this.freehandChecked = false;
      this.vertexChecked = false;
      this.rectangleChecked = false;

      this.toolbarFilter.allChecked = this.allChecked;
      this.toolbarFilter.pointsChecked = this.pointsChecked;
      this.toolbarFilter.freehandChecked = this.freehandChecked;
      this.toolbarFilter.vertexChecked = this.vertexChecked;
      this.toolbarFilter.rectangleChecked = this.rectangleChecked;
      // localStorage.setItem("toolbarFilterItem", JSON.stringify(this.toolbarFilter));
      this.encrptdecrpt.setItem("toolbarFilterItem",this.toolbarFilter);//security
      this.dataService.filterOptions.emit(this.toolbarFilter);
    }
  }

  checkFilter() {
    console.log(this.pointsChecked,this.freehandChecked,this.vertexChecked,this.rectangleChecked,this.allChecked);
    if(this.pointsChecked&&this.freehandChecked&&this.vertexChecked&&this.rectangleChecked){
      this.pointsChecked = this.pointsChecked;
      this.freehandChecked = this.freehandChecked;
      this.vertexChecked = this.vertexChecked;
      this.rectangleChecked = this.rectangleChecked;
      this.allChecked = false;
    }   
    else if(this.pointsChecked&&this.freehandChecked&&this.vertexChecked){
      this.pointsChecked = this.pointsChecked;
      this.freehandChecked = this.freehandChecked;
      this.vertexChecked = this.vertexChecked;
      this.rectangleChecked = false;
      this.allChecked = false;
    }
    else if(this.pointsChecked&&this.vertexChecked&&this.rectangleChecked){
      this.pointsChecked = this.pointsChecked;
      this.freehandChecked = false;
      this.vertexChecked = this.vertexChecked;
      this.rectangleChecked = this.rectangleChecked;
      this.allChecked = false;
    }
    else if(this.pointsChecked&&this.freehandChecked&&this.rectangleChecked){
      this.pointsChecked = this.pointsChecked;
      this.freehandChecked = this.freehandChecked;
      this.vertexChecked = false;
      this.rectangleChecked = this.rectangleChecked;
      this.allChecked = false;
    }
    else if(this.freehandChecked&&this.vertexChecked&&this.rectangleChecked){
      this.pointsChecked = false;
      this.freehandChecked = this.freehandChecked;
      this.vertexChecked = this.vertexChecked;
      this.rectangleChecked = this.rectangleChecked;
      this.allChecked = false;
    }
    else if(this.pointsChecked&&this.freehandChecked){
      this.pointsChecked = this.pointsChecked;
      this.freehandChecked = this.freehandChecked;
      this.vertexChecked = false;
      this.rectangleChecked = false;
      this.allChecked = false;
    }
    else if(this.pointsChecked&&this.vertexChecked){
      this.pointsChecked = this.pointsChecked;
      this.freehandChecked = false;
      this.vertexChecked = this.vertexChecked;
      this.rectangleChecked = false;
      this.allChecked = false;
    }
    else if(this.pointsChecked&&this.rectangleChecked){
      this.pointsChecked = this.pointsChecked;
      this.freehandChecked = false;
      this.vertexChecked = false;
      this.rectangleChecked = this.rectangleChecked;
      this.allChecked = false;
    }
    else if(this.freehandChecked&&this.vertexChecked){
      this.pointsChecked = false;
      this.freehandChecked = this.freehandChecked;
      this.vertexChecked = this.vertexChecked;
      this.rectangleChecked = false;
      this.allChecked = false;
    }
    else if(this.freehandChecked&&this.rectangleChecked){
      this.pointsChecked = false;
      this.freehandChecked = this.freehandChecked;
      this.vertexChecked = false;
      this.rectangleChecked = this.rectangleChecked;
      this.allChecked = false;
    }
    else if(this.vertexChecked&&this.rectangleChecked){
      this.pointsChecked = false;
      this.freehandChecked = false;
      this.vertexChecked = this.vertexChecked;
      this.rectangleChecked = this.rectangleChecked;
      this.allChecked = false;
    }
    else if(this.pointsChecked){
      this.pointsChecked = this.pointsChecked;
      this.freehandChecked = false;
      this.vertexChecked = false; 
      this.rectangleChecked = false;
      this.allChecked = false;
    }
    else if(this.freehandChecked){
      this.pointsChecked = false;
      this.freehandChecked = this.freehandChecked;
      this.vertexChecked = false;
      this.rectangleChecked = false;
      this.allChecked = false;
    }
    else if(this.vertexChecked){
      this.pointsChecked = false;
      this.freehandChecked = false;
      this.vertexChecked = this.vertexChecked;
      this.rectangleChecked = false;
      this.allChecked = false;
    }
    else if(this.rectangleChecked){
      this.pointsChecked = false;
      this.freehandChecked = false;
      this.vertexChecked = false;
      this.rectangleChecked = this.rectangleChecked;
      this.allChecked = false;
    }
    else if(this.pointsChecked==false&&this.freehandChecked==false&&this.vertexChecked==false&&this.rectangleChecked==false){
      this.allChecked = true;
    }
    this.toolbarFilter.allChecked = this.allChecked;
    this.toolbarFilter.pointsChecked = this.pointsChecked;
    this.toolbarFilter.freehandChecked = this.freehandChecked;
    this.toolbarFilter.vertexChecked = this.vertexChecked;
    this.toolbarFilter.rectangleChecked = this.rectangleChecked;
    // localStorage.setItem("toolbarFilterItem", JSON.stringify(this.toolbarFilter));
    this.encrptdecrpt.setItem("toolbarFilterItem",this.toolbarFilter);//security
    this.dataService.filterOptions.emit(this.toolbarFilter);
  }
  closeBox() {
    this.dialo.close();
  }
}
