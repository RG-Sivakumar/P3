import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';


export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
     
      {
        path: 'signup',
        component: SignupComponent
      },

    ]
  }
];
