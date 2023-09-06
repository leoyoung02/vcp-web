import { Routes } from '@angular/router';
import { PageLayout } from '@lib/enums/page-layout.enum';
import { authGuard } from 'src/app/core/guards';

export const routes: Routes = [
    {
        path: 'auth',
        data: { layout: PageLayout.LeftBanner },
        loadChildren: async () => (await import('@pages/auth')).routes,
        canMatch: [authGuard({ requiresAuthentication: false })],
    },
    {
        path: 'sso/:token',
        data: { layout: PageLayout.LeftBanner },
        loadChildren: async () => (await import('@pages/sso')).routes,
        canMatch: [authGuard({ requiresAuthentication: false })],
    },
    {
        path: 'payment',
        data: { layout: PageLayout.Blank },
        loadChildren: async () => (await import('@pages/payment')).routes,
        canMatch: [authGuard({ requiresAuthentication: false })],
    },
    {
        path: '',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@pages/home')).routes,
        canMatch: [authGuard()],
    },
    {
        path: 'users',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@pages/user')).routes,
        canMatch: [authGuard()],
    },
    {
        path: 'settings',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@pages/settings')).routes,
        canMatch: [authGuard()],
    },
    {
        path: 'search',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@pages/search')).routes,
        canMatch: [authGuard()],
    },
    {
        path: 'dashboard',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@pages/dashboard')).routes,
        canMatch: [authGuard()],
    },
    {
        path: 'plans',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@features/plans')).routes,
        canMatch: [authGuard()],
    },
    {
        path: 'clubs',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@features/clubs')).routes,
        canMatch: [authGuard()],
    },
    {
        path: 'courses',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@features/courses')).routes,
        canMatch: [authGuard()],
    },
    {
        path: 'tutors',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@features/tutors')).routes,
        canMatch: [authGuard()],
    },
    {
        path: 'activity-feed',
        data: { layout: PageLayout.Main },
        loadChildren: async () => (await import('@features/activity-feed')).routes,
        canMatch: [authGuard()],
    },
    {
        path: '**',
        data: { layout: PageLayout.Blank },
        loadComponent: async () => (await import('@pages/screens/not-found/not-found.component')).NotFoundComponent,
    },
];
