import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  CREDIT_PACKAGES_URL,
  TUTORS_URL,
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
    let url = `/company/credit/packages/${id}`

    return this._http.get(`${CREDIT_PACKAGES_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }
}