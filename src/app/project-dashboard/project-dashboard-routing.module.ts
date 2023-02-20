import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyProjectComponent } from "./my-project/my-project.component";
import { RecentProjectComponent } from "./recent-project/recent-project.component";
import { FavoriteProjectComponent } from "./favorite-project/favorite-project.component";
import { HiddenProjectComponent } from "./hidden-project/hidden-project.component";
import { SupportOptionComponent } from "./support-option/support-option.component";
import { UserGuideComponent } from "./support-option/user-guide/user-guide.component";
import { SupportRequestComponent } from "./support-option/support-request/support-request.component";
import { FaqComponent } from "./support-option/faq/faq.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { TutorialTipsComponent } from "./support-option/tutorial-tips/tutorial-tips.component";
import { ManageUserInitComponent } from "./manage-user-init/manage-user-init.component";
import { ImageDisplyTestComponent } from "./image-disply-test/image-disply-test.component";


const routes: Routes = [
  { path: "myproject", component: MyProjectComponent },
  { path: "manageuser", component: ManageUserInitComponent },
  { path: "recentproject", component: RecentProjectComponent },
  { path: "favoriteproject", component: FavoriteProjectComponent },
  { path: "hiddenproject", component: HiddenProjectComponent },
  { path: "imgTest", component: ImageDisplyTestComponent },

  {
    path: "support", component: SupportOptionComponent,
    children: [
      { path: "user-support", component: UserGuideComponent },
      { path: "tutorialTips", component: TutorialTipsComponent },
      { path: "submitRequest", component: SupportRequestComponent },
      { path: "Faq", component: FaqComponent },
    ]
  },
  { path: "About", component: AboutUsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectDashboardRoutingModule { }
