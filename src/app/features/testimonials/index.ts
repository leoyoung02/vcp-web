import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: '',
        title: CustomTitleResolver,
        data: { titleKey: 'wall.tutors'},
        loadComponent: async () => (await import('./list/list.component')).TestimonialsListComponent,
    },
    {
        path: 'details/:id',
        title: CustomTitleResolver,
        data: { titleKey: 'tutors.tutor'},
        loadComponent: async () => (await import('./detail/detail.component')).TestimonialDetailComponent,
    }
];
