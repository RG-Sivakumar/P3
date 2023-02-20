import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { UserloginComponent } from "./userlogin/userlogin.component";
import { TutorialComponent } from "./tutorial/tutorial.component";
import { AddNewUserComponent } from "./add-new-user/add-new-user.component";
import { AddExternalUserComponent } from "./add-external-user/add-external-user.component";
import { ResetpasswordComponent } from "./resetpassword/resetpassword.component";

const routes: Routes = [
  { path: "projectmanagement/login", component: UserloginComponent},
  { path: "projectmanagement/tutorial", component: TutorialComponent },
  { path: "projectmanagement/NewUser", component: AddNewUserComponent },
  {
    path: "projectmanagement/externalUser",
    component: AddExternalUserComponent,
  },
  {
    path: "projectmanagement/resetpassword",
    component: ResetpasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class ProjectmanagementRoutingModule {}
