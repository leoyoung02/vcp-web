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
    },
    {
        path: 'admin-lists',
        title: CustomTitleResolver,
        data: { layout: PageLayout.Main , titleKey: 'company-settings.managelanding' },
        loadComponent: async () => (await import('./admin-lists/admin-lists.component')).AdminListsComponent,
    },
    {
        path: 'my-credits/:mode',
        title: CustomTitleResolver,
        data: { layout: PageLayout.Main , titleKey: 'credit-package.mycredits' },
        loadComponent: async () => (await import('./my-credits/my-credits.component')).MyCreditsComponent,
    },
    {
        path: 'my-lessons',
        title: CustomTitleResolver,
        data: { layout: PageLayout.Main , titleKey: 'tutors.mylessons' },
        loadComponent: async () => (await import('./my-lessons/my-lessons.component')).MyLessonsComponent,
    },
];
