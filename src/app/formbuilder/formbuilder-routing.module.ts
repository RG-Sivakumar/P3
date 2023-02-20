import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormbuilderComponent } from './formbuilder/formbuilder.component';
import { FormdesignComponent } from './formdesign/formdesign.component';
import { FormlistComponent } from './formlist/formlist.component';
import { ImportFormsComponent } from './formlist/import-forms/import-forms.component';
import { DuplicatetableComponent } from '../projects/duplicatetable/duplicatetable.component';
import { FormduplicatetableComponent } from './formlist/formduplicatetable/formduplicatetable.component';
import { FormsupportComponent } from './formsupport/formsupport.component';


const routes: Routes = [
  { path: 'formEdit', component: FormbuilderComponent },
  { path: 'formdesign', component: FormdesignComponent },
  { path: 'formlist', component: FormlistComponent },
  { path: 'import-form', component: ImportFormsComponent },
  { path: 'duplicate', component: FormduplicatetableComponent },
  { path: 'formSupport', component: FormsupportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormbuilderRoutingModule { }
