import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: '',
        title: CustomTitleResolver,
        data: { titleKey: 'dashboard.plans'},
        loadComponent: async () => (await import('./list/list.component')).PlansListComponent,
    },
    {
        path: 'details/:id/:planTypeId',
        title: CustomTitleResolver,
        data: { titleKey: 'plan-details.plan'},
        loadComponent: async () => (await import('./detail/detail.component')).PlanDetailComponent,
    },
    {
        path: 'create/:id/:planTypeId',
        title: CustomTitleResolver,
        data: { titleKey: 'signup.create'},
        loadComponent: async () => (await import('./edit/edit.component')).PlanEditComponent,
    },
    {
        path: 'edit/:id/:planTypeId',
        title: CustomTitleResolver,
        data: { titleKey: 'landing.edit'},
        loadComponent: async () => (await import('./edit/edit.component')).PlanEditComponent,
    }
];
