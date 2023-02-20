import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';


import { SortFunctionRoutingModule } from './sort-function-routing.module';
import { StartSortComponent } from './start-sort/start-sort.component';
import { SortFunctionComponent } from './sort-function.component';
import { PageSortComponent } from './page-sort/page-sort.component';


@NgModule({
  declarations: [StartSortComponent,SortFunctionComponent, PageSortComponent],
  imports: [
    CommonModule,
    SortFunctionRoutingModule,
    MatDialogModule,
    BrowserModule
  ],
  entryComponents:[StartSortComponent,PageSortComponent]
})
export class SortFunctionModule { }
