import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import {
  CompanyService,
  LocalService,
} from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { environment } from "@env/environment";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { SafeContentHtmlPipe } from "@lib/pipes";
import { TikTokLandingBoxedComponent } from "../landing-boxed/landing-boxed.component";
import { TikTokLandingFullWidthComponent } from "../landing-full-width/landing-full-width.component";
import { NoAccessComponent } from "@share/components";
import get from "lodash/get";

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    SafeContentHtmlPipe,
    TikTokLandingBoxedComponent,
    TikTokLandingFullWidthComponent,
    NoAccessComponent,
  ],
  templateUrl: "./landing.component.html"
})
export class TikTokLandingComponent {
  private destroy$ = new Subject<void>();

  @Input() slug: any;

  languageChangeSubscription;
  userId: any;
  companyId: any;
  language: any;
  isloading: boolean = true;
  companies: any;
  primaryColor: any;
  buttonColor: any;
  company: any;
  domain: any;
  landingPage: any;
  selectedLayout: any = 'boxed';
  selectedBackgroundColor: any = '#ffffff';
  selectedTextColor: any = '#000000';
  expandedOption: any = 'theme';
  activateBanner: boolean = true;
  activateSection1: boolean = true;
  activateSection2: boolean = true;
  activateSection3: boolean = true;
  section1Text: any;
  section2Text: any;
  section3Text: any;
  bannerImage: any;
  landingPageTemplateFileName: any;
  activateSection1QuestionCTA: boolean = false;
  section1QuestionCTAText: any;
  section1QuestionCTAColor: any;
  section1QuestionCTATextColor: any;
  activateSection2QuestionCTA: boolean = false;
  section2QuestionCTAText: any;
  section2QuestionCTAColor: any;
  section2QuestionCTATextColor: any;
  activateSection3QuestionCTA: boolean = false;
  section3QuestionCTAText: any;
  section3QuestionCTAColor: any;
  section3QuestionCTATextColor: any;
  bannerImageName: any;
  isLoading: boolean = true;

  constructor(
    private _router: Router,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
  ) {}

  async ngOnInit() {
    this.language =
      this._localService.getLocalStorage(environment.lslanguage) || "es";
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(
      environment.lscompanyId
    );
    this._translateService.use(this.language || "es");

    this.companies = this._localService.getLocalStorage(environment.lscompanies)
      ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies))
      : "";
    if (!this.companies) {
      this.companies = get(
        await this._companyService.getCompanies().toPromise(),
        "companies"
      );
    }
    let company = this._companyService.getCompany(this.companies);
    if (company && company[0]) {
        this.domain = company[0].domain
        this.companyId = company[0].id
        this.domain = company[0].domain
        this.primaryColor = company[0].primary_color
        this.buttonColor = company[0].button_color ? company[0].button_color : company[0].primary_color
    }

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.initializePage();
        }
      );

    this.initializePage();
  }

  initializePage() {
    this.fetchLandingData();
  }

  fetchLandingData() {
    this._companyService.getLandingPageBySlug(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
            this.landingPage = data?.landing_page?.length > 0 ? data?.landing_page[0] : '';
            this.formatDetails();
        },
        error => {
          console.log(error)
        }
      )
  }

  formatDetails() {
    this.selectedLayout = this.landingPage?.layout || 'boxed';
    this.selectedBackgroundColor = this.landingPage?.background_color || '#ffffff';
    this.selectedTextColor = this.landingPage?.text_color || '#000000';
    this.activateBanner = this.landingPage?.banner == 1 || true;
    this.activateSection1 = this.landingPage?.section1 == 1 || (this.landingPage?.id > 0 ? this.landingPage?.section1 : true);
    this.activateSection2 = this.landingPage?.section2 == 1 || (this.landingPage?.id > 0 ? this.landingPage?.section2 : true);
    this.activateSection3 = this.landingPage?.section3 == 1 || (this.landingPage?.id > 0 ? this.landingPage?.section3 : true);
    this.section1Text = this.landingPage?.section1_text || '';
    this.section2Text = this.landingPage?.section2_text || '';
    this.section3Text = this.landingPage?.section3_text || '';
    if(this.landingPage?.banner_image) {
      this.bannerImageName = this.landingPage?.banner_image;
      this.bannerImage = `${environment.api}/get-landing-page-image/${this.landingPage?.banner_image}`;
    }
    this.activateSection1QuestionCTA = this.landingPage?.section1_cta == 1 ? true : false;
    this.section1QuestionCTAText = this.landingPage?.section1_cta_text || '';
    this.section1QuestionCTAColor = this.landingPage?.section1_cta_color || '';
    this.section1QuestionCTATextColor = this.landingPage?.section1_cta_text_color || '';
    this.activateSection2QuestionCTA = this.landingPage?.section2_cta == 1 ? true : false;
    this.section2QuestionCTAText = this.landingPage?.section2_cta_text || '';
    this.section2QuestionCTAColor = this.landingPage?.section2_cta_color || '';
    this.section2QuestionCTATextColor = this.landingPage?.section2_cta_text_color || '';
    this.activateSection3QuestionCTA = this.landingPage?.section3_cta == 1 ? true : false;
    this.section3QuestionCTAText = this.landingPage?.section3_cta_text || '';
    this.section3QuestionCTAColor = this.landingPage?.section3_cta_color || '';
    this.section3QuestionCTATextColor = this.landingPage?.section3_cta_text_color || '';
    this.isLoading = false;
  }

  redirectToCTALink(mode) {

  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}