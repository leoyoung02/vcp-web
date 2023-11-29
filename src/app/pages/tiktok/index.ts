import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: 'landing/:slug',
        title: CustomTitleResolver,
        data: { titleKey: 'registration-landing.editregistrationlanding'},
        loadComponent: async () => (await import('./landing/landing.component')).TikTokLandingComponent,
    },
    {
        path: 'questions/:slug',
        title: CustomTitleResolver,
        data: { titleKey: 'registration-landing.editregistrationlanding'},
        loadComponent: async () => (await import('./questions/questions.component')).TikTokQuestionsComponent,
    },
];