import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectsRoutingModule } from "./projects-routing.module";
import { MatDialogModule } from "@angular/material/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MainProjectComponent } from "./main-project/main-project.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTreeModule } from "@angular/material/tree";
import { DuplicatetableComponent } from "./duplicatetable/duplicatetable.component";
import { AddProjectComponent } from "./add-project/add-project.component";
import { AddContentComponent } from "./add-content/add-content.component";
import { FolderMoreComponent } from "./folder-more/folder-more.component";
import { SelectfolderComponent } from "./selectfolder/selectfolder.component";
import { SelectFolderComponent } from "./select-folder/select-folder.component";
import { AddFileComponent } from "./add-file/add-file.component";
import { FieldsheetComponent } from "./fieldsheet/fieldsheet.component";
import { FieldselectfolderComponent } from "./fieldselectfolder/fieldselectfolder.component";
import { GoogleDriveComponent } from "./google-drive/google-drive.component";
import { ManagetagsComponent } from "./managetags/managetags.component";
import { MoreInformationComponent } from "./more-information/more-information.component";
import { HiddenComponent } from "./hidden/hidden.component";
import { DocumentMoreComponent } from "./document-more/document-more.component";
import { DatePipe } from "@angular/common";
import { HiddenlistsComponent } from "./hidden/hiddenlists/hiddenlists.component";
import { RmcomponentComponent } from "./hidden/rmcomponent/rmcomponent.component";
import { HiddenlistComponent } from "./hidden/hiddenlist/hiddenlist.component";
import { RenametoolbarhiddenComponent } from "./hidden/renametoolbarhidden/renametoolbarhidden.component";
import { ManagehiddenformtagComponent } from "./hidden/hiddenlists/managehiddenformtag/managehiddenformtag.component";
import { ManagehiddentoolbartagComponent } from "./hidden/managehiddentoolbartag/managehiddentoolbartag.component";
import { InputTrimModule } from "ng2-trim-directive";
import { GrandLoaderComponent } from './grand-loader/grand-loader.component';
import { ToolbarhiddenComponent } from './hidden/toolbarhidden/toolbarhidden.component';
import { FormsMorePopupComponent } from './hidden/forms-more-popup/forms-more-popup.component';
import { AlertPermissionComponent } from './alert-permission/alert-permission.component';
import { DisableDirective } from "../document/disable.directive";
import { AddStubsComponent } from './add-stubs/add-stubs.component';
// import { LongPressModule } from "ngx-long-press";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {AccordionModule} from "ngx-accordion";
import { NgpSortModule } from "ngp-sort-pipe";
import { UploadcompleteComponent } from './uploadcomplete/uploadcomplete.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CommonsharedModule } from "../commonshared/commonshared.module";
import { NgxFileDropModule } from "ngx-file-drop";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CopyDocumentAnotherProjectComponent } from './copy-document-another-project/copy-document-another-project.component';
import { Ng2SearchPipeModule } from "ng2-search-filter";

@NgModule({
  declarations: [
    MainProjectComponent,
    DuplicatetableComponent,
    AddProjectComponent,
    AddContentComponent,
    FolderMoreComponent,
    SelectfolderComponent,
    SelectFolderComponent,
    AddFileComponent,
    FieldsheetComponent,
    FieldselectfolderComponent,
    GoogleDriveComponent,
    ManagetagsComponent,
    MoreInformationComponent,
    HiddenComponent,
    DocumentMoreComponent,
    HiddenlistsComponent,
    RmcomponentComponent,
    HiddenlistComponent,
    RenametoolbarhiddenComponent,
    ManagehiddenformtagComponent,
    ManagehiddentoolbartagComponent,
    GrandLoaderComponent,
    ToolbarhiddenComponent,
    FormsMorePopupComponent,
    AlertPermissionComponent,
    AddStubsComponent,
    UploadcompleteComponent,
    CopyDocumentAnotherProjectComponent
  ],
  imports: [
    CommonModule,
    NgpSortModule,
    AccordionModule,
    ProjectsRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTreeModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    InputTrimModule,
    // LongPressModule,
    PdfViewerModule,
    DragDropModule,
    MatSlideToggleModule,
    CommonsharedModule,
    NgxFileDropModule,
    MatTooltipModule,
    Ng2SearchPipeModule
  ],
  entryComponents: [
    AddProjectComponent,
    AddContentComponent,
    FolderMoreComponent,
    SelectfolderComponent,
    SelectFolderComponent,
    AddFileComponent,
    FieldsheetComponent,
    FieldselectfolderComponent,
    GoogleDriveComponent,
    ManagetagsComponent,
    MoreInformationComponent,
    DocumentMoreComponent,
    ToolbarhiddenComponent,
    FormsMorePopupComponent,
    AddStubsComponent,
  ],
  providers: [DatePipe],
  exports: [FormsModule],
})
export class ProjectsModule { }
