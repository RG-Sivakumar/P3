import { Component, OnInit } from "@angular/core";
import { HeadertitleService } from "src/app/headertitle.service";
import { MatTableDataSource } from "@angular/material/table";
import { DatePipe } from "@angular/common";
import { v1 as uuidv1 } from "uuid";
import { Router, ActivatedRoute } from "@angular/router";
import { login } from "src/app/projectmanagement/models/login-model";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { FormlistService } from "../../services/formlist.service";
import { AddformsComponent } from "../../addforms/addforms.component";
import { DataService } from "src/app/data.service";
import { EventGlobalService } from "src/app/event-global.service";
import { SelectionModel } from "@angular/cdk/collections";
import { FormImport } from "../models/import_form_model";
import { th } from "date-fns/locale";
import moment from "moment";
import { ValueService } from "src/app/value.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EncryptDecryptService } from "src/app/commonshared/services/encrypt-decrypt.service";
export interface PeriodicElement {
  AppealSent: string;
  Customer: string;
  RereviewSent: string;
  BoardOfReviewSent: string;
  FinalDecisionSent: string;
}

@Component({
  selector: "app-import-forms",
  templateUrl: "./import-forms.component.html",
  styleUrls: ["./import-forms.component.css"],
})
export class ImportFormsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  importFormIds: string[] = [];
  date: any;
  su: login;
  FormList: boolean = false;
  slider: boolean = false;
  projectId: string;
  displayedColumns: any[] = [
    "ProjectName",
    "Name",
    "CreatedDate",
    "LastModifiedDate",
    "select",
  ];
  selection = new SelectionModel<PeriodicElement>(true, []);
  startingformlist: any;
  sortFormList: any;
  sortMessage: string;
  message: any;
  dateFilter2: any;
  ForlMutiList: any;
  listdta: any;
  formImportdata: FormImport = new FormImport();
  totalFormsLimit:number = 50;

  constructor(
    private headerTitleService: HeadertitleService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public formlistservice: FormlistService,
    private receiveData: DataService,
    private eventsService: EventGlobalService,
    private uuidService:ValueService,
    private _snackBar:MatSnackBar,
    private encrptdecrpt:EncryptDecryptService
  ) {
    this.projectId = this.route.snapshot.queryParamMap.get("projectId");

  }

  ngOnInit(): void {
    //this.headerTitleService.setTitle("Import Existing Form");
    this.getAllFormList();
    this.su = this.encrptdecrpt.getItem("loggedIn") || "{}";
    this.filtermethod();
    this.searchOut();
  }
  searchOut() {
    this.eventsService.broadcast("on", "@`#11*(%");
  }
  getAllFormList() {
    this.slider = true;
    this.formlistservice.getAllProjectForms().subscribe((res) => {
      this.FormList = true;
      this.slider = false;
      let getresponse_special_character = res["response_body"]["form_listing"];
      if(res["response_body"]["form_listing"].length>0){
        let changing_character_list = this.receiveData.changeSpecialtokeyformatList(getresponse_special_character,'formlist');
       let change_character_list = this.receiveData.changeSpecialtokeyformatList(changing_character_list,'projectlist');
        console.log(change_character_list);
        res["response_body"]["form_listing"] = change_character_list;
      }
      var receiveData1 = res["response_body"]["form_listing"];
      this.listdta = res["response_body"]["form_listing"];
      var dateFilter1 = receiveData1.filter((dateOnly1) => {
        //dateOnly1.created_date = moment.utc(dateOnly1.created_date)
        if (dateOnly1.created_date != "0000-00-00 00:00:00") {
          return dateOnly1.created_date = moment.utc(dateOnly1.created_date)

        }
      });
      this.dateFilter2 = dateFilter1.filter((dateOnly2) => {
        //dateOnly2.created_date = moment.utc(dateOnly2.created_date)
        if (dateOnly2.last_updated_date != "0000-00-00 00:00:00") {
          return dateOnly2.last_updated_date = moment.utc(dateOnly2.created_date)
        }
      });
      this.dataSource = new MatTableDataSource(this.dateFilter2);
      this.listdta = this.dateFilter2;
      this.sortFormList = this.dateFilter2;
     
      this.receiveData.currentMessage.subscribe((message) => {
        this.sortMessage = message;
        if (this.sortMessage == "ascending") {
          this.sortFormList.sort((a, b) =>
            a.form_name.localeCompare(b.form_name)
          );
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.listdta = this.sortFormList;
        } else if (this.sortMessage == "descending") {
          this.sortFormList.sort((a, b) =>
            b.form_name.localeCompare(a.form_name)
          );
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.listdta = this.sortFormList;
        }
        else if (this.sortMessage == "datecreatedOldToRecent") {
          this.sortFormList.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.listdta = this.sortFormList;
        } else if (this.sortMessage == "datecreatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.listdta = this.sortFormList;
        } else if (this.sortMessage == "lastupdatedOldToRecent") {
          this.sortFormList.sort((a, b) => new Date(a.last_updated_date).getTime() - new Date(b.last_updated_date).getTime());
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.listdta = this.sortFormList;
        } else if (this.sortMessage == "lastupdatedRecentToOld") {
          this.sortFormList.sort((a, b) => new Date(b.last_updated_date).getTime() - new Date(a.last_updated_date).getTime());
          this.dataSource = new MatTableDataSource(this.sortFormList);
          this.listdta = this.sortFormList;
        }
      });
    });
  }



  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listdta?.length;
    console.log(numSelected);
    console.log(numRows);
    return numSelected === numRows;
  }
   
  masterToggle(event) {
    let limitation = this.listdta;
    if(limitation!=undefined && limitation.length>50){
      limitation = limitation.slice(0,50);
      if(event.checked==true){
      this.errorMessage();
      }
    }
    if (this.isSomeSelected()) {
      this.selection.clear();
    }
    else{
      this.isAllSelected() ? this.selection.clear() : limitation?.forEach(row => this.selection.select(row));
      console.log(this.selection);
    }
 
  }
  
  // checkboxLabel(row?: PeriodicElement): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.Customer + 1}`;
  // }
   
  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  // toggleVisibilityImport(event: any, form_id) {
  //   
  //   var remember = event.target.checked;
  //   if (remember == true) {
  //     this.importFormIds.push(form_id);
  //   } else if (remember == false) {
  //     for (var i = 0; i < this.importFormIds.length; i++) {
  //       if (this.importFormIds[i] == form_id) {
  //         this.importFormIds.splice(i, 1);
  //       }
  //     }
  //   }
  // }
  // checkAll(ev) {
  //   
  //   this.ForlMutiList.forEach(x => x.state = ev.target.checked)
  // }

  // isAllChecked() {
  //   return this.ForlMutiList.every(_ => _.state);
  // }
  cancel(){
    this.router.navigateByUrl("/formbuilder/formlist");
    }

  filtermethod() {

    this.eventsService.on("on", (a) => {

      this.message = a;
      this.applyFilter(this.message);
    });
  }

  applyFilter = (filtervalue) => {

    var a = filtervalue;
    if (this.dateFilter2 != undefined) {
      var projectfilter = this.dateFilter2.filter((data) => {
        return (
          data.project_name.toLowerCase().includes(a.toLowerCase()) ||
          data.form_name.toLowerCase().includes(a.toLowerCase())
          // ||
          // data.created_date.includes(a) ||
          // data.last_updated_date.includes(a)
        );
      });
    } else {
      projectfilter = [];
    }
    var arrResult = []
    if (a.length > 0) {
      arrResult = [...projectfilter];
    } else {
      arrResult = this.dateFilter2;
    }
    this.dataSource = new MatTableDataSource(arrResult);
    this.listdta = arrResult;
  };
  // this.set=true;
  //   this.service.getAllProjectForms().subscribe(res => {
  //
  //     this.set=false;
  //     var getAllForms = res["response_body"]["form_listing"];
  //     if(getAllForms!=undefined){
  //       var crateDateFilter = getAllForms.filter(createDate => { return createDate.created_date = this.datePipe.transform(createDate.created_date, 'MM/dd/yyyy') });
  //       this.startingformlist = crateDateFilter.filter(modifiedDate => { return modifiedDate.last_updated_date = this.datePipe.transform(modifiedDate.last_updated_date, 'MM/dd/yyyy') });
  //
  //     }
  //     this.allProjectForms = new MatTableDataSource<any>(this.startingformlist);
  //     this.importButon=true;
  //     this.retrieveImport = true;
  //
  //     this.displayedColumns1 = ["ProjectName", "formName", "Created", "LastModified", "checkLabel"];
  //   });

  // toggleVisibilityImport(event: any, form_id) {
  //
  //   var remember = event.target.checked;
  //
  //   if (remember == true) {
  //     this.importFormIds.push(form_id);
  //
  //   }
  //   else if (remember == false) {
  //     for (var i = 0; i < this.importFormIds.length; i++) {
  //       if (this.importFormIds[i] == form_id) {
  //         this.importFormIds.splice(i, 1);
  //
  //       }
  //     }
  //   }
  // }

  // importForms() {
  //   this.hide = false;
  //   this.set=true;
  //   this.date = new Date().getTime();
  //   var uuidImportFormIds = [];
  //   for (var i = 0; i < this.importFormIds.length; i++) {
  //     uuidImportFormIds.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + this.date);
  //
  //   }
  //   this.service.importForms(uuidImportFormIds, this.importFormIds).subscribe(res => {
  //
  //     this.set=false;
  //     this.service.filter("Register Click");
  //     var status = res["response_code"];
  //     if(status == 200){
  //
  //     }
  //     this.importButon=false;
  //     this.retrieveImport=false;
  //   })
  btnDisabled = false;
  importFormsAuc() {
    this.date = new Date().getTime();
    this.formImportdata = new FormImport();
    console.log(this.selection.selected);
    for(let tf=0;tf<this.selection.selected.length;tf++){
      let sourceFormId = this.selection.selected[tf]["form_id"];
      this.formImportdata.source_form_ids_sepearated_by_comma.push(sourceFormId);
      let uuid = this.uuidService.generateUUID();
      this.formImportdata.destination_form_ids.push(uuid);
    }
    console.log(this.formImportdata);
    // this.selection.selected.forEach(item => {
    //   this.formImportdata.source_form_ids_sepearated_by_comma.push(item["form_id"]);
    //   this.formImportdata.destination_form_ids.push(this.su.user_id + "-" + uuidv1().toUpperCase() + "-" + this.date);
    // })
    if (this.formImportdata.hasValues()) {
      this.slider = true;
      let createdDate = new Date().toISOString();
      this.btnDisabled = true;
      this.formImportdata.user_id = this.su.user_id;
      this.formImportdata.created_date = createdDate;
      this.formImportdata.last_updated_date = createdDate;
      this.formImportdata.updated_by_userid = this.su.user_id.toString();
      this.formImportdata.sync_version_uuid = "0";
      this.formImportdata.destination_project_id = this.encrptdecrpt.getItem("projectIdlocal");
      console.log(this.formImportdata);
      
      this.formlistservice.importForms1(this.formImportdata).subscribe((res) => {
        console.log(res);
        this.formlistservice.filter("Register Click");
        this.slider = false;
        this.router.navigate(["/formbuilder/formlist"]);
      },
        (error) => {
          this.slider = false;
          this.btnDisabled = false;
        });
    } else {

    }


    // this.btnDisabled = true;
    // this.formlistservice
    //   .importForms(uuidImportFormIds, this.importFormIds)
    //   .subscribe((res) => {
    //     this.formlistservice.filter("Register Click");
    //     this.slider = false;
    //     this.router.navigate(["/formbuilder/formlist"]);
    //   });
  }
  
  addFormProject() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(AddformsComponent, {
      width: "380px",
      data: { projectId: this.projectId },
    });
  }
 
  errorMessage() {
    this._snackBar.open('Please select less than 50 forms to import', null,
      {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
  }
}
