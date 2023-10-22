import { Injectable } from "@angular/core";
import { Observable, forkJoin, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  COURSES_COMBINED_URL,
  COURSE_CATEGORIES_URL,
  COURSE_CATEGORY_ACCESS_EDIT_URL,
  COURSE_CATEGORY_ACCESS_ROLES_URL,
  COURSE_CATEGORY_ACCESS_URL,
  COURSE_CATEGORY_ADD_URL,
  COURSE_CATEGORY_DELETE_URL,
  COURSE_CATEGORY_EDIT_URL,
  COURSE_CATEGORY_MAPPING_URL,
  COURSE_DETAILS_URL,
  COURSE_EXCEPION_USERS_URL,
  COURSE_SUBSCRIPTIONS_URL,
  COURSE_TUTORS_URL,
  COURSE_UNIT_DETAILS_URL,
  FEATURES_MAPPING_URL,
  USER_ROLE_URL,
  USER_URL,
  VIMEO_EMBED_URL,
} from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  getCourseCategoryMapping(id): Observable<any> {
    return this._http.get(`${COURSE_CATEGORY_MAPPING_URL}/${id}`, { headers: this.headers }).pipe(map(res => res));
  }

  getCourseCategories(id): Observable<any> {
    return this._http.get(`${COURSE_CATEGORIES_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addCourseCategory(payload): Observable<any> {
    return this._http.post(COURSE_CATEGORY_ADD_URL, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  editCourseCategory(id, payload): Observable<any> {
    return this._http.post(`${COURSE_CATEGORY_EDIT_URL}/${id}`, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  deleteCourseCategory(id, companyId): Observable<any> {
    return this._http.post(`${COURSE_CATEGORY_DELETE_URL}/${id}/${companyId}`, {}, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getCourseCategoryAccessRoles(id) {
    return this._http.get(`${COURSE_CATEGORY_ACCESS_ROLES_URL}/${id}`, { 
      headers: this.headers 
    });
  }

  editCourseCategoryAccess(payload) {
    return this._http.post(COURSE_CATEGORY_ACCESS_EDIT_URL, payload);
  }

  fetchCoursesCombined(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${COURSES_COMBINED_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getCombinedCoursesPrefetch(companyId, userId): Observable<any[]> {
    let featureId = 11;
    let tutorFeatureId = 20;
    let courseSubscriptions = this._http.get(`${COURSE_SUBSCRIPTIONS_URL}/${userId}`);
    let courseTutors = this._http.get(`${COURSE_TUTORS_URL}/${companyId}`);
    let courseCategoriesAccessRoles = this._http.get(`${COURSE_CATEGORY_ACCESS_URL}/${companyId}`);
    let courseCategoryMapping = this._http.get(`${COURSE_CATEGORY_MAPPING_URL}/${companyId}`);
    let user = this._http.get(`${USER_URL}/${userId}`);
    let allCourseCategories = this._http.get(`${COURSE_CATEGORIES_URL}/${companyId}`);
    let courseExceptionUser = this._http.get(`${COURSE_EXCEPION_USERS_URL}/${userId}`);
    let roles = this._http.get(`${USER_ROLE_URL}/${userId}`);
    let subfeatures = this._http.get(`${FEATURES_MAPPING_URL}/${companyId}/${featureId}`);
    let tutorSubfeatures = this._http.get(`${FEATURES_MAPPING_URL}/${companyId}/${tutorFeatureId}`);

    return forkJoin([
      courseSubscriptions, 
      courseTutors, 
      courseCategoriesAccessRoles, 
      courseCategoryMapping, 
      user, 
      allCourseCategories, 
      courseExceptionUser, 
      roles,
      subfeatures,
      tutorSubfeatures
    ]);
  }

  fetchCourse(id, companyId, userId): Observable<any> {
    return this._http.get(`${COURSE_DETAILS_URL}/${id}/${companyId}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchCourseUnit(courseid, unitId, companyId, userId): Observable<any> {
    return this._http.get(`${COURSE_UNIT_DETAILS_URL}/${courseid}/${unitId}/${companyId}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getVimeoEmbed(id, token): Observable<any> {
    return this._http.get(`${VIMEO_EMBED_URL}/${id}/${token}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }
}