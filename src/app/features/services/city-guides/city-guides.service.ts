import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CITY_GUIDES_URL, CITY_GUIDE_URL, EDIT_CITY_GUIDE_LIKE_URL, EDIT_CITY_GUIDE_URL } from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";

@Injectable({
  providedIn: "root",
})
export class CityGuidesService {
  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  fetchCityGuides(id: number = 0, userId: number = 0, mode: string = 'active'): Observable<any> {
    return this._http.get(`${CITY_GUIDES_URL}/${id}/${userId}/${mode}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchCityGuide(id: number = 0, companyId: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${CITY_GUIDE_URL}/${id}/${companyId}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  deleteCityGuide(id, userId): Observable<any> {
    return this._http.post(`${EDIT_CITY_GUIDE_URL}/${id}/${userId}`,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  updateCityGuideLike(payload): Observable<any> {
    return this._http.post(EDIT_CITY_GUIDE_LIKE_URL,
      payload,
      { headers: this.headers },
    ).pipe(map(res => res));
  }
}