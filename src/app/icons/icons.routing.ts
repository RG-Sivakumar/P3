import { Routes } from '@angular/router';
import { MaterialComponent } from './material/material.component';

export const IconsRoutes: Routes = [
  {
    path: '',
    children: [
      
      {
        path: 'material',
        component: MaterialComponent,
        data: {
          title: 'Material-Icon',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Material-Icon' }
          ]
        }
      }
    ]
  }
];
