import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  ADD_TESTIMONIAL_URL,
  DELETE_TESTIMONIAL_URL,
  EDIT_TESTIMONIAL_URL,
  TESTIMONIALS_DATA_URL,
  TESTIMONIALS_URL, TESTIMONIAL_DETAILS_URL,
} from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";

@Injectable({
  providedIn: "root",
})
export class TestimonialsService {
  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  fetchTestimonials(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${TESTIMONIALS_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchTestimonialsData(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${TESTIMONIALS_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchTestimonial(id: number = 0, companyId: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${TESTIMONIAL_DETAILS_URL}/${id}/${companyId}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  addTestimonial(payload): Observable<any> {
    return this._http.post(
      ADD_TESTIMONIAL_URL,
      payload,
    ).pipe(map(res => res));
  }

  editTestimonial(id, payload): Observable<any> {
    return this._http.post(
      `${EDIT_TESTIMONIAL_URL}/${id}`,
      payload,
    ).pipe(map(res => res));
  }

  deleteTestimonial(id): Observable<any> {
    return this._http.post(`${DELETE_TESTIMONIAL_URL}/${id}`,
      {},
      { headers: this.headers }
    ).pipe(map(res => res));
  }
}