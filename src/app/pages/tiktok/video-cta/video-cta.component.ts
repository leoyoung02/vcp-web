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
import { DomSanitizer } from '@angular/platform-browser';
import get from "lodash/get";

@Component({
  selector: "app-video-cta",
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
  templateUrl: "./video-cta.component.html"
})
export class TikTokVideoCTAComponent {
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
  activateVideo: boolean = false;
  activateDescription: boolean = false;
  activateCTA: boolean = false;
  descriptionTextColor: any;
  descriptionText: any;
  videoEmbed: any;
  CTAText: any;
  CTAButtonColor: any;
  CTATextColor: any;
  videoCTA: any;
  updatedVideo: any;
  updatedCode: any;
  isLoading: boolean = true;
  CTALink: any;

  constructor(
    private _router: Router,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private sanitizer: DomSanitizer,
  ) {}

  async ngOnInit() {
    this.language = this._localService.getLocalStorage(environment.lslanguage) || "es";
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(environment.lscompanyId);
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
    this._companyService.getVideoCTABySlug(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.videoCTA = data?.video_cta?.length > 0 ? data?.video_cta[0] : '';
          this.formatDetails();
        },
        error => {
          console.log(error)
        }
      )
  }

  formatDetails() {
    this.activateDescription = this.videoCTA?.description == 1 ? true : false;
    this.descriptionTextColor = this.videoCTA?.description_text_color || '#000000';
    this.descriptionText = this.videoCTA?.description_text;
    this.activateVideo = this.videoCTA?.video == 1 ? true : false;
    this.videoEmbed = this.videoCTA?.video_embed;
    if(this.activateVideo && this.videoEmbed) {
      this.getSafeLessonURL();
    }
    this.activateCTA = this.videoCTA?.cta == 1 ? true : false;
    this.CTAText = this.videoCTA?.cta_text || '';
    this.CTAButtonColor = this.videoCTA?.cta_button_color || '';
    this.CTATextColor = this.videoCTA?.cta_button_text_color || '';
    this.CTALink = this.videoCTA?.cta_link || '';
    this.isLoading = false;
  }

  getSafeLessonURL() {
    let url = this.videoEmbed?.replace('watch?v=', 'embed/');
    if(url && url.indexOf("&") > 0) {
      url = url.substring(0, url.indexOf("&"));
    }
    if(this.videoEmbed?.indexOf('vimeo') >= 0 && this.videoEmbed?.indexOf('iframe') < 0) {
      url = this.videoEmbed?.replace('vimeo.com/', 'player.vimeo.com/video/');
    } else if(this.videoEmbed?.indexOf('canva.com') >= 0 && this.videoEmbed?.indexOf('/watch?embed') < 0) {
      url = this.videoEmbed?.replace('/watch', '/watch?embed');
    } else {
      url = this.videoEmbed;
    }

    let updated_url = url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
    this.updatedVideo = updated_url;
    this.updatedCode = url;
  }

  redirectToCTALink() {
    if(this.CTALink) {
      location.href = this.CTALink;
    }
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}