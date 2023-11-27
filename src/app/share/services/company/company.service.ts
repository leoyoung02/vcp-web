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
  MANAGE_MEMBER_TYPES_DATA_URL,
  EDIT_MEMBER_TYPE_SEQUENCE_URL,
  DELETE_MEMBER_TYPE_URL,
  GENERATE_MEMBER_TYPE_LINK_URL,
  EDIT_MEMBER_TYPE_URL,
  ADD_MEMBER_TYPE_URL,
  SAVE_MEMBER_TYPE_PERMISSIONS_URL,
  DELETE_MEMBER_TYPE_FIELD_URL,
  EDIT_MEMBER_TYPE_FIELD_URL,
  ADD_MEMBER_TYPE_FIELD_URL,
  MEMBER_TYPE_PROFILE_FIELDS_URL,
  DELETE_CITY_URL,
  EDIT_CITY_URL,
  ADD_CITY_URL,
  MANAGE_SETTINGS_DATA_URL,
  MANAGE_SETTINGS_EMAIL_DATA_URL,
  EDIT_EMAIL_URL,
  EDIT_MEMBER_EMAIL_URL,
  ACTIVATE_OTHER_SETTING_URL,
  DEACTIVATE_OTHER_SETTING_URL,
  UPLOAD_EMAIL_IMAGE_URL,
  SAVE_NEW_BUTTON_MENU_URL,
  EDIT_MENU_ORDER_URL,
  EDIT_PRIVACY_POLICY_URL,
  EDIT_COOKIE_POLICY_URL,
  EDIT_TERMS_AND_CONDITIONS_URL,
  EDIT_TERMS_URL,
  EDIT_POLICY_URL,
  EDIT_COOKIE_URL,
  ACTIVATE_POLICY_URL,
  ACTIVATE_COOKIE_URL,
  ACTIVATE_TERMS_URL,
  EDIT_OTHER_SETTING_VALUE_URL,
  EDIT_COMPANY_FAVICON_URL,
  EDIT_COMPANY_BANNER_IMAGE_URL,
  EDIT_COMPANY_HEADER_IMAGE_URL,
  EDIT_COMPANY_LOGO_URL,
  ADD_COMPANY_BANNER_URL,
  ADD_COMPANY_LOGO_URL,
  HOME_DATA_URL,
  HOME_COURSES_TUTORS_TESTIMONIALS_DATA_URL,
  SECTORS_URL,
  AS_SECTORS_URL,
  EDIT_HOME_VIDEO_SETTINGS_URL,
  EDIT_HOME_MODULE_SETTINGS_URL,
  CONTRACTS_URL,
  EDIT_CONDITIONS_URL,
  HOME_PLANS_COURSES_DATA_URL,
  STRIPE_ACCOUNTS_URL,
  UPDATE_STRIPE_ACCOUNT_STATUS_URL,
  DELETE_STRIPE_ACCOUNT_URL,
  STRIPE_WEBHOOKS_URL,
  ADD_STRIPE_WEBHOOK_URL,
  EDIT_STRIPE_ACCOUNT_URL,
  ADD_STRIPE_ACCOUNT_URL,
  LEADS_QUESTIONS_URL,
  CREATE_LEADS_QUESTION_URL,
  EDIT_LEADS_QUESTION_URL,
  DELETE_LEADS_QUESTION_URL,
  CREATE_LEADS_QUESTION_ITEM_URL,
  EDIT_LEADS_QUESTION_ITEM_URL,
  DELETE_LEADS_QUESTION_ITEM_URL,
  DELETE_LEADS_QUESTION_MULTIPLE_CHOICE_OPTION_URL,
  EDIT_LEADS_QUESTION_MULTIPLE_CHOICE_OPTION_URL,
  CREATE_LEADS_QUESTION_MULTIPLE_CHOICE_OPTION_URL,
  CREATE_LEADS_QUESTION_RULE_URL,
  EDIT_LEADS_QUESTION_RULE_URL,
  DELETE_LEADS_QUESTION_RULE_URL,
  LEADS_LANDING_PAGES_URL,
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
    let host = window.location.host;
    let customer =
      this.customers &&
      this.customers.find(
        (c) => c.url == host || c.url == environment.company
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

  fetchManageMemberTypesData(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${MANAGE_MEMBER_TYPES_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  editProfileFieldSequence(params): Observable<any> {
    return this._http.post(EDIT_MEMBER_TYPE_SEQUENCE_URL,
        params
    ).pipe(map(res => res));
  }

  deleteCustomMemberType(id): Observable<any> {
    return this._http.post(`${DELETE_MEMBER_TYPE_URL}/${id}`, 
        {}
    ).pipe(map(res => res))
  }

  generateCartLink(payload): Observable<any> {
    return this._http.post(GENERATE_MEMBER_TYPE_LINK_URL,
      payload,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  addCustomMemberType(fd): Observable<any> {
    return this._http.post(ADD_MEMBER_TYPE_URL, 
        fd
    ).pipe(map(res => res))
  }

  editCustomMemberType(id, payload): Observable<any> {
    return this._http.post(`${EDIT_MEMBER_TYPE_URL}/${id}`, 
        payload
    ).pipe(map(res => res))
  }

  manageCustomMemberTypePermissions(payload): Observable<any> {
    return this._http.post(SAVE_MEMBER_TYPE_PERMISSIONS_URL, 
        payload
    ).pipe(map(res => res))
  }

  addMemberTypeCustomProfileFields(payload): Observable<any> {
    return this._http.post(ADD_MEMBER_TYPE_FIELD_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  updateMemberTypeCustomProfileFields(payload): Observable<any> {
    return this._http.post(EDIT_MEMBER_TYPE_FIELD_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  deleteMemberTypeCustomProfileFields(payload): Observable<any> {
    return this._http.post(DELETE_MEMBER_TYPE_FIELD_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  getCustomProfileFields(id): Observable<any> {
    return this._http.get(`${MEMBER_TYPE_PROFILE_FIELDS_URL}/${id}`,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  addCompanyCity(payload): Observable<any> {
    return this._http.post(ADD_CITY_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  editCompanyCity(id, payload): Observable<any> {
    return this._http.post(
        `${EDIT_CITY_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  deleteCompanyCity(id): Observable<any> {
    return this._http.post(`${DELETE_CITY_URL}/${id}`,
        {},
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  fetchManageSettingsData(id: number = 0, companyId: number = 0): Observable<any> {
    return this._http.get(`${MANAGE_SETTINGS_DATA_URL}/${id}/${companyId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchSettingsEmailData(id: number = 0, companyId: number = 0, type: string = ''): Observable<any> {
    return this._http.get(`${MANAGE_SETTINGS_EMAIL_DATA_URL}/${id}/${companyId}/${type}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  updateEmail(id, type, payload): Observable<any> {
    return this._http.post(`${EDIT_EMAIL_URL}/${id}/${type}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  updateMemberEmail(id, type, payload): Observable<any> {
    return this._http.post(`${EDIT_MEMBER_EMAIL_URL}/${id}/${type}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  activateOtherSetting(id, companyId, payload): Observable<any> {
    return this._http.post(
        `${ACTIVATE_OTHER_SETTING_URL}/${id}/${companyId}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  deactivateOtherSetting(id, companyId, payload): Observable<any> {
    return this._http.post(
        `${DEACTIVATE_OTHER_SETTING_URL}/${id}/${companyId}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  uploadNotificationImage(blob, filename): Observable<any> {
    const formData = new FormData();
    const file_name = 'email_' + this.getTimestamp();
    formData.append('filename', file_name + '.jpg')
    formData.append('image', blob, file_name + '.jpg');
    return this._http.post(UPLOAD_EMAIL_IMAGE_URL, formData);
  }

  getTimestamp() {
    const date = new Date();
    const timestamp = date.getTime();

    return timestamp;
  }

  saveNewMenuButton(payload): Observable<any> {
    return this._http.post(SAVE_NEW_BUTTON_MENU_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  updateMenuOrder(payload): Observable<any> {
    return this._http.post(EDIT_MENU_ORDER_URL,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  editPrivacyPolicyURL(id, payload): Observable<any> {
    return this._http.post(
        `${EDIT_PRIVACY_POLICY_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  editCookiePolicyURL(id, payload): Observable<any> {
    return this._http.post(
        `${EDIT_COOKIE_POLICY_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  editTermsAndConditionsURL(id, payload): Observable<any> {
    return this._http.post(
        `${EDIT_TERMS_AND_CONDITIONS_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  updateTermsAndConditions(id, payload): Observable<any> {
    return this._http.post(
        `${EDIT_TERMS_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  updatePrivatePolicy(id, payload): Observable<any> {
    return this._http.post(
        `${EDIT_POLICY_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  updateCookiePolicy(id, payload): Observable<any> {
    return this._http.post(
        `${EDIT_COOKIE_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  activatePrivacyPolicy(id, payload): Observable<any> {
    return this._http.post(
        `${ACTIVATE_POLICY_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  activateCookiePolicy(id, payload): Observable<any> {
    return this._http.post(
        `${ACTIVATE_COOKIE_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  activateTermsAndConditions(id, payload): Observable<any> {
    return this._http.post(
        `${ACTIVATE_TERMS_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  updateOtherSettingValue(id, payload): Observable<any> {
    return this._http.post(
        `${EDIT_OTHER_SETTING_VALUE_URL}/${id}`,
        payload,
        { headers: this.headers }
    ).pipe(map(res => res));
  }

  addCompanyLogo(fd) {
    return this._http.post(ADD_COMPANY_LOGO_URL, fd);
  }

  addCompanyBanner(fd) {
    return this._http.post(ADD_COMPANY_BANNER_URL, fd);
  }

  editCompanyLogo( id, logo): Observable<any> {
    let formData = new FormData()

    if (logo) {
        const filename = 'cl_' + this.getTimestamp();
        formData.append('image', logo.image, filename + '.jpg');
    }

    return this._http.post(`${EDIT_COMPANY_LOGO_URL}/${id}`,
        formData
    ).pipe(map(res => res))
  }

  editCompanyPhoto( id, logo): Observable<any> {
    let formData = new FormData()

    if (logo) {
        const filename = 'cl_' + this.getTimestamp();
        formData.append('image', logo.image, filename + '.jpg');
    }

    return this._http.post(`${EDIT_COMPANY_HEADER_IMAGE_URL}/${id}`,
        formData
    ).pipe(map(res => res))
  }

  editCompanyVideo( id, logo): Observable<any> {
    let formData = new FormData()

    if (logo) {
        const filename = 'cl_' + this.getTimestamp();
        formData.append('image', logo.image, filename + '.jpg');
    }

    return this._http.post(`${EDIT_COMPANY_BANNER_IMAGE_URL}/${id}`,
        formData
    ).pipe(map(res => res))
  }

  editCompanyFavicon( id, logo): Observable<any> {
    let formData = new FormData()

    if (logo) {
        const filename = 'cl_' + this.getTimestamp();
        formData.append('image', logo.image, filename + '.jpg');
    }

    return this._http.post(`${EDIT_COMPANY_FAVICON_URL}/${id}`,
        formData
    ).pipe(map(res => res))
  }

  fetchHomeData(id: number = 0): Observable<any> {
    return this._http.get(`${HOME_DATA_URL}/${id}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchHomeCoursesTutorsTestimonialsData(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${HOME_COURSES_TUTORS_TESTIMONIALS_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  fetchHomePlansCoursesData(id: number = 0, userId: number = 0): Observable<any> {
    return this._http.get(`${HOME_PLANS_COURSES_DATA_URL}/${id}/${userId}`, { 
      headers: this.headers 
    }).pipe(map(res => res));
  }

  getBusinessCategories(): Observable<any> {
    return this._http.get(AS_SECTORS_URL,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  getCompanyBusinessCategories(id): Observable<any> {
    return this._http.get(`${SECTORS_URL}/${id}`,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  updateHomeVideoSettings(params): Observable<any> {
    return this._http.put(EDIT_HOME_VIDEO_SETTINGS_URL,
        params,
    ).pipe(map(res => res));
  }

  updateHomeModuleSettings(params): Observable<any> {
    return this._http.put(EDIT_HOME_MODULE_SETTINGS_URL,
        params,
    ).pipe(map(res => res));
  }

  getCompanyContracts(id): Observable<any> {
    return this._http.get(`${CONTRACTS_URL}/${id}`,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  updateConditions(params): Observable<any> {
    return this._http.post(EDIT_CONDITIONS_URL,
        params,
    ).pipe(map(res => res));
  }

  getStripeAccounts(companyId){
    return this._http.get(`${STRIPE_ACCOUNTS_URL}/${companyId}`,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  toggleStripeAccountStatus(companyId, payload){
    return this._http.post(`${UPDATE_STRIPE_ACCOUNT_STATUS_URL}/${companyId}`,
      payload,
      { headers : this.headers }
    ).pipe(map(res => res));
  }

  getOtherStripeWebhooks(id, stripeId): Observable<any> {
    return this._http.get(`${STRIPE_WEBHOOKS_URL}/${id}/${stripeId}`,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  createOtherStripeWebhook(id, stripeId): Observable<any> {
    return this._http.get(`${ADD_STRIPE_WEBHOOK_URL}/${id}/${stripeId}`,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  addStripeAccount(companyId, payload){
    return this._http.post(
      `${ADD_STRIPE_ACCOUNT_URL}/${companyId}`,
      payload,
      { headers : this.headers }
    ).pipe(map(res => res));
  }

  editStripeAccount(companyId, payload){
    return this._http.post(`${EDIT_STRIPE_ACCOUNT_URL}/${companyId}`,
      payload,
      { headers : this.headers }
    ).pipe(map(res => res));
  }

  deleteStripeAccount(companyId, payload){
    return this._http.post(`${DELETE_STRIPE_ACCOUNT_URL}/${companyId}`,
      payload,
      { headers : this.headers }
    ).pipe(map(res => res));
  }

  getLeadsQuestions(companyId, userId): Observable<any> {
    return this._http.get(`${LEADS_QUESTIONS_URL}/${companyId}/${userId}`,
      { headers: this.headers }
    ).pipe(map(res => res));
  }

  addLeadsQuestion(payload): Observable<any> {
    return this._http.post(
      CREATE_LEADS_QUESTION_URL,
      payload,
    ).pipe(map(res => res));
  }

  editLeadsQuestion(id, payload): Observable<any> {
    return this._http.put(
      `${EDIT_LEADS_QUESTION_URL}/${id}`,
      payload,
    ).pipe(map(res => res));
  }

  deleteLeadsQuestion(id): Observable<any> {
    return this._http.delete(
      `${DELETE_LEADS_QUESTION_URL}/${id}`,
      {},
    ).pipe(map(res => res));
  }

  addLeadsQuestionItem(payload): Observable<any> {
    return this._http.post(
      CREATE_LEADS_QUESTION_ITEM_URL,
      payload,
    ).pipe(map(res => res));
  }

  editLeadsQuestionItem(id, payload): Observable<any> {
    return this._http.put(
      `${EDIT_LEADS_QUESTION_ITEM_URL}/${id}`,
      payload,
    ).pipe(map(res => res));
  }

  deleteLeadsQuestionItem(id): Observable<any> {
    return this._http.delete(
      `${DELETE_LEADS_QUESTION_ITEM_URL}/${id}`,
      {},
    ).pipe(map(res => res));
  }

  addLeadsQuestionMultipleChoice(payload): Observable<any> {
    return this._http.post(
      CREATE_LEADS_QUESTION_MULTIPLE_CHOICE_OPTION_URL,
      payload,
    ).pipe(map(res => res));
  }

  editLeadsQuestionMultipleChoice(id, payload): Observable<any> {
    return this._http.put(
      `${EDIT_LEADS_QUESTION_MULTIPLE_CHOICE_OPTION_URL}/${id}`,
      payload,
    ).pipe(map(res => res));
  }

  deleteLeadsQuestionMultipleChoice(id): Observable<any> {
    return this._http.delete(
      `${DELETE_LEADS_QUESTION_MULTIPLE_CHOICE_OPTION_URL}/${id}`,
      {},
    ).pipe(map(res => res));
  }

  addLeadsQuestionRule(payload): Observable<any> {
    return this._http.post(
      CREATE_LEADS_QUESTION_RULE_URL,
      payload,
    ).pipe(map(res => res));
  }

  editLeadsQuestionRule(id, payload): Observable<any> {
    return this._http.put(
      `${EDIT_LEADS_QUESTION_RULE_URL}/${id}`,
      payload,
    ).pipe(map(res => res));
  }

  deleteLeadsQuestionRule(id): Observable<any> {
    return this._http.delete(
      `${DELETE_LEADS_QUESTION_RULE_URL}/${id}`,
      {},
    ).pipe(map(res => res));
  }

  getLeadsLandingPages(companyId, userId): Observable<any> {
    return this._http.get(`${LEADS_LANDING_PAGES_URL}/${companyId}/${userId}`,
      { headers: this.headers }
    ).pipe(map(res => res));
  }
}