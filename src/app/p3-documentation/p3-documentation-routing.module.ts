import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChapterModelComponent } from './chapter-model/chapter-model.component';
import { Chapter1Component } from './p3-homepage/chapter1/chapter1.component';
import { Chapter10Component } from './p3-homepage/chapter10/chapter10.component';
import { Chapter11Component } from './p3-homepage/chapter11/chapter11.component';
import { Chapter12Component } from './p3-homepage/chapter12/chapter12.component';
import { Chapter2Component } from './p3-homepage/chapter2/chapter2.component';
import { Chapter3Component } from './p3-homepage/chapter3/chapter3.component';
import { Chapter4Component } from './p3-homepage/chapter4/chapter4.component';
import { Chapter5Component } from './p3-homepage/chapter5/chapter5.component';
import { Chapter6Component } from './p3-homepage/chapter6/chapter6.component';
import { Chapter7Component } from './p3-homepage/chapter7/chapter7.component';
import { Chapter8Component } from './p3-homepage/chapter8/chapter8.component';
import { Chapter9Component } from './p3-homepage/chapter9/chapter9.component';
import { P3HomepageComponent } from './p3-homepage/p3-homepage.component';
import { ErrorMessageComponent } from './user-invalid/error-message.component';



const routes: Routes = [
  {
    path:"userguide",
    component:ChapterModelComponent,
    children:[
    {
      path:'chapter-1', component:Chapter1Component
    },
    {
      path:'chapter-2', component:Chapter2Component
    },
    {
      path:'chapter-3', component:Chapter3Component
    },
    {
      path:'chapter-4', component:Chapter4Component
    },
    {
      path:'chapter-5', component:Chapter5Component
    },
    {
      path:'chapter-6', component:Chapter6Component
    },
    {
      path:'chapter-7', component:Chapter7Component
    },
    {
      path:'chapter-8', component:Chapter8Component
    },
    {
      path:'chapter-9', component:Chapter9Component
    },
    {
      path:'chapter-10', component:Chapter10Component
    },
    {
      path:'chapter-11', component:Chapter11Component
    },
    {
      path:'chapter-12', component:Chapter12Component
    },]
  },
  {
    path:'userguidehome', component:P3HomepageComponent
  },
  {
    path:'userInvalid',component:ErrorMessageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class P3DocumentationRoutingModule { }
