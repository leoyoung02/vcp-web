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
        path: 'list/:id',
        title: CustomTitleResolver,
        data: { titleKey: 'shop.products'},
        loadComponent: async () => (await import('./list/list.component')).ShopListComponent,
    },
    {
        path: 'detail/:id',
        title: CustomTitleResolver,
        data: { titleKey: 'shop.product'},
        loadComponent: async () => (await import('./detail/detail.component')).ProductDetailComponent,
    },
    {
        path: 'cart',
        title: CustomTitleResolver,
        data: { titleKey: 'shop.product'},
        loadComponent: async () => (await import('./cart/cart.component')).CartComponent,
    }
];
