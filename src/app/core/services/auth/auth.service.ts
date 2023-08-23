import { Injectable } from "@angular/core";
import { storage } from "src/app/core/utils/storage/storage.utils";
import { BehaviorSubject, Observable, forkJoin, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalService, TokenStorageService } from "@share/services";
import { environment } from "@env/environment";
import { User } from "@lib/interfaces";
import {
  CHECK_EXPIRED_URL,
  CHECK_MEMBER_TYPES_URL,
  CHECK_OTHER_MEMBER_TYPES_URL,
  LOGIN_URL,
  FORGOT_PASSWORD_URL,
  CHANGE_PASSWORD_URL,
  SIGNUP_FREE_URL,
  SEND_EMAIL_CONFIRMATION_URL,
  SELECT_PLAN_EMAIL_URL,
} from "@lib/api-constants";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(
    !!storage.getItem("appSession")
  );

  private headers: HttpHeaders;

  constructor(
    private _http: HttpClient,
    private _localService: LocalService,
    private _tokenStorageService: TokenStorageService
  ) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.getValue();
  }

  checkLoginMember(companyId, email): Observable<any[]> {
    let expired_member = this._http.get(
      `${CHECK_EXPIRED_URL}/${companyId}/${email}`
    );
    let user_member_types = this._http.get(
      `${CHECK_MEMBER_TYPES_URL}/${companyId}/${email}`
    );
    let expired = this._http.get(
      `${CHECK_OTHER_MEMBER_TYPES_URL}/${companyId}/${email}`
    );

    return forkJoin([expired_member, user_member_types, expired]);
  }

  login(email, password, companyId) {
    return this._http
      .post<any>(`${LOGIN_URL}`, { email, password, company_id: companyId })
      .pipe(
        map((result) => {
          let user: User = {
            id: result.id,
            role: result.role,
            domain: result.domain,
            email: result.email,
            fk_company_id: result.fk_company_id,
            tiny_url: result.tiny_url,
            image: result.image,
            guid: result.guid,
            token: result.token,
            refreshToken: result.refreshToken,
            custom_member_type_id: result.custom_member_type_id,
          };
          this._localService.setLocalStorage(environment.lsuser, result);
          this._localService.setLocalStorage(environment.lsuserId, result.id);
          this._localService.setLocalStorage(environment.lstoken, result.token);
          storage.setItem("appSession", {
            user: environment.lsuserId,
            token: environment.lstoken,
          });

          this._tokenStorageService.saveToken(result.token);
          this._tokenStorageService.saveRefreshToken(result.refreshToken);
          this._tokenStorageService.saveUser(user);
          this._localService.setLocalStorage(
            environment.lsrefreshtoken,
            result.refreshToken
          );
          this._localService.setLocalStorage(environment.lsemail, result.email);
          this._localService.setLocalStorage(
            environment.lsdomain,
            result.domain
          );
          this._localService.setLocalStorage(
            environment.lscompanyId,
            result.fk_company_id
          );

          this._localService.setLocalStorage(environment.lsguid, result.guid);
          this._localService.setLocalStorage(
            environment.lsuserRole,
            result.role
          );
          if (!this._localService.getLocalStorage(environment.lslang)) {
            this._localService.setLocalStorage(environment.lslang, "es");
          }

          this.isAuthenticated$.next(true);
          return user;
        })
      );
  }

  logout(): void {
    storage.removeItem("appSession");
    this.isAuthenticated$.next(false);
  }

  resetPassword(email, company_id): Observable<any> {
    let payload = { email, company_id };
    return this._http.post(`${FORGOT_PASSWORD_URL}`, payload).pipe(
      map((result) => {
        return result;
      })
    );
  }

  changePasswordVistingo(password, guid): Observable<any> {
    let payload = { password, guid };
    return this._http.post(`${CHANGE_PASSWORD_URL}`, payload).pipe(
      map((result) => {
        return result;
      })
    );
  }

  userSignupDynamicNoPayment(formData): Observable<any> {
    return this._http.post(`${SIGNUP_FREE_URL}`, formData).pipe(
      map((result) => {
        return result;
      })
    );
  }

  sendConfirmationEmail(payload): Observable<any> {
    return this._http
      .post(`${SEND_EMAIL_CONFIRMATION_URL}`, payload, {
        headers: this.headers,
      })
      .pipe(map((res) => res));
  }

  selectPlanEmail(id, companyId): Observable<any> {
    return this._http
      .post(
        `${SELECT_PLAN_EMAIL_URL}/${id}/${companyId}`,
        {},
        { headers: this.headers }
      )
      .pipe(map((res) => res));
  }
}
