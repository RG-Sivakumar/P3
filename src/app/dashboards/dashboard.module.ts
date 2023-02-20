import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChartsModule } from 'ng2-charts';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutes } from './dashboard.routing';
import { ChartistModule } from 'ng-chartist';

import { IncomeCounterComponent } from './dashboard-components/income-counter/income-counter.component';
import { ProjectComponent } from './dashboard-components/project/project.component';
import { RecentmessageComponent } from './dashboard-components/recent-message/recent-message.component';
import { TodoComponent } from './dashboard-components/to-do/todo.component';
import { PageAnalyzerComponent } from './dashboard-components/page-analyzer/pa.component';
import { WidgetComponent } from './dashboard-components/widget/widget.component';
import { CustomerSupportComponent } from './dashboard-components/customer-support/cs.component';
import { TotalEarningComponent } from './dashboard-components/total-earnings/te.component';
import { FeedsComponent } from './dashboard-components/feeds/feeds.component';

@NgModule({
  imports: [FormsModule, CommonModule, NgbModule, ChartsModule, ChartistModule, RouterModule.forChild(DashboardRoutes), PerfectScrollbarModule],
  declarations: [
    Dashboard1Component,
    IncomeCounterComponent,
    ProjectComponent,
    RecentmessageComponent,
    TodoComponent,
    PageAnalyzerComponent,
    WidgetComponent,
    CustomerSupportComponent,
    TotalEarningComponent,
    FeedsComponent,
  ]
})
export class DashboardModule {}
