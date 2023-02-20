import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataserviceService } from '../services/dataservice.service';

@Component({
  selector: 'app-clayeralert',
  templateUrl: './clayeralert.component.html',
  styleUrls: ['./clayeralert.component.css']
})
export class ClayeralertComponent implements OnInit {

  constructor(public dataService: DataserviceService,public dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data?:any) { 
   console.log(data) 
  }

  ngOnInit(): void {
  }
  
  onClose(purpose?){
    debugger
    if(purpose != 'exit' &&  this.data.delete != undefined && this.data.delete == true){
        this.dataService.removeGroup.emit(this.data.id);
    }
    this.dialog.closeAll()
  }
}
