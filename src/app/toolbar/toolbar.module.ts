import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatePipe } from "@angular/common";
import { NgpSortModule } from "ngp-sort-pipe";
import { ToolbarRoutingModule } from "./toolbar-routing.module";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatTableModule } from "@angular/material/table";
import { CdkTableModule } from "@angular/cdk/table";
import { MatDialogModule } from "@angular/material/dialog";
import { ToolbarlistComponent } from "./toolbarlist/toolbarlist.component";
import { ToolbarFeatureComponent } from "./toolbarlist/toolbar-feature/toolbar-feature.component";
import { MoreOptionComponent } from "./toolbarlist/more-option/more-option.component";
// import { MoreInformationComponent } from "./toolbarlist/more-information/more-information.component";
import { ToolbardesignComponent } from "./toolbardesign/toolbardesign.component";
import { ImportToolbarComponent } from "./toolbarlist/import-toolbar/import-toolbar.component";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { DndModule } from "ngx-drag-drop";

import { CopyformsComponent } from "./toolbarlist/copyforms/copyforms.component";
import { ToolbarlistService } from "./services/toolbarlist.service";

import { MoreComponent } from "./toolbarlist/more/more.component";
import { AddformComponent } from "./toolbardesign/addform/addform.component";
import { CopyformelementComponent } from "./toolbardesign/copyformelement/copyformelement.component";

import { DeleteToolbarComponent } from "./toolbardesign/delete-toolbar/delete-toolbar.component";
import { DuplicateToolbarComponent } from "./toolbardesign/duplicate-toolbar/duplicate-toolbar.component";
import { FormdataService } from "../formbuilder/services/formdata.service";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PreviewToolbarComponent } from "./toolbardesign/preview-toolbar/preview-toolbar.component";
import { DuplicateformComponent } from "./toolbarlist/toolbar-feature/duplicateform/duplicateform.component";
import { InputTrimModule } from "ng2-trim-directive";
import { ProjectDashboardModule } from "../project-dashboard/project-dashboard.module";
import { MatSliderModule } from '@angular/material/slider';
import { ToolbarexitconfirmComponent } from './toolbardesign/toolbarexitconfirm/toolbarexitconfirm.component';
// import { LongPressModule } from "ngx-long-press";
import { DragDropModule } from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { CommonsharedModule } from "../commonshared/commonshared.module";
import { TooltipModule } from "@swimlane/ngx-charts";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ToolbarlistComponent,
    ToolbarFeatureComponent,
    MoreOptionComponent,
    ToolbardesignComponent,
    CopyformsComponent,
    ImportToolbarComponent,
    MoreComponent,
    AddformComponent,
    CopyformelementComponent,

    DeleteToolbarComponent,
    DuplicateToolbarComponent,
    PreviewToolbarComponent,
    DuplicateformComponent,
    ToolbarexitconfirmComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    ToolbarRoutingModule,
    FormsModule,
    MatTableModule,
    CdkTableModule,
    MatDialogModule,
    DndModule,
    NgbModule,
    InputTrimModule,
    ProjectDashboardModule, MatSliderModule,
    // LongPressModule,
    MatDatepickerModule,
    DragDropModule,
    ScrollingModule,
    NgpSortModule,
    CommonsharedModule,
    TooltipModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ToolbarFeatureComponent,
    MoreOptionComponent,
    CopyformsComponent,
    DeleteToolbarComponent,
    DuplicateToolbarComponent,
    CopyformelementComponent,
    MoreComponent,
  ],
  providers: [ToolbarlistService, DatePipe, FormdataService, MatDatepickerModule],
  exports: [FormsModule, MoreOptionComponent,ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToolbarModule { }
