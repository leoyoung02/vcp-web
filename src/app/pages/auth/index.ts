import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: 'login',
        title: CustomTitleResolver,
        data: { titleKey: 'login.login'},
        loadComponent: async () => (await import('./login/login.component')).LoginComponent,
    },
    {
        path: 'signup',
        title: CustomTitleResolver,
        data: { titleKey: 'login.signup'},
        loadComponent: async () => (await import('./signup/signup.component')).SignupComponent,
    },
    {
        path: 'forgot-password',
        title: CustomTitleResolver,
        data: { titleKey: 'login.forgotpassword'},
        loadComponent: async () => (await import('./forgot-password/forgot-password.component')).ForgotPasswordComponent,
    },
    {
        path: 'change-password/:guid',
        title: CustomTitleResolver,
        data: { titleKey: 'login.changepasswordtitle'},
        loadComponent: async () => (await import('./change-password/change-password.component')).ChangePasswordComponent,
    },
];
