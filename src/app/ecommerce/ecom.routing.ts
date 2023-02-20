import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';

export const EcomRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'cart',
        data: {
          title: 'Cart',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Cart' }]
        }
      },
     
      {
        path: 'products',
        component: ProductComponent,
        data: {
          title: 'Products',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Products' }
          ]
        }
      }
    ]
  }
];
