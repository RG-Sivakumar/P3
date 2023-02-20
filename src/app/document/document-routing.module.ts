import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DatePipe } from "@angular/common";
import { CreatedocumentComponent } from "./createdocument/createdocument.component";
import { SwipecheckComponent } from "./swipecheck/swipecheck.component";
import { SettingPageComponent } from "./setting-page/setting-page.component";
import { PreviewimageComponent } from "./createdocument/previewimage/previewimage.component";
import { AuthenticationGuard } from "../authentication.guard";
import { AnnotationViewComponent } from "./annotation-view/annotation-view.component";
const routes: Routes = [
  { path: "documentview", component: CreatedocumentComponent, canActivate: [AuthenticationGuard] },
  { path: "settingView", component: SettingPageComponent, canActivate: [AuthenticationGuard] },
  { path: "swipecheck", component: SwipecheckComponent, canActivate: [AuthenticationGuard] },
  { path: "previewImage", component: PreviewimageComponent, canActivate: [AuthenticationGuard] },
  { path: "annotationView", component: AnnotationViewComponent, canActivate: [AuthenticationGuard] }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class documentRoutingModule { }
