import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevAdminLoginComponent } from './dev-admin-login/dev-admin-login.component';
import{DevAdminDasboardComponent} from './dev-admin-dasboard/dev-admin-dasboard.component'
import { DevAdminPrepareComponent } from './dev-admin-dasboard/dev-admin-prepare/dev-admin-prepare.component';


const routes: Routes = [
  {path:'login',component:DevAdminLoginComponent},
  {path:'menu',component:DevAdminDasboardComponent},
  {path:'prepare',component:DevAdminPrepareComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevAdminRoutingModule { }
