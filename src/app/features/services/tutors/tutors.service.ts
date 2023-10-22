import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  CREDIT_PACKAGES_URL,
  TUTORS_COMBINED_URL,
  TUTORS_URL,
  TUTOR_DETAILS_URL,
} from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";

@Injectable({
  providedIn: "root",
})
export class TutorsService {
  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  getTutors(id): Observable<any> {
    return this._http.get(`${TUTORS_URL}/${id}`, { headers: this.headers }).pipe(map(res => res))
  }

  getCreditPackages(id): Observable<any> {
    return this._http.get(`${CREDIT_PACKAGES_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchTutorsCombined(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${TUTORS_COMBINED_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchTutor(id: number = 0, companyId: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${TUTOR_DETAILS_URL}/${id}/${companyId}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }
}