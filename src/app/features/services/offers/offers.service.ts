import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ADD_DISCOUNT_URL, DELETE_DISCOUNT_URL, EDIT_DISCOUNT_URL, OFFERS_COMBINED_URL, OFFERS_DATA_URL, OFFER_COMBINED_URL, SHARE_DISCOUNT_URL } from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";

@Injectable({
  providedIn: "root",
})
export class OffersService {
  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  fetchOffers(id: number = 0, userId: number = 0, mode: string = 'active'): Observable<any> {
    return this._http.get(`${OFFERS_COMBINED_URL}/${id}/${userId}/${mode}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchOffersData(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${OFFERS_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchOffer(id: number = 0, companyId: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${OFFER_COMBINED_URL}/${id}/${companyId}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getShareLink(userId, offerId): Observable<any> {
    return this._http.get(`${SHARE_DISCOUNT_URL}/${userId}/${offerId}`,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  addDiscount(payload): Observable<any> {
    return this._http.post(ADD_DISCOUNT_URL,
      payload,
    ).pipe(map(res => res));
  }

  editDiscount(id, payload): Observable<any> {
    return this._http.post(
      `${EDIT_DISCOUNT_URL}/${id}`,
      payload,
    ).pipe(map(res => res));
  }

  deleteDiscount(id): Observable<any> {
    return this._http.post(`${DELETE_DISCOUNT_URL}/${id}`,
        {},
        { headers: this.headers }
    ).pipe(map(res => res));
  }
}