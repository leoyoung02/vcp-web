import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: 'voice/:guid/:code',
        title: CustomTitleResolver,
        data: { titleKey: 'professionals.voice'},
        loadComponent: async () => (await import('./voice-call/voice-call.component')).VoiceCallComponent,
    },
    {
        path: 'video/:guid/:code/:role',
        title: CustomTitleResolver,
        data: { titleKey: 'professionals.videocall'},
        loadComponent: async () => (await import('./video-call/video-call.component')).VideoCallComponent,
    },
    {
        path: 'ended',
        title: CustomTitleResolver,
        data: { titleKey: 'professionals.callended'},
        loadComponent: async () => (await import('./call-ended/call-ended.component')).CallEndedComponent,
    },
];