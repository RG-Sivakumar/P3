import { NgModule, Injectable } from "@angular/core";
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import * as Hammer from 'hammerjs';
import { CommonModule } from "@angular/common";
import { documentRoutingModule } from "./document-routing.module";
import { CreatedocumentComponent } from "./createdocument/createdocument.component";
import { SwitchToolbarComponent } from "./switch-toolbar/switch-toolbar.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { SwipecheckComponent } from "./swipecheck/swipecheck.component";
import { SettingPageComponent } from "./setting-page/setting-page.component";

import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { LayersPageComponent } from "./layers-page/layers-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DocumentswitchpageComponent } from "./moreoption/documentswitchpage/documentswitchpage.component";
import { DocumentManagetagComponent } from "./moreoption/document-managetag/document-managetag.component";
import { Ng2PanZoomModule } from "ng2-panzoom";
import { SlidenavComponent } from "./createdocument/slidenav/slidenav.component";
import { SwitchFormComponent } from "./switch-form/switch-form.component";
import { MediaComponent } from "./media/media.component";
import { MatInputModule } from '@angular/material/input';
import { StubphotosComponent } from "./media/stubphotos/stubphotos.component";
import { PropertiesComponent } from "./properties/properties.component";
import { MetadataComponent } from "./metadata/metadata.component";
import { AnnotationMenuComponent } from "./createdocument/annotation-menu/annotation-menu.component";
import { AnnotationDeleteComponent } from "./createdocument/annotation-delete/annotation-delete.component";
import { PreviewimageComponent } from "./createdocument/previewimage/previewimage.component";
import { AddLinksOptionComponent } from "./createdocument/add-links-option/add-links-option.component";
import { LinkOptionMenuComponent } from "./createdocument/link-option-menu/link-option-menu.component";
import { LinksToDocumentComponent } from "./createdocument/add-links-option/links-to-document/links-to-document.component";
import { DocumentPagesComponent } from "./createdocument/add-links-option/links-to-document/document-pages/document-pages.component";
import { LinkApiPageComponent } from "./createdocument/add-links-option/links-to-document/document-pages/link-api-page/link-api-page.component";
import { LinkToUrlComponent } from "./createdocument/add-links-option/link-to-url/link-to-url.component";
import { MediamenuComponent } from "./createdocument/mediamenu/mediamenu.component";
import { RenamemediaComponent } from "./createdocument/mediamenu/renamemedia/renamemedia.component";
import { TagmediaComponent } from "./createdocument/mediamenu/tagmedia/tagmedia.component";
import { DeletemediaComponent } from "./createdocument/mediamenu/deletemedia/deletemedia.component";
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import {
  SwiperModule,
  SwiperConfigInterface,
  SWIPER_CONFIG,
} from "ngx-swiper-wrapper";
import { MatTableModule } from "@angular/material/table";
import { ImagetostubComponent } from "./createdocument/mediamenu/imagetostub/imagetostub.component";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InputTrimModule } from "ng2-trim-directive";
import { UseasnewtoolbarComponent } from "./createdocument/annotation-menu/useasnewtoolbar/useasnewtoolbar.component";
import { AddasnewtoolbarComponent } from "./createdocument/annotation-menu/addasnewtoolbar/addasnewtoolbar.component";
import { AddtotoolbarstampComponent } from "./createdocument/annotation-menu/addtotoolbarstamp/addtotoolbarstamp.component";
import { SearchpageComponent } from "./createdocument/searchpage/searchpage.component";
import { TextAnnotationComponent } from "./createdocument/text-annotation/text-annotation.component";
import { AddasnewdocumentComponent } from "./createdocument/previewimage/addasnewdocument/addasnewdocument.component";
import { ResizableDirective } from "../resizable.directive";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DisableDirective } from "./disable.directive";
import { ClickColorDirective } from "../click-color.directive";
import { DatePipe } from "@angular/common";
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragScrollModule } from 'ngx-drag-scroll';
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  observer: true,
  direction: "horizontal",
  threshold: 50,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: true,
};
import { PinchZoomModule } from "ngx-pinch-zoom";
import { NumberDirective } from "../numbers-only.directive";
import { DocumentrenameComponent } from "./moreoption/documentrename/documentrename.component";
import { ShareOptionComponent } from './createdocument/share-option/share-option.component';
import { FiltertoolbarComponent } from "./moreoption/filtertoolbar/filtertoolbar.component";
import { DraggableDirective } from "./createdocument/draggable.directive";
import { DroppableDirective } from "./createdocument/droppable.directive";
import { DragService } from "./createdocument/draggable.service";
import { SelectFolderAnnotateComponent } from './createdocument/previewimage/select-folder-annotate/select-folder-annotate.component';
import { MatTreeModule } from '@angular/material/tree';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from "./revisitArea";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatBadgeModule } from '@angular/material/badge';
import { AnnotationViewComponent } from './annotation-view/annotation-view.component';
import { ZoomTestComponent } from './zoom-test/zoom-test.component';

