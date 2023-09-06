import { Injectable } from "@angular/core";
import { Observable, forkJoin, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  ADD_GROUP_PLAN_COMMENT_REACTION_URL,
  ADD_GROUP_PLAN_COMMENT_REPLY_URL,
  ADD_GROUP_PLAN_COMMENT_URL,
  ADD_PLAN_COMMENT_URL,
  ADD_TO_WAITING_LIST_URL,
  ANSWER_EMAIL_INVITE_QUESTIONS_URL,
  COURSE_CATEGORIES_URL,
  COURSE_CATEGORY_ACCESS_URL,
  COURSE_CATEGORY_MAPPING_URL,
  CREATE_PLAN_ROLES_URL,
  DASHBOARD_DETAILS_URL,
  DELETE_COMMENT_URL,
  DELETE_GROUP_PLAN_COMMENT_REACTION_URL,
  EVENT_CATEGORIES_URL,
  EVENT_CUSTOM_SUBCATEGORIES_URL,
  EVENT_SETTINGS_URL,
  EVENT_SUBCATEGORIES_URL,
  EVENT_TYPES_URL,
  FEATURES_MAPPING_URL,
  GROUP_PLAN_COMMENTS_URL,
  JOIN_GROUP_PLAN_URL,
  JOIN_PLAN_URL,
  JOIN_REQUEST_URL,
  LEAVE_GROUP_PLAN_URL,
  LEAVE_PLAN_URL,
  OTHER_SETTINGS_URL,
  PAST_PLANS_URL,
  PLANS_CALENDAR_URL,
  PLANS_LIST_URL,
  PLANS_OTHER_DATA_URL,
  PLANS_URL,
  PLAN_CATEGORIES_URL, PLAN_CATEGORY_ADD_URL, PLAN_CATEGORY_DELETE_URL, PLAN_CATEGORY_EDIT_URL, PLAN_DETAILS_URL, PLAN_EMAIL_TO_URL, PLAN_INVITE_LINK_URL, PLAN_SUBCATEGORIES_ADD_URL, PLAN_SUBCATEGORIES_EDIT_URL, PLAN_SUBCATEGORIES_MAPPING_URL, PLAN_SUBCATEGORIES_URL, PLAN_SUBCATEGORY_DELETE_URL, PLAN_SUPERCATEGORIES_URL, PLAN_UPDATE_ALIAS_URL, PLAN_UPDATE_SLUG_URL, REMOVE_FROM_WAITING_LIST_URL, USER_COURSES_URL, USER_ROLE_URL, USER_URL,
} from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";

