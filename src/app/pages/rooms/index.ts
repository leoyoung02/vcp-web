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
        path: 'video/:guid/:code',
        title: CustomTitleResolver,
        data: { titleKey: 'professionals.videocall'},
        loadComponent: async () => (await import('./video-call/video-call.component')).VideoCallComponent,
    },
];