import { Routes } from '@angular/router';
import { PageLayout } from '@lib/enums/page-layout.enum';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: 'profile/:id',
        title: CustomTitleResolver,
        data: { layout: PageLayout.Main , titleKey: 'company-settings.profile' },
        loadComponent: async () => (await import('./profile/profile.component')).ProfileComponent,
    },
    {
        path: 'notifications/:id',
        title: CustomTitleResolver,
        data: { layout: PageLayout.Main , titleKey: 'notification-popup.notifications' },
        loadComponent: async () => (await import('./notifications/notifications.component')).NotificationsComponent,
    }
];
