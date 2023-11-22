import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { environment } from '@env/environment';
import { LocalService, TokenStorageService } from '@share/services';
import { AuthService } from 'src/app/core/services';

type AuthGuardOptions = {
    requiresAuthentication: boolean;
};

const defaultAuthGuardOptions = (): AuthGuardOptions => ({
    requiresAuthentication: true,
});

/**
 * Guard that allows or blocks the navigation based on the user's authentication status.
 *
 * @param options An optional object that configures the behavior of the guard.
 * @param options.requiresAuthentication An optional boolean that specifies whether the guard should allow or block navigation based on the user's authentication status.
 *
 * @returns A function that acts as an Angular route guard.
 *
 * @example
 * import { authGuard } from '@lib/guards';
 *
 * const routes: Routes = [
 *   {
 *     path: 'my-protected-component-path',
 *     loadComponent: async () => (await import('./path/to/my-protected-component')).MyProtectedComponent,
 *     canMatch: [authGuard()],
 *   },
 * ];
 *
 * @example
 * import { authGuard } from '@lib/guards';
 *
 * const routes: Routes = [
 *   {
 *     path: 'my-path-component',
 *     loadComponent: async () => (await import('./path/to/my-auth-component')).MyAuthComponent,
 *     canMatch: [authGuard({ requiresAuthentication: false })],
 *   },
 * ];
 */
export const authGuard = (options: AuthGuardOptions = defaultAuthGuardOptions()): CanMatchFn => {
    return (_: Route, segments: UrlSegment[]) => {
        const _localService = inject(LocalService);
        const localToken = _localService.getLocalStorage(environment.lstoken);
        const localUser = _localService.getLocalStorage(environment.lsuser);
        const localAppSession = localStorage.getItem('appSession');
        if(localToken && localUser && !localAppSession) {
            console.log('set session from local storage')
            localStorage.setItem('appSession', JSON.stringify({
                user: environment.lsuserId,
                token: environment.lstoken,
            }))
        }

        const router = inject(Router);
        const authService = inject(AuthService);

        if (options.requiresAuthentication === authService.isAuthenticated) {
            return true;
        }

        if (!options.requiresAuthentication) {
            return true;
        }

        return options.requiresAuthentication
            ? router.createUrlTree(['/auth/login'], {
                  queryParams: {
                      returnUrl: segments.map((s) => s.path).join('/'),
                  },
              })
            : router.createUrlTree(['/']);
    };
};
