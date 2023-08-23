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
];
