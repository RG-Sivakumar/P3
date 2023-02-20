import { Routes } from '@angular/router';

import { BasicComponent } from './basic/basic.component';
import { CustomComponent } from './custom/custom.component';
export const CardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basiccards',
        component: BasicComponent,
        data: {
          title: 'Basic Cards',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Basic Cards' }
          ]
        }
      },
      {
        path: 'customcards',
        component: CustomComponent,
        data: {
          title: 'Custom Cards',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Custom Cards' }
          ]
        }
      },
      {
        path: 'weathercards',
        data: {
          title: 'Weather Cards',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Weather Cards' }
          ]
        }
      }
    ]
  }
];
