import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { P3DocumentationRoutingModule } from './p3-documentation-routing.module';
import { SupportHeaderComponent } from './support-header/support-header.component';
import { SupportFooterComponent } from './support-footer/support-footer.component';
import { Chapter1Component } from './p3-homepage/chapter1/chapter1.component';
import { Chapter2Component } from './p3-homepage/chapter2/chapter2.component';
import { Chapter3Component } from './p3-homepage/chapter3/chapter3.component';
import { Chapter4Component } from './p3-homepage/chapter4/chapter4.component';
import { Chapter5Component } from './p3-homepage/chapter5/chapter5.component';
import { Chapter6Component } from './p3-homepage/chapter6/chapter6.component';
import { Chapter7Component } from './p3-homepage/chapter7/chapter7.component';
import { Chapter8Component } from './p3-homepage/chapter8/chapter8.component';
import { Chapter9Component } from './p3-homepage/chapter9/chapter9.component';
import { Section1Component } from './section1/section1.component';
import { Section2Component } from './section2/section2.component';
import { ChapterModelComponent } from './chapter-model/chapter-model.component';
import { SupportSidebarComponent } from './support-sidebar/support-sidebar.component';
import { Section3Component } from './section3/section3.component';
import { Section4Component } from './section4/section4.component';
import { P3HomepageComponent } from './p3-homepage/p3-homepage.component';
import { ScrollToModule } from 'ng2-scroll-to';
import { Section6Component } from './section6/section6.component';
import { ErrorMessageComponent } from './user-invalid/error-message.component';
import { ImgDialogComponent } from './img-dialog/img-dialog.component';
import { ScrollCheckDirective } from './scroll-check.directive';
import { ScrollSpyService } from 'ngx-scrollspy';
import { Chapter10Component } from './p3-homepage/chapter10/chapter10.component';
import { Chapter11Component } from './p3-homepage/chapter11/chapter11.component';
import { Chapter12Component } from './p3-homepage/chapter12/chapter12.component';





@NgModule({
  declarations: [SupportHeaderComponent, SupportFooterComponent, Chapter1Component, Chapter2Component,
    Chapter3Component, Chapter4Component, Chapter5Component, Chapter6Component, Chapter7Component, Chapter8Component,
    Chapter9Component, Section1Component, ChapterModelComponent, SupportSidebarComponent, Section3Component,
    Section2Component, P3HomepageComponent, Section4Component, Section6Component, ErrorMessageComponent, ImgDialogComponent, ScrollCheckDirective, Chapter10Component, Chapter11Component, Chapter12Component,
  ],


  imports: [
    CommonModule,
    P3DocumentationRoutingModule,
    ScrollToModule.forRoot(),
  ],
  exports: [SupportHeaderComponent, SupportFooterComponent, Section1Component, SupportSidebarComponent,P3HomepageComponent],
  providers:[ScrollSpyService]
})
export class P3DocumentationModule { }
