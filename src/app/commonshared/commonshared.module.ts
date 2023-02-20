import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsharedRoutingModule } from './commonshared-routing.module';
import { TimberformComponent } from './components/timberform/timberform.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { DragDropDirective } from './directives/drag-drop.directive';
import { SpecialcharaterDirective } from './directives/specialcharater.directive';
import { P3dateformatDirective } from './directives/p3dateformat.directive';


@NgModule({
  declarations: [TimberformComponent,DragDropDirective, SpecialcharaterDirective, P3dateformatDirective],
  imports: [
    CommonModule,
    CommonsharedRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[TimberformComponent,DragDropDirective,SpecialcharaterDirective]
})
export class CommonsharedModule { }
