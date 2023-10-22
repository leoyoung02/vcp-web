import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
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

  fetchTestimonial(id: number = 0, companyId: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${TESTIMONIAL_DETAILS_URL}/${id}/${companyId}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }
}