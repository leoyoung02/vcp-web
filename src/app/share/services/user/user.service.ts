import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, forkJoin, map } from "rxjs";
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
    MANAGE_USERS_DATA_URL,
    ACTIVE_MEMBERS_URL,
    FOR_CONFIRMATION_MEMBERS_URL,
    DELETED_MEMBERS_URL,
    NOT_APPROVED_MEMBERS_URL,
    INCOMPLETE_MEMBERS_URL,
    FOR_APPROVAL_MEMBERS_URL,
    SALES_PERSON_LIST_URL,
    BULK_DELETE_USERS_URL,
    BULK_PERMANENT_DELETE_USERS_URL,
    BULK_RECOVER_DELETED_USERS_URL,
    PERMANENT_DELETE_USER_URL,
    DELETE_USER_URL,
    RECOVER_DELETED_USER_URL,
    ADD_USER_URL,
    ADD_DYNAMIC_USER_URL,
    EDIT_DYNAMIC_USER_URL,
    UPDATE_CONFIRM_USER_STATUS_URL,
    BULK_UPDATE_USER_STATUS_URL,
    UPDATE_USER_STATUS_URL,
    MEMBERS_LIST_URL,
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

  fetchManageUsersData(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${MANAGE_USERS_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getCombinedMiembrosListPrefetch(companyId) {
    let members = this._http.get(`${ACTIVE_MEMBERS_URL}/${companyId}`);
    let members_for_confirm = this._http.get(`${FOR_CONFIRMATION_MEMBERS_URL}/${companyId}`);
    let members_deleted = this._http.get(`${DELETED_MEMBERS_URL}/${companyId}`);
    let members_not_approved = this._http.get(`${NOT_APPROVED_MEMBERS_URL}/${companyId}`);
    let members_incomplete = this._http.get(`${INCOMPLETE_MEMBERS_URL}/${companyId}`);
    let members_for_approval = this._http.get(`${FOR_APPROVAL_MEMBERS_URL}/${companyId}`);

    return forkJoin([
      members,
      members_for_confirm,
      members_deleted,
      members_not_approved,
      members_incomplete,
      members_for_approval
    ])
  }

  guestSalesPersonList(): Observable<any> {
    return this._http.get(SALES_PERSON_LIST_URL,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  bulkDeleteUser(formData, userId): Observable<any> {
    formData.userId = userId
    return this._http.post(BULK_DELETE_USERS_URL,
      formData
    ).pipe(map(res => res));
  }

  bulkDeleteDeletedUser(formData): Observable<any> {
    return this._http.post(
      BULK_PERMANENT_DELETE_USERS_URL,
      formData
    ).pipe(map(res => res));
  }

  bulkRecoverDeletedUser(formData): Observable<any> {
    return this._http.post(
      BULK_RECOVER_DELETED_USERS_URL,
      formData
    ).pipe(map(res => res));
  }

  deleteCompanyUser(id, userId): Observable<any> {
    return this._http.post(
        `${DELETE_USER_URL}/${id}`,
        { userId: userId },
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  deleteCompanyDeletedUser(id): Observable<any> {
    return this._http.post(
        `${PERMANENT_DELETE_USER_URL}/${id}`,
        {},
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  recoverCompanyDeletedUser(id): Observable<any> {
    return this._http.post(
        `${RECOVER_DELETED_USER_URL}/${id}`,
        {},
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  addCompanyUser(payload): Observable<any> {
    return this._http.post(
      ADD_USER_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  addVCPUserDynamicCustom(companyId, formData): Observable<any> {
    return this._http.post(
      `${ADD_DYNAMIC_USER_URL}/${companyId}`,
      formData
    ).pipe(
      map(result => {
        return result;
      })
    );
  }

  updateUserDynamicCustom(id, companyId, formData): Observable<any> {
    return this._http.post(
      `${EDIT_DYNAMIC_USER_URL}/${id}/${companyId}`,
      formData
    ).pipe(
      map(result => {
        return result;
      })
    );
  }

  updateUserStatus(id, payload): Observable<any> {
    return this._http.post(
      `${UPDATE_USER_STATUS_URL}/${id}`, 
      payload
    ).pipe(map(res => res));
  }

  updateBulkUserStatus(payload): Observable<any> {
    return this._http.post(BULK_UPDATE_USER_STATUS_URL, 
      payload
    ).pipe(map(res => res));
  }

  updateUserConfirmStatus(id, custom_member_type_id): Observable<any> {
    return this._http.post(
      `${UPDATE_CONFIRM_USER_STATUS_URL}/${id}/${custom_member_type_id}`, 
      {}
    ).pipe(map(res => res));
  }

  getMembersCustomRoles(companyId): Observable<any> {
    return this._http.get(`${MEMBERS_LIST_URL}/${companyId}`, 
      { headers: this.headers }
    ).pipe(map(res => res));
  }
}