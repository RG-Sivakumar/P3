import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EcomRoutes } from './ecom.routing';
import { ProductComponent } from './product/product.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(EcomRoutes), FormsModule, NgbModule],
  declarations: [
    ProductComponent
  ]
})
export class EcomModule {}
