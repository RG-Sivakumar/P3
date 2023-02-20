import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsRoutes } from './cards.routing';
import { BasicComponent } from './basic/basic.component';
import { CustomComponent } from './custom/custom.component';

@NgModule({
  imports: [RouterModule.forChild(CardsRoutes)],
  declarations: [BasicComponent, CustomComponent]
})
export class CardsModule {}
