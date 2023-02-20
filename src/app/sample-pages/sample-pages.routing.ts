import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';

export const SamplePagesRoutes: Routes = [
  {
    path: '',
    children: [
      
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Profile',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Profile Page' }
          ]
        }
      },
      
    ]
  }
];
