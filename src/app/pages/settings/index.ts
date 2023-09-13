import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: '',
        title: CustomTitleResolver,
        data: { titleKey: 'registration-fields.settings'},
        loadComponent: async () => (await import('./main/main.component')).MainComponent,
    },
    {
        path: 'features',
        title: CustomTitleResolver,
        data: { titleKey: 'company-settings.features'},
        loadComponent: async () => (await import('./features-list/features-list.component')).FeaturesListComponent,
    },
    {
        path: 'feature/:id',
        title: CustomTitleResolver,
        data: { titleKey: 'company-settings.settings'},
        loadComponent: async () => (await import('./feature/feature.component')).FeatureComponent,
    },
    {
        path: 'members',
        title: CustomTitleResolver,
        data: { titleKey: 'plan-details.members'},
        loadComponent: async () => (await import('@features/members/admin/admin.component')).AdminComponent,
    },
    {
        path: 'list/:id/:list',
        title: CustomTitleResolver,
        data: { titleKey: 'company-settings.lists'},
        loadComponent: async () => (await import('./admin-list/admin-list.component')).AdminListComponent,
    },
    {
        path: 'reports',
        title: CustomTitleResolver,
        data: { titleKey: 'company-settings.reports'},
        loadComponent: async () => (await import('./reports/reports.component')).SettingsReportsComponent,
    },
    {
        path: 'reports/details/:mode/:sub/:datapoint',
        title: CustomTitleResolver,
        data: { titleKey: 'customer.data'},
        loadComponent: async () => (await import('./reports-data/reports-data.component')).ReportsDataComponent,
    },
];