import { AddMultipleImagesComponent } from './createdocument/add-multiple-images/add-multiple-images.component';
import { RefreshWindowComponent } from './createdocument/previewimage/refresh-window/refresh-window.component';
import { NgxPrintModule } from 'ngx-print';
import { PreviewimagedownloadpopupComponent } from './createdocument/previewimage/previewimagedownloadpopup/previewimagedownloadpopup.component';
import { Shareoption1Component } from './shareoption1/shareoption1.component';
import { AlertmessageComponent } from './alertmessage/alertmessage.component';
import { SuccessAutoCADComponent } from "./createdocument/share-option/success-auto-cad/success-auto-cad.component";
import { ClayeralertComponent } from './clayeralert/clayeralert.component';
import { SetBaseIconsizeComponent } from "./set-base-iconsize/set-base-iconsize.component";
import { SuccessComponent } from './success/success.component';
import { RemainderPopupComponent } from './createdocument/remainder-popup/remainder-popup.component';
import { AttributeconfromComponent } from './createdocument/remainder-popup/attributeconfrom/attributeconfrom.component';
import { CommonsharedModule } from "../commonshared/commonshared.module";
import { NgxFileDropModule } from "ngx-file-drop";
import { WarningrotateresizeComponent } from "./createdocument/warningrotateresize/warningrotateresize.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ImportAutocadComponent } from './createdocument/share-option/import-autocad/import-autocad.component';
import { GroupAnntsFormsComponent } from './createdocument/group-annts-forms/group-annts-forms.component';
import { FormlistpopupComponent } from './formlistpopup/formlistpopup.component';

// { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}
@NgModule({
  declarations: [
    ResizableDirective,
    FormlistpopupComponent,
    CreatedocumentComponent,
    SwitchToolbarComponent,
    SwipecheckComponent,
    SettingPageComponent,
    LayersPageComponent,
    DocumentswitchpageComponent,
    DocumentManagetagComponent,
    SlidenavComponent,
    SwitchFormComponent,
    MediaComponent,
    StubphotosComponent,
    PropertiesComponent,
    MetadataComponent,
    AnnotationMenuComponent,
    AnnotationDeleteComponent,
    PreviewimageComponent,
    AddLinksOptionComponent,
    LinksToDocumentComponent,
    DocumentPagesComponent,
    LinkApiPageComponent,
    LinkOptionMenuComponent,
    LinkToUrlComponent,
    MediamenuComponent,
    RenamemediaComponent,
    TagmediaComponent,
    DeletemediaComponent,
    ClickColorDirective,
    ImagetostubComponent,
    UseasnewtoolbarComponent,
    AddasnewtoolbarComponent,
    AddtotoolbarstampComponent,
    SetBaseIconsizeComponent,
    SearchpageComponent,
    
    TextAnnotationComponent,
    AddasnewdocumentComponent,
    DocumentrenameComponent,
    NumberDirective,
    ShareOptionComponent,
    FiltertoolbarComponent,
    DroppableDirective,
    DraggableDirective,
    SelectFolderAnnotateComponent,
    AnnotationViewComponent,
    ZoomTestComponent,
    AddMultipleImagesComponent,
    RefreshWindowComponent,
    PreviewimagedownloadpopupComponent,
    Shareoption1Component,
    AlertmessageComponent,
    SuccessAutoCADComponent,
    ClayeralertComponent,
    SuccessComponent,
    RemainderPopupComponent,
    AttributeconfromComponent,
    WarningrotateresizeComponent,
    ProgressbarComponent,
    ImportAutocadComponent,
    GroupAnntsFormsComponent,
  
  ],
  imports: [
    NgxPrintModule,
    MatTableModule,
    Ng2SearchPipeModule,
    PinchZoomModule,
    DragDropModule,
    MatTooltipModule,
    CommonModule,
    documentRoutingModule,
    MatSidenavModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2PanZoomModule,
    MatCardModule,
    SwiperModule,
    InputTrimModule,
    MatIconModule,
    MatSnackBarModule,
    MatSliderModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    HammerModule,
    MatTreeModule,
    MatSlideToggleModule,
    PdfViewerModule,
    MatBadgeModule,
    CommonsharedModule,
    NgxFileDropModule,
    DragScrollModule,
    LazyLoadImageModule, 
    ScrollingModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  entryComponents: [
    ImportAutocadComponent,
    AnnotationMenuComponent,
    AnnotationDeleteComponent,
    AddLinksOptionComponent,
    LinksToDocumentComponent,
    DocumentPagesComponent,
    LinkApiPageComponent,
    LinkOptionMenuComponent,
    TextAnnotationComponent,
    DocumentrenameComponent,
    ShareOptionComponent,
    Shareoption1Component,
    FiltertoolbarComponent,
    RenamemediaComponent,
    SelectFolderAnnotateComponent,
    AddasnewdocumentComponent,
    SuccessAutoCADComponent,FormlistpopupComponent
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig
    },
    DatePipe,
    DragService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3500 } },
  ],
  exports: [CreatedocumentComponent, SetBaseIconsizeComponent,SwipecheckComponent,LayersPageComponent,
    AlertmessageComponent,SuccessComponent],
})
export class DocumentModule { }
