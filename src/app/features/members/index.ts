import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: '',
        title: CustomTitleResolver,
        data: { titleKey: 'plan-details.members'},
        loadComponent: async () => (await import('./list/list.component')).ListComponent,
    },
    {
        path: 'detail/:id',
        title: CustomTitleResolver,
        data: { titleKey: 'plan-details.member'},
        loadComponent: async () => (await import('./detail/detail.component')).DetailComponent,
    }
];
