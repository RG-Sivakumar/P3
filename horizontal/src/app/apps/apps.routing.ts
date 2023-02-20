import { Routes } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { TicketsComponent } from './ticketlist/tickets.component';
import { TicketdetailsComponent } from './ticketdetails/ticketdetails.component';
import { TaskboardComponent } from './taskboard/taskboard.component';
import { FullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { TodosComponent } from './todos/todos.component';
import { NotesComponent } from './notes/notes.component';
import { ContactComponent } from './contact/contact.component';
import { ContactsComponent } from './contacts/contacts.component';

import { ListUsersComponent } from './users/list-users/list-users.component';
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
            {
                path: 'ticketlist',
                component: TicketsComponent,
                data: {
                    title: 'Ticket List',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Ticket List' }
                    ]
                }
            },
            {
                path: 'ticketdetails',
                component: TicketdetailsComponent,
                data: {
                    title: 'Ticket Details',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Ticket Details' }
                    ]
                }
            },
            {
                path: 'taskboard',
                component: TaskboardComponent,
                data: {
                    title: 'Taskboard',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Taskboard' }
                    ]
                }
            },
            {
                path: 'fullcalendar',
                component: FullcalendarComponent,
                data: {
                    title: 'Full-Calendar',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Full-Calendar' }
                    ]
                }
            },
            {
                path: 'todo',
                component: TodosComponent,
                data: {
                    title: '',
                    urls: [

                    ]
                }
            },
            {
                path: 'notes',
                component: NotesComponent,
                data: {
                    title: '',
                    urls: [

                    ]
                }
            },
            {
                path: 'users',
                component: ListUsersComponent,
                data: {
                    title: 'Users App',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Users App' }
                    ]
                }
            },
            {
                path: 'contact-grid',
                component: ContactComponent,
                data: {
                    title: 'Contact Grid',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Contact Grid' }
                    ]
                }
            },
            {
                path: 'contact',
                component: ContactsComponent,
                data: {
                    title: '',
                    urls: [

                    ]
                }
            }
        ]
    }
];
