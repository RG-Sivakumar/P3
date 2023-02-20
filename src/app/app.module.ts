import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { Routes, RouterModule, PreloadAllModules, RouteReuseStrategy } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AgmCoreModule } from "@agm/core";
import { DataTablesModule } from "angular-datatables";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import {A11yModule} from '@angular/cdk/a11y';
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { ToastrModule } from "ngx-toastr";
import { FullComponent } from "./layouts/full/full.component";
import { BlankComponent } from "./layouts/blank/blank.component";
import { NavigationComponent } from "./shared/header-navigation/navigation.component";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { Approutes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SpinnerComponent } from "./shared/spinner.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProjectmanagementRoutingModule } from "./projectmanagement/projectmanagement-routing.module";
import { DndModule } from "ngx-drag-drop";
import { LoaderComponent } from "./loader/loader.component";
import { DocumentModule } from "./document/document.module";
import { MatIconModule } from "@angular/material/icon";
import { InputTrimModule } from "ng2-trim-directive";
import { MainLoaderComponent } from "./main-loader/main-loader.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { AutoCapitalizeDirective } from "./autocapitalize.directive";
import { SearchService } from "./search.service";
import { CustomReuseStrategy } from "./reuseAvoid";
import { TitleCaseDirective } from "./formbuilder/duplicateelement/capital.directive";
import { AuthguardServiceService } from "./authguard-service.service";
import { ScrollToModule } from 'ng2-scroll-to';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { P3DocumentationModule } from "./p3-documentation/p3-documentation.module";
import { ProjectmanagementModule } from "./projectmanagement/projectmanagement.module";
import { RenameComponent } from "./formbuilder/rename/rename.component";
import { ManageformComponent } from "./formbuilder/manageform/manageform.component";
import { CreateToobarComponent } from "./toolbar/toolbarlist/create-toobar/create-toobar.component";
import { ManageTagComponent } from "./toolbar/toolbarlist/manage-tag/manage-tag.component";
import { CreateformsComponent } from "./formbuilder/addforms/createforms/createforms.component";
import { NoParentComponent } from "./projects/no-parent/no-parent.component";
import { SignoutComponent } from './shared/sidebar/signout/signout.component';
import { MoreInformationComponent } from "./toolbar/toolbarlist/more-information/more-information.component";
import { MoreinformationComponent } from "./formbuilder/moreinformation/moreinformation.component";
import { DisableDirective } from "./document/disable.directive";
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import { CommonsharedModule } from "./commonshared/commonshared.module";
import { LazyLoadImageDirective, LazyLoadImageModule } from "ng-lazyload-image";
import { NgCircleProgressModule } from 'ng-circle-progress';

// import {  } from "crypto-js"
 

// { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }

// import { NgxZendeskWebwidgetModule } from "ngx-zendesk-webwidget";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20,
};
@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    SidebarComponent,
    LoaderComponent,
    MainLoaderComponent,
    AutoCapitalizeDirective,
    TitleCaseDirective,
    RenameComponent,
    ManageformComponent,
    CreateToobarComponent,
    ManageTagComponent,
    CreateformsComponent,
    NoParentComponent,
    SignoutComponent,
    MoreInformationComponent,
    MoreinformationComponent,
    DisableDirective,
  ],
  imports: [
    // ProjectDashboardModule,
    // ProjectsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    ScrollToModule,
    PinchZoomModule,
    MatIconModule,
    DocumentModule,
    CommonModule,
    BrowserModule,
    DndModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    MatDialogModule,
    NgbModule,
    Ng2SearchPipeModule,
    RouterModule.forRoot(Approutes,{relativeLinkResolution:'legacy'}),
    PerfectScrollbarModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDoliAneRffQDyA7Ul9cDk3tLe7vaU4yP8",
    }),
    ProjectmanagementRoutingModule,
    InputTrimModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    P3DocumentationModule,
    ProjectmanagementModule,
    CommonsharedModule,
    LazyLoadImageModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
    // NgxZendeskWebwidgetModule,
  ],
  providers: [
    AuthguardServiceService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    SearchService,
  ],
  entryComponents:[SignoutComponent,MoreInformationComponent,MoreinformationComponent,LoaderComponent],
  exports: [AutoCapitalizeDirective, RenameComponent, ManageformComponent, CreateToobarComponent,
     ManageTagComponent, CreateformsComponent, NoParentComponent,DisableDirective],
  bootstrap: [AppComponent],
})
export class AppModule { }
