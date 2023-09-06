import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { 
    MEMBER_TYPES_URL,
    USER_MEMBER_TYPES_URL,
    USER_NOTIFICATIONS_URL,
    USER_ALL_NOTIFICATIONS_URL,
    USER_CHECK_ADMIN_URL,
    REGISTRATION_FIELDS_URL,
    REGISTRATION_FIELDS_MAPPING_URL,
    CHECK_EXPIRED_URL,
    EDIT_CUSTOM_MEMBER_TYPE_URL,
    USER_URL,
    USER_ROLE_URL,
    PROFILE_FIELDS_URL,
    PROFILE_FIELDS_MAPPING_URL,
    USER_GUID_URL,
} from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private headers: HttpHeaders;

  private refreshNotifications = new BehaviorSubject(false);
  public currentRefreshNotification = this.refreshNotifications.asObservable();
  public triggerRefreshNotification(newRefreshNotifications: boolean) {
    this.refreshNotifications.next(newRefreshNotifications);
  }

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  getUserMemberTypes(id): Observable<any> {
    return this._http
      .get(`${USER_MEMBER_TYPES_URL}/${id}`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  userNotifications(userId, companyId) {
    return this._http.get(`${USER_NOTIFICATIONS_URL}/${userId}/${companyId}`);
  }

  allUserNotifications(userId, companyId) {
    return this._http.get(`${USER_ALL_NOTIFICATIONS_URL}/${userId}/${companyId}`);
  }

  isAdminById(userId) {
    return this._http.get(`${USER_CHECK_ADMIN_URL}/${userId}`);
  }

  getRegistrationFields(): Observable<any> {
    return this._http.get(REGISTRATION_FIELDS_URL, { headers: this.headers }).pipe(map(res => res))
  }

  getRegistrationFieldMapping(id): Observable<any> {
    return this._http.get(`${REGISTRATION_FIELDS_MAPPING_URL}/${id}`, { headers: this.headers }).pipe(map(res => res))
  }

  getProfileFields(): Observable<any> {
    return this._http.get(PROFILE_FIELDS_URL, { 
      headers: this.headers 
    }).pipe(map(res => res))
  }

  getProfileFieldMapping(id): Observable<any> {
    return this._http.get(`${PROFILE_FIELDS_MAPPING_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res))
  }

  getCustomMemberTypes(id): Observable<any> {
    return this._http.get(`${MEMBER_TYPES_URL}/${id}`, { headers: this.headers }).pipe(map(res => res))
  }

  getCustomMemberTypeExpiration(id, email): Observable<any> {
    return this._http.get(`${CHECK_EXPIRED_URL}/${id}/${email}`, { headers: this.headers }).pipe(map(res => res))
  }

  updateUserCustomMemberType(payload): Observable<any> {
    return this._http.post(EDIT_CUSTOM_MEMBER_TYPE_URL, payload).pipe(map(res => res));
  }

  getUserById(id): Observable<any> {
    return this._http.get(`${USER_URL}/${id}`, { headers: this.headers }).pipe(map(res => res))
  }

  getUserRole(id): Observable<any> {
    return this._http.get(`${USER_ROLE_URL}/${id}`, { headers: this.headers }).pipe(map(res => res))
  }

  getUserByGuid(guid) {
    return this._http.get(`${USER_GUID_URL}/${guid}`, { headers: this.headers });
  }
}
