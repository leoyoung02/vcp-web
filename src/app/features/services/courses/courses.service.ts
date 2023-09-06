import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  COURSES_COMBINED_URL,
  COURSE_CATEGORIES_URL,
    COURSE_CATEGORY_ACCESS_EDIT_URL,
    COURSE_CATEGORY_ACCESS_ROLES_URL,
    COURSE_CATEGORY_ADD_URL,
    COURSE_CATEGORY_DELETE_URL,
    COURSE_CATEGORY_EDIT_URL,
    COURSE_CATEGORY_MAPPING_URL,
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
}