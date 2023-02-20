import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";

import { MatRippleModule } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { DndModule } from "ngx-drag-drop";
import { FormbuilderRoutingModule } from "./formbuilder-routing.module";
import { FormbuilderComponent } from "./formbuilder/formbuilder.component";
import { FormdesignComponent } from "./formdesign/formdesign.component";
import { FormdataService } from "./services/formdata.service";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormlistComponent } from "./formlist/formlist.component";
import { MatTableModule } from "@angular/material/table";
import { MenucomponentComponent } from "./formlist/menucomponent/menucomponent.component";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
// import { MoreinformationComponent } from "./moreinformation/moreinformation.component";
import { AddformsComponent } from "./addforms/addforms.component";
import { DatePipe } from "@angular/common";
import { DuplicateComponent } from "./addforms/duplicate/duplicate.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { DeleteformComponent } from "./deleteform/deleteform.component";
import { DuplicateelementComponent } from "./duplicateelement/duplicateelement.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ImportFormsComponent } from "./formlist/import-forms/import-forms.component";
import { MorecomponemtComponent } from "./formlist/morecomponemt/morecomponemt.component";

import { FormduplicatetableComponent } from "./formlist/formduplicatetable/formduplicatetable.component";
import { NumberFieldComponent } from "./number-field/number-field.component";
import { InputTrimModule } from "ng2-trim-directive";
import { ProjectDashboardModule } from "../project-dashboard/project-dashboard.module";
import { ResizableModule } from "angular-resizable-element";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { OptiondeleteComponent } from "./formbuilder/optiondelete/optiondelete.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from "@angular/material/input";
import { FormsupportComponent } from './formsupport/formsupport.component';
import { ExitconfirmComponent } from './exitconfirm/exitconfirm.component';
// import { LongPressModule } from "ngx-long-press";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonsharedModule } from "../commonshared/commonshared.module";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [
    FormbuilderComponent,
    FormdesignComponent,
    FormlistComponent,
    MenucomponentComponent,
    AddformsComponent,
    DuplicateComponent,
    DeleteformComponent,
    DuplicateelementComponent,
    ImportFormsComponent,
    MorecomponemtComponent,
    FormduplicatetableComponent,
    NumberFieldComponent,
    OptiondeleteComponent,
    FormsupportComponent,
    ExitconfirmComponent,
  ],
  imports: [
    MatSliderModule,
    MatRippleModule,
    InputTrimModule,
    MatTooltipModule,
    CommonModule,
    NgbModule,
    FormbuilderRoutingModule,
    DndModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ProjectDashboardModule,
    ResizableModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatInputModule,
    // LongPressModule,
    DragDropModule,
    CommonsharedModule
  ],
  entryComponents: [
    MenucomponentComponent,
    AddformsComponent,
  ],
  providers: [FormdataService, DatePipe, MatDatepickerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [FormsModule],
})
export class FormbuilderModule { }
// export class ProjectDashboardModule {}
