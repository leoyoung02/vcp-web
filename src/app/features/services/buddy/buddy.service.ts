import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalService } from "@share/services/storage/local.service";
import { BUDDIES_DATA_URL, BUDDIES_URL, EDIT_MENTOR_PHOTO_URL, EDIT_MENTOR_URL, MENTOR_URL } from "@lib/api-constants";

@Injectable({
  providedIn: "root",
})
export class BuddyService {
  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  fetchBuddiesData(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${BUDDIES_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchBuddies(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${BUDDIES_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchMentor(id: number = 0): Observable<any> {
    return this._http.get(`${MENTOR_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  updateMentorProfile(payload) {
    return this._http.post<any>(EDIT_MENTOR_URL, 
      payload)
    ;
  }

  uploadMentorPhoto(payload) {
    return this._http.post<any>(EDIT_MENTOR_PHOTO_URL, 
      payload)
    ;
  }
}