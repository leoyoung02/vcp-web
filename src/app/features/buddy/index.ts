import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: '',
        title: CustomTitleResolver,
        data: { titleKey: 'company-reports.buddy'},
        loadComponent: async () => (await import('./home/home.component')).BuddyHomeComponent,
    },
    {
        path: 'list',
        title: CustomTitleResolver,
        data: { titleKey: 'buddy.mentees'},
        loadComponent: async () => (await import('./list/list.component')).BuddyListComponent,
    },
    {
        path: 'profile/mentor',
        title: CustomTitleResolver,
        data: { titleKey: 'buddy.mentor'},
        loadComponent: async () => (await import('./mentor-profile/mentor-profile.component')).MentorProfileComponent,
    },
];
