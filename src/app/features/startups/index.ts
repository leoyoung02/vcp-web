import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: '',
        title: CustomTitleResolver,
        data: { titleKey: 'startups.startups'},
        loadComponent: async () => (await import('./list/list.component')).StartupsListComponent,
    },
];