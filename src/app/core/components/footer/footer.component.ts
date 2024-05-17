import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChange,
  inject,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { PACKAGE_JSON, providePackageJson } from "src/app/core/providers";
import { LogoComponent } from "../logo/logo.component";
import { LocalService } from "src/app/share/services";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { 
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import {
  LangChangeEvent,
  TranslateService,
  TranslateModule,
} from "@ngx-translate/core";
import { environment } from "@env/environment";
import { COMPANY_IMAGE_URL } from "@lib/api-constants";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FontAwesomeModule, LogoComponent],
  providers: [providePackageJson()],
  templateUrl: "./footer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input() menus: any;
  @Input() company: any;
  @Input() contactUsDetails: any;
  @Input() customLinks: any;

  readonly packageJson = inject(PACKAGE_JSON);
  readonly currentYear = new Date().getFullYear();

  envelopeIcon = faEnvelope;
  logoSrc: string = COMPANY_IMAGE_URL;
  language: any;
  companyName: any;
  domain: any;
  primaryColor: any;
  buttonColor: any;
  menuColor: any;
  footerBackgroundColor: any;
  footerTextColor: any;
  footerLogowidth: any;
  footerLogoHeight: any;
  companyId: any;
  companies: any;
  termsAndConditions: any;
  termsAndConditionsEn: any;
  termsAndConditionsFr: any;
  termsAndConditionsEu: any;
  termsAndConditionsCa: any;
  termsAndConditionsDe: any;
  privacyPolicy: any;
  privacyPolicyEn: any;
  privacyPolicyFr: any;
  privacyPolicyEu: any;
  privacyPolicyCa: any;
  privacyPolicyDe: any;
  cookiePolicy: any;
  cookiePolicyEn: any;
  cookiePolicyFr: any;
  cookiePolicyEu: any;
  cookiePolicyCa: any;
  cookiePolicyDe: any;
  termsAndConditionsURL: any;
  termsAndConditionsURLEn: any;
  termsAndConditionsURLFr: any;
  termsAndConditionsURLEu: any;
  termsAndConditionsURLCa: any;
  termsAndConditionsURLDe: any;
  privacyPolicyURL: any;
  privacyPolicyURLEn: any;
  privacyPolicyURLFr: any;
  privacyPolicyURLEu: any;
  privacyPolicyURLCa: any;
  privacyPolicyURLDe: any;
  cookiePolicyURL: any;
  cookiePolicyURLEn: any;
  cookiePolicyURLFr: any;
  cookiePolicyURLEu: any;
  cookiePolicyURLCa: any;
  cookiePolicyURLDe: any;
  canShowTermsAndConditions: boolean = false;
  canShowPrivacyPolicy: boolean = false;
  canShowCookiePolicy: boolean = false;
  isLoading: boolean = true;
  languageChangeSubscription;
  additionalLinks: any = [];

  constructor(
    private _router: Router,
    private _localService: LocalService,
    private _translateService: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChange) {
    let customLinksChange = changes["customLinks"];
    if (customLinksChange?.currentValue?.length > 0) {
      let links = customLinksChange.currentValue;
      this.additionalLinks = links;
    }
  }

  async ngOnInit() {
    this.language = this._localService.getLocalStorage(environment.lslang) || "es";
    this.companyId = this._localService.getLocalStorage(environment.lscompanyId);
    this._translateService.use(this.language || "es");
    this.isLoading = false;

    this.languageChangeSubscription = this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
      this.rerenderLinks();
    });

    this.companyId = this.company?.id;
    this.logoSrc = `${COMPANY_IMAGE_URL}/${this.company?.image}`;
    this.primaryColor = this.company.primary_color;
    this.buttonColor = this.company.button_color
      ? this.company.button_color
      : this.company.primary_color;
    this.menuColor = this.company.menu_color
      ? this.company.menu_color
      : "#ffffff";
    this.footerBackgroundColor = this.company.footer_background_color
      ? this.company.footer_background_color
      : this.company.primary_color;
    this.footerTextColor = this.company.footer_text_color
      ? this.company.footer_text_color
      : this.company.primary_color;
    this.termsAndConditions = this.company.terms_and_conditions;
    this.termsAndConditionsEn = this.company.terms_and_conditions_en;
    this.termsAndConditionsFr = this.company.terms_and_conditions_fr;
    this.termsAndConditionsEu = this.company.terms_and_conditions_eu;
    this.termsAndConditionsCa = this.company.terms_and_conditions_ca;
    this.termsAndConditionsDe = this.company.terms_and_conditions_de;
    this.privacyPolicy = this.company.policy;
    this.privacyPolicyEn = this.company.policy_en;
    this.privacyPolicyFr = this.company.policy_fr;
    this.privacyPolicyEu = this.company.policy_eu;
    this.privacyPolicyCa = this.company.policy_ca;
    this.privacyPolicyDe = this.company.policy_de;
    this.cookiePolicy = this.company.cookie_policy;
    this.cookiePolicyEn = this.company.cookie_policy_en;
    this.cookiePolicyFr = this.company.cookie_policy_fr;
    this.cookiePolicyEu = this.company.cookie_policy_eu;
    this.cookiePolicyCa = this.company.cookie_policy_ca;
    this.cookiePolicyDe = this.company.cookie_policy_de;
    this.termsAndConditionsURL = this.company.terms_and_conditions_url;
    this.termsAndConditionsURLEn = this.company.terms_and_conditions_url_en;
    this.termsAndConditionsURLFr = this.company.terms_and_conditions_url_fr;
    this.termsAndConditionsURLEu = this.company.terms_and_conditions_url_eu;
    this.termsAndConditionsURLCa = this.company.terms_and_conditions_url_ca;
    this.termsAndConditionsURLDe = this.company.terms_and_conditions_url_de;
    this.privacyPolicyURL = this.company.privacy_policy_url;
    this.privacyPolicyURLEn = this.company.privacy_policy_url_en;
    this.privacyPolicyURLFr = this.company.privacy_policy_url_fr;
    this.privacyPolicyURLEu = this.company.privacy_policy_url_eu;
    this.privacyPolicyURLCa = this.company.privacy_policy_url_ca;
    this.privacyPolicyURLDe = this.company.privacy_policy_url_de;
    this.cookiePolicyURL = this.company.cookie_policy_url;
    this.cookiePolicyURLEn = this.company.cookie_policy_url_en;
    this.cookiePolicyURLFr = this.company.cookie_policy_url_fr;
    this.cookiePolicyURLEu = this.company.cookie_policy_url_eu;
    this.cookiePolicyURLCa = this.company.cookie_policy_url_ca;
    this.cookiePolicyURLDe = this.company.cookie_policy_url_de;
    this.canShowTermsAndConditions =
      this.company.show_terms == 1 ? true : false;
    this.canShowPrivacyPolicy =
      this.company.show_privacy_policy == 1 ? true : false;
    this.canShowCookiePolicy =
      this.company.show_cookie_policy == 1 ? true : false;
    this.footerTextColor = this.company.footer_text_color;
    this.footerBackgroundColor = this.company.footer_background_color;
    this.footerLogoHeight = this.company.footer_logo_height || 50;
    this.footerLogowidth = this.company.footer_logo_width || 180;
  }

  rerenderLinks() {
    this.isLoading = true;
    this.isLoading = false;
  }

  openTermsAndConditions() {
    if (!this.canShowTermsAndConditions && this.termsAndConditionsURL) {
      let link =
        this.language == "en"
          ? this.termsAndConditionsURLEn
          : this.language == "fr"
          ? this.termsAndConditionsURLFr || this.termsAndConditionsURL
          : this.language == "eu"
          ? this.termsAndConditionsURLEu || this.termsAndConditionsURL
          : this.language == "ca"
          ? this.termsAndConditionsURLCa || this.termsAndConditionsURL
          : this.language == "de"
          ? this.termsAndConditionsURLDe || this.termsAndConditionsURL
          : this.termsAndConditionsURL;

      window.open(link, "_blank");
    } else {
      this._router.navigate(["/general/terms-and-conditions"]);
    }
  }

  openPrivacyPolicy() {
    if (!this.canShowPrivacyPolicy && this.privacyPolicyURL) {
      let link =
        this.language == "en"
          ? this.privacyPolicyURLEn
          : this.language == "fr"
          ? this.privacyPolicyURLFr || this.privacyPolicyURL
          : this.language == "eu"
          ? this.privacyPolicyURLEu || this.privacyPolicyURL
          : this.language == "ca"
          ? this.privacyPolicyURLCa || this.privacyPolicyURL
          : this.language == "de"
          ? this.privacyPolicyURLDe || this.privacyPolicyURL
          : this.privacyPolicyURL;

      window.open(link, "_blank");
    } else {
      this._router.navigate(["/general/privacy-policy"]);
    }
  }

  openCookiePolicy() {
    if (!this.canShowCookiePolicy && this.cookiePolicyURL) {
      let link =
        this.language == "en"
          ? this.cookiePolicyURLEn
          : this.language == "fr"
          ? this.cookiePolicyURLFr || this.cookiePolicyURL
          : this.language == "eu"
          ? this.cookiePolicyURLEu || this.cookiePolicyURL
          : this.language == "ca"
          ? this.cookiePolicyURLCa || this.cookiePolicyURL
          : this.language == "de"
          ? this.cookiePolicyURLDe || this.cookiePolicyURL
          : this.cookiePolicyURL;

      window.open(link, "_blank");
    } else {
      this._router.navigate(["/general/cookie-policy"]);
    }
  }

  getMenuTitle(menu) {
    return this.language == "en"
      ? menu.name
      : this.language == "fr"
      ? menu.name_FR || menu.name_ES
      : this.language == "eu"
      ? menu.name_EU || menu.name_ES
      : this.language == "ca"
      ? menu.name_CA || menu.name_ES
      : this.language == "de"
      ? menu.name_DE || menu.name_ES
      : menu.name_ES;
  }

  getContactUsText(contact_us) {
    return this.language == "en"
      ? contact_us.text
      : this.language == "fr"
      ? contact_us.text_fr || contact_us.text
      : this.language == "eu"
      ? contact_us.text_eu || contact_us.text
      : this.language == "ca"
      ? contact_us.text_ca || contact_us.text
      : this.language == "de"
      ? contact_us.text_de || contact_us.text
      : contact_us.text;
  }

  getLinkText(link) {
    return this.language == "en"
      ? link.text_en 
      : link.text_es
  }

  getTermsAndConditionsText() {
    let str = this._translateService.instant('footer.terms_and_conditions')?.toLowerCase();
    return str ? str[0].toUpperCase() + str.slice(1) : '';
  }

  getPrivacyPolicyText() {
    let str = this._translateService.instant('footer.privacy_policy')?.toLowerCase();
    return str ? str[0].toUpperCase() + str.slice(1) : '';
  }

  getCookiePolicyText() {
    let str = this._translateService.instant('footer.cookies_policy')?.toLowerCase();
    return str ? str[0].toUpperCase() + str.slice(1) : '';
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
  }
}
