import { Injectable, VERSION } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
import { Customer } from "@lib/interfaces";
import customersData from "src/assets/data/customers.json";
import {
  COMPANIES_URL,
  FEATURES_URL,
  SUBFEATURES_URL,
  CONFIRM_EMAIL_URL,
  OTHER_SETTINGS_URL,
  CONTACT_DETAILS_URL,
  CUSTOM_MEMBER_TYPE_PERMISSIONS_URL,
  LANGUAGES_URL,
  VERSION_URL,
  META_DESCRIPTION_URL,
  FEATURES_MAPPING_URL,
  FEATURE_MAPPING_URL,
  COUNTRIES_URL,
  MEMBER_PLANS_URL,
  MEMBER_PLANS_LIST_URL,
  STRIPE_PK_URL,
  MEMBER_PLAN_SUBSCRIPTION_URL,
  SETTINGS_CATEGORY_URL,
  FEATURE_SUBFEATURES_URL,
  OTHER_SETTINGS_CATEGORY_URL,
  EDIT_EMAIL_SETTINGS_URL,
  FEATURES_LIST_URL,
  MANAGE_COMPANY_FEATURE_URL,
} from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";
import { withCache } from '@ngneat/cashew';

@Injectable({
  providedIn: "root",
})
export class CompanyService {
  customers: Customer[] = customersData;
  language = "es";
  languageValue = new BehaviorSubject<string>(this.language);
  currentLanguage = this.languageValue.asObservable();

  private headers: HttpHeaders;

  constructor(private _http: HttpClient, private _localService: LocalService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  changeLanguage(lang: string) {
    this.languageValue.next(lang);
  }

  getCompanies(): Observable<any> {
    return this._http
      .get(COMPANIES_URL, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getCompany(companies): any {
    let company = [];
    let customer =
      this.customers &&
      this.customers.find(
        (c) => c.url == window.location.host || c.url == environment.company
      );
    if (customer) {
      company =
        companies &&
        companies.filter((c) => {
          return c.url == customer?.url || c.alternative_url == customer?.url;
        });
      if (company && company.length > 0) {
        this._localService.setLocalStorage(
          environment.lscompanies,
          company ? JSON.stringify(company) : ""
        );
      }
    }

    return company;
  }

  getFeatures(domain) {
    return this._http.get(`${FEATURES_URL}/${domain}`, {
      headers: this.headers,
    });
  }

  getFeaturesList(domain) {
    return this._http.get(`${FEATURES_LIST_URL}/${domain}`, {
      // ...withCache({
      //   version: 'v1',
      //   key: 'vcp'
      // }),
      headers: this.headers,
    });
  }

  getCompanyFeatureMapping(companyId) {
    return this._http.get(`${FEATURE_MAPPING_URL}/${companyId}`, {
      headers: this.headers,
    });
  }

  getSubFeatures(id) {
    return this._http.get(`${FEATURE_SUBFEATURES_URL}/${id}`, {
      headers: this.headers,
    });
  }

  getCompanySubFeatures(id, companyId) {
    return this._http.get(`${SUBFEATURES_URL}/${id}/${companyId}`, {
      headers: this.headers,
    });
  }

  checkConfirmEmail(payload): Observable<any> {
    return this._http
      .post(CONFIRM_EMAIL_URL, payload, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getOtherSettings(id) {
    return this._http
      .get(`${OTHER_SETTINGS_URL}/${id}`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getOtherSettingsCategories() {
    return this._http.get(OTHER_SETTINGS_CATEGORY_URL, {
      headers: this.headers,
    });
  }

  getContactUsDetails(id) {
    return this._http.get(`${CONTACT_DETAILS_URL}/${id}`, {
      headers: this.headers,
    });
  }

  getCustomMemberTypePermissionsNew(id, companyId): Observable<any> {
    return this._http
      .get(`${CUSTOM_MEMBER_TYPE_PERMISSIONS_URL}/${id}/${companyId}`, {
        headers: this.headers,
      })
      .pipe(map((res) => res));
  }

  getLanguages(id): Observable<any> {
    return this._http
      .get(`${LANGUAGES_URL}/${id}`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getVersion(): Observable<any> {
    return this._http
      .get(VERSION_URL, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getMetaDescription(id): Observable<any> {
    return this._http
      .get(`${META_DESCRIPTION_URL}/${id}`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getSubfeaturesCombined(companyId, featureId) {
    return this._http
      .get(`${FEATURES_MAPPING_URL}/${companyId}/${featureId}`, {
        headers: this.headers,
      })
      .pipe(map((res) => res));
  }

  getCountries(): Observable<any> {
    return this._http
      .get(COUNTRIES_URL, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getPricingDetails(id): Observable<any> {
    return this._http
      .get(`${MEMBER_PLANS_URL}/${id}`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getCustomMemberTypePermissionsList(id): Observable<any> {
    return this._http
      .get(`${MEMBER_PLANS_LIST_URL}/${id}`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getStripePublishableKey(companyId): Observable<any> {
    return this._http
      .get(`${STRIPE_PK_URL}/${companyId}`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getMemberPlanSubscription(id): Observable<any> {
    return this._http
      .get(`${MEMBER_PLAN_SUBSCRIPTION_URL}/${id}`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getAllCategorySettingsList() {
    return this._http.get(SETTINGS_CATEGORY_URL, { headers: this.headers });
  }

  editEmailSettings(id, payload): Observable<any> {
    return this._http
      .post(`${EDIT_EMAIL_SETTINGS_URL}/${id}`, payload, {
        headers: this.headers,
      })
      .pipe(map((res) => res));
  }

  manageCompanyFeature(payload): Observable<any> {
    return this._http
      .post(MANAGE_COMPANY_FEATURE_URL, payload, {
        headers: this.headers,
      })
      .pipe(map((res) => res));
  }
}
