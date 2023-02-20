import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainProjectComponent } from './main-project/main-project.component';
import { DuplicatetableComponent } from './duplicatetable/duplicatetable.component';
import { HiddenComponent } from './hidden/hidden.component';
import { DatePipe, } from '@angular/common';



const routes: Routes = [

  { path: 'mainproject', component: MainProjectComponent },
  { path: 'mainproject1', component: DuplicatetableComponent },
  { path: 'Hidden', component: HiddenComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe]
})
export class ProjectsRoutingModule { }
