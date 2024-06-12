import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: '',
        title: CustomTitleResolver,
        data: { titleKey: 'shop.shop'},
        loadComponent: async () => (await import('./home/home.component')).ShopHomeComponent,
    }
];
