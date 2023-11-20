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
    {
        path: 'manage-list/:list',
        title: CustomTitleResolver,
        data: { titleKey: 'user-popup.admin'},
        loadComponent: async () => (await import('./manage-list/manage-list.component')).ManageListComponent,
    },
    {
        path: 'setting/:id',
        title: CustomTitleResolver,
        data: { titleKey: 'company-settings.settings'},
        loadComponent: async () => (await import('./setting/setting.component')).SettingComponent,
    },
    {
        path: 'email/:id/:type',
        title: CustomTitleResolver,
        data: { titleKey: 'plan-details.email'},
        loadComponent: async () => (await import('./email/email.component')).EmailComponent,
    },
    {
        path: 'menu-order',
        title: CustomTitleResolver,
        data: { titleKey: 'company-settings.menuorder'},
        loadComponent: async () => (await import('./menu-order/menu-order.component')).MenuOrderComponent,
    },
    {
        path: 'students-management',
        title: CustomTitleResolver,
        data: { titleKey: 'course-students.managestudents'},
        loadComponent: async () => (await import('./manage-students/manage-students.component')).ManageStudentsComponent,
    },
    {
        path: 'home-template',
        title: CustomTitleResolver,
        data: { titleKey: 'company-settings.personalizehometemplate'},
        loadComponent: async () => (await import('./home-template/home-template.component')).HomeTemplateSettingComponent,
    },
    {
        path: 'stripe-accounts',
        title: CustomTitleResolver,
        data: { titleKey: 'stripe-account.managestripeaccounts'},
        loadComponent: async () => (await import('./stripe-accounts/stripe-accounts.component')).ManageStripeAccountsComponent,
    },
];