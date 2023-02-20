import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TimelineRoutes } from './timeline.routing';
import { CenterComponent } from './center/center.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(TimelineRoutes)],
  declarations: [CenterComponent]
})
export class TimelineModule {}
