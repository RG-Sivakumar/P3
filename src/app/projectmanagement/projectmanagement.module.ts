import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserloginComponent } from "./userlogin/userlogin.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { DeviceDetectorModule } from "ngx-device-detector";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoginService } from "./services/login.service";
import { ForgotpasswordComponent } from "./forgotpassword/forgotpassword.component";
import { MatDialogModule } from "@angular/material/dialog";
import { TutorialComponent } from "./tutorial/tutorial.component";
import { AddNewUserComponent } from "./add-new-user/add-new-user.component";
import { AddExternalUserComponent } from "./add-external-user/add-external-user.component";
import { ResetpasswordComponent } from "./resetpassword/resetpassword.component";
import { MatIconModule } from "@angular/material/icon";
import { ConfirmpopupComponent } from './forgotpassword/confirmpopup/confirmpopup.component';
import { ExternaluserpopupComponent } from "./externaluserpopup/externaluserpopup.component";

@NgModule({
  declarations: [
    UserloginComponent,
    ForgotpasswordComponent,
    TutorialComponent,
    AddNewUserComponent,
    AddExternalUserComponent,
    ResetpasswordComponent,
    ConfirmpopupComponent,
    ExternaluserpopupComponent,
  ],
  imports: [
    MatIconModule,
    NgbModule,
    CommonModule,
    FormsModule,
    DeviceDetectorModule.forRoot(),
    MatDialogModule,
  ],
  providers: [LoginService],
})
export class ProjectmanagementModule {}
