import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MEMBERS_COMBINED_URL, MEMBER_COMBINED_URL } from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";

@Injectable({
  providedIn: "root",
})
export class MembersService {
  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  fetchMembers(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${MEMBERS_COMBINED_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchMember(id: number = 0, companyId: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${MEMBER_COMBINED_URL}/${id}/${companyId}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }
}