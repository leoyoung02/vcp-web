import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  CLUBS_URL,
  CONTACT_FIELDS_ADD_URL,
  CONTACT_FIELDS_EDIT_URL,
  CONTACT_FIELDS_URL,
  GROUP_CATEGORIES_URL,
  GROUP_CATEGORY_ADD_URL,
  GROUP_CATEGORY_DELETE_URL,
  GROUP_CATEGORY_EDIT_URL,
  GROUP_SUBCATEGORIES_URL, 
  GROUP_SUBCATEGORY_ADD_URL, 
  GROUP_SUBCATEGORY_DELETE_URL, 
  GROUP_SUBCATEGORY_EDIT_URL, 
  SUBGROUP_TITLE_URL,
} from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";

@Injectable({
  providedIn: "root",
})
export class ClubsService {
  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  getSubgroupTitles(id): Observable<any> {
    return this._http.get(`${SUBGROUP_TITLE_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res))
  }

  getGroupCategories(id): Observable<any> {
    return this._http.get( `${GROUP_CATEGORIES_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getGroupSubcategories(id): Observable<any> {
    return this._http.get(`${GROUP_SUBCATEGORIES_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addGroupSubcategory(payload): Observable<any> {
    return this._http.post(GROUP_SUBCATEGORY_ADD_URL, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  editGroupSubcategory(id, payload): Observable<any> {
    return this._http.post(`${GROUP_SUBCATEGORY_EDIT_URL}/${id}`, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  deleteGroupSubcategory(id, companyId): Observable<any> {
    return this._http.post(`${GROUP_SUBCATEGORY_DELETE_URL}/${id}/${companyId}`, {}, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addGroupCategory(payload): Observable<any> {
    return this._http.post(GROUP_CATEGORY_ADD_URL, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  editGroupCategory(id, payload): Observable<any> {
    return this._http.post(`${GROUP_CATEGORY_EDIT_URL}/${id}`, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  deleteGroupCategory(id, companyId): Observable<any> {
    return this._http.post(`${GROUP_CATEGORY_DELETE_URL}/${id}/${companyId}`, {}, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getContactFields(id): Observable<any> {
    return this._http.get(`${CONTACT_FIELDS_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addContactField(companyId: number, payload): Observable<any> {
    return this._http.post(`${CONTACT_FIELDS_ADD_URL}/${companyId}`, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  editContactField(id: number, companyId: number, payload): Observable<any> {
    return this._http.post(`${CONTACT_FIELDS_EDIT_URL}/${id}/${companyId}`, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchClubs(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${CLUBS_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }
}