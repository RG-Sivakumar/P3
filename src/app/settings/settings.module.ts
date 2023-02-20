import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { FormsModule } from '@angular/forms';
import { SecurityComponent } from './security/security.component';
import { FAQComponent } from './faq/faq.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { SyncComponent } from './sync/sync.component';
import { ProfilePopupComponent } from './my-profile/profile-popup/profile-popup.component';




@NgModule({
  declarations: [MyProfileComponent, SecurityComponent, FAQComponent, TutorialComponent,SignOutComponent, SyncComponent, ProfilePopupComponent ],
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]  
})
export class SettingsModule { }
