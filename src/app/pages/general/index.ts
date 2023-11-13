import { Routes } from '@angular/router';
import { CustomTitleResolver } from '@lib/resolvers';

export const routes: Routes = [
    {
        path: 'contract/:id/:typeId',
        title: CustomTitleResolver,
        data: { titleKey: 'company-settings.contract'},
        loadComponent: async () => (await import('./contract/contract.component')).ContractComponent,
    }
];