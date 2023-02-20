import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ToolbarlistComponent } from "./toolbarlist/toolbarlist.component";
import { ToolbardesignComponent } from "./toolbardesign/toolbardesign.component";
import { ImportToolbarComponent } from "./toolbarlist/import-toolbar/import-toolbar.component";

import { DuplicateformComponent } from "./toolbarlist/toolbar-feature/duplicateform/duplicateform.component";
import { DatePipe } from "@angular/common";

const routes: Routes = [
  { path: "toolbarlist", component: ToolbarlistComponent },
  { path: "toolbardesign", component: ToolbardesignComponent },
  { path: "import-Toolbar", component: ImportToolbarComponent },

  { path: "duplicateform", component: DuplicateformComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class ToolbarRoutingModule {}
