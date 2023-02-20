import { Routes } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
export const AppsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'chat',
                component: ChatComponent,
                data: {
                    title: '',
                    urls: [

                    ]
                }
            },
            
        ]
    }
];