@Injectable({
  providedIn: "root",
})
export class PlansService {
  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  getPlanCategories(id): Observable<any> {
    return this._http.get(`${PLAN_CATEGORIES_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getPlanSubcategories(id): Observable<any> {
    return this._http.get(`${PLAN_SUBCATEGORIES_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addPlanEventCategory(payload): Observable<any> {
    return this._http.post(PLAN_CATEGORY_ADD_URL, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  editPlanEventCategory(id, payload): Observable<any> {
    return this._http.post(`${PLAN_CATEGORY_EDIT_URL}/${id}`, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addPlanSubcategory(payload): Observable<any> {
    return this._http.post(PLAN_SUBCATEGORIES_ADD_URL, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  editPlanSubcategory(id, payload): Observable<any> {
    return this._http.post(`${PLAN_SUBCATEGORIES_EDIT_URL}/${id}`, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  deletePlanEventCategory(id): Observable<any> {
    return this._http.post( `${PLAN_CATEGORY_DELETE_URL}/${id}`, {}, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  deletePlanSubcategory(id): Observable<any> {
    return this._http.post(`${PLAN_SUBCATEGORY_DELETE_URL}/${id}`, {}, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getEventTypes(id): Observable<any> {
    return this._http.get(`${EVENT_TYPES_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getAllPlansList(domain: string, plan_type_id: number,page=1,limit=20, company_id: number): Observable<any> {
    const params = `plan_type_id=${plan_type_id}&page=${page}&limit=${limit}&company_id=${company_id}`
    return this._http.get(`${PLANS_LIST_URL}?${params}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getAllPastPlans(plan_type_id: number, company_id: number): Observable<any> {
    return this._http.get(`${PAST_PLANS_URL}/${plan_type_id}/${company_id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getEventSettings(id): Observable<any> {
    return this._http.get(`${EVENT_SETTINGS_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res))
  }

  getCombinedPlansPrefetch(companyId, userId, featureId): Observable<any[]> {
    let other_settings = this._http.get(`${OTHER_SETTINGS_URL}/${companyId}`);
    let CompanyUser = this._http.get(`${USER_URL}/${userId}`);
    let role = this._http.get(`${USER_ROLE_URL}/${userId}`);
    let create_plan_roles = this._http.get(`${CREATE_PLAN_ROLES_URL}/${companyId}`);
    let dashboard_details = this._http.get(`${DASHBOARD_DETAILS_URL}/${companyId}`);
    let categories = this._http.get(`${EVENT_CATEGORIES_URL}/${companyId}`);
    let subcategories = this._http.get(`${EVENT_SUBCATEGORIES_URL}/${companyId}`);
    let customsubcategories = this._http.get(`${EVENT_CUSTOM_SUBCATEGORIES_URL}/${companyId}`);
    let subfeatures = this._http.get(`${FEATURES_MAPPING_URL}/${companyId}/${featureId}`);
    let CompanySuperCategory = this._http.get(`${PLAN_SUPERCATEGORIES_URL}/${companyId}`);
    let plansubcategories = this._http.get(`${PLAN_SUBCATEGORIES_URL}/${companyId}`);
    let plansubcategorymapping = this._http.get(`${PLAN_SUBCATEGORIES_MAPPING_URL}/${companyId}`);

    return forkJoin([
        other_settings,
        CompanyUser,
        role,
        create_plan_roles,
        dashboard_details,
        categories,
        subcategories,
        customsubcategories,
        subfeatures,
        CompanySuperCategory,
        plansubcategories,
        plansubcategorymapping
    ]);
}

getCombinedCoursePlansPrefetch(companyId, userId, featureId): Observable<any[]> {
    let other_settings = this._http.get(`${OTHER_SETTINGS_URL}/${companyId}`);
    let CompanyUser = this._http.get(`${USER_URL}/${userId}`);
    let role = this._http.get(`${USER_ROLE_URL}/${userId}`);
    let create_plan_roles = this._http.get(`${CREATE_PLAN_ROLES_URL}/${companyId}`);
    let dashboard_details = this._http.get(`${DASHBOARD_DETAILS_URL}/${companyId}`);
    let categories = this._http.get(`${EVENT_CATEGORIES_URL}/${companyId}`);
    let subcategories = this._http.get(`${EVENT_SUBCATEGORIES_URL}/${companyId}`);
    let customsubcategories = this._http.get(`${EVENT_CUSTOM_SUBCATEGORIES_URL}/${companyId}`);
    let subfeatures = this._http.get(`${FEATURES_MAPPING_URL}/${companyId}/${featureId}`);
    let CompanySuperCategory = this._http.get(`${PLAN_SUPERCATEGORIES_URL}/${companyId}`);
    let plansubcategories = this._http.get(`${PLAN_SUBCATEGORIES_URL}/${companyId}`);
    let plansubcategorymapping = this._http.get(`${PLAN_SUBCATEGORIES_MAPPING_URL}/${companyId}`);
    let roles = this._http.get(`${COURSE_CATEGORY_ACCESS_URL}/${companyId}`);
    let CompanySupercategory = this._http.get(`${COURSE_CATEGORIES_URL}/${companyId}`);
    let CompanyCourseCategoryMapping = this._http.get(`${COURSE_CATEGORY_MAPPING_URL}/${companyId}`);
    let courses = this._http.get(`${USER_COURSES_URL}/${userId}/${companyId}`);

    return forkJoin([
      other_settings,
      CompanyUser,
      role,
      create_plan_roles,
      dashboard_details,
      categories,
      subcategories,
      customsubcategories,
      subfeatures,
      CompanySuperCategory,
      plansubcategories,
      plansubcategorymapping,
      roles,
      CompanySupercategory,
      CompanyCourseCategoryMapping,
      courses
    ]);
  }

  getCombinedActivePastPlans(domain, planType, page, limit, companyId) {
    const params = `plan_type_id=${planType}&page=${page}&limit=${limit}&company_id=${companyId}`
    let Plans = this._http.get(`${PLANS_LIST_URL}/guest/all-plans-list?${params}`);
    let PastPlans = this._http.get(`${PAST_PLANS_URL}/company/all-past-plans/0/${companyId}`);

    return forkJoin([
        Plans,
        PastPlans
    ])
  }

  getCalendarPlans(id: number, plan_type_id: number, page=1, limit=20, status = 'all'): Observable<any> {
    const params = `plan_type_id=${plan_type_id}&page=${page}&limit=${limit}&status=${status}`;
    return this._http.get(`${PLANS_CALENDAR_URL}/${id}?${params}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchPlans(id: number = 0, mode: string = 'active'): Observable<any> {
    return this._http.get(`${PLANS_CALENDAR_URL}/${id}?${mode}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchPlansOtherDataCombined(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${PLANS_OTHER_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchPlansCombined(id: number = 0, mode: string = 'active'): Observable<any> {
    return this._http.get(`${PLANS_URL}/${id}/${mode}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchPlanDetailsCombined(id: number = 0, planTypeId: number = 0, companyId: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${PLAN_DETAILS_URL}/${id}/${planTypeId}/${companyId}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  emailTemplate(id, event_id, type_id, user_id, aliasInLink): Observable<any> {
    return this._http.get(`${PLAN_EMAIL_TO_URL}/${id}/${event_id}/${type_id}/${user_id}/${aliasInLink}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getInviteLink(userId, eventId, eventTypeId, aliasInvLink): Observable<any> {
    return this._http.get(`${PLAN_INVITE_LINK_URL}/${userId}/${eventId}/${eventTypeId}/${aliasInvLink}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  updatePlanSlug(user_id, plan_type_id): Observable<any> {
    return this._http.post(`${PLAN_UPDATE_SLUG_URL}/${user_id}/${plan_type_id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  updateUserAlias(user_id): Observable<any> {
    return this._http.post(`${PLAN_UPDATE_ALIAS_URL}/${user_id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addJoinRequest( payload ): Observable<any> {
    return this._http.post(JOIN_REQUEST_URL, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addPlanParticipant( plan_id: number, user_id: number ): Observable<any> {
    return this._http.post(`${JOIN_PLAN_URL}/${plan_id}/${user_id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addGroupPlanParticipant(payload): Observable<any> {
    return this._http.post(JOIN_GROUP_PLAN_URL, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  removeGroupPlanParticipant(payload): Observable<any> {
    return this._http.post(LEAVE_GROUP_PLAN_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  removePlanParticipant( plan_id: number, user_id: number ): Observable<any> {
    return this._http.post(`${LEAVE_PLAN_URL}/${plan_id}/${user_id}`,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  addToWaitingList(payload) {
    return this._http.post(ADD_TO_WAITING_LIST_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  removeFromWaitingList(payload): Observable<any> {
    return this._http.post(REMOVE_FROM_WAITING_LIST_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  addPlanComment( plan_id: number, user_id: number, comment: string ): Observable<any> {
    return this._http.post(`${ADD_PLAN_COMMENT_URL}/${plan_id}/${user_id}?comment=${comment}`,
        {'comment' : comment},
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  addGroupPlanComment( group_plan_id: number, user_id: number, comment: string ): Observable<any> {
      const url = `${ADD_GROUP_PLAN_COMMENT_URL}/${group_plan_id}/${user_id}?comment=${comment}`
      const headers = {
          headers: this.headers
      }
      return this._http.post(url,{
          'comment' : comment,
      }, headers).pipe(map(res => res));
  }

  deleteGroupPlanCommentHeart(id, planTypeId, param) {
      return this._http.post(`${DELETE_GROUP_PLAN_COMMENT_REACTION_URL}/${id}/${planTypeId}`,
        param
      )
  }

  heartGroupPlanComment(id, planTypeId, param): Observable<any> {
      return this._http.post(`${ADD_GROUP_PLAN_COMMENT_REACTION_URL}/${id}/${planTypeId}`,
        param,
        { headers: this.headers }
      ).pipe(map(res => res))
  }

  addGroupPlanCommentReply(id, planTypeId, param): Observable<any> {
      return this._http.post(`${ADD_GROUP_PLAN_COMMENT_REPLY_URL}/${id}/${planTypeId}`,
        param,
        { headers: this.headers }
      ).pipe(map(res => res))
  }

  getGroupPlanComments(id, planTypeId): Observable<any> {
      return this._http.get(`${GROUP_PLAN_COMMENTS_URL}/${id}/${planTypeId}`,
          { headers: this.headers }
      ).pipe(map(res => res));
  }

  deleteActivityComment(id, plan_type_id): Observable<any> {
    return this._http.post(`${DELETE_COMMENT_URL}/${id}/${plan_type_id}`,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  answerEmailInviteQuestion(payload): Observable<any> {
    return this._http.post(ANSWER_EMAIL_INVITE_QUESTIONS_URL, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }
}