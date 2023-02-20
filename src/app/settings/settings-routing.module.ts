import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SecurityComponent } from './security/security.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { SyncComponent } from './sync/sync.component';
import { SignoutComponent } from '../shared/sidebar/signout/signout.component';


const routes: Routes = [
  {path:'my-profile',component:MyProfileComponent},
  {path:'security',component:SecurityComponent},
  {path:'signout'},
  {path:'tutorial',component:TutorialComponent},
  {path:'sync',component:SyncComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
