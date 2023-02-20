import { Routes } from '@angular/router';

import { CenterComponent } from './center/center.component';

export const TimelineRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'center',
        component: CenterComponent,
        data: {
          title: 'Center Timeline',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Center Timeline' }
          ]
        }
      },
     
      
    ]
  }
];
