import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from 'src/app/core/services';
import { LocalService, TokenStorageService } from '@share/services';
import { storage } from 'src/app/core/utils/storage/storage.utils';

/**
 * Interceptor that adds an Authorization header to requests that are authenticated and target the API URL.
 *
 * @param request The request object.
 * @param next The next interceptor in the chain.
 *
 * @returns The next Observable.
 */
export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);

    const isRequestAuthorized = authService.isAuthenticated && request.url.startsWith(environment.api);

    if (isRequestAuthorized) {
        const tokenService = inject(TokenStorageService);
        const _localService = inject(LocalService);
        let token = tokenService.getToken() || _localService.getLocalStorage(environment.lstoken);

        if(tokenService.getToken()) {
            // console.log('use token from session storage')
        } else {
            if(_localService.getLocalStorage(environment.lstoken)) {
                // console.log('use token from local storage')
            }
        }

        if (token) {
            const payload = parseJwt(token); // decode JWT payload part.
            if (Date.now() >= payload.exp * 1000) { // Check token exp.
                storage.removeItem('appSession');
                _localService.removeLocalStorage(environment.lstoken);
                _localService.removeLocalStorage(environment.lsrefreshtoken);
                _localService.removeLocalStorage(environment.lsuser);
                location.href =  `/`
            }
      
            // If we have a token, we set it to the header
            request = request.clone({
              setHeaders: {Authorization: `Bearer ${token}`}
            });
        } else {
            storage.removeItem('appSession');
            _localService.removeLocalStorage(environment.lstoken);
            _localService.removeLocalStorage(environment.lsrefreshtoken);
            _localService.removeLocalStorage(environment.lsuser);
            location.href =  `/`
        } 

        const clonedRequest = request.clone({
            setHeaders: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: `Bearer ${token}`,
            },
        });

        return next(clonedRequest);
    }

    return next(request);
};

export function parseJwt(token): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
}
