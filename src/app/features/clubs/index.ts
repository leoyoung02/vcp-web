import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: '',
        title: CustomTitleResolver,
        data: { titleKey: 'dashboard.clubs'},
        loadComponent: async () => (await import('./list/list.component')).ClubsListComponent,
    },
    {
        path: 'detail/:id',
        title: 'Detail',
        loadComponent: async () => (await import('./detail/detail.component')).ClubDetailComponent,
    }
];
