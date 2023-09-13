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
  FEATURE_URL,
  SUBFEATURES_MAPPING_URL,
  SUBFEATURE_OPTIONS_URL,
  SUBFEATURE_URL,
  FEATURE_NAME_EDIT_URL,
  SUBFEATURES_LIST_URL,
  SUBFEATURE_ACTIVATE_URL,
  SUBFEATURE_DEACTIVATE_URL,
  LANDING_TEMPLATE_URL,
  HOME_TEMPLATE_URL,
  MOBILE_LIMIT_SETTINGS_URL,
  CITIES_URL,
  SETTINGS_OPTIONS_URL,
  SETTING_CATEGORY_URL,
  PLANS_URL,
  PLANS_OTHER_DATA_URL,
  SUBFEATURE_OPTIONS_MAPPING_URL,
  STRIPE_CUSTOMER_PORTAL_URL,
  LISTS_MANAGEMENT_DATA_URL,
  REPORTS_DATA_URL,
  EDIT_TEAMS_REPORTS_URL,
} from "@lib/api-constants";
import { LocalService } from "@share/services/storage/local.service";
import { withCache } from '@ngneat/cashew';
import moment from 'moment';

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
      ...withCache(),
      headers: this.headers,
    });
  }

  getCompanyFeature(id, companyId) {
    return this._http.get(`${FEATURE_URL}/${id}/${companyId}`, { 
      headers: this.headers 
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

  getSubFeaturesCombined(id, companyId) {
    return this._http.get(`${SUBFEATURES_LIST_URL}/${id}/${companyId}`, {
      headers: this.headers,
    });
  }

  getSubfeature(id) {
    return this._http.get(`${SUBFEATURE_URL}//${id}`, { 
      headers: this.headers 
    });
  }

  getAllSubfeatureOptions() {
    return this._http.get(SUBFEATURE_OPTIONS_URL, { 
      headers: this.headers 
    });
  }

  getCompanySubFeatures(id, companyId) {
    return this._http.get(`${SUBFEATURES_URL}/${id}/${companyId}`, {
      headers: this.headers,
    });
  }

  getCompanySubfeatureMapping(payload) {
    return this._http.post(SUBFEATURES_MAPPING_URL, payload, { 
      headers: this.headers 
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

  editCompanyFeature(id, companyId, payload): Observable<any> {
    return this._http
      .post(`${FEATURE_NAME_EDIT_URL}/${id}/${companyId}`, payload, { 
        headers: this.headers 
      })
      .pipe(map(res => res));
  }

  activateSubfeature(id, companyId, subfeatureId, payload): Observable<any> {
    return this._http
      .post(`${SUBFEATURE_ACTIVATE_URL}/${id}/${companyId}/${subfeatureId}`, payload, { 
        headers: this.headers 
      }).pipe(map(res => res));
  }

  deactivateSubfeature(id, companyId, subfeatureId, payload): Observable<any> {
    return this._http.post(`${SUBFEATURE_DEACTIVATE_URL}/${id}/${companyId}/${subfeatureId}`, payload, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getLandingTemplateBySlug(slug): Observable<any> {
    return this._http.get(`${LANDING_TEMPLATE_URL}/${slug}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getHomeTemplate(id, companyId): Observable<any> {
    return this._http.get(`${HOME_TEMPLATE_URL}/${id}/${companyId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getMobileLimitSettingsAll(id): Observable<any> {
    return this._http.get(`${MOBILE_LIMIT_SETTINGS_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getCompanyCities(id): Observable<any> {
    return this._http.get(`${CITIES_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getOtherSettingsSectionOptionContent(option_id, section_id, company_id): Observable<any> {
    return this._http.get(`${SETTINGS_OPTIONS_URL}/${company_id}/${option_id}/${section_id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getCategorySetting(id): Observable<any> {
    return this._http.get(`${SETTING_CATEGORY_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getSubfeatureOptionMapping(id, featureId, companyId): Observable<any> {
    return this._http.get(`${SUBFEATURE_OPTIONS_MAPPING_URL}/${id}/${featureId}/${companyId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  createOtherCustomerPortal(userId, companyId, objectId, object, type, payload): Observable<any> {
    return this._http.post(`${STRIPE_CUSTOMER_PORTAL_URL}/${userId}/${companyId}/${objectId}/${object}/${type}`,
      payload
    ).pipe(
      map(res => {
        const result = res
        return result;
      })
    );
  }

  fetchAdministrarData(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${LISTS_MANAGEMENT_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchReportsData(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${REPORTS_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getReportData(id, type, start_date, end_date, period, year, campus, title) {
    let params = `start_date=${moment(start_date).format('YYYY-MM-DD')}&end_date=${moment(end_date).format('YYYY-MM-DD')}&period=${period}&year=${year}&campus=${campus}&title=${title}`
  
    let url
    switch(type) {
      case 'joined':
        url = `/company/reports/activities/joined/donut/${id}?${params}`
        break
      case 'clicks': 
        url = `/company/reports/activities/clicked/${id}?${params}`
        break
      case 'attended': 
        url = `/company/reports/activities/teams/${id}`
        break
      case 'clubs-joined': 
        url = `/company/reports/clubs/joined/donut/${id}?${params}`
        break
      case 'clubs-generated':
        url = `/company/reports/clubs/activities/generated/donut/${id}?${params}`
        break
      case 'joined-generated':
        url = `/company/reports/clubs/activities/generated/joined/donut/${id}?${params}`
        break
      case 'offers-joined':
        url = `/company/reports/canal-empleo/joined/${id}?${params}`
        break
      case 'offer-clicks':
        url = `/company/reports/canal-empleo/clicked/${id}?${params}`
        break
      case 'teams-attended':
        url = `/company/reports/activities/teams-msgraph/${id}/attended?${params}`
        break
      case 'teams-audio-time':
        url = `/company/reports/activities/teams-msgraph/${id}/audio-time?${params}`
        break
      case 'teams-video-time':
        url = `/company/reports/activities/teams-msgraph/${id}/video-time?${params}`
        break
      case 'teams-clicks':
        url = `/company/reports/activities/teams/${id}?${params}`
        break
    }

    return this._http.get(
      environment.api + url,
      { headers: this.headers }
    ).pipe(map(res => res))
  }

  getExportData(url) {
    return this._http.get(
      environment.api + url,
      { headers: this.headers }
    ).pipe(map(res => res))
  }

  updateTeamsGraphSettings(id, payload): Observable<any> {
    return this._http.post(`${EDIT_TEAMS_REPORTS_URL}/${id}`,
      payload,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  getReportDetailsData(id, type, datapoint, date: any = '', area: any = '') {
    let url
    switch(type) {
      case 'joined':
        url = `/company/reports/activities/joined/details/${id}/${datapoint}`
        break
      case 'clicks': 
        url = `/company/reports/activities/clicked/details/${id}/${date}/${datapoint}`
        break
      case 'attended': 
        url = `/company/reports/activities/teams/${id}`
        break
      case 'clubs-joined': 
        url = `/company/reports/clubs/joined/details/${id}/${datapoint}`
        break
      case 'clubs-generated':
        url = `/company/reports/clubs/activities/generated/details/${id}/${datapoint}`
        break
      case 'joined-generated':
        url = `/company/reports/clubs/activities/generated/joined/details/${id}/${datapoint}`
        break
      case 'offers-joined':
        url = `/company/reports/canal-empleo/joined/details/${id}/${area}/${datapoint}`
        break
      case 'offer-clicks':
        url = `/company/reports/canal-empleo/clicked/details/${id}/${area}/${datapoint}`
        break
      case 'cityagenda-clicks':
        url = `/company/reports/city-agenda/clicked/details/${id}/${date}/${datapoint}`
        break
      case 'teams-attended':
        let period = localStorage.getItem('period')
        if(period) {
          url = `/company/reports/activities/teams-msgraph/details/${id}/attended/${date}/${datapoint}?period_selected=${period}`
        } else {
          url = `/company/reports/activities/teams-msgraph/details/${id}/attended/${date}/${datapoint}`
        }
        break
      case 'teams-audio-time':
        url = `/company/reports/activities/teams-msgraph/details/${id}/audio-time/${date}/${datapoint}`
        break
      case 'teams-video-time':
        url = `/company/reports/activities/teams-msgraph/details/${id}/video-time/${date}/${datapoint}`
        break
      case 'teams-clicks':
        url = `/company/reports/activities/teams/details/${id}/${date}/${datapoint}`
        break
      case 'mentor-mentee-associations':
        url = `/company/reports/mentors/associations/details/${id}/${datapoint}`
        break
      case 'mentor-active-conversations':
        url = `/company/reports/mentors/conversations/details/${id}/${datapoint}`
        break
      case 'mentee-mentor-associations':
        url = `/company/reports/mentees/associations/details/${id}/${datapoint}`
        break
      case 'mentee-active-conversations':
        url = `/company/reports/mentees/conversations/details/${id}/${datapoint}`
        break
    }

    return this._http.get(
      environment.api + url,
      { headers: this.headers }
    ).pipe(map(res => res))
  }
}
