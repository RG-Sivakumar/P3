import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import {MatTooltipModule} from '@angular/material/tooltip';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";
import { ProjectDashboardRoutingModule } from "./project-dashboard-routing.module";
import { MyProjectComponent } from "./my-project/my-project.component";
import { RecentProjectComponent } from "./recent-project/recent-project.component";
import { FavoriteProjectComponent } from "./favorite-project/favorite-project.component";
import { HiddenProjectComponent } from "./hidden-project/hidden-project.component";
import { MatTableModule } from "@angular/material/table";
import { CreateProjectComponent } from "./create-project/create-project.component";
import { FormsModule } from "@angular/forms";
import { MenuComponent } from "./menu/menu.component";
import { RenameProjectComponent } from "./rename-project/rename-project.component";
import { ProjectInformationComponent } from "./project-information/project-information.component";
import { TagsDetailsComponent } from "./tags-details/tags-details.component";
import { ManageUserComponent } from "./manage-user/manage-user.component";
import { MatInputModule } from "@angular/material/input";
import { SupportOptionComponent } from "./support-option/support-option.component";
import { UserGuideComponent } from "./support-option/user-guide/user-guide.component";
import { SupportRequestComponent } from "./support-option/support-request/support-request.component";
import { FaqComponent } from "./support-option/faq/faq.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { AboutUsComponent } from "./about-us/about-us.component";
// import { MatSortModule } from "@angular/material/sort";
import { DatePipe } from "@angular/common";
import { FormdataService } from "../formbuilder/services/formdata.service";
import { TutorialTipsComponent } from "./support-option/tutorial-tips/tutorial-tips.component";
import { InputTrimModule } from "ng2-trim-directive";
import { ProjectLoaderComponent } from "./project-loader/project-loader.component";
import { ConfirmpopupComponent } from './support-option/confirmpopup/confirmpopup.component';
import { SuccessMessageComponent } from './manage-user/success-message/success-message.component';
import { EditPermissionPopupComponent } from './edit-permission-popup/edit-permission-popup.component';
// import { LongPressModule } from 'ngx-long-press';

import { ManageUserInitComponent } from './manage-user-init/manage-user-init.component';
import { ImageDisplyTestComponent } from './image-disply-test/image-disply-test.component';
import { AttachmentfileComponent } from './attachmentfile/attachmentfile.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonsharedModule } from "../commonshared/commonshared.module";
import { NgxFileDropModule } from 'ngx-file-drop';


@NgModule({
  declarations: [
    MyProjectComponent,
    RecentProjectComponent,
    FavoriteProjectComponent,
    HiddenProjectComponent,
    CreateProjectComponent,
    MenuComponent,
    RenameProjectComponent,
    ProjectInformationComponent,
    TagsDetailsComponent,
    ManageUserComponent,
    SupportOptionComponent,
    UserGuideComponent,
    SupportRequestComponent,
    FaqComponent,
    AboutUsComponent,
    TutorialTipsComponent,
    ProjectLoaderComponent,
    ConfirmpopupComponent,
    SuccessMessageComponent,
    EditPermissionPopupComponent,
    ManageUserInitComponent,
    ImageDisplyTestComponent,
    AttachmentfileComponent,
  ],

  imports: [
    HttpClientModule,
    CommonModule,
    ProjectDashboardRoutingModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    MatInputModule,
    MatExpansionModule,
    InputTrimModule,
    // LongPressModule,
    DragDropModule,
    CommonsharedModule,
    NgxFileDropModule
    // MatSortModule,
    // NgEventBus
  ],

  providers: [DatePipe, FormdataService],

  entryComponents: [CreateProjectComponent, RenameProjectComponent, 
    SuccessMessageComponent, EditPermissionPopupComponent,AttachmentfileComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [
    SupportOptionComponent,
    TutorialTipsComponent,
    FaqComponent,
    SupportRequestComponent,
    UserGuideComponent,
  ],
})
export class ProjectDashboardModule { }
