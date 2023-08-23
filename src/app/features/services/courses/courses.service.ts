import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
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
}