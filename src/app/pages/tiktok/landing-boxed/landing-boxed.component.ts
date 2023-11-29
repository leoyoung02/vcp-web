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
import { Subject } from "rxjs";
import { environment } from "@env/environment";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { SafeContentHtmlPipe } from "@lib/pipes";
import get from "lodash/get";

@Component({
  selector: "app-landing-boxed",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    SafeContentHtmlPipe,
  ],
  templateUrl: "./landing-boxed.component.html",
})
export class TikTokLandingBoxedComponent {
  private destroy$ = new Subject<void>();

  languageChangeSubscription;
  userId: any;
  companyId: any;
  language: any;
  companies: any;
  primaryColor: any;
  buttonColor: any;
  company: any;
  domain: any;

  @Input() selectedLayout: any;
  @Input() selectedBackgroundColor: any;
  @Input() selectedTextColor: any;
  @Input() activateBanner: any;
  @Input() activateSection1: any;
  @Input() activateSection2: any;
  @Input() activateSection3: any;
  @Input() section1Text: any;
  @Input() section2Text: any;
  @Input() section3Text: any;
  @Input() bannerImage: any;
  @Input() activateSection1QuestionCTA: any;
  @Input() section1QuestionCTAText: any;
  @Input() section1QuestionCTAColor: any;
  @Input() section1QuestionCTATextColor: any;
  @Input() activateSection2QuestionCTA: any;
  @Input() section2QuestionCTAText: any;
  @Input() section2QuestionCTAColor: any;
  @Input() section2QuestionCTATextColor: any;
  @Input() activateSection3QuestionCTA: any;
  @Input() section3QuestionCTAText: any;
  @Input() section3QuestionCTAColor: any;
  @Input() section3QuestionCTATextColor: any;
  @Input() slug: any;

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
    
  }

  redirectToCTALink(mode) {
    this._router.navigate([`/tiktok/questions/${this.slug}`]);
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}