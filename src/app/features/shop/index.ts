import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: '',
        title: CustomTitleResolver,
        data: { titleKey: 'shop.shop'},
        loadComponent: async () => (await import('./home/home.component')).ShopHomeComponent,
    },
    {
        path: 'detail/:id',
        title: CustomTitleResolver,
        data: { titleKey: 'shop.product'},
        loadComponent: async () => (await import('./detail/detail.component')).ProductDetailComponent,
    }
];
